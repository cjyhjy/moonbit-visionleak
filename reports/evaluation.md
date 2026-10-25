# VisionLeak 可复现评测

所有测试图片均由确定性脚本生成，不是真实数据集泄漏发现。

本次输入 59 张 PNG/JPEG，1,940,489 字节；跨 split 成对空间 1086 对。
主审计阈值 6，complete=True，CLI 墙钟 0.232 秒（含 Node 启动、解码、MoonBit 计算与报告写入；单次本机测量）。

| 任务 | TP | FP | FN | Precision | Recall | 假阳性率 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 精确证据 | 27 | 0 | 0 | 100.00% | 100.00% | 0.00% |
| 同源近似（排除精确对） | 67 | 2 | 18 | 97.10% | 78.82% | 0.21% |
| 其中：常规变换 | 67 | 2 | 0 | 97.10% | 100.00% | 0.23% |
| 其中：裁切/镜像挑战 | 0 | 0 | 18 | 未定义（无预测/正例） | 0.00% | 0.00% |

精确真值由文件字节或规范化像素等价定义；近似真值由共同生成来源定义，且所有精确真值对从近似评价分母移除。不同生成来源即使 dHash 相同仍是负例。

外部 oracle：11/11 个 RGBA 边界/随机向量，59/59 个实际解码图像通过 ImageHash canonical-grid 比较。
ImageHash 在相同 9×8 灰度网格上独立计算 dHash。VisionLeak 的整数分区平均与 ImageHash 默认 LANCZOS 缩放不同，因此另列默认 ImageHash 基线，不声称二者端到端 bit 相同。

候选索引与独立穷举参考一致：True，参考 96 对、实际 96 对；这只证明该有限样本下未漏掉满足算法条件的配对，不证明所有同源变换可识别。

## 阈值扫描（仅同源近似，所有精确真值已排除）

| 阈值 | VisionLeak 指纹全对参考 TP/FP/FN | 默认 ImageHash TP/FP/FN |
| ---: | --- | --- |
| 0 | 58/2/27 | 63/2/22 |
| 2 | 67/2/18 | 67/2/18 |
| 4 | 67/2/18 | 67/2/18 |
| 6 | 67/2/18 | 67/2/18 |
| 8 | 67/2/18 | 67/2/18 |
| 10 | 67/2/18 | 67/2/18 |
| 16 | 67/2/18 | 67/2/18 |

阈值扫描使用已计算指纹进行穷举，是离线灵敏度分析，不是运行候选索引的性能测试。主结果来自真正 CLI。参考列直接按 Hamming 距离比较，不施加额外候选过滤。未根据这套测试集声称通用最优阈值。

## 误报与漏报

完整路径对保存在 evaluation.json 的 falsePositives/falseNegatives 字段。

近似误报：2 对。
- `test/flat-blue.png` ↔ `train/flat-red.png`
- `test/lookalike-ramp-1.png` ↔ `train/lookalike-ramp-0.png`

近似漏报：18 对。
- `test/brighter-00.png` ↔ `validation/mirrored-00.png`
- `test/brighter-01.png` ↔ `validation/mirrored-01.png`
- `test/cropped-00.png` ↔ `train/local-copy.png`
- `test/cropped-00.png` ↔ `train/scene-00.png`
- `test/cropped-00.png` ↔ `validation/mirrored-00.png`
- `test/cropped-00.png` ↔ `validation/repacked-00.png`
- `test/cropped-00.png` ↔ `validation/resized-00.png`
- `test/cropped-01.png` ↔ `train/scene-01.png`
- `test/cropped-01.png` ↔ `validation/mirrored-01.png`
- `test/cropped-01.png` ↔ `validation/repacked-01.png`
- `test/cropped-01.png` ↔ `validation/resized-01.png`
- `test/quality72-00.jpg` ↔ `validation/mirrored-00.png`
- 其余见 JSON 原始结果。

## 边界

本基准只有程序合成纹理/形状和受控变换，没有自然照片或公开真实污染集。少量裁切/镜像图仅作为失败挑战，不构成旋转、复杂编辑的完整覆盖。dHash 既会碰撞也会漏检，候选不是同源证明；高 precision 也不能证明数据集无泄漏。JPEG 不同解码器的像素差异按图记录，不能把跨解码器相同像素当作通用保证。

没有运行 FiftyOne/MoonSplit 性能对比，不能据此声称更快、更准确或功能更完整。环境版本、命令、SHA-256 和原始 CLI 报告随 JSON 保存。
