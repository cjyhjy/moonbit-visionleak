import {selectOrbPairs,retrievalBinding} from './orb-retrieval.mjs';
import {openOrbCache} from './orb-cache.mjs';
import {spawn, execFile} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {decodeBuffer, readImageBytes} from './decode.mjs';
import {containedFile} from './input.mjs';
import {sha256, samplingPlan, VisionLeakError} from './runtime.mjs';

const workerPath = fileURLToPath(new URL('./orb-worker.py', import.meta.url));
const profileBytes = readFileSync(new URL('./orb-profile.json', import.meta.url));
export const ORB_PROFILE = Object.freeze(JSON.parse(profileBytes));
export const orbBinding = () => ({...ORB_PROFILE, profileDigest:sha256(profileBytes), workerDigest:sha256(readFileSync(workerPath))});

// One sequential request at a time. stdout/stderr, process lifetime and resident
// memory are supervised; no report-supplied program or file path reaches Python.
export class OrbWorker {
  constructor({python=process.env.VISIONLEAK_ORB_PYTHON || 'python3', timeoutMs=60000, memoryMiB=256, signal, ps='/bin/ps',programArgs,codePrefix='ORB'}={}) {
    if(typeof python!=='string' || !python || !Number.isInteger(timeoutMs) || timeoutMs<1 || timeoutMs>300000 ||
      !Number.isInteger(memoryMiB) || memoryMiB<64 || memoryMiB>512 || (signal!==undefined && !(signal instanceof AbortSignal)))
      throw new VisionLeakError('ARGUMENT_ERROR','Invalid bounded ORB worker configuration');
    if(!['ORB','ORB_INDEX'].includes(codePrefix)||(programArgs!==undefined&&(!Array.isArray(programArgs)||programArgs.some(a=>typeof a!=='string'||a.length>4096))))throw new VisionLeakError('ARGUMENT_ERROR','Invalid internal worker transport');
    this.codePrefix=codePrefix;
    this.peakRssBytes=0; this.pending=null; this.failure=null; this.buffer=''; this.stderrBytes=0;
    this.child=spawn(python,programArgs??['-I','-u',workerPath],{stdio:['pipe','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:'1',OPENBLAS_NUM_THREADS:'1',MKL_NUM_THREADS:'1'}});
    this.closed=new Promise(resolve=>this.child.once('close',resolve));
    this.timer=setTimeout(()=>this.stop('ORB_TIME_BUDGET','ORB phase exceeded its wall-clock budget'),timeoutMs);
    this.abort=()=>this.stop('ORB_CANCELLED','ORB phase cancelled');
    this.signal=signal; signal?.addEventListener('abort',this.abort,{once:true});
    this.child.once('error',()=>this.stop('ORB_DEPENDENCY','Cannot start VISIONLEAK_ORB_PYTHON; install requirements-orb.txt'));
    this.child.once('close',()=>this.stop('ORB_WORKER_EXIT','ORB worker exited before completing the phase'));
    this.child.stdin.on('error',()=>this.stop('ORB_WORKER_EXIT','ORB worker input closed'));
    this.child.stderr.on('data',chunk=>{this.stderrBytes+=chunk.length;if(this.stderrBytes>65536)this.stop('ORB_PROTOCOL','ORB worker stderr exceeded its budget');});
    this.child.stdout.setEncoding('utf8');
    this.child.stdout.on('data',chunk=>{
      this.buffer+=chunk;
      if(Buffer.byteLength(this.buffer)>512*1024){this.stop('ORB_PROTOCOL','ORB response exceeded its budget');return;}
      let at;
      while((at=this.buffer.indexOf('\n'))>=0){
        const line=this.buffer.slice(0,at);this.buffer=this.buffer.slice(at+1);
        let value;try{value=JSON.parse(line);}catch{this.stop('ORB_PROTOCOL','Invalid ORB response');return;}
        if(!value || typeof value!=='object' || Array.isArray(value) || typeof value.ok!=='boolean'){this.stop('ORB_PROTOCOL','Invalid ORB response envelope');return;}
        if(!this.pending){this.stop('ORB_PROTOCOL','Unexpected ORB response');return;}
        const pending=this.pending;this.pending=null;
        if(value.ok!==true){pending.reject(new VisionLeakError(this.codePrefix+(value.code==='ORB_DEPENDENCY'?'_DEPENDENCY':'_PROTOCOL'),value.message || 'ORB failed'));}
        else pending.resolve(value);
      }
    });
    let probing=false;
    this.monitor=setInterval(()=>{
      if(probing || !this.child.pid || this.failure)return;
      probing=true;
      try { execFile(ps,['-o','rss=','-p',String(this.child.pid)],{timeout:5000,maxBuffer:1024},(error,stdout)=>{
        probing=false;
        if(this.failure)return;
        const rss=Number(stdout.trim())*1024;
        if(error || !Number.isFinite(rss) || rss<=0){this.stop('ORB_MEMORY_MONITOR',`Cannot supervise ORB resident memory (${error?.code ?? (error?.killed ? 'probe-timeout' : 'invalid-rss')})`);return;}
        this.peakRssBytes=Math.max(this.peakRssBytes,rss);
        if(rss>memoryMiB*1024*1024)this.stop('ORB_MEMORY_BUDGET','ORB worker exceeded the resident memory budget');
      }); } catch { probing=false;this.stop('ORB_MEMORY_MONITOR','Cannot supervise ORB resident memory'); }
    },100);
    if(signal?.aborted)this.abort();
  }
  request(value) {
    if(this.failure)return Promise.reject(this.failure);
    if(this.pending)return Promise.reject(new VisionLeakError('ORB_PROTOCOL','Concurrent worker requests are unsupported'));
    const line=JSON.stringify(value)+'\n';
    if(Buffer.byteLength(line)>8*1024*1024)return Promise.reject(new VisionLeakError('ORB_PROTOCOL','ORB request exceeds frame budget'));
    return new Promise((resolve,reject)=>{this.pending={resolve,reject};this.child.stdin.write(line);});
  }
  stop(code='ORB_CANCELLED',message='ORB worker stopped') {
    if(this.codePrefix==='ORB_INDEX'&&code.startsWith('ORB_')&&!code.startsWith('ORB_INDEX_'))code='ORB_INDEX_'+code.slice(4);
    this.failure ??= new VisionLeakError(code,message);
    clearTimeout(this.timer);clearInterval(this.monitor);this.signal?.removeEventListener('abort',this.abort);
    if(this.pending){const pending=this.pending;this.pending=null;pending.reject(this.failure);}
    if(this.child.exitCode===null)this.child.kill('SIGKILL');
  }
  async close(){this.stop();await this.closed;}
}

export function orbGray({width,height,rgba}) {
  if(!Number.isSafeInteger(width*height) || width*height>4194304 || rgba.length!==width*height*4)throw new VisionLeakError('ORB_PROTOCOL','Invalid normalized pixels');
  const gray=Buffer.alloc(width*height);
  for(let i=0;i<gray.length;i++){
    const p=i*4,a=rgba[p+3],white=255*(255-a)+127;
    const r=Math.floor((rgba[p]*a+white)/255),g=Math.floor((rgba[p+1]*a+white)/255),b=Math.floor((rgba[p+2]*a+white)/255);
    gray[i]=Math.floor((299*r+587*g+114*b+500)/1000);
  }
  return gray;
}

export async function runOrb({root,images,computed,options,signal,cacheDirectory}) {
  const profile=orbBinding();
  const phase={enabled:true,status:'incomplete',complete:false,inputImages:images.length,processedImages:0,
    featureImages:0,featurePixels:0,pairChecks:0,descriptorComparisons:0,emittedPairs:0,reason:''};
  const errors=[];const timing={elapsedMs:0,workerPeakRssBytes:0,memorySamplingMs:100,featureCacheHits:0,matchCacheHits:0,executedPairChecks:0,executedDescriptorComparisons:0,residentFeaturePeak:0,checkpointImages:0,checkpointDirections:0,
    featureStageMs:0,featureWorkerRequestMs:0,executedFeatureExtractions:0,geometryStageMs:0,geometryWorkerRequestMs:0};
  const finish=()=>({profile,phase,errors,timing});
  if(!computed.phases?.deterministic?.complete){phase.status='skipped';phase.reason='deterministic-incomplete';return finish();}
  if(computed.pairs.length>=options.maxPairs || options.maxOrbCandidates===0){phase.reason='ORB_PAIR_BUDGET';return finish();}
  if(!cacheDirectory && (options.includeOrbRetrieval || Math.min(images.length,options.maxOrbImages)>512)){phase.reason='ORB_CACHE_REQUIRED';errors.push({code:phase.reason,message:'ORB retrieval and prefixes over 512 images require --cache',stage:'orb'});return finish();}
  const started=performance.now();
  let worker,cache,indexWorker,featureStarted,geometryStarted;
  const timedRequest=async(field,request)=>{const start=performance.now();try{return await worker.request(request);}finally{timing[field]+=performance.now()-start;}};
  const interrupt=()=>{worker?.stop('ORB_CANCELLED','ORB phase cancelled by signal');indexWorker?.stop('ORB_CANCELLED','ORB phase cancelled by signal');};
  process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
  let featureStop='';
  try {
    worker=new OrbWorker({timeoutMs:options.maxOrbMilliseconds,memoryMiB:options.maxOrbMemoryMiB,signal});
    const ready=await worker.request({op:'hello'});
    if(ready.profile!==profile.id || ready.opencv!==profile.opencv || ready.numpy!==profile.numpy || ready.opencvWheel!==profile.opencvWheel || ready.profileDigest!==profile.profileDigest || ready.workerDigest!==profile.workerDigest)throw new VisionLeakError('ORB_PROTOCOL','Worker profile does not match host');
    profile.runtime={python:ready.python,opencv:ready.opencv,opencvWheel:ready.opencvWheel,numpy:ready.numpy,opencvBuildDigest:ready.opencvBuildDigest};
    cache=cacheDirectory?await openOrbCache(cacheDirectory,{profile,maxOrbPixels:options.maxOrbPixels}):null;
    const featureKeys=new Map();
    featureStarted=performance.now();
    for(const image of images){
      if(worker.failure)throw worker.failure;
      if(phase.featureImages>=options.maxOrbImages){featureStop='ORB_IMAGE_BUDGET';break;}
      const shape=image.width*image.height<=options.maxOrbPixels?image:await samplingPlan(image.width,image.height,options.maxOrbPixels);
      if(phase.featurePixels+shape.width*shape.height>options.maxOrbTotalPixels){featureStop='ORB_PIXEL_BUDGET';break;}
      const file=await containedFile(root,image.path);
      const decodeOptions={maxPixels:options.maxOrbPixels,maxDecodePixels:options.maxDecodePixels,maxFileBytes:options.maxFileBytes};
      const bytes=await readImageBytes(file,decodeOptions);
      if(sha256(bytes)!==image.byteDigest)throw new VisionLeakError('ORB_INPUT_CHANGED','Input changed after the deterministic fingerprint');
      const decoded=await decodeBuffer(bytes,decodeOptions),gray=orbGray(decoded);
      const featureKey=cache?.key('feature',{byteDigest:image.byteDigest,grayDigest:sha256(gray),width:decoded.width,height:decoded.height});
      let result=cache?await cache.get(featureKey):null;
      if(worker.failure)throw worker.failure;
      if(result?.grayDigest===sha256(gray) && result?.payload)timing.featureCacheHits++;
      else {
        timing.executedFeatureExtractions++;
        result=await timedRequest('featureWorkerRequestMs',{op:'extract',id:image.id,width:decoded.width,height:decoded.height,gray:gray.toString('base64')});
        if(cache)await cache.put(featureKey,result);
      }
      timing.residentFeaturePeak=Math.max(timing.residentFeaturePeak,cache?1:phase.featureImages+1);
      if(cache){featureKeys.set(image.id,featureKey);await worker.request({op:'clear'});}
      if(!Number.isInteger(result.keypoints) || result.keypoints<0 || result.keypoints>800 || result.grayDigest!==sha256(gray) || !/^[a-f0-9]{64}$/.test(result.featureDigest))throw new VisionLeakError('ORB_PROTOCOL','Invalid feature response');
      image.orb={width:decoded.width,height:decoded.height,keypoints:result.keypoints,grayDigest:result.grayDigest,featureDigest:result.featureDigest};
      phase.featureImages++;phase.featurePixels+=gray.length;
    }
    timing.featureStageMs=performance.now()-featureStarted;featureStarted=undefined;
    const key=(a,b)=>JSON.stringify([a,b].sort());
    const existing=new Set(computed.pairs.map(p=>key(p.left,p.right)));
    const inputCounts=new Map(),featureCounts=new Map();
    for(const [index,image] of images.entries()){inputCounts.set(image.split,(inputCounts.get(image.split)||0)+1);if(index<phase.featureImages)featureCounts.set(image.split,(featureCounts.get(image.split)||0)+1);}
    const crossPairs=counts=>{const n=[...counts.values()].reduce((s,v)=>s+v,0);return (n*n-[...counts.values()].reduce((s,v)=>s+v*v,0))/2;};
    const featureIds=new Set(images.slice(0,phase.featureImages).map(i=>i.id));
    phase.eligibleInputPairs=crossPairs(inputCounts)-existing.size;
    phase.eligibleFeaturePairs=crossPairs(featureCounts)-computed.pairs.filter(p=>featureIds.has(p.left)&&featureIds.has(p.right)).length;
    phase.processedPairs=0;
    let selectedPairs=null,scanCursor=0;
    if(options.includeOrbRetrieval){
      profile.retrieval=retrievalBinding();profile.prefilter=profile.retrieval.id;
      phase.searchMode='retrieval';phase.candidateQueueComplete=false;phase.exhaustivePairsComplete=false;phase.searchProcessedImages=0;
      const retrieval=await selectOrbPairs({images:images.slice(0,phase.featureImages),featureKeys,existing,cache,options,deadline:started+options.maxOrbMilliseconds,
        check:()=>{if(worker.failure)throw worker.failure;if(performance.now()>=started+options.maxOrbMilliseconds)throw new VisionLeakError('ORB_TIME_BUDGET','ORB phase exceeded its wall-clock budget');},
        makeWorker:configuration=>{indexWorker=new OrbWorker({...configuration,signal});return indexWorker;}});
      phase.retrieval=retrieval.stats;timing.retrieval=retrieval.timing;selectedPairs=retrieval.pairs;
      if(retrieval.reason){phase.reason=retrieval.reason;return finish();}
    }
    geometryStarted=performance.now();
    const hits=[];
    const appendHit=(a,b,original,query,result)=>{
      if(!result.witness || result.witness.inliers<8 || result.witness.inliers>800)throw new VisionLeakError('ORB_PROTOCOL','Invalid geometric witness');
      computed.pairs.push({left:a.id,right:b.id,evidence:'orb-candidate',distance:null,
        matchOrb:{profile:profile.id,original:original.id,query:query.id,originalSize:[original.orb.width,original.orb.height],querySize:[query.orb.width,query.orb.height],...result.witness}});
      phase.emittedPairs++;
    };
    const checkpointKey=cache?.key('scan-prefix-v2',{
      inputs:images.map(i=>[i.id,i.split,i.byteDigest,featureKeys.get(i.id)||null]),
      retrieval:profile.retrieval||null,selected:selectedPairs?[...selectedPairs].sort((a,b)=>a-b):null,
      corePairs:[...existing].sort(),maxPairs:options.maxPairs,maxOrbCandidates:options.maxOrbCandidates,
    });
    const checkpoint=cache?await cache.get(checkpointKey):null;
    if(checkpoint && checkpoint.version===2 && Number.isSafeInteger(checkpoint.scanCursor) && checkpoint.scanCursor>=0 && checkpoint.scanCursor<=phase.featureImages && Number.isSafeInteger(checkpoint.processedImages) && checkpoint.processedImages>=0 && checkpoint.processedImages<=checkpoint.scanCursor &&
      ['processedPairs','pairChecks','descriptorComparisons'].every(k=>Number.isSafeInteger(checkpoint[k])&&checkpoint[k]>=0) &&
      checkpoint.processedPairs<=(selectedPairs?.size??phase.eligibleFeaturePairs) && checkpoint.pairChecks>=checkpoint.processedPairs && checkpoint.pairChecks<=2*checkpoint.processedPairs && checkpoint.descriptorComparisons<=checkpoint.pairChecks*1280000 &&
      Array.isArray(checkpoint.hits) && checkpoint.hits.length<=checkpoint.processedPairs && checkpoint.hits.length<=options.maxOrbCandidates && checkpoint.hits.length+computed.pairs.length<=options.maxPairs){
      const restored=[];let lastPair=-1;
      for(const ref of checkpoint.hits){
        if(!Array.isArray(ref)||ref.length!==4)break;
        const [i,j,originalIndex,matchKey]=ref;
        if(![i,j,originalIndex].every(Number.isSafeInteger)||j<0||j>=i||i>=checkpoint.scanCursor||![i,j].includes(originalIndex))break;
        const ordinal=i*(i-1)/2+j;if(ordinal<=lastPair)break;lastPair=ordinal;
        const queryIndex=originalIndex===i?j:i,a=images[j],b=images[i],original=images[originalIndex],query=images[queryIndex];
        if((selectedPairs&&!selectedPairs.has(i*16384+j))||a.split===b.split||existing.has(key(a.id,b.id))||matchKey!==cache.key('match',[original.id,featureKeys.get(original.id),query.id,featureKeys.get(query.id)]))break;
        const result=await cache.get(matchKey);
        if(result?.hit!==true||!result.witness||result.witness.inliers<8||result.witness.inliers>800)break;
        restored.push([a,b,original,query,result]);
      }
      if(restored.length===checkpoint.hits.length){
        for(const args of restored)appendHit(...args);
        hits.push(...checkpoint.hits);
        for(const k of ['processedImages','processedPairs','pairChecks','descriptorComparisons'])phase[k]=checkpoint[k];
        scanCursor=checkpoint.scanCursor;if(options.includeOrbRetrieval)phase.searchProcessedImages=scanCursor;
        timing.checkpointImages=scanCursor;timing.checkpointDirections=phase.pairChecks;
      }
    }
    outer:for(let i=scanCursor;i<phase.featureImages;i++){
      let rowExhaustive=true;
      for(let j=0;j<i;j++){
        const a=images[j],b=images[i];
        if(a.split===b.split || existing.has(key(a.id,b.id)))continue;
        if(selectedPairs&&!selectedPairs.has(i*16384+j)){rowExhaustive=false;continue;}
        if(computed.pairs.length>=options.maxPairs || phase.emittedPairs>=options.maxOrbCandidates){phase.reason='ORB_PAIR_BUDGET';break outer;}
        const smallerFirst=a.orb.width*a.orb.height<=b.orb.width*b.orb.height?[[b,a],[a,b]]:[[a,b],[b,a]];
        for(const [original,query] of smallerFirst){
          const matchKey=cache?.key('match',[original.id,featureKeys.get(original.id),query.id,featureKeys.get(query.id)]);
          let reused=cache?await cache.get(matchKey):null;
          if(worker.failure)throw worker.failure;
          if(!reused && timing.executedPairChecks>=options.maxOrbPairChecks){phase.reason='ORB_CHECK_BUDGET';break outer;}
          const cost=Math.min(original.orb.keypoints,query.orb.keypoints)<8?0:2*original.orb.keypoints*query.orb.keypoints;
          if(!reused && cost>options.maxOrbComparisons-timing.executedDescriptorComparisons){phase.reason='ORB_WORK_BUDGET';break outer;}
          // Reserve work before entering OpenCV, including a call killed mid-flight.
          phase.pairChecks++;phase.descriptorComparisons+=cost;
          let result=reused;
          if(reused)timing.matchCacheHits++;
          else {
            if(cache){
              for(const [index,image] of [original,query].entries()){
                const feature=await cache.get(featureKeys.get(image.id));
                if(!feature?.payload)throw new VisionLeakError('ORB_CACHE_CHANGED','Feature cache changed during scan');
                await worker.request({op:'load',id:image.id,payload:feature.payload,clear:index===0});
                timing.residentFeaturePeak=Math.max(timing.residentFeaturePeak,index+1);
              }
            }
            timing.executedPairChecks++;timing.executedDescriptorComparisons+=cost;
            result=await timedRequest('geometryWorkerRequestMs',{op:'match',original:original.id,query:query.id,remainingWork:cost});
          }
          if(result.budget || result.work!==cost || typeof result.hit!=='boolean')throw new VisionLeakError('ORB_PROTOCOL','Invalid match accounting');
          if(cache && !reused)await cache.put(matchKey,result);
          if(result.hit){
            appendHit(a,b,original,query,result);
            hits.push([i,j,original===a?j:i,matchKey]);
            break;
          }
        }
        phase.processedPairs++;
      }
      scanCursor=i+1;
      if(rowExhaustive&&phase.processedImages===i)phase.processedImages=i+1;
      if(options.includeOrbRetrieval)phase.searchProcessedImages=scanCursor;
      if(cache)await cache.put(checkpointKey,{version:2,scanCursor,processedImages:phase.processedImages,processedPairs:phase.processedPairs,pairChecks:phase.pairChecks,descriptorComparisons:phase.descriptorComparisons,hits});
    }
    if(worker.failure)throw worker.failure;
    phase.reason ||= featureStop;
    if(options.includeOrbRetrieval){
      phase.candidateQueueComplete=phase.reason===''&&scanCursor===images.length;
      phase.exhaustivePairsComplete=phase.processedImages===images.length&&phase.processedPairs===phase.eligibleInputPairs;
      if(phase.candidateQueueComplete&&!phase.exhaustivePairsComplete)phase.reason='ORB_APPROXIMATE_COVERAGE';
    }
    phase.complete=phase.reason==='' && phase.processedImages===images.length;
    phase.status=phase.complete?'complete':'incomplete';
  } catch(error) {
    phase.reason=error.code?.startsWith('ORB_')?error.code:'ORB_INPUT_ERROR';
    errors.push({code:phase.reason,message:error instanceof VisionLeakError?error.message:'ORB input or worker operation failed',stage:'orb'});
  } finally {
    const stageEnded=performance.now();
    if(featureStarted!==undefined)timing.featureStageMs=stageEnded-featureStarted;
    if(geometryStarted!==undefined)timing.geometryStageMs=stageEnded-geometryStarted;
    for(const key of ['featureStageMs','featureWorkerRequestMs','geometryStageMs','geometryWorkerRequestMs'])timing[key]=Math.round(timing[key]);
    process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);
    await indexWorker?.close();await cache?.close();await worker?.close();timing.elapsedMs=Math.round(performance.now()-started);timing.workerPeakRssBytes=worker?.peakRssBytes ?? 0;
  }
  return finish();
}
