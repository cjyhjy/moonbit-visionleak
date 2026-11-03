# 0.7.0 初审后改进（本地实现，未发布）

## 先保住确定性证据

核心使用 `auditStrategy=exact-first-v1`：先完整枚举字节／像素重复，再执行全图感知检索，最后执行可选局部检索。任一阶段不完整，后续阶段跳过，已有证据保留。

- `maxExactComparisons` / `--max-exact-comparisons`：确定性阶段独立预算，默认 100 万、最大 1000 万；包含相同 split 的桶枚举，避免单一重复桶绕过预算。
- `maxComparisons` / `--max-comparisons`：分别用于全图阶段和局部阶段，各自默认 100 万、最大 1000 万。两个阶段分别有 `16 × maxComparisons` 的索引操作预算。
- `maxPairs` 是共享输出上限，确定性配对优先占用。确定性阶段仍可因该上限或自身预算停止，不能保证任意数据都完整。
- `phases.deterministic/perceptual/local` 分别报告 `status`、`complete`、处理图数、工作量、索引操作及原因。关闭阶段为 `disabled`，前序未完成为 `skipped`。
- `stats.comparisons` 是各阶段工作量之和；`stats.processedImages` 是所有启用阶段均处理完成的输入前缀。需要确定性覆盖时读取 `phases.deterministic.processedImages`。
- 核心阶段仅覆盖成功生成指纹的输入。CLI 的 `coverage.deterministicInputComplete` 还要求没有发现、拒收或解码错误。CSV 输入的“完整”仅覆盖清单列出的文件。

2026-11-03 收尾修复：被跳过的启用阶段完成数为 0，因此总体覆盖不能使用前一阶段的已处理数。`coverage.budgetExhaustion` 的核心记录新增 `phase`，其 `processedImages` 和 `atImage` 对应该中断阶段；总体覆盖仍读取 `stats.processedImages`。旧报告没有阶段字段时保留旧读取语义。

例如 `--max-comparisons 0 --fail-on pixel` 仍可能返回 3：确定性证据先被发现，感知阶段随后标记不完整。保留 `1 fatal > 3 hit > 2 incomplete > 0 complete` 的退出优先级。

**迁移注意：** 配对输出顺序、工作计数、有限预算下返回的证据和 auditId 都会改变；旧复核不自动迁移。报告 schema 与 SHA-256 v2 身份算法保持兼容，新策略、预算与阶段字段本身参与身份计算。旧报告仍可读取并复验。历史回归比较允许明确声明的阶段重排，仍逐字段核对全部证据、距离、窗口和精确分组。

## CSV 划分清单

```sh
node tools/cli.mjs audit --root /path/to/images --manifest /path/to/splits.csv --out output/manifest
```

```csv
path,split
"images/a,example.png",train
images/b.jpg,test
```

UTF-8（可带 BOM）、LF/CRLF、双引号转义；表头必须正好是 `path,split`。支持现有 split 别名（如 `training`、`val`、`testing`），转为 train/validation/test。上限 8 MiB、10,000 条图像记录。路径相对 `--root`，文件可放在任意子目录；不扫描清单外文件。拒绝绝对路径、反斜杠、控制字符、`.`/`..`、重复路径与集合冲突。不跟随输入符号链接。

缺失或不安全的文件记入错误并生成部分报告；结构错误和重复记录在审计前拒绝。清单原始字节摘要及规范化映射摘要纳入 `scope.input` 和 auditId。只换行或更改别名也会改变原始摘要；使用方应保留清单原件。

## 可丢弃的指纹缓存

```sh
node tools/cli.mjs audit --root /path/to/images --manifest /path/to/splits.csv --out output/cached --cache .cache/fingerprints
```

默认关闭。每次仍安全读取文件并计算内容 SHA-256；以内容摘要、编译核心摘要、完整 sharp/libvips 版本、规范化版本、采样上限与镜像／旋转／裁切配置构造键。保存完整像素摘要、指纹与缩略图；命中时省去解码和指纹计算，仍重新执行全部审计比较。不是增量或子集审计。

缓存命中仍计入本次源像素预算，并校验当前文件大小、解码像素和总像素上限。损坏记录降级为未命中并重新生成；写入失败只影响缓存统计。缓存目录必须在数据集和报告目录以外。缓存没有自动清理策略；空间由使用方管理。缓存校验提供内容一致性，不是防恶意篡改的签名。

运行统计放在 `timing.cache`，不参与报告身份，因此缓存关闭、冷启动与命中产生相同 auditId。修改文件内容或切换指纹配置会失效，不能仅靠 mtime、路径或大小命中。

## 可选复核排序

工作台展示逐阶段状态，并提供“优先复核（实验）”排序：确定性证据优先，其次全图候选、局部候选；候选参考低对比度标记、窗口支持数与距离排序。首批最多 200 对局部候选计算独立左右窗口覆盖数的较小值，最多 80,000 次哈希比较；未计算数量明确显示。窗口相关，分数不是概率，也不删除候选、不升级证据。

局部检索算法仍为默认关闭的 `vl-local-dhash-v1`，不启用旧的低召回 v2 过滤规则。本轮未宣称降低裁切检索开销；阶段拆分解决覆盖可解释性，实际容量仍需独立测量。

## 新评测与演示

新照片协议、实现摘要和来源选择在下载图像前冻结于 `research/photos-v3/freeze-0.7.0.json`。12 个新文件来源、4 类场景，包含非固定窗口对齐裁切、水印、压缩、颜色、截图边框及同场景／砖墙负例。结果见 `reports/post-review/photos/evaluation.json`；全部为受控变换和文件来源标签，真人复核时间未测，自然污染未测，不能将其解释为实用场景泄漏概率。

```sh
node tools/demo-walkthrough.mjs output/walkthrough-v070
node tools/server.mjs --report output/walkthrough-v070/audit/report.json --port 4173
```

脚本在全新目录生成数据，演示 CI 阻止重复、确定性复验、**明确标注的脚本复核**、离线 HTML、建议 CSV、构造修正副本并重审。原演示数据的前后摘要必须一致。脚本复核不代表真人复核结果；生产工具只导出建议。

本轮 0.7.0 工程候选已独立提交并推送至 PR #1；最新远端 CI 与发布状态见 `reports/followup-0.7.0/publication/`，不以本地验收代替实际发布。公开 0.6.0 收据保留在 `reports/plan-0.6.0/publication/`；原 0.7.0 冻结验收保留在 `reports/post-review/`。

后续工作状态见 [任务清单](followup-2026-11-03.md)。`reports/post-review/` 为原始冻结验收，收尾后的新证据保存到 `reports/followup-0.7.0/`。历史冻结复现使用 `python tools/frozen_post_review.py --out NEW_DIR`；当前实现的已知数据回归使用 `python tools/evaluate-post-review.py --regression --out NEW_DIR`。后者核对相同来源和变换，并逐条比较当前阶段顺序、距离和窗口见证，不声称获得新保留集结果。

实际结果：新照片非确定性召回从默认 40.0% 到加局部 51.25%，但随机裁切对原图召回仍为 0/24；本批没有显示排序收益。5k 合成裁切测试的确定性/全图阶段各完成 5,000 图，局部阶段单独在 964 图处达到预算。完整数字、日志和局限见 [本轮验收](../reports/post-review/README.md)。
