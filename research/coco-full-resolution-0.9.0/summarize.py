"""Summarize only final post-fix complete queue receipts across all frozen sizes."""
from pathlib import Path
import hashlib
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
rows = []
source_digests = set()
for count in (100, 1000, 5000):
    directory = ROOT / f'reports/plan-0.9.0/coco-full-resolution-capacity-{count}'
    summary_raw = (directory / 'summary.json').read_bytes()
    summary = json.loads(summary_raw)
    check = json.loads((directory / 'independent-report-verification.json').read_bytes())
    assert summary['status'] == check['status'] == 'passed'
    source_digests.add(check['sourceDigest'])
    cache = ROOT / f'.cache/coco-full-resolution-production-{count}-coco-full-resolution-capacity-{count}/cache-main'
    allocated_cache_bytes = sum(f.stat().st_blocks * 512 for f in cache.rglob('*') if f.is_file())
    cold = [r for r in summary['results'] if r['mode'] == 'retrieval-cold']
    resume = [r for r in summary['results'] if r['mode'] == 'retrieval-resume-new-cache']
    warm = next(r for r in summary['results'] if r['mode'] == 'retrieval-warm')
    default = next(r for r in summary['results'] if r['mode'] == 'default-Core')
    phase = cold[-1]['result']['phases']['orb']
    finished = [r for r in summary['results'] if r.get('result')]
    rows.append({'images': count, 'defaultMilliseconds': default['externalWallMilliseconds'],
                 'retrievalColdCalls': len(cold), 'retrievalColdTotalMilliseconds': sum(r['externalWallMilliseconds'] for r in cold),
                 'warmMilliseconds': warm['externalWallMilliseconds'],
                 'interruptedRecoveryCallsIncludingKill': len(resume),
                 'interruptedRecoveryTotalMilliseconds': sum(r['externalWallMilliseconds'] for r in resume),
                 'eligiblePairs': phase['eligibleInputPairs'], 'selectedPairs': phase['retrieval']['selectedPairs'],
                 'verifiedPairs': phase['processedPairs'], 'queueComplete': phase['candidateQueueComplete'],
                 'exhaustiveComplete': phase['exhaustivePairsComplete'], 'overallComplete': cold[-1]['result']['complete'],
                 'actualColdDirectionChecks': sum(r['result']['timing']['orb']['executedPairChecks'] for r in cold),
                 'logicalFinalDirectionChecks': phase['pairChecks'],
                 'actualColdPostingVisits': sum(r['result']['timing']['orb'].get('retrieval', {}).get('executedVisits', 0) for r in cold),
                 'logicalFinalPostingVisits': phase['retrieval']['postingVisits'],
                 'descriptors': phase['retrieval']['descriptors'],
                 'warmFeatureCacheHits': warm['result']['timing']['orb']['featureCacheHits'],
                 'coldFeatureStageMs': sum(r['result']['timing']['orb']['featureStageMs'] for r in cold),
                 'coldFeatureWorkerRequestMs': sum(r['result']['timing']['orb']['featureWorkerRequestMs'] for r in cold),
                 'coldActualFeatureExtractions': sum(r['result']['timing']['orb']['executedFeatureExtractions'] for r in cold),
                 'coldGeometryStageMs': sum(r['result']['timing']['orb']['geometryStageMs'] for r in cold),
                 'coldGeometryWorkerRequestMs': sum(r['result']['timing']['orb']['geometryWorkerRequestMs'] for r in cold),
                 'warmFeatureStageMs': warm['result']['timing']['orb']['featureStageMs'],
                 'warmFeatureWorkerRequestMs': warm['result']['timing']['orb']['featureWorkerRequestMs'],
                 'warmGeometryWorkerRequestMs': warm['result']['timing']['orb']['geometryWorkerRequestMs'],
                 'finalCacheFileBytes': warm['cacheFileBytes'],
                 'finalCacheAllocatedFileBytes': allocated_cache_bytes,
                 'peakHostRssBytesAcrossSeparateCalls': max(r['result']['hostPeakRssBytes'] for r in finished),
                 'peakOrbChildSampledRssBytes': max(r['result'].get('timing', {}).get('orb', {}).get('workerPeakRssBytes', 0) for r in finished),
                 'peakIndexChildSampledRssBytes': max(r['result'].get('timing', {}).get('orb', {}).get('retrieval', {}).get('workerPeakRssBytes', 0) for r in finished),
                 'finalAuditId': cold[-1]['result']['auditId'], 'summarySha256': hashlib.sha256(summary_raw).hexdigest()})
assert len(source_digests) == 1
result = {'status': 'passed', 'sourceDigest': source_digests.pop(), 'rows': rows,
          'summarizerSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
          'scope': 'Single exploratory run per declared cohort/mode on full original-resolution Core and ORB with explicit finite total-pixel budgets. Cold/resume sums include repeated full host setup. No statistical speedup or accuracy guarantee. Child RSS sampled100ms separately; host OS high-water; no simultaneous peak sum or hard host guard. Cache bytes include all cache namespaces and lock files, not just ORB quota payload.'}
out = ROOT / 'reports/plan-0.9.0/coco-full-resolution-capacity-summary.json'
with out.open('x') as stream:
    stream.write(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
