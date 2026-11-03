# 检索效率实验：保留顺序与预算的代次标记

结论：单一预声明候选通过功能和性能门槛，保留为下一版本候选。补丁在 [`mih-generation.patch`](../../research/followup-retrieval/mih-generation.patch)，独立构建产物位于 `output/followup-retrieval/candidate/dist/visionleak.js`。生产 0.7.0 的源码、产物和发布包均保持冻结，本实验没有改变已发布能力。

## 热点与改动

基线已含 MIH。三个负载的实际编译代码经过插桩，并严格比较插桩前后的完整输出；计数与 Core 的 indexOperations 一致。稀疏负载有 194 万次 probe、39 万次 posting 读取、155 万次祖先标记，以及约 412 万次局部路径成员检查。重复局部指纹负载有 58,588 次成员访问，其中 27,828 次遇到已处理候选。详情见 `profile-summary.json`；插桩的包含式计时只能定位热点，不能用作加速证据。

候选用每个索引的一份整数标记数组和查询代次，替换每次查询新建的路径 Map。查询仍读取全部相同 posting、走相同祖先、按原 BK 树顺序访问；每次 index/comparison 扣减位置不变。路径对象仅在下一次查询或插入之前使用。每次审计拥有新索引，最多 10,000 图 × 20 个局部窗口，代次不溢出。小树和大半径的原 BK fallback 保留。

## 同预算结果

协议见 [`protocol.json`](../../research/followup-retrieval/protocol.json)：一个候选，每组 5 次、交替执行次序，每次独立进程，完整预热后 GC 再测量一次。Node 堆上限 768 MiB，单进程 60 秒。输入、候选阈值、阶段预算、输出上限相同；完整输出摘要包含配对、顺序、见证、分组、工作计数和截断前缀。

| 负载 | 基线中位 ms | 候选中位 ms | 加速倍数 | 峰值 RSS 中位：基线 → 候选 MiB | 覆盖 |
| --- | --- | --- | --- | --- | --- |
| 1,600 个稀疏指纹输入 | 431.48 | 285.84 | 1.51× | 181.9 → 169.7 | 两者局部阶段 1,363/1,600 |
| 400 个重复局部指纹输入 | 53.59 | 49.22 | 1.09× | 107.2 → 106.4 | 两者完整 |
| 108 个已知照片指纹输入 | 23.37 | 19.43 | 1.20× | 77.7 → 76.5 | 两者完整 |

三组加速倍数几何平均为 1.255×。预设的至少 1.10× 综合收益、热点至少 1.15×、无明显退化、RSS 比值不超过 1.05 门槛全部通过。不是增加预算或减少候选；稀疏负载仍在同一图像/比较位置截断，不能声称同预算多完成了图像。

仅测了本机 macOS arm64 / Node 26.7.0 的核心检索，不包含图片解码、指纹提取、端到端 CLI、ORB 或 Linux/native 后端性能。五次本地重复不能替代多机器性能结论。

## 语义验收

- `validation/verification.json`：JS / Wasm-GC / native 各 82 项核心测试及 57 项 Node 集成测试通过，含原有独立穷举 oracle。
- `validation/semantic.json`：144 组不同阈值、比较预算和配对上限的完整输出逐字节一致；12 组独立全量枚举核对候选完整性、证据优先级及窗口距离。含 MIH 边界半径和半径 8 fallback。
- 所有测试只替换 `core/mih.mbt`；格式化器仅为冻结候选添加一个尾逗号。候选产物 SHA-256：`65fa94357c70b76ccb4e62f4dc88ace45cb719783edc3ca9de5fb80d8305e6d4`。

最初的剖析驱动忘记为 1,600 图输入显式设置 maxImages，因 API 默认 1,000 而在查询开始前拒绝。驱动在协议冻结前为两方统一设置 2,000 的输入上限；比较工作预算始终各阶段 1,000,000。没有把这个无效准备过程计作性能收益。

## 复现与采用决定

在安装依赖和固定 MoonBit 工具链的**临时干净检出**中运行；输出目录须不存在。剖析/比较程序会写入该临时检出的 `reports/followup-retrieval/`，不要用主工作目录覆盖已保存的历史收据：

```sh
node research/followup-retrieval/experiment.mjs prepare
python3 research/followup-retrieval/build_candidate.py
node research/followup-retrieval/experiment.mjs profile
node research/followup-retrieval/validate.mjs
node research/followup-retrieval/experiment.mjs compare output/followup-retrieval/candidate/dist/visionleak.js
```

原始逐次计时与 RSS、剖析计数和失败边界全部保留在本目录。接受这个实现为下一版候选，停止额外结构试探；下一版本集成仍需独立版本号与发布验收。它与 ORB 裁切质量研究彼此独立。
