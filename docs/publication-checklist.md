# Mooncakes 发布准备：0.5.0 计划执行稿

模块名 `cjyhjy/visionleak` 已由负责人确认。当前本地清单已统一为 0.5.0，正在执行第 4 阶段最终包验收。license、description、repository、readme、keywords 已设置。

实际检查：`moon check/test` 三后端和 `moon package --list` 的结果见阶段证据。`moon publish --dry-run` 支持，但本机局部工具链没有登录凭据，执行失败；原始输出保存在 `reports/plan-0.5.0/logs/mooncakes-dry-run.log`。不能把 package 成功当作 publish dry-run 成功。

发布前依次检查：

1. 阶段复核记录齐全；第 2、3 阶段已按负责人交接由 Codex 自查，记录实际复核方。
2. 版本和文档统一为 0.5.0，确认当前模块未占用该发布版本。
3. 检查 Mooncakes 清单、许可证、README 和包文件列表；排除凭据、工具链、依赖缓存及本机数据。
4. 负责人在自己的会话完成登录后运行 `./tools/moon publish --dry-run`，保存实际输出。
5. 按计划完成完整验证、ZIP 打包及解包验收。
6. 取得负责人明确发布授权，再执行 `./tools/moon publish`，记录实际包页面并从干净项目验证导入。

本清单不执行登录、上传、GitHub 推送、Release 创建或赛事表单提交。外部操作的独立授权条件来自计划书第 2、4 节。


## 2026-10-25 补验事实追加（供 Claude 修订清单）

上述“缺少登录凭据”的首次失败记录保留。负责人随后明确授权复用现有 cjyhjy 登录及 dry-run 所需的包内容传输。本次源码检查与解包检查通过；Mooncakes 返回 202 Accepted，确认 `cjyhjy/visionleak@0.4.0` dry-run 成功且未作变更。固定客户端仍返回 255，不能记作零退出码通过。详见 reports/plan-0.5.0/followup-acceptance.md 与 logs/mooncakes-followup-dry-run.log（日志位于该报告目录下）。最终 0.5.0 包仍须重新检查；正式发布仍需独立授权。


## 2026-10-25 退出码修复追加（供 Claude 修订清单）

已查明固定 mooncake 7344121 只接受 HTTP 200，误将成功的 dry-run 202 响应当作错误。项目 `./tools/moon publish --dry-run --frozen` 已加入严格兼容处理；复用已有登录目录时设置 `VISIONLEAK_MOONCAKES_HOME=/path/to/existing/moon/home`。真实 Mooncakes 复验服务端接受且项目入口退出 0，401/500 模拟响应仍退出 255。原始官方二进制未改，直接调用仍存在该缺陷。完整解释、边界与证据见 `reports/plan-0.5.0/mooncakes-exit-fix.md`；全部 23 项 CI 检查通过。上述未解决的 255 状态现由本条追加更新，历史记录保留。正式发布仍需独立授权。


## 2026-10-25：0.5.0 最终核心包 dry-run

当前结果更新：0.5.0 核心包为 **32,775 字节**，小于 1,000,000 字节；白名单只含 MoonBit 核心、README、LICENSE 和必要元数据。复用负责人已授权的现有登录，服务端返回 202 Accepted，明确确认 0.5.0 dry-run 成功且未作变更；项目入口严格识别固定客户端缺陷后有效退出 0。收据与实际日志见 `reports/plan-0.5.0/phase4-core-package.json` 和 `logs/phase4-mooncakes-dry-run.log`。旧失败记录仅表示历史状态。

npm 清单保持 private；本次不需要发布 npm。正式 Mooncakes 发布和新代码公开推送仍按计划第 4 阶段取得负责人同意后执行。
