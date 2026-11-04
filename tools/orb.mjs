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
  constructor({python=process.env.VISIONLEAK_ORB_PYTHON || 'python3', timeoutMs=60000, memoryMiB=256, signal, ps='/bin/ps'}={}) {
    if(typeof python!=='string' || !python || !Number.isInteger(timeoutMs) || timeoutMs<1 || timeoutMs>300000 ||
      !Number.isInteger(memoryMiB) || memoryMiB<64 || memoryMiB>512 || (signal!==undefined && !(signal instanceof AbortSignal)))
      throw new VisionLeakError('ARGUMENT_ERROR','Invalid bounded ORB worker configuration');
    this.peakRssBytes=0; this.pending=null; this.failure=null; this.buffer=''; this.stderrBytes=0;
    this.child=spawn(python,['-I','-u',workerPath],{stdio:['pipe','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:'1',OPENBLAS_NUM_THREADS:'1',MKL_NUM_THREADS:'1'}});
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
        if(value.ok!==true){pending.reject(new VisionLeakError(value.code==='ORB_DEPENDENCY'?'ORB_DEPENDENCY':'ORB_PROTOCOL',value.message || 'ORB failed'));}
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

export async function runOrb({root,images,computed,options,signal}) {
  const profile=orbBinding();
  const phase={enabled:true,status:'incomplete',complete:false,inputImages:images.length,processedImages:0,
    featureImages:0,featurePixels:0,pairChecks:0,descriptorComparisons:0,emittedPairs:0,reason:''};
  const errors=[];const timing={elapsedMs:0,workerPeakRssBytes:0,memorySamplingMs:100};
  const finish=()=>({profile,phase,errors,timing});
  if(!computed.phases?.deterministic?.complete){phase.status='skipped';phase.reason='deterministic-incomplete';return finish();}
  if(computed.pairs.length>=options.maxPairs || options.maxOrbCandidates===0){phase.reason='ORB_PAIR_BUDGET';return finish();}
  const started=performance.now();
  let worker;
  const interrupt=()=>worker?.stop('ORB_CANCELLED','ORB phase cancelled by signal');
  process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
  let featureStop='';
  try {
    worker=new OrbWorker({timeoutMs:options.maxOrbMilliseconds,memoryMiB:options.maxOrbMemoryMiB,signal});
    const ready=await worker.request({op:'hello'});
    if(ready.profile!==profile.id || ready.opencv!==profile.opencv || ready.numpy!==profile.numpy || ready.opencvWheel!==profile.opencvWheel || ready.profileDigest!==profile.profileDigest || ready.workerDigest!==profile.workerDigest)throw new VisionLeakError('ORB_PROTOCOL','Worker profile does not match host');
    profile.runtime={python:ready.python,opencv:ready.opencv,opencvWheel:ready.opencvWheel,numpy:ready.numpy,opencvBuildDigest:ready.opencvBuildDigest};
    for(const image of images){
      if(phase.featureImages>=options.maxOrbImages){featureStop='ORB_IMAGE_BUDGET';break;}
      const shape=image.width*image.height<=options.maxOrbPixels?image:await samplingPlan(image.width,image.height,options.maxOrbPixels);
      if(phase.featurePixels+shape.width*shape.height>options.maxOrbTotalPixels){featureStop='ORB_PIXEL_BUDGET';break;}
      const file=await containedFile(root,image.path);
      const decodeOptions={maxPixels:options.maxOrbPixels,maxDecodePixels:options.maxDecodePixels,maxFileBytes:options.maxFileBytes};
      const bytes=await readImageBytes(file,decodeOptions);
      if(sha256(bytes)!==image.byteDigest)throw new VisionLeakError('ORB_INPUT_CHANGED','Input changed after the deterministic fingerprint');
      const decoded=await decodeBuffer(bytes,decodeOptions),gray=orbGray(decoded);
      const result=await worker.request({op:'extract',id:image.id,width:decoded.width,height:decoded.height,gray:gray.toString('base64')});
      if(!Number.isInteger(result.keypoints) || result.keypoints<0 || result.keypoints>800 || result.grayDigest!==sha256(gray) || !/^[a-f0-9]{64}$/.test(result.featureDigest))throw new VisionLeakError('ORB_PROTOCOL','Invalid feature response');
      image.orb={width:decoded.width,height:decoded.height,keypoints:result.keypoints,grayDigest:result.grayDigest,featureDigest:result.featureDigest};
      phase.featureImages++;phase.featurePixels+=gray.length;
    }
    const key=(a,b)=>JSON.stringify([a,b].sort());
    const existing=new Set(computed.pairs.map(p=>key(p.left,p.right)));
    outer:for(let i=0;i<phase.featureImages;i++){
      for(let j=0;j<i;j++){
        const a=images[j],b=images[i];
        if(a.split===b.split || existing.has(key(a.id,b.id)))continue;
        if(computed.pairs.length>=options.maxPairs || phase.emittedPairs>=options.maxOrbCandidates){phase.reason='ORB_PAIR_BUDGET';break outer;}
        const smallerFirst=a.orb.width*a.orb.height<=b.orb.width*b.orb.height?[[b,a],[a,b]]:[[a,b],[b,a]];
        for(const [original,query] of smallerFirst){
          if(phase.pairChecks>=options.maxOrbPairChecks){phase.reason='ORB_CHECK_BUDGET';break outer;}
          const cost=Math.min(original.orb.keypoints,query.orb.keypoints)<8?0:2*original.orb.keypoints*query.orb.keypoints;
          if(cost>options.maxOrbComparisons-phase.descriptorComparisons){phase.reason='ORB_WORK_BUDGET';break outer;}
          // Reserve work before entering OpenCV, including a call killed mid-flight.
          phase.pairChecks++;phase.descriptorComparisons+=cost;
          const result=await worker.request({op:'match',original:original.id,query:query.id,remainingWork:cost});
          if(result.budget || result.work!==cost || typeof result.hit!=='boolean')throw new VisionLeakError('ORB_PROTOCOL','Invalid match accounting');
          if(result.hit){
            if(!result.witness || result.witness.inliers<8 || result.witness.inliers>800)throw new VisionLeakError('ORB_PROTOCOL','Invalid geometric witness');
            computed.pairs.push({left:a.id,right:b.id,evidence:'orb-candidate',distance:null,
              matchOrb:{profile:profile.id,original:original.id,query:query.id,originalSize:[original.orb.width,original.orb.height],querySize:[query.orb.width,query.orb.height],...result.witness}});
            phase.emittedPairs++;break;
          }
        }
      }
      phase.processedImages=i+1;
    }
    phase.reason ||= featureStop;
    phase.complete=phase.reason==='' && phase.processedImages===images.length;
    phase.status=phase.complete?'complete':'incomplete';
  } catch(error) {
    phase.reason=error.code?.startsWith('ORB_')?error.code:'ORB_INPUT_ERROR';
    errors.push({code:phase.reason,message:error instanceof VisionLeakError?error.message:'ORB input or worker operation failed',stage:'orb'});
  } finally {
    process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);
    await worker?.close();timing.elapsedMs=Math.round(performance.now()-started);timing.workerPeakRssBytes=worker?.peakRssBytes ?? 0;
  }
  return finish();
}
