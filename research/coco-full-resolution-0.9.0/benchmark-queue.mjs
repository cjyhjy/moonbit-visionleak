import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
const [reportPath,queuePath]=process.argv.slice(2);
const r=JSON.parse(readFileSync(reportPath));
const pairs=new Set(JSON.parse(readFileSync(queuePath)).value.pairs);
const images=r.images;
const exact=new Set(r.pairs.filter(p=>p.evidence!=='orb-candidate').map(p=>JSON.stringify([p.left,p.right].sort())));
function released(){
 const order=[];
 for(let i=0;i<images.length;i++)for(let j=0;j<i;j++){
  if(images[i].split===images[j].split||exact.has(JSON.stringify([images[i].id,images[j].id].sort())))continue;
  if(pairs.has(i*16384+j))order.push(i*16384+j);
 }
 return order;
}
function sparse(){
 const rows=Array.from({length:images.length},()=>[]);
 for(const p of pairs)rows[Math.floor(p/16384)].push(p%16384);
 return rows.flatMap((r,i)=>r.sort((a,b)=>a-b).map(j=>i*16384+j));
}
const samples={released:[],sparse:[]};let previous;
for(const f of [released,sparse,sparse,released,released,sparse]){
 const start=performance.now(),order=f();samples[f.name].push(performance.now()-start);
 if(previous&&JSON.stringify(order)!==JSON.stringify(previous))throw Error('order');
 previous=order;
}
console.log(JSON.stringify({scope:'Isolated enumeration of actual queue; excludes coverage accounting, OpenCV, caching and other audit costs',images:images.length,selected:previous.length,samplesMs:samples},null,2));
