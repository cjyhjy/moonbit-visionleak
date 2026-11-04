# 0.8.0：可选 ORB 几何候选

0.8.0 在已验收的 0.7.1 代次标记检索上增加默认关闭的 `--include-orb`。MoonBit 仍负责原有精确/感知/局部检索、参数限制、报告身份和复核合同；可选 Python/OpenCV 子进程提取 ORB 特征并验证几何关系。这是实际 CLI/报告/工作台集成，算法仍为实验性候选，不构成同图或泄漏判定。

## 安装与运行

默认审计只需现有 Node/Sharp 和编译产物。启用 ORB 前单独安装固定依赖，支持本轮验证的 macOS/Linux：

```sh
python3.13 -m venv .venv-orb
.venv-orb/bin/python -m pip install -r requirements-orb.txt
export VISIONLEAK_ORB_PYTHON="$PWD/.venv-orb/bin/python"
node tools/cli.mjs audit --root DATASET --out OUTPUT --include-orb
node tools/server.mjs --report OUTPUT/report.json --port 4173
```

`VISIONLEAK_ORB_PYTHON` 是解释器路径，不接受 shell 命令；没有自动下载或隐式安装。缺解释器、依赖版本不符、worker 异常、无法监督内存都会保留先前的 Core 证据并标记 ORB 未完成。Mooncakes 包提供纯 MoonBit Core 和报告校验，**不包含 Python worker**；直接向 `audit_json` 传 `includeOrb:true` 会返回 `HostFeatureRequired`，避免静默跳过。完整功能使用源代码/Node 运行包。

## 证据合同

`tools/orb-profile.json` 固定 `vl-orb-geometry-v1`：800 特征、Hamming ≤48、0.75 ratio、双向最近邻、最多 1000 次 RANSAC、至少 8 内点且比例 ≥0.5、查询覆盖跨度每轴 ≥0.15、尺度 0.15..5、投影角点落在参照图 ±10% 边界内。参数沿用冻结研究候选，不新增阈值调参。

先按产品 EXIF/sRGB 规则解码和采样，再与 `vl-rgb-v1` 一样做白底 alpha 合成和整数灰度转换。每张图记录实际采样尺寸、灰度和特征摘要；profile、worker 摘要及实际 Python/OpenCV/NumPy 版本绑定到 auditId。ORB 特征每次重算；原有指纹缓存不会复用旧 ORB 特征。二次读取必须与 Core 记录的文件字节摘要一致，否则 ORB 标记输入变化。

先保留 Core 已输出的精确/全图/固定窗口证据，再按输入顺序枚举剩余跨集合对；没有全图相似度粗筛。先以面积较小的采样图为查询，无命中时检查另一方向。已有配对不替换、不升级，确定性分组不合并 ORB 边。新增证据类型 `orb-candidate`，`distance:null`；`matchOrb` 记录参照/查询 ID、采样尺寸、部分仿射矩阵、投影角点、内点数量及前 32 个坐标，并绑定完整坐标摘要。内点数和比例不是概率，不能与 dHash 距离混算。

工作台可筛选 ORB、显示几何投影及采样内点、标记和撤销复核，离线 HTML/复核 JSON/建议 CSV 保留该证据等级。`verify` 继续只重算确定性证据，并明确计入 `skippedCandidates`；复核 ORB 计算应对未改变的源文件及相同配置重新运行审计。auditId 只是内容一致性摘要，不是可信来源签名。

## 预算与中断

| 参数 | 默认 | 硬参数上限 |
| --- | ---: | ---: |
| `maxOrbImages` | 256 | 512 |
| `maxOrbPixels` | 1048576 | 4194304 |
| `maxOrbTotalPixels` | 33554432 | 134217728 |
| `maxOrbComparisons` | 100000000 | 2000000000 |
| `maxOrbPairChecks` | 10000 | 100000 |
| `maxOrbCandidates` | 200 | 1000 |
| `maxOrbMilliseconds` | 60000 | 300000 |
| `maxOrbMemoryMiB` | 256 | 512 |

CLI 参数名使用连字符，如 `--max-orb-comparisons 2000000000`。每方向在进入 OpenCV 前预扣 `2 × nOriginal × nQuery` 次描述子比较，最少特征不足 8 时无需距离计算。RANSAC 迭代另有固定上限。输出还受共享 `maxPairs` 限制，精确证据先占用容量。预算为零可以有意跳过对应工作，结果明确不完整。

worker 从启动即设置截止时间，超时、取消或超内存时终止子进程；API 接受 `runAudit({...,signal})`，ORB 阶段的 SIGINT/SIGTERM 也会保留已完成证据。RSS 每 100 ms 尝试采样，探针最迟 5 s 失败即停止；这是有监督的内存护栏，**不是 OS 级硬内存隔离或精确峰值**。主进程解码受原有源像素/文件上限约束，正在执行的一次解码需返回后才能结束整个调用；worker 截止时间不等于所有 I/O 的严格完成期限。

`phases.orb` 单独记录特征数、像素数、方向检查、描述子工作量、完整输入前缀和停止原因。`stats.comparisons` 仍只统计原有 Core 工作，不与 ORB 描述子比较混加。整体 `processedImages` 取所有启用阶段的最小完成前缀；ORB 中断不抹去独立的 `coverage.deterministicInputComplete`。退出码继续为 fatal 1 > fail-on 命中 3 > 不完整 2 > 完整 0。不能把默认小预算得到的零候选当成无泄漏。

## 验收范围

已知数据回归包含 24 个开发来源/144 查询和此前 12 个保留来源/72 查询，所有来源都已用过。为遵守 20 亿工作上限，每次新审计取 24 个查询并包含该分区的**全部**原图；覆盖全部 4320 个原图—查询关系，不声称增量审计或同一大规模运行。对照冻结结果检查命中、灰度摘要、同方向内点/仿射见证，并保留漏检和负例。具体验收、性能环境、源码摘要及当前发布状态见 `reports/integration-0.8.0/`。

自然污染、真人复核耗时和未实测平台/规模仍未验证。本次用户确认暂无指定真实数据集和参与者，工程验收不代替这些验证。
