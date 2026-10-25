# 第 1 阶段执行报告：待 Claude 验收

状态：本地实现与验收项通过，等待独立阶段验收；没有进入第 2 阶段。

## 完成项

### 1.1 版本化冻结与检测兼容

- 新建 research/photos-v1/freeze/0.4.0.json；原 implementation-freeze.json、历史报告和 0.1.0–0.4.0 ZIP 保留。
- tools/evaluation_compatibility.py 严格对比 pairs/groups 的完整序列，涵盖证据、距离、方向、顺序及所有现有配对字段；检测差异默认失败。stats 和计时只记录 before/after/delta，不引起失败。
- 合成与照片评测均接入；`--allow-detection-change REASON` 显式声明变更时仍输出完整差异和理由，空白理由无效；历史报告 SHA 不匹配始终拒绝。
- 冻结后、迁移前照片自检：6 个模式检测与工作量均零差异，见 baseline-self-check.json。最终 **8 个模式** 检测和工作计数均与 0.4.0 一致，见 detection-compatibility.json。所有历史合成/照片 score 对象也逐项一致，见 metric-compatibility.json。

### 1.2 全分辨率大图支持

- 按负责人 D3 选择方案 a：core/sha256.mbt 增量 SHA-256；core/pixel_stream.mbt 白底规范化完整像素；core/sampling.mbt 独立感知尺寸规划。
- 原像素摘要域仍为 VL1 + uint32be 原宽高 + 完整 RGB。Node 按整行块传入 RGBA，核心按既有整数规则产生 RGB 并更新摘要；不从降采样图推断像素相同。
- --max-pixels 现在表示感知取样上限，默认/硬上限 4194304；新增 --max-decode-pixels，默认 64MP、硬上限 100MP。累计预算按完整源图像素计费。
- 报告保存源尺寸、pixelDigestBasis=full、dhashBasis 的取样尺寸与 downsampled 标记；全图对比度也从完整像素计算。

### 1.3 split 别名

- train/training → train；validation/val/valid/dev → validation；test/testing → test。
- 同一组出现多个名称即 SPLIT_ALIAS_CONFLICT，创建输出前拒绝；不合并。
- scope.splitDirectories 保存实际目录到规范 split 的映射，图像路径保留真实目录名。

## 验收标准逐条对照

| 标准 | 运行验证与证据 |
|---|---|
| 新冻结机制在旧基线上通过 | baseline-self-check.json：6 模式检测/工作量零差异；tests/evaluation-compatibility.py 4 项通过 |
| ≥12MP JPEG 完成审计 | tests/large-images.test.mjs 现场生成 4000×3000 JPEG、复制件、PNG；complete=true，1 对 byte-identical、2 对 pixel-identical，3 图同组；Node crypto 独立核对完整 VL1 域 |
| 原 59 张合成与 100 张照片默认 pairs/groups 不变 | 默认合成及两个照片回归组全部通过；扩展镜像/方向模式也共 8 项通过，见 detection-compatibility.json |
| 别名映射与冲突测试 | tests/split-aliases.test.mjs 覆盖 16 组合及 8 种双别名冲突；MoonBit 同规则三后端回归 |
| 峰值 RSS | macOS /usr/bin/time -l：236,109,824 B（225.17 MiB），墙钟 2.50s；单次完整 CLI 运行，生成过程在另一进程，见 large-memory-final.json 与原始 stdout/time 日志 |

最终 `npm run verify:ci`：22 项检查通过，含三后端各 65 项、native release 65 项、Node 35 项与全部图像 oracle。准确命令、环境、日志、sourceDigest 和产物摘要见 source-acceptance.json。`git diff --check -- .` 通过。

## 偏离、边界与未完成项

- Node/sharp 仍先持有一次完整 RGBA 解码；流式部分是 MoonBit 的规范化与 SHA-256，不是整个 native 解码器的流式内存隔离。完整感知输入随后从原编码文件单独 resize/shrink-on-load。峰值 RSS 是本机一轮实测，不是所有格式/机器的保证。
- 原预算测试的拒收参数改用 --max-decode-pixels，因为计划明确要求区分完整解码与感知上限；原有不带新参数的正常 CLI 行为、证据及 groups 保持兼容。
- 0.4.0 的照片保留来源组现在只作为回归集，未用来为新算法调参；阶段 3 需要新的保留来源组。
- 浏览器环境不可用，记录在 browser-migration.json；本阶段所列验收项不依赖新截图，最终发布前仍需补齐浏览器验证。
- Claude 验收和第 2–4 阶段尚未执行。版本未提前升到 0.5.0；未运行会覆盖旧交付报告的 tools/verify.mjs 或重打旧 ZIP。

## 文件与提交

完整清单见 implementation-files.json。commit 列表为空，原因及最终输入摘要见 phase-0.md。阶段报告本身不构成独立验收。


## 2026-10-25 浏览器补验追加

此前浏览器不可用的待办已补齐：Tabbit 成功加载编译后的 MoonBit 核心，报告与复核导入、篡改拒绝、持久化、筛选、键盘导航、JSON 下载、历史报告与缩略图隔离、桌面及手机布局均通过。证据见 followup-acceptance.md、browser-followup.json、browser-downloads-followup.json，实际截图与导出样本在 demo/qa/phase01-followup-*。未修改产品源码，未代替 Claude 阶段验收。
