# VisionLeak 0.5.0 参赛优化计划书

编制日期：2026-10-25。执行方：GPT。阶段验收与文档修订：Claude。最终决策与对外操作：项目负责人（下称"负责人"）。

本计划把两轮评审意见合并成一个可执行版本。目标不是"更好的去重工具"，而是把 VisionLeak 定位为 **可复核的图像数据集重复审计与 CI 关卡**：确定性证据零误报、结果完整性可声明、报告可离线移交。所有改动围绕三件事：消除参赛资格风险、加强这一定位的差异点、补足评委可能质疑的弱项。

---

## 1. 背景与已核实事实

| 事实 | 依据 | 影响 |
|---|---|---|
| 验收要求发布到 mooncakes.io，当前**未发布** | 总控 `research/contest-rules.md`；`PUBLICATION.md` 第 25 行 | 资格硬性条件 |
| 公开仓库 `cjyhjy/moonbit-visionleak` 语言统计：JavaScript 69,990 B / Python 44,309 B / MoonBit 22,758 B，主语言显示为 JavaScript | `gh api repos/cjyhjy/moonbit-visionleak/languages`（2026-10-25） | 规则要求"MoonBit 为主要实现语言"，资格风险最高 |
| 公开仓库最后推送 2026-10-22，未含 0.4.0 | 同上 API `pushed_at` | 评委看到的是旧版本 |
| 截止日期官方材料冲突：官网 10-31，章程十月行 10-24 | `research/contest-rules.md` | 负责人需向赛事群确认；本计划按 10-31 排期 |
| 单图超过 4,194,304 像素直接报 `PIXEL_BUDGET`，不降采样 | `tools/decode.mjs` `HARD_MAX_PIXELS` | 真实照片（如 12MP）无法审计，阻碍扩大评测与规模测试 |
| 照片评测冻结断言要求旧模式 `pairs/groups/stats` 与基线逐项相同 | `tools/evaluate-photos.py` 第 186–190 行 | 任何改变工作计数的优化都会被验收拒绝 |
| 核心已计算 `lowContrast`，界面未用于降权 | `core/audit.mbt` 第 132 行；`demo/app.mjs` 第 183 行 | 合成评测两个误报正属此类 |
| 发现重复不改变退出码 | `tools/cli.mjs` 第 43 行 | 无法直接用作 CI 关卡 |
| split 目录名只认 `train/validation/test` | `tools/cli.mjs` 第 11 行 | 常见的 `val/valid/dev` 不被识别 |
| 公开仓库已有 Linux CI 且通过 | `PUBLICATION.md` | 不再列为改进项 |

## 2. 总原则与禁止事项

**必须遵守：**

1. 不改变现有三级证据（字节相同 / 像素相同 / 感知候选）的语义与判定。新增能力一律以新字段、新级别或默认关闭的选项出现。
2. 默认模式在现有 59 张合成图与 100 张照片上的 `pairs`、`groups` 必须与 0.4.0 逐项一致；如因设计必须改变，先在阶段报告中说明并等待验收方确认。
3. 每个结论区分"已运行验证"与"推测"。未测项写明未测。
4. 每个 commit 有实际意义，风格沿用现有 `feat(visionleak): ...` / `fix(...)` / `test(...)` / `docs(...)`。不创建空提交或机械拆分。**只暂存 `projects/visionleak/` 下的路径**，不混入其他项目改动；每个阶段结束前完成该阶段的提交，阶段报告列出 commit。
5. 历史报告、历史 ZIP、历史冻结记录只追加不覆盖。

**禁止：**

- 撰写、润色或代拟**正式参赛申报书**。赛事规则明确申报书须人工撰写，不得用 AI 编写。可以提供事实表（见第 4 阶段）。
- 通过把真实源码标为 `linguist-vendored` / `linguist-documentation` 等方式刷语言占比。只有确属编译产物的文件（如 `dist/`）可以标为 `linguist-generated`。
- 迁移到 MoonBit 后仍在主路径保留 JS 等价实现（即"双份代码只为凑字节"）。迁移后主路径必须调用 MoonBit，JS 旧实现删除；独立 oracle 除外（见 0.3）。
- 未经负责人明确同意：推送公开仓库、force push、改写 git 历史、发布 Mooncakes、创建 GitHub Release、提交任何表单。
- 下载许可不明确的图片；伪造或推算评测数据。

## 3. 需要负责人决定的事项

| 编号 | 决策 | 选项 | 验收方建议 | 截止 |
|---|---|---|---|---|
| D1 | 十月截止日期 | 向赛事群确认 | — | 10-25 |
| D2 | Mooncakes 账号与模块名 | 当前 `moon.mod` 为 `visionleak/core`，需改为 `<账号>/visionleak` 一类 | 由负责人提供账号名 | 10-26 |
| D3 | 大图的像素摘要 | (a) MoonBit 流式 SHA-256，对全分辨率计算；(b) 报告声明大图像素证据基于降采样 | **(a)**：保持"像素相同"语义不打折，同时是实质性 MoonBit 代码 | 10-26 |
| D5 | 本地提交授权 | — | **已决定（2026-10-25）**：授权 GPT 只暂存 `projects/visionleak/` 下的路径，按有意义的分组本地提交；推送与改写历史不在授权内 | — |
| D4 | release ZIP 处理 | 从 git 跟踪中移除并上传 GitHub Releases；不改写历史 | 同意移除跟踪，不改写历史 | 10-29 |

D2、D3 未决定前，GPT 可先做不依赖它们的任务。

---

## 4. 分阶段任务

排期：D0 = 10-25。第 0、1 阶段须经 Claude 验收通过后才进入第 2 阶段；第 2、3 阶段可并行推进、分别验收；第 4 阶段开始前，所有阶段须为"通过"或"有条件通过且条件已满足"。

### 第 0 阶段（D0–D1）：资格保底

**0.1 语言占比**

- 检查公开仓库与本地是否跟踪 `dist/`；对编译产物添加 `.gitattributes`（`dist/** linguist-generated=true`）。
- 把本属于核心审计逻辑、目前在 JS/Python 中的代码迁到 MoonBit，主路径改为调用 MoonBit，删除 JS 旧实现。候选清单（按收益排序，GPT 可调整但需说明）：
  1. 报告身份摘要：规范化 JSON + SHA-256（现 `demo/report-identity.mjs`、服务端校验）。浏览器端通过编译产物调用。
  2. 复核记录校验（现 `demo/review-validation.mjs`）。
  3. CLI 参数与预算校验（`tools/cli.mjs` 中的范围检查）。
  4. 评测指标计算：根据真值计算 TP/FP/FN、分组统计（现 Python 评测脚本中的纯计算部分）。**须同时在 `tests/` 保留一个最小的独立 Python 指标计算，每次评测与 MoonBit 输出逐字段比对**，避免被测系统给自己打分（2026-10-25 修订）。
  5. 核心功能测试：把 `tests/core.test.mjs` 中直接测试核心算法的用例迁为 MoonBit 测试（`*_test.mbt` / `*_wbtest.mbt`），JS 侧仅保留 ABI/集成测试。
- 第 3 阶段的裁切检测、第 1 阶段的流式 SHA-256 也会增加 MoonBit 代码，计入此目标。

**0.2 Mooncakes 前置**

- 按 D2 修改模块名，确认 `moon publish` 所需元数据（license、description、repository、readme、keywords）齐全，`moon check` / `moon test` 三后端通过。
- 准备发布命令与检查清单；**发布本身由负责人执行或明确授权**。
- 发布包只含 MoonBit 核心源码、README、LICENSE 与必要元数据，用 `moon.mod` 的包含/排除机制控制，目标 < 1 MB（2026-10-25 修订）。

**0.3 独立性说明**

- Python 中的 ImageHash 对照属于独立 oracle，必须保留为 Python，不迁移。在 `docs/development.md` 中写明哪些代码是产品路径、哪些是独立 oracle，供评委理解语言构成。

**验收标准：**

- [ ] 本地用 `github-linguist`（或等价统计脚本，说明方法）统计，MoonBit 为字节数最多的语言；同步后公开仓库 `languages` API 同样如此（同步须负责人同意，可延后到第 4 阶段核对）。
- [ ] 迁移的每一项：主路径调用 MoonBit 的位置（文件:行号）、删除的 JS 文件或函数、对应测试列表。
- [ ] 报告身份摘要迁移后，0.1.0–0.4.0 所有已提交示例报告的 `auditId` 与原值一致。
- [ ] `moon test --target js|wasm-gc|native` 全部通过；`npm test` 全部通过。
- [ ] Mooncakes 发布检查清单与 `moon publish --dry-run`（若支持）输出。

### 第 1 阶段（D1–D2）：修硬伤

**1.1 评测冻结机制（必须最先做）**

- 冻结记录按版本保存，例如 `research/photos-v1/freeze/0.4.0.json`，新版本另建文件；历史文件不改。
- 评测脚本分两类断言：
  - **检测结果**（`pairs`、`groups`、证据级别、距离）：与指定基线逐项比较，不同即失败，除非命令行显式声明变更并在报告中列出差异。
  - **工作量与性能**（`stats`、耗时）：输出差异表，不作为失败条件。
- 合成评测 `tools/evaluate.py` 若有同类问题一并处理。

**1.2 大图支持**

- 解码时对超过单图上限的图片使用 sharp shrink-on-load 降到上限以内用于 dHash 与缩略图；`byteDigest` 始终针对原文件。
- 按 D3：
  - (a) 在 MoonBit 中实现分块/流式 SHA-256 接口，Node 按行块传入全分辨率规范化 RGB，像素摘要域与现有 `VL1 + 宽 + 高 + RGB` 完全一致；或
  - (b) 报告每张图记录 `pixelDigestBasis: "full" | "downsampled"`，降采样图不参与"像素相同"判定。
- 报告新增字段说明 dHash 是否基于降采样图。`--max-pixels` 语义需在 `docs/cli.md` 中更新（区分"可解码上限"和"指纹计算上限"）。

**1.3 split 别名**

- `train|training` → train，`validation|val|valid|dev` → validation，`test|testing` → test。
- 同一 split 的多个别名目录同时存在时报错 `SPLIT_ALIAS_CONFLICT`，不合并。
- 报告 `scope` 记录实际目录名到 split 的映射。

**验收标准：**

- [ ] 在 0.4.0 冻结基线上运行新评测脚本：检测结果断言全部通过；工作量差异表输出（此时应为零差异）。
- [ ] 测试时现场生成一张 ≥12MP 的 JPEG（不提交到仓库），CLI 完成审计，`complete=true`。若选 (a)：该图与其逐字节复制件判为字节相同；与重新编码为无损 PNG 的副本判为像素相同。
- [ ] 默认模式在 59 张合成图、100 张照片上 `pairs/groups` 与 0.4.0 逐项一致。
- [ ] 别名映射、冲突报错各有测试。
- [ ] 内存：12MP 图审计的峰值 RSS 记录（macOS `/usr/bin/time -l`）。

### 第 2 阶段（D2–D4）：加强差异点

**进入条件**（2026-10-25 修订）：第 0 阶段必改项 M0-1 至 M0-3 已完成。本阶段新增的判定逻辑（`--fail-on` 判定、`verify` 比对、`coverage` 汇总、修正建议规则、候选分组）一律写在 MoonBit 中，JS 只负责 I/O 与展示。阶段报告须附语言字节统计。

**2.1 CI 关卡：`--fail-on`**

- `audit --fail-on exact|pixel|candidate`：`exact` 指字节相同，`pixel` 指字节或像素相同，`candidate` 包含感知候选。
- 退出码：1 致命错误 > 3 命中 `--fail-on` 级别 > 2 不完整 > 0 完成且未命中。命中时即使报告不完整也返回 3（确定性证据本身有效），stdout JSON 同时给出 `complete` 与命中计数。
- 不指定 `--fail-on` 时行为与 0.4.0 完全一致。
- 提供 `examples/github-action/` 下的工作流示例与一个最小演示数据集：test 中混入一张训练图时 CI 失败。

**2.2 证据复核：`verify` 子命令**

- `node tools/cli.mjs verify --report <report.json> --root <dataset>`：重新读取报告中确定性证据涉及的文件，重新计算字节摘要（MoonBit SHA-256）和像素摘要（Node 解码 + MoonBit），逐对输出 `valid | invalid | missing`。
- 校验报告身份摘要；报告被改动时拒绝复核。
- 退出码：0 全部有效；4 存在失效或缺失；1 致命错误。

**2.3 完整性说明**

- 报告新增 `coverage` 段：按 split 统计已审计 / 被拒收（按错误码分类）/ 忽略的文件数，以及预算耗尽点（如有）。
- 工作台与 CLI stdout 显示一句话结论，例如"已审计 train 1,000 / validation 200 / test 200；12 张因 DECODE_ERROR 未审计；结论只覆盖已审计部分"。

**2.4 可移交输出**

- `export-html`：生成单个离线 HTML 文件，内嵌报告、涉及配对的缩略图和当前复核状态（只读）。设大小上限（默认 20 MB），超限时截断并在页面写明。
- `export-fixes`：CSV，列为 `group_id, evidence_level, split, path, review_status, suggestion`。建议规则：确定性重复组按 train > validation > test 保留最前一份，其余标 `remove-from-<split>`；感知候选只有人工复核为"重复"后才给建议。工具不执行任何文件操作。
- group key 一并导出，便于交给 MoonSplit 等划分工具作为约束。

**2.5 复核体验**

- `lowContrast` 配对默认折叠并单独计数，可一键展开。
- 感知候选按连通关系形成"候选分组"（在 MoonBit 中计算，字段名与确定性 `groups` 区分），工作台按组浏览；每对仍保留独立依据与复核状态。

**验收标准：**

- [ ] `--fail-on` 四种退出情况各有集成测试；未加参数时 0.4.0 的 CLI 测试全部原样通过。
- [ ] GitHub Action 示例在本地用 `act` 或等价方式运行，或说明仅待推送后验证（列为第 4 阶段核对项）。
- [ ] `verify`：篡改一个文件后对应证据变为 `invalid`，删除文件变为 `missing`，改动报告内容被拒绝。
- [ ] `export-html` 产物在断网状态下用浏览器打开，证据与复核状态正确显示（截图存入 `demo/qa/`）。
- [ ] `export-fixes` 在合成基准上的输出与人工计算一致（测试中给出期望表）。
- [ ] 确定性 `groups` 不受候选分组影响。

### 第 3 阶段（D3–D5）：补弱项

**3.1 裁切检测（算法贡献）**

- 在 MoonBit 中实现默认关闭的 `--include-crops`：例如多尺度/分块局部 dHash，具体方案由 GPT 设计，需满足：
  - 新证据级别 `local-candidate`，与 `perceptual-candidate` 分开计数、分开展示；
  - 受现有 `maxComparisons` 预算约束，耗尽时 `complete=false`；
  - 不仅适配中心裁切，覆盖偏移裁切和不同比例。
- 用 ImageHash `crop_resistant_hash`（已在 `research/.venv-oracle` 中可用）作为外部对照基线。
- 按开发组设计、冻结实现、保留组检验的既有协议执行。

**3.2 扩大评测**

- 新增 30–50 个许可明确的照片来源（CC0、公有领域，或 CC-BY 并按要求署名），逐张记录来源、作者、许可、SHA-256。
- 加入困难负例：同一场景的不同照片（如连拍、相邻机位），作为"不同来源"负例。
- 新划分开发组与**全新保留组**；0.4.0 的保留组转为回归集，不再称为保留组。
- 控制仓库体积：原图可按许可允许的方式缩小后提交，或只提交来源清单与下载校验脚本；说明选择。

**3.3 规模测试**

- 用确定性脚本在测试时生成 1,000 与 5,000 张图像（不提交），分别在 default / mirrors / orientations / crops 模式下运行。
- 记录墙钟、峰值 RSS、比较次数、是否触发预算。若 `--max-images` 上限需调整，说明依据。

**3.4 展示与仓库卫生**

- README 首屏：一句话定位、工作台截图、CI 关卡演示、三行命令；版本历史移到 `CHANGELOG.md`；局限集中在一节。README 修改稿由 Claude 审改。
- 按 D4 处理 release ZIP。

**验收标准：**

- [ ] 裁切模式：保留组上 `local-candidate` 的 TP/FP/FN、与 ImageHash crop 基线的对照表、额外工作计数；默认与其他模式输出不变。召回不设硬性目标，但结论须与数据一致。
- [ ] 新评测：来源清单、许可、困难负例数量；开发组与新保留组的指标分别报告；明确保留组在冻结前未被查看（附冻结文件摘要与时间顺序）。
- [ ] 规模测试原始结果 JSON 与摘要表。
- [ ] README 首屏 30 行内能看到定位、截图、命令。

### 第 4 阶段（D5–D6）：冻结与提交准备

1. 版本号统一为 0.5.0（`package.json`、`moon.mod`、文档），写 `docs/changes-0.5.0.md`，其中把 `--max-pixels` 从"拒收上限"改为"感知取样上限"列为不兼容变化并给出迁移写法。
2. 完整运行 `node tools/verify.mjs`、`python3 tools/package.py`、`python3 tools/accept-release.py`，生成 0.5.0 ZIP 与包外验收记录。
3. 按总控既有流程准备公开仓库同步；**经负责人同意后**推送，确认远端 CI 通过、`languages` API 显示 MoonBit 为主语言。
4. **经负责人同意后**发布 Mooncakes，记录包页面链接。
5. 产出 `docs/fact-sheet-0.5.0.md`：只列事实（功能、数据、测试结果、差异点、局限、链接），不写成申报书叙事。负责人据此人工撰写申报书。
6. 10-31 留作缓冲，不安排新功能。

**验收标准：**

- [ ] 三份验收脚本全部通过，日志在 `reports/logs/`。
- [ ] 远端 CI 链接、Mooncakes 链接、语言统计截图或 API 输出。
- [ ] 事实表中每个数字都能在报告文件中找到出处。

---

## 5. 时间不足时的取舍

按以下顺序削减：3.3 规模测试 → 3.2 扩大评测 → 3.1 裁切检测 → 2.4 中的 `export-html`。

不可削减：第 0 阶段、1.1、1.2、2.1（含 CI 演示）、第 4 阶段。

## 6. 阶段报告与验收流程

**GPT 每完成一个阶段**，写 `reports/plan-0.5.0/phase-<N>.md`，包含：

1. 完成项列表。
2. 逐条对照本阶段验收标准：运行的命令、关键输出摘要、证据文件路径。
3. 与计划的偏离及原因。
4. 未完成项及影响。
5. 新增/修改文件清单与 commit 列表（hash + 标题）。

**Claude 验收**后写 `reports/plan-0.5.0/review-<N>.md`，结论为：

- **通过**：进入下一阶段。
- **有条件通过**：列出必改项，可进入下一阶段，但第 4 阶段前须完成。
- **不通过**：列出原因与必改项，修正后重新提交阶段报告。

Claude 同时负责修订本计划书与面向用户的文档（README、`docs/`、CHANGELOG、事实表）。计划变更记录在下方。

## 7. 计划变更记录

| 日期 | 变更 | 原因 |
|---|---|---|
| 2026-10-25 | 初版 | 合并两轮评审意见 |
| 2026-10-25 | 第 0 阶段验收后修订：指标须保留独立 Python 核对；Mooncakes 包限定核心内容；提交只暂存本项目路径且按阶段提交；第 2 阶段增加进入条件与"判定逻辑在 MoonBit"约束；第 4 阶段 changes 须列出 `--max-pixels` 语义变化 | 见 `reports/plan-0.5.0/review-0.md`、`review-1.md` |

## 2026-10-25 执行交接追加

负责人已说明 Claude 账号无法继续使用，并要求 Codex 继续按本计划推进。后续方向落实、文档和阶段复核由 Codex 接手，记录实际复核者及证据，不冒充 Claude 或独立评审。原评审记录保留。

D4 已决定：移除 release ZIP 的 Git 跟踪，保留本地文件和已有历史，正式发布后使用 GitHub Releases。当前 `git ls-files release` 没有跟踪的 ZIP，已有 release 忽略规则；无需删除历史或执行 git rm。
