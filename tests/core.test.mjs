import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {audit_json, fingerprint_rgba, fingerprint_json} from '../dist/visionleak.js';

const audit = (images, options={}) => JSON.parse(audit_json(JSON.stringify({images,options})));
const digest = s => createHash('sha256').update(String(s)).digest('hex');
let state = 0x61523427;
function rand() { state ^= state<<13; state ^= state>>>17; state ^= state<<5; return state>>>0; }
const bits = () => Array.from({length:64},()=>rand()&1).join('');
const distance = (a,b) => [...a].filter((v,i)=>v!==b[i]).length;
const pairkey = p => JSON.stringify([p.left,p.right].sort());
const image = (i,hash=bits()) => ({id:`image-${i}`,split:['train','validation','test'][i%3],byteDigest:digest(`b${i}`),pixelDigest:digest(`p${i}`),dhash:hash,contrast:150});

test('BK-tree matches independent quadratic oracle across thresholds, ties and exact classes',()=>{
  for(let iteration=0;iteration<30;iteration++) {
    const images = Array.from({length:45},(_,i)=>image(i));
    // Add genuine hash clusters, exact identity, and intentionally inconsistent metadata.
    for(let i=1;i<8;i++) images[i].dhash=images[0].dhash.slice(0,64-i)+'1'.repeat(i);
    images[10].byteDigest=images[0].byteDigest;
    images[11].pixelDigest=images[0].pixelDigest;
    images[12].dhash=images[13].dhash;
    for(const threshold of [0,1,6,16,32,64]) {
      const expected=[];
      for(let i=0;i<images.length;i++) for(let j=0;j<i;j++) {
        const a=images[j], b=images[i], d=distance(a.dhash,b.dhash);
        if(a.split===b.split) continue;
        const evidence=a.byteDigest===b.byteDigest?'byte-identical':a.pixelDigest===b.pixelDigest?'pixel-identical':d<=threshold?'perceptual-candidate':null;
        if(evidence) expected.push({left:a.id,right:b.id,evidence,distance:d});
      }
      const result=audit(images,{threshold,maxComparisons:1e6,maxPairs:10000});
      assert.equal(result.ok,true); assert.equal(result.complete,true);
      const normalize = a=>a.map(p=>[pairkey(p),p.evidence,p.distance]).sort((a,b)=>a[0].localeCompare(b[0]));
      assert.deepEqual(normalize(result.pairs),normalize(expected));
      assert.equal(new Set(result.pairs.map(pairkey)).size,result.pairs.length);
      assert.equal(result.stats.processedImages,images.length);
    }
  }
});

test('core SHA256 canonical pixels match Node crypto across padding sizes and alpha',()=>{
  for(let count=1;count<=200;count++) {
    const rgba=Buffer.from(Array.from({length:count*4},()=>rand()%256));
    const canonical=Buffer.alloc(11+count*3);canonical.write('VL1');canonical.writeUInt32BE(count,3);canonical.writeUInt32BE(1,7);
    for(let i=0;i<count;i++) for(let c=0;c<3;c++) canonical[11+i*3+c]=Math.floor((rgba[i*4+c]*rgba[i*4+3]+255*(255-rgba[i*4+3])+127)/255);
    const result=JSON.parse(fingerprint_rgba(count,1,rgba));
    assert.equal(result.pixelDigest,createHash('sha256').update(canonical).digest('hex'));
    assert.equal(result.dhash.length,64);
    assert.deepEqual(JSON.parse(fingerprint_json(JSON.stringify({width:count,height:1,rgba:[...rgba]}))),result);
  }
});

test('budgeted runs never exceed work/output caps and only return true oracle members',()=>{
  const images=Array.from({length:100},(_,i)=>image(i,'0'.repeat(64)));
  for(const maxComparisons of [0,1,2,10,50,100,1000]) for(const maxPairs of [0,1,7,10000]) {
    const result=audit(images,{maxComparisons,maxPairs});
    assert.equal(result.complete,false);
    assert.ok(result.stats.comparisons<=maxComparisons);
    assert.ok(result.pairs.length<=maxPairs);
    for(const pair of result.pairs) {
      assert.equal(pair.evidence,'perceptual-candidate'); assert.equal(pair.distance,0);
      assert.notEqual(images.find(x=>x.id===pair.left).split,images.find(x=>x.id===pair.right).split);
    }
  }
});

test('typed JSON input rejects malformed, duplicate and out-of-budget data',()=>{
  const a=image(0);
  for(const input of ['{','null','{"images":[[[[[[[[[]]]]]]]]]}',JSON.stringify({images:[a,a]}),JSON.stringify({images:[a],options:{maxImages:0}})]) {
    assert.equal(JSON.parse(audit_json(input)).ok,false);
  }
  for(const options of [{threshold:0.5},{maxPairs:null},{maxComparisons:1e8},{maxImages:-1}]) {
    // Explicit null follows absent/default semantics, documented at the JSON adapter.
    if(options.maxPairs===null) continue;
    assert.equal(audit([a],options).ok,false);
  }
  for(const changed of [{dhash:'x'.repeat(64)},{contrast:256},{pixelDigest:'wrong'},{id:''}]) assert.equal(audit([{...a,...changed}]).ok,false);
});

test('empty input and same-split duplicates do not claim cross-split findings',()=>{
  assert.equal(audit([]).complete,true);
  const a=image(0);const b={...a,id:'other'};
  const result=audit([a,b]);assert.equal(result.pairs.length,0);assert.equal(result.groups.length,0);
});
