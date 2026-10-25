# VisionLeak

以 MoonBit 为核心的本地图像跨集合重复审计工具。输入 `train/`、`validation/`、`test/` 中的真实图片文件，输出成对证据、确定重复分组、带缩略图的本地复核工作台和可导出的人工复核记录。

**感知相似只是候选，不能自动证明数据泄漏。** 工具不删除或移动源文件，不调用云 API。合成评测中主动保留平色图、渐变误报及裁切/镜像漏检，详见 [评测结果](reports/evaluation.md)。

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

这是本地候选项目。公开仓库、公开连续开发记录、包发布、身份声明和正式参赛提交均未执行；正式赛事规则与日期冲突由总控目录 `research/contest-rules.md` 管理。
