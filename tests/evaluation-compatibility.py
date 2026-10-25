"""Result compatibility and observational work counters are independent gates."""
import copy
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import evaluation_compatibility as compatibility


class EvaluationCompatibility(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.patch = patch.object(compatibility, 'ROOT', self.root)
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.old = {'pairs': [{'left':'a','right':'b','evidence':'byte-identical','distance':0}],
                    'groups':[{'members':['a','b']}], 'stats':{'comparisons':5}, 'timing':{'elapsedMs':10}}
        raw = json.dumps(self.old).encode()
        (self.root/'report.json').write_bytes(raw)
        directory = self.root/'research/photos-v1/freeze'
        directory.mkdir(parents=True)
        (directory/'0.4.0.json').write_text(json.dumps({'reports':{'test':{'path':'report.json','sha256':hashlib.sha256(raw).hexdigest()}}}))

    def test_stats_and_timing_changes_are_recorded_without_failing(self):
        current = copy.deepcopy(self.old)
        current['stats']['comparisons'] = 3
        current['timing']['elapsedMs'] = 100
        comparison = compatibility.compare_baseline(current,'test')
        self.assertTrue(comparison['passed'])
        self.assertTrue(comparison['detectionUnchanged'])
        self.assertEqual(comparison['workComparison'][0]['delta'],-2)
        self.assertEqual(comparison['timingComparison']['after'],current['timing'])

    def test_changed_evidence_distance_pair_or_group_requires_explicit_reason(self):
        variants = []
        for field,value in [('evidence','pixel-identical'),('distance',1)]:
            current=copy.deepcopy(self.old)
            current['pairs'][0][field]=value
            variants.append(current)
        current=copy.deepcopy(self.old);current['groups']=[];variants.append(current)
        current=copy.deepcopy(self.old);current['pairs']=[];variants.append(current)
        for current in variants:
            row=compatibility.compare_baseline(current,'test')
            self.assertFalse(row['passed'])
            self.assertTrue(row['detectionDifferences'])
            with self.assertRaises(ValueError): compatibility.enforce_baselines({'test':row})
            allowed=compatibility.compare_baseline(current,'test',reason='documented test change')
            self.assertTrue(allowed['passed'])
            self.assertFalse(allowed['detectionUnchanged'])
            compatibility.enforce_baselines({'test':allowed})

    def test_whitespace_reason_does_not_authorize_a_change(self):
        current=copy.deepcopy(self.old);current['pairs']=[]
        self.assertFalse(compatibility.compare_baseline(current,'test',reason='  ')['passed'])

    def test_historical_baseline_tampering_is_always_fatal(self):
        (self.root/'report.json').write_text('{}')
        with self.assertRaisesRegex(ValueError,'Historical baseline'):
            compatibility.compare_baseline(self.old,'test',reason='does not bypass checksum')

    def archive_baseline(self):
        archive = self.root/'reports/history/report.json'
        archive.parent.mkdir(parents=True)
        (self.root/'report.json').rename(archive)
        registry = self.root/'research/photos-v1/freeze/archive-locations.json'
        registry.write_text(json.dumps({'0.4.0': {'report.json': 'reports/history/report.json'}}))
        return archive

    def test_explicit_archive_survives_current_report_replacement(self):
        self.archive_baseline()
        row = compatibility.compare_baseline(self.old, 'test')
        self.assertTrue(row['passed'])
        self.assertEqual(row['baselinePath'], 'reports/history/report.json')
        (self.root/'report.json').write_text('{}')
        self.assertTrue(compatibility.compare_baseline(self.old, 'test')['passed'])

    def test_archived_baseline_still_requires_original_frozen_checksum(self):
        self.archive_baseline().write_text('{}')
        with self.assertRaisesRegex(ValueError, 'Historical baseline'):
            compatibility.compare_baseline(self.old, 'test', reason='cannot bypass archive checksum')


if __name__=='__main__': unittest.main()
