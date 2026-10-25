#!/usr/bin/env python3
"""Compare opt-in mirrored CLI evidence against independent pixel and pair oracles."""
import argparse
import base64
import hashlib
import itertools
import json
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from evaluate import canonical, pair_key, run_bridge, score

ROOT = Path(__file__).resolve().parents[1]
LABELS = ['original', 'mirror-left', 'mirror-right', 'mirror-both']

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', type=Path, default=ROOT/'reports/mirror-evaluation.json')
    args = parser.parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    dataset = ROOT/'fixtures/benchmark'
    truth_bytes = (dataset/'ground-truth.json').read_bytes()
    truth = json.loads(truth_bytes)
    for record in truth['images']:
        assert hashlib.sha256((dataset/record['path']).read_bytes()).hexdigest() == record['byteDigest']
    reports = {}
    with tempfile.TemporaryDirectory(prefix='mirror-evaluation-', dir=args.out.parent) as tmp:
        for mode in ['default', 'mirrors']:
            command = ['node', 'tools/cli.mjs', 'audit', '--root', str(dataset), '--out', str(Path(tmp)/mode)]
            if mode == 'mirrors': command.append('--include-mirrors')
            result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=300)
            assert result.returncode == 0, result.stderr
            reports[mode] = json.loads((Path(tmp)/mode/'report.json').read_text())
            assert reports[mode]['complete'] and not reports[mode]['errors']
    expected_ids = {i['id'] for i in truth['images']}
    for report in reports.values():
        assert {i['id'] for i in report['images']} == expected_ids
        assert len(report['images']) == len(expected_ids)
    mirror = reports['mirrors']
    actual = run_bridge({'mode':'files','root':str(dataset),'paths':[i['path'] for i in truth['images']], 'includeMirrors':True})
    assert len(actual) == len(expected_ids) and {i['path'] for i in actual} == {i['path'] for i in truth['images']}
    checks = []
    for item in actual:
        w, h = item['width'], item['height']
        rgba = base64.b64decode(item['rgbaBase64'])
        # Reflect full RGBA pixels BEFORE independent canonical sampling. Merely
        # reversing/complementing dHash is wrong for ties and uneven partitions.
        reflected = b''.join(rgba[(y*w+x)*4:(y*w+x+1)*4] for y in range(h) for x in reversed(range(w)))
        expected, _, _ = canonical(w, h, reflected)
        passed = item['fingerprint']['dhashMirror'] == expected['dhash']
        assert passed, item['path']
        checks.append({'path':item['path'], 'expectedMirrorHash':expected['dhash'], 'passed':passed})
    expected = {}
    d = lambda a,b: sum(x!=y for x,y in zip(a,b,strict=True))
    for a,b in itertools.combinations(mirror['images'],2):
        if a['split']==b['split']: continue
        distances = [d(a['dhash'],b['dhash']),d(a['dhashMirror'],b['dhash']),d(a['dhash'],b['dhashMirror']),d(a['dhashMirror'],b['dhashMirror'])]
        evidence = 'byte-identical' if a['byteDigest']==b['byteDigest'] else 'pixel-identical' if a['pixelDigest']==b['pixelDigest'] else 'perceptual-candidate'
        value = min(distances) if evidence=='perceptual-candidate' else distances[0]
        transform = LABELS[distances.index(value)] if evidence=='perceptual-candidate' else 'original'
        if evidence!='perceptual-candidate' or value<=mirror['options']['threshold']:
            expected[pair_key(a['id'],b['id'])] = (evidence,value,transform)
    observed = {}
    for pair in mirror['pairs']:
        key=pair_key(pair['left'],pair['right'])
        assert key not in observed
        observed[key] = (pair['evidence'],pair['distance'],pair.get('matchTransform','original'))
    assert observed == expected
    old_pairs={pair_key(p['left'],p['right']) for p in reports['default']['pairs']}
    added=[p for p in mirror['pairs'] if pair_key(p['left'],p['right']) not in old_pairs]
    truth_by_key={pair_key(p['left'],p['right']):p['relation'] for p in truth['pairs']}
    result={'schemaVersion':'visionleak-mirror-evaluation-v1','status':'passed','generatedAt':datetime.now(timezone.utc).isoformat(),
            'scope':'59 deterministic synthetic PNG/JPEG files, horizontal-reflection candidates only; not natural dataset contamination or a tuned universal threshold.',
            'threshold':6, 'groundTruthSha256':hashlib.sha256(truth_bytes).hexdigest(),
            'engineSha256':hashlib.sha256((ROOT/'dist/visionleak.js').read_bytes()).hexdigest(),
            'default':{'auditId':reports['default']['auditId'],'scores':score(truth,reports['default']['pairs']), 'stats':reports['default']['stats']},
            'mirrors':{'auditId':mirror['auditId'],'scores':score(truth,mirror['pairs']),'stats':mirror['stats']},
            'oracle':{'passed':len(checks),'total':len(checks),'checks':checks,'method':'ImageHash on independently reflected full RGBA and canonical grid'},
            'pairOracle':{'passed':True,'pairs':len(observed),'comparison':'Independent exhaustive four-distance minimum, exact priority, transform labels and pair uniqueness'},
            'addedPairs':[dict(p,truth=truth_by_key[pair_key(p['left'],p['right'])]) for p in added]}
    args.out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    args.out.with_name(args.out.stem+'-audit.json').write_text(json.dumps(mirror,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({key:result[key]['scores']['nearOnly'] for key in ['default','mirrors']},indent=2))

if __name__=='__main__': main()
