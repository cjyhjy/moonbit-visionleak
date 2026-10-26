"""Replay frozen audit inputs and independently validate local witnesses and metrics."""
import hashlib,json,pathlib,subprocess,unittest
from metric_reference import score,compare
ROOT=pathlib.Path(__file__).resolve().parents[1]
class CropReference(unittest.TestCase):
 def test_licensed_sources_and_frozen_partition(self):
  sources=json.loads((ROOT/'research/photos-v2/sources.json').read_text())['images'];self.assertEqual(len(sources),32)
  parts={p:{r['scene'] for r in sources if r['partition']==p} for p in ['development','holdout']};self.assertFalse(parts['development']&parts['holdout'])
  for row in sources:
   self.assertEqual(row['license'],'CC0-1.0');self.assertEqual(hashlib.sha256((ROOT/row['storedFile']).read_bytes()).hexdigest(),row['sha256'])
  frozen=json.loads((ROOT/'research/photos-v2/freeze-0.5.0.json').read_text())
  for name,value in frozen['implementationFiles'].items():self.assertEqual(hashlib.sha256((ROOT/'research/baselines/0.5.0'/name).read_bytes()).hexdigest(),value,name)
 def test_current_core_replay_and_independent_scores(self):
  script="import{readFileSync}from'node:fs';import{audit_json}from'./dist/visionleak.js';const r=JSON.parse(readFileSync(0,'utf8'));console.log(audit_json(JSON.stringify({images:r.images,options:r.options})));"
  for part in ['development','holdout']:
   folder=ROOT/'reports/plan-0.5.0'/('crops-'+part);truth=json.loads((folder/'ground-truth.json').read_text());evaluation=json.loads((folder/'evaluation.json').read_text())
   for mode in ['default','crops']:
    report=json.loads((folder/(mode+'-audit.json')).read_text());compare(evaluation['scores'][mode],score(truth,report['pairs']))
    run=subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,input=json.dumps(report),text=True,capture_output=True,check=True);actual=json.loads(run.stdout)
    self.assertEqual(actual['pairs'],report['pairs']);self.assertEqual(actual['groups'],report['groups']);self.assertEqual(actual['complete'],report['complete'])
    # Traversal pruning changes resource accounting, not evidence. Preserve the
    # frozen implementation above; compare semantic stats and enforce bounds.
    for k in ['inputImages','processedImages','emittedPairs','indexNodes','reason']:
     self.assertEqual(actual['stats'][k],report['stats'][k])
    stats=actual['stats'];self.assertEqual(stats['comparisons'],stats['distanceEvaluations']+stats['pairChecks'])
    self.assertLessEqual(stats['comparisons'],report['options']['maxComparisons'])
    self.assertLessEqual(stats.get('indexOperations',0),report['options']['maxComparisons']*16)
    images={r['id']:r for r in report['images']}
    for pair in report['pairs']:
     if pair['evidence']!='local-candidate':continue
     a,b=images[pair['left']],images[pair['right']];w=pair['matchLocal'];i,j=w['leftWindow'],w['rightWindow']
     self.assertGreaterEqual(a['localContrasts'][i],16);self.assertGreaterEqual(b['localContrasts'][j],16)
     self.assertEqual(sum(x!=y for x,y in zip(a['localHashes'][i],b['localHashes'][j])),pair['distance'])
if __name__=='__main__':unittest.main()
