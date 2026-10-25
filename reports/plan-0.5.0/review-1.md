# 第 1 阶段验收：通过

验收方：Claude。日期：2026-10-25。依据：`phase-1.md`、`detection-compatibility.json`、`tests/large-images.test.mjs`、`tests/split-aliases.test.mjs`，以及第 0 阶段验收中的独立测试运行（MoonBit 65/65、Node 35/35）。

## 逐项结论

| 计划项 | 结论 | 说明 |
|---|---|---|
| 1.1 冻结机制 | 通过 | 冻结记录按版本存放（`research/photos-v1/freeze/0.4.0.json`），旧文件保留；检测结果严格比较，`stats` 与耗时只输出差异；`--allow-detection-change` 必须给出理由。8 个模式的检测结果与工作计数均为零差异。 |
| 1.2 大图 | 通过 | 按 D3(a) 实现：MoonBit 增量 SHA-256 加完整像素规范化，摘要域未变；12MP 的字节副本与无损 PNG 副本分别判为字节相同、像素相同，并用 Node crypto 独立核对。峰值 RSS 225 MiB。 |
| 1.3 split 别名 | 通过 | 16 种组合、8 种冲突都有测试；`scope.splitDirectories` 记录映射；冲突在创建输出前报错。 |

## 需记录的行为变化

`--max-pixels` 的含义从"超过即拒收"变成了"感知取样上限"；拒收改由新参数 `--max-decode-pixels` 控制（默认 64MP）。旧脚本里用 `--max-pixels` 拒收大图的用法，行为会变。第 4 阶段的 `docs/changes-0.5.0.md` 必须把这一点列为**不兼容变化**，并给出迁移写法。

## 遗留观察（不阻塞）

- Node/sharp 仍会先完整解码一次 RGBA（64MP 约 256 MB）。报告里已如实说明。第 3 阶段规模测试时，请记录 `--max-decode-pixels` 取默认值时的最坏内存。
- 0.4.0 的保留组已正确转为回归集。
