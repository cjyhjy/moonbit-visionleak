import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {audit, fingerprint} from '../tools/runtime.mjs';
import * as core from '../dist/visionleak.js';
const digest = x => createHash('sha256').update(String(x)).digest('hex');
let seed = 724189;
const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
const bits = () => Array.from({length:64},()=>random()&1).join('');
const distance = (a,b) => [...a].reduce((n,c,i)=>n+(c!==b[i]),0);
function items(count) {
  return Array.from({length:count},(_,i)=>({id:String(i),split:['train','test','validation'][i%3],byteDigest:digest(`b${i}`),pixelDigest:digest(`p${i}`),dhash:bits(),contrast:180,localHashes:Array.from({length:20},bits),localContrasts:Array(20).fill(100)}));
}
test('MIH active path matches independent exhaustive pairs for every radius 0..7, including edits spread across all segments', async()=>{
  const images=items(180);
  for(let k=0;k<8;k++) {
    const h=[...images[k].dhash];
    for(let j=0;j<k;j++) {const p=(j%4)*16+Math.floor(j/4);h[p]=h[p]==='0'?'1':'0';}
    images[170+k].dhash=h.join('');
  }
  for(let threshold=0;threshold<=7;threshold++) {
    const result=await audit(images,{threshold,maxComparisons:1000000});
    const expected=[];
    for(let i=0;i<images.length;i++)for(let j=0;j<i;j++)if(images[i].split!==images[j].split&&distance(images[i].dhash,images[j].dhash)<=threshold)expected.push(`${j}|${i}`);
    assert.equal(result.complete,true);
    assert.ok(result.stats.indexOperations>0);
    assert.deepEqual(result.pairs.map(p=>`${p.left}|${p.right}`).sort(),expected.sort());
  }
});
test('MIH local index retains cross-scale witnesses and exact evidence precedence',async()=>{
  const images=items(160);
  images[159].localHashes[0]=images[0].localHashes[12];
  const result=await audit(images,{threshold:0,includeCrops:true,maxComparisons:1000000});
  assert.equal(result.complete,true);
  // 159 and 0 share a split; use a different split for the planted witness.
  images[159].split='test';
  const hit=await audit(images,{threshold:0,includeCrops:true,maxComparisons:1000000});
  const pair=hit.pairs.find(p=>p.left==='0'&&p.right==='159');
  assert.deepEqual(pair.matchLocal,{leftWindow:12,rightWindow:0,profile:'vl-local-dhash-v1'});
  images[159].byteDigest=images[0].byteDigest;
  const exact=await audit(images,{threshold:0,includeCrops:true,maxComparisons:1000000});
  assert.equal(exact.pairs.find(p=>p.left==='0'&&p.right==='159').evidence,'byte-identical');
});
test('combined scan preserves legacy local API and independent canonical digest across block boundaries',async()=>{
 for(const [width,height] of [[1,1],[7,2],[9,8],[65,65],[131,97]]) {
  const rgba=Buffer.from(Array.from({length:width*height*4},()=>random()&255));
  const rgb=Buffer.alloc(11+width*height*3);rgb.write('VL1');rgb.writeUInt32BE(width,3);rgb.writeUInt32BE(height,7);
  for(let p=0;p<width*height;p++)for(let c=0;c<3;c++)rgb[11+p*3+c]=Math.floor((rgba[p*4+c]*rgba[p*4+3]+255*(255-rgba[p*4+3])+127)/255);
  for(const includeMirrors of [false,true])for(const includeRotations of [false,true]) {
   const plain=await fingerprint({width,height,rgba,includeMirrors,includeRotations});
   const combined=await fingerprint({width,height,rgba,includeMirrors,includeRotations,includeCrops:true});
   const local=JSON.parse(core.fingerprint_local_rgba(width,height,rgba));
   assert.deepEqual(combined,{...plain,...local});
   assert.equal(combined.pixelDigest,createHash('sha256').update(rgb).digest('hex'));
  }
 }
});
