import test from 'node:test';
import assert from 'node:assert/strict';
import {fingerprint,audit} from '../tools/runtime.mjs';
import {readFile} from 'node:fs/promises';

test('orientation host adapter routes booleans and bytes to the optional core export',async()=>{
  const fp=await fingerprint({width:1,height:1,rgba:Buffer.alloc(4),includeRotations:true,includeMirrors:true});
  assert.equal(fp.dhashRotations.length,3);
  assert.equal(fp.dhashMirrorRotations.length,3);
  await assert.rejects(fingerprint({width:1,height:1,rgba:Buffer.alloc(4),includeRotations:'true'}),{code:'INVALID_PIXELS'});
});

test('legacy mirror mode preserves complete 0.3.0 evidence and work counts on the real development photos',async()=>{
 const report=JSON.parse(await readFile(new URL('../reports/photos-v1/baseline-development/mirrors-audit.json',import.meta.url)));
 const now=await audit(report.images,report.options);
 for(const name of ['pairs','groups','stats'])assert.deepEqual(now[name],report[name]);
});
