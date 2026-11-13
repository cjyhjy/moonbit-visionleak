// Known former holdout regression after overflow fix; never another blind test.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {runAudit} from '../../tools/cli.mjs';
import {sha256} from '../../tools/runtime.mjs';
import {sourceDigest} from '../../tools/source-digest.mjs';
const out=resolve(process.argv[2]||'');if(!process.argv[2])throw new Error('New evidence directory required');await mkdir(out,{recursive:false});
const previousRaw=await readFile('reports/plan-0.9.0/product-retrieval/final-cold.json'),previous=JSON.parse(previousRaw);
const root=resolve('.cache/orb-090-fresh-holdout/data'),work=resolve('.cache/orb-090-cap-regression');await mkdir(work,{recursive:false});
const records=[];
for(const mode of ['cold','warm']){
 const {report}=await runAudit({root,out:join(work,mode),cache:join(work,'cache'),options:previous.options});
 const actual=report.pairs.filter(p=>p.evidence==='orb-candidate'),expected=previous.pairs.filter(p=>p.evidence==='orb-candidate');
 assert.equal(actual.length,71);assert.deepEqual(actual,expected);
 const before=new Map(previous.images.map(i=>[i.id,i]));
 for(const image of report.images){assert.equal(image.byteDigest,before.get(image.id).byteDigest);assert.deepEqual(image.orb,before.get(image.id).orb);}
 assert.equal(report.phases.orb.candidateQueueComplete,true);
 records.push({mode,auditId:report.auditId,orbPairs:actual.length,allEvidencePairs:report.pairs.length,timing:report.timing.orb});
 await writeFile(join(out,mode+'-report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
}
assert.equal(records[0].auditId,records[1].auditId);
const receipt={status:'passed',sourceDigest:sourceDigest(process.cwd()),scriptSha256:sha256(await readFile(new URL(import.meta.url))),previousReportSha256:sha256(previousRaw),records,scope:'All71 same-platform former-holdout ORB witnesses and all168 image feature digests unchanged after overflow cap fix; known-data regression, not new accuracy evidence.'};
await writeFile(join(out,'summary.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
