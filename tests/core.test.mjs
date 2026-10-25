import test from 'node:test';
import assert from 'node:assert/strict';
import { audit_json, fingerprint_rgba, fingerprint_json, sha256_new, sha256_update, sha256_final } from '../dist/visionleak.js';
import { createHash } from 'node:crypto';

// Core algorithm/oracle cases now run on JS, Wasm GC and native in
// core/audit_regression_wbtest.mbt. These checks only cover the JS/Bytes ABI.
test('compiled JSON and bytes exports preserve the host protocol', () => {
  const rgba = Buffer.from([7, 13, 29, 255]);
  const a = JSON.parse(fingerprint_rgba(1, 1, rgba));
  const b = JSON.parse(fingerprint_json(JSON.stringify({width:1,height:1,rgba:[...rgba]})));
  assert.deepEqual(a,b);
  assert.equal(a.ok,true);
  assert.equal(JSON.parse(audit_json('{"images":[]}')).complete,true);
});

test('incremental SHA-256 opaque JS state accepts Buffer chunks and matches Node crypto', () => {
  const bytes = Buffer.from(Array.from({length:1031},(_,i)=>(i*71+19)%256));
  for (const chunkSize of [1,55,56,63,64,65,257,1031]) {
    const context = sha256_new();
    for (let i=0;i<bytes.length;i+=chunkSize) assert.equal(sha256_update(context,bytes.subarray(i,i+chunkSize)),true);
    const expected = createHash('sha256').update(bytes).digest('hex');
    assert.equal(sha256_final(context),expected);
    assert.equal(sha256_final(context),expected);
    assert.equal(sha256_update(context,Buffer.alloc(0)),false);
  }
});
