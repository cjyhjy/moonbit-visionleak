import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {VisionLeakError} from './runtime.mjs';

// A private Python broker owns advisory OS locks. It never reads images or cache
// payloads. Parent death closes stdin, so there is no PID file to reclaim.
export class CacheLocks {
  constructor(root,python=process.env.VISIONLEAK_ORB_PYTHON||'python3'){
    this.child=spawn(python,['-I','-u',fileURLToPath(new URL('./orb-cache-lock.py',import.meta.url)),root],{stdio:['pipe','pipe','pipe']});
    this.closed=new Promise(resolve=>this.child.once('close',resolve));
    this.pending=null;this.failure=null;this.buffer='';this.tail=Promise.resolve();
    this.child.once('error',()=>this.stop('Cannot start ORB cache OS lock broker'));
    this.child.once('close',()=>this.stop('ORB cache OS lock broker exited'));
    this.child.stdin.on('error',()=>this.stop('ORB cache OS lock pipe closed'));
    this.child.stderr.on('data',()=>this.stop('ORB cache OS lock broker failed'));
    this.child.stdout.setEncoding('utf8');
    this.child.stdout.on('data',chunk=>{
      this.buffer+=chunk;
      if(this.buffer.length>4096){this.stop('Invalid lock broker response');return;}
      let at;
      while((at=this.buffer.indexOf('\n'))>=0){
        const line=this.buffer.slice(0,at);this.buffer=this.buffer.slice(at+1);
        let value;try{value=JSON.parse(line);}catch{this.stop('Invalid lock broker JSON');return;}
        if(value?.ok!==true||!this.pending){this.stop('Unexpected lock broker response');return;}
        const pending=this.pending;this.pending=null;clearTimeout(pending.timer);pending.resolve(value);
      }
    });
  }
  stop(message){
    this.failure??=new VisionLeakError('ORB_CACHE_LOCK',message);
    if(this.pending){clearTimeout(this.pending.timer);this.pending.reject(this.failure);this.pending=null;}
    if(this.child.exitCode===null)this.child.kill('SIGKILL');
  }
  request(value){
    if(this.failure)return Promise.reject(this.failure);
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>this.stop('ORB cache lock broker timed out'),5000);
      this.pending={resolve,reject,timer};this.child.stdin.write(JSON.stringify(value)+'\n');
    });
  }
  async withLock(shard,operation){
    if(typeof shard!=='string'||!/^[a-f0-9]{2}$/.test(shard))throw new VisionLeakError('ORB_CACHE_LOCK','Invalid cache lock shard');
    const previous=this.tail;let done;this.tail=new Promise(resolve=>{done=resolve;});
    await previous;
    let acquired=false;
    try {
      for(let attempt=0;attempt<100;attempt++){
        const result=await this.request({op:'lock',shard});
        if(result.acquired===true){acquired=true;break;}
        await new Promise(resolve=>setTimeout(resolve,10));
      }
      if(!acquired)throw new VisionLeakError('ORB_CACHE_BUSY','Another process is writing this ORB cache shard; retry later');
      const result=await operation();
      if(this.failure)throw this.failure;
      return result;
    }finally{
      try{if(acquired&&!this.failure)await this.request({op:'unlock'});}
      finally{done();}
    }
  }
  async close(){await this.tail;this.stop('ORB cache lock broker closed');await this.closed;}
}
