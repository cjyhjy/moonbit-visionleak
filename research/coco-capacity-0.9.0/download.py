"""Bounded resumable acquisition of the official public COCO validation archive."""
from pathlib import Path
import hashlib
import json
import re
import urllib.request
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
protocol_raw = (HERE / 'protocol.json').read_bytes()
p = json.loads(protocol_raw)
target = ROOT / '.cache/public-data/coco-val2017.zip'
target.parent.mkdir(parents=True, exist_ok=True)
partial = target.with_suffix('.zip.part')
if not target.exists():
    offset = partial.stat().st_size if partial.exists() else 0
    if not 0 <= offset <= p['expectedBytes']:
        raise ValueError('Existing partial size outside bound')
    if offset < p['expectedBytes']:
        headers = {'User-Agent': 'VisionLeak/0.9.0 public-photo-capacity', 'If-Match': p['expectedEtag']}
        if offset:
            headers['Range'] = f'bytes={offset}-'
        with urllib.request.urlopen(urllib.request.Request(p['httpsSameBucketUrl'], headers=headers), timeout=45) as response:
            assert response.geturl() == p['httpsSameBucketUrl']
            assert response.headers.get('ETag') == p['expectedEtag']
            assert int(response.headers['Content-Length']) == p['expectedBytes'] - offset
            if offset:
                assert response.status == 206 and response.headers['Content-Range'].startswith(f'bytes {offset}-')
            else:
                assert response.status == 200
            with partial.open('ab' if partial.exists() else 'xb') as output:
                total = offset
                while chunk := response.read(1024 * 1024):
                    if total + len(chunk) > p['expectedBytes']:
                        raise ValueError('Download exceeded frozen byte bound')
                    output.write(chunk)
                    total += len(chunk)
                    if total // (64 * 1024 * 1024) != (total - len(chunk)) // (64 * 1024 * 1024):
                        print('Downloaded bytes:', total, flush=True)
    assert partial.stat().st_size == p['expectedBytes']
    # Validate member structure and CRC without extracting any paths.
    with zipfile.ZipFile(partial) as z:
        names = [i.filename for i in z.infolist() if not i.is_dir()]
        assert len(names) == 5000 and len(set(names)) == 5000
        assert all(re.fullmatch(r'val2017/\d{12}\.jpg', n) for n in names)
        assert z.testzip() is None
    partial.rename(target)
assert target.stat().st_size == p['expectedBytes']
digest = hashlib.sha256()
with target.open('rb') as stream:
    while chunk := stream.read(1024 * 1024):
        digest.update(chunk)
receipt = {'status': 'downloaded-and-zip-integrity-checked', 'archive': str(target.relative_to(ROOT)),
           'url': p['httpsSameBucketUrl'], 'bytes': target.stat().st_size, 'sha256': digest.hexdigest(),
           'etag': p['expectedEtag'], 'protocolSha256': hashlib.sha256(protocol_raw).hexdigest(),
           'downloaderSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'experimentStatus': 'not_run'}
(HERE / 'download.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt), flush=True)
