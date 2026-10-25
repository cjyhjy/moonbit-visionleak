// Explicit before/after check; timing is observational and is not a test gate.
// Usage: node tests/core-performance.mjs [baseline-module] [candidate-module]
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {cpus, platform, arch} from 'node:os';
import {performance} from 'node:perf_hooks';
import {resolve, relative} from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const baselinePath=resolve(root,process.argv[2] || 'research/baselines/visionleak-0.1.0.mjs');
const candidatePath=resolve(root,process.argv[3] || 'dist/visionleak.js');
const baseline=await import(pathToFileURL(baselinePath));
const candidate=await import(pathToFileURL(candidatePath));
const digest=s=>createHash('sha256').update(String(s)).digest('hex');
let seed=2463534242;
function random(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;}
const hashes=Array.from({length:1000},()=>Array.from({length:64},()=>random()&1).join(''));
const images=hashes.map((hash,i)=>({id:`image-${i}`,split:['train','test','validation'][i%3],byteDigest:digest(`b${i}`),pixelDigest:digest(`p${i}`),dhash:hash,contrast:180}));
const dense=images.map(x=>({...x,dhash:'0'.repeat(64)}));
const exact=images.slice(0,60).map((x,i)=>({...x,byteDigest:digest(`b${i%4}`),pixelDigest:digest(`p${i%7}`)}));

let compatibilityCases=0;
// Check full serialized reports, including traversal order, partial prefixes,
// exact groups, budget reasons, and every statistic.
for(const fixture of [images.slice(0,60),dense.slice(0,60),exact]) {
  for(const threshold of [0,1,6,32,64]) {
    for(const maxComparisons of [0,1,2,10,100,1000000]) {
      for(const maxPairs of [0,1,7,10000]) {
        const source=JSON.stringify({images:fixture,options:{threshold,maxComparisons,maxPairs}});
        assert.equal(candidate.audit_json(source),baseline.audit_json(source));
        compatibilityCases++;
      }
    }
  }
}
const scenarios=[
  {name:'index-1000-random-threshold6',images,options:{threshold:6,maxComparisons:1000000}},
  {name:'dense-1000-pair-budget100',images:dense,options:{maxPairs:100,maxComparisons:1000000}},
];
const median=values=>{const s=[...values].sort((a,b)=>a-b);return (s[(s.length-1)>>1]+s[s.length>>1])/2;};
const results=[];
for(const scenario of scenarios) {
  const input={images:scenario.images,options:scenario.options};
  const run=engine=>JSON.parse(engine.audit_json(JSON.stringify(input)));
  for(let warmup=0;warmup<3;warmup++) {run(baseline);run(candidate);}
  const elapsed={baseline:[],candidate:[]};
  const outcomes={};
  for(let iteration=0;iteration<10;iteration++) {
    const order=iteration%2===0?['baseline','candidate']:['candidate','baseline'];
    for(const name of order) {
      const start=performance.now();
      outcomes[name]=run(name==='baseline'?baseline:candidate);
      elapsed[name].push(performance.now()-start);
    }
    assert.deepEqual(outcomes.candidate,outcomes.baseline);
  }
  const baselineMedianMs=median(elapsed.baseline);
  const candidateMedianMs=median(elapsed.candidate);
  results.push({name:scenario.name,images:scenario.images.length,inputSha256:digest(JSON.stringify(input)),elapsedMs:elapsed,baselineMedianMs,candidateMedianMs,speedup:baselineMedianMs/candidateMedianMs,outcome:{complete:outcomes.candidate.complete,stats:outcomes.candidate.stats}});
}
const moduleInfo=path=>({path:relative(root,path),sha256:createHash('sha256').update(readFileSync(path)).digest('hex')});
console.log(JSON.stringify({schemaVersion:'visionleak-core-comparison-v1',createdAt:new Date().toISOString(),environment:{node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0]?.model},baseline:moduleInfo(baselinePath),candidate:moduleInfo(candidatePath),compatibilityCases,method:'Same deterministic seed and 1000-fingerprint workloads as tools/benchmark.mjs. Three warmups per engine then ten paired samples with alternating engine order, in one process. Timings include JSON stringify/parse. Full serialized reports also match in 360 separate threshold/budget cases. Synthetic fingerprints, local timing observations only; no general speed or memory claim.',results},null,2));
