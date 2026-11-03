# 0.7.0 工程收尾证据

本目录记录 2026-11-03 的工程收尾；任务状态见 [清单](../../docs/followup-2026-11-03.md)。原 `reports/post-review/` 的验收、冻结记录和负面结果均保留。

## 已完成的检查

- `ci/verification.json`：27 项本地检查通过；JS/Wasm-GC/native 各 82 项，native release 另行执行；Node 57 项。固定工具链构建一致，阶段覆盖、退出优先级、CSV、缓存、旧报告身份及独立 oracle 通过。
- 顺序回归：24 组构造索引情形和 12 组已知照片情形逐条比较配对、距离、局部见证和精确分组。历史兼容仅允许稳定地分成确定性/全图/局部三个阶段，拒绝同阶段换序及窗口被替换。
- 覆盖修复：启用但被跳过的阶段完成数为 0；总体完成前缀与预算实际中断阶段分别记录。旧报告没有阶段时保留旧读取语义。
- `frozen-replay/evaluation.json`：使用归档源码及编译产物执行原冻结协议；这是历史复现，不是当前实现或新保留集验收。
- `ci/post-review-regression-*/evaluation.json`：当前实现重跑已知 photos-v3，来源字节、变换标签、完整顺序及窗口见证均匹配。随机裁切原图召回仍为 0/24，没有裁切质量改善声明。
- `browser.json`、三张 JPG：Chrome 桌面及 390px 窄屏检查覆盖提示、空候选、不完整标记、完整队列、实验排序、标记及撤销。其他浏览器/Windows 未测；本地 file:// 离线页面未做视觉验收。
- `walkthrough.json`：生成输入不变，命中关卡退出 3，修正副本重审退出 0，复验和导出通过；复核记录明确为脚本演示。

## 复现

```sh
npm run build
npm run verify:ci
research/.venv-oracle/bin/python tools/frozen_post_review.py --out output/frozen-replay-new
research/.venv-oracle/bin/python tools/evaluate-post-review.py --regression --out output/known-regression-new
node tools/demo-walkthrough.mjs output/walkthrough-new
```

CI 输出位于 `.ci-artifacts/`。此目录保存该次运行的收据、日志及实际评测输出副本。`acceptance.json` 由 `node tools/attest-followup.mjs` 校验当前源码、产物、CI、浏览器和证据摘要后生成。`matchesCommitted` 是历史字段名，仅表示附带编译文件与本次构建一致，不表示 Git 已提交。

## 交付状态

工程本地验收：通过。干净交付包、独立提交、远端 CI、GitHub Release、Mooncakes 状态分别以随后生成的收据为准；这里不以本地通过代替公开发布。

5k/64MP 规模数字仍来自原验收，本次工程收尾没有重测规模。下一步裁切质量与检索效率将使用单独协议和报告，不混入本工程版本的能力声明。

首个本地 ZIP 通过干净目录验收，但远端 Linux 暴露了生成图像编码字节比较过严的问题。该候选未发布，ZIP 与收据已保留；见 `publication/superseded-candidate.json`。最终候选需重新打包并完成干净目录验收，随后发布收据独立保存。

Linux run 41697918606 已通过 27 项检查，源码与产物摘要与本地一致；PR 合并预览 SHA 为 `4336392efc6554bc0d78d0a79ae424e6642c6ff4`，对应 head `81fc777fca8847e44d27c307cb2a16e221c4be83`。84 个生成 PNG 的压缩编码字节不同，但所有解码像素、变换参数、配对身份标签、顺序和窗口见证一致。原始来源文件仍按字节校验。

最终 ZIP 的摘要及干净目录验收见独立的 `publication/local-delivery.json` 和 `clean-copy.json`。ZIP 保存打包时的证据快照；最终发布收据在包外记账，避免自引用。`ci/` 只包含本次检查实际引用的输出，较早输出保留在原报告目录及 Git 历史中。
