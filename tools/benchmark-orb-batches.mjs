// Staged host feature-capacity experiment. This bypasses Core audit orchestration,
// so it must not be reported as a complete production audit benchmark.
import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {runOrb} from './orb.mjs';
import {sha256} from './runtime.mjs';
const [sourcePath,outPath,existingData]=process.argv.slice(2);
if(!outPath)throw new Error('Usage: node tools/benchmark-orb-batches.mjs SOURCE NEW_OUTPUT');
const out=resolve(outPath);await mkdir(out,{recursive:false});
const protocol={sourceSha256:sha256(await readFile(sourcePath)),counts:[100,1000,5000],dimensions:[256,256],maxOrbComparisons:0,maxOrbMilliseconds:300000,maxOrbMemoryMiB:256,scope:'Single-photo derived capacity workload, not 5000 independent natural photographs. Feature batching cold/warm only; matching deliberately disabled by work budget. This is not an end-to-end complete audit or accuracy test.'};
await writeFile(join(out,'protocol.json'),JSON.stringify(protocol,null,2),{flag:'wx'});
const root=existingData?resolve(existingData):join(out,'data');if(!existingData)await mkdir(root);
const normalized=await sharp(sourcePath).rotate().resize(512,512,{fit:'fill'}).png().toBuffer();
const images=[];
for(let i=0;i<5000;i++){
 if(existingData){const path=`photo-${i}.png`,bytes=await readFile(join(root,path));images.push({id:`photo-${i}`,path,split:i%2?'test':'train',width:256,height:256,byteDigest:sha256(bytes)});continue;}
 const size=280+(i%150),left=(i*37)%(513-size),top=(i*71)%(513-size);
 const {data}=await sharp(normalized).extract({left,top,width:size,height:size}).resize(256,256).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 // Unique tiny marker prevents accidental byte aliases in this capacity workload.
 data[0]=i&255;data[1]=(i>>8)&255;data[2]=(i>>16)&255;
 const bytes=await sharp(data,{raw:{width:256,height:256,channels:4}}).png().toBuffer();
 const path=`photo-${i}.png`;await writeFile(join(root,path),bytes);
 images.push({id:`photo-${i}`,path,split:i%2?'test':'train',width:256,height:256,byteDigest:sha256(bytes)});
}
const results=[];
for(const count of protocol.counts){
 const options={maxPairs:10000,maxOrbCandidates:200,maxOrbImages:count,maxOrbPixels:65536,maxOrbTotalPixels:1000000000,maxDecodePixels:64000000,maxFileBytes:33554432,maxOrbComparisons:0,maxOrbPairChecks:10000,maxOrbMilliseconds:300000,maxOrbMemoryMiB:256};
 for(const mode of ['cold','warm']){
  const started=performance.now();
  const result=await runOrb({root,images:images.slice(0,count),computed:{phases:{deterministic:{complete:true}},pairs:[]},options,cacheDirectory:join(out,`cache-${count}`)});
  const row={count,mode,elapsedMs:Math.round(performance.now()-started),hostPeakRssBytes:process.resourceUsage().maxRSS*1024,...result};results.push(row);
  await writeFile(join(out,'results.json'),JSON.stringify({protocol,results},null,2));
  process.stdout.write(JSON.stringify({count,mode,featureImages:result.phase.featureImages,reason:result.phase.reason,elapsedMs:row.elapsedMs,featureHits:result.timing.featureCacheHits})+'\n');
  if(result.phase.featureImages!==count || result.phase.reason!=='ORB_WORK_BUDGET')throw new Error('Feature batching capacity gate failed');
 }
}
