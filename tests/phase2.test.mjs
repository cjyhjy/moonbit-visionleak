import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, unlink, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { runAudit } from '../tools/cli.mjs';
import { reportIdentity } from '../demo/report-identity.mjs';
import { pairKey, validateReport, filterPairs, workbenchScope } from '../demo/review-validation.mjs';

const cli = fileURLToPath(new URL('../tools/cli.mjs', import.meta.url));
function run(...args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding:'utf8', timeout:60_000 });
  assert.equal(result.error,undefined);
  return { ...result, json:JSON.parse(result.stdout || result.stderr) };
}
async function setup(t) {
  const temp = await mkdtemp(join(tmpdir(),'visionleak-phase2-'));
  t.after(()=>rm(temp,{recursive:true,force:true}));
  const root = join(temp,'dataset');
  for (const split of ['training','val','testing']) await mkdir(join(root,split),{recursive:true});
  const pixels = Buffer.from(Array.from({length:32*24*3},(_,i)=>(i*13+Math.floor(i/96)*17)%256));
  const source = await sharp(pixels,{raw:{width:32,height:24,channels:3}}).png({compressionLevel:0}).toBuffer();
  const repacked = await sharp(pixels,{raw:{width:32,height:24,channels:3}}).png({compressionLevel:9}).toBuffer();
  await writeFile(join(root,'training/source.png'),source);
  await writeFile(join(root,'val/repacked.png'),repacked);
  await writeFile(join(root,'testing/copy.png'),source);
  const out = join(temp,'audit');
  return {temp,root,out,source,pixels};
}

test('fail-on implements fatal > hit > incomplete > complete and preserves default behavior',async t=>{
  const f=await setup(t);
  const audit=(out,...flags)=>run('audit','--root',f.root,'--out',join(f.temp,out),...flags);
  assert.equal(audit('default').status,0);
  for(const level of ['exact','pixel','candidate']) {
    const result=audit(level,'--fail-on',level);
    assert.equal(result.status,3,result.stderr);
    assert.equal(result.json.complete,true);
    assert.equal(result.json.matched,level==='exact'?1:3);
  }
  await writeFile(join(f.root,'training/bad.png'),'broken');
  const partial=audit('partial','--fail-on','exact');
  assert.equal(partial.status,3);
  assert.equal(partial.json.complete,false);
  assert.equal(audit('incomplete').status,2);
  assert.equal(audit('budget','--max-comparisons','0','--fail-on','exact').status,2);
  assert.equal(run('audit','--root',join(f.temp,'missing'),'--out',join(f.temp,'fatal'),'--fail-on','candidate').status,1);
  assert.equal(audit('bad-flag','--fail-on','typo').status,1);
});

test('fail-on exact ignores pixel-only pairs and pixel ignores candidate-only pairs',async t=>{
  const f=await setup(t);
  await unlink(join(f.root,'testing/copy.png'));
  assert.equal(run('audit','--root',f.root,'--out',join(f.temp,'pixel'),'--fail-on','exact').status,0);
  const shifted=await sharp(Buffer.from(f.pixels.map(v=>(v+1)%256)),{raw:{width:32,height:24,channels:3}}).png().toBuffer();
  await writeFile(join(f.root,'val/repacked.png'),shifted);
  for(const [level,status] of [['pixel',0],['candidate',3]]) {
    const result=run('audit','--root',f.root,'--out',join(f.temp,level+'-candidate'),'--threshold','64','--fail-on',level);
    assert.equal(result.status,status,result.stderr);
    assert.equal(result.json.evidenceCounts.candidate,1);
  }
});

test('verify detects changed and missing evidence and refuses a tampered report before dataset access',async t=>{
  const f=await setup(t);
  await runAudit(f);
  const report=join(f.out,'report.json');
  const verify=()=>run('verify','--report',report,'--root',f.root);
  const valid=verify();
  assert.equal(valid.status,0,valid.stderr);
  assert.equal(valid.json.counts.valid,3);
  assert.deepEqual(valid.json.verificationScope, {evidenceTypes:['byte-identical','pixel-identical'],candidatesRecomputed:false,wholeDatasetReaudited:false});
  const changed=await sharp({create:{width:32,height:24,channels:3,background:'red'}}).png().toBuffer();
  await writeFile(join(f.root,'testing/copy.png'),changed);
  const invalid=verify();
  assert.equal(invalid.status,4);
  assert.equal(invalid.json.counts.invalid,2);
  await unlink(join(f.root,'val/repacked.png'));
  const missing=verify();
  assert.equal(missing.status,4);
  assert.equal(missing.json.counts.missing,2);
  assert.deepEqual(await readFile(join(f.root,'training/source.png')),f.source);
  const raw=JSON.parse(await readFile(report));
  raw.complete=false;
  const tampered=join(f.temp,'tampered.json');
  await writeFile(tampered,JSON.stringify(raw));
  const rejected=run('verify','--report',tampered,'--root',join(f.temp,'not-present'));
  assert.equal(rejected.status,1);
  assert.equal(rejected.json.error.code,'INVALID_REPORT');
});

test('verify never follows a report traversal or a symlink to a file outside the dataset',async t=>{
  const f=await setup(t);
  await runAudit(f);
  const report=join(f.out,'report.json');
  await writeFile(join(f.temp,'outside.png'),f.source);
  await unlink(join(f.root,'training/source.png'));
  await symlink(join(f.temp,'outside.png'),join(f.root,'training/source.png'));
  let result=run('verify','--report',report,'--root',f.root);
  assert.equal(result.status,4);
  assert.ok(result.json.pairs.some(p=>[p.leftObservation,p.rightObservation].some(o=>o.code==='UNSAFE_PATH')));
  const raw=JSON.parse(await readFile(report));
  raw.images.find(i=>i.split==='train').path='../outside.png';
  raw.auditId=reportIdentity(raw).digest;
  const traversal=join(f.temp,'traversal.json');
  await writeFile(traversal,JSON.stringify(raw));
  result=run('verify','--report',traversal,'--root',f.root);
  assert.equal(result.status,4);
  assert.ok(result.json.pairs.some(p=>[p.leftObservation,p.rightObservation].some(o=>o.code==='UNSAFE_PATH')));
});

test('coverage binds canonical splits, rejected codes, ignored files, and budget exhaustion',async t=>{
  const f=await setup(t);
  await writeFile(join(f.root,'training/bad.png'),'broken');
  await writeFile(join(f.root,'training/notes.txt'),'ignored');
  await symlink(join(f.root,'training/source.png'),join(f.root,'testing/unsafe.png'));
  const {report}=await runAudit(f);
  assert.equal(report.coverage.splits.train.audited,1);
  assert.equal(report.coverage.splits.train.rejectedByCode.DECODE_ERROR,1);
  assert.equal(report.coverage.splits.train.ignored,1);
  assert.equal(report.coverage.splits.test.rejectedByCode.UNSAFE_PATH,1);
  assert.equal(report.coverage.splits.validation.audited,1);
  assert.match(report.coverage.summary,/已审计 train 1 \/ validation 1 \/ test 1/);
  const bounded=await runAudit({...f,out:join(f.temp,'bounded'),options:{maxImages:1}});
  assert.equal(bounded.report.coverage.enumerationComplete,false);
  assert.ok(bounded.report.coverage.budgetExhaustion.some(p=>p.code==='IMAGE_BUDGET'));
  const coreBudget=await runAudit({...f,out:join(f.temp,'core-budget'),options:{maxComparisons:0}});
  assert.ok(coreBudget.report.coverage.budgetExhaustion.some(p=>p.code==='ComparisonBudget'));
  assert.equal(coreBudget.report.coverage.splits.train.audited,0);
  assert.equal(coreBudget.report.coverage.splits.train.fingerprinted,1);
  assert.equal(coreBudget.report.coverage.unprocessedKnownFiles,2);
});

test('CSV matches the manually enumerated exact-group keep/remove plan',async t=>{
  const f=await setup(t);
  const {report}=await runAudit(f);
  const target=join(f.temp,'fixes.csv');
  const result=run('export-fixes','--report',join(f.out,'report.json'),'--out',target);
  assert.equal(result.status,0,result.stderr);
  const csv=await readFile(target,'utf8');
  const members=['testing/copy.png','training/source.png','val/repacked.png'];
  const id='exact-'+createHash('sha256').update(JSON.stringify(members)).digest('hex');
  const quote=fields=>fields.map(v=>`"${v}"`).join(',');
  const expected=[
    'group_id,evidence_level,split,path,review_status,suggestion',
    quote([id,'byte-identical','train','training/source.png','pending','keep']),
    quote([id,'pixel-identical','validation','val/repacked.png','pending','remove-from-validation']),
    quote([id,'byte-identical','test','testing/copy.png','pending','remove-from-test']),
    '',
  ].join('\r\n');
  assert.equal(csv,expected);
  assert.equal(report.groups.length,1);
  assert.equal(run('export-fixes','--report',join(f.out,'report.json'),'--out',target).status,1,'must not overwrite an existing file');
});

test('candidate suggestions require a validated confirmed review and HTML safely includes current review',async t=>{
  const f=await setup(t);
  const {report}=await runAudit(f);
  const candidate={...report,groups:[],pairs:[{left:report.images[0].id,right:report.images[1].id,evidence:'perceptual-candidate',distance:2,lowContrast:true}]};
  candidate.auditId=reportIdentity(candidate).digest;
  const path=join(f.out,'candidate.json');
  await writeFile(path,JSON.stringify(candidate));
  let result=run('export-fixes','--report',path,'--out',join(f.temp,'unreviewed.csv'));
  assert.equal(result.json.rows,0);
  const row=candidate.pairs[0];
  const reviews={schemaVersion:'visionleak-review-v1',auditId:candidate.auditId,reviews:[{left:row.left,right:row.right,pairKey:pairKey(row.left,row.right),decision:'confirmed',note:'</script><script>globalThis.injected=1</script>',updatedAt:'2026-10-25T12:00:00Z'}]};
  const review=join(f.temp,'review.json');
  await writeFile(review,JSON.stringify(reviews));
  result=run('export-fixes','--report',path,'--out',join(f.temp,'confirmed.csv'),'--review',review);
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.json.rows,2);
  const html=join(f.temp,'offline.html');
  result=run('export-html','--report',path,'--out',html,'--review',review);
  assert.equal(result.status,0,result.stderr);
  const source=await readFile(html,'utf8');
  assert.equal(result.json.truncated,false);
  assert.equal(source.includes('globalThis.injected'),false);
  assert.equal((source.match(/<script>/g)||[]).length,1);
  const encoded=source.match(/data-evidence="([^"]+)"/)[1];
  const decoded=JSON.parse(Buffer.from(encoded,'base64'));
  assert.equal(decoded.review.note,reviews.reviews[0].note);
  assert.ok(decoded.leftThumbnail.startsWith('data:image/jpeg;base64,'));
  assert.equal(decoded.review.decision,'confirmed');
  result=run('export-html','--report',path,'--out',join(f.temp,'bounded.html'),'--max-bytes','4096');
  assert.equal(result.status,0,result.stderr);
  assert.equal(result.json.truncated,true);
  assert.ok(result.json.bytes<=4096);
  const validated=validateReport(candidate);
  assert.equal(filterPairs(validated,new Map()).length,0);
  const scope=workbenchScope(validated,{includeLowContrast:true});
  assert.equal(scope.lowContrastPairs,1);
  assert.equal(scope.candidateGroups.length,1);
  assert.equal(filterPairs(validated,new Map(),{includeLowContrast:true,groupId:scope.candidateGroups[0].id}).length,1);
  assert.deepEqual(candidate.groups,[]);
});

test('the committed GitHub Action leak fixture fails the actual local audit command',async t=>{
  const temp=await mkdtemp(join(tmpdir(),'visionleak-action-'));
  t.after(()=>rm(temp,{recursive:true,force:true}));
  const root=fileURLToPath(new URL('../examples/github-action/dataset',import.meta.url));
  const result=run('audit','--root',root,'--out',join(temp,'audit'),'--fail-on','pixel');
  assert.equal(result.status,3,result.stderr);
  assert.equal(result.json.matched,1);
});
