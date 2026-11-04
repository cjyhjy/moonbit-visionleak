import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm,chmod} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import sharp from 'sharp';
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
