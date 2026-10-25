# 真实照片来源与许可

固定来源：scikit-image 0.25.2。以下是该项目官方逐项许可说明；Public-domain 保留为公有领域声明，不改写成 CC0。原始文件下载后与该版本官方注册表的 SHA-256 核对。精确文件 URL、完整哈希和注册表/许可源文件哈希均在 `sources.json`。

| 样本 | 作者 / 来源 | 许可状态 | 官方许可证据 |
|---|---|---|---|
| astronaut | NASA | Public-domain | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.astronaut) |
| brick | CC0Textures | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.brick) |
| camera | Lav Varshney | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.camera) |
| chelsea | Stefan van der Walt | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.chelsea) |
| clock | Stefan van der Walt | Public-domain | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.clock) |
| coffee | Rachel Michetti | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.coffee) |
| eagle | Dayane Machado | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.eagle) |
| grass | linolafett / DeviantArt | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.grass) |
| gravel | CC0Textures | CC0-1.0 | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.gravel) |
| rocket | SpaceX | Public-domain | [逐项说明](https://scikit-image.org/docs/0.25.x/api/skimage.data.html#skimage.data.rocket) |

CC0 法律文本：[Creative Commons](https://creativecommons.org/publicdomain/zero/1.0/legalcode)。本项目只将照片用于本地算法样本和复核展示，不暗示作者或图中人物背书。

brick、grass、gravel 等已由上游执行透视、裁切、灰度化或缩放；这些输入是实际摄影来源的处理样本，并非未经编辑的相机原片。camera 固定到版权替换后的 0.25.2 版本，不能替换成旧版同名图片。

原文件保持不变。生成器先按最长边 256 像素制备 RGB 基图，再按固定协议生成 100 个受控样本。每个变换的路径、来源、尺寸、文件摘要和独立像素真值在 `fixtures/photos-v1/*/ground-truth.json`。这不是对自然污染率的统计调查。

下载复现：`python3 tools/fetch-photo-sources.py`。离线评测与 ZIP 已含经过哈希校验的原始文件，不需要重新联网下载。
