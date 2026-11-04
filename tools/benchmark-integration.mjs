// Deterministic generated pixels. Capacity/coverage measurement, not quality data.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {runAudit} from './cli.mjs';
import {sha256} from './runtime.mjs';

const [outArg,countArg,mode]=process.argv.slice(2),out=resolve(outArg || ''),count=Number(countArg);
if(!outArg || !Number.isInteger(count) || count<2 || count>5000)throw new Error('Usage: node tools/benchmark-integration.mjs NEW_DIR 2..5000');
if(mode){
  const root=join(out,'data'),started=performance.now();
  const {report}=await runAudit({root,manifest:join(out,'manifest.csv'),out:join(out,mode),options:{maxImages:count,threshold:0,includeOrb:mode==='orb',maxOrbImages:32}});
  const result={mode,images:report.images.length,complete:report.complete,elapsedMs:Math.round(performance.now()-started),
    hostPeakRssBytes:process.resourceUsage().maxRSS*1024,workerSampledPeakRssBytes:report.timing.orb?.workerPeakRssBytes ?? null,
    auditId:report.auditId,phases:report.phases,options:report.options,sourceDigests:report.images.map(i=>[i.path,i.byteDigest])};
  assert.equal(report.phases.deterministic.complete,true);assert.equal(report.images.length,count);
  if(mode==='orb'){if(count>32)assert.equal(report.phases.orb.complete,false);assert.ok(report.phases.orb.featureImages<=32);assert.ok(report.phases.orb.pairChecks>0);}
  await writeFile(join(out,mode+'.json'),JSON.stringify(result,null,2)+'\n');
}else{
  await mkdir(out);const root=join(out,'data');await mkdir(root);
  const digests=[];let state=819723;
  for(let i=0;i<count;i++){
    const rgb=Buffer.alloc(96*96*3);
    for(let p=0;p<96*96;p++){state^=state<<13;state^=state>>>17;state^=state<<5;rgb[p*3]=rgb[p*3+1]=rgb[p*3+2]=state&255;}
    const bytes=await sharp(rgb,{raw:{width:96,height:96,channels:3}}).png().toBuffer();
    const name=String(i).padStart(5,'0')+'.png';await writeFile(join(root,name),bytes);digests.push([name,sha256(bytes)]);
  }
  await writeFile(join(out,'manifest.csv'),'path,split\n'+digests.map(([name],i)=>name+','+['train','validation','test'][i%3]).join('\n')+'\n');
  for(const value of ['default','orb']){
    const run=spawnSync(process.execPath,[fileURLToPath(import.meta.url),out,String(count),value],{encoding:'utf8',timeout:180000});
    await writeFile(join(out,value+'.log'),run.stdout+run.stderr);assert.equal(run.status,0,run.stderr);
  }
  for(const [name,digest] of digests)assert.equal(sha256(await readFile(join(root,name))),digest);
  const results=await Promise.all(['default','orb'].map(async mode=>JSON.parse(await readFile(join(out,mode+'.json')))));
  assert.deepEqual(results[0].sourceDigests,results[1].sourceDigests);
  for(const r of results)delete r.sourceDigests;
  const summary={status:'passed',platform:process.platform,arch:process.arch,node:process.version,count,generatedPixelSize:[96,96],sourceDatasetUnchanged:true,
    artifactSha256:sha256(await readFile(new URL('../dist/visionleak.js',import.meta.url))),
    scope:'One fresh process per mode, generated unique noise images. Host peak RSS excludes Python; worker memory is sampled, never an aggregate peak. ORB intentionally caps its prefix at 32 and must be incomplete above that size. No natural-data accuracy or unbounded capacity claim.',results};
  await writeFile(join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));
}
