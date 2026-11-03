# 0.7.0 发布记录

已于 2026-11-03 完成公开发布和独立下载/导入校验。工程提交为 `7f2925850ff988875b8f544d7490fd10546621c4`；[PR #1](https://github.com/cjyhjy/moonbit-visionleak/pull/1) 已合并，[合并后 Linux CI](https://github.com/cjyhjy/moonbit-visionleak/actions/runs/41699751041) 通过。

- [GitHub Release v0.7.0](https://github.com/cjyhjy/moonbit-visionleak/releases/tag/v0.7.0)：完整 ZIP 27,695,583 字节，实际重新下载 SHA-256 `c56c27dc3b56d6660458d75755ab5728e15a3d26713ab24659601b061c49d476`。
- [Mooncakes](https://mooncakes.io/docs/cjyhjy/visionleak/)：`cjyhjy/visionleak@0.7.0` 正式发布返回 200；新项目通过公共注册表安装，三个后端各 4 项 smoke 测试通过，全部 20 个包文件与上传 ZIP 一致。
- `completion.json` 汇总实际状态；`github-release.json`、`registry-status.json`、`clean-import.json`、`registry-content-parity.json` 分别记录各环节。

首次 Linux 失败及未发布候选保存在 `superseded-candidate.json` 和关联提交。问题是生成 PNG 压缩字节在平台间不同；修复后的合同仍严格要求来源字节、解码像素、变换标签、配对顺序及窗口见证一致。新写的 registry smoke 脚本曾使用错误的 Json unwrap API，修正和原编译失败记录在 `smoke-harness-correction/`；发布包未因此改变。

ZIP 保存打包时的源码和验收快照，包外收据记录随后的发布状态；后续研究不回写该 ZIP 或 Mooncakes 版本。0.7.0 原随机裁切实验仍是 0/24，没有将研究原型的结果归给本版本。
