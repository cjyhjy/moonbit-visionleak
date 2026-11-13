"""Bounded actual host invocations; never call incomplete/pruned coverage complete."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
protocol_raw = (HERE / 'protocol.json').read_bytes()
p = json.loads(protocol_raw)
dataset_raw = (HERE / 'dataset.json').read_bytes()
dataset = json.loads(dataset_raw)
assert dataset['protocolSha256'] == hashlib.sha256(protocol_raw).hexdigest()
count = int(sys.argv[1])
assert count in p['sizes']
evidence = Path(sys.argv[2]).resolve()
evidence.mkdir(exist_ok=False)
work = ROOT / '.cache' / ('coco-production-' + str(count) + '-' + evidence.name)
work.mkdir(exist_ok=False)
records = dataset['records'][:count]
assert len(records) == count
root = ROOT / '.cache/coco-capacity-090'
for row in records:
    assert hashlib.sha256((root / row['path']).read_bytes()).hexdigest() == row['sha256']
manifest = work / 'manifest.csv'
manifest.write_text('path,split\n' + ''.join(f"{r['path']},{r['split']}\n" for r in records))
runner_digest = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
results = []

def cache_bytes(cache):
    return sum(f.stat().st_size for f in cache.rglob('*') if f.is_file()) if cache.exists() else 0

def run(mode, attempt, cache=None, interrupt=False):
    name = f'{mode}-{attempt}'
    config_path = work / (name + '.config.json')
    receipt_path = work / (name + '.json')
    options = {} if mode == 'default-Core' else dict(p['experimentalOptions'])
    if mode == 'default-Core':
        options = {k: p['experimentalOptions'][k] for k in ('maxImages', 'maxTotalPixels', 'maxComparisons', 'maxExactComparisons', 'maxPairs')}
    audit = {'root': str(root), 'out': str(work / (name + '-audit')), 'manifest': str(manifest), 'options': options}
    if cache:
        audit['cache'] = str(cache)
    config_path.write_text(json.dumps({'audit': audit, 'receipt': str(receipt_path)}, indent=2)+'\n')
    started = time.monotonic()
    with (work / (name + '.log')).open('wb') as log:
        child = subprocess.Popen(['node', str(HERE / 'run-one.mjs'), str(config_path)], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT)
        killed = False
        if interrupt:
            # Kill actual host only after at least 32 committed ORB entries exist.
            # This avoids substituting a mocked cancellation for crash recovery.
            while child.poll() is None and time.monotonic() - started < 330:
                committed = list((cache / 'orb-v3').glob('*/*.json')) if (cache / 'orb-v3').exists() else []
                if len(committed) >= 32:
                    child.kill()
                    killed = True
                    break
                time.sleep(0.1)
        try:
            code = child.wait(timeout=max(1, 360-(time.monotonic()-started)))
        except subprocess.TimeoutExpired:
            child.kill(); child.wait()
            raise RuntimeError('External 360 second invocation watchdog expired')
    row = {'mode': mode, 'attempt': attempt, 'processExitCode': code, 'interrupted': killed,
           'externalWallMilliseconds': round((time.monotonic()-started)*1000), 'cacheFileBytes': cache_bytes(cache) if cache else 0}
    if killed:
        assert code < 0
        row['committedOrbEntriesAtKill'] = len(committed)
    else:
        if not receipt_path.exists():
            raise RuntimeError('No invocation receipt; see ' + str(work / (name + '.log')))
        row['result'] = json.loads(receipt_path.read_bytes())
        if code or row['result']['status'] != 'returned':
            raise RuntimeError('Actual invocation failed: ' + str(row))
        shutil.copyfile(receipt_path, evidence / (name + '.json'))
    results.append(row)
    (evidence / 'progress.json').write_text(json.dumps({'count': count, 'results': results}, indent=2)+'\n')
    print(json.dumps({k: v for k, v in row.items() if k != 'result'} | {'reason': row.get('result', {}).get('phases', {}).get('orb', {}).get('reason')}), flush=True)
    return row

default = run('default-Core', 0)
assert default['result']['complete'], 'Default Core did not finish finite workload'
cache = work / 'cache-main'
cold = None
for attempt in range(30):
    row = run('retrieval-cold', attempt, cache)
    phase = row['result']['phases']['orb']
    if phase.get('candidateQueueComplete'):
        cold = row
        break
    if phase.get('reason') not in ('ORB_WORK_BUDGET', 'ORB_PAIR_BUDGET', 'ORB_TIME_BUDGET', 'ORB_INDEX_VISIT_BUDGET'):
        raise RuntimeError('Non-progress stopping reason retained: ' + str(phase.get('reason')))
assert cold, 'Selected queue did not complete within 30 bounded calls'
warm = run('retrieval-warm', 0, cache)
assert warm['result']['auditId'] == cold['result']['auditId']
resume_cache = work / 'cache-resume'
crash = run('retrieval-resume-new-cache', 0, resume_cache, interrupt=True)
assert crash['interrupted'], 'Did not observe real interrupted host'
resumed = None
for attempt in range(1, 30):
    row = run('retrieval-resume-new-cache', attempt, resume_cache)
    if row['result']['phases']['orb'].get('candidateQueueComplete'):
        resumed = row
        break
assert resumed and resumed['result']['auditId'] == cold['result']['auditId']
assert any(r.get('result', {}).get('timing', {}).get('orb', {}).get('featureCacheHits', 0) > 0 for r in results if r['mode'] == 'retrieval-resume-new-cache')
for label, row in [('default', default), ('retrieval-cold-final', cold), ('retrieval-warm', warm), ('retrieval-resumed-final', resumed)]:
    name = f"{row['mode']}-{row['attempt']}"
    shutil.copyfile(work / (name + '-audit/report.json'), evidence / (label + '-report.json'))
summary = {'status': 'passed', 'count': count, 'protocolSha256': hashlib.sha256(protocol_raw).hexdigest(),
           'datasetSha256': hashlib.sha256(dataset_raw).hexdigest(), 'runnerSha256': runner_digest,
           'childRunnerSha256': hashlib.sha256((HERE / 'run-one.mjs').read_bytes()).hexdigest(),
           'results': results, 'scope': p['scopeLimits'], 'preprocessing': p['preprocessing'],
           'recoveryScope': 'Real host SIGKILL after committed feature work, feature reuse and final identity checked; not a new large-query/geometry mid-row crash stress test.'}
(evidence / 'summary.json').write_text(json.dumps(summary, indent=2)+'\n')
print(json.dumps({'status': 'passed', 'count': count, 'auditId': cold['result']['auditId']}), flush=True)
