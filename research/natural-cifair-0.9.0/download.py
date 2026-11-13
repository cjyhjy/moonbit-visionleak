"""Acquire official binary data without unpickling or extracting arbitrary paths."""
from pathlib import Path
import hashlib
import json
import urllib.request
import urllib.parse

ROOT = Path(__file__).resolve().parents[2]
PROTOCOL = Path(__file__).with_name('protocol.json')
p = json.loads(PROTOCOL.read_text())
url = p['archiveUrl']
assert urllib.parse.urlparse(url).scheme == 'https'
assert urllib.parse.urlparse(url).hostname in ('cave.cs.toronto.edu', 'www.cs.toronto.edu')
target = ROOT / '.cache/public-data/cifar-10-binary.tar.gz'
partial = target.with_suffix('.gz.part')
target.parent.mkdir(parents=True, exist_ok=True)
maximum = 200000000
if not target.exists():
    offset = partial.stat().st_size if partial.exists() else 0
    if offset > maximum:
        raise ValueError('Existing partial exceeds download budget')
    headers = {'User-Agent': 'VisionLeak/0.9.0 public-dataset-evaluation'}
    if offset:
        headers['Range'] = 'bytes=' + str(offset) + '-'
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=45) as response:
        if urllib.parse.urlparse(response.geturl()).scheme != 'https':
            raise ValueError('Refusing non-HTTPS redirect')
        if offset and (response.status != 206 or not response.headers.get('Content-Range', '').startswith('bytes ' + str(offset) + '-')):
            raise ValueError('Server did not honor partial range; existing data preserved')
        with partial.open('ab' if offset else 'xb') as stream:
            count = offset
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                if count + len(chunk) > maximum:
                    raise ValueError('Download exceeds 200 MB budget')
                stream.write(chunk)
                count += len(chunk)
                if count // (16 * 1024 * 1024) != (count - len(chunk)) // (16 * 1024 * 1024):
                    print('Downloaded bytes:', count, flush=True)
    if hashlib.md5(partial.read_bytes()).hexdigest() != p['officialArchiveMd5']:
        raise ValueError('Official MD5 mismatch; partial data preserved')
    partial.rename(target)
raw = target.read_bytes()
if hashlib.md5(raw).hexdigest() != p['officialArchiveMd5']:
    raise ValueError('Existing archive does not match official MD5')
receipt = {'status': 'downloaded-and-integrity-checked', 'url': url, 'bytes': len(raw), 'officialMd5': p['officialArchiveMd5'], 'sha256': hashlib.sha256(raw).hexdigest(), 'archive': '.cache/public-data/cifar-10-binary.tar.gz', 'experimentStatus': 'not_run', 'protocolSha256': hashlib.sha256(PROTOCOL.read_bytes()).hexdigest()}
Path(__file__).with_name('download.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps(receipt), flush=True)
