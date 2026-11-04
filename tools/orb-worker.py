"""Private bounded JSON-lines worker. Receives gray pixels, never file paths."""
import base64
import hashlib
from importlib.metadata import version
import json
from pathlib import Path
import sys

PROFILE = json.loads(Path(__file__).with_name('orb-profile.json').read_text())
MAX_LINE = 8 * 1024 * 1024


def reply(value):
    print(json.dumps(value, separators=(',', ':'), allow_nan=False), flush=True)


def orb_match(original, query, seed):
    points_l, descriptors_l, shape_l = original
    points_r, descriptors_r, shape_r = query
    if descriptors_l is None or descriptors_r is None or min(len(descriptors_l), len(descriptors_r)) < 8:
        return False, None, 0
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
    forward = matcher.knnMatch(descriptors_r, descriptors_l, k=2)
    reverse = {m.queryIdx: m.trainIdx for m in matcher.match(descriptors_l, descriptors_r)}
    good = [a for pair in forward if len(pair) == 2 for a, b in [pair]
            if a.distance <= PROFILE['maxDistance'] and a.distance < PROFILE['ratio'] * b.distance
            and reverse.get(a.trainIdx) == a.queryIdx]
    work = 2 * len(descriptors_l) * len(descriptors_r)
    if len(good) < PROFILE['minimumInliers']:
        return False, None, work
    src = np.float32([points_r[m.queryIdx].pt for m in good])
    dst = np.float32([points_l[m.trainIdx].pt for m in good])
    cv2.setRNGSeed(seed & 0x7fffffff)
    matrix, mask = cv2.estimateAffinePartial2D(
        src, dst, method=cv2.RANSAC, ransacReprojThreshold=PROFILE['ransacReprojectionThreshold'],
        maxIters=PROFILE['ransacIterations'], confidence=PROFILE['ransacConfidence'],
        refineIters=PROFILE['refineIterations'])
    if matrix is None or not np.isfinite(matrix).all():
        return False, None, work
    chosen = mask.ravel().astype(bool)
    count = int(chosen.sum())
    span = np.ptp(src[chosen], axis=0) / np.array([shape_r[1], shape_r[0]]) if count else np.zeros(2)
    scale = float(np.hypot(matrix[0, 0], matrix[1, 0]))
    corners = np.array([[0, 0, 1], [shape_r[1], 0, 1], [shape_r[1], shape_r[0], 1], [0, shape_r[0], 1]]) @ matrix.T
    tolerance = PROFILE['containmentTolerance']
    contained = bool(np.all(corners >= -tolerance * np.array([shape_l[1], shape_l[0]]))
                     and np.all(corners <= (1 + tolerance) * np.array([shape_l[1], shape_l[0]])))
    hit = (count >= PROFILE['minimumInliers'] and count / len(good) >= PROFILE['minimumInlierRatio']
           and bool(np.all(span >= PROFILE['minimumQuerySpan']))
           and PROFILE['scaleRange'][0] <= scale <= PROFILE['scaleRange'][1] and contained)
    if not hit:
        return False, None, work
    coordinates = [[*map(float, src[i]), *map(float, dst[i])] for i in np.flatnonzero(chosen)]
    witness = {'matches': len(good), 'inliers': count, 'inlierRatio': count / len(good),
               'querySpan': span.tolist(), 'queryToOriginal': matrix.tolist(),
               'projectedQueryCorners': corners.tolist(), 'contained': contained, 'scale': scale,
               'inlierCoordinates': coordinates[:PROFILE['witnessPointLimit']],
               'coordinateCount': count, 'coordinatesTruncated': count > PROFILE['witnessPointLimit'],
               'allCoordinatesDigest': hashlib.sha256(json.dumps(coordinates, separators=(',', ':')).encode()).hexdigest()}
    return True, witness, work


def main():
    global cv2, np
    try:
        import cv2
        import numpy as np
        if (cv2.__version__ != PROFILE['opencv'] or np.__version__ != PROFILE['numpy']
                or version('opencv-python-headless') != PROFILE['opencvWheel']):
            raise RuntimeError('version mismatch')
    except (ImportError, RuntimeError, ValueError):
        reply({'ok': False, 'code': 'ORB_DEPENDENCY', 'message': 'Install the pinned optional requirements-orb.txt in VISIONLEAK_ORB_PYTHON'})
        return
    cv2.setNumThreads(1)
    detector = cv2.ORB_create(**{k: PROFILE[k] for k in ['scaleFactor', 'nlevels', 'edgeThreshold', 'patchSize', 'fastThreshold', 'WTA_K']}, nfeatures=PROFILE['features'])
    features = {}
    while True:
        line = sys.stdin.buffer.readline(MAX_LINE + 1)
        if not line:
            return
        if len(line) > MAX_LINE or not line.endswith(b'\n'):
            raise ValueError('input frame exceeds budget')
        req = json.loads(line)
        op = req.get('op')
        if op == 'hello':
            reply({'ok': True, 'profile': PROFILE['id'], 'opencv': cv2.__version__, 'numpy': np.__version__,
                   'opencvWheel': version('opencv-python-headless'), 'python': sys.version.split()[0],
                   'opencvBuildDigest': hashlib.sha256(cv2.getBuildInformation().encode()).hexdigest(),
                   'profileDigest': hashlib.sha256(Path(__file__).with_name('orb-profile.json').read_bytes()).hexdigest(),
                   'workerDigest': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()})
        elif op == 'extract':
            width, height, identifier = req['width'], req['height'], req['id']
            if (type(width) is not int or type(height) is not int or not 1 <= width <= 65535
                    or not 1 <= height <= 65535 or width * height > 4194304
                    or not isinstance(identifier, str) or len(identifier) > 4096
                    or identifier in features or len(features) >= 512):
                raise ValueError('feature input budget')
            raw = base64.b64decode(req['gray'], validate=True)
            if len(raw) != width * height:
                raise ValueError('gray dimensions')
            gray = np.frombuffer(raw, dtype=np.uint8).reshape(height, width)
            points, descriptors = detector.detectAndCompute(gray, None)
            if len(points) > PROFILE['features']:
                raise ValueError('feature cap exceeded')
            features[identifier] = points, descriptors, gray.shape
            feature_bytes = json.dumps([list(p.pt) for p in points], separators=(',', ':')).encode()
            if descriptors is not None:
                feature_bytes += descriptors.tobytes()
            reply({'ok': True, 'keypoints': len(points), 'featureDigest': hashlib.sha256(feature_bytes).hexdigest(),
                   'grayDigest': hashlib.sha256(raw).hexdigest()})
        elif op == 'match':
            a, b = features[req['original']], features[req['query']]
            cost = 2 * len(a[0]) * len(b[0]) if min(len(a[0]), len(b[0])) >= 8 else 0
            if type(req['remainingWork']) is not int or not 0 <= req['remainingWork'] <= 2000000000:
                raise ValueError('invalid work budget')
            if cost > req['remainingWork']:
                reply({'ok': True, 'budget': True, 'work': 0})
                continue
            seed = int(hashlib.sha256((req['original'] + '|' + req['query']).encode()).hexdigest()[:8], 16)
            hit, witness, work = orb_match(a, b, seed)
            reply({'ok': True, 'hit': hit, 'witness': witness, 'work': work})
        else:
            raise ValueError('unknown operation')


if __name__ == '__main__':
    try:
        main()
    except Exception:
        reply({'ok': False, 'code': 'ORB_PROTOCOL', 'message': 'ORB worker rejected input or could not compute features'})
        sys.exit(1)
