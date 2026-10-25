import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint } from '../tools/runtime.mjs';
// Physical transformations, all distances and budget cases live in MoonBit.
test('mirror host adapter routes to the compiled optional export',async()=>{
  const plain=await fingerprint({width:1,height:1,rgba:Buffer.from([7,13,29,255])});
  const both=await fingerprint({width:1,height:1,rgba:Buffer.from([7,13,29,255]),includeMirrors:true});
  assert.equal(both.dhashMirror,plain.dhash);
  assert.equal(both.pixelDigest,plain.pixelDigest);
  assert.equal(plain.dhashMirror,undefined);
  await assert.rejects(fingerprint({width:1,height:1,rgba:Buffer.alloc(4),includeMirrors:'yes'}),{code:'INVALID_PIXELS'});
});
