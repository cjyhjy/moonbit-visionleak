"""Known-source product regression, never a new-source or human validation."""
import argparse
import csv
import hashlib
import importlib.util
import json
from pathlib import Path
import platform
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return json.loads(path.read_text())


def replay_reference(experiment, protocol, dataset, records, historical):
    """Unchanged frozen algorithm on this platform; never a new holdout."""
    import cv2
    assert cv2.__version__ == '4.13.0'
    assert experiment.sha(Path(experiment.__file__)) == historical['implementationSha256']
    assert experiment.sha(ROOT / 'research/followup-quality/protocol.json') == historical['protocolSha256']
    cv2.setNumThreads(1)
    profile = protocol['profiles']['orb800']
    detector = cv2.ORB_create(nfeatures=profile['features'], scaleFactor=1.2, nlevels=8,
                             edgeThreshold=15, patchSize=31, fastThreshold=20, WTA_K=2)
    features = {}
    for row in records:
        gray = experiment.grayscale(experiment.Image.open(dataset / 'data' / row['id']))
        points, descriptors = detector.detectAndCompute(gray, None)
        features[row['id']] = points, descriptors, gray.shape
    pairs = {}
    for old in historical['pairs']:
        key = old['original'], old['query']
        seed = int(hashlib.sha256(('|'.join(key)).encode()).hexdigest()[:8], 16)
        hit, witness, _ = experiment.orb_match(features[key[0]], features[key[1]], profile, seed)
        pairs[key] = {**old, 'hit': bool(hit), 'witness': witness}
    result = {'scope': 'Known-data replay of unchanged frozen algorithm on the current platform; not a new-source experiment.',
              'platform': platform.platform(), 'opencv': cv2.__version__,
              'opencvBuildDigest': hashlib.sha256(cv2.getBuildInformation().encode()).hexdigest(),
              'pairs': list(pairs.values())}
    (dataset / 'same-platform-reference.json').write_text(json.dumps(result, indent=2) + '\n')
    return pairs


def main(out):
    out = out.resolve()
    out.mkdir(parents=True, exist_ok=False)
    spec = importlib.util.spec_from_file_location('frozen_crop_preparation', ROOT / 'research/followup-quality/experiment.py')
    experiment = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(experiment)
    protocol = read(ROOT / 'research/followup-quality/protocol.json')
    bound_files = ['dist/visionleak.js', 'tools/orb-worker.py', 'tools/orb.mjs', 'tools/orb-cache.mjs', 'tools/orb-cache-lock.mjs', 'tools/orb-cache-lock.py', 'tools/audit-cli.mjs', 'tools/cli.mjs', 'tools/orb-profile.json', 'tools/decode.mjs', 'tools/validate-orb-integration.py', 'research/followup-quality/experiment.py', 'research/followup-quality/protocol.json']
    bindings = {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in bound_files}
    results = []
    for partition, manifest in [('development', 'development-sources.json'), ('holdout', 'holdout/sources.json')]:
        dataset = out / partition
        experiment.prepare(ROOT / 'research/followup-quality' / manifest, dataset, protocol)
        records = read(dataset / 'dataset.json')['records']
        gallery = [r for r in records if r['role'] == 'gallery']
        queries = [r for r in records if r['role'] == 'query']
        reference = read(ROOT / f'reports/followup-quality/{partition}/orb800.json')
        expected = {(p['original'], p['query']): p for p in reference['pairs']}
        runtime_reference = replay_reference(experiment, protocol, dataset, records, reference)
        products = {}
        batches = []
        # Fresh bounded invocations; every query is still compared to ALL originals.
        # No cross-batch query/query relations belong to this source-labelled study.
        for start in range(0, len(queries), 24):
            rows = gallery + queries[start:start + 24]
            listing = dataset / f'batch-{start}.csv'
            with listing.open('w', newline='') as handle:
                writer = csv.writer(handle); writer.writerow(['path', 'split'])
                writer.writerows((r['id'], 'train' if r['role'] == 'gallery' else 'test') for r in rows)
            target = dataset / f'batch-{start}'
            command = ['node', 'tools/cli.mjs', 'audit', '--root', str(dataset / 'data'), '--manifest', str(listing),
                       '--out', str(target), '--threshold', '0', '--include-orb', '--max-orb-comparisons', '2000000000',
                       '--max-orb-candidates', '1000', '--max-orb-milliseconds', '120000']
            began = time.monotonic()
            run = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=150)
            (dataset / f'batch-{start}.log').write_text(run.stdout + run.stderr)
            assert run.returncode == 0, run.stdout + run.stderr
            report = read(target / 'report.json')
            assert report['complete'] and report['phases']['orb']['complete']
            images = {row['id']: row for row in report['images']}
            for row in rows:
                gray = experiment.grayscale(experiment.Image.open(dataset / 'data' / row['id']))
                assert images[row['id']]['orb']['grayDigest'] == hashlib.sha256(gray.tobytes()).hexdigest()
            for pair in report['pairs']:
                original, query = (pair['left'], pair['right']) if pair['left'].startswith('train/') else (pair['right'], pair['left'])
                products[original, query] = pair
            batches.append({'queryStart': start, 'queries': len(rows) - len(gallery), 'images': len(rows),
                            'auditId': report['auditId'], 'complete': report['complete'],
                            'orb': report['phases']['orb'], 'timing': report['timing'],
                            'processWallSeconds': time.monotonic() - began})
        preserved = 0
        same_direction_witnesses = 0
        platform_differences = []
        tp = fp = additional = 0
        for key, old in expected.items():
            current = runtime_reference[key]
            pair = products.get(key)
            if old['hit']:
                assert pair is not None, ('lost frozen ORB hit', partition, key)
                preserved += 1
            if current['hit']:
                assert pair is not None, ('lost same-platform reference hit', partition, key)
            if current['hit'] != old['hit'] or (current['hit'] and any(current['witness'][name] != old['witness'][name]
                   for name in ['matches', 'inliers', 'queryToOriginal'])):
                platform_differences.append({'original': key[0], 'query': key[1],
                    'historicalHit': old['hit'], 'currentHit': current['hit'],
                    'historicalWitness': old['witness'], 'currentWitness': current['witness']})
            if pair:
                tp += int(old['positive']); fp += int(not old['positive'])
                additional += int(not old['hit'])
            if pair and pair['evidence'] == 'orb-candidate' and pair['matchOrb']['original'] == old['original']:
                assert current['hit'], ('product-only same-direction hit', partition, key)
                witness = pair['matchOrb']
                for name in ['matches', 'inliers', 'contained']:
                    assert witness[name] == current['witness'][name], (key, name)
                # Keep exact count and tight matrix parity against the independent
                # frozen algorithm; record cross-platform historical drift separately.
                for a, b in zip(sum(witness['queryToOriginal'], []), sum(current['witness']['queryToOriginal'], [])):
                    assert abs(a - b) < 0.00001, (key, 'affine drift')
                same_direction_witnesses += 1
        assert not (set(products) - set(expected))
        assert fp == 0, ('known source-label negative regression', partition, fp)
        (dataset / 'cross-platform-differences.json').write_text(json.dumps(platform_differences, indent=2) + '\n')
        results.append({'partition': partition, 'sourceFiles': len(gallery), 'queries': len(queries),
                        'allOriginalQueryRelations': len(expected), 'frozenOrbHitsPreserved': preserved,
                        'matchingDirectionWitnessesChecked': same_direction_witnesses,
                        'historicalPlatformDifferences': len(platform_differences),
                        'productUnionTp': tp, 'productUnionFp': fp, 'productUnionFn': len(queries) - tp,
                        'additionalPairsOverFrozenOrb': additional, 'batches': batches})
    assert bindings == {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in bound_files}, 'Implementation changed during regression'
    result = {'status': 'passed', 'implementationDigests': bindings, 'schemaVersion': 'visionleak-orb-integration-v1',
              'scope': 'Known-source controlled regression on previously used development/holdout files. Each 24-query invocation includes every gallery original. Product union includes earlier Core evidence. This is not a fresh holdout, natural contamination or human review study. Times include host decoding/import/worker; RSS is sampled worker memory, not aggregate peak.',
              'partitions': results}
    (out / 'summary.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--out', type=Path, required=True)
    main(parser.parse_args().out)
