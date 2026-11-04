// Compare exact outputs, then independently enumerate full candidate relations.
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const baseline=await import(pathToFileURL(root+'research/baselines/0.7.0-released/dist/visionleak.js'));
const candidate=await import(pathToFileURL(root+'dist/visionleak.js'));
const read=name=>JSON.parse(readFileSync(root+name,'utf8'));
test('released 0.7.0: identical ordered full/partial outputs, accounting and independent candidates',()=>{
assert.equal(createHash('sha256').update(readFileSync(root+'research/baselines/0.7.0-released/dist/visionleak.js')).digest('hex'),'ad05cc71d2d8ef8620b7fe7695b5cd7b38c669c02e8b0a7afd6e943acef3b701');
let seed=125733;
const bit=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed&1;};
const hash=()=>Array.from({length:64},bit).join('');
const d=x=>createHash('sha256').update(x).digest('hex');
const repeated=Array.from({length:180},(_,i)=>({id:String(i),split:['train','validation','test'][i%3],byteDigest:d('b'+i),pixelDigest:d('p'+i),dhash:hash(),contrast:100,localHashes:Array.from({length:20},(_,w)=>i>150&&w===0?'0'.repeat(64):hash()),localContrasts:Array(20).fill(100)}));
for(let i=174;i<180;i++){
  if(i%3===0)repeated[i].byteDigest=repeated[i-170].byteDigest;
  else if(i%3===1)repeated[i].pixelDigest=repeated[i-170].pixelDigest;
  else repeated[i].dhash=repeated[i-170].dhash;
}
const cases=[['repeated-with-exact-and-global-ties',repeated],['known-photos',read('reports/post-review/photos/crops-audit.json').images]];
const pack=h=>[Number.parseInt(h.slice(0,32),2),Number.parseInt(h.slice(32),2)];
const pop=v=>{v-=v>>>1&0x55555555;v=(v&0x33333333)+(v>>>2&0x33333333);v=(v+(v>>>4))&0x0f0f0f0f;return Math.imul(v,0x01010101)>>>24;};
const distance=(a,b)=>pop(a[0]^b[0])+pop(a[1]^b[1]);
const key=(a,b)=>[a,b].sort().join('\0');
let comparisons=0,oracles=0;
const oracleCounts=[];
for(const [name,images] of cases)for(const threshold of [0,3,4,6,7,8]){
  for(const maxComparisons of [0,128,1000,1000000])for(const maxPairs of [0,1,100000]){
    const input=JSON.stringify({images,options:{includeCrops:true,threshold,maxComparisons,maxPairs}});
    assert.equal(candidate.audit_json(input),baseline.audit_json(input),`${name}/${threshold}/${maxComparisons}/${maxPairs}`);
    comparisons++;
  }
  const input=JSON.stringify({images,options:{includeCrops:true,threshold,maxComparisons:10000000,maxPairs:100000}});
  const actual=JSON.parse(candidate.audit_json(input));assert.equal(actual.complete,true);
  const decoded=images.map(x=>({...x,global:pack(x.dhash),locals:x.localHashes.map(pack)}));
  const expected=new Map();
  for(let i=0;i<decoded.length;i++)for(let j=i+1;j<decoded.length;j++){
    const a=decoded[i],b=decoded[j];if(a.split===b.split)continue;
    let evidence=a.byteDigest===b.byteDigest?'byte-identical':a.pixelDigest===b.pixelDigest?'pixel-identical':distance(a.global,b.global)<=threshold?'perceptual-candidate':null;
    if(!evidence){
      outer:for(let u=0;u<20;u++)if(a.localContrasts[u]>=16)for(let v=0;v<20;v++)if(b.localContrasts[v]>=16&&distance(a.locals[u],b.locals[v])<=threshold){evidence='local-candidate';break outer;}
    }
    if(evidence)expected.set(key(a.id,b.id),evidence);
  }
  assert.deepEqual(new Map(actual.pairs.map(p=>[key(p.left,p.right),p.evidence])),expected);
  const lookup=new Map(decoded.map(x=>[x.id,x]));
  for(const pair of actual.pairs)if(pair.evidence==='local-candidate'){
    const a=lookup.get(pair.left),b=lookup.get(pair.right),u=pair.matchLocal.leftWindow,v=pair.matchLocal.rightWindow;
    assert.ok(a.localContrasts[u]>=16&&b.localContrasts[v]>=16);
    assert.equal(distance(a.locals[u],b.locals[v]),pair.distance);
  }
  oracles++;oracleCounts.push({name,threshold,pairs:expected.size});
}
assert.equal(comparisons,144);assert.equal(oracles,12);
});
