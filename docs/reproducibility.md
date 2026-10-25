# 复现图像基准与外部对照

所有命令从解包后的 VisionLeak 项目根目录执行。先检查目标目录；生成器和审计 CLI 默认拒绝覆盖已有目录。下面只会安装项目内依赖、写本项目报告，不调用模型或付费 API。

## 运行随包图像

要求 Node.js 22 或更高版本。首次安装需要读取 npm registry，随后图像审计离线执行。`package-lock.json` 固定 Node 依赖，随包 `dist/visionleak.js` 是 MoonBit 构建产物。

```sh
npm ci --cache .cache/npm
node tools/cli.mjs audit --root fixtures/benchmark --out reports/my-audit --threshold 6
npm test
```

完整审计返回 0（发现副本也返回 0）；预算/部分输入导致不完整报告返回 2；参数、路径或无法生成报告等失败返回 1。查看 `report.json` 的 `complete`、`errors`、`stats` 和 `options`。不能仅凭退出流程结束或零条候选断言无泄漏。相同来源的裁切/镜像可能没有候选。

## 重建 MoonBit 核心

本次使用 `moon 0.1.20261012 (748b63c)`、`moonc v0.10.15+943464bfa`。`tools/moon` 使用项目局部工具链或已安装的 MoonBit；便携包不包含完整编译器。对源码复验应先准备相容的 MoonBit 工具链，再执行：

```sh
npm run build
./tools/moon test --target js
npm test
```

构建后再执行下面的 ImageHash 对照，避免用旧的 `dist/visionleak.js` 代替当前源码。评测 JSON 保存实际执行的核心、CLI、解码器、生成器和评测脚本 SHA-256；重新构建的字节是否完全一致取决于编译器版本，不能只看项目版本号。

## 局部 Python oracle

要求 Python 3.13。ImageHash 仅用于独立验证和基准生成，应用正常运行不依赖 Python。

```sh
python3.13 -m venv research/.venv-oracle
research/.venv-oracle/bin/python -m pip install --disable-pip-version-check --no-cache-dir -r requirements-oracle.txt
research/.venv-oracle/bin/python tests/oracle-metrics.py
research/.venv-oracle/bin/python tools/evaluate.py
```

固定全部 Python 包版本：ImageHash 4.3.2、Pillow 11.3.0、NumPy 2.3.3、SciPy 1.16.2、PyWavelets 1.9.0。具体实测平台/Python/Node 版本见 `reports/evaluation.json` 的 `environment`。Python venv、编译器和本地缓存均不应进入发布 ZIP。

`evaluate.py` 完成下列实际工作：

1. 校验随包图像的 SHA-256，确认输入没有改变。
2. 在新临时目录运行真正的 `node tools/cli.mjs audit`，读取完整报告。
3. 以已知生成来源与像素/字节真值计算精确、近似、常规变换和挑战变换的成对混淆矩阵。所有精确真值对从近似分母移除。
4. 运行 11 个包含小尺寸和 alpha 的 RGBA 向量，以及 59 个实际解码图像的 ImageHash canonical-grid 对照。
5. 用独立 Python 穷举参考验证 MoonBit 索引没有漏掉满足当前证据/阈值条件的跨 split 配对。
6. 运行阈值 0/2/4/6/8/10/16 的离线指纹灵敏度扫描；这不是候选索引性能基准。

输出文件：

| 文件 | 内容 |
| --- | --- |
| `reports/evaluation.json` | 环境、命令、版本、摘要、指标、逐对 FP/FN、阈值扫描与索引对照 |
| `reports/evaluation.md` | 中文可读报告及边界 |
| `reports/evaluation-audit.json` | 本次实际 CLI 原始 JSON；临时缩略图不在这个独立文件旁保留 |
| `reports/evaluation-oracle.json` | 每个 oracle 向量和实际图片的一致性检查 |

需要带缩略图的可交互报告时，使用第一节命令另外生成 `reports/my-audit/`。评测会覆盖自己的 `evaluation*` 输出；保留历史运行时可指定新的 `--out reports/evaluation-second.json`。

## 验证生成确定性

```sh
research/.venv-oracle/bin/python tools/generate-fixtures.py --out fixtures/reproduced-a
research/.venv-oracle/bin/python tools/generate-fixtures.py --out fixtures/reproduced-b
diff -qr fixtures/reproduced-a fixtures/reproduced-b
research/.venv-oracle/bin/python tools/evaluate.py --root fixtures/reproduced-a --out reports/evaluation-reproduced.json
```

固定 seed 和编码器的同机两次独立生成已逐字节相同。跨平台图像库构建可能影响 PNG/JPEG 文件字节，所以随包真值保留实际编码文件摘要，不能把跨系统 byte-identical 复现当作无条件保证。生成数据说明与 CC0 图像许可证见 `fixtures/README.md` 和 `fixtures/LICENSE.txt`。

## 两种 ImageHash 对照的含义

合同一致性检查先按规范计算白底 RGB、整数灰度和 9×8 整数分区平均，然后把这个已经是 9×8 的 `L` 图交给真实 ImageHash `dhash(hash_size=8)`。这样比较的是位方向、顺序和前处理合同，避免把两种 resize 算法差别误报为 dHash 实现错误。SHA-256 使用 Python `hashlib` 独立核对 `VL1 + uint32be(width,height) + RGB`。

端到端基线另把 Pillow 解码的原图交给默认 ImageHash（LANCZOS resize）。这一列不应与 VisionLeak 默认逐位相同，也不能当作真实图片来源标签。Node 与 Pillow 的规范化像素是否一致按图片记录；本基准中一致，不等于所有 ICC/EXIF/HDR/多帧格式都一致。

## 未测试或不能由成绩推出的内容

没有使用自然照片、私有训练集或公开真实泄漏集；所有真值是合成来源。没有运行 FiftyOne/MoonSplit 的工具性能对比，没有测分布外语义相似、对抗图像、所有裁切/旋转、ICC/高位深格式的完整召回，也没有做百万图规模测试。本项目不能证明数据集完全无泄漏，不能把 `perceptual-candidate` 当作确定副本。查重规则与参赛资格由组织者判断，来源调查不替代该判断。
