# 第 0 阶段验收：有条件通过

验收方：Claude。日期：2026-10-25。依据：`phase-0.md`、`followup-acceptance.md`、`mooncakes-exit-fix.md`，以及下列独立复核。

## 独立复核

| 项目 | 方法 | 结果 |
|---|---|---|
| MoonBit 测试 | `./tools/moon test --target js`、`--target native` | 65/65、65/65 通过 |
| Node 测试 | `npm test` | 35/35 通过 |
| 语言字节 | 对 `git ls-files -co --exclude-standard` 按扩展名统计，排除 `dist/` 与 `research/baselines/*.mjs`（均已标 generated） | MoonBit 127,740 B；JavaScript ≈125,282 B；Python 111,529 B（不含 `.mbti`） |
| 迁移落点 | 阅读 `tools/evaluate.py`、`tests/oracle-runner.mjs`、`moon.mod`、`.gitattributes` | 见下方问题 |
| `.gitattributes` | 阅读 | 只标记编译产物，符合计划 |

报告身份 39/39 历史样例一致、浏览器 8 组检查的结论未逐项重跑，采信其证据文件。

## 认可之处

- 迁移是实质性的：报告身份、复核校验、CLI 参数、split 解析、指标都由 MoonBit 主路径执行，JS 旧实现已删除，没有保留双份实现。
- 历史 `auditId` 兼容性有完整证据。
- 发现 Mooncakes 客户端把 202 当作失败，并给出了可复现的定位过程。

## 必改项（进入第 2 阶段前完成）

**M0-1 提交记录为空。**
0.2.0 到第 1 阶段的全部改动都还在工作区，没有任何 commit。这带来两个问题：
- 赛事验收要求"清晰合理的开发记录"。
- 后续阶段的改动无法与本阶段区分，我也无法按 diff 验收。

只暂存 `projects/visionleak/` 下的路径即可，不会混入其他项目的改动。

**授权状态（2026-10-25）：负责人已授权 GPT 只暂存 `projects/visionleak/` 下的路径，按有意义的分组提交。** 授权范围仅限本地 commit；推送、改写历史、force push 仍需另行同意。提交前用 `git diff --cached --stat` 确认暂存区里没有其他项目的文件，并在阶段报告中列出 commit hash 与标题。建议拆成有意义的若干 commit，例如：0.2.0–0.4.0 历史交付、评测冻结机制、核心逻辑迁移到 MoonBit、流式像素摘要与大图支持、split 别名、Mooncakes 元数据。

**M0-2 评测指标变成了"被测系统给自己打分"。**
`tools/evaluate.py` 的 `score()` 现在调用 MoonBit 的 `score_json`；`tests/oracle-metrics.py` 测的也是这条路径。0.4.0 之前，TP/FP/FN 由独立的 Python 代码计算。现在只剩"与历史结果一致"这一层保证，以后的新评测（裁切模式、新保留组）将没有独立核对。

这是计划书 0.1 第 4 项本身的疏漏，责任在计划方。修正方式：
- 保留 MoonBit 指标作为产品路径。
- 在 `tests/` 中恢复一个最小的独立 Python 集合计算，每次评测都与 MoonBit 输出逐字段比较，不一致即失败。
- 计划书已同步修订。

**M0-3 Mooncakes 发布包内容过大。**
dry-run 包约 16 MB、632 个条目，含测试图片、报告和历史编译引擎。Mooncakes 包应只含 MoonBit 核心源码、README、LICENSE 和必要元数据。请用 `moon.mod` 支持的包含/排除机制限制内容，目标在 1 MB 以内，并重新 dry-run 列出条目。

## 建议项（不阻塞）

- **语言占比余量很薄**：MoonBit 只比 JavaScript 多约 2%。第 2 阶段的 `verify`、`--fail-on`、`export-*`、候选分组都会新增代码，**判定逻辑必须写在 MoonBit**，JS 只做 I/O 和展示。每个阶段报告都要附上语言统计。
- **dry-run 退出码兼容层**（`tools/moon` → `tools/mooncakes_dry_run.py`）：分析做得严谨，但这是为固定旧版发布器的上游缺陷加的一层封装，长期维护成本高于收益。建议先确认新版 `mooncake` 是否已修复；如已修复，在第 4 阶段改为升级工具链并删除兼容层。不阻塞。
- `reports/plan-0.5.0/` 下的探测脚本（`mooncakes-probe-*.py`）如果进入 git，会计入 Python 统计。建议改成 `.txt` 附件或不提交。
- 报告中提到复用了负责人的 Mooncakes 登录状态。请负责人确认这一授权属实。
