// Reproducible, explicitly scripted review using a known CC0 photo.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {runAudit} from './cli.mjs';
import {sha256} from './runtime.mjs';
import {exportHTML,exportFixes,verifyFiles} from './report-tools.mjs';
import {pairKey,validateReport} from '../demo/review-validation.mjs';

const out=resolve(process.argv[2] || 'output/orb-walkthrough');await mkdir(out);
const root=join(out,'data');for(const split of ['train','test','validation'])await mkdir(join(root,split),{recursive:true});
const source=await readFile(new URL('../research/followup-quality/holdout/originals/170072252.png',import.meta.url));
const files={'train/170072252-original.png':source,'validation/exact-copy.png':source,
  'test/170072252-small-png.png':await sharp(source).extract({left:14,top:34,width:146,height:168}).png().toBuffer()};
for(const [name,bytes] of Object.entries(files))await writeFile(join(root,name),bytes);
const before=Object.fromEntries(Object.entries(files).map(([name,bytes])=>[name,sha256(bytes)]));
const {report}=await runAudit({root,out:join(out,'audit'),options:{includeOrb:true,threshold:0}});
assert.equal(report.complete,true);validateReport(report);
assert.equal(report.pairs.filter(p=>p.evidence==='orb-candidate').length,2);
const review={schemaVersion:'visionleak-review-v1',auditId:report.auditId,reviews:report.pairs.filter(p=>p.evidence==='orb-candidate').map(p=>({left:p.left,right:p.right,pairKey:pairKey(p.left,p.right),decision:'confirmed',note:'SCRIPTED functional test: generated crop; not a human-review study',updatedAt:new Date().toISOString()}))};
const reportPath=join(out,'audit/report.json'),reviewPath=join(out,'scripted-review.json');
await writeFile(reviewPath,JSON.stringify(review,null,2)+'\n');
await exportHTML({report:reportPath,out:join(out,'evidence.html'),review:reviewPath});
await exportFixes({report:reportPath,out:join(out,'suggestions.csv'),review:reviewPath});
const verification=await verifyFiles({report:reportPath,root});assert.equal(verification.exitCode,0);
assert.equal(verification.counts.skippedCandidates,2);
for(const [name,digest] of Object.entries(before))assert.equal(sha256(await readFile(join(root,name))),digest);
const receipt={status:'passed',schemaVersion:'visionleak-orb-walkthrough-v1',auditId:report.auditId,sourceDatasetUnchanged:true,inputDigests:before,
  pairs:report.pairs.length,orbCandidates:2,verification,scope:'Generated crop of previously used CC0 source 170072252. Scripted review only, verify recomputes exact evidence and explicitly skips ORB candidates.'};
await writeFile(join(out,'walkthrough.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:'passed',out,auditId:report.auditId}));
