# 核心 API 与数据合同

MoonBit 包 `visionleak/core/core` 的实现位于 `core/`。JS 发布接口来自 `dist/visionleak.js`，不是另写的 JavaScript 算法。

```js
import { fingerprint_rgba, fingerprint_json, audit_json } from '../dist/visionleak.js';
const fp = JSON.parse(fingerprint_rgba(1, 1, new Uint8Array([255, 0, 0, 255])));
const result = JSON.parse(audit_json(JSON.stringify({ images: [], options: { threshold: 6 } })));
```

`fingerprint_rgba(width, height, rgba)` 的低层 JS ABI 要求 width/height 为整数，rgba 为 `Uint8Array`（Node Buffer 可用）。传入其他 JS 类型不属于这个低层接口合同；Node 适配层先验证解码结果。返回字符串 JSON，成功含 `ok,width,height,pixelDigest,dhash,contrast,normalization`；失败含 `ok:false,error:{code,message}`。每边最大 65,535；总像素不超过 4,194,304；RGBA 长度必须恰为 `width*height*4`。

`fingerprint_json(string)` 接受 `{width,height,rgba:[0..255]}`，用于小输入诊断；至多 1,048,576 像素、16 Mi 个字符串代码单元、JSON 结构深度 8。整数、通道范围和数组长度均检查。大图应使用 bytes 接口以避免 JSON 数组额外内存。

## `vl-rgb-v1`

1. Node sharp 0.35.5 解码单帧栅格；使用 EXIF `autoOrient()`、`toColourspace('srgb')`、`ensureAlpha()`、8 位 unsigned RGBA。拒绝动画、多页、坏图和超过输入预算的图片。ICC/color-profile 行为取决于锁定的 sharp/libvips，跨版本不宣称位级相同。
2. MoonBit 对每个通道做白底合成：`(channel*alpha + 255*(255-alpha) + 127) // 255`。RGB 已在 sRGB 编码值域；不在 linear-light 下合成。这是明确的显示规范，不是物理辐射测量。
3. `pixelDigest = SHA256(ASCII("VL1") || uint32be(width) || uint32be(height) || RGB row-major bytes)`。尺寸必须参与摘要，避免不同形状的相同字节序列混同。透明区隐藏 RGB 不影响结果。
4. 灰度 `Y=(299R+587G+114B+500)//1000`。全图灰度 `max-min` 为 `contrast`。
5. 采样 9×8 格：`x0=floor(x*w/9)`，`x1=max(x0+1,floor((x+1)*w/9))`；y 使用 8。每个整数矩形的均值向下取整。小图重复采样对应像素。这是确定性整数 box 分区，不是 Pillow/Canvas 的 LANCZOS。
6. 按行生成 64 个字符；右格大于左格为 `1`，否则 `0`。ImageHash 对照在相同 9×8 灰度格上运行，避免将 resampling 差异误归因于 dHash。

## 审计输入

`audit_json` 接受 `{images,options}`。每项必需 `id`（唯一、1..4096）、`split`（1..64）、`byteDigest`、`pixelDigest`（64 位小写 hex 字符）、`dhash`（64 个 0/1）、`contrast`（0..255 整数）。图片路径、尺寸等报告元信息由 Node 适配层保留。摘要被视为调用方提供的指纹；核心不会再次读取磁盘。因此外部构造的摘要清单并非文件真实性证明。

| options | 默认 | 核心允许范围 |
|---|---:|---:|
| threshold | 6 | 0..64 |
| maxImages | 1000 | 0..10000 |
| maxComparisons | 1000000 | 0..10000000 |
| maxPairs | 10000 | 0..100000 |

缺省或 null 采用默认值；非整数或越界拒绝。未知字段保留兼容性而不参与计算。整体 JSON 最大 16 Mi 字符、深度 8。空数组在核心产生完整空报告；CLI 仅在没有发现支持扩展名的图片且无扫描错误时报 `EMPTY_DATASET`。若已发现图片但全部坏图或超预算，会生成 `ok:false, complete:false` 报告并退出 2。

成功输出 `ok,complete,status,pairs,groups,options,stats,normalization`。Pair 含 left/right 输入 id、evidence、distance、lowContrast（任一全图灰度范围 <16）与初始 review。每个无序跨 split 对最多输出一次；同 split 对不输出。

`groups` 只合并已经输出的确定重复边，绝不传递合并感知候选。预算不完整时分组也可能不完整。`stats.processedImages` 只计完成查询与索引插入的前缀；最后一项可能已输出部分有效证据。`stats.comparisons` 是工作单位：树节点距离计算或检查一个 bucket 成员各一单位；不是所有像素算术的计数。`stats.reason` 为 `ComparisonBudget` / `PairBudget` / 空串。

## 主机报告与复核

CLI 在核心结果上加入 `schemaVersion:'visionleak-report-v1'`、`auditId`、images、decoder、errors、scope 和时间。Node 对文件原始 bytes 计算 byteDigest；对审计内容、参数、范围计算 auditId。人工复核 schema 及导入校验见 `demo/review-validation.mjs`。复核结果不会改变原始算法证据等级。
