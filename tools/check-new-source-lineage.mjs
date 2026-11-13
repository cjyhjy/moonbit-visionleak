// Independent acquisition checks; never removes examples after viewing outcomes.
import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256,fingerprint} from './runtime.mjs';
const [out]=process.argv.slice(2);if(!out)throw new Error('Usage: node tools/check-new-source-lineage.mjs NEW_OUT');
const oldFiles=['research/photos-v1/sources.json','research/photos-v2/sources.json','research/photos-v3/sources.json','research/followup-quality/development-sources.json','research/followup-quality/holdout/sources.json'];
const newFiles=['research/new-source-0.9.0/development/sources.json','research/new-source-0.9.0/holdout/sources.json'];
async function load(files,newSource){
 const rows=new Map();
 for(const file of files)for(const row of JSON.parse(await readFile(file)).images){
  if(rows.has(String(row.id)))continue;
  const path=row.storedFile||`research/photos-v1/originals/${row.file}`;
  const bytes=await readFile(resolve(path));if(row.sha256&&sha256(bytes)!==row.sha256)throw new Error('Source receipt changed: '+path);
  const decoded=await sharp(bytes).rotate().toColourspace('srgb').resize(128,128,{fit:'inside'}).flatten({background:'#ffffff'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const pixelDigest=sha256(Buffer.concat([Buffer.from(`${decoded.info.width}x${decoded.info.height}:`),decoded.data]));
  const fp=await fingerprint({width:decoded.info.width,height:decoded.info.height,rgba:decoded.data});
  rows.set(String(row.id),{id:String(row.id),path,partition:newSource?row.partition:'historical',family:row.family||row.scene||row.category,rawSha256:row.downloadSha256||row.sha256,storedSha256:sha256(bytes),upstreamSha1:row.upstreamSha1,pixelDigest,dhash:fp.dhash});
 }
 return [...rows.values()];
}
const old=await load(oldFiles,false),fresh=await load(newFiles,true),exact=[],near=[];
for(let i=0;i<fresh.length;i++)for(const other of [...old,...fresh.slice(0,i)]){
 const a=fresh[i],sameId=a.id===other.id,sameUpstream=!!a.upstreamSha1&&a.upstreamSha1===other.upstreamSha1;
 const sameBytes=a.rawSha256===other.rawSha256||a.storedSha256===other.storedSha256,samePixels=a.pixelDigest===other.pixelDigest;
 if(sameId||sameUpstream||sameBytes||samePixels)exact.push({left:a,right:other,sameId,sameUpstream,sameBytes,samePixels});
 const distance=[...a.dhash].reduce((sum,bit,index)=>sum+Number(bit!==other.dhash[index]),0);
 if(distance<=6)near.push({left:a,right:other,distance,adjudication:'not-adjudicated; perceptual proximity is not a source-identity verdict'});
}
await writeFile(out,JSON.stringify({schemaVersion:'vl-source-lineage-check-v1',oldSources:old.length,newSources:fresh.length,exactOverlapCount:exact.length,exact,perceptualTriage:near,scope:'Checks IDs, upstream hashes, byte hashes and exact 128px normalized pixels. Does not prove absence of transformed source reuse; dHash triage retained without exclusion. No examples removed.'},null,2)+'\n',{flag:'wx'});
if(exact.length)throw new Error('Exact source overlap: source independence not established');
