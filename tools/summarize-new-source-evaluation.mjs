import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {sha256} from './runtime.mjs';
const [development,holdout,out]=process.argv.slice(2);if(!out)throw new Error('Usage: node tools/summarize-new-source-evaluation.mjs DEVELOPMENT HOLDOUT NEW_OUT');
await mkdir(out,{recursive:false});
const freezePath='research/new-source-0.9.0/freeze.json',freeze=JSON.parse(await readFile(freezePath));
for(const [name,digest] of Object.entries(freeze.implementationFiles))if(sha256(await readFile(name))!==digest)throw new Error('Frozen implementation changed: '+name);
const result={schemaVersion:'vl-new-source-final-evaluation-v1',freezeSha256:sha256(await readFile(freezePath)),selectedConfiguration:freeze.selectedConfiguration,primaryGates:freeze.primaryGates,partitions:{},scope:'Controlled file-lineage recall on 24+24 new source files. Cross-file candidates have not been independently adjudicated. Not natural contamination, human review, production integration or large-scale capacity evidence.'};
for(const [partition,root] of [['development',development],['holdout',holdout]]){
 const summary=JSON.parse(await readFile(join(root,'summary.json'))),composite=JSON.parse(await readFile(join(root,'composite-reference.json')));
 if(summary.sourceCount!==24||summary.imageCount!==168||composite.relationshipCount!==3456||composite.images.length!==168)throw new Error('Incomplete cohort');
 const lsh=JSON.parse(await readFile(partition==='development'?join(root,'lsh-grid/bits-24-tables-4.json'):join(root,'primary-lsh.json')));
 if(lsh.reportSha256!==sha256(await readFile(join(root,'composite-reference.json'))))throw new Error('Reference hash mismatch');
 if(lsh.configuration.bits!==freeze.selectedConfiguration.bits||lsh.configuration.tables!==freeze.selectedConfiguration.tables)throw new Error('Configuration mismatch');
 const primary=lsh.results.find(r=>r.k===freeze.selectedConfiguration.k);
 if(primary.referencePositivePairs!==composite.pairs.filter(p=>p.evidence==='orb-candidate').length)throw new Error('Reference positive count mismatch');
 const perVariant={};
 for(const variant of summary.protocol.transforms){
  const misses=Object.fromEntries(['core','orbUnion'].map(mode=>[mode,summary.batches.flatMap(b=>b.scores[mode].missing).filter(m=>m.variant===variant).length]));
  perVariant[variant]={queries:24,coreTp:24-misses.core,coreFn:misses.core,orbUnionTp:24-misses.orbUnion,orbUnionFn:misses.orbUnion};
 }
 const scores=summary.scores;
 for(const mode of ['core','orbUnion'])if(scores[mode].tp+scores[mode].fn!==144)throw new Error('Truth coverage mismatch');
 result.partitions[partition]={scores,perVariant,relativeRetrieval:primary,measurements:lsh.measurements,primaryGatePassed:primary.recall>=freeze.primaryGates.referenceOrbRecall&&primary.pairReduction>=freeze.primaryGates.pairReduction,missingOrbUnion:summary.batches.flatMap(b=>b.scores.orbUnion.missing),relationshipCount:3456};
 const destination=join(out,partition);await mkdir(destination);
 for(const name of ['summary.json','protocol.json','dataset.json','composite-reference.json'])await copyFile(join(root,name),join(destination,name));
 for(const batch of summary.batches){await mkdir(join(destination,`orb-${batch.batch}`));await copyFile(join(root,batch.report),join(destination,batch.report));}
 await copyFile(partition==='development'?join(root,'lsh-grid/bits-24-tables-4.json'):join(root,'primary-lsh.json'),join(destination,'primary-lsh.json'));
}
const frozen=join(out,'frozen-implementation');
for(const name of Object.keys(freeze.implementationFiles)){const destination=join(frozen,name);await mkdir(dirname(destination),{recursive:true});await copyFile(name,destination);}
await copyFile(freezePath,join(out,'freeze.json'));
result.primaryHoldoutGatePassed=result.partitions.holdout.primaryGatePassed;
result.caveats=['Primary gate uses observed recall, not a 99% population recall guarantee. Pair intervals ignore within-source dependence.','Family labels are metadata queries; semantic hard-negative labels are not independently adjudicated.','Development includes one Poly Haven cobblestone normal map; cohort is images, not exclusively natural photographs. No images removed after outcomes.','The remaining holdout ORB miss (non-woven fabric crop) is retained; retrieval did not recover a match that exhaustive geometry itself missed.','Research index caps descriptors at 200000 and samples RSS; no 5000-image production index or end-to-end acceleration result.'];
await writeFile(join(out,'summary.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({primaryHoldoutGatePassed:result.primaryHoldoutGatePassed,partitions:Object.fromEntries(Object.entries(result.partitions).map(([name,r])=>[name,{scores:r.scores,relativeRetrievalRecall:r.relativeRetrieval.recall,pairReduction:r.relativeRetrieval.pairReduction}]))}));
