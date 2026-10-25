# Mooncakes dry-run 退出码修复

日期：2026-10-25。结论：根因已复现，项目 dry-run 入口已修复，真实服务复验退出码为 0。没有正式发布。

## 根因与证据

固定发布器为 `mooncake-bin 0.1.20260911 (7344121)`。本机官方二进制 SHA-256 为 `439b2cf3c9c6ea87f4788b3fc79f4b2c2e35c9e6f5ddbf9c89fdccf294cdebbe`。`otool -tvV .toolchain/bin/mooncake` 显示发布响应处理在地址 `0x100009424` 比较状态码与 `0xc8`（十进制 200），不相等就跳往错误分支 `0x1000094a4`；成功和错误分支相邻引用 `Server status:` 格式串。摘录见 `mooncake-publish-status-disassembly.txt`。

用临时空白包、假凭据和 127.0.0.1 HTTP 服务，在同一固定二进制上复现：

| 服务响应 | 原始入口退出码 | 修复后项目入口退出码 |
|---|---:|---:|
| 200 OK | 0 | 0 |
| 202 Accepted，明确预演成功且未作变更 | 255 | 0 |
| 401 Unauthorized | 255 | 255 |
| 500 Internal Server Error | 255 | 255 |

401/500 特意返回与成功相同的 detail 内容，确认兼容处理不会仅凭“成功”文字接受错误状态。原始结果在 `mooncakes-response-probe-valid.json`，修复后结果在 `mooncakes-response-probe-fixed.json`；对应复现脚本为 `mooncakes-probe-original.py`、`mooncakes-probe-fixed.py`。较早的 `mooncakes-response-probe.json` 使用已不支持的 JSON 清单，被前置检查拒绝，不能作为网络响应验证证据。

外层 [`mooncake_adapter::execute_cli`](https://github.com/moonbitlang/moon/blob/748b63c/crates/moon/src/cli/mooncake_adapter.rs) 遇到子进程失败调用 `bail!`；[`cli::runtime`](https://github.com/moonbitlang/moon/blob/748b63c/crates/moon/src/cli/runtime.rs) 将内部错误映射为 -1。POSIX 观察到其低 8 位，即 255。因此问题来自固定发布器对 202 的处理，而非 VisionLeak 编译或打包失败。

## 修复范围

`tools/moon` 只把显式 `publish --dry-run` 交给 `tools/mooncakes_dry_run.py`。兼容条件同时要求：

- 固定的受影响发布器版本，且原始退出码为 255。
- 源码检查和解包后检查两次明确通过。
- 唯一的服务响应是 HTTP 202，包含“dry-run 成功、未作变更”，模块与版本与当前 `moon.mod` 完全一致。
- 只有预期的末尾通用失败，没有其他错误、超时或中断。

不符合条件时保留失败状态。普通构建、测试、正式发布仍走原始命令。没有修改官方二进制或编译器锁；直接调用 `.toolchain/bin/moon` 仍有上游缺陷。脚本使用 Python 标准库，与现有工具链引导和发布工具一致。

凭据可通过 `VISIONLEAK_MOONCAKES_HOME` 指向负责人已有的工具链目录；脚本不读取或复制凭据。示例：

```sh
VISIONLEAK_MOONCAKES_HOME="/path/to/existing/moon/home" ./tools/moon publish --dry-run --frozen
```

该环境变量仅供此 dry-run 入口使用。需要正常本地登录时可省略。

## 复验

真实 Mooncakes 再次返回 202，确认 `cjyhjy/visionleak@0.4.0` dry-run 成功且未作变更。项目入口退出码 **0**；日志透明注明 `upstream exit 255, effective exit 0`。见 `logs/mooncakes-fixed-live-dry-run.log` 和 `mooncakes-exit-fix.json`。

`tests/mooncakes-dry-run.py` 验证当前模块成功条件，以及鉴权/服务器错误、缺失或模糊响应、错误模块或版本、未完成检查、额外错误、中断退出、正式发布与未知发布器版本等拒绝情况；已加入 `npm run verify:ci`。完整回归通过，记录在 `mooncakes-fix-ci.json`。首次沙箱内回归因已有 HTTP 测试无法监听回环端口（EPERM）失败；随后在获准的沙箱外环境完整通过，失败日志保留。

核心编译产物不变，MoonBit 仍是本地统计中字节数最多的语言，详见 `languages-mooncakes-fix.json`。本次未启动浏览器。正式 0.5.0 包仍需按计划验收后重新 dry-run。
