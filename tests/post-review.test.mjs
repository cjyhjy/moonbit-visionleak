import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink, stat, utimes } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { audit } from '../tools/runtime.mjs';
import { runAudit } from '../tools/cli.mjs';
import { verifyReportIdentity } from '../demo/report-identity.mjs';
import { parseCSV } from '../tools/input.mjs';
import { workflow } from '../tools/workflow.mjs';

const make = (id, split, digest, hash = '0'.repeat(64)) => ({ id, split, byteDigest: digest.repeat(64), pixelDigest: digest.repeat(64), dhash: hash, contrast: 100 });
test('late exact duplicates survive zero perceptual budget; exact and output budgets remain binding', async () => {
  const images = [make('a','train','a'), make('b','validation','b','1'.repeat(64)), make('c','test','a')];
  const result = await audit(images, { maxComparisons: 0 });
  assert.equal(result.complete, false);
  assert.equal(result.phases.deterministic.complete, true);
  assert.equal(result.phases.deterministic.processedImages, 3);
  assert.deepEqual(result.pairs.map(p => [p.left,p.right,p.evidence]), [['a','c','byte-identical']]);
  assert.equal(result.phases.perceptual.reason, 'ComparisonBudget');
  for (const options of [{ maxExactComparisons: 0 }, { maxPairs: 0 }]) {
    const partial = await audit(images, options);
    assert.equal(partial.phases.deterministic.complete, false);
    assert.equal(partial.phases.perceptual.status, 'skipped');
    assert.equal(partial.stats.processedImages, 0);
    assert.equal(partial.pairs.length, 0);
  }
  const cropped = images.map(x => ({ ...x, localHashes: Array(20).fill(x.dhash), localContrasts: Array(20).fill(100) }));
  const localStop = await audit(cropped, { includeCrops: true, maxComparisons: 10 });
  assert.equal(localStop.phases.deterministic.complete, true);
  assert.equal(localStop.phases.perceptual.complete, true);
  assert.equal(localStop.phases.local.complete, false);
  assert.equal(localStop.complete, false);
  for (const phase of Object.values(localStop.phases)) assert.ok(phase.comparisons <= phase.maxComparisons);
  assert.equal(localStop.stats.comparisons, Object.values(localStop.phases).reduce((n,p) => n+p.comparisons,0));
});

test('overall coverage excludes skipped phases while exhaustion names the actual phase and input', async () => {
  const images = [make('a','train','a'), make('b','validation','b','1'.repeat(64)), make('c','test','a')]
    .map(x => ({...x,path:x.id,localHashes:Array(20).fill(x.dhash),localContrasts:Array(20).fill(100)}));
  for (const [options, phase, atImage, phaseProcessed] of [
    [{maxExactComparisons:0}, 'deterministic', 'c', 2],
    [{includeCrops:true,maxExactComparisons:0}, 'deterministic', 'c', 2],
    [{includeCrops:true,maxComparisons:0}, 'perceptual', 'b', 1],
    [{includeCrops:true,maxComparisons:10}, 'local', 'a', 0],
    [{maxPairs:0}, 'deterministic', 'c', 2],
  ]) {
    const result = await audit(images, options);
    const expected = Math.min(...Object.values(result.phases).filter(p => p.enabled).map(p => p.processedImages));
    assert.equal(result.stats.processedImages, expected);
    assert.equal(expected, 0);
    const report = {...result,images,errors:[],scope:{splitDirectories:{}}};
    const coverage = workflow({operation:'coverage',report,discovered:images,ignored:[]}).coverage;
    assert.equal(Object.values(coverage.splits).reduce((n,s) => n+s.audited,0),0);
    assert.equal(coverage.unprocessedKnownFiles,3);
    assert.deepEqual(coverage.budgetExhaustion.map(e => [e.phase,e.atImage,e.processedImages]),[[phase,atImage,phaseProcessed]]);
  }
  const complete = await audit(images, {maxComparisons:1000000});
  assert.equal(complete.phases.local.status,'disabled');
  assert.equal(complete.stats.processedImages,3);
  const legacy = workflow({operation:'coverage',report:{images,errors:[],scope:{},stats:{processedImages:2,reason:'ComparisonBudget',emittedPairs:0}},discovered:images,ignored:[]}).coverage;
  assert.equal(legacy.budgetExhaustion[0].atImage,'c');
  assert.equal(legacy.budgetExhaustion[0].phase,undefined);
  assert.equal(legacy.splits.train.audited,1);
});
async function fixture(t) {
  const temp = await mkdtemp('/tmp/visionleak-post-review-');
  t.after(() => rm(temp, { recursive:true, force:true }));
  const root = join(temp,'data'); await mkdir(root);
  const pixel = Buffer.from(Array.from({length: 36*32*3}, (_,i) => i*17%251));
  const image = await sharp(pixel,{raw:{width:36,height:32,channels:3}}).png().toBuffer();
  await writeFile(join(root,'a,图片.png'),image); await writeFile(join(root,'b.png'),image);
  const manifest = join(temp,'input.csv');
  await writeFile(manifest,'\ufeffpath,split\r\n"a,图片.png",training\r\nb.png,testing\r\n');
  let n = 0;
  return { temp, root, manifest, cache:join(temp,'cache'), run: extra => runAudit({root,manifest,out:join(temp,`out-${n++}`),...extra}) };
}
test('CSV quoted paths, aliases, file scope, raw identity binding and revalidation', async t => {
  const f = await fixture(t); const {report} = await f.run();
  assert.equal(report.complete,true); assert.equal(report.scope.input.layout,'csv-manifest');
  assert.deepEqual(report.images.map(i => [i.path,i.split]), [['a,图片.png','train'],['b.png','test']]);
  await verifyReportIdentity(report);
  await writeFile(f.manifest,'path,split\n"a,图片.png",train\nb.png,test\n');
  assert.notEqual((await f.run()).report.auditId,report.auditId);
  await writeFile(f.manifest,'path,split\nmissing.png,validation\nb.png,test\n');
  const partial = (await f.run()).report;
  assert.equal(partial.complete,false); assert.equal(partial.coverage.deterministicInputComplete,false);
  assert.equal(partial.coverage.splits.validation.rejectedByCode.MISSING_INPUT,1);
  assert.equal(partial.phases.deterministic.complete,true);
  for (const csv of ['path,split\nb.png,test\nb.png,train\n','path,split\n../b.png,test\n','path,split\nC:/b.png,test\n','path,split\nb.png,unknown\n','path,split\n"b.png"x,test\n']) {
    await writeFile(f.manifest,csv); await assert.rejects(f.run());
  }
  await symlink(f.root,join(f.root,'alias'));
  await writeFile(f.manifest,'path,split\nalias/b.png,test\nb.png,train\n');
  const unsafe=(await f.run()).report;
  assert.equal(unsafe.complete,false); assert.ok(unsafe.errors.some(e => e.code==='UNSAFE_PATH'));
  assert.deepEqual(parseCSV('path,split\n"a""b.png",test\n'),[['path','split'],['a"b.png','test']]);
});
test('cache is content/config keyed, result-identical, corruption-tolerant and budget-aware', async t => {
  const f = await fixture(t);
  const uncached = (await f.run()).report;
  const cold = await f.run({cache:f.cache}), warm = await f.run({cache:f.cache});
  assert.equal(cold.report.auditId,uncached.auditId); assert.equal(warm.report.auditId,uncached.auditId);
  assert.equal(warm.cache.hits,2); assert.equal(warm.cache.misses,0);
  const low = (await f.run({cache:f.cache,options:{maxDecodePixels:1}})).report;
  assert.equal(low.complete,false); assert.equal(low.images.length,0); assert.ok(low.errors.every(e => e.code==='PIXEL_BUDGET'));
  const totalOptions={maxTotalPixels:36*32};
  assert.equal((await f.run({cache:f.cache,options:totalOptions})).report.auditId,(await f.run({options:totalOptions})).report.auditId);
  const smallBytes={maxFileBytes:1};
  assert.equal((await f.run({cache:f.cache,options:smallBytes})).report.auditId,(await f.run({options:smallBytes})).report.auditId);
  const config = await f.run({cache:f.cache,options:{includeCrops:true,includeMirrors:true,includeRotations:true}});
  assert.ok(config.cache.misses>0); assert.notEqual(config.report.auditId,warm.report.auditId);
  assert.equal((await f.run({cache:f.cache,options:{includeCrops:true,includeMirrors:true,includeRotations:true}})).cache.hits,2);
  for (const name of await readdir(f.cache)) await writeFile(join(f.cache,name),'{corrupt');
  const repaired=await f.run({cache:f.cache}); assert.equal(repaired.report.auditId,uncached.auditId); assert.ok(repaired.cache.invalid>0);
  // Preserve timestamp and filename: byte content alone must invalidate the entry.
  const path=join(f.root,'b.png'),before=await stat(path);
  await writeFile(path,await sharp({create:{width:36,height:32,channels:3,background:'#112233'}}).png().toBuffer());
  await utimes(path,before.atime,before.mtime);
  const changed=await f.run({cache:f.cache}); assert.notEqual(changed.report.auditId,uncached.auditId); assert.ok(changed.cache.misses>0);
  assert.equal(changed.report.auditId,(await f.run()).report.auditId);
  await assert.rejects(f.run({cache:join(f.root,'cache')}),{code:'UNSAFE_CACHE'});
  await symlink(f.cache,join(f.temp,'cache-link'));
  await assert.rejects(f.run({cache:join(f.temp,'cache-link')}),{code:'UNSAFE_CACHE'});
});

test('experimental review ordering preserves every evidence pair, prioritizes support, and bounds work', async () => {
  const { workflow } = await import('../tools/workflow.mjs');
  const patterns = ['0'.repeat(64), '1'.repeat(64), '01'.repeat(32), '10'.repeat(32)];
  const images = ['a','b','c'].map((id,i) => ({...make(id,['train','test','validation'][i],id),localHashes:Array(20).fill(patterns[i]),localContrasts:Array(20).fill(100)}));
  images[0].localHashes[0] = patterns[1];
  images[0].localHashes[1] = patterns[1];
  images[0].localHashes[2] = patterns[2];
  images[1].localHashes[0] = patterns[3];
  const pairs = [{left:'a',right:'b',evidence:'local-candidate',distance:0},{left:'a',right:'c',evidence:'local-candidate',distance:0},{left:'b',right:'c',evidence:'byte-identical',distance:0}];
  const report={images,pairs,options:{threshold:0}};
  const result=workflow({operation:'reviewOrder',report});
  assert.equal(result.keys.length,pairs.length); assert.equal(new Set(result.keys).size,pairs.length);
  assert.equal(result.keys[0],JSON.stringify(['b','c']));
  assert.equal(result.scoredLocalPairs,2); assert.ok(result.comparisons<=result.comparisonLimit);
  assert.deepEqual(result.keys.slice(1),[JSON.stringify(['a','b']),JSON.stringify(['a','c'])]);
  const many={...report,images:[images[1],...Array.from({length:250},(_,i)=>({...images[0],id:'a-'+i}))],pairs:Array.from({length:250},(_,i)=>({...pairs[0],left:'a-'+i}))};
  const bounded=workflow({operation:'reviewOrder',report:many});
  assert.ok(bounded.comparisons<=80000); assert.equal(bounded.keys.length,250);
  assert.equal(bounded.scoredLocalPairs,200); assert.equal(bounded.unscoredLocalPairs,50);
});
