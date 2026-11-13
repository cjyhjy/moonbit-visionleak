# 0.9.0 新来源评测

元数据先行选择48个先前未使用的文件，24开发/24保留。family-protocol.json记录24个主题家族，每家族2张；exclusions.json绑定历史清单与排除ID/摘要。selection.json在查看新图效果之前封存。元数据主题不自动构成人工审定的难负例。

prepare.py metadata获取并封存元数据；development下载开发源，记录原始和规范化摘要；holdout仅在freeze.json绑定选择和全部实现后允许下载。下载失败可从逐源收据恢复。不要覆盖已有selection.json或将开发结果当成保留结果。

受控评测脚本为tools/evaluate-new-sources.mjs：所有24个原图都在每批审计中，144查询按24个一批运行。源文件同源关系有生成真值，不同文件的语义/自然污染关系仍未裁决。Core、Core+穷举ORB和描述子检索分开记录。

retrieval-protocol.json在新来源结果之前声明了描述子分桶的开发搜索范围和准入门槛。开发网格允许选配置；保留集下载之前须冻结所选配置及实现。即使控制变换指标好，也不代替自然污染或真人复核耗时。
