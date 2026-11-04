// Attest existing, fresh evidence; does not run checks or publish a release.
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {sourceDigest} from './source-digest.mjs';
const folder=process.argv[2] || 'reports/followup-0.7.0';
if(!/^reports\/[A-Za-z0-9.-]+$/.test(folder)) throw new Error('Expected a versioned reports folder');
const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url)));
const hash=name=>createHash('sha256').update(readFileSync(new URL('../'+name,import.meta.url))).digest('hex');
const ci=read(folder+'/ci/verification.json');
const browser=read(folder+'/browser.json');
const walkthrough=read(folder+'/walkthrough.json');
const actualRoot=new URL('../',import.meta.url);
const source=sourceDigest(fileURLToPath(actualRoot));
const artifact=hash('dist/visionleak.js');
assert.equal(ci.status,'passed');assert.ok(ci.checks.every(c=>c.status==='passed'));
assert.equal(ci.sourceDigest,source);assert.equal(ci.compiledArtifact.sha256,artifact);
assert.equal(browser.status,'passed');assert.equal(browser.coreArtifactSha256,artifact);
for(const name of ['demo/app.mjs','demo/index.html','demo/styles.css','dist/visionleak.js'])assert.ok(browser.sourceHashes[name],name);
for(const [name,value] of Object.entries(browser.sourceHashes))assert.equal(hash(name),value,name);
assert.equal(walkthrough.status,'passed');assert.equal(walkthrough.sourceDatasetUnchanged,true);
const evidenceDigests={};
function collect(folderPath) {
  for(const name of readdirSync(new URL('../'+folderPath,import.meta.url),{withFileTypes:true})) {
    const path=folderPath+'/'+name.name;
    if(name.isDirectory())collect(path);else if(name.isFile())evidenceDigests[path]=hash(path);
  }
}
collect(folder+'/ci');
for(const name of [folder+'/browser.json',folder+'/walkthrough.json','reports/followup-0.7.0/frozen-replay/evaluation.json','research/photos-v3/freeze-0.7.0.json','research/baselines/0.7.0-pre-followup/snapshot.json'])evidenceDigests[name]=hash(name);
for(const shot of browser.screenshots??[]) {assert.equal(hash(shot.path),shot.sha256);evidenceDigests[shot.path]=shot.sha256;}
const result={schemaVersion:'visionleak-followup-acceptance-v1',version:read('package.json').version,status:'passed',verifiedAt:new Date().toISOString(),sourceDigest:source,compiledArtifact:{path:'dist/visionleak.js',sha256:artifact},ci:{path:folder+'/ci/verification.json',checks:ci.checks.length},browser,walkthrough:{path:folder+'/walkthrough.json',sourceDatasetUnchanged:true},evidenceDigests,publication:{scope:'Local acceptance only; see separate publication receipts for commit, remote CI and release status.'}};
writeFileSync(new URL('../'+folder+'/acceptance.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,sourceDigest:source,artifact,checks:ci.checks.length}));
