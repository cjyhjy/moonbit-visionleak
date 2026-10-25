#!/usr/bin/env python3
"""Build controlled transforms of licensed photographs, preserving original files."""
import argparse
from collections import Counter
import hashlib
import itertools
import json
from pathlib import Path
import shutil

from PIL import Image, ImageEnhance, ImageOps, PngImagePlugin
import importlib.util
_spec = importlib.util.spec_from_file_location('synthetic_fixture_helpers', Path(__file__).with_name('generate-fixtures.py'))
_helpers = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_helpers)
canonical_pixels = _helpers.canonical_pixels

ROOT = Path(__file__).resolve().parents[1]


def generate(destination):
    manifest_path = ROOT/'research/photos-v1/sources.json'
    protocol_path = ROOT/'research/photos-v1/protocol.json'
    manifest = json.loads(manifest_path.read_text())
    protocol = json.loads(protocol_path.read_text())
    destination.mkdir(parents=True, exist_ok=False)
    for partition in ['development', 'holdout']:
        directory = destination/partition
        for split in ['train', 'validation', 'test']:
            (directory/split).mkdir(parents=True)
        images = []

        def add(item, split, transform, image=None, copy=None, **options):
            extension = '.jpg' if 'quality' in options else '.png'
            relative = f'{split}/{item["id"]}-{transform}{extension}'
            path = directory/relative
            if copy:
                shutil.copyfile(directory/copy, path)
            else:
                image.save(path, **options)
            with Image.open(path) as decoded:
                pixels = canonical_pixels(decoded)
                width, height = decoded.size
            images.append({'id':relative, 'path':relative, 'split':split,
                           'sourceId':item['id'], 'partition':partition, 'transform':transform,
                           'width':width, 'height':height, 'byteDigest':hashlib.sha256(path.read_bytes()).hexdigest(),
                           'canonicalPixelDigest':hashlib.sha256(pixels).hexdigest(), 'bytes':path.stat().st_size,
                           'provenance':'controlled-transform-of-licensed-photograph'})
            return relative

        for item in manifest['images']:
            if item['partition'] != partition:
                continue
            source = ROOT/'research/photos-v1/originals'/item['file']
            if hashlib.sha256(source.read_bytes()).hexdigest() != item['sha256']:
                raise ValueError(f"Original changed: {item['id']}")
            with Image.open(source) as image:
                base = ImageOps.exif_transpose(image).convert('RGB')
                base.thumbnail((protocol['baseMaxSide'], protocol['baseMaxSide']), Image.Resampling.LANCZOS)
            original = add(item, 'train', 'original', base, compress_level=6)
            add(item, 'test', 'byte-copy', copy=original)
            metadata = PngImagePlugin.PngInfo()
            metadata.add_text('fixture', 'Same decoded pixels; different PNG metadata and compression')
            add(item, 'validation', 'png-repack', base, compress_level=1, pnginfo=metadata)
            add(item, 'test', 'jpeg-quality70', base, quality=70, subsampling=2, optimize=False)
            width, height = base.size
            add(item, 'validation', 'resize-73percent', base.resize((width*73//100, height*73//100), Image.Resampling.LANCZOS))
            add(item, 'test', 'brightness-1.15', ImageEnhance.Brightness(base).enhance(1.15))
            reflected = ImageOps.mirror(base)
            add(item, 'validation', 'horizontal-mirror', reflected)
            add(item, 'validation', 'mirror-jpeg-quality70', reflected, quality=70, subsampling=2, optimize=False)
            crop = base.crop((width*5//100, height*5//100, width-width*5//100, height-height*5//100))
            add(item, 'test', 'center-crop-90percent', crop.resize(base.size, Image.Resampling.LANCZOS))
            add(item, 'test', 'rotate90', base.transpose(Image.Transpose.ROTATE_90))
        images.sort(key=lambda r:r['id'])
        pairs = []
        for left, right in itertools.combinations(images, 2):
            if left['split'] == right['split']:
                continue
            if left['byteDigest'] == right['byteDigest']:
                relation = 'byte-identical'
            elif (left['width'], left['height'], left['canonicalPixelDigest']) == (right['width'], right['height'], right['canonicalPixelDigest']):
                relation = 'pixel-identical'
            elif left['sourceId'] == right['sourceId']:
                relation = 'near-source'
            else:
                relation = 'negative'
            pairs.append({'left':left['id'], 'right':right['id'], 'relation':relation})
        truth = {'schemaVersion':'visionleak-photo-truth-v1', 'name':f'licensed-photos-v1-{partition}',
                 'partition':partition, 'images':images, 'pairs':pairs,
                 'counts':dict(Counter(p['relation'] for p in pairs)),
                 'totalBytes':sum(i['bytes'] for i in images),
                 'sourcesSha256':hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
                 'protocolSha256':hashlib.sha256(protocol_path.read_bytes()).hexdigest()}
        (directory/'ground-truth.json').write_text(json.dumps(truth, indent=2)+'\n')
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=ROOT/'fixtures/photos-v1')
    args = parser.parse_args()
    print(generate(args.out))


if __name__ == '__main__':
    main()
