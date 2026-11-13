# 公开自然重复与相似难负例基线

使用 ciFAIR 作者已经人工标注的 CIFAR-10 跨训练/测试关系；不是本项目合成变换，也没有新增真人复核计时。原始注释及含义见 [ciFAIR 元数据](https://github.com/cvjena/cifair/tree/master/meta)，二进制数据来自 [CIFAR 官方页面](https://cave.cs.toronto.edu/kriz/cifar.html)。数据集引用：Alex Krizhevsky, *Learning Multiple Layers of Features from Tiny Images*, 2009；重复标注引用：Björn Barz and Joachim Denzler, *Do We Train on Test Data? Purging CIFAR of Near-Duplicates*, Journal of Imaging 6(6):41, 2020（[作者项目](https://cvjena.github.io/cifair/)）。

运行前固定 `research/natural-cifair-0.9.0/protocol.json`：全部286条作者关系，默认阈值6，不启用裁切或ORB，不按效果删除样本。它们涉及565张32×32图片（训练279、测试286）。标签1为同次拍摄近重复，标签2为内容不同但高度相似；该文件没有标签0。

|项目|数量|
|---|---:|
|标注近重复检出 / 漏检|79 / 170|
|标注难负例报候选 / 未报|3 / 34|
|标注近重复召回|31.73%（79/249）|
|标注难负例候选率|8.11%（3/37）|
|已标注候选条件精确率|96.34%（79/82）|
|已标注关系执行覆盖|286/286|
|全部返回关系|86|
|返回但未有标注的关系|4|

`summary.json` 的 passed-execution 仅表示试验完整执行，绝非效果门槛通过。默认Core在此自然近重复集合存在明显漏检；所有170个漏检及3个难负例候选保留于 `relationships.json`。剩余4个未标注候选单列，不计作误报。没有依据本轮结果调整阈值。

数据来源是作者预先找到的重复/相似集合，不能代表随机总体，条件精确率不等于产品整体精确率。其32×32分辨率不用于大照片ORB效果、候选召回或5000照片容量结论。标签是第三方既有人工注释，未在本项目重新裁决，也没有真人操作耗时。

完整性链：官方二进制压缩包MD5校验通过，并记录SHA-256；逐图记录原始RGB和PNG摘要；编译Core绑定运行前摘要。`independent-verification.json` 由独立NumPy批量解码、Python/ImageHash指纹与直接阈值评分验证全部565图/286关系，计数一致。产品源码摘要与 `../ci-review-efficiency/verification.json` 一致；这组研究程序另以文件摘要绑定，不属于该CI自动重跑范围。

复现（原始下载与PNG仅保留在忽略的 `.cache/`，不重新分发图片）：

```sh
python research/natural-cifair-0.9.0/download.py
python research/natural-cifair-0.9.0/prepare.py
node research/natural-cifair-0.9.0/evaluate.mjs NEW_EVIDENCE_DIRECTORY
python research/natural-cifair-0.9.0/verify.py NEW_EVIDENCE_DIRECTORY
```

prepare需要新建的 `.cache/natural-cifair-090`，不覆盖现有数据。Python依赖沿用固定oracle环境。protocol保留试验前状态文本，结果以summary及独立校验收据为准；不回写冻结协议。
