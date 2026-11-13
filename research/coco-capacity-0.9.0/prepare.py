"""Convert all COCO validation photos under the predeclared capacity protocol."""
from pathlib import Path
import hashlib
import io
import json
import re
import zipfile
from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
protocol_raw = (HERE / 'protocol.json').read_bytes()
download = json.loads((HERE / 'download.json').read_bytes())
assert hashlib.sha256(protocol_raw).hexdigest() == download['protocolSha256']
archive = ROOT / download['archive']
digest = hashlib.sha256()
with archive.open('rb') as stream:
    while chunk := stream.read(1024 * 1024):
        digest.update(chunk)
assert digest.hexdigest() == download['sha256']
Image.MAX_IMAGE_PIXELS = 64000000
output = ROOT / '.cache/coco-capacity-090'
output.mkdir(exist_ok=False)
for split in ('train', 'test'):
    (output / split).mkdir()
records = []
with zipfile.ZipFile(archive) as z:
    members = sorted((i for i in z.infolist() if not i.is_dir()), key=lambda i: i.filename)
    assert len(members) == 5000
    for position, member in enumerate(members):
        assert re.fullmatch(r'val2017/\d{12}\.jpg', member.filename)
        assert member.file_size <= 33554432
        raw = z.read(member)
        assert len(raw) == member.file_size
        with Image.open(io.BytesIO(raw)) as original:
            original.load()
            source = ImageOps.exif_transpose(original).convert('RGB')
        original_size = source.size
        original_rgb_hash = hashlib.sha256(source.tobytes()).hexdigest()
        source.thumbnail((384, 384), resample=Image.Resampling.LANCZOS)
        split = 'train' if position % 2 == 0 else 'test'
        path = f'{split}/{Path(member.filename).stem}.png'
        source.save(output / path)
        records.append({'position': position, 'source': member.filename, 'split': split, 'path': path,
                        'originalBytes': len(raw), 'originalSha256': hashlib.sha256(raw).hexdigest(),
                        'originalWidth': original_size[0], 'originalHeight': original_size[1],
                        'originalRgbSha256': original_rgb_hash, 'width': source.width, 'height': source.height,
                        'normalizedRgbSha256': hashlib.sha256(source.tobytes()).hexdigest(),
                        'sha256': hashlib.sha256((output / path).read_bytes()).hexdigest()})
        if (position + 1) % 500 == 0:
            print('Prepared photos:', position + 1, flush=True)
receipt = {'schemaVersion': 'vl-coco-scaled-capacity-input-v1', 'images': len(records),
           'protocolSha256': hashlib.sha256(protocol_raw).hexdigest(), 'archiveSha256': download['sha256'],
           'generatorSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
           'records': records, 'totalPixels': sum(r['width'] * r['height'] for r in records),
           'distinctOriginalByteDigests': len({r['originalSha256'] for r in records}),
           'distinctOriginalRgbDigests': len({r['originalRgbSha256'] for r in records}),
           'scope': 'All independent COCO val2017 photos normalized longest384; synthetic audit splits, unlabelled relations. Not original-resolution or accuracy evidence.'}
(HERE / 'dataset.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({k: v for k, v in receipt.items() if k != 'records'}), flush=True)
