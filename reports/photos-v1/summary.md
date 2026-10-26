# 真实照片受控评测：0.4.0

10 张来自 scikit-image 0.25.2 的 CC0 / 公有领域照片，原文件与官方 SHA-256 一致。[逐张来源与许可](../../research/photos-v1/ATTRIBUTION.md) · [来源清单](../../research/photos-v1/sources.json) · [样本缩略总览](../../research/photos-v1/contact-sheet.jpg)。

先固定协议与来源分组，在 5 个开发来源上发现旋转漏检并确定可选直角旋转方案，再冻结检测实现并检验 5 个保留来源。原 0.3.0 报告保存在 baseline-*，改进结果在 current-*；默认和镜像模式的 pairs、groups、stats 与基线逐项相同。

每个来源生成 10 个样本，共 100 张。两组各运行完整 CLI，分别评估组内全部跨 split 配对。合并数为两个独立实验的加总，不含跨开发/保留组的配对。train/validation/test 是故意放入同源图片的审计目录，与开发/保留来源划分是两回事。

| 来源组 | 模式 | TP | FP | FN | Recall | 核心工作计数 | CLI 中位秒 |
|---|---|---:|---:|---:|---:|---:|---:|
| development | default | 42 | 0 | 88 | 32.31% | 569 | 0.349 |
| development | mirrors | 84 | 0 | 46 | 64.62% | 2250 | 0.411 |
| development | orientations | 109 | 0 | 21 | 83.85% | 16364 | 0.640 |
| holdout | default | 47 | 0 | 83 | 36.15% | 584 | 0.330 |
| holdout | mirrors | 91 | 0 | 39 | 70.00% | 2382 | 0.372 |
| holdout | orientations | 116 | 0 | 14 | 89.23% | 16444 | 0.586 |

近似任务排除了所有精确真值对；两组合计有 1160 个跨来源负例，本次三种模式均未产生误报。这不证明生产环境零误报，尤其只有 10 个来源，且同源衍生对高度相关。精确证据在每组均为 TP15 / FP0 / FN0。

默认：无额外方向；mirrors：水平镜像；orientations：同时启用水平镜像和 90/180/270° 顺时针旋转，均使用阈值 6。旋转之后再水平镜像；最小方向距离仍是候选，不变成像素相同。

## 改进、代价与剩余漏检

保留组近似 TP91→116，FN39→14；旋转原图配对 0/5→5/5；中心裁切原图配对保持 2/5。新增方向没有移除已有候选。旋转模式的剩余近似漏检均涉及中心裁切。几何方向扩展不解决局部主体或任意裁切。

保留组核心工作计数 2,382→19,396；固定预算下可能更早 incomplete。旋转和镜像均默认关闭。不要仅因为这组召回提高就把全方向搜索当作通用默认。跨来源误报详情和所有漏检路径、来源、变换都保存在每份 evaluation.json 的 falsePositives / falseNegatives。

## 独立核对与复现

全部 100 张样本在原方向、镜像及三种旋转/对应镜像上，通过独立 RGBA 变换、规范化像素和 ImageHash 对照；每次 CLI 的索引结果、距离、精确优先、方向解释及唯一性与穷举参考一致。完整图像清单和真值摘要也经过核对。

```sh
python3 tools/fetch-photo-sources.py
# 下面的生成命令要求目标目录尚不存在，便于与随包样本逐字比较
research/.venv-oracle/bin/python tools/generate-photo-fixtures.py --out /tmp/visionleak-photos-fresh
research/.venv-oracle/bin/python tools/evaluate-photos.py --partition holdout --out output/photo-evaluation --include-orientations
node tools/cli.mjs audit --root fixtures/photos-v1/holdout --out output/photo-review --include-mirrors --include-rotations
node tools/server.mjs --report output/photo-review/report.json --port 4173
```

这些正例是对真实照片施加已知变换后构造的同源关系，不是从生产数据集发现的自然泄漏。未使用保留组调阈值。裁切、任意角度旋转、语义泄漏、大规模照片库及跨平台效果仍需单独验证。
