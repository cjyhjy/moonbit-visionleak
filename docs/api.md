# 核心 API 与数据合同

MoonBit 包 `cjyhjy/visionleak/core` 的实现位于 `core/`。JS 发布接口来自 `dist/visionleak.js`，不是另写的 JavaScript 算法。

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

0.2.0 在验证 `dhash` 后将其内部表示打包为两个 UInt32，使用 XOR 与 popcnt 计算汉明距离。外部仍传入 64 个 0/1 字符；规范化、阈值、精确证据优先级、索引遍历、输出顺序与预算计费保持原合同。公开 MoonBit `hamming(String, String)` 仍对非法长度或非二进制字符返回 `-1`。

`groups` 只合并已经输出的确定重复边，绝不传递合并感知候选。预算不完整时分组也可能不完整。`stats.processedImages` 只计完成查询与索引插入的前缀；最后一项可能已输出部分有效证据。`stats.comparisons` 是工作单位：树节点距离计算或检查一个 bucket 成员各一单位；不是所有像素算术的计数。`stats.reason` 为 `ComparisonBudget` / `PairBudget` / 空串。

## 主机报告与复核

CLI 在核心结果上加入 `schemaVersion:'visionleak-report-v1'`、`identityVersion:'vl-report-sha256-v2'`、`auditId`、images、decoder、engine、errors、scope 和时间。Node 对文件原始 bytes 计算 byteDigest；`engine.artifactDigest` 记录实际核心构建产物摘要。

新报告的 `auditId` 由 MoonBit `core/report_identity.mbt` 定义，`demo/report-identity.mjs` 为主机适配层：移除报告**顶层**的 `auditId`、`createdAt`、`timing`、`review`，递归规范化其余对象的键顺序，保留所有数组顺序，再对 JSON 字符串的 UTF-8 字节计算 SHA-256。`identityVersion` 本身及其他未排除字段也参与摘要；修改证据、参数、范围或数组顺序会改变身份。对象键重排和上述顶层时间、复核字段变化不改变新格式身份。嵌套对象中的同名字段不会被这一顶层排除规则移除。

没有 `identityVersion` 或其值为 null 时，校验器兼容 0.1.0 原 CLI 的 JSON 属性顺序算法，不对对象键重新排序；旧报告重排属性后可能无法通过旧身份校验。未知身份版本拒绝加载。浏览器在加载报告及其复核记录前、服务器在启动服务前都重算内容摘要并核对 `auditId`。

这项校验用于发现内容与身份不一致，不是数字签名、可信来源认证或文件真实性证明；修改内容后重新计算摘要仍可构造一份一致报告。人工复核 schema 及导入校验见 `demo/review-validation.mjs`；复核记录继续绑定 `auditId`，不会改变原始算法证据等级。

## 0.3.0 水平镜像模式

CLI 增加 `--include-mirrors`；JS `fingerprint({width,height,rgba,includeMirrors:true})` 或核心 `fingerprint_mirrored_rgba` 额外返回 `dhashMirror`。核心审计传 `options.includeMirrors:true` 时每个图像必须提供有效 `dhashMirror`。报告中的非原方向 `matchTransform` 对应 left/right 的水平反射，仍属人工复核候选，不能当作像素相等。默认模式不计算额外镜像指纹。详见 [0.3.0 合同与评测](changes-0.3.0.md)。

## 0.4.0 照片评测与直角旋转

新增 `--include-rotations`，可与镜像组合；完整 API、方向顺序、预算语义与开销见 [0.4.0 说明](changes-0.4.0.md)，照片来源与实际误报漏检见 [评测](../reports/photos-v1/summary.md)。

## 0.5.0 开发中的核心迁移与大图合同（待阶段验收）

模块名已按负责人决定改为 `cjyhjy/visionleak`，版本暂保留 0.4.0，统一升版在计划第 4 阶段。新增导出：

- `report_identity_json(source)`：返回 `ok,payload,digest`，处理旧版属性顺序与 v2 字典序；主机先执行标准 JSON 序列化，保留数值拼写。对象数字索引键按 ECMAScript 数字顺序排列。最大 64 Mi 字符、深度 128。标准解析器要求有效 Unicode，拒绝孤立 UTF-16 surrogate；实际历史样例均兼容，任意手工构造 JSON 的完全兼容仍需注意此边界。内容摘要仍非签名。
- `review_validation_json(source)`：`operation` 为 `report`、`review`、`pairKey`。报告与复核的身份、引用、证据等级、方向、距离、重复键、备注等规则在核心校验；主机仅适配 Map、展示文本与 `Date.parse` 日历解析。最大 64 Mi 字符、深度 128。
- `cli_options_json(source)`：参数解析、预算范围、默认选项及 split 别名解析。最大 1 Mi 字符、深度 16。
- `score_json(source)`：以 `{truth,pairs}` 计算精确和近似的独立分母、混淆矩阵、误报漏报列表与等级不一致记录。Python 的规范化像素/ImageHash 和穷举索引 oracle 保持独立。
- `sha256_new/update/final`：不透明的增量 SHA-256 状态；`update` 接受 Bytes，final 可重复调用，final 后不能继续 update。核心只保留一个待处理块。
- `pixel_digest_new/update_rgba/final`：全分辨率行优先 RGBA 分块，尺寸域和白底整数合成保持 `vl-rgb-v1`。最大 100,000,000 像素、每边 65,535；无效、超长、截断输入不能产生有效摘要。返回原尺寸、像素摘要与全图对比度。
- `sampling_plan_json(width,height,maximum)`：感知取样尺寸规划，maximum 仍不超过 4,194,304，极窄长图也受总取样像素数约束。

原 `fingerprint_rgba` 的 4,194,304 像素上限保留。CLI 允许大图在独立的解码预算内进入全分辨率摘要路径；送到 fingerprint 的只是有界采样图。每张报告图像新增 `pixelDigestBasis: "full"`、`dhashBasis: {width,height,downsampled}`；报告的 width/height 是完整规范化源图尺寸。精确分桶使用完整像素摘要，绝不使用降采样摘要替代。
