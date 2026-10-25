#!/usr/bin/env python3
"""Exercise release metadata and failed acceptance without touching real reports."""
import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
import zipfile
from unittest.mock import patch


sys.dont_write_bytecode = True
PROJECT = Path(__file__).resolve().parents[1]


def load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, PROJECT / 'tools' / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


METADATA = load_module('visionleak_release_metadata_test_target', 'release_metadata.py')
with patch.dict(sys.modules, {'release_metadata': METADATA}):
    ACCEPT = load_module('visionleak_accept_release_test_target', 'accept-release.py')


class ReleaseContractTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='visionleak-release-contract-', dir='/tmp')
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)

    def manifests(self, version='0.2.0', *, lock_version=None, root_version=None, moon_version=None):
        (self.root / 'package.json').write_text(json.dumps({'version': version}))
        (self.root / 'package-lock.json').write_text(json.dumps({
            'version': version if lock_version is None else lock_version,
            'packages': {'': {'version': version if root_version is None else root_version}},
        }))
        moon = version if moon_version is None else moon_version
        (self.root / 'moon.mod').write_text(f'name = "visionleak/core"\nversion = {json.dumps(moon)}\n')

    def test_release_version_agrees_across_all_manifests(self):
        for version in ('0.2.0', '12.34.56', '1.2.3-rc.1'):
            with self.subTest(version=version):
                self.manifests(version)
                self.assertEqual(METADATA.release_version(self.root), version)

    def test_release_version_rejects_each_independent_manifest_mismatch(self):
        for field in ('lock_version', 'root_version', 'moon_version'):
            with self.subTest(field=field):
                self.manifests(**{field: '0.1.0'})
                with self.assertRaisesRegex(ValueError, 'versions disagree'):
                    METADATA.release_version(self.root)

    def test_release_version_rejects_missing_lock_root_or_moon_version(self):
        self.manifests()
        (self.root / 'package-lock.json').write_text(json.dumps({'version': '0.2.0', 'packages': {}}))
        with self.assertRaisesRegex(ValueError, 'versions disagree'):
            METADATA.release_version(self.root)
        self.manifests()
        (self.root / 'moon.mod').write_text('name = "visionleak/core"\n')
        with self.assertRaisesRegex(ValueError, 'versions disagree'):
            METADATA.release_version(self.root)

    def test_release_version_rejects_paths_control_characters_and_non_ascii_digits(self):
        invalid = (
            None, 2, '', '../0.2.0', '0.2.0/../../outside', r'0.2.0\outside',
            '0.2.0\n', '0.2.0\x00', '0.2.0;echo', '0.2.0-$(echo)',
            '0.2.0-release candidate', '\u0661.2.3', '\uff11.2.3',
        )
        for version in invalid:
            with self.subTest(version=repr(version)):
                self.manifests(version)
                with self.assertRaisesRegex(ValueError, 'invalid release version'):
                    METADATA.release_version(self.root)

    def test_checksums_preserve_multiple_releases_and_allow_absent_file(self):
        checksums = self.root / 'SHA256SUMS'
        self.assertEqual(METADATA.read_checksums(checksums), {})
        checksums.write_text(f'{"a" * 64}  visionleak-0.1.0.zip\n{"b" * 64}  visionleak-0.2.0.zip\n')
        self.assertEqual(METADATA.read_checksums(checksums), {
            'visionleak-0.1.0.zip': 'a' * 64,
            'visionleak-0.2.0.zip': 'b' * 64,
        })

    def test_checksums_reject_duplicate_names_even_with_identical_digests(self):
        checksums = self.root / 'SHA256SUMS'
        for second_digest in ('a' * 64, 'b' * 64):
            with self.subTest(second_digest=second_digest):
                checksums.write_text(f'{"a" * 64}  visionleak-0.2.0.zip\n{second_digest}  visionleak-0.2.0.zip\n')
                with self.assertRaisesRegex(ValueError, 'Invalid or duplicate'):
                    METADATA.read_checksums(checksums)

    def test_checksums_reject_malformed_or_unsafe_entries(self):
        checksums = self.root / 'SHA256SUMS'
        invalid = (
            f'{"a" * 63}  visionleak-0.2.0.zip',
            f'{"g" * 64}  visionleak-0.2.0.zip',
            f'{"a" * 64} visionleak-0.2.0.zip',
            f'{"a" * 64}  ../visionleak-0.2.0.zip',
            f'{"a" * 64}  visionleak-0.2.0/other.zip',
            f'{"a" * 64}  visionleak-0.2.0.zip trailing',
        )
        for line in invalid:
            with self.subTest(line=line):
                checksums.write_text(line + '\n')
                with self.assertRaisesRegex(ValueError, 'Invalid or duplicate'):
                    METADATA.read_checksums(checksums)

    def test_missing_current_archive_replaces_old_passed_attestation_with_failure(self):
        self.manifests('0.2.0')
        report = self.root / 'reports' / 'release-verification.json'
        report.parent.mkdir()
        report.write_text(json.dumps({
            'status': 'passed', 'archive': 'release/visionleak-0.1.0.zip',
            'archiveSha256': 'a' * 64, 'checks': [{'name': 'old-check', 'status': 'passed'}],
        }))
        release = self.root / 'release'
        release.mkdir()
        old_archive = release / 'visionleak-0.1.0.zip'
        old_archive.write_bytes(b'previous immutable archive')
        checksums = release / 'SHA256SUMS'
        checksums.write_text(f'{"a" * 64}  {old_archive.name}\n')
        old_checksum_text = checksums.read_text()
        output = io.StringIO()
        with patch.object(ACCEPT, 'ROOT', self.root), patch.object(ACCEPT, 'REPORT', report), \
                patch.object(ACCEPT.subprocess, 'run') as run, contextlib.redirect_stdout(output):
            with self.assertRaises(FileNotFoundError):
                ACCEPT.main()
            run.assert_not_called()
        actual = json.loads(report.read_text())
        self.assertEqual(actual['status'], 'failed')
        self.assertEqual(actual['archive'], 'release/visionleak-0.2.0.zip')
        self.assertIsNone(actual['archiveSha256'])
        self.assertEqual(actual['checks'], [])
        self.assertIn('visionleak-0.2.0.zip', actual['error'])
        self.assertIn('startedAt', actual)
        self.assertIn('finishedAt', actual)
        self.assertEqual(json.loads(output.getvalue())['status'], 'failed')
        self.assertFalse((self.root / 'reports' / 'clean-room').exists())
        self.assertEqual(old_archive.read_bytes(), b'previous immutable archive')
        self.assertEqual(checksums.read_text(), old_checksum_text)

    def versioned_archive(self, *, manifest_version='0.2.0', package_version='0.2.0', schema='visionleak-package-v1'):
        self.manifests('0.2.0')
        (self.root / 'reports').mkdir(exist_ok=True)
        release = self.root / 'release'
        release.mkdir(exist_ok=True)
        payload = {
            'package.json': json.dumps({'version': package_version}).encode(),
            'package-lock.json': json.dumps({
                'version': package_version, 'packages': {'': {'version': package_version}},
            }).encode(),
            'moon.mod': f'version = "{package_version}"\n'.encode(),
        }
        manifest = {
            'schemaVersion': schema, 'version': manifest_version, 'sourceDigest': '0' * 64,
            'files': [
                {'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                for name, data in payload.items()
            ],
        }
        archive = release / 'visionleak-0.2.0.zip'
        with zipfile.ZipFile(archive, 'w') as output:
            for name, data in payload.items():
                output.writestr('visionleak/' + name, data)
            output.writestr('visionleak/PACKAGE-MANIFEST.json', json.dumps(manifest))
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        (release / 'SHA256SUMS').write_text(f'{digest}  {archive.name}\n')

    def assert_acceptance_rejects_before_subprocess(self, message):
        report = self.root / 'reports' / 'release-verification.json'
        with patch.object(ACCEPT, 'ROOT', self.root), patch.object(ACCEPT, 'REPORT', report), \
                patch.object(ACCEPT.subprocess, 'run') as run, contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaisesRegex(ValueError, message):
                ACCEPT.main()
            run.assert_not_called()
        actual = json.loads(report.read_text())
        self.assertEqual(actual['status'], 'failed')
        self.assertRegex(actual['error'], message)
        self.assertIn('finishedAt', actual)

    def test_archive_manifest_cannot_mislabel_an_old_version_or_unknown_schema(self):
        for overrides in ({'manifest_version': '0.1.0'}, {'schema': 'unknown-package-schema'}):
            with self.subTest(overrides=overrides):
                self.versioned_archive(**overrides)
                self.assert_acceptance_rejects_before_subprocess('Archive manifest version')
                self.assertFalse((self.root / 'reports' / 'clean-room').exists())

    def test_archive_payload_version_must_match_the_selected_release(self):
        self.versioned_archive(manifest_version='0.2.0', package_version='0.1.0')
        self.assert_acceptance_rejects_before_subprocess('Extracted manifest versions')


if __name__ == '__main__':
    unittest.main(verbosity=2)
