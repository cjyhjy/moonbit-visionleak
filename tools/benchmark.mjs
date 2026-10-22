import { performance } from 'node:perf_hooks';
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { cpus, platform, arch } from 'node:os';
import { fingerprint_rgba, audit_json } from '../dist/visionleak.js';
let seed = 2463534242;
function random(){ seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0; }
const digest = s => createHash('sha256').update(String(s)).digest('hex');
const hashes = Array.from({length:1000},()=>Array.from({length:64},()=>random()&1).join(''));
const images = hashes.map((hash,i)=>({id:`image-${i}`,split:['train','test','validation'][i%3],byteDigest:digest(`b${i}`),pixelDigest:digest(`p${i}`),dhash:hash,contrast:180}));
const rgba=Buffer.from(Array.from({length:256*256*4},()=>random()%256));
const scenarios = [
  {name:'fingerprint-32x256x256', kind:'synthetic-rgba', images:32, pixels:32*256*256, encodedBytes:null, run(){let last;for(let i=0;i<32;i++)last=JSON.parse(fingerprint_rgba(256,256,rgba));return {ok:last.ok};}},
  {name:'index-1000-random-threshold6',kind:'synthetic-fingerprints',images:1000,pixels:null,encodedBytes:null,run(){const r=JSON.parse(audit_json(JSON.stringify({images,options:{threshold:6,maxComparisons:1000000}})));return {complete:r.complete,stats:r.stats};}},
  {name:'dense-1000-pair-budget100',kind:'synthetic-fingerprints',images:1000,pixels:null,encodedBytes:null,run(){const r=JSON.parse(audit_json(JSON.stringify({images:images.map(x=>({...x,dhash:'0'.repeat(64)})),options:{maxPairs:100,maxComparisons:1000000}})));return {complete:r.complete,stats:r.stats};}},
];
const results=[];
for(const scenario of scenarios){
  scenario.run();
  const elapsedMs=[];let outcome;
  for(let i=0;i<5;i++){const start=performance.now();outcome=scenario.run();elapsedMs.push(performance.now()-start);}
  const {run,...description}=scenario;
  results.push({...description,elapsedMs,medianMs:[...elapsedMs].sort((a,b)=>a-b)[2],outcome,rssAfterBytes:process.memoryUsage().rss});
}
const report={schemaVersion:'visionleak-benchmark-v1',createdAt:new Date().toISOString(),engineSha256:createHash('sha256').update(readFileSync(new URL('../dist/visionleak.js',import.meta.url))).digest('hex'),environment:{node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0]?.model},method:'One warmup, five sequential runs in one process. RSS is a post-run sample, not peak memory. JSON conversion is included. Synthetic workloads, not a large real dataset or a cross-tool speed comparison.',results};
writeFileSync(new URL('../reports/performance.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
