# 裁切质量实验：有限原型与冻结保留集

2026-11-03。结论：停止 154 窗口路线；ORB800 通过预设开发与新来源保留集门槛，保留为研究原型，值得进入单独的产品集成设计。它没有进入已发布的 0.7.0，也没有升级为确定性证据。

## 协议与来源

协议见 [`protocol.json`](../../research/followup-quality/protocol.json)。两个原型家族，固定三个配置（grid154、ORB400、ORB800），各运行一次；运行前声明召回、精度、误报率、候选量、60 秒和 512 MiB 门槛。开发集取 24 个已知来源；全部 54 个旧来源（含 photos-v3）都列入保留集排除名单。

每个来源产生六个查询：小/中/大三档，各含随机宽高、随机整数偏移的 PNG 裁切及缩放/JPEG75 裁切。只比较裁切查询与原图，原图和所有变体始终留在同一来源分区。没有用裁切之间相互匹配替代原图召回。来源与生成文件均校验摘要；源照片只读。

开发结果选出 ORB800 后，先写入 [`holdout-freeze.json`](../../research/followup-quality/holdout-freeze.json)，再按四个预声明场景获取元数据，固定前 3 个合格 CC0 文件，保存选择冻结记录，然后下载像素。12 个保留来源的 ID 和上游文件 SHA-1 均不与已知来源重叠。[来源与许可](../../research/followup-quality/holdout/ATTRIBUTION.md)。不同文件来源作为负例，尚无人工语义裁决。

## 结果

| 分区/配置 | 原图—裁切 TP / FP / FN | 召回 | 精度 | 小裁切召回 | 秒 | 峰值 MiB | 预设门槛 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 开发 v1 参考 | 38 / 10 / 106 | 26.4% | 79.2% | 10.4% | 0.289 | 57.0 | 未通过 |
| 开发 grid154 | 84 / 28 / 60 | 58.3% | 75.0% | 22.9% | 0.383 | 56.9 | 未通过，停止 |
| 开发 ORB400 | 134 / 0 / 10 | 93.1% | 100% | 85.4% | 4.391 | 99.7 | 通过 |
| 开发 ORB800 | 136 / 0 / 8 | 94.4% | 100% | 89.6% | 14.701 | 109.2 | 通过，按预设规则选中 |
| 新来源 v1 参考 | 16 / 2 / 56 | 22.2% | 88.9% | 4.2% | 0.142 | 49.0 | 未通过 |
| 新来源 ORB800 | 67 / 0 / 5 | 93.1% | 100% | 79.2% | 3.634 | 89.8 | 通过 |

开发集每项完整处理 3,456 个原图—查询配对（144 正例、3,312 文件来源负例）；保留集每项完整处理 864 对（72 正例、792 负例）。所有 FP、FN、裁切矩形和几何见证保存在各配置 JSON，未删难例。零 FP 是这批文件来源标签下的观察，不是现实准确率保证。原 0.7.0 冻结协议的 0/24 结论保留；本实验来源、裁切范围和查询数不同，不能直接拼接两者指标。

表中时间和内存是 Python 研究计算流程，包含特征提取与匹配，不包含来源下载、样本预生成或另外执行的 Core oracle；不能当作生产 CLI 耗时。单次计时只用于预设资源门槛。ORB800 开发耗时约为 Python v1 参考的 51 倍，产品规模成本仍待解决。

## 证据合同与覆盖

v1 参考的每张图的局部哈希/对比度以及完整候选集合，都与真实 0.7.0 Core 核对一致。实际 Core 的分阶段覆盖、配对和证据类别单独保存于 `development/core-reference-evidence.json`、`holdout/core-reference-evidence.json`：开发集全图候选 TP6/FP0、局部候选 TP32/FP10；保留集全图 TP2/FP0、局部 TP14/FP2；两组确定性配对均为 0。

ORB800 的 profile 是 `vl-orb-geometry-research-v1`：每图最多 800 个二进制描述子，互相最近邻、距离/比率过滤，再做有迭代上限的部分仿射 RANSAC；要求至少 8 个内点、50% 内点比例、查询覆盖和映射范围门槛。它只产生研究候选，需人工复核。分数、支持点数量和几何一致性均不代表泄漏概率。对照实现依照 [OpenCV ORB](https://docs.opencv.org/4.13.0/d1/d89/tutorial_py_orb.html)、[二进制特征匹配](https://docs.opencv.org/4.13.0/dc/dc3/tutorial_py_matcher.html) 和 [几何估计 API](https://docs.opencv.org/4.13.0/d9/d0c/group__calib3d.html) 使用固定版本依赖。

没有全图相似度粗筛；每个原图—查询都被测试。描述子数量上限、比率过滤和有限 RANSAC 仍可能漏检，“配对处理完整”不等于“任意裁切检测完整”。该原型不执行 Core 的确定性阶段，也不把它们记为已完成。

## 无效运行与停止记录

首次 v1 参考的逐图 Core oracle 拒绝了结果：Pillow 保留 ICC 元数据，却未应用产品相同的 sRGB 转换。修正仅在样本准备阶段统一调用产品解码器；所有来源重新生成，裁切随机种子、矩形规则、算法参数和门槛未变。原脚本/协议/冻结记录保存在 `research/followup-quality/archive/pre-color-normalization/`，无效结果和错误见 `invalid-pre-color-normalization/`。修正发生在任何原型测量之前，之后重新冻结；无效运行不计入算法效果。

grid154 的整体召回、小裁切召回和精度都未达标，停止加窗口或调阈值。ORB800 的保留集 5 个漏检全部为小裁切，列表见 `holdout-decision.json`。不继续调这个保留集。

## 复现与下一步

在干净检出中安装项目依赖，并按 `research/followup-quality/requirements.txt` 建立独立 Python 环境。原始来源和全部冻结记录已归档，不必重新联网下载：

```sh
python3.13 -m venv output/crop-repro-venv
output/crop-repro-venv/bin/pip install -r research/followup-quality/requirements.txt
output/crop-repro-venv/bin/python research/followup-quality/experiment.py prepare --manifest research/followup-quality/holdout/sources.json --out output/crop-repro
output/crop-repro-venv/bin/python research/followup-quality/experiment.py evaluate --dataset output/crop-repro --profile v1-reference --out output/crop-repro-v1.json
output/crop-repro-venv/bin/python research/followup-quality/experiment.py evaluate --dataset output/crop-repro --profile orb800 --out output/crop-repro-orb800.json
```

程序拒绝覆盖已有结果。复现不用于继续调参。生产集成仍需：明确 MoonBit/宿主边界和 OpenCV 依赖成本，设计能计账并中断的描述子/几何预算及新证据类型，研究可扩展检索且单独测量过滤召回，再做自然污染和真人复核评测。当前只支持进入这些后续工作，不能据小样本宣称真实大规模适用。
