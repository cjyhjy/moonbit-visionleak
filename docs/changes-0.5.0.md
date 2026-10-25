# 0.5.0 变更与迁移

当前为本地发布候选，正式包发布另行记录。

## 不兼容变化：大图预算

`--max-pixels` 从“超过即拒收”改为“感知指纹取样上限”。像素证据仍计算完整分辨率的规范化 RGB 摘要。

旧命令若依赖拒收 4MP 以上的图片，请显式设置解码上限：

```sh
# 旧写法的拒收意图
node tools/cli.mjs audit --root dataset --out old-output --max-pixels 4194304
# 0.5.0 迁移写法
node tools/cli.mjs audit --root dataset --out new-output --max-decode-pixels 4194304
```

默认解码上限为 64,000,000 像素，硬上限 100,000,000；感知取样硬上限 4,194,304。sharp 仍需分配全图 RGBA，流式 SHA-256 不代表整个解码过程使用固定内存。

## CI 与移交

- `--fail-on exact|pixel|candidate`：退出优先级 1 致命错误、3 命中、2 不完整、0 完整且未命中；candidate 包含新局部候选。
- `verify --report REPORT --root DATASET`：逐对复核确定性证据，有失效或缺失退出 4；候选不升级为确定性证据。
- `coverage` 记录已审计前缀、已提取指纹数、拒收原因和预算位置。
- `export-html` 默认 20 MiB 上限，截断时明确标注；`export-fixes` 导出 CSV 和稳定组键，不操作数据集。
- split 支持 training、val/valid/dev、testing；同一 split 多别名目录冲突即报错。

## 实验性裁切模式

`--include-crops` 默认关闭。MoonBit 用灰度积分图计算 20 个固定窗口的局部 dHash，以单独 BK-tree 检索，共用 `maxComparisons`。低于 16 的窗口网格对比度不入索引。新增 `local-candidate`，与全图 `perceptual-candidate` 分开计数；不会进入确定性 groups。

窗口覆盖 90%/75%/50% 的四角和中心，以及 75% 宽/高的长方形。`matchLocal` 记录窗口索引与版本。距离是首个满足阈值的确定性窗口见证，不是所有窗口距离的最小值。窗口基于报告的 dHash 取样尺寸；局部窗口不额外组合镜像/旋转，既有全图镜像/旋转仍可单独启用。

新保留组 16 个来源、112 张受控图像：局部 TP=117、FP=44、FN=59；合并候选 TP=149、FP=54、FN=27。ImageHash crop 基线为 TP=101、FP=35、FN=75。固定窗口对齐的受控裁切不能代表任意裁切，详见阶段报告及原始 JSON。

## 兼容性与发布

现有三级证据含义不变。默认、镜像、方向模式在八个冻结回归模式中的 pairs/groups 保持不变。0.4.0 的原保留组转为回归集，新来源按场景和来源分开开发/保留。

Mooncakes 只发布可复用核心，包内容检查要求小于 1,000,000 字节；源码 ZIP、截图和评测照片不进入该包。npm 仍为 private，本版本不增加 npm 发布流程。
