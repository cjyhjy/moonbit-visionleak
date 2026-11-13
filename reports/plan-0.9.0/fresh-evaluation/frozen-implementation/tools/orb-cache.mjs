import {mkdir,readdir,rename,writeFile,lstat,unlink} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {sha256,VisionLeakError} from './runtime.mjs';
import {CacheLocks} from './orb-cache-lock.mjs';
import {readRegular} from './input.mjs';

// 256 independently bounded shards, no automatic eviction of resumable work.
// v3 separates OS-locked writes from earlier development cache formats.
export const ORB_CACHE_SHARD_BYTES=4*1024*1024;
async function regularDirectory(path){
  await mkdir(path,{recursive:true});
  const stat=await lstat(path);
  if(!stat.isDirectory() || stat.isSymbolicLink())throw new VisionLeakError('UNSAFE_CACHE','ORB cache directories must be regular directories');
}
export async function openOrbCache(directory,binding,{shardBytes=ORB_CACHE_SHARD_BYTES}={}) {
  if(!Number.isSafeInteger(shardBytes)||shardBytes<1||shardBytes>ORB_CACHE_SHARD_BYTES)throw new Error('Invalid shard quota');
  const root=join(directory,'orb-v3');await regularDirectory(root);
  const namespace=sha256(JSON.stringify(binding));
  const pathFor=key=>{
    if(!/^[a-f0-9]{64}$/.test(key))throw new Error('Invalid cache key');
    return join(root,key.slice(0,2));
  };
  let locks;
  return {
    async close(){await locks?.close();},
    key(kind,value){return sha256(JSON.stringify([namespace,kind,value]));},
    async get(key){
      try {
        const dir=pathFor(key),stat=await lstat(dir);
        if(!stat.isDirectory()||stat.isSymbolicLink())return null;
        const envelope=JSON.parse(await readRegular(join(dir,key+'.json'),512*1024));
        return envelope.key===key && envelope.digest===sha256(JSON.stringify(envelope.value))?envelope.value:null;
      } catch{return null;}
    },
    async put(key,value){
      const bytes=JSON.stringify({key,digest:sha256(JSON.stringify(value)),value});
      if(Buffer.byteLength(bytes)>512*1024)throw new VisionLeakError('ORB_CACHE_BUDGET','ORB cache entry exceeds 512 KiB');
      const dir=pathFor(key);await regularDirectory(dir);
      locks??=new CacheLocks(root);
      return locks.withLock(key.slice(0,2),async()=>{
      const temp=join(dir,`.tmp-${process.pid}-${randomUUID()}`);
      try {
        let used=0;
        for(const name of await readdir(dir)){
          if(!/^[a-f0-9]{64}\.json$/.test(name)&&!name.startsWith('.tmp-'))continue;
          const stat=await lstat(join(dir,name));
          if(!stat.isFile()||stat.isSymbolicLink())throw new VisionLeakError('UNSAFE_CACHE','Unexpected ORB cache entry');
          used+=stat.size;
        }
        // Include the temporary copy: peak logical file bytes remain bounded too.
        if(used+Buffer.byteLength(bytes)>shardBytes)throw new VisionLeakError('ORB_CACHE_BUDGET','ORB cache shard is full (4 MiB/shard, 1 GiB total). Use a new cache directory or remove old disposable cache data.');
        await writeFile(temp,bytes,{flag:'wx',mode:0o600});
        await rename(temp,join(dir,key+'.json'));
      } finally {await unlink(temp).catch(()=>{});}
      });
    }
  };
}
