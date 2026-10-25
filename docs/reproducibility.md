# 复现图像基准与外部对照

所有命令从 VisionLeak 源码或解包后的项目根目录执行。先检查目标目录；生成器和审计 CLI 默认拒绝覆盖已有目录。下面只会安装项目内依赖、写本项目报告，不调用模型或付费 API。

## 运行随包图像

要求 Node.js 22 或更高版本。首次安装需要读取 npm registry，随后图像审计离线执行。`package-lock.json` 固定 Node 依赖，随包 `dist/visionleak.js` 是 MoonBit 构建产物。

```sh
npm ci --cache .cache/npm
node tools/cli.mjs audit --root fixtures/benchmark --out reports/my-audit --threshold 6
npm test
```

完整审计返回 0（发现副本也返回 0）；预算/部分输入导致不完整报告返回 2；参数、路径或无法生成报告等失败返回 1。查看 `report.json` 的 `complete`、`errors`、`stats` 和 `options`。不能仅凭退出流程结束或零条候选断言无泄漏。相同来源的裁切/镜像可能没有候选。

## 重建 MoonBit 核心

固定 `moon 0.1.20261012 (748b63c)`、`moonc v0.10.15+943464bfa`。`tools/bootstrap.py` 从 MoonBit 官方地址下载 macOS arm64 / Linux x86_64 编译器与标准库，分别核对 `toolchain.lock.json` 中的 SHA-256，再安装到 `.tools/moon`。需要 Python 3.13；不会修改全局工具链或已有 `.toolchain`。`tools/moon` 优先使用 `.tools/moon`，再兼容旧 `.toolchain` / PATH。便携包不包含完整编译器。

```sh
python3.13 tools/bootstrap.py
npm ci
npm run build
./tools/moon test --target js
./tools/moon test --target wasm-gc
./tools/moon test --target native
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

CI 通过 `.node-version` / `.python-version` 固定 Node 22.22.0 / Python 3.13.7，pip 固定 25.2；本地其他补丁版本的运行环境会单独记录。固定全部 Python 包版本：ImageHash 4.3.2、Pillow 11.3.0、NumPy 2.3.3、SciPy 1.16.2、PyWavelets 1.9.0。具体实测平台/Python/Node 版本见 `reports/evaluation.json` 的 `environment`。Python venv、编译器和本地缓存均不应进入发布 ZIP。

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

## 0.1.0 与 0.2.0 核心对照

0.1.0 原始 JS 引擎保存在随包的 `research/baselines/visionleak-0.1.0.mjs`，当前引擎为 `dist/visionleak.js`。在确认当前源码已经重建后运行：

```sh
node tests/core-performance.mjs > reports/core-optimization.json
```

脚本默认读取上述两个产物，也接受两个位置参数指定基线和候选模块。它先对随机指纹、相同哈希和不一致精确摘要三组输入组合阈值与预算，逐字比较 360 份完整 JSON 输出，包含配对顺序、精确组、预算中断前缀、原因和统计。结果相等后，再测量与 `tools/benchmark.mjs` 同种子的 1000 随机指纹和 1000 密集指纹负载。每个引擎预热三次，随后十组配对采样交替运行先后顺序；计时包含 JSON 序列化、核心调用和结果解析。

`reports/core-optimization.json` 记录引擎及输入 SHA-256、环境、全部耗时样本、中位数、倍率和输出统计，`tools/verify.mjs` 也会生成该文件。计时是本机合成负载观察，不设速度通过阈值；不能外推成真实图片解码、端到端审计、百万图或其他工具的普遍加速，也没有测量峰值内存。应按该报告的实际环境和样本解释结果，不能只比较项目版本号或复用旧报告中的倍率。现有报告需要保留时，请将标准输出重定向到新的文件名。

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

## 与 CI 相同的源码验收

在上述 MoonBit、Node 与 Python oracle 依赖就绪后运行：

```sh
npm run verify:ci
```

脚本对三个后端执行 check 和测试，JS / wasm-gc 执行普通 release build；另外核对格式、随包 JS 构建产物一致性，运行全部 Node 集成测试（含真正的 CLI 与 HTTP 服务）、指标回归、59 图 ImageHash 和独立索引 oracle。使用其他 Python 可设置 `VISIONLEAK_ORACLE_PYTHON`。新日志和 JSON 写入忽略的 `.ci-artifacts/`，不覆盖历史 `reports/`。在 GitHub Actions 中该目录作为绑定提交 SHA 的 artifact 上传；本地运行只证明当前本地输入的执行结果，不查询或证明远端运行状态。

固定编译器的 `foreign_library` 不支持 native 共享库链接，不能将 `moon build --target native` 当作本项目可用的共享库交付命令。CI 使用 `moon test --target native --release --build-only` 编译 release 测试可执行文件，再实际运行 release 和 debug 测试。这里验证 native 核心编译与执行，不宣称生成了 native `.so` / `.dylib`。该源码验收不重跑浏览器截图或 ZIP 解包验收，历史材料也不计为新的通过项。

## 版本化打包与解包验收

发布工具共同读取并核对 `package.json`、`package-lock.json` 和 `moon.mod` 的版本，当前版本为 0.2.0。完成当前源码对应的浏览器 QA 和本地验证后再打包：

```sh
node tools/verify.mjs
python3 tools/package.py
python3 tools/accept-release.py
```

打包前核对行为源码摘要、JS 产物、浏览器 QA 与评测证据摘要，归档名按版本生成：当前为 `release/visionleak-0.4.0.zip`。已有 `release/visionleak-0.1.0.zip` 保留，`release/SHA256SUMS` 保留各版本条目。同版本、不同归档内容会被拒绝覆盖，需要使用新版本；同样的版本号不代表任意两份文件内容相同。核心旧引擎基线随源码包进入 `research/baselines/`，无需依赖工作目录里的旧 ZIP 才能运行前后对照。

`accept-release.py` 首先把包外 `reports/release-verification.json` 写为 `running`，再读取当前版本 ZIP 与校验和，核对归档成员和逐文件摘要，在新目录安装依赖、重新编译、运行 Node 测试及真实随包图像审计，并比对报告和源码摘要。ZIP 缺失也会更新为 `failed`，不会继续展示旧的成功状态。成功时自动删除本轮临时解包副本并保留日志；失败时保留已经创建的副本，在报告中记录位置供排错。

验收报告和最终 ZIP 摘要留在包外，避免归档自引用。运行上述命令会更新当前验证报告，保留历史结果时应先复制旧证据。只有当前最终归档的 `status: passed` 才代表该 ZIP 通过本地解包验收；它不替代远端 CI、公开发布或赛事提交状态。

## 未测试或不能由成绩推出的内容

没有使用自然照片、私有训练集或公开真实泄漏集；所有真值是合成来源。没有运行 FiftyOne/MoonSplit 的工具性能对比，没有测分布外语义相似、对抗图像、所有裁切/旋转、ICC/高位深格式的完整召回，也没有做百万图规模测试。本项目不能证明数据集完全无泄漏，不能把 `perceptual-candidate` 当作确定副本。查重规则与参赛资格由组织者判断，来源调查不替代该判断。

## 0.3.0 水平镜像模式

CLI 增加 `--include-mirrors`；JS `fingerprint({width,height,rgba,includeMirrors:true})` 或核心 `fingerprint_mirrored_rgba` 额外返回 `dhashMirror`。核心审计传 `options.includeMirrors:true` 时每个图像必须提供有效 `dhashMirror`。报告中的非原方向 `matchTransform` 对应 left/right 的水平反射，仍属人工复核候选，不能当作像素相等。默认模式不计算额外镜像指纹。详见 [0.3.0 合同与评测](changes-0.3.0.md)。

镜像独立评测命令：`research/.venv-oracle/bin/python tools/evaluate-mirrors.py`，产物 `reports/mirror-evaluation.json`。使用 `npm run verify:ci` 时输出到 `.ci-artifacts/`，不覆盖交付报告。

## 0.4.0 照片评测与直角旋转

新增 `--include-rotations`，可与镜像组合；完整 API、方向顺序、预算语义与开销见 [0.4.0 说明](changes-0.4.0.md)，照片来源与实际误报漏检见 [评测](../reports/photos-v1/summary.md)。
