#!/usr/bin/env python3
"""Run the actual CLI, then independently score it and check ImageHash parity."""
from __future__ import annotations

import argparse
import base64
import hashlib
import importlib.metadata
import itertools
import json
import platform
import random
import struct
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

import imagehash
from PIL import Image

PROJECT = Path(__file__).resolve().parents[1]
EXACT = {"byte-identical", "pixel-identical"}


def canonical(width, height, rgba):
    rgb, gray = bytearray(), []
    for offset in range(0, len(rgba), 4):
        r, g, b, a = rgba[offset:offset + 4]
        r, g, b = ((c * a + 255 * (255 - a) + 127) // 255 for c in (r, g, b))
        rgb.extend((r, g, b))
        gray.append((299 * r + 587 * g + 114 * b + 500) // 1000)
    grid = []
    for y in range(8):
        y0 = y * height // 8
        y1 = min(height, max(y0 + 1, (y + 1) * height // 8))
        for x in range(9):
            x0 = x * width // 9
            x1 = min(width, max(x0 + 1, (x + 1) * width // 9))
            values = [gray[yy * width + xx] for yy in range(y0, y1) for xx in range(x0, x1)]
            grid.append(sum(values) // len(values))
    grid_image = Image.frombytes("L", (9, 8), bytes(grid))
    external_hash = imagehash.dhash(grid_image, hash_size=8)
    bits = "".join("1" if v else "0" for v in external_hash.hash.flatten())
    digest = hashlib.sha256(b"VL1" + struct.pack(">II", width, height) + rgb).hexdigest()
    return {"width": width, "height": height, "pixelDigest": digest,
            "dhash": bits, "contrast": max(gray) - min(gray)}, bytes(rgb), grid


def pair_key(left, right):
    return tuple(sorted((left, right)))


def metrics(positive, predicted, universe):
    predicted = predicted & universe
    tp = positive & predicted
    fp = predicted - positive
    fn = positive - predicted
    tn = universe - positive - predicted
    return {"tp": len(tp), "fp": len(fp), "fn": len(fn), "tn": len(tn),
            "precision": len(tp) / len(predicted) if predicted else None,
            "recall": len(tp) / len(positive) if positive else None,
            "falsePositiveRate": len(fp) / (len(fp) + len(tn)) if fp or tn else None,
            "falsePositives": [list(p) for p in sorted(fp)],
            "falseNegatives": [list(p) for p in sorted(fn)]}


def score(truth, pairs):
    labels = {pair_key(p["left"], p["right"]): p["relation"] for p in truth["pairs"]}
    universe = set(labels)
    exact_truth = {p for p in universe if labels[p] in EXACT}
    near_truth = {p for p in universe if labels[p] == "near-source"}
    exact_predictions = {pair_key(p["left"], p["right"]) for p in pairs if p["evidence"] in EXACT}
    near_predictions = {pair_key(p["left"], p["right"]) for p in pairs
                        if p["evidence"] == "perceptual-candidate"}
    unknown = (exact_predictions | near_predictions) - universe
    if unknown:
        raise ValueError(f"Audit emitted unknown or same-split pairs: {sorted(unknown)}")
    wrong_tier = [p for p in pairs if p["evidence"] in EXACT and
                  labels[pair_key(p["left"], p["right"])] != p["evidence"]]
    challenge_images = {r["id"] for r in truth.get("images", [])
                        if r.get("transform", "").startswith("challenge-")}
    challenge_universe = {p for p in universe - exact_truth if set(p) & challenge_images}
    common_universe = universe - exact_truth - challenge_universe
    return {"exact": metrics(exact_truth, exact_predictions, universe),
            # Exact ground truth pairs are EXCLUDED, not added as easy positives.
            "nearOnly": metrics(near_truth, near_predictions, universe - exact_truth),
            "nearCommonTransforms": metrics(near_truth & common_universe, near_predictions, common_universe),
            "nearChallengeTransforms": metrics(near_truth & challenge_universe, near_predictions, challenge_universe),
            "exactEvidenceTierMismatches": wrong_tier,
            "exactPairsEmittedAsCandidates": len(near_predictions & exact_truth),
            "pairUniverse": len(universe), "nearOnlyUniverse": len(universe - exact_truth)}


def vectors():
    rng = random.Random(894731)
    result = []
    for width, height in ((1, 1), (1, 13), (13, 1), (2, 3), (9, 8), (17, 13), (31, 27)):
        result.append({"id": f"seeded-rgba-{width}x{height}", "width": width, "height": height,
                       "rgba": [rng.randrange(256) for _ in range(width * height * 4)]})
    for name, rgba in (
        ("rising", [v for y in range(8) for x in range(9) for v in (x * 25, x * 25, x * 25, 255)]),
        ("falling", [v for y in range(8) for x in range(9) for v in (250 - x * 25,) * 3 + (255,)]),
        ("fully-transparent", [v for y in range(8) for x in range(9) for v in (x * 20, y * 20, 33, 0)]),
        ("flat", [128, 128, 128, 255] * 72),
    ):
        result.append({"id": name, "width": 9, "height": 8, "rgba": rgba})
    return result


def run_bridge(request):
    proc = subprocess.run(["node", "tests/oracle-runner.mjs"], input=json.dumps(request),
                          cwd=PROJECT, text=True, capture_output=True, timeout=180)
    if proc.returncode:
        raise RuntimeError(f"Oracle bridge failed ({proc.returncode}): {proc.stderr}")
    return json.loads(proc.stdout)


def golden_oracle(root, truth):
    cases = vectors()
    observed = run_bridge({"mode": "vectors", "items": cases})
    checks = []
    for vector, actual in zip(cases, observed, strict=True):
        expected, _, grid = canonical(vector["width"], vector["height"], vector["rgba"])
        checks.append({"id": vector["id"], "expected": expected, "actual": actual["fingerprint"],
                       "canonical9x8Gray": grid,
                       "passed": actual["fingerprint"].get("ok") is True and all(
                           actual["fingerprint"].get(key) == value for key, value in expected.items())})
    actual_images = run_bridge({"mode": "files", "root": str(root),
                               "paths": [r["path"] for r in truth["images"]]})
    image_checks, baselines = [], {}
    for item in actual_images:
        rgba = base64.b64decode(item["rgbaBase64"])
        expected, _, _ = canonical(item["width"], item["height"], rgba)
        with Image.open(root / item["path"]) as image:
            pil_expected, pil_rgb, _ = canonical(image.width, image.height, image.convert("RGBA").tobytes())
            pil_image = Image.frombytes("RGB", image.size, pil_rgb)
            default_hash = imagehash.dhash(pil_image, hash_size=8)
            default_bits = "".join("1" if bit else "0" for bit in default_hash.hash.flatten())
        baselines[item["path"]] = {"canonical": pil_expected["dhash"], "default": default_bits,
                                   "node": item["fingerprint"]["dhash"]}
        image_checks.append({"path": item["path"], "coreMatchesImageHashOnCanonicalGrid":
                             item["fingerprint"].get("ok") is True and all(
                                 item["fingerprint"].get(key) == value for key, value in expected.items()),
                             "nodeAndPillowCanonicalPixelsMatch": expected["pixelDigest"] == pil_expected["pixelDigest"],
                             "nodeAndPillowCanonicalHashDistance": sum(a != b for a, b in zip(expected["dhash"], pil_expected["dhash"])),
                             "imageHashDefaultVsVisionLeakDistance": sum(a != b for a, b in zip(default_bits, expected["dhash"]))})
    source = Path(imagehash.__file__).read_bytes()
    return {"oracle": "ImageHash.dhash(hash_size=8) on explicitly canonical 9x8 L-mode pixels",
            "oracleSourceSha256": hashlib.sha256(source).hexdigest(),
            "claimBoundary": "Parity tests hash direction/order, canonicalization, sampling and pixel digest. Pillow-default LANCZOS dHash is a separate baseline, not a promised bit-identical algorithm.",
            "vectorPassed": sum(c["passed"] for c in checks), "vectorTotal": len(checks),
            "imagePassed": sum(c["coreMatchesImageHashOnCanonicalGrid"] for c in image_checks),
            "imageTotal": len(image_checks), "vectors": checks, "images": image_checks}, baselines


def baseline_pairs(truth, hashes, key, threshold):
    result = []
    for pair in truth["pairs"]:
        # Evaluate ONLY approximation here; exact tier is separately scored on CLI.
        if pair["relation"] in EXACT:
            continue
        distance = sum(a != b for a, b in zip(hashes[pair["left"]][key], hashes[pair["right"]][key]))
        if distance <= threshold:
            result.append({"left": pair["left"], "right": pair["right"],
                           "evidence": "perceptual-candidate", "distance": distance})
    return result


def index_parity(report):
    """Independent exhaustive reference, intentionally used only on small fixtures."""
    expected = set()
    threshold = report["options"]["threshold"]
    for left, right in itertools.combinations(report["images"], 2):
        if left["split"] == right["split"]:
            continue
        if left["byteDigest"] == right["byteDigest"]:
            evidence = "byte-identical"
        elif (left["width"], left["height"], left["pixelDigest"]) == (
                right["width"], right["height"], right["pixelDigest"]):
            evidence = "pixel-identical"
        elif sum(a != b for a, b in zip(left["dhash"], right["dhash"])) <= threshold:
            evidence = "perceptual-candidate"
        else:
            continue
        expected.add((*pair_key(left["id"], right["id"]), evidence))
    actual = {(*pair_key(p["left"], p["right"]), p["evidence"]) for p in report["pairs"]}
    missing, unexpected = expected - actual, actual - expected
    duplicates = len(report["pairs"]) - len(actual)
    return {"expectedPairs": len(expected), "actualPairs": len(actual),
            "missingPairs": sorted(missing), "unexpectedPairs": sorted(unexpected),
            "duplicatePairs": duplicates, "passed": not missing and not unexpected and not duplicates}


def markdown(result):
    exact, near = result["scores"]["exact"], result["scores"]["nearOnly"]
    pct = lambda value: "未定义（无预测/正例）" if value is None else f"{value:.2%}"
    oracle = result["oracle"]
    rows = []
    for label, score in (("精确证据", exact), ("同源近似（排除精确对）", near),
                         ("其中：常规变换", result["scores"]["nearCommonTransforms"]),
                         ("其中：裁切/镜像挑战", result["scores"]["nearChallengeTransforms"])):
        rows.append(f"| {label} | {score['tp']} | {score['fp']} | {score['fn']} | {pct(score['precision'])} | {pct(score['recall'])} | {pct(score['falsePositiveRate'])} |")
    wall = result['audit']['wallSeconds']
    wall_description = f"{wall:.3f} 秒" if wall is not None else "未测量（使用已有报告）"
    text = ["# VisionLeak 可复现评测", "", "所有测试图片均由确定性脚本生成，不是真实数据集泄漏发现。",
            "", f"本次输入 {result['dataset']['images']} 张 PNG/JPEG，{result['dataset']['totalBytes']:,} 字节；跨 split 成对空间 {result['scores']['pairUniverse']} 对。",
            f"主审计阈值 {result['threshold']}，complete={result['audit']['complete']}，CLI 墙钟 {wall_description}（含 Node 启动、解码、MoonBit 计算与报告写入；单次本机测量）。", "",
            "| 任务 | TP | FP | FN | Precision | Recall | 假阳性率 |", "| --- | ---: | ---: | ---: | ---: | ---: | ---: |", *rows, "",
            "精确真值由文件字节或规范化像素等价定义；近似真值由共同生成来源定义，且所有精确真值对从近似评价分母移除。不同生成来源即使 dHash 相同仍是负例。",
            "", f"外部 oracle：{oracle['vectorPassed']}/{oracle['vectorTotal']} 个 RGBA 边界/随机向量，{oracle['imagePassed']}/{oracle['imageTotal']} 个实际解码图像通过 ImageHash canonical-grid 比较。",
            "ImageHash 在相同 9×8 灰度网格上独立计算 dHash。VisionLeak 的整数分区平均与 ImageHash 默认 LANCZOS 缩放不同，因此另列默认 ImageHash 基线，不声称二者端到端 bit 相同。", "",
            f"候选索引与独立穷举参考一致：{result['indexParity']['passed']}，参考 {result['indexParity']['expectedPairs']} 对、实际 {result['indexParity']['actualPairs']} 对；这只证明该有限样本下未漏掉满足算法条件的配对，不证明所有同源变换可识别。", "",
            "## 阈值扫描（仅同源近似，所有精确真值已排除）", "",
            "| 阈值 | VisionLeak 指纹全对参考 TP/FP/FN | 默认 ImageHash TP/FP/FN |", "| ---: | --- | --- |"]
    for row in result["thresholdSweep"]:
        a, b = row["visionLeakFingerprintReference"], row["imageHashDefault"]
        text.append(f"| {row['threshold']} | {a['tp']}/{a['fp']}/{a['fn']} | {b['tp']}/{b['fp']}/{b['fn']} |")
    text += ["", "阈值扫描使用已计算指纹进行穷举，是离线灵敏度分析，不是运行候选索引的性能测试。主结果来自真正 CLI。参考列直接按 Hamming 距离比较，不施加额外候选过滤。未根据这套测试集声称通用最优阈值。", "",
             "## 误报与漏报", "", "完整路径对保存在 evaluation.json 的 falsePositives/falseNegatives 字段。"]
    for label, values in (("近似误报", near["falsePositives"]), ("近似漏报", near["falseNegatives"])):
        text.append(f"\n{label}：{len(values)} 对。")
        for left, right in values[:12]:
            text.append(f"- `{left}` ↔ `{right}`")
        if len(values) > 12:
            text.append("- 其余见 JSON 原始结果。")
    text += ["", "## 边界", "", "本基准只有程序合成纹理/形状和受控变换，没有自然照片或公开真实污染集。少量裁切/镜像图仅作为失败挑战，不构成旋转、复杂编辑的完整覆盖。dHash 既会碰撞也会漏检，候选不是同源证明；高 precision 也不能证明数据集无泄漏。JPEG 不同解码器的像素差异按图记录，不能把跨解码器相同像素当作通用保证。",
             "", "没有运行 FiftyOne/MoonSplit 性能对比，不能据此声称更快、更准确或功能更完整。环境版本、命令、SHA-256 和原始 CLI 报告随 JSON 保存。", ""]
    return "\n".join(text)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=PROJECT / "fixtures" / "benchmark")
    parser.add_argument("--threshold", type=int, default=6)
    parser.add_argument("--out", type=Path, default=PROJECT / "reports" / "evaluation.json")
    parser.add_argument("--report", type=Path, help="Score an existing audit report instead of invoking CLI")
    args = parser.parse_args()
    root = args.root.resolve()
    truth_raw = (root / "ground-truth.json").read_bytes()
    truth = json.loads(truth_raw)
    for record in truth["images"]:
        actual = hashlib.sha256((root / record["path"]).read_bytes()).hexdigest()
        if actual != record["byteDigest"]:
            raise ValueError(f"Fixture was altered: {record['path']}")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    if args.report:
        report_raw = args.report.read_bytes()
        command = ["existing-report", args.report.name]
        elapsed = None
        exit_code = None
    else:
        with tempfile.TemporaryDirectory(prefix="evaluation-", dir=args.out.parent) as tmp:
            command = ["node", "tools/cli.mjs", "audit", "--root", str(root), "--out", str(Path(tmp) / "audit"),
                       "--threshold", str(args.threshold)]
            start = time.perf_counter()
            run = subprocess.run(command, cwd=PROJECT, capture_output=True, text=True, timeout=300)
            elapsed = time.perf_counter() - start
            exit_code = run.returncode
            report_path = Path(tmp) / "audit" / "report.json"
            if not report_path.exists():
                raise RuntimeError(f"CLI failed ({exit_code}): {run.stderr}\n{run.stdout}")
            report_raw = report_path.read_bytes()
    report = json.loads(report_raw)
    expected_ids = {r["id"] for r in truth["images"]}
    observed_ids = {r["id"] for r in report["images"]}
    image_coverage = {"expectedImages": len(expected_ids), "actualImages": len(observed_ids),
                      "missingImages": sorted(expected_ids - observed_ids),
                      "unexpectedImages": sorted(observed_ids - expected_ids),
                      "duplicateIds": len(report["images"]) - len(observed_ids),
                      "passed": expected_ids == observed_ids and len(report["images"]) == len(observed_ids)}
    # Published commands are portable and do not leak a user's absolute paths.
    if not args.report:
        root_label = str(root.relative_to(PROJECT)) if root.is_relative_to(PROJECT) else "<dataset-root>"
        command = ["node", "tools/cli.mjs", "audit", "--root", root_label, "--out", "<fresh-output>", "--threshold", str(args.threshold)]
    if report["options"]["threshold"] != args.threshold:
        raise ValueError("Report threshold differs from requested evaluation threshold")
    oracle, baselines = golden_oracle(root, truth)
    sweep = []
    for threshold in (0, 2, 4, 6, 8, 10, 16):
        sweep.append({"threshold": threshold,
                      "visionLeakFingerprintReference": score(truth, baseline_pairs(truth, baselines, "node", threshold))["nearOnly"],
                      "imageHashCanonicalGrid": score(truth, baseline_pairs(truth, baselines, "canonical", threshold))["nearOnly"],
                      "imageHashDefault": score(truth, baseline_pairs(truth, baselines, "default", threshold))["nearOnly"]})
    result = {"schemaVersion": 1, "generatedAt": datetime.now(timezone.utc).isoformat(),
              "dataset": {"name": truth["name"], "images": len(truth["images"]), "totalBytes": truth["totalBytes"],
                          "counts": truth["counts"], "groundTruthSha256": hashlib.sha256(truth_raw).hexdigest()},
              "threshold": args.threshold,
              "environment": {"python": platform.python_version(), "platform": platform.platform(),
                              "packages": {name: importlib.metadata.version(name) for name in ("ImageHash", "Pillow", "numpy", "scipy", "PyWavelets")},
                              "node": subprocess.check_output(["node", "--version"], text=True).strip()},
              "audit": {"command": command, "exitCode": exit_code, "wallSeconds": elapsed,
                        "complete": report.get("complete"), "stats": report.get("stats"),
                        "options": report.get("options"), "reportSha256": hashlib.sha256(report_raw).hexdigest()},
              "scores": score(truth, report["pairs"]), "oracle": oracle, "thresholdSweep": sweep,
              "indexParity": index_parity(report), "imageCoverage": image_coverage,
              "implementationSha256": {name: hashlib.sha256((PROJECT / name).read_bytes()).hexdigest()
                                       for name in ("dist/visionleak.js", "tools/cli.mjs", "tools/decode.mjs", "tools/evaluate.py", "tools/generate-fixtures.py")}}
    args.out.write_text(json.dumps(result, indent=2) + "\n")
    args.out.with_suffix(".md").write_text(markdown(result))
    args.out.with_name(args.out.stem + "-audit.json").write_bytes(report_raw)
    args.out.with_name(args.out.stem + "-oracle.json").write_text(json.dumps(oracle, indent=2) + "\n")
    print(json.dumps({"images": len(truth["images"]), "complete": report.get("complete"),
                      "exact": result["scores"]["exact"], "nearOnly": result["scores"]["nearOnly"],
                      "oracleVectors": [oracle["vectorPassed"], oracle["vectorTotal"]],
                      "oracleImages": [oracle["imagePassed"], oracle["imageTotal"]]}, indent=2))
    if oracle["vectorPassed"] != oracle["vectorTotal"] or oracle["imagePassed"] != oracle["imageTotal"]:
        raise SystemExit("FAIL: external oracle mismatch")
    if not report.get("complete"):
        raise SystemExit("FAIL: incomplete audit; metrics are partial")
    if not result["indexParity"]["passed"]:
        raise SystemExit("FAIL: candidate index differs from independent exhaustive reference")
    if not image_coverage["passed"]:
        raise SystemExit("FAIL: report image inventory differs from ground truth")


if __name__ == "__main__":
    main()
