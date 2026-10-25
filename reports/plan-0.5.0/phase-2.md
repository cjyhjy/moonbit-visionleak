# 第 2 阶段执行报告：待 Claude 验收

日期：2026-10-25。状态：2.1–2.5 本地实现与验收项通过，未开始第 3 阶段。本报告是 GPT 执行记录，不是 Claude 验收结论。

## 进入条件与提交边界

进入前已完成 review-0.md 的 M0-1–M0-3，phase-0.md 已追加 commit 清单、语言统计与补验；review-1.md 已由 Claude 判为通过。`f7f75af` 是进入本阶段前的报告提交边界。本阶段与此前所有提交只含 `projects/visionleak/` 路径，提交前检查了暂存区 stat；没有推送、改写历史或执行正式发布。

## 完成项与规则落点

| 项目 | MoonBit 判定路径 | JS I/O 与展示路径 |
|---|---|---|
| 2.1 `--fail-on` | core/cli_options.mbt 参数解析；core/workflow.mbt::workflow_gate 的累积等级、命中计数与退出码 | tools/cli.mjs 发布报告后输出 gate 结果；致命 I/O 错误返回 1 |
| 2.2 `verify` | workflow_verification_inputs 决定读取目标；workflow_verify 对原摘要和当前两端摘要逐对判定 valid/invalid/missing | tools/report-tools.mjs 先校验报告身份与结构，再安全读取路径；字节 SHA-256 用 MoonBit 增量接口，完整像素摘要用既有 MoonBit 核心 |
| 2.3 coverage | workflow_coverage 按 split 汇总，列出错误码与预算耗尽位置 | CLI 记录实际发现/忽略路径；工作台显示 core 生成的一句话结论 |
| 2.4 离线 HTML | core/offline.mbt 根据实际编码尺寸选择内容、限制总字节并决定报告是否裁剪 | tools/report-tools.mjs 内嵌 JSON/base64 缩略图并生成只读页面，无外部依赖 |
| 2.4 修正建议 CSV | workflow_fixes 计算稳定 group_id、train > validation > test 保留顺序、confirmed 候选组与 CSV 转义 | 主机只校验输入、传递复核记录并写新文件，不修改数据集 |
| 2.5 复核体验 | workflow_components 只沿候选边形成候选分组；workflow_view 负责低对比度折叠和分组范围 | demo/review-validation.mjs 与 demo/app.mjs 通过编译核心驱动分组选择、展开开关与覆盖说明 |

### 规则说明

- `audit --fail-on exact|pixel|candidate` 分别覆盖字节、字节或像素、所有现有三级证据。退出优先级为 1 致命 > 3 命中 > 2 不完整 > 0 完整未命中；不传选项保持旧退出规则。stdout JSON 含 complete、matched、evidenceCounts 和 coverage。
- `verify --report ... --root ...` 只针对确定性配对涉及的文件，但每个读取目标都重新计算字节与完整像素摘要。拒绝报告摘要不符，拒绝路径穿越与符号链接；输出每对状态与观察结果。全部有效退出 0，失效或缺失退出 4，致命输入错误退出 1。
- coverage 的 `audited` 是核心已经完成比较处理的输入前缀；`fingerprinted` 单独记录成功解码并提取指纹的输入数。预算中止时不会把所有已解码图都标成已完成比较。`unprocessedKnownFiles` 只统计已知未处理项，未知剩余数量不猜测；enumerationComplete=false 说明枚举受限。`rejectedByCode` 包含文件拒收及目录/全局错误，汇总字段因此明确命名为 rejectedOrErrorCount。
- `export-html` 默认上限 20 MiB，可用 `--max-bytes` 设为 4096..67108864。正常大小内嵌完整原报告与当前复核；超限时省略配对/媒体，必要时把大报告换成明确命名的部分快照，保留 sourceAuditId，且不把裁剪后的内容冒充可按原 auditId 校验的完整报告。
- `export-fixes` 输出 `group_id,evidence_level,split,path,review_status,suggestion`。确定性组件保留最高优先级的一份；其余建议 remove-from-split。候选只在有效复核记录的 decision=confirmed 后形成建议组件，pending/unsure/rejected 不产生候选建议。输出保留完整稳定组键供外部分组工具使用，所有建议均不执行文件操作。
- 候选分组使用独立的 candidateGroups 字段，不改变现有确定性 groups，也不改变每对证据与独立复核状态。lowContrast 配对默认折叠、单独计数，可一键展开。

## 验收标准逐条对照

| 标准 | 结果与证据 |
|---|---|
| fail-on 四种退出情况，旧 CLI 行为 | tests/phase2.test.mjs 前两组覆盖完整/不完整、命中/未命中、致命、相似候选与等级包含关系；原有 35 项 Node 测试原样通过 |
| CI 示例 | examples/github-action/visionleak.yml 与两张 102 B 的生成 PNG；实际本地命令返回 3 并留存报告，见 phase2-action-example.json。未在 GitHub 执行工作流，runner 安装与 artifact upload 等待第 4 阶段授权推送后核验 |
| verify 篡改、删除、报告篡改 | tests/phase2.test.mjs 覆盖三类结果及 symlink/traversal；自然照片报告额外复验 15 对 valid、0 invalid、0 missing、42 对候选跳过，见 phase2-clean-verify-final.json |
| HTML 断网浏览器验收 | 原文件字节在本次测试页禁网后重新渲染，navigator.onLine=false；57 对、114 张 data JPEG、完整 50 图/57 对报告与 confirmed 复核记录正常。另验证 4096 B 上限产物实际 3515 B，明确省略 57 对且报告 JSON 已裁剪。见 phase2-browser.json、phase2-generated-artifacts.json 与 demo/qa/phase2-offline-desktop.png |
| CSV 人工期望表 | tests/phase2.test.mjs 明确列出三行 keep/remove 与 evidence_level、split、path、review_status、完整 group_id 的期望值；MoonBit 跨后端用例覆盖优先级、confirmed 门槛与 CSV 引号/逗号/换行。实际样例见 demo/qa/phase2-fixes.csv |
| groups 不受候选影响 | MoonBit 测试验证候选连通分组不修改原 groups；8 个冻结模式的 pairs/groups 完整序列与 0.4.0 相同，所有工作计数也无差异，见 phase2-detection-compatibility.json |
| 低对比度和分组界面 | 真实浏览器验证 5 个照片候选组，59 图合成报告低对比度开关使可见配对在 95/96 间切换；390×844 无横向溢出，截图在 demo/qa/phase2-workbench-*.png |

完整 `npm run verify:ci`：**24 项通过**；MoonBit JS、Wasm GC、native debug、native release 各 **77/77**，Node **43/43**，独立指标 **8** 项，发布契约 **10** 项，冻结机制 **4** 项，包内容与客户端兼容边界均通过。见 phase2-source-acceptance.json、logs/phase2-final-* 和 logs/phase2-ci-source-final.log。

指标额外补充了 exact-tier 诊断中含嵌套布尔值的情况，纠正独立比较器对真实布尔元数据的过度拒绝，同时继续拒绝 bool/int 混淆；所有评测仍逐字段与独立 Python 集合 oracle 比较。

## 边界与待后续核验

- 本地浏览器使用 Tabbit 稳定启动器；只对拥有的测试页通过 CDP 禁网，测试结束后已恢复并 detach，测试页和本次两个本地服务均已清理。工作台服务与离线样例服务均只监听 127.0.0.1。
- 浏览器记录绑定了实际加载的核心 artifactDigest，见 phase2-browser.json。随后仅把 verify 的读取目标选择从 JS 移进 MoonBit；界面、分组、coverage 和 HTML 生成逻辑未变，最终源码另由完整 CI 摘要绑定。
- 离线 HTML 是可再生的工具输出，保留在 demo/qa/phase2-offline*.html 本地并忽略 Git；其真实内容摘要与大小已留证，截图和 QA 输入纳入提交。手写模板实现 tools/report-tools.mjs 正常计入 JavaScript 字节，不隐藏产品源码。
- 主体文档继续留给 Claude 审改；新的命令可通过 CLI --help 与本报告了解。阶段 3 的裁切、扩大评测与规模测试尚未开始；版本仍是 0.4.0，第 4 阶段统一升至 0.5.0。
- 没有执行 act/GitHub 远端工作流、推送、正式 Mooncakes 发布、Release 或赛事提交。第 0 阶段的发布器兼容层仍保留，是否随新工具链删除按 review-0.md 的建议在第 4 阶段评估。

## 文件与提交

实现文件及 SHA-256 见 phase2-implementation-files.json。M0 前置提交已列于 phase-0.md，本阶段实现提交（本报告提交前）：

- `4b3e5eca49c46309ab8145f2b3253e3f825cc4d9` — feat(visionleak): add core policies for gates verification and handoff
- `dfe981b906413abb64b45c2989b191ece719119e` — feat(visionleak): expose CI gates and portable evidence review
- `b71f26d5d71e948893ee0355ee98664f0edc3031` — fix(visionleak): preserve boolean metadata in independent metric diagnostics

## 语言统计

| 语言 | 字节 |
|---|---:|
| MoonBit | 163,536 |
| JavaScript | 151,810 |
| Python | 113,457 |
| HTML | 11,658 |
| CSS | 23,299 |
| Shell | 778 |

MoonBit 为最大语言；不计生成的 `.mbti`（1,414 B）仍为 162,122 B，高于 JavaScript。方法与完整文件清单见 languages-phase2-final.json；仅实际编译产物排除为 generated，忽略的 HTML 是工具生成的交付样例，没有把手写代码标为 vendored/documentation。

最终源码摘要：`dabe011b7bec042c202b1c2e67d15a0d141b4b5aee2cdcad2d24bd355fbc94a1`。最终编译产物 SHA-256：`73f480fb1b015576e44c187f4de22066fb2e29292f42db77f398dac07afb33ed`。当前 Mooncakes 核心包 30,589 B，仍低于 M0-3 的 1 MB 上限。
