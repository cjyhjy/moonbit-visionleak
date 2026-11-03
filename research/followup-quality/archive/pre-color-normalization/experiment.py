"""Bounded, source-labelled crop experiments. Research output is not a Core report."""
import argparse
import hashlib
import io
import json
import math
from pathlib import Path
import platform
import random
import resource
import subprocess
import time

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def windows(dense=False):
    result = [(0, 0, 1000, 1000)]
    for side in [900, 750, 500]:
        gap = 1000 - side
        for x, y in [(0, 0), (gap, 0), (0, gap), (gap, gap), (gap // 2, gap // 2)]:
            result.append((x, y, x + side, y + side))
    result += [(0, 0, 750, 1000), (250, 0, 1000, 1000), (0, 0, 1000, 750), (0, 250, 1000, 1000)]
    if dense:
        for width in [500, 625, 750, 875]:
            for height in [500, 625, 750, 875]:
                for x in [0, (1000 - width) // 2, 1000 - width]:
                    for y in [0, (1000 - height) // 2, 1000 - height]:
                        if (x, y, x + width, y + height) not in result:
                            result.append((x, y, x + width, y + height))
    return np.asarray(result, dtype=np.int64)


def grayscale(image):
    rgb = np.asarray(image.convert('RGB'), dtype=np.int64)
    return ((299 * rgb[:, :, 0] + 587 * rgb[:, :, 1] + 114 * rgb[:, :, 2] + 500) // 1000).astype(np.uint8)


def local_hashes(gray, rects):
    height, width = gray.shape
    sums = np.pad(gray.astype(np.int64).cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    bounds = rects * np.array([width, height, width, height]) // 1000
    left, top = bounds[:, 0], bounds[:, 1]
    right, bottom = np.maximum(left + 1, bounds[:, 2]), np.maximum(top + 1, bounds[:, 3])
    w, h = right - left, bottom - top
    x0 = left[:, None] + np.arange(9)[None, :] * w[:, None] // 9
    y0 = top[:, None] + np.arange(8)[None, :] * h[:, None] // 8
    x1 = np.minimum(right[:, None], np.maximum(x0 + 1, left[:, None] + np.arange(1, 10)[None, :] * w[:, None] // 9))
    y1 = np.minimum(bottom[:, None], np.maximum(y0 + 1, top[:, None] + np.arange(1, 9)[None, :] * h[:, None] // 8))
    total = sums[y1[:, :, None], x1[:, None, :]] - sums[y0[:, :, None], x1[:, None, :]] - sums[y1[:, :, None], x0[:, None, :]] + sums[y0[:, :, None], x0[:, None, :]]
    grid = total // ((y1 - y0)[:, :, None] * (x1 - x0)[:, None, :])
    bits = (grid[:, :, 1:] > grid[:, :, :-1]).reshape(-1, 64)
    hashes = (bits.astype(np.uint64) * (np.uint64(1) << np.arange(63, -1, -1, dtype=np.uint64))).sum(1, dtype=np.uint64)
    contrast = grid.max((1, 2)) - grid.min((1, 2))
    return hashes, contrast


def prepare(manifest, out, protocol):
    out.mkdir(parents=True, exist_ok=False)
    source_rows = read(manifest)['images']
    records = []
    for row in source_rows:
        assert sha(ROOT / row['storedFile']) == row['sha256']
        image = ImageOps.exif_transpose(Image.open(ROOT / row['storedFile'])).convert('RGB')
        seed = int(hashlib.sha256(('vl-followup-crops-v1:' + row['id']).encode()).hexdigest(), 16)
        rng = random.Random(seed)
        variants = [('original', image, None, 'original')]
        for group, low, high in protocol['cropBands']:
            for variant in range(2):
                width = max(1, image.width * rng.randint(low, high) // 100)
                height = max(1, image.height * rng.randint(low, high) // 100)
                x = rng.randint(0, image.width - width)
                y = rng.randint(0, image.height - height)
                crop = image.crop((x, y, x + width, y + height))
                name = group + ('-png' if variant == 0 else '-resize-jpeg75')
                if variant:
                    scale = 384 / max(crop.size)
                    crop = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.Resampling.LANCZOS)
                    encoded = io.BytesIO()
                    crop.save(encoded, format='JPEG', quality=75, subsampling=2)
                    crop = Image.open(io.BytesIO(encoded.getvalue())).convert('RGB')
                variants.append((name, crop, [x, y, x + width, y + height], group))
        for name, value, rect, group in variants:
            relative = ('train' if name == 'original' else 'test') + '/' + row['id'] + '-' + name + '.png'
            path = out / 'data' / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            value.save(path, format='PNG')
            records.append({'id':relative, 'sourceId':row['id'], 'scene':row['scene'], 'role':'gallery' if name == 'original' else 'query', 'transform':name, 'band':group, 'cropPixels':rect, 'width':value.width, 'height':value.height, 'sha256':sha(path)})
    write(out / 'dataset.json', {'sourceManifestSha256':sha(manifest), 'sourceManifest':str(manifest), 'protocolSha256':sha(HERE / 'protocol.json'), 'sourceFiles':len(source_rows), 'records':records, 'groundTruth':'Only original-gallery versus transformed-query pairs; same source ID is positive, other source files are negatives. No human semantic adjudication.'})
    print(json.dumps({'sourceFiles':len(source_rows), 'images':len(records), 'queries':sum(r['role'] == 'query' for r in records)}))


def window_match(left, right, profile):
    lh, lc = left
    rh, rc = right
    distances = np.bitwise_count(lh[:, None] ^ rh[None, :]).astype(np.int16)
    global_distance = int(distances[0, 0])
    distances[(lc < 16)[:, None] | (rc < 16)[None, :]] = 65
    # Core's full-image stage keeps low-contrast candidates for human review.
    distances[0, 0] = global_distance
    flat = int(distances.argmin())
    a, b = np.unravel_index(flat, distances.shape)
    distance = int(distances[a, b])
    return distance <= 6, {'distance':distance, 'leftWindow':int(a), 'rightWindow':int(b), 'witnessContract':'minimum eligible distance; lexicographic window tie break'}, len(lh) * len(rh)


def orb_match(left, right, profile, seed):
    import cv2
    points_l, descriptors_l, shape_l = left
    points_r, descriptors_r, shape_r = right
    if descriptors_l is None or descriptors_r is None or min(len(descriptors_l), len(descriptors_r)) < 8:
        return False, {'reason':'insufficient-descriptors','inliers':0}, 0
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    forward = matcher.knnMatch(descriptors_r, descriptors_l, k=2)
    reverse = {m.queryIdx:m.trainIdx for m in matcher.match(descriptors_l, descriptors_r)}
    good = [a for pair in forward if len(pair) == 2 for a, b in [pair]
            if a.distance <= profile['maxDistance'] and a.distance < profile['ratio'] * b.distance and reverse.get(a.trainIdx) == a.queryIdx]
    work = 2 * len(descriptors_l) * len(descriptors_r)
    if len(good) < profile['minimumInliers']:
        return False, {'reason':'insufficient-mutual-ratio-matches','matches':len(good),'inliers':0}, work
    src = np.float32([points_r[m.queryIdx].pt for m in good])
    dst = np.float32([points_l[m.trainIdx].pt for m in good])
    cv2.setRNGSeed(seed & 0x7fffffff)
    matrix, mask = cv2.estimateAffinePartial2D(src, dst, method=cv2.RANSAC, ransacReprojThreshold=3.0, maxIters=1000, confidence=0.99, refineIters=5)
    if matrix is None:
        return False, {'reason':'geometry-unavailable','matches':len(good),'inliers':0}, work
    chosen = mask.ravel().astype(bool)
    count = int(chosen.sum())
    selected = src[chosen]
    span = np.ptp(selected, axis=0) / np.array([shape_r[1], shape_r[0]]) if count else np.zeros(2)
    scale = float(np.hypot(matrix[0, 0], matrix[1, 0]))
    corners = np.array([[0,0,1],[shape_r[1],0,1],[shape_r[1],shape_r[0],1],[0,shape_r[0],1]]) @ matrix.T
    contained = bool(np.all(corners >= -0.1 * np.array([shape_l[1],shape_l[0]])) and np.all(corners <= 1.1 * np.array([shape_l[1],shape_l[0]])))
    hit = count >= profile['minimumInliers'] and count / len(good) >= 0.5 and bool(np.all(span >= 0.15)) and 0.15 <= scale <= 5 and contained
    witness = {'matches':len(good),'inliers':count,'inlierRatio':count/len(good),'querySpan':span.tolist(),'queryToOriginal':matrix.tolist(),'projectedQueryCorners':corners.tolist(),'contained':contained,'scale':scale,'inlierCoordinates':[[*map(float,src[i]),*map(float,dst[i])] for i in np.flatnonzero(chosen)] if hit else []}
    return hit, witness, work


def evaluate(dataset, name, out, protocol):
    binding = read(HERE / 'development-freeze.json')
    for relative, expected in binding['files'].items():
        assert sha(ROOT / relative) == expected, ('experiment implementation changed', relative)
    data = read(dataset / 'dataset.json')
    assert data['protocolSha256'] == sha(HERE / 'protocol.json')
    profile = protocol['profiles'][name]
    source_rows = read(Path(data['sourceManifest']))['images']
    if data['sourceManifestSha256'] != binding['developmentManifestSha256']:
        frozen = read(HERE / 'holdout-freeze.json')
        assert frozen['experimentSha256'] == sha(Path(__file__))
        assert frozen['protocolSha256'] == sha(HERE / 'protocol.json')
        assert name in ('v1-reference', frozen['selectedProfile'])
        assert not {r['id'] for r in source_rows} & set(binding['knownSourceIds'])
        role = 'frozen-new-source-controlled-holdout'
    else:
        role = 'known-source-development'
    if name.startswith('orb'):
        import cv2
        assert cv2.__version__ == '4.13.0'
        cv2.setNumThreads(1)
        detector = cv2.ORB_create(nfeatures=profile['features'],scaleFactor=1.2,nlevels=8,edgeThreshold=15,patchSize=31,fastThreshold=20,WTA_K=2)
    records = data['records']
    gallery = [r for r in records if r['role'] == 'gallery']
    queries = [r for r in records if r['role'] == 'query']
    start = time.monotonic()
    features = {}
    fingerprints = {}
    for row in records:
        path = dataset / 'data' / row['id']
        assert sha(path) == row['sha256']
        gray = grayscale(Image.open(path))
        if name.startswith('orb'):
            keypoints, descriptors = detector.detectAndCompute(gray, None)
            features[row['id']] = keypoints, descriptors, gray.shape
        else:
            features[row['id']] = local_hashes(gray, windows(name == 'grid154'))
            if name == 'v1-reference':
                fingerprints[row['id']] = {'hashes':[format(int(h),'064b') for h in features[row['id']][0]],'contrasts':features[row['id']][1].tolist()}
    extraction = time.monotonic() - start
    pairs = []
    work = 0
    for query in queries:
        for original in gallery:
            if time.monotonic() - start > protocol['acceptance']['maximumSeconds']:
                break
            seed = int(hashlib.sha256((original['id'] + '|' + query['id']).encode()).hexdigest()[:8],16)
            if name.startswith('orb'):
                hit, witness, amount = orb_match(features[original['id']],features[query['id']],profile,seed)
            else:
                hit, witness, amount = window_match(features[original['id']],features[query['id']],profile)
            work += amount
            pairs.append({'original':original['id'],'query':query['id'],'positive':original['sourceId']==query['sourceId'],'sameScene':original['scene']==query['scene'],'band':query['band'],'transform':query['transform'],'hit':bool(hit),'witness':witness})
    seconds = time.monotonic() - start
    rss = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * (1 if platform.system() == 'Darwin' else 1024)
    positives = len(queries)
    negatives = len(queries) * (len(gallery) - 1)
    tp = sum(p['positive'] and p['hit'] for p in pairs)
    fp = sum(not p['positive'] and p['hit'] for p in pairs)
    bands = {band:{'tp':sum(p['positive'] and p['hit'] and p['band']==band for p in pairs),'total':sum(q['band']==band for q in queries)} for band,_,_ in protocol['cropBands']}
    per_band = {b:{**v,'recall':v['tp']/v['total']} for b,v in bands.items()}
    complete = len(pairs) == len(gallery) * len(queries)
    limits = protocol['acceptance']
    recall = tp / positives
    precision = tp/(tp+fp) if tp+fp else 0
    gates = {'complete':complete,'recall':recall>=limits['minimumRecall'],'bandRecall':all(b['recall']>=limits['minimumBandRecall'] for b in per_band.values()),'falsePositiveRate':fp/negatives<=limits['maximumFalsePositiveRate'],'precision':precision>=limits['minimumPrecision'],'candidateLoad':(tp+fp)/len(queries)<=limits['maximumCandidatesPerQuery'],'time':seconds<=limits['maximumSeconds'],'memory':rss<=limits['maximumRssBytes']}
    result = {'schemaVersion':'visionleak-crop-research-v1','evaluationRole':role,'profile':name,'profileContract':profile,'implementationSha256':sha(Path(__file__)),'protocolSha256':sha(HERE/'protocol.json'),'sourceManifestSha256':data['sourceManifestSha256'],'datasetSha256':sha(dataset/'dataset.json'),'gallery':len(gallery),'queries':len(queries),'positivePairs':positives,'negativePairs':negatives,'processedPairs':len(pairs),'complete':complete,'tp':tp,'fp':fp,'fn':positives-tp,'recall':recall,'precision':precision,'falsePositiveRate':fp/negatives,'candidates':tp+fp,'candidatesPerQuery':(tp+fp)/len(queries),'byBand':per_band,'featureExtractionSeconds':extraction,'wallSeconds':seconds,'peakRssBytes':rss,'descriptorOrHashComparisons':work,'acceptanceGates':gates,'acceptedForNextStage':all(gates.values()),'pairs':pairs,'missedQueries':[q['id'] for q in queries if not any(p['query']==q['id'] and p['positive'] and p['hit'] for p in pairs)],'scope':'Original-to-controlled-crop retrieval only. Source-file labels are not human semantic judgments. No natural contamination, production-scale capacity, or human review-time claim.'}
    out.parent.mkdir(parents=True,exist_ok=True)
    if out.exists():
        raise ValueError('Refusing to overwrite an experiment result')
    write(out,result)
    if name == 'v1-reference':
        core_out = dataset / 'core-reference'
        run = subprocess.run(['node','tools/cli.mjs','audit','--root',str(dataset/'data'),'--out',str(core_out),'--max-comparisons','10000000','--include-crops'],cwd=ROOT,capture_output=True,text=True)
        assert run.returncode==0,run.stderr
        core = read(core_out/'report.json')
        for image in core['images']:
            assert image['localHashes']==fingerprints[image['id']]['hashes']
            assert image['localContrasts']==fingerprints[image['id']]['contrasts']
        expected={tuple(sorted((p['original'],p['query']))) for p in pairs if p['hit']}
        assert expected=={tuple(sorted((p['left'],p['right']))) for p in core['pairs']}
        result['independentCoreParity']=True
        write(out,result)
    print(json.dumps({k:result[k] for k in ['profile','tp','fp','fn','recall','precision','byBand','wallSeconds','peakRssBytes','acceptedForNextStage','acceptanceGates']},ensure_ascii=False))


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    sub=parser.add_subparsers(dest='operation',required=True)
    prep=sub.add_parser('prepare');prep.add_argument('--manifest',type=Path,required=True);prep.add_argument('--out',type=Path,required=True)
    run=sub.add_parser('evaluate');run.add_argument('--dataset',type=Path,required=True);run.add_argument('--profile',required=True);run.add_argument('--out',type=Path,required=True)
    args=parser.parse_args();protocol=read(HERE/'protocol.json')
    if args.operation=='prepare':prepare(args.manifest.resolve(),args.out.resolve(),protocol)
    else:evaluate(args.dataset.resolve(),args.profile,args.out.resolve(),protocol)
