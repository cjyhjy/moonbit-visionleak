# 原始分辨率 Core 与 ORB 容量

使用COCO val2017原始JPEG字节，全部5000图保持源分辨率。数据来自先前校验的官方公开ZIP，逐文件摘要及原始尺寸沿用原始数据清单；只读复用 `.cache/coco-original-090`，不再写入或重编码。原图总像素1368653453，每图最大409600像素，均低于默认ORB单图1048576上限，因此Core与ORB都不需输入缩放。独立校验要求每张ORB尺寸等于原图尺寸、源像素与特征像素总数相等，而非只检查“5000图”计数。

运行前冻结protocol.json：Core和ORB总像素上限显式设置20亿，默认仍分别1亿和33554432；每次ORB300秒、20亿描述子比较、1亿索引访问、256MiB两个独立子进程监督，其余预算完整列出。所有规模冷/热共用本规模主cache，中断恢复另用新cache；真实SIGKILL后必须观察提交记录复用，最终报告身份一致。每次完整宿主调用外部看门狗600秒，每模式最多30次。原始输入、Core像素指纹及ORB尺寸都必须完整接受，不能丢弃困难样本或用缩小输入替代。

此前research/coco-original-0.9.0的较小ORB采样预设在计时前由本协议替代，其协议/数据保留为未执行研究历史；本轮不是新盲测，也不把同一COCO来源重复使用说成新增独立准确率样本。关系没有污染标签，不能从候选数推断误报或召回。

本轮增加真实产品分阶段/请求往返计时，含IPC、序列化和等待，不是纯CPU profiler。热复用应有0提取尝试、0提取请求耗时、0匹配请求耗时；源文件校验和特征缓存/灰度检查仍会耗时。冷指产品cache为空，未刷新OS磁盘页缓存。Linux VM与CI在计时前已结束并停止；早期小规模阶段短暂并行了Chrome文件选择API功能检查，不能将本轮时间视为严格隔离/统计重复性能试验。

运行与完整报告验证：

```sh
VISIONLEAK_ORB_PYTHON=PINNED_PYTHON python research/coco-full-resolution-0.9.0/run.py 5000 NEW_EVIDENCE_DIRECTORY
node research/coco-full-resolution-0.9.0/verify.mjs NEW_EVIDENCE_DIRECTORY
```

拒绝覆盖已有输出/cache。全部三阶梯最终摘要和完整报告核验通过后再运行summarize.py，不能把运行中progress当作通过收据。图片仅本地cache，不重新分发；COCO图片版权及Flickr使用条款沿用原下载协议，不能称作CC0或统一CC-BY4图像。
