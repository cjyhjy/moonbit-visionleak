// Offline feasibility baseline only. Does not change product candidate selection.
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {sha256} from './runtime.mjs';
const [reportPath,cacheDirectory,out]=process.argv.slice(2);
if(!out)throw new Error('Usage: node tools/orb-retrieval-experiment.mjs REPORT CACHE OUT');
const report=JSON.parse(await readFile(reportPath));
if(!report.phases.orb?.complete)throw new Error('Requires complete exhaustive ORB reference');
const features=new Map();
const root=join(cacheDirectory,'orb-v3');
for(const name of await readdir(root,{recursive:true})){
 if(!name.endsWith('.json'))continue;
 const entry=JSON.parse(await readFile(join(root,name)));
 if(entry.digest!==sha256(JSON.stringify(entry.value)))continue;
 const f=entry.value;if(!f.payload)continue;
 const bytes=Buffer.from(f.payload.descriptors,'base64'),v=new Float64Array(256);
 for(let i=0;i<bytes.length;i++)for(let bit=0;bit<8;bit++)v[(i%32)*8+bit]+=(bytes[i]>>bit)&1;
 const n=f.payload.points.length;for(let i=0;i<v.length;i++)v[i]=n?v[i]/n:0;
 features.set(f.featureDigest,v);
}
const images=report.images.filter(i=>i.orb),ranks=new Map();
for(const q of images){
 const a=features.get(q.orb.featureDigest);if(!a)throw new Error('Missing feature');
 const others=images.filter(o=>o.split!==q.split).map(o=>{
 const b=features.get(o.orb.featureDigest);if(!b)throw new Error('Missing feature');
 return {id:o.id,distance:a.reduce((s,x,i)=>s+(x-b[i])**2,0)};
 }).sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id));
 ranks.set(q.id,new Map(others.map((o,i)=>[o.id,i+1])));
}
const positives=report.pairs.filter(p=>p.evidence==='orb-candidate');
const ks=[1,5,10,25];
const results=ks.map(k=>{
 const recalled=positives.filter(p=>Math.min(ranks.get(p.left).get(p.right),ranks.get(p.right).get(p.left))<=k).length;
 const selected=new Set();for(const [q,rs] of ranks)for(const [id,rank] of rs)if(rank<=k)selected.add(JSON.stringify([q,id].sort()));
 const total=[...ranks.values()].reduce((n,r)=>n+r.size,0)/2;
 return {k,referencePositivePairs:positives.length,recalled,recall:positives.length?recalled/positives.length:null,selectedPairs:selected.size,totalCrossSplitPairs:total,reduction: selected.size?total/selected.size:null};
});
await writeFile(out,JSON.stringify({schemaVersion:'vl-orb-retrieval-feasibility-v1',reportSha256:sha256(await readFile(reportPath)),method:'mean descriptor bit frequencies, squared distance, symmetric top-k union',scope:'Recall relative to ORB-only emitted exhaustive positives; excludes earlier Core pairs. No end-to-end accuracy or fresh-source claim. Baseline parameters fixed before new-source evaluation.',results},null,2)+'\n',{flag:'wx'});
