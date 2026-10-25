# VisionLeak 0.5.0 事实表

本地候选版本；公开推送与正式 Mooncakes 发布待负责人同意。本文提供可核对事实，不是参赛申报书。

| 事项 | 事实 | 依据 |
|---|---|---|
| 定位 | 审计图像数据集跨 train / validation / test 的重复与候选泄漏；输出证据和人工复核队列，不自动删除或移动图片 | [README](../README.md)、[CLI](cli.md) |
| 确定性证据 | 文件 SHA-256、白底 alpha 归一化后全分辨率流式像素 SHA-256；取样上限不改变像素相同的定义 | [API](api.md)、[迁移说明](changes-0.5.0.md) |
| 候选证据 | 全图 dHash；可选镜像、旋转和局部裁切。裁切默认关闭，使用 20 个固定窗口及独立 BK-tree，服从共享比较预算；局部候选不进入确定性分组 | [阶段 3](../reports/plan-0.5.0/phase-3.md)、[实现](../core/crops.mbt) |
| 工作流 | fail-on CI 关卡、证据重验、备注和复核状态、只读离线 HTML、修正建议 CSV；只有复核确认后的候选给出建议 | [CLI](cli.md)、[阶段 2](../reports/plan-0.5.0/phase-2.md) |
| 完整验证 | 23 项检查通过；MoonBit JS / WasmGC / native debug / native release 各 80 个测试，Node 46 个；独立指标 8 个、来源/冻结重放 2 个、历史基线兼容 6 个 | [最终验证](../reports/verification.json)、[日志](../reports/logs/) |
| 新照片来源 | 32 个 CC0 Commons 文件来源，16 开发、16 新保留，按来源与场景隔离；原图许可允许缩小，最长边 384 像素，记录作者、许可和下载/保存摘要 | [归属](../research/photos-v2/ATTRIBUTION.md)、[清单](../research/photos-v2/sources.json) |
| 评测样本 | 两个分区各 112 张受控变换图，各 672 对同场景不同文件来源困难负例 | [开发](../reports/plan-0.5.0/crops-development/evaluation.json)、[新保留](../reports/plan-0.5.0/crops-holdout/evaluation.json) |
| 冻结协议 | 实现和参数于 2026-10-25 16:35:37 UTC 冻结，之后下载和评测新保留组；未根据保留结果调参。旧 photos-v1 保留组在本版仅作回归 | [冻结](../research/photos-v2/freeze-0.5.0.json)、[阶段证据](../reports/plan-0.5.0/phase3-acceptance.json) |
| 浏览器 | 桌面和手机视口验证计数、筛选、窗口见证、标记撤销和刷新恢复；350,710 字节离线 HTML 断网重渲染，3 对证据、6 张内嵌图均显示 | [实际记录](../reports/plan-0.5.0/phase3-browser.json)、[最终 QA](../demo/qa/verification.json) |
| 规模资源 | 1000 图默认：1.004 秒、194.47 MiB RSS、190941 次比较，完整。5000 图默认：4.628 秒、261.59 MiB RSS，达到 1000000 比较预算，结论不完整 | [机器及全部模式原始记录](../reports/plan-0.5.0/scale-phase3-final/results.json) |
| 解码边界 | 64MP 单图默认边界：2.869 秒、391.47 MiB RSS，完成；不证明所有编码和内容的最坏内存 | [原始记录](../reports/plan-0.5.0/scale-phase3-final/results.json) |
| Mooncakes 包 | `cjyhjy/visionleak@0.5.0` 核心包 32,775 字节，强制小于 1,000,000 字节；白名单排除测试图片、报告和宿主工具。实际 dry-run 202 成功，有效退出 0，未正式发布 | [包收据与日志](../reports/plan-0.5.0/phase4-core-package.json) |
| 交付包 | 完整源码/运行 ZIP 与核心发布包分别交付；最终 ZIP 摘要与干净目录验收记录放在包外，避免摘要自引用 | [最终包验收记录](../reports/release-verification.json)、[交付说明](../DELIVERY.md) |
| 语言统计 | 本地透明字节统计 MoonBit 最大；统计含手写测试和独立 oracle，只排除真实编译产物。当前远端语言结果须在新版本获准推送后重新确认 | [统计明细](../reports/plan-0.5.0/languages-phase4-final.json) |

## 裁切候选指标

这些 TP / FP / FN 使用 near-only 真值范围；“合并”还包括既有全图候选。ImageHash 为 `crop_resistant_hash` 对照；局部索引与独立穷举逐对一致，产品指标与独立 Python 实现逐字段比较。

| 分区 / 方法 | TP | FP | FN |
|---|---:|---:|---:|
| 开发 / 局部候选 | 113 | 1 | 63 |
| 开发 / 合并候选 | 145 | 1 | 31 |
| 开发 / ImageHash | 118 | 16 | 58 |
| 新保留 / 局部候选 | 117 | 44 | 59 |
| 新保留 / 合并候选 | 149 | 54 | 27 |
| 新保留 / ImageHash | 101 | 35 | 75 |

来源：[开发原始报告](../reports/plan-0.5.0/crops-development/evaluation.json)、[新保留原始报告](../reports/plan-0.5.0/crops-holdout/evaluation.json)。

## 局限和发布状态

32 个文件来源不等于 32 个独立拍摄群体；部分受控裁切与固定窗口对齐。本实验不衡量自然污染率，也不能证明任意裁切、尺度变化的召回或跨数据集性能领先。新保留组局部候选有 44 对误报，因此保持默认关闭，必须人工复核。规模测试使用确定性生成图，只说明该环境下的资源消耗；预算耗尽时必须保留不完整结论。

本版完成本地构建、验证及 dry-run；正式 Mooncakes、新版本 GitHub 推送、远端 CI、GitHub Release 和赛事提交属于后续发布步骤。npm 清单保持 private，无需发布 npm。公开仓库地址见 README；历史远端同步证据见 [git-sync-2026-10-25.json](../reports/plan-0.5.0/git-sync-2026-10-25.json)，不代表本版已上线。Codex 接手阶段复核属于原实现者自查，不是独立 Claude 评审。
