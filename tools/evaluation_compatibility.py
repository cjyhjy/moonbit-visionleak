"""Versioned behavioral regression, independent of source/work-count changes."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def compare_baseline(report, key, version='0.4.0', reason=None):
    freeze_path = ROOT / 'research/photos-v1/freeze' / (version + '.json')
    freeze_bytes = freeze_path.read_bytes()
    freeze = json.loads(freeze_bytes)
    entry = freeze['reports'][key]
    # Current reports are replaceable. Resolve historical bytes through an
    # explicit registry, while retaining the original freeze's checksum gate.
    registry = freeze_path.parent / 'archive-locations.json'
    locations = json.loads(registry.read_bytes()) if registry.exists() else {}
    baseline_path = locations.get(version, {}).get(entry['path'], entry['path'])
    raw = (ROOT / baseline_path).read_bytes()
    if hashlib.sha256(raw).hexdigest() != entry['sha256']:
        raise ValueError('Historical baseline report changed: ' + entry['path'])
    baseline = json.loads(raw)
    differences = []
    for field in ['pairs', 'groups']:
        old, new = baseline[field], report[field]
        if old != new:
            differences.append({'field': field, 'before': old, 'after': new})
    work = []
    for field in sorted(set(baseline.get('stats', {})) | set(report.get('stats', {}))):
        before, after = baseline.get('stats', {}).get(field), report.get('stats', {}).get(field)
        work.append({'field': field, 'before': before, 'after': after,
                     'delta': after-before if type(before) is int and type(after) is int else None})
    return {'version': version, 'key': key, 'baselinePath': baseline_path,
            'baselineReportSha256': entry['sha256'],
            'freezeSha256': hashlib.sha256(freeze_bytes).hexdigest(),
            'detectionUnchanged': not differences, 'detectionDifferences': differences,
            'allowedChangeReason': reason, 'passed': not differences or bool(reason and reason.strip()),
            'workComparison': work,
            'timingComparison': {'before': baseline.get('timing'), 'after': report.get('timing'),
                                 'note': 'Observational; never a regression failure condition.'}}


def enforce_baselines(comparisons):
    failed = [key for key, value in comparisons.items() if not value['passed']]
    if failed:
        raise ValueError('Detection changed; see saved baselineComparison: ' + ', '.join(failed))
