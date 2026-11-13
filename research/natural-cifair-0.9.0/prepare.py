"""Materialize all annotated endpoints from the verified official binary archive."""
from pathlib import Path
import csv
import hashlib
import json
import tarfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
protocol_raw = (HERE / 'protocol.json').read_bytes()
protocol = json.loads(protocol_raw)
annotations = (HERE / 'duplicates_cifar10.csv').read_bytes()
assert hashlib.sha256(annotations).hexdigest() == protocol['annotationSha256']
rows = list(csv.DictReader(annotations.decode().splitlines()))
assert len(rows) == 286
selected = {'train': set(), 'test': set()}
for row in rows:
    train, test = int(row['TrainID']), int(row['TestID'])
    assert 0 <= train < 50000 and 0 <= test < 10000
    assert row['Judgment'] in ('0', '1', '2')
    selected['train'].add(train)
    selected['test'].add(test)
archive = ROOT / '.cache/public-data/cifar-10-binary.tar.gz'
assert hashlib.md5(archive.read_bytes()).hexdigest() == protocol['officialArchiveMd5']
output = ROOT / '.cache/natural-cifair-090'
output.mkdir(exist_ok=False)
records = []
with tarfile.open(archive, 'r:gz') as tar:
    for split in ('train', 'test'):
        (output / split).mkdir()
        batches = range(1, 6) if split == 'train' else [0]
        for batch in batches:
            name = f'data_batch_{batch}.bin' if batch else 'test_batch.bin'
            member = tar.getmember('cifar-10-batches-bin/' + name)
            assert member.isfile() and member.size == 30730000
            stream = tar.extractfile(member)
            # Read known regular members only; never extract archive paths.
            raw = stream.read(30730001)
            assert len(raw) == 30730000
            offset = (batch - 1) * 10000 if batch else 0
            for index in sorted(selected[split]):
                if not offset <= index < offset + 10000:
                    continue
                start = (index - offset) * 3073
                label, pixels = raw[start], raw[start + 1:start + 3073]
                assert label < 10 and len(pixels) == 3072
                planes = [Image.frombytes('L', (32, 32), pixels[i:i+1024]) for i in (0, 1024, 2048)]
                image = Image.merge('RGB', planes)
                path = f'{split}/{index:05d}.png'
                image.save(output / path)
                records.append({'path': path, 'split': split, 'index': index, 'label': label,
                                'rgbSha256': hashlib.sha256(image.tobytes()).hexdigest(),
                                'sha256': hashlib.sha256((output / path).read_bytes()).hexdigest()})
assert len(records) == sum(map(len, selected.values()))
receipt = {'schemaVersion': 'vl-cifair-endpoints-v1', 'protocolSha256': hashlib.sha256(protocol_raw).hexdigest(),
           'generatorSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
           'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'records': records,
           'scope': 'All annotated endpoints only; no transforms, relabelling or negative inference for other pairs.'}
(HERE / 'dataset.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({'images': len(records), 'train': len(selected['train']), 'test': len(selected['test']), 'root': str(output)}))
