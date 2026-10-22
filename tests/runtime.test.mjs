import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint } from '../tools/runtime.mjs';

test('public JS pixel adapter rejects inputs that the compiled ABI could coerce', async () => {
  const invalid = [
    {width:0.5,height:2,rgba:new Uint8Array(0)},
    {width:NaN,height:1,rgba:new Uint8Array(4)},
    {width:1,height:Infinity,rgba:new Uint8Array(4)},
    {width:'1',height:1,rgba:new Uint8Array(4)},
    {width:1,height:1,rgba:'abcd'},
    {width:1,height:1,rgba:[0,0,0,255]},
    {width:1,height:1,rgba:new Float32Array([0,0,0,255])},
  ];
  for (const input of invalid) {
    await assert.rejects(() => fingerprint(input), error => error.code === 'INVALID_PIXELS');
  }
});

test('public JS pixel adapter accepts Uint8Array and the Buffer decoder output', async () => {
  const array = await fingerprint({width:1,height:1,rgba:new Uint8Array([7,13,29,255])});
  const buffer = await fingerprint({width:1,height:1,rgba:Buffer.from([7,13,29,255])});
  assert.equal(array.ok,true);
  assert.equal(buffer.pixelDigest,array.pixelDigest);
});
