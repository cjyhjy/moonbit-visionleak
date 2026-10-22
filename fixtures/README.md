# 图像基准与真值

`benchmark/` 中的 PNG/JPEG 都由 `tools/generate-fixtures.py` 实际编码生成，**没有真实用户照片，没有真实训练集污染发现**。图像不是空扩展名文件或只含指纹的伪数据。

固定种子 `20261022`。8 个独立程序场景分别产生原图、改名的字节副本、不同 PNG 压缩/元数据编码、JPEG quality 72、126×112 缩放和亮度 +18 变体。前 2 个场景额外产生裁切和水平镜像挑战。另有两个独立同方向渐变、两个独立纯色负例、一个 alpha 白底规范化等价对，以及一个只在 train 内的副本。

最终 59 图，共 1,940,489 字节。1086 个跨 split 无序对全部标注：9 个字节等价、18 个仅规范化像素等价、85 个共同来源但像素不同、974 个独立来源负例。相同 split 对不进入评价。源 ID 来自生成过程，绝不由检测结果反推。

`benchmark/ground-truth.json` 保存逐图 SHA-256、来源 ID、变换、编码大小及全部成对关系。精确指标使用字节/像素等价真值；近似指标排除全部精确真值对，不能用精确副本提高近似召回。常规变换和裁切/镜像挑战还分别列出。

独立来源的纯色/渐变图有意制造 dHash 碰撞：它们在本项目的“共同来源”任务中是负例。相似性不是来源证明。不同任务若把“视觉相似”本身作为正例，应重新制定标签。

## 重现

```sh
python3.13 -m venv research/.venv-oracle
research/.venv-oracle/bin/python -m pip install -r requirements-oracle.txt
research/.venv-oracle/bin/python tools/generate-fixtures.py --out fixtures/reproduced
```

生成器要求输出目录不存在，拒绝覆盖已有内容。在本次锁定 Pillow 11.3.0 的 macOS ARM64 环境中，两个全新目录独立生成的所有文件逐字节相同。平台或图像编码库构建不同可能改变文件编码字节；本包随附固定文件和摘要，以包内文件作为本次成绩的依据。

生成图像由本项目以 CC0-1.0 释出；生成器源码沿用项目源码许可证。参见 [LICENSE.txt](LICENSE.txt)。Pillow、ImageHash 及依赖的许可证不因此改变。
