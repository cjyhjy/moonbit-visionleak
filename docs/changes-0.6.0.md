# 0.6.0：索引、复核与下游集成契约

0.6.0 直接承接 0.5.0，未发布中间的 0.5.1。发布状态以 reports/plan-0.6.0/publication/ 中的收据为准。

## 行为与兼容性

- 半径 0–7 的大索引使用 MIH 精确候选预筛选，再按原 BK-tree 顺序搜索。完整审计保留配对、距离和局部见证；有限预算下处理前缀、统计、完整性及 auditId 可能变化。
- comparisons 仍为 distanceEvaluations + pairChecks。另计 indexOperations，超过 16 × maxComparisons 返回 IndexBudget。未使用预筛选时索引统计可以缺省，不能据此推断某个旧版本支持 MIH。
- 分块 RGB 摘要和组合灰度/积分图扫描降低临时分配。组合导出 fingerprint_combined_rgba 加入公共 API，原导出保留。Node/sharp 仍持有完整解码 Buffer，不宣称端到端流式解码。
- 复核快捷键 1/C、2/R、3/U、Z；局部窗口在图像上高亮。
- vl-local-dhash-v1、20 个窗口、对比度门槛 16、跨尺度搜索保持不变，仍默认关闭且仅产生待复核候选。严格多窗口 v2 原型召回损失过大，未启用。没有声称新的自然照片精度提升或独立新留出验收。
- 历史报告保持可读；新报告的核心产物摘要变化会产生新 auditId，不自动迁移旧复核记录。

实测与复现见 [优化说明](optimization.md)。新的版本号不代表所有规模问题已解决：裁切与方向扩展在默认预算下仍可能不完整。

## 下游能力查询

```sh
node tools/cli.mjs capabilities
```

该命令不扫描数据、不联网，以单行 JSON 返回 visionleak-capabilities-v1。可从任意工作目录调用 CLI 的绝对路径。没有参数；多余参数报错。limits 与 splitAliases 来自实际编译核心，而非重复手写的上下限。

- version 与 engine.artifactSha256：实际安装的包版本和编译产物摘要。SHA-256 是内容标识，不能代替可信分发渠道；下游锁文件还应记录源提交和归档摘要。
- report：报告 schema 与身份算法；不能仅凭相同语义版本就忽略格式变动。
- input：目录布局、split 别名、支持扩展名。没有 CSV split、manifest、任意子集或增量审计输入。
- features：实际支持或明确不支持的接口；不支持的功能不能靠猜测参数启动。
- profiles.local：稳定的局部证据语义标识，不与软件版本号混用。
- limits：每个整数参数的 CLI flag、minimum、maximum、default。
- accounting：解码、生成指纹、实际审计的不同计数位置；每个 CLI 调用使用独立预算。调用方必须实现跨调用总账，不能每次恢复默认额度。verify 不沿用 audit 的像素预算，须另受进程时间/内存等宿主限制。
- verification：仅复验 byte-identical / pixel-identical，跳过候选。verify 返回 0 仅说明没有发现失效的精确证据，不保证存在已验证证据。
- exitCodes：audit 与 verify 分别解释。fail-on 命中可同时伴随 incomplete，不能丢弃报告。

适配器应接受已知 schema 中无害的新增字段；未知 schema、未知证据等级或 local profile 必须明确报不兼容，不静默套用旧解释。capabilities 不能证明实际运行结果：仍需检查报告 auditId、输入摘要、退出码、complete、errors、coverage 和各类计数。

## 复验输出

宿主 verify 命令新增 verificationScope：evidenceTypes、candidatesRecomputed=false、wholeDatasetReaudited=false。原 counts 和退出码保持不变。只有裁切候选的合法报告也可返回 exitCode=0、valid=0、skippedCandidates>0，必须保留这个区别。

## 发布验收

包含三后端 MoonBit 测试、真实 Node CLI/HTTP、独立 exhaustive/图像 oracle、历史报告兼容、冻结裁切回归、真实浏览器复核及最终 ZIP 干净解压重建。测试结果、机器环境与未覆盖场景以实际收据为准。旧 ZIP/注册表版本不重打、不替换。
