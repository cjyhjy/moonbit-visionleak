# 隔离 Linux 功能验收

已通过30项CI、Node83项零跳过、MoonBit JS/Wasm GC/native/native release各85项，以及真实 `doctor --include-orb`。终止容器状态为exited/exit0，收据和原始日志见collection.json、ci/verification.json、run.log、doctor-linux.json。采集器保持JSON及Linux命令路径原样，以文件SHA-256记录归档内容。

环境：独立Colima profile `visionleak090`（ARM64 VM、4CPU/4GiB），复用宿主已经安装的Rosetta运行Linux x86_64用户态。测试容器4CPU/3GiB、network=none、无宿主卷挂载；Node22.22.0、Python3.13.7、固定pip依赖，MoonBit使用锁定官方归档SHA-256。它验证Linux功能和依赖，不代表原生x86硬件、GitHub Ubuntu runner或Linux性能结论。

全新项目快照3675个文件，135750350字节，摘要在snapshot.json；镜像构建内检查生产sourceDigest等于399a2d11bd966529f0e771bb7abfce7244255bc72df5144f5039c60bafa5ccf2。当前后续源码又将ORB总像素可设置上限提高至20亿（默认不变），因此本轮是已核实的先前源码平台门槛，不冒充后续最终发布源码的Linux验收；最终包仍须复验。

基础slim镜像没有ps，先补装procps再测试，未绕过RSS监督。首次构建因快照未完成被主动中断，最终快照核对后重建。第一次收集器拒绝了未锚定的相对路径，修正到真实Linux工作目录后从同一已终止容器重新采集；没有重跑或改写CI结果。负面日志均保留。

启动时显式禁用activate、SSH agent及SSH配置改写，mount=none。已有 `uni-agent` 实例未被启停/使用；默认Docker context前后均为colima-uni-agent。验收产物采集后已停止本任务VM，磁盘保留供最终发布包复验，见vm-stop.log。原图容量计时在VM停止后进行。
