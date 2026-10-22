# VisionLeak 历史本地交付记录

此文为 **2026-10-22 首次公开前** 的 macOS 本地交付快照，保留当时的命令、结果与发布状态。对应提取历史末端 `d7cc72e`；后续公开仓库与当前 CI 入口见 [README](README.md)。以下报告、旧 ZIP 校验值及未测试平台描述仅属于该历史范围，不是当前源码的重新验收。

## 使用命令

从项目目录（或解包后的 `visionleak/`）执行：

```sh
npm ci
node tools/cli.mjs audit --root fixtures/benchmark --out output/example
node tools/server.mjs --report output/example/report.json --port 4173
```

打开 `http://127.0.0.1:4173`，按证据等级筛选、比较两图、填写人工标记/备注并导出复核 JSON。已有报告可直接查看：

```sh
node tools/server.mjs --report reports/demo/report.json --port 4173
```

CLI 退出 0 表示声明范围内完成；2 表示报告不完整；1 表示无法完成操作的错误。发现重复本身不改变退出码。源图片不会被删除或移动。

## 已实现

MoonBit 实现白底 RGB 规范化、含尺寸的 SHA-256、整数 dHash、汉明距离、独立精确分桶、BK-tree、跨 split 成对证据、确定重复分组和工作/输出预算。CLI 接收真实栅格文件，处理 EXIF/sRGB、坏图、符号链接、空数据、大图和输入预算，输出可移植报告与缩略图。本地页面支持证据筛选、人工复核、导入/导出和审计身份绑定。

`core/` 是核心源码，`dist/visionleak.js` 为实际 MoonBit 编译产物。构建需要 moon 0.1.20261012 / moonc v0.10.15+943464bfa；CLI运行仅需 Node 与锁定 sharp。实测 Node v26.7.0，macOS arm64，Apple M5 Pro，sharp 0.35.5 / libvips 8.18.7。其他平台没有本次运行验收。

## 测试与实际效果

- MoonBit：JS、wasm-gc、native 每目标 8/8。
- 核心独立对照：180 组有不同阈值/碰撞/精确类的 BK-tree 与平方级参考一致；200 组规范化像素摘要与 Node SHA-256 一致。
- 真图与 ImageHash：59 张确定性合成 PNG/JPEG，输入 1,940,489 字节；11 个 RGBA 边界/随机向量与 59 张实际图像 oracle 通过，96 对索引输出与独立全对参考一致。
- 精确证据 TP27 / FP0 / FN0。排除全部精确正例后的近似任务 TP67 / FP2 / FN18，precision 97.10%，recall 78.82%。两个误报为独立平色/渐变；18 个漏检来自裁切/镜像挑战。
- Node CLI/复核/ABI 测试共 25 项；Python 指标回归 4 项。浏览器验收、最终 ZIP 干净目录结果及准确通过数，以 `reports/verification.json`、`demo/qa/` 与 `reports/release-verification.json` 为准。

以上是受控合成变换结果，不是真实公开数据集的泄漏发现。未测自然照片集、真实自然污染、Windows/Linux、FiftyOne/MoonSplit 运行性能。ImageHash canonical-grid oracle 用相同 9×8 灰度输入；默认 LANCZOS ImageHash 的独立基线另列，不宣称两端默认指纹一致。全图重复检测不覆盖主体级语义泄漏。

## 准确验收与打包命令

```sh
node tools/verify.mjs
python3 tools/package.py
python3 tools/accept-release.py
```

完整 verify 需要按 `docs/reproducibility.md` 建立项目局部 Python oracle 环境和 MoonBit 工具链。验收日志逐条写入 `reports/logs/`；状态失败时打包脚本拒绝打包。包内 `PACKAGE-MANIFEST.json` 列出每个文件的摘要和大小。

交付 ZIP：`release/visionleak-0.1.0.zip`。校验文件：`release/SHA256SUMS`。最终包的精确 SHA-256、全新目录解包、`npm ci`、重新编译一致性、全部 Node 测试和 59 图 CLI 比对写入包外 `reports/release-verification.json`。它在 ZIP 之外，避免“文件包含自身最终校验和”的循环。

ZIP 包含源码、构建产物、依赖锁、合成图像、评测原始结果、示例报告/缩略图、文档、许可和浏览器证据；不包含工具链、node_modules、Python venv、缓存、Git、凭证或用户配置。安装运行依赖需要 npm registry 连接或可用缓存，不是自带全部平台二进制的离线安装包。

## 入口与交付边界

- `README.md`、`docs/cli.md`：使用教程。
- `docs/api.md`、`docs/architecture.md`：规范化、API、预算和限制。
- `research/comparison.md`、`research/sources.json`：固定来源及已有替代品。
- `reports/evaluation.md` / `.json`：指标、误报、漏检、运行版本和原始证据。
- `docs/development.md`、`THIRD_PARTY.md`：AI 辅助过程和来源许可。

公开仓库/公开连续开发记录未建立，包未公开发布，未填身份/原创声明，未正式参赛提交。项目完成度与赛事受理状态分开记录；截止日期冲突和正式规则以总控研究文件为准，不自行断言已符合全部参赛条件。
