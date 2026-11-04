# 0.7.1 集成与验收

当前状态：0.7.1 已合并并正式发布。PR #3 / b8d13d7 的合并后 Linux CI 成功；实际 GitHub ZIP 下载、Mooncakes 全新导入及字节一致性均通过，见 `publication/completion.json`。

- `ci/verification.json`：固定工具链、三后端及 Node/图像 oracle。
- `browser.json`、`walkthrough.json`：当前产物的 Chrome 兼容及脚本复核闭环。
- `acceptance.json`：绑定源码、产物、证据摘要的本地收据。
- `clean-copy.json`：最终 ZIP 干净安装、重建及报告身份一致性。
- `publication/`：提交、远端 CI、实际发布及独立下载/导入记录（完成后写入）。

检索微基准属于此前冻结的本机实验，见 `../followup-retrieval/decision.json`；本版本不宣称扩大其性能证据范围。
