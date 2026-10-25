# 第 0 阶段执行报告：待 Claude 验收

状态：本地实现与验证已完成；发布 dry-run 待登录补验，远端统计按计划延后。此报告是 GPT 执行记录，不是 Claude 验收结论。范围含第 1 阶段流式核心及别名规则的合并验证。

## 完成项

- 模块名按负责人确认改为 `cjyhjy/visionleak`；添加 repository/readme/keywords，保留 MIT 和 description。版本仍为 0.4.0，按第 4 阶段统一升版。
- 报告身份、报告/复核规则、CLI 参数与预算、split 解析、评测指标迁到 MoonBit；删除原 JS/Python 产品实现。
- 把核心距离/索引/多方向/预算和校验规则测试迁至 MoonBit 三后端，JS 保留 ABI、I/O、解码、HTTP、UI 工作流和独立身份 oracle。
- 新增增量 SHA-256、完整像素摘要、采样规划核心。独立 Python ImageHash/像素与穷举 oracle 保留。
- `.gitattributes` 仅标记 dist 和真实历史编译引擎基线 generated，未隐藏手写源码或测试。

## 迁移调用位置、删除实现与测试

| 迁移 | 主路径 | MoonBit | 删除的旧实现 | 验证 |
|---|---|---|---|---|
| 报告身份 | demo/report-identity.mjs:6；tools/cli.mjs 调用 reportIdentity | core/report_identity.mbt:81 | canonical、JS 内容摘要计算 | identity_contract、report-identity、report-history |
| 报告与复核校验 | demo/review-validation.mjs:17 | core/review_validation.mbt:275 | validateReport/validateReview/pairKey 中的规则计算 | contracts、UI 工作流集成 |
| CLI 参数与预算 | tools/cli.mjs:17、47、154 | core/cli_options.mbt:173 | parseArgs 循环、NUMERIC 表、runAudit 预算验证循环 | cli_contract、cli 集成 |
| 评测指标 | tools/evaluate.py:59 → tests/oracle-runner.mjs score 分支 | core/metrics.mbt:189 | Python metrics 和 score 的集合计算 | metrics_contract、oracle-metrics、历史指标逐项对照 |
| 核心算法测试 | core/*_wbtest.mbt | 四种视图模式及字节级物理变换参考 | tests/core/mirror/orientation 中的算法级用例 | 每后端 65 项；JS 保留 ABI 与历史报告集成 |

## 验收标准逐条对照

- 本地语言字节估计：MoonBit **129,114 B**，JavaScript **125,208 B**，Python **99,115 B**。MoonBit 最大；包括测试与注释，测试字节单列。完整文件表、排除项和方法见 languages-final.json。方法为 Git 跟踪加非忽略未跟踪文件的扩展名/shebang 统计，不冒充完整 github-linguist 或远端 API。
- 主路径与被删除实现：上表；实际文件摘要见 implementation-files.json。
- 历史身份：**39/39** 份源码/0.1.0–0.4.0 ZIP 内有效样例的 auditId 原值一致，见 identity-history-final.json；故意篡改 QA 输入不计为有效样例。
- 三后端：check/test 全通过；JS、Wasm GC、native debug 各 **65/65**；native release 构建并运行 **65/65**。Node **35/35**，Python 指标 4、发布契约 10、冻结机制 4 项通过。最终 CI 共 22 项检查，source-acceptance.json 和 logs/final-* 保留原始证据。
- `moon package --list`：通过，见日志。`moon publish --dry-run`：**未通过**，局部工具链缺少登录凭据；没有执行实际发布。清单见 docs/publication-checklist.md，原始输出见 logs/mooncakes-dry-run.log。
- 远端 GitHub languages API 与同步后 CI：按计划延后至第 4 阶段授权同步后核验，本轮没有查询或改变外部状态。

## 偏离、限制与未完成项

- 先落实 1.1 冻结机制，再迁移核心；第 0、1 阶段本地实现合并测试，未跳过进入第 2 阶段所需的 Claude 验收。
- Date.parse、URL 安全编码、Map 与 DOM 适配仍在 JS；它们是主机适配，不保留第二份报告/复核规则实现。指标包装测试不再声称是独立算法 oracle。
- 核心 JSON 解析要求有效 Unicode，拒绝孤立 surrogate；历史有效样例兼容，但未宣称兼容每种手工构造 JSON。
- Tabbit 稳定启动器因选中程序缺少可执行文件而失败，没有页面代码被派发；未记录新浏览器通过或截图。HTTP 集成已核对核心产物按固定同源 URL 提供。详见 browser-migration.json。完整浏览器交互仍待环境恢复，须在最终发布验收前补齐。
- 当前没有 Claude 调用接口，系统中也未发现 claude 可执行文件；未生成冒充 Claude 的 review-0.md/review-1.md。
- Mooncakes dry-run 需负责人登录后补验；D1 日期与 D4 ZIP 外部处理决定仍归负责人。没有推送、发布、Release 或表单操作。

## 文件和提交

新增/修改文件及 SHA-256 见 implementation-files.json；证据报告位于本目录。commit 列表为空：父仓库含前轮跨项目未提交改动，本轮没有修改共享分支、索引或历史，也没有把继承改动混入提交。以最终 sourceDigest `90e357d79d6c85b17cabd41cd833f61522d433ce870e8d735fe4ca193cc68a40` 和编译产物摘要作为本次可复核输入。


## 2026-10-25 补验追加

原先缺登录的阻碍已解除：复用负责人明确授权的 cjyhjy 登录状态执行 dry-run。Mooncakes 返回 202 Accepted，确认 dry-run 成功且未作变更；固定客户端仍以 255 退出，未记作 CLI 零退出码通过。真实浏览器补验也已通过。详见 followup-acceptance.md、mooncakes-followup.json、browser-followup.json；此前失败记录保留。此追加不代替 Claude 验收。


## 2026-10-25 dry-run 退出码修复追加

固定发布器只接受 HTTP 200，已用本地模拟证实成功 202 响应被误判为失败。项目入口增加针对已知版本和明确成功预演响应的兼容处理；真实服务复验退出 0，401/500 继续退出 255。新增错误边界测试纳入 CI，23 项完整检查通过。详见 mooncakes-exit-fix.md、mooncakes-exit-fix.json 和 mooncakes-fix-ci.json。新源码摘要为 6180b1f71f6f250dd6ccc48c92d2c4cb09ec9cfdc7c5c59802ca36be97bbf4a9，编译产物与核心检测行为未变。此追加不代表 Claude 验收。


## 2026-10-25 验收必改 M0-1–M0-3 完成追加

依据 review-0.md 的本地提交授权与 review-1.md 的通过结论，三项必改均已完成，以下记录追加后才进入第 2 阶段。没有推送或改写历史；每笔提交前均检查 `git diff --cached --stat`，暂存路径全部限定在 `projects/visionleak/`。

- **M0-1**：现有实现与历史交付/证据分组落地为本地提交；未伪造逐版本开发时间线。既有未提交改动形成两笔可复核快照，两项修复分别独立提交。探测脚本保留为 `.txt` 附件，原 `.py` 留本地且不进入 Git。
- **M0-2**：新增 `tests/metric_reference.py`，只用 Python 集合计算，不调用 MoonBit。每次 `tools/evaluate.py::score()` 调用都将 MoonBit 产品输出与其逐字段、逐配对列表比对，任一不同立即失败。合成、镜像、照片及阈值扫描共用该入口。7 个指标测试覆盖空分母、挑战组、反向配对、重复预测和逐字段损坏。
- **M0-3**：`.moonignore` 使用默认排除的白名单，包缩为 **24,490 B、15 项**，仅 MoonBit 核心、接口/包元数据、README、LICENSE；小于 1 MB。精简包真实 dry-run 退出 **0**。固定新版 `moon.mod` 实测不支持 include/exclude 字段，因此采用其支持的 `.moonignore`，失败解析日志保留，未更换工具链。

完整 `npm run verify:ci` **24 项通过**，三后端及 native release 各 65/65、Node 35/35；新增包检查、独立指标核对及原有历史/图像回归均通过。核心编译产物未变。证据：m0-remediation.json、m0-remediation-ci.json、logs/m0-final-*、logs/m0-small-package-dry-run-final.log。此前格式检查发现多余空行，修正后完整重跑通过；失败日志保留。

### 本次实现与修复 commit 列表（本追加前）

- `e9b3a061e36911374b1e97541a9a2d8f3cf96ce2` — feat(visionleak): migrate audit contracts and support full-resolution images
- `4ae5222c8075613736aa08af1b5e199b9e032c2a` — test(visionleak): preserve photo baselines and phase acceptance evidence
- `94257ae01b0839a8b2f42a38dfaf16e5ee3d8da2` — fix(visionleak): cross-check metrics with an independent Python oracle
- `12799e94c91bf916636cfd27d2150edddd297d8b` — build(visionleak): restrict Mooncakes package to the reusable core

### 语言统计

| 语言 | 字节 |
|---|---:|
| MoonBit | 129,114 |
| JavaScript | 125,378 |
| Python | 113,076 |
| CSS | 23,299 |
| HTML | 11,238 |
| Shell | 778 |

MoonBit 最大。其中 `.mbt` 为 127,740 B，生成的 `.mbti` 为 1,374 B；即使不计接口文件，MoonBit 仍大于 JavaScript。方法与完整文件表见 languages-m0-remediation.json，不冒充远端 GitHub 语言统计。

当前源码摘要：`7a77c4e01c72755622e4b40025bc222bc4dd347f62c91c2d3248a1bb3e2f503b`。M0 条件满足，第 2 阶段按修订计划开始；本记录不冒充新的 Claude 验收结论。


## 第 2 阶段前置记录提交与指标边界补充

上述 M0 必改完成记录已在 `f7f75af`（docs(visionleak): record phase zero remediation and acceptance）落地，之后才开始第 2 阶段。第 2 阶段又用 `b71f26d` 补充嵌套布尔诊断字段的独立指标核对边界，指标测试由 7 项增至 8 项；每次评测逐字段交叉验证的约束继续保持。详见 phase-2.md。Mooncakes 登录复用授权来自本对话负责人明确回复“授权 dry-run 及其所需包内容传输”，没有复制或输出凭据。
