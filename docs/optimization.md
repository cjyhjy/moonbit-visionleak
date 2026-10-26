# 0.6.0 优化与实验边界

这些改进纳入 0.6.0；公开发布状态以 reports/plan-0.6.0/publication/ 中的收据为准。现有 0.5.0 ZIP、Release 和 Mooncakes 内容保持原样。CHANGELOG 与架构文档已清理过期的发布前措辞。证据目录为 `reports/optimization/`。

## 已实施

- 工作台支持 `1/C` 确认、`2/R` 排除、`3/U` 暂不确定、`Z` 单步撤销；输入框、组合输入、按键重复和系统修饰键仍不触发快捷键。局部证据框按 `localProfile.windows` 千分比坐标映射到实际缩略图，随屏幕尺寸缩放，不覆盖缩略图外留白。批量排除未加入：候选分组不保证组内每对都相关。
- 半径 0–7 的大索引使用四段 16-bit MIH 作为 BK-tree 预筛选。半径 0–3 查每段精确桶；4–7 查每段距离至多 1 的 17 个桶。由抽屉原理，真实匹配至少出现在一个查询桶中。标记候选节点及其祖先后仍按原树顺序遍历，保留完整审计的配对顺序和首个局部窗口见证。少于 128 节点或半径大于 7 时走原查询。
- 保留 `comparisons = distanceEvaluations + pairChecks`，另用 `indexOperations` 统计查询桶探测、posting 读取及祖先回溯，上限 `indexOperationLimit = 16 × maxComparisons`；耗尽返回 `IndexBudget` 与 `incomplete`。固定四桶插入由图片数/窗口数上限约束。有限预算下截断位置、完整性、返回数量和 auditId 可以改变，旧复核不会自动迁移。
- 像素 SHA-256 改用 4096 像素的 RGB 块，避免整幅 canonical RGB 数组及其拷贝。开启裁切时使用新的组合指纹入口，在同一 RGBA 扫描中生成灰度和局部积分图；旧入口保留，VL1 摘要域、Alpha 合成取整、网格与方向语义不变。全局网格/旋转仍读取灰度数据，没有声称完全消除所有扫描。

## 已测量的收益与边界

同一 SHAKE-256 合成 32×32 图像生成方法、同一 100 万比较上限：

| 场景 | 0.5.0 处理数 | 当前处理数 | 当前是否完整 |
| --- | ---: | ---: | --- |
| 5,000 张，默认 | 2,491 | 5,000 | 是 |
| 5,000 张，镜像 | 1,232 | 5,000 | 是 |
| 1,000 张，旋转加镜像 | 304 | 1,000 | 是 |
| 5,000 张，旋转加镜像 | 304 | 2,390 | 否 |
| 1,000 张，裁切 | 121 | 956 | 否 |
| 5,000 张，裁切 | 121 | 959 | 否 |

5,000 张默认模式比较数为 92,862，另有 490,490 次索引操作。这些数值不代表自然照片准确率或任意数据的容量保证。裁切模式仍有高维分布与多窗口开销，未解决全部大规模场景。

三个独立进程重复的合成 4MP 指纹测量：默认模式峰值 RSS 中位数约 105.6 → 82.0 MiB，裁切模式约 138.0 → 118.9 MiB。默认模式耗时略有增加，裁切略有降低；时间是本机观察值。12MP 解码 probe 中 buffer 和 stream 均只产出一个 48,000,000 字节块，因此未采用把 `toBuffer()` 改成 stream 的伪流式优化。

## 裁切 v2 实验结论

研究脚本测试了阈值 5、对比度 32、至少两个具有兼容缩放/平移关系且中心分离的窗口。已看过的旧保留分区上，局部 FP 从 44 降至 0，但 TP 从 117 降至 32，召回从 66.5% 降至 18.2%。这是多个规则合并的探索结果，不能归因于某一个规则，也不能把旧分区再称为独立验收集。

因此保持生产 `vl-local-dhash-v1`，v2 原型仅保存在 `research/optimization/crop-v2-probe.py`。后续需要独立新来源照片、预先冻结的规则和可接受的召回门槛。真正逐行/分块解码需要替换或扩展底层输出后端，仍是后续工程，不声称已经实现。

## 验证与复现

- `npm run verify:ci`：三后端检查、构建和核心测试，Node 集成，独立图像 oracle、历史报告与回归评测。
- `node research/optimization/compare.mjs research/baselines/0.5.0/dist/visionleak.js reports/optimization/equivalence.json`：两个旧照片分区 × 七种阈值，逐项比较完整有序配对、距离、局部窗口和精确分组。
- `node research/optimization/fingerprint-memory.mjs research/baselines/0.5.0/dist/visionleak.js reports/optimization/fingerprint-memory.json`：隔离进程内存与指纹完全一致性检查。
- `node research/optimization/decode-probe.mjs reports/optimization/decode-probe.json`：实测当前 sharp 的 raw 输出块。
- `research/.venv-oracle/bin/python research/optimization/crop-v2-probe.py`：重放探索性 v2 规则。
- `research/.venv-oracle/bin/python tools/scale-benchmark.py --out <新的输出目录>`：真实 CLI 规模测量。

`research/baselines/0.5.0/` 从原发行 ZIP 提取，仅保存 freeze 文件列出的原始实现。`tests/crop-reference.py` 验证这些原始字节的冻结摘要，并要求当前实现与原报告检测结果一致；工作计数改为验证语义不变量与上限。原始 freeze 和历史评测报告均未改写。
