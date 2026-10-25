# 第 3 阶段执行记录

日期：2026-10-25。执行与复核：Codex，自查，不是独立 Claude 评审。第 2 阶段自查见 review-2.md，原历史记录保留。

## 完成项

- 默认关闭的 --include-crops：MoonBit 灰度积分图、20 个固定窗口、单独的汉明 BK-tree，共享既有比较与配对预算；证据为 local-candidate，不进入确定性 groups。
- 覆盖中心、四角偏移和不同宽高比。matchLocal 记录首个阈值内窗口见证；界面与全图候选分别计数、筛选和解释，复核后 CSV 仍标作候选。
- 新增 32 个明确 CC0 的 Commons 文件来源，16 开发、16 新保留；来源及场景不交叉，照片最长边 384，合计约 1.4 MiB。每张记录作者、许可页面、下载及缩小后 SHA-256。旧 photos-v1 保留组转为本版本回归集。
- 两组各 112 张受控变换图、672 对同地标不同文件来源困难负例。实现及参数先冻结，再下载和评测新保留组；没有根据保留结果调参。
- 1,000/5,000 图 default、mirrors、orientations、crops 实测及默认 64MP 解码边界实测，数据均在临时目录生成。
- README 首屏包含定位、实际工作台截图、CI 退出 3 演示和三行命令；版本历史移至 CHANGELOG.md。D4 已确认，当前未跟踪 release ZIP，保留本地文件和历史。

## 新评测结果

| 分区与方法 | TP | FP | FN |
|---|---:|---:|---:|
| 开发：新增局部候选 | 113 | 1 | 63 |
| 开发：合并候选 | 145 | 1 | 31 |
| 开发：ImageHash crop 基线 | 118 | 16 | 58 |
| 新保留：新增局部候选 | 117 | 44 | 59 |
| 新保留：合并候选 | 149 | 54 | 27 |
| 新保留：ImageHash crop 基线 | 101 | 35 | 75 |

两个分区的局部索引均与独立穷举逐对一致，原有精确分组不变。产品指标每次均与独立 Python 集合实现逐字段比较。局部候选 TP/FP/FN 针对完整 near-only 真值范围；合并候选还包括原有全图结果。

原始报告、逐对误报漏报、真值、工作计数和时间见 crops-development/ 与 crops-holdout/。来源、许可、冻结时序见 research/photos-v2/。冻结摘要见 phase3-acceptance.json。

## 规模和内存

| 图数/模式 | 墙钟秒 | 峰值 RSS MiB | 完整 | 比较次数 |
|---|---:|---:|---|---:|
| 1000 default | 1.004 | 194.47 | 是 | 190941 |
| 1000 mirrors | 1.106 | 180.94 | 是 | 681355 |
| 1000 orientations | 1.225 | 194.70 | 否 | 1000000 |
| 1000 crops | 1.191 | 227.84 | 否 | 1000000 |
| 5000 default | 4.628 | 261.59 | 否 | 1000000 |
| 5000 mirrors | 4.801 | 311.67 | 否 | 1000000 |
| 5000 orientations | 5.254 | 366.06 | 否 | 1000000 |
| 5000 crops | 5.317 | 476.64 | 否 | 1000000 |

未上调 maxImages 硬上限，测试显式传入 1000/5000。64MP 单图在默认解码上限完成，2.869 秒、391.47 MiB；这测量像素数边界，不证明所有编码/内容的最坏 RSS。原始 /usr/bin/time -l 日志和 JSON 在 scale-phase3-final/。前两次测试分别被沙箱 sysctl 限制、日志相对路径错误中止；原始失败日志保留，成功结果不混入失败样本。

## 浏览器与限制

真实浏览器验证局部计数/筛选、窗口说明、标记撤销、备注刷新恢复、桌面与手机无横向溢出。原始 350,710 字节 HTML 在单页断网后重新渲染：3 对证据（2 对局部）、6 张嵌入 JPEG、当前 QA 复核、零外部脚本均通过。截图与 sourceHashes 见 phase3-browser.json；截图均已实际查看。QA 标记仅针对受控样例。

32 个文件来源并非 32 个独立拍摄群体；作者和场景重复，捕获来源的独立性只依据链接文件页。部分受控裁切与窗口对齐，不能推断任意裁切表现或自然污染率。新保留组局部误报 44 对（其中 14 对来自同场景困难负例），因此模式保持默认关闭，不能把局部候选当作确定性重复。

## 验证与提交边界

早期冻结前完整 CI 24 项通过：三后端及 native release 各 80 项、Node 46 项、独立指标 8 项、八个旧模式检测结果不变。新增 cached corpus 重放和来源/冻结测试后，阶段结束前另跑 25 项最终 CI；其结果、提交清单和语言统计在下方追加。Mooncakes 包内容门槛继续为小于 1,000,000 字节；本阶段未正式发布包或推送新代码。

## Final acceptance and commits

Final CI: **25/25 passed**, MoonBit **80** per backend including native release, Node **46**, independent metric **8**, crop source/freeze and replay **2**. Actual compiled artifact matches the committed build. Evidence: phase3-final-ci.json and logs/phase3-final-ci.log.

- `c3dee59e90247d97f026fe1b6dfcdc8cde6cc47d` — feat(visionleak): add bounded local crop candidates in MoonBit
- `7dc1da1e6ed5f32c7f750f23990ffe7943fda10d` — test(visionleak): freeze licensed crop evaluation and resource evidence

This report and documentation form the following report commit. QA CSV fields are unchanged; the checked-in sample uses LF line endings, while the product serializer and its tests retain CRLF.

| Language | Bytes |
|---|---:|
| MoonBit | 176625 |
| JavaScript | 157990 |
| HTML | 11882 |
| CSS | 23299 |
| Python | 132356 |
| Shell | 778 |

MoonBit is largest. All handwritten source, tests and independent oracles count; only actual compiled outputs are generated. Generated HTML is retained locally and ignored, matching the earlier phase-2 artifact policy.

Final phase-3 source digest: `f9c50a6f00a898ff84e249e87f06dbd5959a1c79a0ae428a0d105d8ad68d10bf`. Core package: **32,775 bytes**, whitelist contract passed. No new push, tag, GitHub Release or registry publication was performed.
