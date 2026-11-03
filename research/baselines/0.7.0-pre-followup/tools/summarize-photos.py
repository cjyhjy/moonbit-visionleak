#!/usr/bin/env python3
"""Summarize source-separated natural-photo runs without conflating evidence."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    directory = ROOT/'reports/photos-v1'
    partitions = {}
    for name in ['development','holdout']:
        path=directory/f'current-{name}/evaluation.json'
        record=json.loads(path.read_text())
        assert record['status']=='passed' and len(record['oracle']['checks'])==50
        partitions[name]={'evaluationSha256':hashlib.sha256(path.read_bytes()).hexdigest(),
                          'sources':record['sources'],'images':record['images'],'modes':{}}
        for mode,data in record['modes'].items():
            assert data['scores']['exactEvidenceTierMismatches']==[]
            partitions[name]['modes'][mode]={k:data[k] for k in ['scores','anchorRetrieval','stats','wallSeconds','medianWallSeconds','auditId']}
    combined={}
    for mode in ['default','mirrors','orientations']:
        summed={k:sum(p['modes'][mode]['scores']['nearOnly'][k] for p in partitions.values()) for k in ['tp','fp','fn','tn']}
        summed['precision']=summed['tp']/(summed['tp']+summed['fp']) if summed['tp']+summed['fp'] else None
        summed['recall']=summed['tp']/(summed['tp']+summed['fn'])
        combined[mode]=summed
    result={'schemaVersion':'visionleak-photo-summary-v1','status':'passed','partitions':partitions,'combinedNearOnly':combined,
            'scope':'Sum of two source-disjoint 50-image CLI experiments, 10 original photographs total. All within-partition cross-split pairs are scored; cross-partition pairs are not included. Controlled same-source transformations, not natural contamination.',
            'negativePairs':sum(p['modes']['default']['scores']['nearOnly'][k] for p in partitions.values() for k in ['fp','tn']),
            'limitations':['Only ten curated sources and five held-out sources; no population precision claim.','Many correlated pairs derive from each source; pair counts are not independent sample sizes.','Crops still cause false negatives; no arbitrary rotation, local-object or semantic-leakage coverage.','Wall times are three local alternating runs including Node startup, decode, hashing and output; operation counts are deterministic, timings are not.']}
    (directory/'summary.json').write_text(json.dumps(result,indent=2)+'\n')
    rows=[]
    for part,p in partitions.items():
        for mode,d in p['modes'].items():
            n=d['scores']['nearOnly']
            rows.append(f"| {part} | {mode} | {n['tp']} | {n['fp']} | {n['fn']} | {n['recall']:.2%} | {d['stats']['comparisons']} | {d['medianWallSeconds']:.3f} |")
    text=['# 真实照片受控评测：0.4.0','','10 张来自 scikit-image 0.25.2 的 CC0 / 公有领域照片，原文件与官方 SHA-256 一致。[逐张来源与许可](../../research/photos-v1/ATTRIBUTION.md) · [来源清单](../../research/photos-v1/sources.json) · [样本缩略总览](../../research/photos-v1/contact-sheet.jpg)。',
          '', '先固定协议与来源分组，在 5 个开发来源上发现旋转漏检并确定可选直角旋转方案，再冻结检测实现并检验 5 个保留来源。原 0.3.0 报告保存在 baseline-*，改进结果在 current-*；默认和镜像模式的 pairs、groups、stats 与基线逐项相同。',
          '', '每个来源生成 10 个样本，共 100 张。两组各运行完整 CLI，分别评估组内全部跨 split 配对。合并数为两个独立实验的加总，不含跨开发/保留组的配对。train/validation/test 是故意放入同源图片的审计目录，与开发/保留来源划分是两回事。',
          '', '| 来源组 | 模式 | TP | FP | FN | Recall | 核心工作计数 | CLI 中位秒 |','|---|---|---:|---:|---:|---:|---:|---:|',*rows,
          '', f"近似任务排除了所有精确真值对；两组合计有 {result['negativePairs']} 个跨来源负例，本次三种模式均未产生误报。这不证明生产环境零误报，尤其只有 10 个来源，且同源衍生对高度相关。精确证据在每组均为 TP15 / FP0 / FN0。",
          '', '默认：无额外方向；mirrors：水平镜像；orientations：同时启用水平镜像和 90/180/270° 顺时针旋转，均使用阈值 6。旋转之后再水平镜像；最小方向距离仍是候选，不变成像素相同。',
          '', '## 改进、代价与剩余漏检','', '保留组近似 TP91→116，FN39→14；旋转原图配对 0/5→5/5；中心裁切原图配对保持 2/5。新增方向没有移除已有候选。旋转模式的剩余近似漏检均涉及中心裁切。几何方向扩展不解决局部主体或任意裁切。',
          '', '保留组核心工作计数 2,382→19,396；固定预算下可能更早 incomplete。旋转和镜像均默认关闭。不要仅因为这组召回提高就把全方向搜索当作通用默认。跨来源误报详情和所有漏检路径、来源、变换都保存在每份 evaluation.json 的 falsePositives / falseNegatives。',
          '', '## 独立核对与复现','', '全部 100 张样本在原方向、镜像及三种旋转/对应镜像上，通过独立 RGBA 变换、规范化像素和 ImageHash 对照；每次 CLI 的索引结果、距离、精确优先、方向解释及唯一性与穷举参考一致。完整图像清单和真值摘要也经过核对。',
          '', '```sh','python3 tools/fetch-photo-sources.py','# 下面的生成命令要求目标目录尚不存在，便于与随包样本逐字比较','research/.venv-oracle/bin/python tools/generate-photo-fixtures.py --out /tmp/visionleak-photos-fresh','research/.venv-oracle/bin/python tools/evaluate-photos.py --partition holdout --out output/photo-evaluation --include-orientations','node tools/cli.mjs audit --root fixtures/photos-v1/holdout --out output/photo-review --include-mirrors --include-rotations','node tools/server.mjs --report output/photo-review/report.json --port 4173','```',
          '', '这些正例是对真实照片施加已知变换后构造的同源关系，不是从生产数据集发现的自然泄漏。未使用保留组调阈值。裁切、任意角度旋转、语义泄漏、大规模照片库及跨平台效果仍需单独验证。', '']
    (directory/'summary.md').write_text('\n'.join(text))
    print(json.dumps({'status':'passed','combinedNearOnly':combined,'negativePairs':result['negativePairs']}))


if __name__=='__main__':
    main()
