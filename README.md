# VisionLeak

[![CI](https://github.com/cjyhjy/moonbit-visionleak/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/cjyhjy/moonbit-visionleak/actions/workflows/ci.yml)

以 MoonBit 为核心的本地图像跨集合重复审计工具。输入 `train/`、`validation/`、`test/` 中的真实图片文件，输出成对证据、确定重复分组、带缩略图的本地复核工作台和可导出的人工复核记录。

**感知相似只是候选，不能自动证明数据泄漏。** 工具不删除或移动源文件，不调用云 API。合成评测中主动保留平色图、渐变误报及裁切/镜像漏检，详见 [评测结果](reports/evaluation.md)。

## 0.4.0 真实照片与直角旋转

新增 10 张来源/许可证明确的真实照片及 100 张受控变换评测。保留来源组的近似召回：默认 36.15%、镜像 70.00%、镜像加旋转 89.23%；当前无跨来源误报，裁切仍漏检。新增默认关闭的 `--include-rotations`，额外开销和来源范围完整保留。[本轮改进](docs/changes-0.4.0.md) · [照片评测](reports/photos-v1/summary.md) · [许可清单](research/photos-v1/ATTRIBUTION.md)。

## 0.3.0 镜像候选

新增 `--include-mirrors`，由 MoonBit 检索原图及水平镜像指纹，报告和工作台明确显示匹配方向。现有合成评测近似召回 78.82%→89.41%，误报 2→4；因此默认关闭，候选仍需人工复核。[算法、权衡和完整结果](docs/changes-0.3.0.md)。

## 0.2.0 改进

保持检测阈值与结果语义，优化核心距离计算；复核界面新增待复核连续导航、单步撤销、未复核/暂不确定计数和键盘操作。报告导入及本地服务现在核对内容摘要，拒绝内容变化后沿用旧 auditId。修复符号链接输出路径可能提前创建源目录的问题，并同步固定版本 CI 与工具链引导脚本。详见 [本轮变更](docs/changes-0.2.0.md)。

## 快速使用

需要 Node.js 22 或更新版本。本次实测版本见 [DELIVERY.md](DELIVERY.md)。ZIP 内含从 MoonBit 源码编译的 `dist/visionleak.js`，运行 CLI 无需安装 MoonBit。

```sh
npm ci
node tools/cli.mjs audit --root fixtures/benchmark --out output/example
node tools/server.mjs --report output/example/report.json --port 4173
```

浏览器打开 `http://127.0.0.1:4173`。实际示例目录以 [fixtures 说明](fixtures/README.md) 为准；完整 CLI 参数见 [使用手册](docs/cli.md)。输出已有内容时默认拒绝覆盖；重复运行可使用新的目录。

自己的数据按以下目录放置；允许缺少某个 split，报告会记录覆盖范围。

```text
dataset/
  train/猫/001.png
  validation/猫/002.jpg
  test/003.png
```

## 证据的含义

| 等级 | 判断依据 | 能支持的结论 |
|---|---|---|
| 字节相同 | 源文件 SHA-256 相同 | 同一编码内容出现在多个 split；文件名可以不同 |
| 像素相同 | 尺寸及规范化 RGB 的 SHA-256 相同 | 解码后白底显示内容相同；编码或透明隐藏颜色可以不同 |
| 感知候选 | 64 位 dHash 汉明距离不超过阈值 | 需要人工查看；可以误报，也会漏掉裁切、镜像等变换 |

摘要相同具有 SHA-256 的通常碰撞假设。像素规范化包含 EXIF 方向、sRGB 和白底透明合成，**不是原始像素逐位无损相等**。预算耗尽或图片读取失败时 `complete=false`；没有发现不能说明数据集不存在泄漏。

## 实现与验证

MoonBit 实现 RGB 规范化、SHA-256、灰度与 dHash、距离、精确分桶、BK-tree 查询、跨 split 筛选、证据分级、确定重复连通分组、预算和核心报告。Node.js + sharp 负责解码、文件 I/O、预览图与本地 HTTP。浏览器负责展示和复核记录，不另算指纹，因而没有浏览器 Canvas 解码漂移。

```sh
npm run build                  # 需要 MoonBit：项目 .toolchain 或 PATH 中的 moon
./tools/moon test --target js
./tools/moon test --target wasm-gc
./tools/moon test --target native
npm test
node tools/benchmark.mjs
```

外部 ImageHash 对照与 Python 评测环境见 [复现说明](docs/reproducibility.md)。外部 oracle、性能、浏览器验收和干净目录验收分开记录；[verification.json](reports/verification.json) 是交付时的机器可读检查结果。

## 阅读入口

- [核心 API 与规范化合同](docs/api.md)
- [设计、预算与局限](docs/architecture.md)
- [复核界面教程](docs/demo.md)
- [邻近项目与三个差异用例](research/comparison.md)
- [AI 辅助与来源说明](docs/development.md)
- [许可证和第三方组件](THIRD_PARTY.md)

公开仓库：[cjyhjy/moonbit-visionleak](https://github.com/cjyhjy/moonbit-visionleak)。2026-10-25 分批同步了 0.2–0.4 累积改动及 0.5.0 计划第 0–2 阶段，版本号仍为 0.4.0；0.5.0 尚未冻结。提交映射和验证记录见 [本次同步记录](reports/plan-0.5.0/git-sync-2026-10-25.json)，历次源码与 CI 的对应关系见 [历史说明](docs/history.md)。Mooncakes 核心包尚未正式发布；Node CLI 和工作台目前通过克隆仓库运行。
