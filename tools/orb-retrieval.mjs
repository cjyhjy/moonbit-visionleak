import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {sha256,VisionLeakError} from './runtime.mjs';
const workerPath=fileURLToPath(new URL('./orb-index-worker.mjs',import.meta.url));
export function retrievalBinding(){
 return {id:'vl-orb-lsh-24x4-top1-v1',bits:24,tables:4,k:1,seed:'vl-orb-lsh-v1',selection:'symmetric top-1 union; one vote per query descriptor/image; Core pairs excluded',
  implementationDigest:sha256(JSON.stringify(['./orb-retrieval.mjs','./orb-index-worker.mjs','./orb-compact-index.mjs','./orb-lsh.mjs'].map(name=>[name,sha256(readFileSync(new URL(name,import.meta.url)))]))),
  runtime:{node:process.version,icu:process.versions.icu,collation:new Intl.Collator().resolvedOptions()}};
}
export async function selectOrbPairs({images,featureKeys,existing,cache,options,deadline,check,makeWorker}){
 const started=performance.now(),profile=retrievalBinding(),descriptors=images.reduce((n,i)=>n+i.orb.keypoints,0),indexById=new Map(images.map((i,index)=>[i.id,index]));
 const stats={mode:'retrieval',profile:profile.id,inputImages:images.length,descriptors,queryImages:0,postingVisits:0,selectedPairs:0,complete:false};
 const timing={elapsedMs:0,workerPeakRssBytes:0,executedVisits:0,reusedQueries:0,indexedDescriptors:0};
 let worker;
 const pairs=new Set(),finish=reason=>{stats.selectedPairs=pairs.size;return {profile,pairs,stats,timing,reason};};
 if(descriptors>options.maxOrbIndexDescriptors)return finish('ORB_INDEX_DESCRIPTOR_BUDGET');
 const queueKey=cache.key('retrieval-queue-v1',{profile,inputs:images.map(i=>[i.id,i.split,featureKeys.get(i.id)]),existing:[...existing].sort()});
 const saved=await cache.get(queueKey);
 if(saved?.version===1&&Number.isSafeInteger(saved.queries)&&saved.queries>=0&&saved.queries<=images.length&&Number.isSafeInteger(saved.visits)&&saved.visits>=0&&saved.visits<=descriptors*4*images.length&&Array.isArray(saved.pairs)&&saved.pairs.length<=saved.queries&&saved.pairs.every(value=>{
  if(!Number.isSafeInteger(value)||value<0)return false;const i=Math.floor(value/16384),j=value%16384;
  return i<images.length&&j<i&&j<saved.queries&&images[i].split!==images[j].split&&!existing.has(JSON.stringify([images[i].id,images[j].id].sort()));
 })&&new Set(saved.pairs).size===saved.pairs.length){
  for(const pair of saved.pairs)pairs.add(pair);stats.queryImages=saved.queries;stats.postingVisits=saved.visits;timing.reusedQueries=saved.queries;
 }
 const initialVisits=stats.postingVisits;
 try {
  check();
  if(stats.queryImages<images.length){
   worker=makeWorker({python:process.execPath,programArgs:[workerPath],codePrefix:'ORB_INDEX',timeoutMs:Math.max(1,Math.floor(deadline-performance.now())),memoryMiB:options.maxOrbIndexMemoryMiB});
   const ranks=new Map([...images].sort((a,b)=>a.id.localeCompare(b.id)).map((image,rank)=>[image.id,rank])),splits=new Map([...new Set(images.map(i=>i.split))].map((split,i)=>[split,i]));
   const excluded=[];for(const pair of existing){const [a,b]=JSON.parse(pair),i=indexById.get(a),j=indexById.get(b);if(i!==undefined&&j!==undefined)excluded.push(Math.max(i,j)*16384+Math.min(i,j));}
   await worker.request({op:'init',configuration:{descriptors,images:images.map(i=>[splits.get(i.split),ranks.get(i.id)]),excludedPairs:excluded,maxVisits:options.maxOrbIndexVisits,queryStart:stats.queryImages}});
   for(const [index,image] of images.entries()){
    check();const feature=await cache.get(featureKeys.get(image.id));
    if(!feature?.payload)throw new VisionLeakError('ORB_CACHE_CHANGED','Feature cache changed while building retrieval index');
    await worker.request({op:'add',index,descriptors:feature.payload.descriptors});timing.indexedDescriptors+=image.orb.keypoints;
   }
   const built=await worker.request({op:'finish'});timing.allocatedBytes=built.allocatedBytes;timing.postings=built.entries;
   for(let index=stats.queryImages;index<images.length;index++){
    check();const feature=await cache.get(featureKeys.get(images[index].id));
    if(!feature?.payload)throw new VisionLeakError('ORB_CACHE_CHANGED','Feature cache changed while querying retrieval index');
    const result=await worker.request({op:'query',index,descriptors:feature.payload.descriptors});
    if(!Number.isSafeInteger(result.visits)||result.visits<timing.executedVisits||result.visits>options.maxOrbIndexVisits||typeof result.complete!=='boolean')throw new VisionLeakError('ORB_INDEX_PROTOCOL','Invalid index work accounting');
    timing.executedVisits=result.visits;
    if(!result.complete)return finish(result.reason==='ORB_INDEX_VISIT_BUDGET'?result.reason:'ORB_INDEX_PROTOCOL');
    if(!Number.isSafeInteger(result.chosen)||result.chosen< -1||result.chosen>=images.length)throw new VisionLeakError('ORB_INDEX_PROTOCOL','Invalid selected index');
    if(result.chosen>=0){const partner=result.chosen;if(images[partner].split===images[index].split||existing.has(JSON.stringify([images[partner].id,images[index].id].sort())))throw new VisionLeakError('ORB_INDEX_PROTOCOL','Invalid selected pair');pairs.add(Math.max(index,partner)*16384+Math.min(index,partner));}
    stats.queryImages=index+1;stats.postingVisits=initialVisits+result.visits;
    await cache.put(queueKey,{version:1,queries:stats.queryImages,visits:stats.postingVisits,pairs:[...pairs]});
   }
  }
  check();stats.selectedPairs=pairs.size;stats.complete=true;return finish('');
 }finally{timing.workerPeakRssBytes=worker?.peakRssBytes||0;await worker?.close();timing.elapsedMs=Math.round(performance.now()-started);}
}
