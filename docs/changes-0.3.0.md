# 0.3.0：可选水平镜像候选检索

本轮针对 0.2.0 已知的镜像漏检补充 MoonBit 核心能力。默认审计模式保持原来的方向敏感行为；使用 `--include-mirrors` 显式开启。

```sh
node tools/cli.mjs audit --root fixtures/benchmark --out output/mirrors --include-mirrors
node tools/server.mjs --report output/mirrors/report.json --port 4173
```

## 算法和证据

`fingerprint_mirrored_rgba` 在原图完整像素坐标上水平反射后做相同的 9×8 分箱。不能简单反转或取反原 dHash：相邻相等亮度及宽度不整除 9 时，这些替代方法都不满足采样合同。默认 `fingerprint_rgba` 输出不变，新入口多返回 `dhashMirror`，原像素摘要不变。

开启时每张图的原方向、镜像指纹分别进入普通汉明距离 BK-tree，查询两种方向；对命中图像对计算四种组合距离的最小值。不能把这四种距离的最小值直接作为 BK-tree 距离，因为它未被证明满足所需度量条件。实际比较、查询、插入共享原工作预算；额外四次距离计算也计费。成对证据去重，内存中最多两个索引节点/图像；高阈值/重复数据仍可能退化并返回 incomplete。

确切字节/像素身份始终优先，只有感知候选携带非原方向的 `matchTransform`：mirror-left、mirror-right 或 mirror-both，分别指报告 left、right 图像的水平反射。距离相等时按 original、mirror-left、mirror-right、mirror-both 顺序确定解释。镜像候选不并入精确连通组。界面显示匹配方向，缩略图保持原方向；用户可结合源图判断，不能把候选当作确认泄漏。

## 当前受控评测

同一组 59 张确定性 PNG/JPEG，固定阈值 6，排除全部精确正例：

| 模式 | TP | FP | FN | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| 默认 | 67 | 2 | 18 | 97.10% | 78.82% |
| 水平镜像候选 | 76 | 4 | 9 | 95.00% | 89.41% |

新增 11 对中 9 对为已知同源关系，2 对是平色与反向渐变的碰撞。裁切相关 9 对仍漏检；本模式不承诺解决裁切、旋转或主体级语义泄漏。扩大搜索提高召回也增加误报，因此默认关闭。这不是自然照片集的泛化效果或自然发生的污染发现。

`reports/mirror-evaluation.json` 保留两种模式、所有新增对和真值、独立 ImageHash 镜像像素对照、穷举成对方向对照及工作量；`reports/mirror-evaluation-audit.json` 是原始 CLI 结果。实际带图报告在 `reports/mirror-demo/report.json`。原默认评测继续独立保存在 `reports/evaluation.*`。

## 验证与下一步

新增回归覆盖小图、非整除宽度、透明像素、任意不对称指纹、精确优先、去重、预算中断、真实 CLI 图片与界面方向字段。MoonBit 三后端及 native release 均执行镜像测试；CI 与 ZIP 解包验收也检查镜像模式。

继续完善的重点是补充来源与许可证可核查的自然照片评测，并在新样本上检查镜像误报和资源消耗。当前合成指标不能替代这一步。0.1.0 与 0.2.0 ZIP 均保留，本轮没有修改独立发布仓库或操作共享 Git。
