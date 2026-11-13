import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openOrbCache} from '../tools/orb-cache.mjs';
import {selectOrbPairs} from '../tools/orb-retrieval.mjs';
import {OrbWorker} from '../tools/orb.mjs';
test('posting-budget recovery advances durable query cursor and reuses a completed queue',async t=>{
 const root=await mkdtemp(join(tmpdir(),'vl-index-resume-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const cache=await openOrbCache(root,{test:'query-budget'});t.after(()=>cache.close());
 const images=Array.from({length:4},(_,i)=>({id:'i'+i,split:i%2?'test':'train',orb:{keypoints:3}})),featureKeys=new Map();
 for(const image of images){const key=cache.key('feature',image.id);featureKeys.set(image.id,key);await cache.put(key,{payload:{descriptors:Buffer.alloc(96,17).toString('base64')}});}
 const options={maxOrbIndexDescriptors:100,maxOrbIndexVisits:60,maxOrbIndexMemoryMiB:256};let previous=0,result;
 const invoke=overrides=>selectOrbPairs({images,featureKeys,existing:new Set(),cache,options:{...options,...overrides},deadline:performance.now()+30000,check:()=>{},makeWorker:configuration=>new OrbWorker(configuration)});
 for(let run=0;run<6;run++){
  result=await invoke();assert.ok(result.timing.executedVisits<=60);assert.ok(result.stats.queryImages>previous);previous=result.stats.queryImages;
  if(result.stats.complete)break;
  assert.equal(result.reason,'ORB_INDEX_VISIT_BUDGET');
 }
 assert.equal(result.stats.complete,true);assert.equal(result.stats.queryImages,4);assert.equal(result.stats.postingVisits,192);
 const warm=await invoke({maxOrbIndexVisits:0});assert.equal(warm.stats.complete,true);assert.equal(warm.timing.executedVisits,0);assert.equal(warm.timing.reusedQueries,4);assert.deepEqual(warm.pairs,result.pairs);
});
