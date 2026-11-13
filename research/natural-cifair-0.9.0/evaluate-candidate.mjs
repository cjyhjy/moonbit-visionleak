// Frozen default settings; independently annotated pairs only. Other pairs are unknown.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {runAudit} from '../../tools/cli.mjs';
import {sha256} from '../../tools/runtime.mjs';
import {sourceDigest} from '../../tools/source-digest.mjs';
const here=resolve('research/natural-cifair-0.9.0'), out=resolve(process.argv[2] || '');
if(!process.argv[2])throw new Error('Pass a new output directory');
const protocolRaw=await readFile(join(here,'replay-protocol-0.9.0.json')),protocol=JSON.parse(protocolRaw);
const annotationRaw=await readFile(join(here,'duplicates_cifar10.csv'));
if(sha256(annotationRaw)!==protocol.annotationSha256)throw new Error('Annotation hash mismatch');
const artifact=await readFile('dist/visionleak.js');
if(sha256(artifact)!==protocol.compiledArtifactSha256)throw new Error('Frozen Core artifact changed');
const records=JSON.parse(await readFile(join(here,'dataset.json'))).records;
const root=resolve('.cache/natural-cifair-090');
for(const record of records)if(sha256(await readFile(join(root,record.path)))!==record.sha256)throw new Error('Dataset changed');
const lines=annotationRaw.toString('utf8').trim().split(/\r?\n/),header=lines.shift().split(',');
if(header.join(',')!=='TestID,TrainID,Distance,Judgment')throw new Error('Unexpected annotation schema');
const rows=lines.map(line=>{const [test,train,distance,judgment]=line.split(',');return {test:Number(test),train:Number(train),distance:Number(distance),judgment:Number(judgment)};});
if(rows.length!==286 || rows.some(r=>![0,1,2].includes(r.judgment)))throw new Error('Unexpected annotation rows');
await mkdir(out,{recursive:false});
const started=Date.now();
await runAudit({root,out:join(out,'audit'),options:{...protocol.frozenEvaluationOptions,maxImages:1000,maxComparisons:1000000,maxExactComparisons:1000000,maxPairs:10000}});
const report=JSON.parse(await readFile(join(out,'audit/report.json')));
if(!report.complete || report.images.length!==records.length)throw new Error('Incomplete annotated gallery');
const key=(a,b)=>JSON.stringify([a,b].sort());
const found=new Map(report.pairs.map(p=>[key(p.left,p.right),p]));
const known=new Set(),results=[],counts={tp:0,fn:0,fp:0,tn:0};
for(const row of rows){
 const left=`test/${String(row.test).padStart(5,'0')}.png`,right=`train/${String(row.train).padStart(5,'0')}.png`;
 const id=key(left,right);if(known.has(id))throw new Error('Duplicate annotation');known.add(id);
 const pair=found.get(id),positive=row.judgment!==2,outcome=positive?(pair?'tp':'fn'):(pair?'fp':'tn');counts[outcome]++;
 results.push({...row,left,right,outcome,evidence:pair?.evidence??null,hammingDistance:pair?.distance??null});
}
const unknown=report.pairs.filter(p=>!known.has(key(p.left,p.right)));
const summary={schemaVersion:'vl-natural-cifair-evaluation-v1',status:'passed-execution',protocol,
 sourceDigest:sourceDigest(process.cwd()),runnerSha256:sha256(await readFile(new URL(import.meta.url))),
 protocolSha256:sha256(protocolRaw),datasetSha256:sha256(await readFile(join(here,'dataset.json'))),
 reportSha256:sha256(await readFile(join(out,'audit/report.json'))),auditId:report.auditId,images:report.images.length,
 annotatedRelationships:rows.length,counts,recall:counts.tp/(counts.tp+counts.fn),
 hardNegativeFalsePositiveRate:counts.fp/(counts.fp+counts.tn),
 annotatedCandidatePrecision:counts.tp/(counts.tp+counts.fp),
 annotatedCoverage:results.length/rows.length,returnedPairs:report.pairs.length,unlabelledReturnedPairs:unknown.length,
 elapsedMilliseconds:Date.now()-started,complete:report.complete,humanReviewTimeMeasured:false,
 limits:['Curated author-found duplicate/similar pair list, not a random corpus sample or exhaustive ground truth.',
 'Unlabelled returned pairs are not false positives; annotated candidate precision is conditional on these labels.',
 '32x32 images and default Core only; does not test photo-scale ORB, retrieval recall, or end-to-end capacity.',
 'Uses prior public human annotations; no new participant review timing.']};
await writeFile(join(out,'relationships.json'),JSON.stringify(results,null,2)+'\n',{flag:'wx'});
await writeFile(join(out,'unlabelled-candidates.json'),JSON.stringify(unknown,null,2)+'\n',{flag:'wx'});
await writeFile(join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(summary,null,2));
