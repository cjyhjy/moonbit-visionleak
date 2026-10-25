import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { IDENTITY_VERSION, reportIdentityPayload, verifyReportIdentity } from '../demo/report-identity.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
function fixture(modern = true) {
  const report = {schemaVersion:'visionleak-report-v1', ...(modern ? {identityVersion:IDENTITY_VERSION}:{}), images:[{id:'train/a',split:'train',pixelDigest:'abc'}], pairs:[], complete:true, errors:[], options:{threshold:6,maxPairs:100}};
  report.auditId = hash(reportIdentityPayload(report));
  report.createdAt = '2026-10-22T00:00:00Z'; report.timing = {elapsedMs:10};
  return report;
}

test('content identity accepts v0.1.0 reports and reviewed exports without rebinding evidence', async () => {
  for (const modern of [false,true]) {
    const report = fixture(modern);
    await verifyReportIdentity(JSON.parse(JSON.stringify(report)));
    report.review = {auditId:report.auditId,reviews:[]};
    report.createdAt = '2026-10-23T00:00:00Z'; report.timing.elapsedMs = 200;
    await verifyReportIdentity(report);
    for (const change of [r => r.images[0].pixelDigest = 'edited', r => r.options.threshold++, r => r.complete = false, r => r.errors.push({code:'IO_ERROR'})]) {
      const changed = structuredClone(report); change(changed);
      await assert.rejects(verifyReportIdentity(changed), /auditId/);
    }
  }
});

test('v2 canonical identity survives object-key reorder but binds array order and unknown fields', async () => {
  const report = fixture();
  report.images.push({id:'test/b',split:'test'}); report.auditId = hash(reportIdentityPayload(report));
  const reordered = Object.fromEntries(Object.entries(report).reverse());
  reordered.options = Object.fromEntries(Object.entries(reordered.options).reverse());
  await verifyReportIdentity(reordered);
  const reversed = structuredClone(report); reversed.images.reverse();
  await assert.rejects(verifyReportIdentity(reversed), /auditId/);
  await assert.rejects(verifyReportIdentity({...report,extra:'evidence'}), /auditId/);
  await assert.rejects(verifyReportIdentity({...report,identityVersion:'unknown'}), /版本/);
  await assert.rejects(verifyReportIdentity({...report,auditId:'bad'}), /auditId/);
});

test('MoonBit identity matches an independent ECMAScript canonicalization oracle for extension fields', () => {
  // Independent test-only oracle; no product path imports this implementation.
  const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])) : value;
  for (let i=0;i<40;i++) {
    const report = { identityVersion:IDENTITY_VERSION, z:{long:1,z:2,aa:3},
      '10':10,'2':2,'01':1,'4294967294':4,'4294967295':5,
      aa:[0,-0,1e-7,1e21,9007199254740991,i/3,null,true],
      text:String.fromCharCode(...Array.from({length:32},(_,j)=>j))+'图像🙂',
      auditId:'ignored',createdAt:'ignored',timing:{elapsedMs:i},review:{status:'ignored'} };
    const stable=Object.fromEntries(Object.entries(report).filter(([key])=>!['auditId','createdAt','timing','review'].includes(key)));
    const expected=JSON.stringify(canonical(stable));
    assert.equal(reportIdentityPayload(report),expected);
    assert.equal(hash(reportIdentityPayload(report)),hash(expected));
  }
});
