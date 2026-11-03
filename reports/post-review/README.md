# 初审后执行与本地验收（0.7.0）

本轮完成本地实现与自测。没有提交、推送、发布新包或提交比赛材料；公开 0.6.0 的历史收据保留在 `../plan-0.6.0/publication/`。本目录中的日期/时间字段以 UTC 记录，本次用户日期为 2026-10-30（America/New_York）。

## 落地范围

| 项目 | 结果 |
| --- | --- |
| 确定性优先 | 字节/像素阶段先执行；全图与裁切阶段分别有预算和覆盖记录，前序未完成时后序跳过 |
| CSV 划分输入 | `--manifest`，严格路径与重复记录校验，清单摘要绑定报告 |
| 指纹缓存 | `--cache`，内容与配置键；冷/热/禁用结果一致，命中仍执行全部审计 |
| 新来源评测 | 先冻结后下载的 12 个 CC0 文件来源，108 张受控变换样本；保存全部漏检 |
| 复核排序 | 默认关闭的实验顺序，最多计算 200 对局部候选；不删候选、不提升证据等级 |
| 答辩闭环 | 审计 → CI 关卡 → 复验 → 明确标记的脚本复核 → 离线报告/建议 → 修正副本重审 |
| 材料同步 | README、API、CLI、架构、演示、CHANGELOG、DELIVERY 统一；历史数字明确标注版本 |

具体参数、预算及身份迁移见 [0.7.0 说明](../../docs/changes-0.7.0.md)。旧 auditId/人工复核不自动迁移。

[最终验收摘要](acceptance.json) 绑定本次源码、编译文件和证据摘要。

## 验收证据

- [完整 CI 本地收据](ci/verification.json)：26 个检查全部通过；JS/Wasm-GC/native 各 82 项核心测试，native release 另行构建并执行，Node 54 项通过。含固定工具链新构建一致性、Mooncakes 包内容/兼容、历史身份、ImageHash 和独立穷举。
- `ci/*.log`：各检查原始日志。收据的 `matchesCommitted` 是历史字段名，实际检查本次工作区附带的编译文件与新构建字节是否一致，不代表已提交 Git。
- [Chrome 验收](browser.json)：桌面与 390px 窄屏、阶段提示、全图/局部候选排序、筛选、标记、撤销、局部窗口显示；保存截图。没有 Safari/Firefox/Windows 的新增验收。浏览器连接器禁止 file:// 导航；离线 HTML 已通过导出集成检查，但未以本地文件协议打开做视觉验收。
- [规模测量](scale/results.json)：同一 SHAKE-256 32×32 RGB 合成方法；1k/5k 四模式与 64MP 解码边界。`scale-driver.py` 仅为原测量脚本补充保存阶段统计，未改变生成、CLI 参数或算法。
- [演示收据](walkthrough.json)：原生成数据摘要保持不变，CI 重复退出 3，修正副本重审退出 0，缓存身份一致。脚本复核明确标注，并非真人实验。
- [本机能力合同](capabilities.json)：实际版本、参数范围、阶段语义与编译文件摘要。

`scale-sandbox-attempt/` 保留首次资源测量被 macOS 沙箱阻止的诊断；完成测量使用相同脚本在允许读取资源计数的环境中执行。正式结果以 `scale/results.json` 为准。

## 新照片结果与边界

[来源及许可](../../research/photos-v3/ATTRIBUTION.md) · [下载前冻结](../../research/photos-v3/freeze-0.7.0.json) · [详细评测](photos/evaluation.json) · [全部来源标签](photos/ground-truth.json)

| 指标 | 默认模式 | 加裁切 |
| --- | ---: | ---: |
| 确定性 TP / FP / FN | 36 / 0 / 0 | 36 / 0 / 0 |
| 非确定性候选 TP / FP / FN | 96 / 0 / 144 | 123 / 0 / 117 |
| 非确定性召回 | 40.0% | 51.25% |

全图与局部索引均与独立 Python 穷举一致，精确分组不变。压缩、水印、颜色变化的原图配对各检出 12/12，截图边框检出 9/12；**两类随机偏移裁切与原图的配对合计 0/24，固定窗口法的短板仍然存在。** 不能以部分裁切变体之间相互匹配代替对原图的召回。

候选共 123 对。按本次 108 张样本归一化为每千图 1138.9 对；这是本次人工构造重复密度下的比率，不能外推真实千图数据集的候选数。报告顺序与实验排序的 top-25/50/100 均为 100% 来源关联精确率，**本批没有显示排序收益**，不支持窗口打分已验证有效的结论。

这些是元数据选择的不同文件来源和受控变换；不同来源被标注为负例，但没有进行真人语义关系裁定。没有测自然污染、真实业务中的误报率或真人复核耗时。新照片经本次评测后应作为已知回归集，下一次调参需要另设新保留集。未开启旧的低召回 crop-v2 过滤，也未宣称解决随机裁切或降低局部检索复杂度。

## 规模与预算

| 5,000 图模式 | 确定性已处理 | 全图已处理 | 局部已处理 | 总体完整 |
| --- | ---: | ---: | ---: | --- |
| 默认 | 5,000 | 5,000 | 关闭 | 是 |
| 镜像 | 5,000 | 5,000 | 关闭 | 是 |
| 旋转加镜像 | 5,000 | 2,390 | 关闭 | 否 |
| 裁切 | 5,000 | 5,000 | 964 | 否 |

各阶段遵守自身预算，合计 comparisons 可大于单个 `maxComparisons`。5k 裁切进程峰值 RSS 约 538 MiB；这些是本机合成数据测量，不是自然照片容量保证或内存上限证明。

## 复现与打开

```sh
npm run build
npm run verify:ci
research/.venv-oracle/bin/python tools/evaluate-post-review.py --out output/new-source-replay
research/.venv-oracle/bin/python reports/post-review/scale-driver.py --out output/scale-replay
node tools/demo-walkthrough.mjs output/new-walkthrough
node tools/server.mjs --report output/new-walkthrough/audit/report.json --port 4173
```

评测/测量/演示输出目录必须不存在。源照片已按摘要保存，无须再联网下载；`prepare-photos-v3.py` 与限流驱动保留来源获取过程。自动评测会拒绝冻结实现或来源摘要发生变化后继续沿用同一冻结结果。

[可直接打开的离线演示](demo-evidence.html) 已保存在本目录。

本次实际演示位于仓库 `output/walkthrough-v070/`，离线文件为 `evidence.html`；该输出目录由 gitignore 排除。核心生产审计只导出建议，不修改数据集。
