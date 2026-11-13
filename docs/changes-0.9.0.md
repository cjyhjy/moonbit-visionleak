# 0.9.0 开发中：ORB 复用、磁盘分批与恢复

本文描述当前工作区开发实现；package 仍为 0.8.0，尚未发布 0.9.0。实施门槛见 plan-0.9.0.md，测量见 ../reports/plan-0.9.0/README.md。

## 使用

```sh
node tools/cli.mjs doctor
node tools/cli.mjs doctor --include-orb
node tools/cli.mjs audit --root DATASET --out RUN_1 --cache CACHE --include-orb
node tools/cli.mjs audit --root DATASET --out RUN_2 --cache CACHE --include-orb
```

第二次调用复用已提交的特征、命中及无命中方向。输出目录必须不同，缓存可相同。仍读取当前源文件、核对摘要并解码，缓存不绕过当前像素、文件和图片数预算。无需单独指定“恢复”标志。恢复为内容寻址工作复用，不是可移植的完整任务快照；如果输入或参数变化，只有键仍匹配的工作才复用。

较大图片前缀需显式设置输入和 ORB 上限，例如：

```sh
node tools/cli.mjs audit --root DATASET --out RUN_1 --cache CACHE --include-orb \
  --max-images 5000 --max-orb-images 5000 \
  --max-total-pixels 1000000000 --max-orb-total-pixels 1000000000
```

`maxOrbImages` 默认仍256，硬上限扩至10000；实际计划提取超过512张时必须提供 `--cache`，否则标记 `ORB_CACHE_REQUIRED`。`maxOrbTotalPixels` 默认仍33554432，当前硬上限增至2000000000（后续原尺寸验收阶段扩展）。更大的配置并不保证在工作/时间预算内完成配对；按各启用阶段的覆盖判断结果，不将预算停止的零命中视作无污染。

## 特征与磁盘分批

缓存键绑定文件字节及实际采样灰度摘要、尺寸、profile/worker摘要、Python/OpenCV/NumPy版本和OpenCV构建摘要。方向结果还绑定图像ID，保持依赖ID的RANSAC种子一致。缓存格式 `orb-v3` 与早期开发 `orb-v1/v2` 分开，不自动迁移。

缓存模式提取一张即落盘释放，比较时装载当前两张特征；不将数据集拆成互相隔离的子审计，跨批次关系仍按原输入顺序枚举。宿主 `residentFeaturePeak` 记录请求序列所需的最大特征份数，RSS仍由worker监督。磁盘分批没有改变穷举配对的数量级。

256个哈希分片各有4 MiB缓存载荷文件配额（合计最多1 GiB），单条记录不超过512 KiB；配额包括写入时临时载荷文件，不含目录、锁及文件系统分配开销。分片满可早于合计满，返回 `ORB_CACHE_BUDGET`，保留先前结果。选择新缓存目录或自行清理不再需要的旧缓存后重试；产品不自动驱逐恢复需要的记录。指纹/缩略图原有缓存位于另一个命名空间，不计入此ORB配额。

写入通过临时文件、原子替换及分片OS文件锁提交。独立的最小Python锁进程仅持有fcntl文件锁，不读取图像或缓存载荷；主进程死亡后stdin关闭，或锁进程退出时，由OS释放锁，不再回收PID锁文件。`maxOrbMemoryMiB`仍只监督ORB worker，不是包括锁进程的进程树总RSS护栏。只复用已完整提交的记录，正在执行的提取/比较允许重做。本地缓存摘要是完整性检查，不是来源认证或防恶意篡改签名。

## 预算与覆盖

- `timing.orb.executedPairChecks`、`executedDescriptorComparisons`：本次实际预扣的新增方向检查/描述子工作；对应工作预算约束这两个计数。
- `timing.orb.featureCacheHits`、`matchCacheHits`：本次逐条读取复用数量；`checkpointImages`与`checkpointDirections`表示从持久前缀直接恢复的图片前缀和逻辑方向数。完整热扫描也受时间、输入和输出预算限制。
- `phases.orb.pairChecks`、`descriptorComparisons`：本次覆盖的逻辑工作，包含复用，可超过本次新增工作预算。失败/杀死的一次预扣工作可能尚未完成，不能据此计算完整配对覆盖。
- `phases.orb.eligibleInputPairs`：全部输入中需要ORB检查的跨集合配对数，排除Core已有证据；`eligibleFeaturePairs`只统计已提取特征的子集。
- `phases.orb.processedPairs`：当前遍历中完整检查的配对数；某方向命中即可完成该配对，否则需两个方向。它与输入完整前缀 `processedImages` 分开。

每完成一张输入与此前图片的配对遍历，就原子提交一个持久前缀，绑定有序输入、特征键、Core已有配对与输出限制。前缀记录逻辑计数和命中引用；恢复时核对源文件/特征，再装回这些命中并跳过该前缀内的无命中配对。中断所在的未完成行仍通过逐方向记录重放；前缀引用的命中缺失或损坏时，放弃前缀、回退到逐方向缓存或重算。负方向记录删除不会抹去已提交前缀的完成信息。恢复尚不直接跳过源文件读取/特征校验，也未提供任意配对位置的游标。累积覆盖限于本次有效输入、配置、预算及保留的缓存；未检查配对仍须执行，输出容量不会被恢复静默扩大。

## 诊断

`doctor` 默认检查Node、Sharp编码/解码及Core可调用性。加 `--include-orb` 后检查固定Python依赖、最小ORB提取、实际RSS监督和缓存OS文件锁探针。输出JSON，每个失败检查包含修复步骤，检查全部通过返回0，失败返回1。不隐式安装依赖。CLI引导层不静态导入Sharp或Core，因此这两项缺失时仍能运行诊断。

## 当前验证边界

513张集成测试含跨512边界的真实裁切命中，验证无缓存拒绝及两份特征驻留。100/1000/5000张阶梯实验只验证特征阶段，输入是单张新来源照片派生的256×256容量负载，不代表独立自然照片，也没有完成5000图穷举配对。

早期描述子均值基线只达到约1.89倍配对削减，失败结果保留。后续描述子分桶已完成48新来源受控评测与冻结保留主检验，并接入下述可选生产入口。自然公开案例、复核功能与Investigator的后续状态见文末；真人耗时和大照片完整端到端容量仍未完成。

## 当前生产可选检索接口

前文研究基线的1.89倍结果是早期历史；固定描述子分桶在48新来源试验的冻结保留集达到观察值门槛后，已接入默认关闭的选项：

```sh
node tools/cli.mjs audit --root DATASET --out OUTPUT --cache CACHE \
  --include-orb --include-orb-retrieval --max-orb-comparisons 2000000000
```

该选项必须同时启用ORB且提供缓存。算法固定为24bit、4表、对称top-1并集，不提供未经评测的调参开关。报告orbProfile.retrieval绑定实现文件摘要、Node/ICU及实际排序配置；几何参数仍沿用原profile。特征和已完成几何方向可以与穷举模式共享，检索队列/扫描前缀单独绑定搜索配置。

|新增预算|默认|硬上限|
|---|---:|---:|
|maxOrbIndexDescriptors|4000000|8000000|
|maxOrbIndexVisits|100000000|1000000000|
|maxOrbIndexMemoryMiB|256|512|

CLI对应 `--max-orb-index-descriptors`、`--max-orb-index-visits`、`--max-orb-index-memory-mib`。描述子上限限制输入索引容量，posting预算限制本次新增查询访问，RSS每100ms监督索引子进程。索引与Python几何worker共享整阶段maxOrbMilliseconds截止时间；两者RSS分开记录，不能相加冒充同步峰值或进程树硬隔离。

`phases.orb.retrieval`给出索引查询数、逻辑访问数和选定配对数；`timing.orb.retrieval`给出本次执行访问、已恢复查询、索引描述子数、分配量及独立worker采样峰值。完整队列可以零新增索引工作复用；0峰值且indexedDescriptors为0代表未启动子进程。部分查询若自身工作量超过本次posting预算，需要提高预算才能完成，不保证任意小预算都推进一个查询。

`candidateQueueComplete`表示所有输入的已选候选均已几何处理；`exhaustivePairsComplete`表示全部应检配对确实覆盖。存在被粗筛省略的配对时，整体仍complete:false、reason为ORB_APPROXIMATE_COVERAGE，默认退出2；该原因不冒充资源预算耗尽。`coverage.orbSearch`独立列出eligiblePairs/selectedPairs/verifiedPairs。processedImages仍保守表示穷举完整前缀，searchProcessedImages另记候选扫描行进度。索引工作预算未完成时先保留Core证据，不能把半成品候选队列当作完整搜索。

168图产品回归的71个ORB见证与已冻结同平台参考一致；5000×800条合成描述子的压缩索引组件通过。它们都不是5000张自然照片的端到端审计保证。完整证据见reports/plan-0.9.0/product-retrieval/README.md。

## 复核与公开自然案例

工作台增加每批最多200对的选择/复核/撤销，按共享图像导航，以及独立迁移包预览和分批应用。跨次迁移核验双方报告身份、图片内容/split、适用算法信息与完整证据，跳过多义关系，保留目标已有结论及备注；不依据共享来源自动标记。功能收据见reports/plan-0.9.0/review-efficiency；真人耗时仍未测量。

公开自然案例采用ciFAIR作者既有人工标注的286个CIFAR-10跨集合关系，涉及565张32×32图。固定默认Core阈值6后，近重复检出79/249、漏检170；相似难负例报候选3/37。另4个未标注输出不计作误报。完整执行和独立Python指纹/评分校验通过，但效果存在明显漏检，不能将执行通过称为准确率门槛通过，也不用于ORB或大照片容量结论。原始标签、完整漏检、协议和来源见reports/plan-0.9.0/natural-cifair。

Investigator独立项目已有固定Core0.8.0的ORB迁移，本轮只读检查当前lock、安装产物并运行9项实际合同测试，零跳过且源代码摘要前后一致。未改写另一项目、未调用模型，也未将其升级到尚未发布的0.9.0；收据为reports/plan-0.9.0/investigator-core080-check.json。

## OpenCV 特征数上限修复

真实5000照片阶梯在第1912张发现OpenCV请求nfeatures=800仍返回801点，旧实现按协议停止。现在对超额返回保留detector顺序的前800点及对应描述子行，再计算摘要/缓存/匹配；profile记录featureCapPolicy，profile/worker摘要变化使旧命名空间失效。独立合成周期纹理可稳定触发2512点，真实worker回归验证限制800、重复摘要一致及缓存payload重载。首次失败收据保留于reports/plan-0.9.0/coco-capacity-5000。原始分辨率、自然效果及窄屏/文件迁移的边界仍按STATUS.json逐项记录。

## 真实照片容量记录

已完成COCO val2017全部5000张图最长边384px规范化后的100/1000/5000阶梯，实际生产Core与检索冷/热/真实宿主SIGKILL恢复通过；5000图冷合计370.332秒（10次显式预算调用）、热19.478秒，候选4980对处理完成且最终身份一致。它不代表全默认参数、原始分辨率或穷举完成。主Node高水位约447MiB，索引子进程采样约227MiB、ORB约76MiB，后两项各受256MiB监督，不能相加当进程树硬上限。完整条件与原始失败见reports/plan-0.9.0/coco-capacity-README.md。最新CI30项/Node83零跳过，见reports/plan-0.9.0/ci-feature-cap/verification.json。

## 原始输入预算与分阶段计时

后续将 `maxTotalPixels` 可显式设置的硬上限从10亿提高至20亿（默认仍1亿）；它统计成功接受图片的完整源像素，缓存命中也消耗本次输入像素预算。单图解码/采样限制继续单独约束；为全原尺寸ORB实验，`maxOrbTotalPixels` 的可显式设置硬上限也提高至20亿，默认仍33554432。20亿仍在CLI的Int32安全范围内，超界拒绝，未取消总预算。真实COCO原图合计1368653453像素，原始JPEG容量实验另冻结协议，不能套用前述384px结果冒充。

`timing.orb` 现在额外记录：

|字段|实际范围|
|---|---|
|featureStageMs|源读取/摘要核验、ORB采样灰度、特征缓存、提取请求及释放的整个特征阶段|
|executedFeatureExtractions|本次实际尝试发送的提取请求数；失败/被杀的请求可能未完成|
|featureWorkerRequestMs|仅本次实际提取请求的往返墙钟时间，含IPC/协议和OpenCV，缓存复用不计旧时间|
|geometryStageMs|扫描前缀恢复、方向结果/特征载荷读取、几何请求、结果/进度写入的阶段墙钟时间|
|geometryWorkerRequestMs|本次新增匹配请求的往返墙钟时间，含IPC/协议和OpenCV，复用不计旧时间|

已有 `timing.orb.retrieval.elapsedMs` 另记检索阶段。各阶段未覆盖的worker启动、少量宿主准备及关闭开销保留在总elapsedMs；不保证逐毫秒相加等于总时间，以上也不是纯CPU profiler。全热复用的两个worker请求时间和提取尝试数应为0，即使本次仍有源核验/缓存开销。计时不参与报告身份和缓存键，不将历史计算时间冒充本次执行时间。

完整原分辨率实验使用research/coco-full-resolution-0.9.0协议：原始JPEG不重编码，Core/ORB均保留这批图的完整尺寸（每图最大409600像素，低于默认ORB单图上限1048576）。Core/ORB总像素显式设20亿；源图总像素与ORB特征像素必须逐报告一致，冷热和真实中断恢复另行核验。之前较小ORB采样的预设没有执行，保持其冻结历史，不与正式原图结果混用。
