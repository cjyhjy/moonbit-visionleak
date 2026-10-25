import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { runAudit } from '../tools/cli.mjs';

async function directory(t) {
  const temp = await mkdtemp(join(tmpdir(),'visionleak-large-'));
  t.after(()=>rm(temp,{recursive:true,force:true}));
  const root = join(temp,'dataset');
  for (const split of ['train','validation','test']) await mkdir(join(root,split),{recursive:true});
  return {temp,root};
}

test('12MP JPEG byte copy and lossless reencoding keep full-resolution pixel identity', async t => {
  const {temp,root} = await directory(t);
  const width=4000,height=3000;
  const rgb=Buffer.alloc(width*height*3);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const i=(y*width+x)*3; rgb[i]=(x*3+y*7)%256;rgb[i+1]=(x+y*5)%256;rgb[i+2]=(x*11+y)%256;
  }
  const jpeg=await sharp(rgb,{raw:{width,height,channels:3}}).jpeg({quality:85}).toBuffer();
  const png=await sharp(jpeg).autoOrient().toColourspace('srgb').png().toBuffer();
  await writeFile(join(root,'train','original.jpg'),jpeg);
  await writeFile(join(root,'test','copy.jpg'),jpeg);
  await writeFile(join(root,'validation','reencoded.png'),png);
  const {report}=await runAudit({root,out:join(temp,'audit')});
  assert.equal(report.complete,true);
  assert.deepEqual(report.errors,[]);
  assert.equal(report.scope.totalDecodedPixels,36_000_000);
  assert.equal(report.pairs.filter(p=>p.evidence==='byte-identical').length,1);
  assert.equal(report.pairs.filter(p=>p.evidence==='pixel-identical').length,2);
  assert.equal(report.groups.length,1);
  assert.equal(report.groups[0].members.length,3);
  const fullRGB=await sharp(jpeg).autoOrient().toColourspace('srgb').removeAlpha().raw().toBuffer();
  const prefix=Buffer.alloc(11);prefix.write('VL1');prefix.writeUInt32BE(width,3);prefix.writeUInt32BE(height,7);
  const expected=createHash('sha256').update(prefix).update(fullRGB).digest('hex');
  for(const image of report.images) {
    assert.equal(image.width,width);assert.equal(image.height,height);
    assert.equal(image.pixelDigest,expected);
    assert.equal(image.pixelDigestBasis,'full');
    assert.equal(image.dhashBasis.downsampled,true);
    assert.ok(image.dhashBasis.width*image.dhashBasis.height<=4_194_304);
  }
  assert.deepEqual(await readFile(join(root,'train','original.jpg')),jpeg);
});

test('sampling budget changes perception size while source decode and total budgets remain hard bounds', async t => {
  const {temp,root}=await directory(t);
  const encoded=await sharp({create:{width:19,height:17,channels:4,background:{r:30,g:70,b:120,alpha:0.5}}}).png().toBuffer();
  for(const split of ['train','test'])await writeFile(join(root,split,'same.png'),encoded);
  const ordinary=(await runAudit({root,out:join(temp,'full')})).report;
  const sampled=(await runAudit({root,out:join(temp,'sampled'),options:{maxPixels:16}})).report;
  assert.equal(sampled.complete,true);
  assert.equal(sampled.pairs[0].evidence,'byte-identical');
  assert.equal(sampled.images[0].pixelDigest,ordinary.images[0].pixelDigest);
  assert.equal(sampled.images[0].contrast,ordinary.images[0].contrast);
  assert.equal(sampled.images[0].dhashBasis.downsampled,true);
  assert.ok(sampled.images[0].dhashBasis.width*sampled.images[0].dhashBasis.height<=16);
  const rejected=(await runAudit({root,out:join(temp,'decode-limit'),options:{maxDecodePixels:322}})).report;
  assert.equal(rejected.complete,false);
  assert.equal(rejected.images.length,0);
  assert.ok(rejected.errors.every(e=>e.code==='PIXEL_BUDGET'));
  const cumulative=(await runAudit({root,out:join(temp,'total-limit'),options:{maxTotalPixels:323,maxPixels:16}})).report;
  assert.equal(cumulative.complete,false);
  assert.equal(cumulative.images.length,1);
  assert.equal(cumulative.errors[0].code,'TOTAL_PIXEL_BUDGET');
});
