"""Freeze a cluster-disjoint sample before fetching images. Uses the first original ZIP volume."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import struct
import subprocess
import zipfile
import zlib

URL = 'https://press.liacs.nl/mirflickr/mirflickr1m.v3b/images0.zip'
LABELS = 'https://mfnd.similarity.eu/data/truthfiles/strathclyde/IND_clusters.txt'
ROOT = Path('.cache/mfnd-first-volume')
ROOT.mkdir(exist_ok=True, parents=True)
def fetch(*args):
    return subprocess.check_output(['curl','--fail','--silent','--show-error','--retry','3','--max-time','90',*args])
def portion(start, end):
    data = fetch('--range', f'{start}-{end}',URL)
    if len(data) != end - start + 1:
        raise ValueError('Server returned an unexpected byte range')
    return data
raw = fetch(LABELS)
groups = [list(map(int, line.split())) for line in raw.decode().splitlines()]
groups = [g for g in groups if len(g)==2 and max(g)<100000]
groups.sort(key=lambda g: hashlib.sha256(f'visionleak-1:{g}'.encode()).digest())
selection = {'development':groups[:16], 'holdout':groups[16:80]}
assert len(set(i for rows in selection.values() for row in rows for i in row)) == 160
metadata = dict(volume=URL, labels=LABELS, labelsSha256=hashlib.sha256(raw).hexdigest(), groups=selection)
manifest = Path('research/mfnd-review-budget/sample.json')
encoded = json.dumps(metadata,indent=2)+'\n'
if manifest.exists() and manifest.read_text() != encoded:
    raise ValueError('Source labels or sample changed since the freeze')
if not manifest.exists():
    manifest.write_text(encoded)
length = int(next(line.split(':')[1] for line in fetch('-I',URL).decode().lower().splitlines() if line.startswith('content-length:')))
# zipfile parses ZIP64 offsets from a sparse local copy of the central directory.
tail = portion(length-65536,length-1)
pos = tail.rfind(b'PK\x06\x06')
start = struct.unpack_from('<Q',tail,pos+48)[0] if pos>=0 else struct.unpack_from('<I',tail,tail.rindex(b'PK\x05\x06')+16)[0]
with (ROOT/'central.zip').open('wb') as f:
    f.seek(start)
    f.write(portion(start,length-1))
with zipfile.ZipFile(ROOT/'central.zip') as z:
    infos = {int(Path(i.filename).stem):i for i in z.infolist() if i.filename.endswith('.jpg')}
def download(item):
    part,split,num = item
    dest = ROOT/part/split/f'{num}.jpg'
    dest.parent.mkdir(parents=True,exist_ok=True)
    info = infos[num]
    if dest.exists() and zlib.crc32(dest.read_bytes()) == info.CRC:
        return
    data = portion(info.header_offset,info.header_offset+info.compress_size+255)
    name,extra = struct.unpack_from('<HH',data,26)
    offset=30+name+extra
    payload=data[offset:offset+info.compress_size]
    image=zlib.decompress(payload,-15) if info.compress_type==8 else payload
    assert len(image)==info.file_size and zlib.crc32(image)==info.CRC
    dest.write_bytes(image)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(download,[(p,s,n) for p,rows in selection.items() for a,b in rows for s,n in [('train',a),('test',b)]]))
