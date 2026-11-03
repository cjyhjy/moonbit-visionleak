"""Versioned behavioral regression, independent of source/work-count changes."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def compare_transform_truth(current, baseline):
    """Pin decoded pixels, transforms and identity labels across encoders.

    PNG compression bytes can differ across platform zlib implementations.
    Byte-identity *relations* must still match, as must every decoded pixel.
    Source files have a separate byte checksum gate before transformation.
    """
    if set(current) != set(baseline) or current['pairs'] != baseline['pairs']:
        raise ValueError('Known transform fields or pair identity labels changed')
    if len(current['images']) != len(baseline['images']):
        raise ValueError('Known transform image count changed')
    encoding_changes = []
    for actual, expected in zip(current['images'], baseline['images']):
        for field in sorted(set(actual) | set(expected)):
            if field == 'byteDigest':
                if actual[field] != expected[field]: encoding_changes.append(actual['id'])
            elif actual.get(field) != expected.get(field):
                raise ValueError(f"Known transform changed: {actual.get('id')} {field}: {expected.get(field)} -> {actual.get(field)}")
    for field in set(current) - {'images', 'pairs'}:
        if current[field] != baseline[field]: raise ValueError('Known transform metadata changed: ' + field)
    return {'decodedPixelsAndLabelsUnchanged': True,
            'encodedByteChanges': encoding_changes,
            'scope': 'Generated file encodings may vary; source bytes, decoded pixels, transform metadata and all pair identity labels remain fixed.'}


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
    order_changed = False
    for field in ['pairs', 'groups']:
        old, new = baseline[field], report[field]
        if field == 'pairs' and report.get('auditStrategy') == 'exact-first-v1':
            order_changed = old != new
            # Permit only the declared stable partition into exact/global/local
            # phases. Keep order and every witness field inside each phase.
            phase = lambda p: 0 if p['evidence'] in ('byte-identical','pixel-identical') else 1 if p['evidence']=='perceptual-candidate' else 2
            old = sorted(old, key=phase)
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
            'pairOrderChanged': order_changed, 'orderingContract': report.get('auditStrategy'),
            'detectionUnchanged': not differences, 'detectionDifferences': differences,
            'allowedChangeReason': reason, 'passed': not differences or bool(reason and reason.strip()),
            'workComparison': work,
            'timingComparison': {'before': baseline.get('timing'), 'after': report.get('timing'),
                                 'note': 'Observational; never a regression failure condition.'}}


def enforce_baselines(comparisons):
    failed = [key for key, value in comparisons.items() if not value['passed']]
    if failed:
        raise ValueError('Detection changed; see saved baselineComparison: ' + ', '.join(failed))
