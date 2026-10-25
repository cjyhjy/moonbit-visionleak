import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {fingerprint,audit} from '../tools/runtime.mjs';
import {validateReport} from '../demo/review-validation.mjs';
import {workflow} from '../tools/workflow.mjs';
const windows=[[0,0,1000,1000],...[900,750,500].flatMap(s=>{const g=1000-s;return [[0,0],[g,0],[0,g],[g,g],[g/2,g/2]].map(([x,y])=>[x,y,x+s,y+s]);}),[0,0,750,1000],[250,0,1000,1000],[0,0,1000,750],[0,250,1000,1000]];
function reference(w,h,rgba){
 const gray=Array.from({length:w*h},(_,p)=>{const a=rgba[p*4+3];const rgb=[0,1,2].map(k=>Math.floor((rgba[p*4+k]*a+255*(255-a)+127)/255));return Math.floor((299*rgb[0]+587*rgb[1]+114*rgb[2]+500)/1000);});
 return windows.map(r=>{const l=Math.floor(r[0]*w/1000),t=Math.floor(r[1]*h/1000),rr=Math.max(l+1,Math.floor(r[2]*w/1000)),bb=Math.max(t+1,Math.floor(r[3]*h/1000));const grid=[];
 for(let y=0;y<8;y++)for(let x=0;x<9;x++){const x0=l+Math.floor(x*(rr-l)/9),x1=Math.min(rr,Math.max(x0+1,l+Math.floor((x+1)*(rr-l)/9))),y0=t+Math.floor(y*(bb-t)/8),y1=Math.min(bb,Math.max(y0+1,t+Math.floor((y+1)*(bb-t)/8)));let sum=0;for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++)sum+=gray[yy*w+xx];grid.push(Math.floor(sum/((x1-x0)*(y1-y0))));}
 return {hash:Array.from({length:64},(_,i)=>grid[Math.floor(i/8)*9+i%8+1]>grid[Math.floor(i/8)*9+i%8]?'1':'0').join(''),contrast:Math.max(...grid)-Math.min(...grid)};});
}
test('20 local integral-image fingerprints match independent direct pixel box sums',async()=>{
 for(const [width,height] of [[1,1],[2,7],[19,17],[64,48]]){
 const rgba=Buffer.from(Array.from({length:width*height*4},(_,i)=>(i*73+Math.floor(i/7)*31)%256));const fp=await fingerprint({width,height,rgba,includeCrops:true});const expected=reference(width,height,rgba);
 assert.deepEqual(fp.localHashes,expected.map(x=>x.hash));assert.deepEqual(fp.localContrasts,expected.map(x=>x.contrast));assert.equal(fp.localHashes[0],fp.dhash);
 }
});
function pattern(){let s=713;const cells=Array.from({length:256},()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return s>>>0;});return Buffer.from(Array.from({length:128*128*4},(_,i)=>i%4===3?255:(cells[Math.floor(Math.floor(i/4)/128/8)*16+Math.floor((Math.floor(i/4)%128)/8)]>>>(i%4*8))&255));}
test('actual CLI offset/aspect crops remain candidates, enter gate, validate and never form exact groups',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'vl-crops-'));try{
 const root=join(temp,'data');await mkdir(join(root,'train'),{recursive:true});await mkdir(join(root,'test'));
 const raw=pattern();const original=sharp(raw,{raw:{width:128,height:128,channels:4}});
 await original.clone().png().toFile(join(root,'train','source.png'));
 await original.clone().extract({left:32,top:0,width:96,height:96}).png().toFile(join(root,'test','offset.png'));
 await original.clone().extract({left:0,top:0,width:96,height:128}).png().toFile(join(root,'test','aspect.png'));
 const run=(name,args)=>spawnSync(process.execPath,['tools/cli.mjs','audit','--root',root,'--out',join(temp,name),'--threshold','0',...args],{encoding:'utf8'});
 assert.equal(run('plain',[]).status,0);const base=JSON.parse(await readFile(join(temp,'plain/report.json'),'utf8'));assert.equal(base.pairs.length,0);
 const result=run('crop',['--include-crops','--fail-on','candidate']);assert.equal(result.status,3,result.stderr);
 const report=JSON.parse(await readFile(join(temp,'crop/report.json'),'utf8'));assert.equal(report.complete,true);assert.equal(report.pairs.length,2);assert.ok(report.pairs.every(p=>p.evidence==='local-candidate'&&p.distance===0));assert.deepEqual(report.groups,[]);assert.equal(validateReport(report).pairs.length,2);assert.equal(JSON.parse(result.stdout).evidenceCounts.localCandidate,2);
 const invalid=structuredClone(report);invalid.pairs[0].matchLocal.leftWindow=20;assert.throws(()=>validateReport(invalid),/局部/);
 const scope=workflow({operation:'groups',report});assert.equal(scope.candidateGroups.length,1);
 }finally{await rm(temp,{recursive:true,force:true});}
});
test('local-only evidence is skipped by deterministic verify and cannot trigger the pixel gate',async()=>{
 const make=(id,split,bit)=>({id,split,byteDigest:bit.repeat(64),pixelDigest:bit.repeat(64),dhash:bit==='a'?'0'.repeat(64):'1'.repeat(64),contrast:150,localHashes:Array(20).fill('01'.repeat(32)),localContrasts:Array(20).fill(100)});
 const images=[make('a','train','a'),make('b','test','b')];const report=await audit(images,{includeCrops:true});assert.equal(report.pairs[0].evidence,'local-candidate');assert.equal(workflow({operation:'gate',report,failOn:'pixel'}).exitCode,0);
 for(const n of [0,1,10,30]){const limited=await audit(images,{includeCrops:true,maxComparisons:n});assert.equal(limited.complete,false);assert.ok(limited.stats.comparisons<=n);}
 await assert.rejects(audit(images.map(x=>({...x,localHashes:['bad']})),{includeCrops:true}));
});
