# 第 4 阶段：本地冻结与提交准备

日期：2026-10-25。执行与复核：Codex，原实现者自查，不是独立 Claude 评审。

## 已完成的本地工作

- package.json、package-lock.json 与 moon.mod 统一为 0.5.0；CHANGELOG、changes、API、复现文档和报告索引已更新。`--max-pixels` 现为感知取样上限；拒收边界迁移为 `--max-decode-pixels`，见 docs/changes-0.5.0.md。
- `node tools/verify.mjs`：23/23 项通过；MoonBit 三后端及 native release 各 80 测试，Node 46，独立指标 8，来源/冻结重放 2，历史基线兼容 6。日志为 logs/phase4-final-verification.log，完整收据为 phase4-final-verification.json。
- `python3.13 tools/package.py` 与 `python3.13 tools/accept-release.py`：源码归档与实际干净解压验收通过；安装依赖、源码重建与编译产物摘要一致，46 个 Node 测试、默认/镜像及两分区三模式的实际图片审计均通过。文档收尾后的最终归档 SHA-256、字节数和验收状态以包外 reports/release-verification.json 与 release/SHA256SUMS 为准，不在包内记录自身摘要。
- 核心包 32,775 字节，严格小于 1,000,000 字节，仅含核心、README、LICENSE 和必要元数据。实际 0.5.0 dry-run 服务端返回 202，确认未作变更，兼容层有效退出 0；见 phase4-core-package.json 和 logs/phase4-mooncakes-dry-run.log。没有正式发布。
- 真实浏览器复验当前默认 96 对、镜像 107 对、旧照片方向模式 131 对；局部模式、桌面/手机、离线导出见阶段 3。浏览器绑定的 6 个 UI 源文件及核心产物摘要都由最终验证校验。旧模式实际记录在 logs/phase4-browser-legacy.json。
- docs/fact-sheet-0.5.0.md 已形成可核对事实表；不代写负责人申报书。规模、保留组误报与自然污染未测的限制均明确写出。
- D4 已落实：源仓库与公开克隆当前均未跟踪 release ZIP，保留本地文件与原历史，无需删文件或重写历史。

## 发现并修复的验收问题

首次完整验证在旧照片开发集刷新时失败：0.4.0 冻结引用可被替换的 current-* 路径，刷新会先删除该路径。旧报告已在刷新前逐字节归档；新增显式 archive-locations.json，将 8 个基线定位到不可变归档，同时仍要求原冻结 SHA-256，且记录实际 baselinePath。没有改动旧冻结记录、旧检测结果或允许检测变更的理由。

新增回归覆盖 current 路径不存在/被替换时仍读取原归档，以及归档篡改必定失败。完整验证中的 8 个旧模式 pairs/groups 均保持不变。失败日志和失败报告保留在 logs/phase4-first-*，后续成功不覆盖失败证据。

该修复只涉及旧基线读取与交付集成；阶段 3 已冻结的 14 个检测/实验文件摘要仍匹配，没有在查看新保留组后调整算法或参数。之前 current 报告及交付文档共 226 个文件条目已归档，archive.json 全部校验通过。

文档收尾过程中产生的未发布本地候选 ZIP 保留在 release/superseded-candidates/，附各自摘要和替换原因。它们不属于正式发布，不覆盖历史正式版本；最终交付只认包外最终验收记录指向的 ZIP。

## 提交和语言统计

本轮阶段 3–4 的实现与证据提交如下，所有提交前均检查暂存区仅含 projects/visionleak/：

- c3dee59e90247d97f026fe1b6dfcdc8cde6cc47d — feat(visionleak): add bounded local crop candidates in MoonBit
- 7dc1da1e6ed5f32c7f750f23990ffe7943fda10d — test(visionleak): freeze licensed crop evaluation and resource evidence
- 2a10683 — docs(visionleak): document crop evidence limits and phase three acceptance
- 293667d — fix(visionleak): resolve frozen baselines from immutable archives
- 07e2817 — build(visionleak): prepare verified 0.5.0 local delivery candidate

本报告、最终验收摘要及同步准备说明作为后续记录提交。提交详细文件清单可由上述 git show --stat 查询；核心/适配、数据/实验、文档、冻结修复、交付集成均按语义分组。未暂存或提交兄弟项目的既有修改。

| 语言 | 字节 |
|---|---:|
| MoonBit | 176625 |
| JavaScript | 160153 |
| Python | 134073 |
| CSS | 23299 |
| HTML | 11882 |
| Shell | 778 |

来源 languages-phase4-final.json。统计含手写测试/独立 oracle，仅将实际编译输出作为 generated；这是本地透明估计，不冒充远端 languages API。MoonBit 为最大语言。

## 偏离、待办和影响

- Claude 无法继续使用，负责人已交接给 Codex；本阶段为自查，不满足独立人工评审的含义，保留原 Claude 记录。
- 源码/运行 ZIP 包含测试图和评测证据，与 1 MB 内的 Mooncakes 核心包独立；不能用源码 ZIP 的体积判断 M0-3 是否通过。
- 新版 mooncake 是否修复旧版 202 退出码问题尚未核对；该项原评审明确不阻塞。当前固定工具链和严格兼容层经过真实 dry-run 与错误响应回归，最终冻结期间未更换编译器。
- 第 4 阶段尚未完整关闭：新版本公开推送、远端 CI 与 languages API、新 Mooncakes 正式发布及包页面须负责人同意后执行。之前的公开批次记录不代表 0.5.0 已上线。npm 保持 private，无需发布。
- GitHub Action 示例在本地运行相同实际 CLI 并验证退出 3；本版独立工作流的远端运行仍列为获准推送后的核对项。

发布批准依据来自 docs/plan-0.5.0.md 第 4 阶段第 3、4 项的“经负责人同意后”。本地结果已经可供审阅，接下来只请求具体发布操作的批准，不请求重新批准已授权的 dry-run 或本地提交。
