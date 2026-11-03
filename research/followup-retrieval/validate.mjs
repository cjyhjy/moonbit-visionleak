// Compare exact outputs, then independently enumerate full candidate relations.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const baseline=await import(pathToFileURL(root+'dist/visionleak.js'));
const candidate=await import(pathToFileURL(root+'output/followup-retrieval/candidate/dist/visionleak.js'));
const read=name=>JSON.parse(readFileSync(root+name,'utf8'));
const repeated=read('output/followup-retrieval/inputs/repeated-local.json').images.slice(0,180);
for(let i=174;i<180;i++){
  if(i%3===0)repeated[i].byteDigest=repeated[i-170].byteDigest;
  else if(i%3===1)repeated[i].pixelDigest=repeated[i-170].pixelDigest;
  else repeated[i].dhash=repeated[i-170].dhash;
}
const cases=[['repeated-with-exact-and-global-ties',repeated],['known-photos',read('output/followup-retrieval/inputs/known-photos.json').images]];
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
const record={status:'passed',fullOutputBudgetComparisons:comparisons,independentExhaustiveCases:oracles,scope:'Strict full output includes complete/partial pair order, all witness fields, exact groups, coverage, work counters and budget reasons. Independent exhaustive oracle checks candidate completeness and evidence precedence at MIH radii and radius-8 fallback.',oracleCounts,scriptSha256:createHash('sha256').update(readFileSync(fileURLToPath(import.meta.url))).digest('hex')};
writeFileSync(root+'reports/followup-retrieval/validation/semantic.json',JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(record));
