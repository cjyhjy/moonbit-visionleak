import {readFile,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {sha256} from './runtime.mjs';
import {rankDescriptors} from './orb-lsh.mjs';
const [reportPath,cacheDirectory,out,rawBits='20',rawTables='8']=process.argv.slice(2);
if(!out)throw new Error('Usage: node tools/orb-lsh-experiment.mjs COMPLETE_REPORT CACHE NEW_OUT [BITS TABLES]');
const rawReport=await readFile(reportPath),report=JSON.parse(rawReport);
if(!report.phases.orb?.complete)throw new Error('Requires complete exhaustive reference');
const images=report.images.filter(i=>i.orb),wanted=new Set(images.map(i=>i.orb.featureDigest)),features=new Map();
const cacheRoot=join(cacheDirectory,'orb-v3');
for(const name of await readdir(cacheRoot,{recursive:true})){
 if(!name.endsWith('.json'))continue;
 const envelope=JSON.parse(await readFile(join(cacheRoot,name)));
 if(envelope.digest!==sha256(JSON.stringify(envelope.value)))continue;
 const value=envelope.value;
 if(!value?.payload||!wanted.has(value.featureDigest))continue;
 const descriptors=Buffer.from(value.payload.descriptors,'base64');
 if(descriptors.length!==value.keypoints*32)throw new Error('Invalid feature length');
 features.set(value.featureDigest,descriptors);
}
for(const image of images){image.descriptors=features.get(image.orb.featureDigest);if(!image.descriptors)throw new Error('Missing feature');}
const key=(a,b)=>JSON.stringify([a,b].sort()),corePairs=new Set(report.pairs.filter(p=>p.evidence!=='orb-candidate').map(p=>key(p.left,p.right)));
const started=performance.now(),index=rankDescriptors(images,{bits:Number(rawBits),tables:Number(rawTables),excludedPairs:corePairs});
const positives=report.pairs.filter(p=>p.evidence==='orb-candidate');
let eligible=0;for(let i=0;i<images.length;i++)for(let j=0;j<i;j++)if(images[i].split!==images[j].split&&!corePairs.has(key(images[i].id,images[j].id)))eligible++;
const results=[1,5,10,25].map(k=>{
 const selected=new Set();for(const [query,rank] of index.ranks)for(const original of rank.slice(0,k))selected.add(key(query,original.id));
 const missed=positives.filter(p=>!selected.has(key(p.left,p.right))).map(p=>[p.left,p.right]),n=positives.length,hit=n-missed.length;
 const p=n?hit/n:0,z=1.959963984540054,z2=z*z,center=n?(p+z2/(2*n))/(1+z2/n):null,half=n?z*Math.sqrt(p*(1-p)/n+z2/(4*n*n))/(1+z2/n):null;
 return {k,eligiblePairs:eligible,selectedPairs:selected.size,pairReduction:selected.size?eligible/selected.size:null,referencePositivePairs:n,recalled:hit,recall:n?hit/n:null,pairWilson95DescriptiveOnly:n?[center-half,center+half]:null,missed};
});
await writeFile(out,JSON.stringify({schemaVersion:'vl-orb-lsh-feasibility-v1',reportSha256:sha256(rawReport),configuration:{bits:Number(rawBits),tables:Number(rawTables),seed:'vl-orb-lsh-v1',minimumVotes:1,selection:'symmetric union top-k, one vote per query descriptor/image across all tables; Core pairs excluded'},measurements:{buildMs:index.builtAt-started,queryMs:index.queriedAt-index.builtAt,descriptors:index.descriptors,buckets:index.bucketCount,postingVisits:index.postingVisits,lookups:index.lookups,hostPeakRssBytes:process.resourceUsage().maxRSS*1024},results,scope:'Research-only fixed bit projections; complete ORB-only emitted positives are reference. Pair-level Wilson intervals are descriptive and ignore same-source correlation; not source-population confidence. No product acceleration or natural-contamination claim. Run each configuration in a fresh Node process.'},null,2)+'\n',{flag:'wx'});
