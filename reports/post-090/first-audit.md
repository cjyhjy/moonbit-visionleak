# 首次复核与 CSV 导出

Chrome 打开真实 walkthrough 报告，检查 3 张图、3 对证据和确定性阶段 3/3。选中 train/170072252-original.png 与 validation/exact-copy.png，查看两张缩略图和字节相同证据，确认关联并导出 review.json。重新进入同源页面后恢复 1 条复核。点击新增的「导出处理建议 CSV」，页面提示 2 行，下载 377 字节。

用 CLI export-fixes 加上浏览器导出的 review.json 生成对照 CSV，两份 CSV 逐字节一致，SHA-256 为 a2ff8f75e4106992be22fae94854d574c9b4e3b843b438a0d3700255f0fd580b。下载文件包含训练集 keep 和验证集 remove-from-validation 两条建议。自动化 GUI 验收使用已有报告，本轮没有计时真人首次安装到完成的过程。

另用新端口从 fixtures/benchmark 重新扫描，外部时钟在启动 audit 前记录秒级起点。工作台显示 59 张图，train 12、validation 18、test 29，确定性和感知阶段各 59/59，裁切关闭。确认 test/alpha-white.png 与 train/alpha-source.png 的规范化像素一致后，导出 27 行 CSV。按下载文件落盘时间计算约 17 秒，包含自动化浏览器操作和工具调度，依赖已安装。详细收据见 timed-first-audit.json。
