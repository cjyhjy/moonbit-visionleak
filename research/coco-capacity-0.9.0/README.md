# 真实照片容量与恢复试验

本目录先冻结protocol，再下载/规范化全部5000张COCO val2017照片，不按匹配结果选择输入。官方ZIP当前公开S3桶使用有效证书的HTTPS路径接口获取；固定字节数/ETag，记录SHA-256并验证ZIP CRC。原始和规范化图像仅保留在忽略的本地cache，不重新分发。图片版权不属于COCO Consortium；来源与条款见protocol。

每张最长边缩至384px且不放大，Pillow固定环境；保存原始字节/RGB、规范化PNG/RGB摘要与尺寸。5000张原始字节和RGB摘要均不同，规范化总像素526971702。它们是公开图库的5000个不同真实图像文件，分辨率已经统一限制，不是从单张图片派生的负载；没有证明拍摄来源统计独立，不能称作原始分辨率验收，也不意味着没有自然近重复。冻结协议/生成收据中的independent只表示图像文件来源多样，不是统计独立或同源近重复排除结论。

运行前按原始文件名排序，每个前缀奇偶位置分配train/test；这是容量用的人工split，不是COCO官方训练/测试关系，也没有污染真值。100/1000/5000各用独立全新cache，分别跑默认Core算法（阈值6；输入/比较/像素容量预算显式提高，非全默认参数）、检索冷、热和新cache真实SIGKILL后的恢复。每次ORB最多300秒/20亿描述子比较，超过预算继续使用同一缓存，最多30次；更细预算见protocol。候选队列完成仍是近似检索，省略的穷举配对保持overall complete=false/exit2。

首次100张试验在审计前暴露研究驱动导入错误，记录coco-capacity-100/failure.json。修正驱动后100/1000通过；5000张第1912张照片实际返回801特征点而非请求的800，触发生产协议停止，记录coco-capacity-5000/failure.json。修复生产worker确定性限制800并在profile声明policy后，完整CI83项Node及既有71见证/168图特征回归通过；post-fix重跑目录均以cap-fixed结尾。原始失败和旧结果保留，不替换成通过。

研究脚本/数据不属于生产sourceDigest根；各结果分别绑定runner、child runner、protocol和dataset摘要，dataset绑定prepare和原始ZIP；verify完整核验最终报告身份、输入摘要、覆盖合同、冷热/恢复相同身份及实际中断/特征复用记录。CI-feature-cap只验证生产测试，不自动重跑此完整容量研究。

复现需新输出/cache，默认拒绝覆盖：

```sh
python research/coco-capacity-0.9.0/download.py
python research/coco-capacity-0.9.0/prepare.py
VISIONLEAK_ORB_PYTHON=PINNED_PYTHON python research/coco-capacity-0.9.0/run.py 5000 NEW_EVIDENCE_DIRECTORY
node research/coco-capacity-0.9.0/verify.mjs NEW_EVIDENCE_DIRECTORY
```

生产report的ORB时间包含特征核验/缓存/索引/几何整体开销，另列索引时间；尚无纯提取与纯匹配的逐请求CPU分解，不能将两者估算成独立阶段计时。时间为单次探索测量，冷/恢复的总和包括各次重新读取/核验输入、Core、缩略图和缓存维护，不能与纯ORB特征组件时间混比。主Node进程使用OS每次高水位RSS；Python与索引进程各100ms采样，峰值不能相加当作同步进程树峰值。杀进程特意发生在已有提交特征后，证明真实宿主崩溃后的特征恢复；不将其称作大规模索引查询或几何行中途SIGKILL压力试验。预算续跑另外验证已完成查询/方向/前缀复用。自然关系未经标注，不报告COCO误报/召回率或真人耗时。
