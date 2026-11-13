import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm,chmod,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import sharp from 'sharp';
import {execFile} from 'node:child_process';
import {runAudit} from '../tools/cli.mjs';
import {orbGray,OrbWorker} from '../tools/orb.mjs';
import {workflow} from '../tools/workflow.mjs';
import {exportHTML,exportFixes,verifyFiles} from '../tools/report-tools.mjs';
import {validateReport,pairKey,filterPairs} from '../demo/review-validation.mjs';
import {reportIdentity,verifyReportIdentity} from '../demo/report-identity.mjs';

const python=process.env.VISIONLEAK_ORB_PYTHON;
const enabled={skip:!python && 'Set VISIONLEAK_ORB_PYTHON to the pinned optional environment'};
async function fixture(t) {
  const temp=await mkdtemp(join(tmpdir(),'visionleak-orb-'));t.after(()=>rm(temp,{recursive:true,force:true}));
  const root=join(temp,'data');for(const split of ['train','test','validation'])await mkdir(join(root,split),{recursive:true});
  const original=await readFile(new URL('../research/followup-quality/holdout/originals/170072252.png',import.meta.url));
  const crop=await sharp(original).extract({left:14,top:34,width:146,height:168}).png().toBuffer();
  await writeFile(join(root,'train/170072252-original.png'),original);
  await writeFile(join(root,'validation/exact-copy.png'),original);
  await writeFile(join(root,'test/170072252-small-png.png'),crop);
  let sequence=0;
  return {temp,root,original,run:options=>runAudit({root,out:join(temp,'audit-'+sequence++),options:{threshold:0,...options}})};
}
function env(t,key,value){const old=process.env[key];process.env[key]=value;t.after(()=>{if(old===undefined)delete process.env[key];else process.env[key]=old;});}

test('ORB grayscale uses product white-alpha composition and integer BT.601',()=>{
  assert.deepEqual([...orbGray({width:3,height:1,rgba:Buffer.from([0,0,0,0,255,0,0,255,0,0,255,128])})],[255,76,142]);
});

test('actual OpenCV feature overshoot is capped before worker hashing and cache transport',enabled,async t=>{
 const code="import cv2,numpy as np; y,x=np.indices((384,384)); a=(((x%8)*73+(y%8)*151+(x%8)*(y%8)*7)%256).astype(np.uint8); d=cv2.ORB_create(nfeatures=800,edgeThreshold=15,patchSize=31,fastThreshold=20); print(len(d.detectAndCompute(a,None)[0]))";
 const count=await new Promise((resolve,reject)=>execFile(python,['-I','-c',code],{timeout:10000},(error,stdout)=>error?reject(error):resolve(Number(stdout.trim()))));
 assert.ok(count>800,'Pinned real detector must exercise overshoot');
 const gray=Buffer.alloc(384*384);for(let y=0;y<384;y++)for(let x=0;x<384;x++)gray[y*384+x]=((x%8)*73+(y%8)*151+(x%8)*(y%8)*7)%256;
 const worker=new OrbWorker({python});t.after(()=>worker.close());await worker.request({op:'hello'});
 const request={op:'extract',id:'ties',width:384,height:384,gray:gray.toString('base64')};
 const first=await worker.request(request);assert.equal(first.keypoints,800);assert.equal(first.payload.points.length,800);assert.equal(Buffer.from(first.payload.descriptors,'base64').length,800*32);
 await worker.request({op:'clear'});const again=await worker.request(request);assert.deepEqual(again,first);
 await worker.request({op:'clear'});assert.equal((await worker.request({op:'load',id:'ties',payload:first.payload,clear:true})).ok,true);
});

test('default audit needs no ORB dependency; missing opt-in worker preserves exact evidence',async t=>{
  const f=await fixture(t);env(t,'VISIONLEAK_ORB_PYTHON',join(f.temp,'missing-python'));
  const normal=(await f.run({})).report;
  assert.equal(normal.complete,true);assert.equal(normal.orbProfile,undefined);assert.equal(normal.phases.orb,undefined);
  const partial=(await f.run({includeOrb:true})).report;
  assert.deepEqual(partial.pairs,normal.pairs);assert.equal(partial.complete,false);
  assert.equal(partial.phases.orb.reason,'ORB_DEPENDENCY');assert.equal(partial.stats.processedImages,0);
  assert.equal(partial.coverage.deterministicInputComplete,true);
  assert.equal(workflow({operation:'gate',report:partial,failOn:'exact'}).exitCode,3);
  assert.equal(workflow({operation:'gate',report:partial,failOn:''}).exitCode,2);
  await verifyReportIdentity(partial);
});

test('worker deadline and cancellation kill an unresponsive process; memory guard is fail-closed',async t=>{
  const temp=await mkdtemp(join(tmpdir(),'visionleak-orb-fault-'));t.after(()=>rm(temp,{recursive:true,force:true}));
  const idle=join(temp,'idle');await writeFile(idle,`#!${process.execPath}\nsetInterval(()=>{},1000);\n`);await chmod(idle,0o700);
  const timed=new OrbWorker({python:idle,timeoutMs:30});
  await assert.rejects(timed.request({op:'hello'}),e=>e.code==='ORB_TIME_BUDGET');await timed.close();assert.notEqual(timed.child.signalCode,null);
  const controller=new AbortController(),cancelled=new OrbWorker({python:idle,signal:controller.signal});
  const pending=cancelled.request({op:'hello'});controller.abort();
  await assert.rejects(pending,e=>e.code==='ORB_CANCELLED');await cancelled.close();
  // Controlled ps double tests supervisor behavior, not measured real RSS.
  const ps=join(temp,'ps');await writeFile(ps,"#!/bin/sh\necho 600000\n");await chmod(ps,0o700);
  const memory=new OrbWorker({python:idle,timeoutMs:10000,memoryMiB:64,ps});
  await assert.rejects(memory.request({op:'hello'}),e=>e.code==='ORB_MEMORY_BUDGET');await memory.close();
  const malformed=join(temp,'malformed');await writeFile(malformed,"#!/bin/sh\necho null\nexec /bin/sleep 3\n");await chmod(malformed,0o700);
  const bad=new OrbWorker({python:malformed});await assert.rejects(bad.request({op:'hello'}),e=>e.code==='ORB_PROTOCOL');await bad.close();
  assert.throws(()=>new OrbWorker({python:idle,signal:{}}),e=>e.code==='ARGUMENT_ERROR');
});

test('real ORB audit binds witnesses, cache-independent identity, review, export and exact-only verify',enabled,async t=>{
  const f=await fixture(t),options={includeOrb:true,maxOrbComparisons:2000000000};
  const first=await runAudit({root:f.root,out:join(f.temp,'cached-first'),cache:join(f.temp,'cache'),options:{threshold:0,...options}});
  const second=await runAudit({root:f.root,out:join(f.temp,'cached-second'),cache:join(f.temp,'cache'),options:{threshold:0,...options}});
  const r=first.report;assert.equal(r.complete,true);assert.equal(second.report.auditId,r.auditId);assert.equal(second.cache.hits,3);
  const pairs=r.pairs.filter(p=>p.evidence==='orb-candidate');assert.equal(pairs.length,2);
  assert.equal(r.pairs[0].evidence,'byte-identical');assert.equal(r.groups.length,1);
  assert.equal(r.phases.orb.processedImages,3);assert.ok(r.phases.orb.descriptorComparisons>0);
  assert.ok(r.timing.orb.workerPeakRssBytes<256*1048576);
  assert.equal(r.timing.orb.executedFeatureExtractions+r.timing.orb.featureCacheHits,r.phases.orb.featureImages);
  assert.equal(second.report.timing.orb.executedFeatureExtractions,0);
  assert.equal(second.report.timing.orb.featureWorkerRequestMs,0);
  assert.equal(second.report.timing.orb.geometryWorkerRequestMs,0);
  assert.equal(second.report.timing.orb.executedPairChecks,0);
  for(const p of pairs){assert.equal(p.distance,null);assert.ok(p.matchOrb.inliers>=8);assert.equal(p.matchOrb.inlierCoordinates.length,Math.min(32,p.matchOrb.inliers));}
  const reviewed=validateReport(r);assert.equal(filterPairs(reviewed,new Map(),{evidence:'orb-candidate',maxDistance:0}).length,2);
  assert.equal(workflow({operation:'gate',report:r,failOn:'candidate'}).counts.orbCandidate,2);
  const verify=await verifyFiles({report:join(first.out,'report.json'),root:f.root});assert.equal(verify.counts.valid,1);assert.equal(verify.counts.skippedCandidates,2);assert.equal(verify.verificationScope.candidatesRecomputed,false);
  const html=join(f.temp,'evidence.html');await exportHTML({report:join(first.out,'report.json'),out:html});assert.ok((await readFile(html,'utf8')).includes('几何内点'));
  const review=join(f.temp,'review.json');await writeFile(review,JSON.stringify({schemaVersion:'visionleak-review-v1',auditId:r.auditId,reviews:pairs.map(p=>({left:p.left,right:p.right,pairKey:pairKey(p.left,p.right),decision:'confirmed',note:'scripted functional test',updatedAt:new Date().toISOString()}))}));
  const csv=join(f.temp,'fixes.csv');await exportFixes({report:join(first.out,'report.json'),out:csv,review});assert.match(await readFile(csv,'utf8'),/orb-candidate/);
  for(const mutate of [p=>p.matchOrb.inliers=900,p=>p.distance=0,p=>p.matchOrb.query='missing',p=>p.matchOrb.queryToOriginal=[[1,0,1e99],[0,1,0]],p=>p.matchOrb.inlierCoordinates=[]]){
    const copy=structuredClone(r);mutate(copy.pairs.find(p=>p.evidence==='orb-candidate'));assert.throws(()=>validateReport(copy));await assert.rejects(verifyReportIdentity(copy));
  }
  const altered=structuredClone(r);altered.orbProfile.workerDigest='a'.repeat(64);assert.notEqual(reportIdentity(altered).digest,r.auditId);
  assert.deepEqual(await readFile(join(f.root,'train/170072252-original.png')),f.original);
});

test('real ORB obeys each independent budget and keeps deterministic coverage',enabled,async t=>{
  const f=await fixture(t);
  for(const [key,value,reason] of [['maxOrbImages',0,'ORB_IMAGE_BUDGET'],['maxOrbTotalPixels',0,'ORB_PIXEL_BUDGET'],['maxOrbComparisons',0,'ORB_WORK_BUDGET'],['maxOrbPairChecks',0,'ORB_CHECK_BUDGET'],['maxOrbCandidates',0,'ORB_PAIR_BUDGET'],['maxOrbMilliseconds',1,'ORB_TIME_BUDGET']]){
    const r=(await f.run({includeOrb:true,[key]:value})).report;
    assert.equal(r.complete,false,key);assert.equal(r.phases.orb.reason,reason,key);assert.equal(r.coverage.deterministicInputComplete,true,key);
    assert.equal(r.pairs[0].evidence,'byte-identical');assert.equal(r.stats.processedImages,r.phases.orb.processedImages);assert.ok(r.phases.orb.descriptorComparisons<=r.options.maxOrbComparisons);
  }
  const capped=(await f.run({includeOrb:true,maxOrbCandidates:1,maxOrbComparisons:2000000000})).report;
  assert.equal(capped.phases.orb.emittedPairs,1);assert.equal(capped.complete,false);assert.equal(capped.phases.orb.reason,'ORB_PAIR_BUDGET');
  const exact=(await f.run({includeOrb:true,maxPairs:0})).report;assert.equal(exact.phases.orb.status,'skipped');assert.equal(exact.stats.processedImages,0);
});

test('ORB cached scans resume completed negative directions and retain final witnesses',enabled,async t=>{
  const f=await fixture(t),cache=join(f.temp,'resume-cache');
  await writeFile(join(f.root,'train/unrelated.jpg'),await readFile(new URL('../research/photos-v2/originals/89995572.jpg',import.meta.url)));
  const options={threshold:0,includeOrb:true,maxOrbComparisons:2000000000};
  const full=(await f.run(options)).report;
  let report,previous=0;
  for(let i=0;i<12;i++){
    report=(await runAudit({root:f.root,out:join(f.temp,'resume-'+i),cache,options:{...options,maxOrbPairChecks:1}})).report;
    assert.ok(report.timing.orb.executedPairChecks<=1);
    assert.ok(report.timing.orb.matchCacheHits+report.timing.orb.checkpointDirections>=previous);previous=report.timing.orb.matchCacheHits+report.timing.orb.checkpointDirections;
    if(report.complete)break;
  }
  assert.equal(report.complete,true);
  assert.deepEqual(report.pairs,full.pairs);
  assert.ok(full.phases.orb.pairChecks>full.phases.orb.emittedPairs);
  const warm=(await runAudit({root:f.root,out:join(f.temp,'resume-warm'),cache,options})).report;
  assert.equal(warm.timing.orb.executedPairChecks,0);
  assert.equal(warm.timing.orb.checkpointImages,4);
  assert.equal(warm.timing.orb.checkpointDirections,full.phases.orb.pairChecks);
  assert.equal(warm.timing.orb.featureCacheHits,4);
  assert.deepEqual(warm.pairs,full.pairs);
  assert.equal(warm.auditId,full.auditId);
  const cacheRoot=join(cache,'orb-v3');
  let checkpoint;
  for(const path of await readdir(cacheRoot,{recursive:true})){
    if(!path.endsWith('.json'))continue;
    const entry=JSON.parse(await readFile(join(cacheRoot,path)));
    if(entry.value?.version===2 && entry.value.processedImages===4)checkpoint=entry.value;
  }
  assert.ok(checkpoint?.hits.length);
  const missing=checkpoint.hits[0][3];
  await rm(join(cacheRoot,missing.slice(0,2),missing+'.json'));
  const recovered=(await runAudit({root:f.root,out:join(f.temp,'checkpoint-missing-hit'),cache,options})).report;
  assert.equal(recovered.timing.orb.checkpointImages,0);
  assert.ok(recovered.timing.orb.executedPairChecks>0);
  assert.equal(recovered.auditId,full.auditId);
});

test('disk-backed ORB crosses the 512-image boundary without losing late cross-batch evidence',enabled,async t=>{
 const f=await fixture(t);
 // One real original, 511 train fillers, and one late crop.
 await rm(join(f.root,'validation/exact-copy.png'));
 const blank=await sharp({create:{width:8,height:8,channels:3,background:'#667788'}}).png().toBuffer();
 for(let i=0;i<511;i++)await writeFile(join(f.root,`train/zz-filler-${String(i).padStart(3,'0')}.png`),blank);
 const options={threshold:0,includeOrb:true,maxOrbImages:1000,maxOrbPairChecks:1,maxOrbComparisons:2000000000};
 const unsupported=(await f.run(options)).report;assert.equal(unsupported.phases.orb.reason,'ORB_CACHE_REQUIRED');
 const r=(await runAudit({root:f.root,out:join(f.temp,'disk-batches'),cache:join(f.temp,'disk-cache'),options})).report;
 assert.equal(r.phases.orb.featureImages,513);
 assert.equal(r.timing.orb.residentFeaturePeak,2);
 assert.ok(r.pairs.some(p=>p.evidence==='orb-candidate'));
 assert.equal(r.phases.orb.reason,'ORB_CHECK_BUDGET');
 assert.ok(r.phases.orb.eligibleInputPairs>r.phases.orb.processedPairs);
});

test('production retrieval verifies its selected queue while preserving non-exhaustive coverage, identity and export',enabled,async t=>{
 const f=await fixture(t);await writeFile(join(f.root,'train/unrelated.jpg'),await readFile(new URL('../research/photos-v2/originals/89995572.jpg',import.meta.url)));
 const cache=join(f.temp,'retrieval-cache'),options={threshold:0,includeOrb:true,includeOrbRetrieval:true,maxOrbComparisons:2000000000};
 const cold=(await runAudit({root:f.root,out:join(f.temp,'retrieval-cold'),cache,options})).report;
 assert.equal(cold.phases.orb.candidateQueueComplete,true);assert.equal(cold.complete,false);assert.equal(cold.phases.orb.exhaustivePairsComplete,false);
 assert.equal(cold.phases.orb.reason,'ORB_APPROXIMATE_COVERAGE');assert.ok(cold.phases.orb.processedPairs<cold.phases.orb.eligibleInputPairs);
 assert.ok(cold.timing.orb.executedPairChecks>0);assert.ok(cold.pairs.some(p=>p.evidence==='orb-candidate'));
 assert.equal(cold.coverage.orbSearch.candidateQueueComplete,true);assert.ok(!cold.coverage.budgetExhaustion.some(b=>b.code==='ORB_APPROXIMATE_COVERAGE'));
 assert.equal(workflow({operation:'gate',report:cold,failOn:''}).exitCode,2);validateReport(cold);
 const forged=structuredClone(cold);forged.complete=true;assert.throws(()=>validateReport(forged),/穷举覆盖/);
 const warm=(await runAudit({root:f.root,out:join(f.temp,'retrieval-warm'),cache,options})).report;
 assert.equal(warm.auditId,cold.auditId);assert.equal(warm.timing.orb.retrieval.executedVisits,0);assert.equal(warm.timing.orb.executedPairChecks,0);
 const html=join(f.temp,'retrieval.html');await exportHTML({report:join(f.temp,'retrieval-cold/report.json'),out:html});assert.match(await readFile(html,'utf8'),/近似检索/);
 for(const [key,reason] of [['maxOrbIndexDescriptors','ORB_INDEX_DESCRIPTOR_BUDGET'],['maxOrbIndexVisits','ORB_INDEX_VISIT_BUDGET']]){
  const limited=(await runAudit({root:f.root,out:join(f.temp,key),cache:join(f.temp,key+'-cache'),options:{...options,[key]:0}})).report;
  assert.equal(limited.complete,false);assert.equal(limited.phases.orb.reason,reason);assert.ok(limited.pairs.some(p=>p.evidence==='byte-identical'));validateReport(limited);
 }
 await assert.rejects(f.run({includeOrbRetrieval:true}),e=>e.code==='ARGUMENT_ERROR');
 assert.equal((await f.run(options)).report.phases.orb.reason,'ORB_CACHE_REQUIRED');
});

test('retrieval direction budget resumes selected geometry without losing completed queue work',enabled,async t=>{
 const f=await fixture(t);await writeFile(join(f.root,'train/unrelated.jpg'),await readFile(new URL('../research/photos-v2/originals/89995572.jpg',import.meta.url)));
 const cache=join(f.temp,'retrieval-resume'),options={threshold:0,includeOrb:true,includeOrbRetrieval:true,maxOrbComparisons:2000000000,maxOrbPairChecks:1};
 let final;
 for(let run=0;run<12;run++){
  final=(await runAudit({root:f.root,out:join(f.temp,'retrieval-resume-'+run),cache,options})).report;
  assert.ok(final.timing.orb.executedPairChecks<=1);validateReport(final);
  if(final.phases.orb.candidateQueueComplete)break;
 }
 assert.equal(final.phases.orb.candidateQueueComplete,true);assert.equal(final.complete,false);
 const full=(await runAudit({root:f.root,out:join(f.temp,'retrieval-full'),cache:join(f.temp,'retrieval-independent'),options:{...options,maxOrbPairChecks:10000}})).report;
 assert.deepEqual(final.pairs,full.pairs);
});
