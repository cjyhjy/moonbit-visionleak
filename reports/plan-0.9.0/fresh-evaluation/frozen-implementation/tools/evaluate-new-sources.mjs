// Controlled source-lineage evaluation. Cross-file candidates remain unadjudicated.
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {runAudit} from './cli.mjs';
import {sha256} from './runtime.mjs';
const [sourcesPath,outPath]=process.argv.slice(2);
if(!outPath)throw new Error('Usage: node tools/evaluate-new-sources.mjs SOURCES NEW_OUTPUT');
const out=resolve(outPath);await mkdir(out,{recursive:false});
const sourcesRaw=await readFile(sourcesPath),sources=JSON.parse(sourcesRaw).images;
if(sources.length!==24)throw new Error('Requires 24 sources');
const protocol={sourcesSha256:sha256(sourcesRaw),generatorSha256:sha256(await readFile(new URL(import.meta.url))),sourcePartition:sources[0].partition,transforms:['byte-copy','jpeg45','random-crop-a','random-crop-b','watermark','screenshot-border'],cropSeed:'vl090:{sourceId}:{variant}',cropPolicy:'independent width/height 58..86%; uniform non-window-aligned integer offsets',queryBatchSize:24,gallery:'all 24 originals in every invocation',groundTruth:'Known same-source-file anchor relation; cross-file candidates are unadjudicated. File-lineage metrics are surrogate labels, not natural contamination accuracy.',scope:'New file IDs and byte hashes, controlled transformations. Not naturally occurring contamination or a human review study.'};
await writeFile(join(out,'protocol.json'),JSON.stringify(protocol,null,2),{flag:'wx'});
const root=join(out,'data');for(const split of ['train','test'])await mkdir(join(root,split),{recursive:true});
const records=[];
for(const source of sources){
 const raw=await readFile(resolve(source.storedFile));if(sha256(raw)!==source.sha256)throw new Error('Source changed');
 const original=await sharp(raw).rotate().toColourspace('srgb').png().toBuffer(),metadata=await sharp(original).metadata();
 const gallery=`train/${source.id}-original.png`;
 await writeFile(join(root,gallery),original);records.push({path:gallery,sourceId:source.id,role:'gallery',family:source.family,bucket:source.bucket,variant:'original',sha256:sha256(original)});
 for(const variant of protocol.transforms){
  let bytes,extension='png';
  if(variant==='byte-copy')bytes=original;
  else if(variant==='jpeg45'){bytes=await sharp(original).jpeg({quality:45}).toBuffer();extension='jpg';}
  else if(variant.startsWith('random-crop')){
   const digest=Buffer.from(sha256(Buffer.from(`vl090:${source.id}:${variant}`)),'hex');
   const w=Math.floor(metadata.width*(0.58+0.28*digest.readUInt32BE(0)/4294967295)),h=Math.floor(metadata.height*(0.58+0.28*digest.readUInt32BE(4)/4294967295));
   const left=Math.floor((metadata.width-w+1)*digest.readUInt32BE(8)/4294967296),top=Math.floor((metadata.height-h+1)*digest.readUInt32BE(12)/4294967296);
   bytes=await sharp(original).extract({left,top,width:w,height:h}).png().toBuffer();
  }else if(variant==='watermark'){
   const svg=Buffer.from(`<svg width="${metadata.width}" height="${metadata.height}"><rect x="4" y="${metadata.height-29}" width="130" height="25" fill="white" fill-opacity="0.8"/><text x="8" y="${metadata.height-12}" font-size="15" fill="black">VisionLeak test</text></svg>`);
   bytes=await sharp(original).composite([{input:svg}]).png().toBuffer();
  }else bytes=await sharp(original).extend({top:24,bottom:24,left:18,right:18,background:'#e8e8e8'}).png().toBuffer();
  const path=`test/${source.id}-${variant}.${extension}`;await writeFile(join(root,path),bytes);
  records.push({path,sourceId:source.id,role:'query',family:source.family,bucket:source.bucket,variant,sha256:sha256(bytes)});
 }
}
await writeFile(join(out,'dataset.json'),JSON.stringify({protocol,records},null,2),{flag:'wx'});
const gallery=records.filter(r=>r.role==='gallery'),queries=records.filter(r=>r.role==='query'),lookup=new Map(records.map(r=>[r.path,r]));
const key=(a,b)=>JSON.stringify([a,b].sort());
const summary={schemaVersion:'vl-new-source-evaluation-v1',protocol,sourceCount:sources.length,imageCount:records.length,batches:[],scores:{core:{tp:0,fn:0,crossFileCandidates:0},orbUnion:{tp:0,fn:0,crossFileCandidates:0}},scope:protocol.scope,negativeLabelCaveat:protocol.groundTruth};
for(let start=0;start<queries.length;start+=24){
 const selected=queries.slice(start,start+24),batch=String(start/24),manifest=join(out,`manifest-${batch}.csv`);
 await writeFile(manifest,'path,split\n'+[...gallery,...selected].map(r=>`${r.path},${r.role==='gallery'?'train':'test'}`).join('\n')+'\n',{flag:'wx'});
 const common={maxComparisons:10000000,maxExactComparisons:10000000,maxPairs:100000};
 const core=(await runAudit({root,out:join(out,`core-${batch}`),manifest,options:common})).report;
 const orb=(await runAudit({root,out:join(out,`orb-${batch}`),manifest,cache:join(out,'cache'),options:{...common,includeOrb:true,maxOrbComparisons:2000000000,maxOrbPairChecks:100000,maxOrbCandidates:1000,maxOrbMilliseconds:300000}})).report;
 if(!core.complete||!orb.complete)throw new Error(`Incomplete reference batch ${batch}: ${orb.phases.orb.reason}`);
 const scores={};
 for(const [name,report] of [['core',core],['orbUnion',orb]]){
  const ids=new Map(report.images.map(i=>[i.id,i.path])),pairs=new Set(report.pairs.map(p=>key(ids.get(p.left),ids.get(p.right))));
  const missing=selected.filter(q=>!pairs.has(key(q.path,gallery.find(g=>g.sourceId===q.sourceId).path))).map(q=>({sourceId:q.sourceId,variant:q.variant,path:q.path}));
  const crossFile=report.pairs.filter(p=>lookup.get(ids.get(p.left)).sourceId!==lookup.get(ids.get(p.right)).sourceId).map(p=>({left:ids.get(p.left),right:ids.get(p.right),evidence:p.evidence}));
  const score={tp:selected.length-missing.length,fn:missing.length,crossFileCandidates:crossFile.length,missing,crossFile};scores[name]=score;
  for(const metric of ['tp','fn','crossFileCandidates'])summary.scores[name][metric]+=score[metric];
 }
 summary.batches.push({batch,queries:selected.length,allOriginalQueryRelations:gallery.length*selected.length,report:`orb-${batch}/report.json`,cache:'cache',scores,orbPhase:orb.phases.orb,orbTiming:orb.timing.orb});
 await writeFile(join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(JSON.stringify({batch,scores:Object.fromEntries(Object.entries(scores).map(([name,s])=>[name,{tp:s.tp,fn:s.fn,crossFileCandidates:s.crossFileCandidates}]))}));
}
