# 自然案例研究程序

冻结协议、原始第三方关系及摘要位于本目录；完整结果和边界见 `../../reports/plan-0.9.0/natural-cifair/README.md`。该目录独立于生产 `sourceDigest` 根列表：summary绑定runner、protocol、dataset摘要，dataset绑定prepare程序与原始压缩包摘要，独立校验收据绑定verify程序。download收据绑定官方MD5及实际SHA-256。研究不隐含进入生产CI或宣称盲测；固定默认Core参数后一次执行，保留全部漏检/难负例候选。
