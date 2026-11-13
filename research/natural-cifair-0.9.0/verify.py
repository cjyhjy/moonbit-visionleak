"""Independent source decoding, ImageHash parity, exhaustive scoring of labelled pairs."""
from pathlib import Path
import collections
import csv
import hashlib
import json
import sys
import tarfile
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tools'))
from evaluate import canonical

out = Path(sys.argv[1]).resolve()
here = Path(__file__).resolve().parent
report_raw = (out / 'audit/report.json').read_bytes()
report = json.loads(report_raw)
summary = json.loads((out / 'summary.json').read_bytes())
records = json.loads((here / 'dataset.json').read_bytes())['records']
images = {image['id']: image for image in report['images']}
computed = {}
with tarfile.open(ROOT / '.cache/public-data/cifar-10-binary.tar.gz', 'r:gz') as archive:
    for split in ('train', 'test'):
        for batch in (range(1, 6) if split == 'train' else [0]):
            name = f'data_batch_{batch}.bin' if batch else 'test_batch.bin'
            member = archive.getmember('cifar-10-batches-bin/' + name)
            # Independent NumPy bulk reshape/transposition versus prepare.py's channel planes.
            data = np.frombuffer(archive.extractfile(member).read(), dtype=np.uint8).reshape(10000, 3073)
            rgb = data[:, 1:].reshape(10000, 3, 32, 32).transpose(0, 2, 3, 1)
            offset = (batch - 1) * 10000 if batch else 0
            for record in records:
                index = record['index'] - offset
                if record['split'] != split or not 0 <= index < 10000:
                    continue
                assert record['label'] == int(data[index, 0])
                pixels = rgb[index].tobytes()
                assert hashlib.sha256(pixels).hexdigest() == record['rgbSha256']
                assert Image.open(ROOT / '.cache/natural-cifair-090' / record['path']).convert('RGB').tobytes() == pixels
                rgba = Image.frombytes('RGB', (32, 32), pixels).convert('RGBA').tobytes()
                fp = canonical(32, 32, rgba)[0]
                product = images[record['path']]
                for field in ('dhash', 'pixelDigest', 'width', 'height', 'contrast'):
                    assert fp[field] == product[field], (record['path'], field)
                computed[record['path']] = fp
assert len(computed) == len(records) == len(images) == 565
counts = collections.Counter()
distances = []
returned = {tuple(sorted((p['left'], p['right']))) for p in report['pairs']}
for row in csv.DictReader((here / 'duplicates_cifar10.csv').open()):
    left, right = f"test/{int(row['TestID']):05d}.png", f"train/{int(row['TrainID']):05d}.png"
    a, b = computed[left], computed[right]
    distance = sum(x != y for x, y in zip(a['dhash'], b['dhash']))
    predicted = a['pixelDigest'] == b['pixelDigest'] or distance <= 6
    assert predicted == (tuple(sorted((left, right))) in returned)
    positive = row['Judgment'] != '2'
    counts['tp' if predicted and positive else 'fp' if predicted else 'fn' if positive else 'tn'] += 1
    distances.append(distance)
assert dict(counts) == summary['counts']
receipt = {'status': 'passed', 'images': len(computed), 'annotatedPairs': len(distances), 'counts': dict(counts),
           'reportSha256': hashlib.sha256(report_raw).hexdigest(), 'verifierSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
           'scope': 'Independent NumPy source indexing/RGB reconstruction, Python ImageHash dHash parity, direct threshold and count check. Not independent relabelling.'}
(out / 'independent-verification.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt))
