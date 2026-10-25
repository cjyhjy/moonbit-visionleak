# 第 0、1 阶段补验记录

日期：2026-10-25。范围：负责人要求补齐 Mooncakes dry-run 与真实浏览器验收。此前的失败日志与报告保留；以下结果更新其待办状态，不代表 Claude 阶段验收。

## Mooncakes dry-run

负责人已明确授权复用 `cjyhjy` 登录状态，连接 mooncakes.io，并允许 dry-run 所需的包内容传输。凭据未复制到本项目，也未输出。

执行固定工具链的 `moon publish --dry-run --frozen`，使用现有登录工具链目录作为 `MOON_HOME`。源码检查、打包、解包后检查均通过。服务端返回：

> Server status: 202 Accepted, detail: Dry run completed successfully. No changes were made. The dry-run was made for package cjyhjy/visionleak version 0.4.0.

**服务端已接受 dry-run，但固定版本客户端最终退出码为 255，并输出 `Error: moon publish failed`。** 因此记录状态为 `server-accepted-cli-nonzero`，不记作 CLI 零退出码通过。没有实际发布；不推断客户端异常的具体原因。最终 0.5.0 版本仍须在全部阶段验收与版本统一后重新 dry-run。

证据：`mooncakes-followup.json`、`mooncakes-followup-package-files.json`、`logs/mooncakes-followup-dry-run.log`。本次包约 16 MB，632 个条目，包含源码、测试图片和报告；该清单是本次检查输入，不是最终发布清单。

## 真实浏览器验收

使用 Tabbit 稳定启动器，浏览器版本 `154.0.8037.58`；本地服务加载 `reports/photos-demo/report.json`。Tabbit 实际存在，先前沙箱内的启动错误不能证明程序缺失；本次在批准的沙箱外执行环境恢复连接。

以下 8 组检查通过：

1. 浏览器加载编译后的 MoonBit 核心，报告身份与结构校验成功；50 张照片、131 对证据。
2. 确认、撤销、刷新恢复，以及备注持久化；较新复核记录正确合并。
3. 错误 auditId、无效 pairKey 导入被原子拒绝，原有存储不变。
4. 篡改报告被身份校验拒绝，当前报告与复核记录保留。
5. 从 0.1.0 ZIP 提取的历史报告成功导入（59 张、96 对），异源报告的缩略图被禁用；切回原报告恢复复核记录。
6. 桌面 1440×1000 布局与左右缩略图正常。
7. 手机 390×844 布局无横向溢出；已查看实际截图。
8. 证据筛选、路径搜索、J/K 导航通过；两个导出按钮实际生成的 JSON 从下载目录读取后校验通过。复核文件与完整报告各含 1 条相同复核记录，完整报告的机器证据与原报告一致。

下载文件仅根据本次生成时间和预期 auditId 识别，没有使用旧下载作为本次证据。自动化定位错误和被浏览器禁止的下载管理页导航已经纠正，最终结果来自成功请求与实际落盘文件。

证据：`browser-followup.json`、`browser-downloads-followup.json`、`logs/browser-followup-receipt.json`；截图与 JSON 样本位于 `demo/qa/phase01-followup-*`。桌面截图展示工作台上半部；手机截图为全页。

## 边界

未修改产品源码、版本号或编译产物；源码摘要仍为 `90e357d79d6c85b17cabd41cd833f61522d433ce870e8d735fe4ca193cc68a40`，前次完整 CI 验证继续对应当前源码。本次只新增证据并追加记录，不覆盖历史失败证据。测试页面与本次本地服务已清理。

尚未执行 Claude 第 0、1 阶段验收、后续阶段开发、正式发布、公开仓库推送或赛事提交。
