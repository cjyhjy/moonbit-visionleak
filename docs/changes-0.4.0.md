# 0.4.0：真实照片评测与可选直角旋转检索

本轮先补真实摄影来源样本，再根据开发组暴露的旋转漏检扩展 MoonBit 核心。默认阈值仍为 6，镜像和旋转均默认关闭。历史 0.1.0、0.2.0、0.3.0 ZIP 原样保留。

## 真实照片与证据

[来源与许可](../research/photos-v1/ATTRIBUTION.md)逐项列出 10 张 scikit-image 0.25.2 摄影来源样本的作者、CC0 或公有领域状态。原文件与官方 SHA-256 一致；部分上游样本已做灰度、透视或裁切处理。每个来源生成 10 个受控变换，共 100 张。生成器在新目录复现 102 个文件（含两份真值）逐字一致。

先固定 5 个开发来源、5 个保留来源及变换协议；开发组显示纯镜像与镜像压缩均检出，直角旋转全部漏检。随后冻结多方向检索实现，再检验保留组，没有用保留组调阈值。[原始报告、逐对误报漏检与汇总](../reports/photos-v1/summary.md)。

保留组近似任务（排除全部精确真值对）：

| 模式 | TP | FP | FN | Recall |
|---|---:|---:|---:|---:|
| 默认 | 47 | 0 | 83 | 36.15% |
| 水平镜像 | 91 | 0 | 39 | 70.00% |
| 水平镜像 + 直角旋转 | 116 | 0 | 14 | 89.23% |

旋转原图配对由 0/5 提至 5/5；中心裁切原图配对仍是 2/5，剩余近似漏检全部涉及裁切。两组共 1,160 个跨来源负例，没有产生误报；只含 10 个原始来源，且配对高度相关，不能据此声称真实业务零误报。这是对真实照片施加已知变换的评测，不是自然发生的污染发现。

## 算法与成本

`--include-rotations` 加入 EXIF 校正后的顺时针 90/180/270° 指纹。MoonBit 在完整像素坐标上旋转再采样，保留原始规范化像素摘要。与 `--include-mirrors` 同时启用时，每个旋转方向再作水平镜像，形成最多 8 个视图。单独启用旋转为 4 个视图；镜像仍为 2 个。

每个视图插入普通 64 位汉明距离 BK-tree，不把最小方向距离冒充索引度量。对命中图像对按固定顺序核对全部方向组合，遇到零距离即可证明最小值并停止；索引访问、插入、逐对检查和额外距离计算共享预算。最多 8 个索引节点/输入图像，输出成对去重。精确身份优先，方向候选不并入精确组。预算未完成的图像对不会输出未完成的最小距离。

`matchOrientation` 使用 `leftView/rightView`，值如 `rotate90-mirror/original`：先顺时针旋转，再在旋转后的坐标系水平镜像。组合距离并列时按右视图外循环、左视图内循环取第一个；每边视图顺序为 original、mirror（如启用）、rotate90、rotate90-mirror……。旧镜像模式仍输出 `matchTransform`，pairs/groups/stats 在两组照片上与 0.3.0 完全相同。

保留组核心工作计数由镜像的 2,382 增至 19,396，默认关闭是有意的成本选择；相同预算下可能更早返回 incomplete。像素预算仍约束原始图像数量与尺寸，启用多方向会增加指纹计算时间；工作计数不计解码和像素采样时间。报告同时给出 3 次交替顺序的 CLI 墙钟时间，不宣称普遍性能收益。

## 使用和复现

```sh
npm ci
node tools/cli.mjs audit --root fixtures/photos-v1/holdout --out output/photos --include-mirrors --include-rotations
node tools/server.mjs --report output/photos/report.json --port 4173
```

JS API：`fingerprint({width,height,rgba,includeRotations:true,includeMirrors:true})`。新增 `dhashRotations` 的三项依次为 90/180/270°；同时启用镜像时返回 `dhashMirrorRotations` 和原 `dhashMirror`。核心新导出为 `fingerprint_oriented_rgba(width,height,rgba,mirrors)`；`audit_json` 在 `includeRotations:true` 时严格要求三项有效旋转指纹，镜像同时启用则也要求镜像旋转指纹。不启用时无需这些字段。

工作台显示两张图各自的匹配方向，预览保留原方向；复核存储仍绑定完整报告身份。独立像素/ImageHash 对照、16/64 组合穷举、预算边界、实际旋转文件 CLI、默认兼容及界面字段验证均纳入验收。最终准确通过数以 `reports/verification.json` 和 ZIP 外的 `reports/release-verification.json` 为准。

当前仍不覆盖任意角度旋转、任意裁切、局部主体或语义泄漏；没有自然污染数据集、生产规模、Windows/Linux 本轮实测。远端发布与参赛提交状态另行管理。
