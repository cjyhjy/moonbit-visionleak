# 0.8.0 ORB 产品集成验收

本页记录 2026-11-03 开始的集成。0.7.1 检索优化已实际发布并独立核验；本页属于另一个 0.8.0 候选版本。正式 Release/Mooncakes 发布尚未执行；提交和 Linux 结果将单独记录在 `delivery.json`。当前用户授权完成集成与自动验收。

新验收30项和干净ZIP的23项均已通过（真实ORB测试无跳过）；新包SHA-256：`96ce8c2798e13ab5b5364961f9df8bad2eb07dfb83e1319fd1f5062e8a7e58d8`。此前未发布包和旧验收保存在 `pre-linux/`，本地旧包SHA为 `e46fa56502e242ca1ba30d4f1c3a6d72ea44a5aaf68bf8e494d733852e1f3f29`。

## 已通过

- 最终本地 CI 30 项通过：MoonBit JS/Wasm GC/native 各 83 项、native release 83 项、Node 63 项（含真实 ORB，零跳过）；已发布 0.7.0 对照 144 组完整输出/预算前缀与 12 组独立穷举继续通过。
- ORB 缺依赖、超时、取消、受控 RSS 超额、协议异常、独立预算、身份/缓存、旧报告、复核 JSON/HTML/CSV 及精确证据优先均有自动检查。RSS 超额用受控探针检查监督行为，不冒充真实大内存压力测试。
- [已知来源回归](ci/orb-regression-1793774725177/summary.json)：开发 TP136/144、FP0、FN8；此前保留来源 TP67/72、FP0、FN5。冻结 ORB 命中全部保留；135/65 对同方向内点数、匹配数及仿射见证与同平台未改动冻结算法一致。每次 24 个查询包含本分区全部原图，合计 4320 个关系。这里统计产品 Core+ORB 输出并集，数据已使用过，不是新来源或自然污染评测。
- [Chrome 验收](browser.json)：桌面及 390px 窄屏，ORB 筛选、198 内点/32 个展示点、几何投影、复核及撤销。仅 macOS Chrome；[闭环](walkthrough.json) 的复核记录由脚本生成，源数据摘要不变。
- 源码摘要 `f36c847f692395d7e61a8400b6bacddb7b0409cf6ac0077ead5103ce16bc766a`；Core 产物 `5e8f83e3f09afd11393a3218e3e5ddbd8e66c90702059f85feaf36aea3fcd856`。完整绑定见 [acceptance.json](acceptance.json)。

Linux首轮因跨平台内点差异（62/63）失败，两张图像素一致。验收改为同平台重放未改动冻结算法，仍严格核对计数/矩阵并保留所有历史命中及零新增误报检查，逐项输出跨平台差异；详见 `linux-first-failure/`。生产代码、算法参数和浏览器产物未变。

## 资源测量与负面结果

- [native release 微基准](ci/native-performance-1793774791494/summary.json)：每负载1次预热、5次样本，依次运行旧Map/代次标记，完整输出摘要相同。
  sparse1600 中位数旧/新 11.320/11.272 ms，1.00×。
  knownPhotos 中位数旧/新 7.968/5.984 ms，1.33×。
  前一轮有效macOS运行的0.89×/1.29×结果保存在 `pre-linux/ci/`，不因验收脚本变化而删除。仅Core JSON解析/审计/序列化，不含编译、解码和I/O；样本未随机交替，不承诺全后端加速。
- [5000 图容量](performance/scale-5000/summary.json)：生成 96×96 噪声图片，分区交错清单；每模式一个新 Node 进程。默认完整，8.822 s，主进程峰值约282 MiB。ORB 限制前32张特征，9.009 s，在 99,959,296 描述子比较后按工作预算停止，完整前缀17张；确定性阶段仍覆盖5000张。主进程峰值约267 MiB，worker采样峰值约75 MiB，不能相加称为同步峰值。
- [CI 1000 图容量](ci/scale-1793774806681/summary.json) 是独立运行；规模实验检查有界资源/覆盖，不测自然准确率。生成像素与缩略图不重复归档，保留生成程序、清单、原文件摘要和计数。
- `performance/native-preflight/` 曾与规模实验重叠，仅探索性参考；`performance/invalid-native-selector/` 保存错误测试筛选器导致零测试的失败，未接受该运行的性能结果。工程首轮的 28 项通过由最终 30 项验收取代，早期日志不代表最终源码。

## 复现

安装固定工具链和 Node 依赖；在 Python 3.13 环境安装 `requirements-oracle.txt` 和 `requirements-orb.txt`，设置两个解释器环境变量。所有输出目录必须新建。

```sh
npm run verify:ci
node tools/orb-walkthrough.mjs output/orb-walkthrough-fresh
python tools/validate-orb-integration.py --out output/orb-regression-fresh
python tools/benchmark-native.py --out output/native-fresh
node tools/benchmark-integration.mjs output/scale-fresh 5000
node tools/archive-ci.mjs reports/integration-0.8.0/ci-fresh
```

构建交付包使用本目录 `acceptance.json`；最终 ZIP 的独立干净安装、重建及结果一致性以 `clean-copy.json` 为准。ZIP 包含验收时快照；后续 Git 提交、Linux 运行和正式发布状态从独立收据读取，不能从版本字段推断。

## 后续边界

使用方式、profile、默认关闭、各硬参数上限与采样 RSS 护栏见 [版本说明](../../docs/changes-0.8.0.md)。Mooncakes 仅发布纯 MoonBit Core/报告校验，不提供 Python worker；纯 Core 显式拒绝 `includeOrb:true`。自然污染数据和真人复核参与者暂无，待用户提供；没有用脚本复核替代。其余未测平台/输入规模无效果或容量保证。
