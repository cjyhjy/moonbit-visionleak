// Combine complete gallery/query batches into an explicitly composite reference.
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {verifyReportIdentity} from '../demo/report-identity.mjs';
import {sha256} from './runtime.mjs';
const [root,out]=process.argv.slice(2);if(!out)throw new Error('Usage: node tools/compose-orb-reference.mjs EVALUATION NEW_OUT');
const dataset=JSON.parse(await readFile(join(root,'dataset.json'))),summary=JSON.parse(await readFile(join(root,'summary.json')));
const images=new Map(),pairs=new Map(),relations=new Set(),receipts=[];
const key=(a,b)=>JSON.stringify([a,b].sort());let profile;
for(const batch of summary.batches){
 const bytes=await readFile(join(root,batch.report)),report=JSON.parse(bytes);await verifyReportIdentity(report);
 if(!report.complete||!report.phases.orb.complete||report.phases.orb.processedPairs!==report.phases.orb.eligibleInputPairs)throw new Error('Incomplete batch');
 if(profile && JSON.stringify(profile)!==JSON.stringify(report.orbProfile))throw new Error('Profile changed between batches');profile=report.orbProfile;
 for(const image of report.images){
  if(images.has(image.id)&&JSON.stringify(images.get(image.id))!==JSON.stringify(image))throw new Error('Inconsistent image record between batches');
  images.set(image.id,image);
 }
 for(const pair of report.pairs){const k=key(pair.left,pair.right);if(pairs.has(k)&&JSON.stringify(pairs.get(k))!==JSON.stringify(pair))throw new Error('Conflicting pair');pairs.set(k,pair);}
 for(const a of report.images)for(const b of report.images)if(a.split!==b.split)relations.add(key(a.path,b.path));
 receipts.push({report:batch.report,auditId:report.auditId,sha256:sha256(bytes)});
}
const gallery=dataset.records.filter(r=>r.role==='gallery'),queries=dataset.records.filter(r=>r.role==='query');
const expected=new Set();for(const a of gallery)for(const b of queries)expected.add(key(a.path,b.path));
if(expected.size!==relations.size||[...expected].some(k=>!relations.has(k))||images.size!==dataset.records.length)throw new Error('Composite relationship coverage mismatch');
await writeFile(out,JSON.stringify({schemaVersion:'vl-composite-orb-reference-v1',scope:'Composite of complete all-gallery query batches, with exactly all gallery-query relationships. This is not a single product audit report or a capacity result.',relationshipCount:relations.size,images:[...images.values()],pairs:[...pairs.values()],orbProfile:profile,phases:{orb:{complete:true}},receipts},null,2)+'\n',{flag:'wx'});
