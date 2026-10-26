# 0.6.0 公开发布记录

0.6.0 直接承接 0.5.0，未发布 0.5.1。发布提交为 `c69824ee63da3134a1ddb455f9ff9a90ee8d2607`，本地项目树与公开项目树逐字节一致；映射见 source-public-mapping.json。旧版本归档和标签保持不变。

## GitHub

[远端 Linux CI](https://github.com/cjyhjy/moonbit-visionleak/actions/runs/40359669509) 25 项全部通过，验收源码摘要和编译 JS 摘要与本地一致，见 github-ci-verification.json。三后端各 81 个核心测试、50 个 Node 集成测试，以及独立图像/集合 oracle 与历史回归通过。

[v0.6.0 Release](https://github.com/cjyhjy/moonbit-visionleak/releases/tag/v0.6.0) 已公开。三个附件全部下载并与本地逐字节核对、与服务器 digest 核对：源码 ZIP、SHA256SUMS、release-verification.json。源码 ZIP 为 26,658,473 字节，SHA-256 `c1d3077953c384dc5a8fb4608a3b8157853757ae304403f6f2789c9c29f869a8`。独立解压安装、重建与图片报告一致性共 23 项验收通过。

最终包外状态见 github-release.json、clean-archive-verification.json。本 README 是发布完成追加记录，原 ZIP 中的待发布状态记录反映打包时点，不重打已验收归档。

## Mooncakes

[cjyhjy/visionleak](https://mooncakes.io/docs/cjyhjy/visionleak/) 0.6.0 正式发布，官方客户端退出 0、服务端 200 OK。核心包 34,729 字节，SHA-256 `47a2cd7c4251e18234480658134ff1fa0efc0a2b36177d948164cef39695f68b`，仅含库与必要元数据。

用户在本机配置已有 token 后预检通过；未读取或发布凭据内容。此前缺少认证的失败日志保留，不能作为发布成功证据。dry-run 的 HTTP 202 兼容仅用于预检，实际发布不使用状态转换。

全新项目从公共注册表 `moon add cjyhjy/visionleak@0.6.0`，无本地路径替代；JS / Wasm-GC / native 各 3 个 smoke 测试通过，覆盖摘要/空审计、新组合导出和实际参数契约。下载所有包条目与正式上传 ZIP 逐字节一致，见 clean-import.json 和 registry-content-parity.json。

## 能力边界

局部匹配仍为默认关闭的 vl-local-dhash-v1；严格 v2 探索未晋升。索引与内存改善不代表自然照片精度提高，旧照片均为回归数据。Node/sharp 并非端到端流式解码；裁切与方向扩展仍可能耗尽预算。npm 保持 private，未提交赛事材料。
