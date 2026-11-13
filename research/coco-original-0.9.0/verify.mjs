// Verify complete recorded production outputs, not only the runner's success flag.
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {validateReport} from '../../demo/review-validation.mjs';
import {verifyReportIdentity} from '../../demo/report-identity.mjs';
import {sha256} from '../../tools/runtime.mjs';
const out=resolve(process.argv[2]||'');if(!process.argv[2])throw new Error('Pass an evidence directory');
const summary=JSON.parse(await readFile(join(out,'summary.json')));
assert.equal(summary.status,'passed');
const datasetRaw=await readFile('research/coco-original-0.9.0/dataset.json'),dataset=JSON.parse(datasetRaw);
assert.equal(sha256(datasetRaw),summary.datasetSha256);
const expected=new Map(dataset.records.slice(0,summary.count).map(r=>[r.path,r]));
const hashes={},identities={};
for(const mode of ['default','retrieval-cold-final','retrieval-warm','retrieval-resumed-final']){
 const raw=await readFile(join(out,mode+'-report.json')),report=JSON.parse(raw);validateReport(report);await verifyReportIdentity(report);
 hashes[mode]=sha256(raw);identities[mode]=report.auditId;assert.equal(report.images.length,summary.count);
 assert.equal(report.scope.totalDecodedPixels,[...expected.values()].reduce((n,r)=>n+r.width*r.height,0));
 for(const image of report.images){const source=expected.get(image.id);assert.ok(source);assert.equal(image.byteDigest,source.sha256);assert.equal(image.split,source.split);assert.equal(image.width,source.width);assert.equal(image.height,source.height);assert.equal(image.pixelDigestBasis,'full');if(image.orb)assert.ok(image.orb.width*image.orb.height<=131072);}
 if(mode==='default')assert.equal(report.complete,true);
 else{
  const phase=report.phases.orb;assert.equal(phase.candidateQueueComplete,true);assert.equal(phase.searchProcessedImages,summary.count);
  if(phase.retrieval.selectedPairs<phase.eligibleInputPairs){assert.equal(report.complete,false);assert.equal(phase.exhaustivePairsComplete,false);assert.equal(phase.reason,'ORB_APPROXIMATE_COVERAGE');}
  assert.ok(report.timing.orb.residentFeaturePeak<=2);
 }
}
assert.equal(identities['retrieval-cold-final'],identities['retrieval-warm']);assert.equal(identities['retrieval-cold-final'],identities['retrieval-resumed-final']);
const warm=summary.results.find(r=>r.mode==='retrieval-warm').result;
assert.equal(warm.timing.orb.executedPairChecks,0);assert.equal(warm.timing.orb.featureCacheHits,summary.count);
assert.equal(warm.timing.orb.executedFeatureExtractions,0);assert.equal(warm.timing.orb.featureWorkerRequestMs,0);assert.equal(warm.timing.orb.geometryWorkerRequestMs,0);
for(const row of summary.results.filter(r=>r.result?.timing?.orb)){
 const t=row.result.timing.orb;for(const k of ['featureStageMs','featureWorkerRequestMs','geometryStageMs','geometryWorkerRequestMs'])assert.ok(Number.isFinite(t[k])&&t[k]>=0);
 assert.ok(t.featureWorkerRequestMs<=t.featureStageMs+2);assert.ok(t.geometryWorkerRequestMs<=t.geometryStageMs+2);
}
assert.ok(summary.results.some(r=>r.interrupted&&r.processExitCode===-9&&r.committedOrbEntriesAtKill>=32));
const sourceDigests=[...new Set(summary.results.filter(r=>r.result).map(r=>r.result.sourceDigest))];assert.equal(sourceDigests.length,1);
const receipt={status:'passed',count:summary.count,sourceDigest:sourceDigests[0],reportHashes:hashes,identities,verifierSha256:sha256(await readFile(new URL(import.meta.url))),scope:'Full report validation/identity, manifest image binding, final identity parity, conservative coverage and real interrupted-host/feature reuse receipts. No accuracy or new mid-geometry crash guarantee.'};
await writeFile(join(out,'independent-report-verification.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
