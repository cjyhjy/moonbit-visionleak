#!/usr/bin/env python3
"""Create deterministic, genuinely encoded images with explicit synthetic truth."""
from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, PngImagePlugin

PROJECT = Path(__file__).resolve().parents[1]


def canonical_pixels(image: Image.Image) -> bytes:
    out = bytearray()
    for r, g, b, a in image.convert("RGBA").getdata():
        out.extend((c * a + 255 * (255 - a) + 127) // 255 for c in (r, g, b))
    return bytes(out)


def scene(index: int) -> Image.Image:
    """Independent seeded low-frequency compositions, no downloaded assets."""
    rng = random.Random(20261022 + index * 7919)
    small = Image.new("RGB", (18, 16))
    pixels = [(rng.randrange(25, 231), rng.randrange(25, 231), rng.randrange(25, 231))
              for _ in range(18 * 16)]
    small.putdata(pixels)
    image = small.resize((180, 160), Image.Resampling.BICUBIC)
    draw = ImageDraw.Draw(image)
    for i in range(5):
        x, y = rng.randrange(140), rng.randrange(120)
        box = (x, y, x + rng.randrange(18, 41), y + rng.randrange(18, 41))
        color = tuple(rng.randrange(256) for _ in range(3))
        (draw.ellipse if (index + i) % 2 else draw.rectangle)(box, fill=color)
    return image


def generate(destination: Path) -> dict:
    # Never replace a directory that might contain user data. A fresh path also
    # makes byte-for-byte reproducibility an independently testable operation.
    destination.mkdir(parents=True, exist_ok=False)
    for split in ("train", "validation", "test"):
        (destination / split).mkdir()
    records = []

    def add(path: str, source: str, transform: str, image=None, copy=None, **options):
        target = destination / path
        if copy:
            target.write_bytes((destination / copy).read_bytes())
        else:
            image.save(target, **options)
        raw = target.read_bytes()
        with Image.open(target) as decoded:
            width, height = decoded.size
            canonical = canonical_pixels(decoded)
        records.append({"id": path, "path": path, "split": path.split("/")[0],
                        "sourceId": source, "transform": transform,
                        "width": width, "height": height, "bytes": len(raw),
                        "byteDigest": hashlib.sha256(raw).hexdigest(),
                        "canonicalPixelDigest": hashlib.sha256(canonical).hexdigest(),
                        "provenance": "deterministic-synthetic"})

    for index in range(8):
        source = f"scene-{index:02d}"
        original = scene(index)
        base = f"train/{source}.png"
        add(base, source, "original", original, compress_level=6)
        add(f"test/renamed-{index:02d}.png", source, "byte-copy-renamed", copy=base)
        metadata = PngImagePlugin.PngInfo()
        metadata.add_text("fixture", f"same decoded pixels; synthetic {index}")
        add(f"validation/repacked-{index:02d}.png", source, "png-lossless-reencoding",
            original, compress_level=1, pnginfo=metadata)
        add(f"test/quality72-{index:02d}.jpg", source, "jpeg-quality72",
            original, quality=72, subsampling=2, optimize=False)
        add(f"validation/resized-{index:02d}.png", source, "resize-126x112",
            original.resize((126, 112), Image.Resampling.LANCZOS), compress_level=6)
        brighter = original.point(lambda value: min(255, value + 18))
        add(f"test/brighter-{index:02d}.png", source, "brightness-plus18", brighter)
        if index < 2:
            add(f"test/cropped-{index:02d}.png", source, "challenge-crop-20percent",
                original.crop((18, 16, 162, 144)).resize(original.size, Image.Resampling.LANCZOS))
            add(f"validation/mirrored-{index:02d}.png", source, "challenge-horizontal-mirror",
                original.transpose(Image.Transpose.FLIP_LEFT_RIGHT))

    # Different independent pixel arrays with identical horizontal orderings.
    # They intentionally collide under dHash; they are not shared-origin copies.
    for index, split in enumerate(("train", "test")):
        image = Image.new("RGB", (180, 160))
        image.putdata([(20 + x, 20 + x // (index + 1), 25 + (y * (index + 1)) % 100)
                       for y in range(160) for x in range(180)])
        add(f"{split}/lookalike-ramp-{index}.png", f"independent-ramp-{index}",
            "independent-dhash-collision-negative", image)

    # Uniform images are separate negative sources, useful for low-information
    # candidate suppression. They must not become exact duplicates.
    add("train/flat-red.png", "flat-red", "low-information-negative",
        Image.new("RGB", (90, 80), (180, 20, 20)))
    add("test/flat-blue.png", "flat-blue", "low-information-negative",
        Image.new("RGB", (90, 80), (20, 20, 180)))

    # White-composited alpha identity is an exact canonical-pixel test.
    alpha = Image.new("RGBA", (90, 80))
    alpha.putdata([((x * 3) % 256, (y * 5) % 256, (x + y) % 256, (x * 7 + y * 3) % 256)
                   for y in range(80) for x in range(90)])
    white = Image.frombytes("RGB", alpha.size, canonical_pixels(alpha))
    add("train/alpha-source.png", "alpha-composite", "rgba-original", alpha)
    add("test/alpha-white.png", "alpha-composite", "white-alpha-composite", white)

    # A same-split duplicate is deliberately outside the cross-split universe.
    add("train/local-copy.png", "scene-00", "same-split-copy", copy="train/scene-00.png")
    records.sort(key=lambda row: row["id"])
    pairs = []
    for left, right in itertools.combinations(records, 2):
        if left["split"] == right["split"]:
            continue
        if left["byteDigest"] == right["byteDigest"]:
            relation = "byte-identical"
        elif (left["width"], left["height"], left["canonicalPixelDigest"]) == (
                right["width"], right["height"], right["canonicalPixelDigest"]):
            relation = "pixel-identical"
        elif left["sourceId"] == right["sourceId"]:
            relation = "near-source"
        else:
            relation = "negative"
        pairs.append({"left": left["id"], "right": right["id"], "relation": relation})
    counts = {relation: sum(p["relation"] == relation for p in pairs)
              for relation in ("byte-identical", "pixel-identical", "near-source", "negative")}
    result = {"schemaVersion": 1, "name": "visionleak-synthetic-v1", "seed": 20261022,
              "provenance": "Entirely procedural synthetic images; no real dataset leak is asserted.",
              "license": "CC0-1.0 for generated fixture image files",
              "generator": "tools/generate-fixtures.py",
              "canonicalPixels": "straight RGBA over white; (c*a+255*(255-a)+127)//255; RGB row-major",
              "truthPolicy": "All cross-split pairs are labelled. Exact uses byte/pixel equality; near-source uses declared common generator source only; independent sources are negatives, even when dHash collides.",
              "images": records, "pairs": pairs, "counts": counts,
              "totalBytes": sum(r["bytes"] for r in records)}
    (destination / "ground-truth.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=PROJECT / "fixtures" / "benchmark")
    args = parser.parse_args()
    truth = generate(args.out)
    print(json.dumps({"images": len(truth["images"]), "counts": truth["counts"],
                      "bytes": truth["totalBytes"], "out": str(args.out)}, indent=2))
