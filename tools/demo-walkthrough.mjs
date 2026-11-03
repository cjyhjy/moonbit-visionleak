#!/usr/bin/env node
// Reproducible presentation scenario. Only creates a new output tree; no source dataset editing.
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import { runAudit } from './cli.mjs';
import { workflow } from './workflow.mjs';
import { verifyFiles, exportFixes, exportHTML } from './report-tools.mjs';
import { sha256 } from './runtime.mjs';
import { pairKey } from '../demo/review-validation.mjs';

const out = resolve(process.argv[2] || 'output/walkthrough-v070');
await mkdir(dirname(out), { recursive: true });
await mkdir(out); // Deliberately refuses an existing walkthrough, even an empty one.
const root = join(out, 'dataset');
for (const split of ['train','validation','test']) await mkdir(join(root,split), { recursive:true });
const width=96,height=72;
const pixels=Buffer.from(Array.from({length:width*height*3},(_,i) => {
  const p=Math.floor(i/3),x=p%width,y=Math.floor(p/width);
  return (x*3+y*2+(i%3)*29+Math.floor(x/17)*13)%220;
}));
const original=await sharp(pixels,{raw:{width,height,channels:3}}).png({compressionLevel:6}).toBuffer();
const repack=await sharp(pixels,{raw:{width,height,channels:3}}).png({compressionLevel:0}).toBuffer();
const brighter=await sharp(pixels,{raw:{width,height,channels:3}}).modulate({brightness:1.04}).png().toBuffer();
const inputs=[['train/original.png',original],['test/byte-copy.png',original],['validation/pixel-repack.png',repack],['test/brighter.png',brighter]];
for (const [path,bytes] of inputs) await writeFile(join(root,path),bytes,{flag:'wx'});
const before=Object.fromEntries(await Promise.all(inputs.map(async ([path])=>[path,sha256(await readFile(join(root,path)))])));
const {report}=await runAudit({root,out:join(out,'audit'),failOn:'pixel'});
assert.equal(workflow({operation:'gate',report,failOn:'pixel'}).exitCode,3);
const limited=(await runAudit({root,out:join(out,'limited'),options:{maxComparisons:0}})).report;
assert.equal(limited.phases.deterministic.complete,true);assert.equal(limited.complete,false);
assert.equal(workflow({operation:'gate',report:limited,failOn:'pixel'}).exitCode,3);
const verify=await verifyFiles({root,report:join(out,'audit/report.json')});assert.equal(verify.exitCode,0);
const review={schemaVersion:'visionleak-review-v1',auditId:report.auditId,exportedAt:new Date().toISOString(),reviews:report.pairs.map(pair=>({left:pair.left,right:pair.right,pairKey:pairKey(pair.left,pair.right),decision:['byte-identical','pixel-identical'].includes(pair.evidence)?'confirmed':'unsure',note:'自动演示记录：由受控生成关系构造，用于展示导出流程；不代表真人复核。',updatedAt:new Date().toISOString()}))};
await writeFile(join(out,'scripted-review.json'),JSON.stringify(review,null,2)+'\n',{flag:'wx'});
const fixes=await exportFixes({report:join(out,'audit/report.json'),out:join(out,'suggestions.csv'),review:join(out,'scripted-review.json')});
const html=await exportHTML({report:join(out,'audit/report.json'),out:join(out,'evidence.html'),review:join(out,'scripted-review.json')});
const suggestions=workflow({operation:'fixes',report,reviews:review.reviews}).rows;
const excluded=new Set(suggestions.filter(row=>row.suggestion.startsWith('remove-from-')).map(row=>row.path));
const corrected=join(out,'corrected-copy');await mkdir(corrected);
for (const [path] of inputs) if (!excluded.has(path)) { await mkdir(dirname(join(corrected,path)),{recursive:true});await copyFile(join(root,path),join(corrected,path)); }
const afterReport=(await runAudit({root:corrected,out:join(out,'reaudit'),failOn:'pixel'})).report;
assert.equal(workflow({operation:'gate',report:afterReport,failOn:'pixel'}).exitCode,0);
const cache=join(out,'fingerprint-cache');
const cold=await runAudit({root,out:join(out,'cache-cold'),cache});
const warm=await runAudit({root,out:join(out,'cache-warm'),cache});
assert.equal(cold.report.auditId,report.auditId);assert.equal(warm.report.auditId,report.auditId);
const after=Object.fromEntries(await Promise.all(inputs.map(async ([path])=>[path,sha256(await readFile(join(root,path)))])));
assert.deepEqual(after,before);
const receipt={schemaVersion:'visionleak-walkthrough-v1',createdAt:new Date().toISOString(),status:'passed',sourceDatasetUnchanged:true,inputDigests:before,
  steps:{audit:{auditId:report.auditId,complete:report.complete,exitCode:3,pairs:report.pairs.length,phases:report.phases},limited:{complete:limited.complete,exitCode:3,phases:limited.phases},verify,review:{file:'scripted-review.json',kind:'scripted-demonstration-not-human-review'},fixes:{rows:fixes.rows,file:'suggestions.csv'},offline:{file:'evidence.html',bytes:html.bytes,truncated:html.truncated},correctedCopy:{omittedPaths:[...excluded],auditId:afterReport.auditId,complete:afterReport.complete,exitCode:0,remainingCandidates:afterReport.pairs.length},cache:{identitiesEqual:true,cold:cold.cache,warm:warm.cache}},
  open:{report:'audit/report.json',offline:'evidence.html'},scope:'Generated demonstration data and scripted review; corrected copy is constructed inside this new output tree. Production CLI only exports suggestions.'};
await writeFile(join(out,'walkthrough.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:receipt.status,out,report:join(out,'audit/report.json'),offline:join(out,'evidence.html'),receipt:join(out,'walkthrough.json')}));
