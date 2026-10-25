# VisionLeak CLI 与本地演示

需要 Node.js 22 或更高版本。依赖仅安装到本项目，`sharp` 固定为 **0.35.5**，其传递依赖与平台二进制由 `package-lock.json` 固定；不要求全局 npm 包。解码器及实际 libvips 版本写入每份报告。源码构建另需项目规定版本的 MoonBit 工具链。

```sh
npm ci --ignore-scripts
npm run build
node tools/cli.mjs audit --root fixtures/benchmark --out reports/my-audit
node tools/server.mjs --report reports/my-audit/report.json --port 4173
```

打开服务输出的 `http://127.0.0.1:4173/`。页面读取真实 CLI 报告，可筛选证据、逐对复核、导入和导出复核 JSON。原始图像始终只读。`Ctrl+C` 关闭服务。端口占用时换一个 `--port`，不会终止其他程序。受限执行环境可能需要允许进程监听本地回环端口。

## 输入范围

```text
dataset/
  train/       # 可递归子目录
  validation/  # 也可用 val/valid/dev
  test/
```

可缺少某个 split；缺失项记录在 `scope.missingSplits`。仅一个 split 也可审计，但不存在跨 split 比较。全部为空会返回 `EMPTY_DATASET`。split 别名为 train/training、validation/val/valid/dev、test/testing；每组只能存在一个目录，同时存在即报 SPLIT_ALIAS_CONFLICT。报告 scope.splitDirectories 保留实际目录到规范 split 的映射。扫描范围仅为这些已知目录，扩展名为 `.png`、`.jpg`、`.jpeg`、`.webp`、`.avif`、`.tif`、`.tiff`、`.gif`，不区分大小写。其他普通文件不参与审计并计入 `ignoredFiles`；因此不支持的格式、根目录中的图片以及根目录中的 ground-truth 清单不属于此次审计范围。

解码后确认实际文件类型，不根据扩展名盲信内容。动画 GIF/WebP、带多个页面的 TIFF/HEIF 等明确报 `MULTIFRAME_IMAGE`，不会静默取第一帧。SVG/PDF 不接受。图像文件及 split 内的符号链接不跟随，报告路径错误。根目录本身先解析为真实目录。

`id` 与 `path` 均为相对数据根目录的 POSIX 路径，如 `train/cats/a.png`。输入记录按路径的 JavaScript 字符串顺序排序，避免依赖区域设置；目录预算截断时只承诺已观察到的范围。便携报告不写原始根目录的绝对路径。

## 预算、完整性与退出码

| 参数 | 默认值 | 允许范围 |
| --- | ---: | ---: |
| `--threshold` | 6 | 0–64 |
| `--max-images` | 1000 | 1–10000 |
| `--max-pixels`（感知取样） | 4194304 | 1–4194304 |
| `--max-decode-pixels`（完整源图） | 64000000 | 1–100000000 |
| `--max-total-pixels` | 100000000 | 1–1000000000 |
| `--max-file-bytes` | 33554432 | 1–1073741824 |
| `--max-comparisons` | 1000000 | 0–10000000 |
| `--max-pairs` | 10000 | 0–100000 |

另有固定目录预算：最多观察 100000 个目录项、最多递归 64 层。宽、高各不超过 65535。完整源图受 --max-decode-pixels 限制，默认 64MP、硬上限 100MP；感知取样受 --max-pixels 限制，硬上限仍为 4194304。按文件逐个解码，读取前检查编码字节数；读取过程固定上限并检查文件是否变化。总像素预算在下一张图片解码前限制其可用像素数，按完整源图计费。超过感知取样上限时，完整 RGBA 由 MoonBit 分块规范化并计算像素摘要，再单独用 sharp 的 resize/shrink-on-load 路径取得 dHash 与预览输入。降低 --max-pixels 会缩小感知输入；拒收大图使用 --max-decode-pixels。

```sh
node tools/cli.mjs audit --root /path/to/dataset --out reports/limited \
  --threshold 4 --max-images 200 --max-pixels 1048576 \
  --max-total-pixels 20000000 --max-comparisons 50000 --max-pairs 2000
```

- **退出 0**：已完成声明范围内的审计。发现重复本身不改变退出码。
- **退出 2**：已写出不完整报告；例如坏图、符号链接、输入预算或核心比较/输出预算耗尽。即使部分证据有效，也不能把“未出现某一对”视为该对不存在。全部图片解码失败时仍可写出空证据报告，`ok:false`、`complete:false`。
- **退出 1**：参数、根目录、空数据、核心构建、输出冲突或写入等致命错误。stderr 是单行 JSON，含 `ok:false, complete:false, status:"error", error:{code,message,...}`。

成功或不完整时 stdout 是单行 JSON，指出报告位置、图像/配对数、`auditId` 与完整性。报告的 `errors` 解释输入问题；核心 `stats.reason` 解释搜索预算。`complete:true` 的含义限定为本算法、本阈值和已声明输入格式范围，不承诺发现任意语义近重复。

## 输出与覆盖

```text
output/
  report.json
  thumbnails/<sha256-of-relative-id>.jpg
  .visionleak-output.json
```

输出目录必须与输入数据集互不包含。默认只写新目录或空目录；不会覆盖旧报告。`--force` 仅可替换带有效 VisionLeak 所有权清单的输出目录；出现清单外文件、子目录或符号链接即拒绝覆盖。需要保留人工备注时放在输出目录以外，或选择新输出目录。

写入先在相邻临时目录完成，再安装报告目录。读取或处理失败不会改源图。`--force` 替换的是本工具上次生成的报告与缩略图，不能恢复其中后来手工编辑的内容。

报告关键字段：

```json
{
  "schemaVersion": "visionleak-report-v1",
  "auditId": "64-character SHA-256",
  "normalization": "vl-rgb-v1",
  "complete": true,
  "status": "complete",
  "images": [{
    "id": "train/a.png", "path": "train/a.png", "split": "train",
    "byteDigest": "...", "pixelDigest": "...", "dhash": "64 bits",
    "width": 180, "height": 120, "contrast": 159,
    "thumbnail": "thumbnails/<64 hex>.jpg", "thumbnailDigest": "..."
  }],
  "pairs": [{"left": "train/a.png", "right": "test/a.png", "evidence": "byte-identical", "distance": 0}],
  "groups": [{"members": ["train/a.png", "test/a.png"]}],
  "options": {}, "stats": {}, "errors": [], "scope": {}
}
```

`auditId` 为所有稳定报告内容的 SHA-256，包括图像摘要、路径、预算、解码器、MoonBit 编译产物摘要、证据、输入错误、扫描范围与完整性；新算法以 `identityVersion: vl-report-sha256-v2` 标识，递归按对象键排序并保留数组顺序；排除顶层 auditId、createdAt、timing 和附加人工 review。旧 0.1.0 报告按原属性顺序算法兼容。服务与浏览器接收报告时重算并核对摘要。相同审计可复现同 ID，参数、输入范围或引擎发生变化即获得新 ID。它用于防止不同审计的复核记录混用，并非数字签名，也不能认证报告作者。时间记录包含扫描、解码、指纹、比较和缩略图生成等本次流程，不是独立的核心微基准。

`byte-identical` 是文件字节摘要一致；`pixel-identical` 是规范化完整像素及尺寸摘要一致；`perceptual-candidate` 仅表示哈希距离处于阈值，需要人工核验。SHA-256 摘要一致依赖其通常的抗碰撞假设。缩略图只用于观察，完整像素摘要并非从缩略图计算。

## 解码与核心接口

Node 使用 Sharp 执行 EXIF `Orientation` 自动旋转/镜像、转 sRGB、补 alpha，导出 8-bit RGBA；XMP 等其他方向字段不额外解析。16-bit 源图会转换到 8-bit 范围。MoonBit 执行白底 alpha 合成、整数灰度、9×8 分箱 dHash、SHA-256、候选索引、跨集合证据分级、分组及预算控制。像素摘要内容为 ASCII `VL1` + 宽高各 4 字节大端无符号整数 + 行优先 RGB。不同解码器/libvips/色彩管理版本可能得到不同规范化字节，不能把此实现的像素摘要当作跨任意工具通用标准。

```js
import { decodeImage } from './tools/decode.mjs';
import { fingerprint, audit } from './tools/runtime.mjs';
import { runAudit } from './tools/cli.mjs';

const decoded = await decodeImage('/absolute/image.png', {
  maxPixels: 4194304, maxDecodePixels: 64000000, maxFileBytes: 33554432
});
const fp = await fingerprint(decoded); // 调用真实 MoonBit fingerprint_rgba
const result = await audit(images, {
  threshold: 6, maxComparisons: 1000000, maxPairs: 10000, maxImages: 1000
});
const { report } = await runAudit({ root: '/absolute/dataset', out: '/absolute/output', options: { threshold: 4 } });
```

`decodeImage` 返回 `{width,height,rgba:Buffer,byteDigest,format,pixelCount,sourceWidth,sourceHeight,downsampled,fullIdentity}`。width/height/rgba 是有界感知输入，sourceWidth/sourceHeight/pixelCount 是完整源图，fullIdentity 在采样时保存全分辨率 MoonBit 摘要与对比度。`fingerprint` 返回核心成功对象，拒绝输入时抛带 `code` 的 `VisionLeakError`。`audit` 返回核心结果，不附加图像和磁盘报告。`runAudit` 合并默认预算并验证所有参数，执行完整流程；不自行修改进程退出码。

## 本地服务范围

服务仅绑定 IPv4 `127.0.0.1`，只接受相同 Host/Origin 的 GET、HEAD。固定资源为 `/`、`/index.html`、`/styles.css`、`/app.mjs`、`/review-validation.mjs`、启动时加载的 `/report.json`，以及该报告列出的 `/thumbnails/<64 hex>.jpg`。无目录列表、源图服务、任意路径参数、shell 或写入 API。符号链接、路径穿越、跨站请求及 POST 被拒绝；每次提供缩略图都会核对报告中的摘要，文件被替换时返回 409。报告更新后应重新启动服务。

报告与缩略图包含本地数据集信息；仅当用户主动导出并分享时才离开本机。浏览器复核记录与文件下载由前端管理，服务不回写源数据集。

## 验证与来源

```sh
node --test tests/cli.test.mjs
```

集成测试使用真实 PNG/JPEG 与实际 MoonBit 核心，包括跨集合字节/像素证据、EXIF 像素位置、alpha 规范化、可复现身份、预算不完整、结构化错误、源文件保持、覆盖保护、仅回环监听和 HTTP 路径限制。测试临时目录自动清理，无 mock 核心。HTTP 测试需要本地监听权限。

解码行为依据 [Sharp 构造器与像素限制](https://sharp.pixelplumbing.com/api-constructor/)、[EXIF 自动方向](https://sharp.pixelplumbing.com/api-operation/#autoorient)、[颜色转换](https://sharp.pixelplumbing.com/api-colour/)、[原始像素输出](https://sharp.pixelplumbing.com/api-output/#raw)。这些来源描述解码库的能力；VisionLeak 的具体边界以本项目锁定代码和实际测试为准。

## 0.3.0 水平镜像模式

CLI 增加 `--include-mirrors`；JS `fingerprint({width,height,rgba,includeMirrors:true})` 或核心 `fingerprint_mirrored_rgba` 额外返回 `dhashMirror`。核心审计传 `options.includeMirrors:true` 时每个图像必须提供有效 `dhashMirror`。报告中的非原方向 `matchTransform` 对应 left/right 的水平反射，仍属人工复核候选，不能当作像素相等。默认模式不计算额外镜像指纹。详见 [0.3.0 合同与评测](changes-0.3.0.md)。

## 0.4.0 照片评测与直角旋转

新增 `--include-rotations`，可与镜像组合；完整 API、方向顺序、预算语义与开销见 [0.4.0 说明](changes-0.4.0.md)，照片来源与实际误报漏检见 [评测](../reports/photos-v1/summary.md)。

## 0.5.0 阶段执行说明

以上大图与别名更新为计划第 0、1 阶段的实现，待 Claude 阶段验收。12MP JPEG、复制件和无损 PNG 重编码的现场验证、峰值 RSS 及默认检测兼容结果见 `reports/plan-0.5.0/phase-1.md`。Node/sharp 仍会分配完整 RGBA 解码缓冲；增量 SHA-256 不等于整个解码流程零拷贝或固定 RSS。

## 0.5.0：关卡、复核与局部候选

`audit --fail-on exact|pixel|candidate` 按累积等级返回 3；致命错误为 1，未命中但不完整为 2，完整未命中为 0。candidate 包含全图和实验性局部候选。不指定该参数保留旧退出规则。

`verify --report REPORT --root DATASET` 重新计算确定性证据，逐对输出 valid/invalid/missing；失效或缺失退出 4。候选只会跳过，不升级证据。

`export-html --report REPORT --out FILE [--review REVIEW] [--max-bytes N]` 生成只读离线文件，默认 20 MiB、最小 4096 B、最大 64 MiB；省略项及报告裁剪会明确标注。

`export-fixes --report REPORT --out FILE [--review REVIEW]` 输出 group_id,evidence_level,split,path,review_status,suggestion。确定性组按 train、validation、test 顺序保留一份；候选必须 confirmed 后才给建议，工具不执行删除。

`--include-crops` 默认关闭：20 个固定窗口、网格对比度至少 16、共享比较预算，新增 local-candidate。报告 localProfile 解释窗口，matchLocal 记录首个匹配窗口见证；其距离不是全部窗口最小值。窗口基于 dHash 取样图，完整像素摘要不变。详情和不兼容预算迁移见 [0.5.0 变更](changes-0.5.0.md)。
