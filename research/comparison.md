# VisionLeak 邻近项目核查与具体差异

核查日期：2026-10-22。结论是存在成熟替代品和直接相邻的 MoonBit 项目；VisionLeak 是范围较窄的本地图像审计实现，不宣称图像去重、感知哈希、跨集合泄漏或人工复核的首创。此处不是赛事查重合格证明。

## 固定对象与证据边界

| 对象 | 固定版本 / 提交 | 已核实能力 | 本次验证方式 |
| --- | --- | --- | --- |
| MoonSplit | 源码 0.3.0，`b6a161773747f6e6b819e483ddfdb7e228a9fe59` | 声明精确键、Unicode 文本 Jaccard、同来源区间重叠、时间前向划分、独立审计 | 阅读固定源码和模块版本；未运行性能对比 |
| ImageHash | 4.3.2，tag `v4.3.2` 对应 `e1941e96898e56422f7df678dd094c8d5b2b46db` | aHash/pHash/dHash/wHash 等感知指纹 | **已在局部 Python venv 安装并实际运行**；见评测与外部 oracle |
| FiftyOne | 固定源码 `aacfc8182fc5353296b5edd7475e63335fedb5cb`；文档当次显示 1.22.0 | 数据集管理、相似度索引和交互复核 | 源码/官方文档核查；未安装、未测性能 |
| FiftyOne Brain | `ba978a12293fda9953b478f601ac8950d2a35aa4` | 精确重复、近似重复、**已有 `compute_leaky_splits`** | 固定源码公开函数核查 |
| moon-minhash | 源码 0.1.0，`2ed4dd5b1b9e6cfc4653862c4991bdd880f078b3` | MoonBit 文本特征、MinHash/SimHash、LSH、去重、precision/recall 等 | 固定 README 和 moon.mod 核查；未运行 |

MoonSplit 的当前源码已经超出旧版的 metadata-only 介绍，支持文本近似和区间规则。它同时明确把图像、音频、视频相似性排除在范围之外。VisionLeak 的图像证据可作为其上游分组信息的一种来源；VisionLeak 本身不实现 MoonSplit 的划分优化和时间前向规则。[MoonSplit 固定源码](https://github.com/AlexenderSokolov/moonsplit/blob/b6a161773747f6e6b819e483ddfdb7e228a9fe59/README.md)、[模块版本](https://github.com/AlexenderSokolov/moonsplit/blob/b6a161773747f6e6b819e483ddfdb7e228a9fe59/moon.mod)

ImageHash 的水平 dHash 使用灰度图，缩放到 9×8 后逐行比较右像素是否大于左像素。它是本次独立算法 oracle；VisionLeak 仍采用自己的明确整数取样合同，不能声称与 ImageHash 默认缩放逐位相同。[ImageHash 4.3.2 源码](https://github.com/JohannesBuchner/imagehash/blob/e1941e96898e56422f7df678dd094c8d5b2b46db/imagehash/__init__.py)

FiftyOne Brain 的精确去重按文件哈希，近似去重和跨 split 检查支持 embedding / 相似度索引；已有 `leaks_view`、`leaks_for_sample` 等复核能力。因此“跨 split + 浏览器复核”本身不是有效的独创性论据。[FiftyOne Brain 固定源码](https://github.com/voxel51/fiftyone-brain/blob/ba978a12293fda9953b478f601ac8950d2a35aa4/fiftyone/brain/__init__.py)、[官方 API 文档](https://docs.voxel51.com/api/fiftyone.brain.html)

moon-minhash 说明候选检索、确定性去重与评测在 MoonBit 生态已存在。VisionLeak 不把这些通用概念当作独占贡献；具体工作是规范化图像像素、三层证据、跨 split 配对及有限预算报告。[moon-minhash 固定源码](https://github.com/Hjyyutr/moon-minhash/blob/2ed4dd5b1b9e6cfc4653862c4991bdd880f078b3/README.md)

## 三个具体差异用例

### 1. 改名与无损重编码：一份报告内给出不同确定性证据

输入 `train/scene-00.png`、`test/renamed-00.png`、`validation/repacked-00.png`。第一个测试文件与原图字节相同；另一个 PNG 改了压缩/元数据但解码像素相同。VisionLeak 分别报告 `byte-identical` 和 `pixel-identical`，保留相对路径、split、SHA-256 与取样规范。仅检查文件字节会漏掉第二种等价关系。

MoonSplit 可在用户提供等价键后审计分组，但不从这些图片中生成该键。ImageHash 提供算法基元，使用者需要集成文件证据、集合关系和报告。FiftyOne 已覆盖精确/近似去重；VisionLeak 的差异是默认输出合同明确把规范化像素等价单列，不是声称 FiftyOne 无法通过扩展实现它。

### 2. 高相似不代表共同来源：复核证据而非自动清理

`train/lookalike-ramp-0.png` 与 `test/lookalike-ramp-1.png` 是独立生成的不同像素图，却有相同方向的梯度、dHash 距离 0。它们只能得到 `perceptual-candidate`，不能升级为确定副本。JSON 保留距离和图像证据，复核流程可记录接受/拒绝/待定，数据文件不因检测结果而被删除。

ImageHash 本身不会替使用者判断共同来源。FiftyOne 也能展示相似组、支持人工筛选，不能把人工复核说成 VisionLeak 独有。这里可检验的差异是这个窄任务的证据级别和可移交复核记录；代价是 dHash 对裁切/镜像不稳健，缺少 FiftyOne 的 embedding 和大型数据集工作流。

### 3. 受限本地审计：完成状态和有限结果一起交付

在相同图像目录上设置极低 `--max-comparisons` 或 `--max-pairs`，应获得 `complete: false` 的报告和不同退出状态；已经产生的证据仍可复核，但不能宣布目录无泄漏。正常预算下，评测用独立全对参考核对候选索引，而不是把“程序运行结束”当作完整性证据。

MoonSplit 的独立审计及明确输出范围值得借鉴，不能把“可复现”泛称为差异。FiftyOne 则是更完整的数据管理/模型索引平台。VisionLeak 的具体取舍是无需数据库或模型下载、Node 负责固定解码、MoonBit 承担指纹和候选/证据业务逻辑，输出便携 JSON 与本地复核界面。这里没有测量工具之间的速度或精度，故无“更快/更准”结论。

## 实测与限制

[评测报告](../reports/evaluation.md) 来自真实执行 CLI；[原始结果](../reports/evaluation.json) 记录版本、命令和每个误报/漏报。基准 59 张**合成**图的阈值 6 结果：精确 TP 27、FP 0、FN 0；近似 TP 67、FP 2、FN 18，precision 97.10%、recall 78.82%。裁切/镜像挑战的 18 对均漏检。不能由小型合成成绩推断真实照片集的准确率或召回。

外部 oracle 实际运行 ImageHash 4.3.2，11 个边界/随机 RGBA 向量和 59 个实际图像解码结果与明确的 canonical-grid 合同一致。端到端默认 ImageHash LANCZOS 基线另外计算；不把合同对齐测试当作两种整套工具等价，也不把本机单次墙钟当作跨工具性能排名。

## Mooncakes 查询与不确定性

搜索读到的 [Mooncakes 0.1.1 页面](https://mooncakes.io/docs/AlexenderSokolov/moonsplit@0.1.1) 是旧版本，而固定 GitHub 源码的 `moon.mod` 已为 0.3.0。仓库 README 声称 0.3.0 已发布；本次直接读取其给出的 manifest 地址返回 HTTP 404，0.3.0 文档页面也未能读取，因此**不独立确认 0.3.0 注册表发布状态**。这与已经核实的 0.3.0 源码能力是两件事。

对 Mooncakes 的 image/hash/minhash 及 GitHub 的 MoonBit image/duplicate/perceptual 查询并不穷尽注册表，也不能用“未搜到”证明不存在相似项目。来源、固定 SHA、查询及失败边界保存在 [sources.json](sources.json)。如用于比赛查重材料，需由用户/组织者再按正式规则确认；本次未公开提交任何材料。
