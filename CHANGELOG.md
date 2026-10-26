# Changelog

## 0.6.0 — performance, review and integration contracts

- MIH prefilter retains BK-tree witness order; work counts and budget-limited prefixes may change.
- Bounded canonical RGB hashing; review decision shortcuts and local-window overlays.
- Machine-readable capabilities from executable limits; explicit exact-only verification scope.
- Published 0.5.0 archives remain immutable. See docs/optimization.md for validation and experimental work.

## 0.5.0 — published

- CI gates by evidence level; deterministic file verification; coverage summaries.
- Offline HTML, reviewed suggestions CSV and stable group keys; candidate grouping and low-contrast collapse.
- Full-resolution streaming pixel identity; split aliases; core policy and metrics in MoonBit with independent Python scoring.
- Experimental opt-in local crop candidates, source/scene-disjoint CC0 evaluation and resource benchmarks.
- Breaking CLI change: `--max-pixels` now limits perceptual sampling. Use `--max-decode-pixels` to reject oversized sources; see docs/changes-0.5.0.md.
- GitHub Release and Mooncakes publication completed; see [publication receipts](reports/plan-0.5.0/publication-0.5.0/README.md). npm remains private.

## 0.4.0 真实照片与直角旋转

新增 10 张来源/许可证明确的真实照片及 100 张受控变换评测。保留来源组的近似召回：默认 36.15%、镜像 70.00%、镜像加旋转 89.23%；当前无跨来源误报，裁切仍漏检。新增默认关闭的 `--include-rotations`，额外开销和来源范围完整保留。[本轮改进](docs/changes-0.4.0.md) · [照片评测](reports/photos-v1/summary.md) · [许可清单](research/photos-v1/ATTRIBUTION.md)。

## 0.3.0 镜像候选

新增 `--include-mirrors`，由 MoonBit 检索原图及水平镜像指纹，报告和工作台明确显示匹配方向。现有合成评测近似召回 78.82%→89.41%，误报 2→4；因此默认关闭，候选仍需人工复核。[算法、权衡和完整结果](docs/changes-0.3.0.md)。

## 0.2.0 改进

保持检测阈值与结果语义，优化核心距离计算；复核界面新增待复核连续导航、单步撤销、未复核/暂不确定计数和键盘操作。报告导入及本地服务现在核对内容摘要，拒绝内容变化后沿用旧 auditId。修复符号链接输出路径可能提前创建源目录的问题，并同步固定版本 CI 与工具链引导脚本。详见 [本轮变更](docs/changes-0.2.0.md)。
