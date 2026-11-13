// Component capacity only: deterministic synthetic descriptors, no images or geometry.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {OrbWorker} from './orb.mjs';
import {sha256} from './runtime.mjs';
const [out]=process.argv.slice(2);if(!out)throw new Error('Usage: node tools/benchmark-orb-index.mjs NEW_OUTPUT');
await mkdir(out,{recursive:false});
const protocol={counts:[100,1000,5000],descriptorsPerImage:800,bytesPerDescriptor:32,indexMemoryMiB:256,maxVisits:1000000000,maxMilliseconds:300000,generator:'xorshift32; per-image seed imul(index+1,2654435761); highest output byte',scope:'Synthetic independent descriptor index component, not photos, end-to-end auditing, accuracy or natural contamination.',scriptSha256:sha256(await readFile(new URL(import.meta.url)))};
await writeFile(out+'/protocol.json',JSON.stringify(protocol,null,2),{flag:'wx'});
function bytesFor(index){let state=Math.imul(index+1,2654435761)>>>0;const bytes=Buffer.alloc(800*32);for(let i=0;i<bytes.length;i++){state^=state<<13;state^=state>>>17;state^=state<<5;bytes[i]=state>>>24;}return bytes.toString('base64');}
const results=[];
for(const count of protocol.counts){
 const worker=new OrbWorker({python:process.execPath,programArgs:[fileURLToPath(new URL('./orb-index-worker.mjs',import.meta.url))],codePrefix:'ORB_INDEX',timeoutMs:protocol.maxMilliseconds,memoryMiB:protocol.indexMemoryMiB});
 const row={images:count,descriptors:count*800};const started=performance.now();
 try {
  await worker.request({op:'init',configuration:{descriptors:count*800,images:Array.from({length:count},(_,i)=>[i%2,i]),maxVisits:protocol.maxVisits}});
  for(let i=0;i<count;i++)await worker.request({op:'add',index:i,descriptors:bytesFor(i)});
  const built=await worker.request({op:'finish'});row.buildMs=Math.round(performance.now()-started);row.allocatedBytes=built.allocatedBytes;row.postings=built.entries;
  const queryStarted=performance.now();let visits=0;
  for(let i=0;i<count;i++){
   const result=await worker.request({op:'query',index:i,descriptors:bytesFor(i)});visits=result.visits;
   if(!result.complete)throw new Error(result.reason);
  }
  row.queryMs=Math.round(performance.now()-queryStarted);row.visits=visits;row.status='passed';
 }catch(error){row.status='failed';row.error=error.code||error.message;}
 finally{row.workerSampledPeakRssBytes=worker.peakRssBytes;row.elapsedMs=Math.round(performance.now()-started);await worker.close();}
 results.push(row);await writeFile(out+'/results.json',JSON.stringify({protocol,results},null,2)+'\n');console.log(JSON.stringify(row));
 if(row.status!=='passed')process.exitCode=1;
}
