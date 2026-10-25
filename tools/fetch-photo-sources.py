#!/usr/bin/env python3
"""Fetch only the pinned, explicitly licensed photo samples; verify before saving."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=ROOT/'research/photos-v1/originals')
    args = parser.parse_args()
    records = json.loads((ROOT/'research/photos-v1/sources.json').read_text())['images']
    args.out.mkdir(parents=True, exist_ok=True)

    def fetch(item):
        destination = args.out/item['file']
        if destination.exists():
            data = destination.read_bytes()
        else:
            with urlopen(item['downloadUrl'], timeout=45) as response:
                data = response.read(16*1024*1024 + 1)
        if hashlib.sha256(data).hexdigest() != item['sha256']:
            raise ValueError(f"Source hash mismatch: {item['id']}")
        if not destination.exists():
            with destination.open('xb') as output:
                output.write(data)
        return {'id':item['id'], 'sha256':item['sha256'], 'bytes':len(data)}

    with ThreadPoolExecutor(max_workers=4) as pool:
        for record in pool.map(fetch, records):
            print(json.dumps(record), flush=True)


if __name__ == '__main__':
    main()
