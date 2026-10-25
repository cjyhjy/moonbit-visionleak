import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,mkdir,writeFile,rm,access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { runAudit } from '../tools/cli.mjs';

test('all split alias combinations normalize splits while preserving actual paths and directory scope',async t=>{
  const temp=await mkdtemp(join(tmpdir(),'visionleak-alias-'));t.after(()=>rm(temp,{recursive:true,force:true}));
  const bytes=await sharp({create:{width:9,height:8,channels:3,background:'#804020'}}).png().toBuffer();
  let number=0;
  for(const train of ['train','training'])for(const validation of ['validation','val','valid','dev'])for(const test of ['test','testing']) {
    const root=join(temp,'dataset-'+number),out=join(temp,'report-'+number++);
    for(const name of [train,validation,test]){await mkdir(join(root,name),{recursive:true});await writeFile(join(root,name,'same.png'),bytes);}
    const {report}=await runAudit({root,out});assert.equal(report.complete,true);
    assert.deepEqual(report.scope.splitDirectories,{[train]:'train',[validation]:'validation',[test]:'test'});
    assert.deepEqual(report.scope.missingSplits,[]);
    assert.equal(report.pairs.length,3);assert.equal(report.groups.length,1);
    for(const image of report.images)assert.equal(image.split,report.scope.splitDirectories[image.path.split('/')[0]]);
  }
});

test('simultaneous aliases are fatal before output creation instead of merging dataset splits',async t=>{
  const temp=await mkdtemp(join(tmpdir(),'visionleak-alias-conflict-'));t.after(()=>rm(temp,{recursive:true,force:true}));
  const aliases=[['train','training'],['validation','val','valid','dev'],['test','testing']];
  let number=0;
  for(const names of aliases)for(let a=0;a<names.length;a++)for(let b=a+1;b<names.length;b++) {
    const root=join(temp,'dataset-'+number),out=join(temp,'output-'+number++);
    await mkdir(join(root,names[a]),{recursive:true});await mkdir(join(root,names[b]),{recursive:true});
    await assert.rejects(runAudit({root,out}),error=>error.code==='SPLIT_ALIAS_CONFLICT' && error.details.directories.length===2);
    await assert.rejects(access(out));
  }
});
