# 0.5.0 公开发布记录

负责人于 2026-10-26 明确授权：推送 GitHub，核对 CI、Action 示例和语言；正式发布 Mooncakes 并干净导入；将交付 ZIP 上传 GitHub Releases。该授权更新了第 4 阶段原本等待批准的状态。

## GitHub 与语言

六个既有本地提交正常推送到 main，公开头为 `2a3b5f09f42e02e64ca950aca155a43a4fbe6671`，保留既有公开祖先和原作者、提交者、日期、消息；未 force push。逐提交映射见 source-public-mapping.json。后续发布文档提交单独记录。

[Linux CI 40281939081](https://github.com/cjyhjy/moonbit-visionleak/actions/runs/40281939081) 成功，下载的 github-ci-verification.json 记录 25 项检查全部通过：MoonBit 三后端与 native release、Node、独立指标/图像 oracle、历史基线兼容、冻结重放及核心包白名单。远端原始 languages API 为 github-languages.json，MoonBit 175153 字节，为最大语言；它是 GitHub 分类结果，与包含 .mbti 的本地估计口径不同。

## Action 示例真实运行

在独立 `codex/verify-0.5.0-action-example` 分支将 examples/github-action/visionleak.yml 原样复制为工作流，没有修改 main 的冻结行为源码。[实际运行 40282015953](https://github.com/cjyhjy/moonbit-visionleak/actions/runs/40282015953) 安装、构建及上传报告成功；故意重复图片的 audit 步骤按预期退出 3。整体 conclusion 为 failure 是该样例的预期关卡效果，不能表述为示例工作流“全绿”。下载产物确认 2 张图、1 对 byte-identical、complete=true。原始步骤、日志和报告见 action-example-*。

## Mooncakes 正式发布

[cjyhjy/visionleak](https://mooncakes.io/docs/cjyhjy/visionleak/) 的 0.5.0 已正式发布；服务端 200 OK、客户端退出 0。正式发布直接使用官方固定二进制，没有使用 dry-run 退出码兼容层。最后一次 dry-run 和真实发布分别存 mooncakes-final-dry-run.log、mooncakes-publish.log。

正式核心 ZIP **32754 字节**，SHA-256 为 `ea5e9f2d866f012582afcde537ed6a3568aef16b6a0143f65665957494c50fe2`，白名单仍只含核心、README、LICENSE 和必要元数据。阶段 4 的 32775 字节是此前本地候选；差异来自 README 将临时状态改成发布记录链接，没有调整算法或编译产物。收据为 core-package.json。

全新 MoonBit 项目使用 `moon add cjyhjy/visionleak@0.5.0` 从公共注册表下载，无本地路径依赖。JS / WasmGC / native 各执行 2 个 smoke 测试，覆盖标准 SHA-256、64 位二进制汉明距离、空输入完整审计及 0.5.0 局部指纹导出。下载包所有条目与正式上传 ZIP 逐字节一致，见 clean-import.json、registry-content-parity.json 和对应日志/测试附件。首轮 smoke 错将十六进制串传给仅接受 64 个二进制字符的 hamming，修正测试后通过；失败日志保留，未修改已发布库。

## GitHub Release 与最终交付

[v0.5.0 Release](https://github.com/cjyhjy/moonbit-visionleak/releases/tag/v0.5.0) 使用已经验收的源码/运行 ZIP，独立于上述 1 MB 内核心包。附件为 visionleak-0.5.0.zip、SHA256SUMS 和 release-verification.json。最终 ZIP 的摘要、重新解压验收及上传/下载核验写入包外 reports/release-verification.json 和本目录 github-release.json；不在 ZIP 内写自身摘要。本文冻结时 Release 附件上传仍是后续执行步骤，最终状态以包外收据为准。

运行时和 14 个阶段 3 冻结文件没有修改；发布文档收尾不使用新保留组调参。npm 保持 private，无需发布。赛事申报书和正式赛事提交仍由负责人完成。
