"""Materialize original JPEG bytes only, bound to the prior official acquisition."""
from pathlib import Path
import hashlib
import json
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
protocol_raw = (HERE / 'protocol.json').read_bytes()
p = json.loads(protocol_raw)
old_raw = (ROOT / 'research/coco-capacity-0.9.0/dataset.json').read_bytes()
old = json.loads(old_raw)
archive = ROOT / '.cache/public-data/coco-val2017.zip'
h = hashlib.sha256()
with archive.open('rb') as stream:
    while chunk := stream.read(1024 * 1024):
        h.update(chunk)
assert h.hexdigest() == old['archiveSha256']
output = ROOT / '.cache/coco-original-090'
output.mkdir(exist_ok=False)
for split in ('train', 'test'):
    (output / split).mkdir()
records = []
with zipfile.ZipFile(archive) as z:
    for before in old['records']:
        raw = z.read(before['source'])
        assert hashlib.sha256(raw).hexdigest() == before['originalSha256']
        path = before['split'] + '/' + Path(before['source']).name
        (output / path).write_bytes(raw)
        records.append({'position': before['position'], 'source': before['source'], 'path': path,
                        'split': before['split'], 'width': before['originalWidth'], 'height': before['originalHeight'],
                        'sha256': before['originalSha256'], 'rgbSha256': before['originalRgbSha256'], 'bytes': len(raw)})
assert len(records) == 5000
assert sum(r['width'] * r['height'] for r in records) == p['originalSourcePixels']
receipt = {'schemaVersion': 'vl-coco-original-capacity-input-v1', 'images': len(records),
           'protocolSha256': hashlib.sha256(protocol_raw).hexdigest(), 'archiveSha256': old['archiveSha256'],
           'previousDatasetSha256': hashlib.sha256(old_raw).hexdigest(),
           'generatorSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'records': records,
           'totalSourcePixels': p['originalSourcePixels'], 'sourceBytesUnchanged': True,
           'scope': p['scopeLimits']}
(HERE / 'dataset.json').write_text(json.dumps(receipt, indent=2)+'\n')
print(json.dumps({k: v for k, v in receipt.items() if k != 'records'}))
