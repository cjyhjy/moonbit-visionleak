#!/usr/bin/env python3
"""Bind current candidate evidence without waiving the browser/package gate.

Run from any directory. A pending browser receipt yields pending acceptance,
which tools/package.py rejects. This does not publish or build an archive.
"""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'tools'))
spec = importlib.util.spec_from_file_location('candidate_package', ROOT / 'tools/package.py')
package = importlib.util.module_from_spec(spec)
spec.loader.exec_module(package)


def read(path):
    return json.loads(path.read_text())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    source = subprocess.check_output([
        'node', '--input-type=module', '-e',
        "import{sourceDigest}from'./tools/source-digest.mjs';console.log(sourceDigest(process.cwd()))"
    ], cwd=ROOT, text=True).strip()
    artifact = digest(ROOT / 'dist/visionleak.js')
    cis = [HERE / 'ci/verification.json', HERE / 'linux/ci/verification.json']
    for path in cis:
        ci = read(path)
        assert ci['status'] == 'passed' and ci['sourceDigest'] == source, path
        assert len(ci['checks']) == 30 and all(c['status'] == 'passed' for c in ci['checks']), path
        assert ci['compiledArtifact']['sha256'] == artifact, path
    collection = read(HERE / 'linux/collection.json')
    assert collection['sourceDigest'] == source
    assert collection['containerState']['ExitCode'] == 0
    assert not collection['containerState']['OOMKilled']
    assert collection['networkMode'] == 'none' and collection['mounts'] == []
    assert read(HERE / 'linux/doctor.json')['ok'] is True
    browser = read(HERE / 'browser.json')
    assert browser['coreArtifactSha256'] == artifact
    for name, expected in browser['sourceHashes'].items():
        assert digest(ROOT / name) == expected, name
    # Native-file completion is mandatory for this candidate's release gate.
    browser_passed = browser['status'] == 'passed' and browser['checks']['nativeFileTransferPreviewApplyUndo'] is True
    evidence = package.development_evidence(ROOT)
    evidence += package.evidence_files(ROOT, 'reports/integration-0.9.0', ('walkthrough', 'ui-screenshots'))
    evidence += [ROOT / 'README.md', ROOT / 'CHANGELOG.md', ROOT / 'docs/plan-0.9.0.md', ROOT / 'docs/changes-0.9.0.md']
    excluded = {HERE / 'acceptance.json', HERE / 'source-copy-parity.json'}
    evidence = sorted(set(evidence) - excluded)
    receipt = {
        'schemaVersion': 'visionleak-followup-acceptance-v1',
        'version': '0.9.0',
        'status': 'passed' if browser_passed else 'pending-browser-native-file',
        'verifiedAt': datetime.now(timezone.utc).isoformat(),
        'sourceDigest': source,
        'compiledArtifact': {'path': 'dist/visionleak.js', 'sha256': artifact},
        'ci': {'path': 'reports/integration-0.9.0/ci/verification.json', 'checks': 30},
        'linux': {'path': 'reports/integration-0.9.0/linux/ci/verification.json', 'checks': 30, 'scope': 'x86 userland under isolated ARM64/Rosetta VM; not native-x86 performance'},
        'browser': browser,
        'evidenceDigests': {p.relative_to(ROOT).as_posix(): digest(p) for p in evidence},
        'publication': {'performed': False, 'approvalReceivedFor090': False},
        'scope': 'Local pre-package acceptance. Final ZIP extraction/rebuild and any publication need separate receipts. Known-data accuracy/capacity limits retained in README.md.'
    }
    (HERE / 'acceptance.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status': receipt['status'], 'sourceDigest': source, 'evidenceFiles': len(evidence)}))


if __name__ == '__main__':
    main()
