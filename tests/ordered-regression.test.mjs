import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {audit_json as baselineAudit} from '../research/baselines/0.7.0-pre-followup/dist/visionleak.js';
import {audit_json} from '../dist/visionleak.js';

const digest = value => createHash('sha256').update(String(value)).digest('hex');
function fixture() {
  let seed=1873421;
  const bit=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed&1;};
  const hash=()=>Array.from({length:64},bit).join('');
  const images=Array.from({length:180},(_,i)=>({id:String(i),split:['train','validation','test'][i%3],byteDigest:digest('b'+i),pixelDigest:digest('p'+i),dhash:hash(),dhashMirror:hash(),dhashRotations:Array.from({length:3},hash),dhashMirrorRotations:Array.from({length:3},hash),contrast:100,localHashes:Array.from({length:20},hash),localContrasts:Array(20).fill(100)}));
  // Ties and cross-scale witnesses: preserving a pair set alone is insufficient.
  for(let i=150;i<180;i++) {
    images[i].dhash=images[i-149].dhash;
    images[i].localHashes[2]=images[i-148].localHashes[11];
    images[i].localHashes[4]=images[i-148].localHashes[13];
    if(i%4===0)images[i].byteDigest=images[i-149].byteDigest;
    if(i%5===0)images[i].pixelDigest=images[i-149].pixelDigest;
  }
  return images;
}

function compare(images,options) {
  const input=JSON.stringify({images,options});
  const old=JSON.parse(baselineAudit(input)), current=JSON.parse(audit_json(input));
  assert.equal(old.complete,true);
  assert.equal(current.complete,true);
  assert.deepEqual(current.pairs,old.pairs);
  assert.deepEqual(current.groups,old.groups);
  assert.deepEqual(current.localProfile,old.localProfile);
  const phase=p=>p.evidence.endsWith('identical')?0:p.evidence==='perceptual-candidate'?1:2;
  assert.ok(current.pairs.every((p,i,a)=>i===0||phase(a[i-1])<=phase(p)));
}

test('complete staged MIH results preserve ordered evidence, tied witnesses and groups',()=>{
  const images=fixture();
  for(const threshold of [0,3,4,6,7,8])
    for(const mode of [{},{includeMirrors:true},{includeRotations:true,includeMirrors:true},{includeCrops:true}])
      compare(images,{...mode,threshold,maxComparisons:10000000,maxPairs:100000});
});

test('known photo regressions preserve each ordered pair and local witness',()=>{
  for(const path of ['reports/plan-0.5.0/crops-development/crops-audit.json','reports/plan-0.5.0/crops-holdout/crops-audit.json','reports/post-review/photos/crops-audit.json']) {
    const report=JSON.parse(readFileSync(new URL('../'+path,import.meta.url)));
    for(const threshold of [0,6,7,8]) compare(report.images,{...report.options,threshold,maxComparisons:10000000,maxPairs:100000});
  }
});
