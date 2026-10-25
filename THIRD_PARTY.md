# 第三方与许可

VisionLeak 自有源码、测试、合成图像生成脚本和说明采用 [MIT](LICENSE)。没有将相邻 URI Template 项目代码作为本项目成果；仅复用了用户已有的局部编译工具安装。

| 组件 / 来源 | 用途 | 许可 / 固定方法 |
|---|---|---|
| [MoonBit core](https://github.com/moonbitlang/core) | JSON、容器、字符串和运行时支持，被编译进 JS | Apache-2.0；随交付保留 `LICENSES/moonbit-core-Apache-2.0.txt` 与完整 `moonbit-core-NOTICE.txt`；固定工具链版本见 development.md |
| [sharp 0.35.5](https://github.com/lovell/sharp/tree/v0.35.5) | 解码、sRGB/方向变换、显示缩略图 | Apache-2.0；`package-lock.json` 锁定包与 integrity；保存 `LICENSES/sharp-Apache-2.0.txt` |
| libvips 8.18.7 及其 codec 依赖 | sharp 原生解码后端 | 由 npm 平台包提供，包含各自许可；本交付不打包 node_modules 或 native binaries，安装包自身携带许可 |
| [ImageHash](https://github.com/JohannesBuchner/imagehash) | 外部 dHash oracle 与默认算法基线，仅用于研究 | BSD-2-Clause；版本/依赖锁见 `requirements-oracle.txt`，不复制其实现进入核心 |
| Pillow / NumPy / SciPy | 合成 fixture、独立规范化与评测 | 仅研究环境安装；版本锁和许可链接见 `research/sources.json` / 对应包元数据 |
| [NIST FIPS 180-4](https://doi.org/10.6028/NIST.FIPS.180-4) | SHA-256 算法规范 | 本项目按算法独立实现，使用公开 known-answer vectors 和 Node/Python 库进行对照 |

`dist/visionleak.js` 是 MoonBit 构建产物，含标准库代码，因此不能只保留 MIT 许可而丢弃 MoonBit 第三方声明。原始版本说明包含更多标准库组件的许可证文本；完整保留并不意味着所有列出的函数都被本项目链接。

研究中列出的 MoonSplit、FiftyOne、ImageHash 是已存在的替代方案。引用不代表作者背书；未运行的实现不会被记为实测结果。

0.4.0 新增 10 张来源明确的第三方照片，含人物、动物、物品、纹理和航天场景。原始文件保存在 `research/photos-v1/originals/`，每张的作者、CC0 或公有领域声明、官方许可证据链接和官方 SHA-256 见 [来源清单](research/photos-v1/sources.json) 与 [归属说明](research/photos-v1/ATTRIBUTION.md)。`fixtures/photos-v1/` 是这些照片的受控变换，继承各自来源的许可状态，不受项目对合成图像的 CC0 声明覆盖。本次未使用私人数据或自然发生的数据泄漏真值；公共照片及其作者没有为本项目背书。
