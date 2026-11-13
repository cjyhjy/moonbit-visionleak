"""Metadata-first, resumable acquisition. No holdout downloads before algorithm freeze."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
DATA = Path(__file__).resolve().parent
FAMILIES = {
    'development': {
        'repeated-texture': ['roof tiles', 'cobblestone', 'wood texture', 'chain link fence'],
        'similar-building': ['Chrysler Building', 'Brandenburg Gate', 'Helsinki Cathedral', 'Pantheon Rome'],
        'same-scene': ['tulip garden', 'hot air balloons', 'sailboats', 'railway station'],
    },
    'holdout': {
        'repeated-texture': ['woven fabric', 'gravel', 'ceramic tiles', 'tree bark'],
        'similar-building': ['Neuschwanstein Castle', 'Palace of Versailles', 'Notre Dame Paris', 'Tokyo Tower'],
        'same-scene': ['sunflower field', 'parked bicycles', 'water lilies', 'wind turbines'],
    },
}


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def save(path, value):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


def get(url):
    for attempt in range(4):
        time.sleep(1)
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'VisionLeak/0.9.0 (CC0 metadata-first evaluation)'})
            with urllib.request.urlopen(request, timeout=30) as response:
                raw = response.read(16 * 1024 * 1024 + 1)
            if len(raw) > 16 * 1024 * 1024:
                raise ValueError('download exceeds 16 MiB')
            return raw
        except urllib.error.HTTPError as error:
            if error.code not in (429, 503) or attempt == 3:
                raise
            delay = max(15, int(error.headers.get('Retry-After', '15')))
            print('Rate limit/backoff:', delay, flush=True)
            time.sleep(delay)


def historical():
    records = []
    manifests = [ROOT / f'research/photos-v{i}/sources.json' for i in (1, 2, 3)]
    manifests += [ROOT / 'research/followup-quality/development-sources.json', ROOT / 'research/followup-quality/holdout/sources.json']
    receipts = {}
    for path in manifests:
        raw = path.read_bytes()
        receipts[str(path.relative_to(ROOT))] = sha(raw)
        records.extend(json.loads(raw)['images'])
    excluded = {'manifestDigests': receipts,
                'ids': sorted({str(r['id']) for r in records}),
                'upstreamSha1s': sorted({r['upstreamSha1'] for r in records if r.get('upstreamSha1')}),
                'sha256s': sorted({r[k] for r in records for k in ('sha256', 'downloadSha256') if r.get(k)}),
                'scenes': sorted({r['scene'] for r in records if r.get('scene')})}
    return excluded


def metadata():
    if (DATA / 'selection.json').exists():
        raise ValueError('Selection already sealed; never overwrite it')
    excluded = historical()
    save(DATA / 'exclusions.json', excluded)
    save(DATA / 'family-protocol.json', {'families': FAMILIES, 'perFamily': 2, 'policy': 'First two eligible CC0 bitmap API results, metadata only. Preserve family partition. Source-file lineage labels require later adjudication; not natural contamination truth.'})
    ids = set(excluded['ids'])
    hashes = set(excluded['upstreamSha1s'])
    rows, queries = [], []
    for partition, buckets in FAMILIES.items():
        for bucket, families in buckets.items():
            for family in families:
                query = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': family + ' filetype:bitmap incategory:"CC-Zero"', 'gsrnamespace': 6, 'gsrlimit': 50, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|sha1|size', 'iiurlwidth': 512})
                path = DATA / ('metadata-' + sha(query.encode())[:16] + '.json')
                if not path.exists():
                    path.write_bytes(get(query))
                raw = path.read_bytes()
                data = json.loads(raw)
                selected = []
                for page in sorted(data.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
                    info = page.get('imageinfo', [{}])[0]
                    meta = info.get('extmetadata', {})
                    if meta.get('LicenseShortName', {}).get('value') != 'CC0' or str(page['pageid']) in ids or info.get('sha1') in hashes:
                        continue
                    if not urllib.parse.urlparse(info['url']).path.lower().endswith(('.jpg', '.jpeg', '.png')) or info['width'] < 320 or info['height'] < 240:
                        continue
                    row = {'id': str(page['pageid']), 'title': page['title'], 'family': family, 'bucket': bucket, 'partition': partition,
                           'author': re.sub('<[^>]*>', '', meta.get('Artist', {}).get('value', 'unknown')),
                           'license': 'CC0-1.0', 'licenseUrl': meta.get('LicenseUrl', {}).get('value'), 'licenseEvidence': info['descriptionurl'],
                           'downloadUrl': info.get('thumburl', info['url']), 'originalUrl': info['url'], 'upstreamSha1': info['sha1'], 'width': info['width'], 'height': info['height']}
                    selected.append(row)
                    ids.add(row['id'])
                    hashes.add(row['upstreamSha1'])
                    if len(selected) == 2:
                        break
                queries.append({'family': family, 'url': query, 'responseSha256': sha(raw), 'eligibleSelected': len(selected)})
                rows.extend(selected)
                save(DATA / 'selection-draft.json', {'images': rows, 'queries': queries, 'status': 'incomplete'})
                print(partition, family, len(selected), flush=True)
                if len(selected) < 2:
                    raise ValueError('Insufficient eligible metadata for ' + family)
    assert len(rows) == 48
    save(DATA / 'selection.json', {'schemaVersion': 'vl-new-source-selection-v1', 'exclusionsSha256': sha((DATA / 'exclusions.json').read_bytes()), 'familyProtocolSha256': sha((DATA / 'family-protocol.json').read_bytes()), 'images': rows, 'queries': queries})


def download(partition):
    selection = DATA / 'selection.json'
    document = json.loads(selection.read_bytes())
    if partition == 'holdout':
        freeze = json.loads((DATA / 'freeze.json').read_bytes())
        assert freeze['selectionSha256'] == sha(selection.read_bytes())
        for name, digest in freeze['implementationFiles'].items():
            assert sha((ROOT / name).read_bytes()) == digest, ('Changed since holdout freeze', name)
    excluded = historical()
    old_hashes = set(excluded['sha256s'])
    output = DATA / partition
    output.mkdir(exist_ok=True)
    rows = []
    for selected in document['images']:
        if selected['partition'] != partition:
            continue
        path = output / (selected['id'] + '.png')
        receipt = output / (selected['id'] + '.json')
        if receipt.exists():
            row = json.loads(receipt.read_bytes())
            assert sha(path.read_bytes()) == row['sha256']
        else:
            raw = get(selected['downloadUrl'])
            assert sha(raw) not in old_hashes
            image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB')
            image.thumbnail((384, 384), Image.Resampling.LANCZOS)
            image.save(path, format='PNG')
            assert sha(path.read_bytes()) not in old_hashes
            row = {**selected, 'downloadSha256': sha(raw), 'sha256': sha(path.read_bytes()), 'storedFile': str(path.relative_to(ROOT)), 'storedWidth': image.width, 'storedHeight': image.height, 'normalization': 'EXIF transpose, RGB, longest edge <=384 Pillow LANCZOS, PNG; product normalization applied downstream'}
            save(receipt, row)
        rows.append(row)
        print(partition, row['id'], 'stored', flush=True)
    assert len(rows) == 24
    save(output / 'sources.json', {'schemaVersion': 'vl-new-source-acquisition-v1', 'selectionSha256': sha(selection.read_bytes()), 'images': rows, 'scope': 'Previously unused file IDs and hashes; metadata-selected families, not independently adjudicated semantic negatives or natural contamination.'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('operation', choices=['metadata', 'development', 'holdout'])
    args = parser.parse_args()
    metadata() if args.operation == 'metadata' else download(args.operation)
