// node research/optimization/compare.mjs BASELINE_MODULE OUTPUT_JSON
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import * as candidate from '../../dist/visionleak.js';
const baseline=await import(pathToFileURL(resolve(process.argv[2])));
const rows=[];
for(const partition of ['development','holdout']) {
 const path=`reports/plan-0.5.0/crops-${partition}/crops-audit.json`;
 const report=JSON.parse(readFileSync(path));
 for(const threshold of [0,1,3,4,6,7,8]) {
  const input=JSON.stringify({images:report.images,options:{...report.options,threshold,maxComparisons:10000000,maxPairs:100000}});
  const old=JSON.parse(baseline.audit_json(input));const current=JSON.parse(candidate.audit_json(input));
  assert.equal(old.complete,true);assert.equal(current.complete,true);
  assert.deepEqual(current.pairs,old.pairs);assert.deepEqual(current.groups,old.groups);
  rows.push({partition,threshold,pairs:current.pairs.length,orderedPairsAndWitnessesEqual:true,before:old.stats,after:current.stats});
 }
}
const result={scope:'Previously viewed photo partitions are regression data, not a new holdout. Full ordered pairs, local witnesses, distances and exact groups compared at seven thresholds.',baselineSha256:createHash('sha256').update(readFileSync(process.argv[2])).digest('hex'),candidateSha256:createHash('sha256').update(readFileSync('dist/visionleak.js')).digest('hex'),rows};
writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');console.log(`Passed ${rows.length} ordered baseline comparisons`);
