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

test('staged mirror audit preserves the complete 0.3.0 evidence set and exact components',async()=>{
 const report=JSON.parse(await readFile(new URL('../reports/photos-v1/baseline-development/mirrors-audit.json',import.meta.url)));
 const now=await audit(report.images,report.options);
 const ordered=pairs=>[...pairs].sort((a,b)=>JSON.stringify([a.left,a.right]).localeCompare(JSON.stringify([b.left,b.right])));
 assert.deepEqual(ordered(now.pairs),ordered(report.pairs));
 assert.deepEqual(now.groups,report.groups);
 assert.equal(now.complete,true);
 assert.equal(now.phases.deterministic.complete,true);
 assert.equal(now.stats.comparisons,now.phases.deterministic.comparisons+now.phases.perceptual.comparisons);
});
