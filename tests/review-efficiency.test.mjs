import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateReport,pairKey} from '../demo/review-validation.mjs';
import {reportIdentity} from '../demo/report-identity.mjs';
import {changeDecisions,undoDecisions,sharedImageGroups} from '../demo/review-workflow.mjs';
import {reviewTransferDocument,planReviewTransfer,applyReviewTransfer} from '../demo/review-transfer.mjs';
function fixture(){
 const raw={schemaVersion:'visionleak-report-v1',normalization:'vl-rgb-v1',complete:true,status:'complete',images:[{id:'a',path:'train/a',split:'train',width:1,height:1,byteDigest:'a'.repeat(64),pixelDigest:'b'.repeat(64)},{id:'b',path:'test/b',split:'test',width:1,height:1,byteDigest:'a'.repeat(64),pixelDigest:'b'.repeat(64)},{id:'c',path:'validation/c',split:'validation',width:1,height:1,byteDigest:'c'.repeat(64),pixelDigest:'d'.repeat(64)}],pairs:[{left:'a',right:'b',evidence:'byte-identical',distance:0},{left:'a',right:'c',evidence:'perceptual-candidate',distance:4}]};
 raw.auditId=reportIdentity(raw).digest;return validateReport(raw);
}
function rebind(raw){raw.auditId=reportIdentity(raw).digest;return validateReport(raw);}
test('batch review is atomic, preserves notes, and undo refuses intervening edits',()=>{
 const report=fixture(),keys=report.pairs.map(p=>p.key),base=new Map([[keys[0],{left:'a',right:'b',pairKey:keys[0],decision:'unsure',note:'keep',updatedAt:'2026-01-01T00:00:00Z'}]]);
 assert.throws(()=>changeDecisions(report,base,[keys[0],'absent'],'confirmed'));assert.equal(base.size,1);
 const changed=changeDecisions(report,base,keys,'confirmed');assert.equal(changed.changed,2);assert.equal(changed.reviews.get(keys[0]).note,'keep');
 assert.deepEqual(undoDecisions(report,changed.reviews,changed.undo),base);
 const edited=new Map(changed.reviews);edited.set(keys[1],{...edited.get(keys[1]),note:'later'});assert.equal(undoDecisions(report,edited,changed.undo),null);
 assert.equal(sharedImageGroups(report)[0].keys.size,2);
});
test('transfer accepts content-preserving renames across audit IDs and refuses changed content, split or evidence',async()=>{
 const source=fixture(),keys=source.pairs.map(p=>p.key),marked=changeDecisions(source,new Map(),keys,'confirmed');
 const bundle=reviewTransferDocument(source,marked.reviews),raw=structuredClone(source.raw);
 for(const image of raw.images){image.id='renamed-'+image.id;image.path='renamed/'+image.path;}
 for(const pair of raw.pairs){pair.left='renamed-'+pair.left;pair.right='renamed-'+pair.right;}
 const target=rebind(raw);assert.notEqual(target.auditId,source.auditId);
 const plan=await planReviewTransfer(bundle,target);assert.equal(plan.proposals.length,2);
 const migrated=applyReviewTransfer(target,new Map(),plan);assert.equal(migrated.applied,2);assert.equal([...migrated.reviews.values()][0].migratedFrom.auditId,source.auditId);
 assert.equal(applyReviewTransfer(target,migrated.reviews,plan).existing,2);assert.equal(undoDecisions(target,migrated.reviews,migrated.undo).size,0);
 for(const mutate of [r=>r.images[0].byteDigest='e'.repeat(64),r=>r.images[0].split='validation',r=>r.pairs[1].distance=5]){
  const changed=structuredClone(target.raw);mutate(changed);
  // Change split on both endpoints without making either pair same-split.
  if(changed.images[0].split==='validation')changed.images[2].split='train';
  const result=await planReviewTransfer(bundle,rebind(changed));assert.ok(result.proposals.length<2);
 }
 const changedGoal=structuredClone(target.raw);changedGoal.scope={goal:'different scientific use'};assert.equal((await planReviewTransfer(bundle,rebind(changedGoal))).proposals.length,0);
 const corrupt=structuredClone(bundle);corrupt.sourceReport.images[0].path='tampered';await assert.rejects(planReviewTransfer(corrupt,target),/auditId/);
});
test('ORB review binding retains the full witness, not just pair IDs or inlier count',async()=>{
 const raw=JSON.parse(await readFile(new URL('./fixtures/orb-review.json',import.meta.url))),source=validateReport(raw),pair=source.pairs.find(p=>p.evidence==='orb-candidate');
 const reviews=changeDecisions(source,new Map(),[pair.key],'unsure').reviews,bundle=reviewTransferDocument(source,reviews);
 const next=structuredClone(raw);next.scope.additionalNote='new audit context metadata';
 assert.equal((await planReviewTransfer(bundle,rebind(next))).proposals.length,1);
 next.pairs.find(p=>pairKey(p.left,p.right)===pair.key).matchOrb.allCoordinatesDigest='e'.repeat(64);
 assert.equal((await planReviewTransfer(bundle,rebind(next))).proposals.length,0);
});
