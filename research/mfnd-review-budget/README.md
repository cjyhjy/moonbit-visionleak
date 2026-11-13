# MIRFlickr 自然照片复核预算评测

在项目根目录运行。prepare.py 读取 Strathclyde 的 IND 同源标注，仅使用第一个原图分卷内的双图簇，按固定哈希排序，取前 16 簇做开发、后 64 簇做保留。每簇编号小的照片进 train，另一张进 test。样本在读取图片前写入 sample.json。原图由官方 ZIP 按字节范围下载，并按目录里的 CRC 和长度校验。图片仅存本地缓存。

```sh
python3 research/mfnd-review-budget/prepare.py
VISIONLEAK_ORB_PYTHON=/path/to/pinned/python node research/mfnd-review-budget/evaluate.mjs
```

四种配置分别是默认 Core、默认加镜像、阈值 10、默认 Core 加穷举 ORB。全队列按证据等级、dHash 距离、ORB 内点数和路径排序。评测统计已标注同源配对，以及前 50 对里的已标注命中数。未标注配对单列。样本富集双图重复簇，未加入随机图库或专门的难负例，其他图库上的误报率和审阅负担仍需实测。

[原始标注](https://mfnd.similarity.eu/) · [照片分卷](https://press.liacs.nl/mirflickr/mirdownload.html)

保留集 64 对中，四种配置依次找回 50、53、59、60 对。固定只看前 50 对时四种配置均为 50 对，当前样本无法据此选出更好的队列排序。阈值 10 可以作为无需 Python 的扩召回对照，是否适用于自己的数据应同时衡量难负例与候选负担；项目默认阈值仍为 6。[逐配置结果](../../reports/post-090/mfnd.json)

另行探索阈值 10 与 ORB 的组合。它由首轮结果启发，开发 16/16、同一保留集 61/64、前 50 对命中 50，仍漏 3 对。这一行属于事后实验。可用 `--threshold 10 --include-orb` 复现该配置，预算和缓存设置见 evaluate.mjs。
