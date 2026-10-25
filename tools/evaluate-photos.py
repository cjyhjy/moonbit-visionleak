#!/usr/bin/env python3
"""Measure actual CLI behavior on a frozen, licensed natural-photo benchmark."""
import argparse
import base64
from collections import defaultdict
import hashlib
import itertools
import json
from pathlib import Path
import platform
import statistics
from PIL import Image, ImageOps
import subprocess
import tempfile
import time

from evaluate import canonical, pair_key, run_bridge, score
from evaluation_compatibility import compare_baseline, enforce_baselines

ROOT = Path(__file__).resolve().parents[1]
LABELS = ['original', 'mirror-left', 'mirror-right', 'mirror-both']


def exhaustive(report):
    expected = {}
    distance = lambda a,b:sum(x != y for x,y in zip(a,b,strict=True))
    mirrored = report['options']['includeMirrors']
    for a,b in itertools.combinations(report['images'], 2):
        if a['split'] == b['split']:
            continue
        ds = [distance(a['dhash'],b['dhash'])]
        if mirrored:
            ds += [distance(a['dhashMirror'],b['dhash']),distance(a['dhash'],b['dhashMirror']),distance(a['dhashMirror'],b['dhashMirror'])]
        evidence = 'byte-identical' if a['byteDigest'] == b['byteDigest'] else 'pixel-identical' if a['pixelDigest'] == b['pixelDigest'] else 'perceptual-candidate'
        oriented = report['options'].get('includeRotations',False)
        combinations = []
        if oriented:
            def variants(item):
                values=[(item['dhash'],'original')]
                if mirrored: values.append((item['dhashMirror'],'mirror'))
                for i,angle in enumerate([90,180,270]):
                    values.append((item['dhashRotations'][i],f'rotate{angle}'))
                    if mirrored: values.append((item['dhashMirrorRotations'][i],f'rotate{angle}-mirror'))
                return values
            combinations=[(distance(ah,bh),av+'/'+bv) for bh,bv in variants(b) for ah,av in variants(a)]
            ds=[v[0] for v in combinations]
        d = min(ds) if evidence == 'perceptual-candidate' else ds[0]
        transform = (combinations[ds.index(d)][1] if oriented else LABELS[ds.index(d)]) if evidence == 'perceptual-candidate' else 'original'
        if evidence != 'perceptual-candidate' or d <= report['options']['threshold']:
            expected[pair_key(a['id'],b['id'])] = (evidence,d,transform)
    return expected


def validate_pairs(report):
    actual = {pair_key(p['left'],p['right']):(p['evidence'],p['distance'],p.get('matchOrientation',p.get('matchTransform','original'))) for p in report['pairs']}
    assert len(actual) == len(report['pairs']), 'Duplicate emitted pair'
    assert actual == exhaustive(report), 'Index differs from exhaustive Hamming reference'


def describe_pairs(keys, records, actual):
    details = []
    for key in keys:
        left, right = (records[i] for i in key)
        details.append({'left':key[0], 'right':key[1], 'sources':[left['sourceId'],right['sourceId']],
                        'transforms':[left['transform'],right['transform']], 'prediction':actual.get(tuple(key))})
    return details


def analyze(truth, report):
    scores = score(truth, report['pairs'])
    scores.pop('nearCommonTransforms',None)
    scores.pop('nearChallengeTransforms',None)
    records = {i['id']:i for i in truth['images']}
    actual = {pair_key(p['left'],p['right']):p for p in report['pairs']}
    anchors = defaultdict(lambda:{'detected':0, 'total':0, 'missedSources':[]})
    for image in truth['images']:
        if image['transform'] == 'original':
            continue
        anchor = next(i for i in truth['images'] if i['sourceId']==image['sourceId'] and i['transform']=='original')
        row = anchors[image['transform']]
        row['total'] += 1
        if pair_key(anchor['id'],image['id']) in actual:
            row['detected'] += 1
        else:
            row['missedSources'].append(image['sourceId'])
    return {'scores':scores, 'anchorRetrieval':dict(anchors),
            'falsePositives':describe_pairs(scores['nearOnly']['falsePositives'],records,actual),
            'falseNegatives':describe_pairs(scores['nearOnly']['falseNegatives'],records,actual),
            'auditId':report['auditId'], 'stats':report['stats'], 'options':report['options']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--partition', choices=['development','holdout'], required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--repeats', type=int, choices=range(1,6), default=3)
    parser.add_argument('--skip-oracle', action='store_true', help='Exploration only; output is not release verification')
    parser.add_argument('--include-orientations', action='store_true')
    parser.add_argument('--replace', action='store_true', help='Replace only a managed current evaluation, never a baseline')
    parser.add_argument('--baseline-version', default='0.4.0', choices=['0.4.0'])
    parser.add_argument('--allow-detection-change', metavar='REASON')
    args = parser.parse_args()
    dataset = ROOT/'fixtures/photos-v1'/args.partition
    truth_bytes = (dataset/'ground-truth.json').read_bytes()
    truth = json.loads(truth_bytes)
    expected = {i['id'] for i in truth['images']}
    assert len(expected) == len(truth['images'])
    for image in truth['images']:
        assert hashlib.sha256((dataset/image['path']).read_bytes()).hexdigest() == image['byteDigest']
    sources = ROOT/'research/photos-v1/sources.json'
    protocol = ROOT/'research/photos-v1/protocol.json'
    assert hashlib.sha256(sources.read_bytes()).hexdigest() == truth['sourcesSha256']
    assert hashlib.sha256(protocol.read_bytes()).hexdigest() == truth['protocolSha256']
    for item in json.loads(sources.read_text())['images']:
        assert hashlib.sha256((ROOT/'research/photos-v1/originals'/item['file']).read_bytes()).hexdigest() == item['sha256']
    if args.out.exists() and args.replace:
        old = json.loads((args.out/'evaluation.json').read_text())
        allowed = {'evaluation.json','default-audit.json','mirrors-audit.json','orientations-audit.json'}
        assert old.get('schemaVersion')=='visionleak-photo-evaluation-v1' and 'baseline' not in args.out.name
        assert all(p.is_file() and not p.is_symlink() and p.name in allowed for p in args.out.iterdir())
        for p in args.out.iterdir(): p.unlink()
    args.out.mkdir(parents=True,exist_ok=args.replace)
    modes = ['default','mirrors'] + (['orientations'] if args.include_orientations else [])
    reports = {}
    timings = defaultdict(list)
    commands = {}
    with tempfile.TemporaryDirectory(prefix='photo-cli-') as temp:
        for repeat in range(args.repeats):
            for mode in (modes if repeat%2 == 0 else list(reversed(modes))):
                output = Path(temp)/f'{mode}-{repeat}'
                command = ['node','tools/cli.mjs','audit','--root',str(dataset),'--out',str(output),'--threshold','6']
                if mode in ['mirrors','orientations']:
                    command.append('--include-mirrors')
                if mode == 'orientations':
                    command.append('--include-rotations')
                start = time.perf_counter()
                result = subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=180)
                timings[mode].append(time.perf_counter()-start)
                assert result.returncode == 0, result.stderr
                report = json.loads((output/'report.json').read_text())
                assert report['complete'] and not report['errors']
                assert len(report['images'])==len(expected) and {i['id'] for i in report['images']}==expected
                validate_pairs(report)
                if mode in reports:
                    assert report['auditId'] == reports[mode]['auditId']
                reports[mode] = report
                commands[mode] = ['node','tools/cli.mjs','audit','--root',f'fixtures/photos-v1/{args.partition}','--out','<fresh-output>','--threshold','6']+(['--include-mirrors'] if mode!='default' else [])+(['--include-rotations'] if mode=='orientations' else [])
    engine=hashlib.sha256((ROOT/'dist/visionleak.js').read_bytes()).hexdigest()
    assert all(r['engine']['artifactDigest']==engine for r in reports.values()), 'Engine changed during evaluation'
    checks = []
    if not args.skip_oracle:
        # Small batches bound the process JSON channel and keep raw RGBA out of reports.
        for offset in range(0,len(truth['images']),5):
            batch=truth['images'][offset:offset+5]
            actual=run_bridge({'mode':'files','root':str(dataset),'paths':[i['path'] for i in batch],'includeMirrors':True,'includeRotations':args.include_orientations})
            assert len(actual)==len(batch) and {i['path'] for i in actual}=={i['path'] for i in batch}
            recorded={i['path']:i for i in reports['orientations' if args.include_orientations else 'mirrors']['images']}
            for item in actual:
                w,h=item['width'],item['height']
                rgba=base64.b64decode(item['rgbaBase64'])
                normal,_,_=canonical(w,h,rgba)
                reflected=b''.join(rgba[(y*w+x)*4:(y*w+x+1)*4] for y in range(h) for x in reversed(range(w)))
                mirror,_,_=canonical(w,h,reflected)
                fp=item['fingerprint']
                assert all(fp[k]==normal[k] for k in normal)
                assert fp['dhashMirror']==mirror['dhash']
                assert all(recorded[item['path']][k]==fp[k] for k in ['pixelDigest','dhash','dhashMirror','contrast'])
                if args.include_orientations:
                    pixels=Image.frombytes('RGBA',(w,h),rgba)
                    for index in range(3):
                        pixels=pixels.transpose(Image.Transpose.ROTATE_270)
                        reference,_,_=canonical(*pixels.size,pixels.tobytes())
                        reflected_reference,_,_=canonical(*pixels.size,ImageOps.mirror(pixels).tobytes())
                        assert fp['dhashRotations'][index]==reference['dhash']
                        assert fp['dhashMirrorRotations'][index]==reflected_reference['dhash']
                    assert recorded[item['path']]['dhashRotations']==fp['dhashRotations']
                    assert recorded[item['path']]['dhashMirrorRotations']==fp['dhashMirrorRotations']
                checks.append({'path':item['path'],'passed':True})
    result={'schemaVersion':'visionleak-photo-evaluation-v1','status':'exploratory' if args.skip_oracle else 'passed',
            'partition':args.partition,'sources':sorted({i['sourceId'] for i in truth['images']}),'images':len(expected),
            'scope':'Controlled transformations of real licensed photographs; not naturally occurring contamination or a representative population estimate.',
            'groundTruthSha256':hashlib.sha256(truth_bytes).hexdigest(),'sourcesSha256':truth['sourcesSha256'],'protocolSha256':truth['protocolSha256'],
            'engineSha256':reports['default']['engine']['artifactDigest'],
            'evaluatorSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
            'environment':{'python':platform.python_version(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'platform':platform.system(),'arch':platform.machine()},
            'oracle':{'method':'Independent canonical pixels and ImageHash on original and physically reflected RGBA; exhaustive index/tier/distance/transform/uniqueness parity every run','checks':checks},
            'modes':{mode:dict(analyze(truth,reports[mode]),command=commands[mode],wallSeconds=timings[mode],medianWallSeconds=statistics.median(timings[mode])) for mode in reports}}
    result['baselineComparison'] = {mode: compare_baseline(reports[mode], args.partition+'/'+mode, args.baseline_version, args.allow_detection_change) for mode in modes}
    old={pair_key(p['left'],p['right']) for p in reports['default']['pairs']}
    labels={pair_key(p['left'],p['right']):p['relation'] for p in truth['pairs']}
    result['mirrorAddedPairs']=[dict(p,truth=labels[pair_key(p['left'],p['right'])]) for p in reports['mirrors']['pairs'] if pair_key(p['left'],p['right']) not in old]
    if args.include_orientations:
        old_mirror={pair_key(p['left'],p['right']) for p in reports['mirrors']['pairs']}
        result['orientationAddedPairs']=[dict(p,truth=labels[pair_key(p['left'],p['right'])]) for p in reports['orientations']['pairs'] if pair_key(p['left'],p['right']) not in old_mirror]
    for mode,report in reports.items():
        (args.out/(mode+'-audit.json')).write_text(json.dumps(report,indent=2)+'\n')
    (args.out/'evaluation.json').write_text(json.dumps(result,indent=2)+'\n')
    enforce_baselines(result['baselineComparison'])
    print(json.dumps({mode:{'near':{k:r['scores']['nearOnly'][k] for k in ['tp','fp','fn','precision','recall']},'anchors':r['anchorRetrieval'],'work':r['stats']['comparisons']} for mode,r in result['modes'].items()},indent=2))


if __name__ == '__main__':
    main()
