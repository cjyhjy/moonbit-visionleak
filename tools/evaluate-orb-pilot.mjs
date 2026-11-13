// One new-source development pilot; never a holdout or natural-contamination study.
import sharp from 'sharp';
import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runAudit} from './cli.mjs';
import {sha256} from './runtime.mjs';
const [sourcePath,output,backgroundManifest]=process.argv.slice(2);
if(!output)throw new Error('Usage: node tools/evaluate-orb-pilot.mjs SOURCE OUTPUT');
const out=resolve(output);await mkdir(out,{recursive:false});
const bytes=await readFile(sourcePath);
const source={id:'usgs-candor-PSP_001641_1735',page:'https://www.usgs.gov/media/images/candor-colles-candor-chasma-mars',download:'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/PSP_001641_1735_RGB.NOMAP_50percent.jpg',license:'Public Domain (source page)',rawSha256:sha256(bytes),partition:'development-pilot'};
const backgrounds=backgroundManifest?JSON.parse(await readFile(backgroundManifest)).images.filter(i=>i.partition==='development'):[];
await writeFile(join(out,'protocol.json'),JSON.stringify({source,backgrounds:backgrounds.map(i=>({id:i.id,sha256:i.sha256,storedFile:i.storedFile,partition:'previously-used-development'})),crops:[[0.07,0.10,0.60,0.61],[0.20,0.15,0.55,0.59]],normalization:'resize inside 512x512; remove metadata; PNG; product decoder used by audit',scope:'Single-source controlled development pilot. Two anchor crop relationships. No hard-negative, holdout, natural contamination or human time claim.'},null,2),{flag:'wx'});
const root=join(out,'data');for(const split of ['train','test'])await mkdir(join(root,split),{recursive:true});
const original=await sharp(bytes).rotate().resize(512,512,{fit:'inside'}).png().toBuffer();
await writeFile(join(root,'train/original.png'),original);
const size=await sharp(original).metadata();
for(const [i,[x,y,w,h]] of [[0.07,0.10,0.60,0.61],[0.20,0.15,0.55,0.59]].entries())await sharp(original).extract({left:Math.floor(size.width*x),top:Math.floor(size.height*y),width:Math.floor(size.width*w),height:Math.floor(size.height*h)}).png().toFile(join(root,`test/crop-${i}.png`));
for(const bg of backgrounds){
 const bytes=await readFile(resolve(fileURLToPath(new URL('../',import.meta.url)),bg.storedFile));
 if(sha256(bytes)!==bg.sha256)throw new Error('Background source digest mismatch');
 await writeFile(join(root,`train/background-${bg.id}.jpg`),bytes);
}
const options={includeOrb:true,maxOrbComparisons:2000000000};
const cold=(await runAudit({root,out:join(out,'cold'),cache:join(out,'cache'),options})).report;
const warm=(await runAudit({root,out:join(out,'warm'),cache:join(out,'cache'),options})).report;
await writeFile(join(out,'summary.json'),JSON.stringify({source,complete:cold.complete,cold:cold.timing.orb,warm:warm.timing.orb,anchorPositiveRelationships:2,detectedAnchorRelationships:cold.pairs.filter(p=>cold.images.find(i=>i.id===p.left).path==='train/original.png'||cold.images.find(i=>i.id===p.right).path==='train/original.png').length,backgroundSources:backgrounds.length,otherCandidatePairs:cold.pairs.filter(p=>!([p.left,p.right].some(id=>cold.images.find(i=>i.id===id).path==='train/original.png'))).length,sameAuditId:cold.auditId===warm.auditId,scope:backgrounds.length?'Core+ORB union on one new-source controlled pilot plus previously-used development background sources; no general accuracy claim.':'Core+ORB union on one new-source controlled pilot; no negative pairs and no general accuracy claim.'},null,2),{flag:'wx'});
if(!cold.complete || cold.auditId!==warm.auditId)throw new Error('Pilot incomplete or cache identity mismatch');
