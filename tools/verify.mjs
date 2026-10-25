import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {homedir} from 'node:os';
import {createHash} from 'node:crypto';
import {sourceDigest} from './source-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const reportPath=new URL('../reports/verification.json',import.meta.url);
const startedAt=new Date().toISOString();
const version=JSON.parse(readFileSync(new URL('../package.json',import.meta.url))).version;
const report={schemaVersion:'visionleak-verification-v1',status:'running',startedAt,dateTimezone:'America/New_York',checks:[],keyFiles:['DELIVERY.md','README.md','core/audit.mbt','core/fingerprint.mbt','core/sha256.mbt','dist/visionleak.js','tools/cli.mjs','demo/index.html','reports/evaluation.json','research/comparison.md'],release:{archive:`release/visionleak-${version}.zip`,checksumFile:'release/SHA256SUMS',attestation:'reports/release-verification.json',commands:[['python3','tools/package.py'],['python3','tools/accept-release.py']],status:'read-final-attestation',note:'Final archive checksum and acceptance status are outside the ZIP to avoid self-reference.'},notTested:['Naturally occurring contamination in a real licensed image dataset','Windows/Linux runtime acceptance','FiftyOne or MoonSplit runtime/performance comparison','Public hosting, publication and formal contest submission'],publication:{scope:'This local verification does not query or change external publication or contest submission status.'}};
const save=()=>writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
mkdirSync(new URL('../reports/logs/',import.meta.url),{recursive:true});save();
const redact=s=>(s||'').replaceAll(root,'./').replaceAll(root.replace(homedir(),'~'),'./').replaceAll(pathToFileURL(root).href,'./');
function run(id,command,args){
  const start=Date.now();const result=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:300000,maxBuffer:10*1024*1024,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});
  const log=redact((result.stdout||'')+(result.stderr||''));
  writeFileSync(new URL(`../reports/logs/${id}.log`,import.meta.url),log);
  const check={id,command:[command,...args],status:result.status===0&&!result.error?'passed':'failed',exitCode:result.status,elapsedMs:Date.now()-start,log:`reports/logs/${id}.log`};
  if(result.error)check.error=result.error.message;
  report.checks.push(check);save();console.log(`${id}: ${check.status}`);
  if(check.status!=='passed')throw new Error(`${id} failed; see ${check.log}`);
  return log;
}
try{
  const initialSourceDigest=sourceDigest(root);
  report.environment={node:process.version,platform:process.platform,arch:process.arch,moon:run('toolchain','./tools/moon',['version','--all']).trim()};
  run('build','node',['tools/build.mjs']);
  for(const target of ['js','wasm-gc','native'])run(`moon-${target}`,'./tools/moon',['test','--target',target]);
  run('native-release-build','./tools/moon',['test','--target','native','--release','--build-only']);
  run('native-release-run','./tools/moon',['test','--target','native','--release']);
  run('format','./tools/moon',['fmt','--check']);
  run('node-integration','npm',['test']);
  const py='research/.venv-oracle/bin/python';
  if(!existsSync(new URL('../'+py,import.meta.url)))throw new Error('Oracle venv absent; see docs/reproducibility.md');
  run('metric-regression',py,['tests/oracle-metrics.py']);
  run('imagehash-oracle',py,['tools/evaluate.py']);
  run('mirror-oracle',py,['tools/evaluate-mirrors.py']);
  for(const partition of ['development','holdout']) run(`photo-${partition}`,py,['tools/evaluate-photos.py','--partition',partition,'--out',`reports/photos-v1/current-${partition}`,'--include-orientations','--replace']);
  run('photo-summary',py,['tools/summarize-photos.py']);
  run('performance','node',['tools/benchmark.mjs']);
  const optimization=run('core-comparison','node',['tests/core-performance.mjs']);
  writeFileSync(new URL('../reports/core-optimization.json',import.meta.url),optimization);
  run('release-contract','python3',['tests/release-contract.py']);
  const evaluation=JSON.parse(readFileSync(new URL('../reports/evaluation.json',import.meta.url),'utf8'));
  report.evaluation={file:'reports/evaluation.json',images:evaluation.dataset.images,exact:evaluation.scores.exact,nearOnly:evaluation.scores.nearOnly,indexParity:evaluation.indexParity,summary:'Deterministic synthetic files; near-only metrics exclude exact positives. See evaluation.md for false positives and false negatives.'};
  const demoQa=new URL('../demo/qa/verification.json',import.meta.url);
  if(!existsSync(demoQa))throw new Error('Browser QA record missing: demo/qa/verification.json');
  report.browser=JSON.parse(readFileSync(demoQa,'utf8'));
  if(report.browser.status!=='passed')throw new Error('Browser QA must be passed before release verification');
  for(const name of ['demo/index.html','demo/styles.css','demo/app.mjs','demo/review-validation.mjs','demo/report-identity.mjs','demo/review-workflow.mjs']){
    const actual=createHash('sha256').update(readFileSync(new URL('../'+name,import.meta.url))).digest('hex');
    if(report.browser.sourceHashes?.[name]!==actual)throw new Error(`Browser-tested source changed: ${name}`);
  }
  const demoReport=JSON.parse(readFileSync(new URL('../reports/demo/report.json',import.meta.url),'utf8'));
  const evaluatedReport=JSON.parse(readFileSync(new URL('../reports/evaluation-audit.json',import.meta.url),'utf8'));
  if(demoReport.auditId!==evaluatedReport.auditId||report.browser.servedAuditId!==demoReport.auditId)throw new Error('Demo/browser/evaluation audit identities differ');
  const mirrorEval=JSON.parse(readFileSync(new URL('../reports/mirror-evaluation.json',import.meta.url)));
  const mirrorDemo=JSON.parse(readFileSync(new URL('../reports/mirror-demo/report.json',import.meta.url)));
  if(mirrorEval.status!=='passed'||report.browser.mirrorAuditId!==mirrorEval.mirrors.auditId||mirrorDemo.auditId!==mirrorEval.mirrors.auditId) throw new Error('Mirror evaluation/browser/demo identity differs');
  const photoReport=JSON.parse(readFileSync(new URL('../reports/photos-demo/report.json',import.meta.url)));
  const photoEval=JSON.parse(readFileSync(new URL('../reports/photos-v1/current-holdout/evaluation.json',import.meta.url)));
  if(report.browser.photoAuditId!==photoReport.auditId||photoReport.auditId!==photoEval.modes.orientations.auditId) throw new Error('Photo browser/demo/evaluation identity differs');
  report.photos={summary:'reports/photos-v1/summary.json',development:'reports/photos-v1/current-development/evaluation.json',holdout:'reports/photos-v1/current-holdout/evaluation.json',scope:'Ten licensed photos with controlled transforms; natural contamination untested.'};
  report.evidenceDigests={};
  for(const name of ['reports/evaluation.json','reports/evaluation.md','reports/evaluation-audit.json','reports/evaluation-oracle.json','reports/performance.json','reports/demo/report.json','demo/qa/verification.json','reports/core-optimization.json','reports/mirror-evaluation.json','reports/mirror-evaluation-audit.json','reports/mirror-demo/report.json','research/baselines/visionleak-0.1.0.mjs','research/baselines/visionleak-0.3.0.mjs','reports/photos-demo/report.json','reports/photos-v1/summary.json','reports/photos-v1/summary.md',...['baseline-development','baseline-holdout','current-development','current-holdout'].flatMap(folder=>['evaluation.json','default-audit.json','mirrors-audit.json',...(folder.startsWith('current')?['orientations-audit.json']:[])].map(name=>`reports/photos-v1/${folder}/${name}`))]){
    report.evidenceDigests[name]=createHash('sha256').update(readFileSync(new URL('../'+name,import.meta.url))).digest('hex');
  }
  report.sourceDigest=sourceDigest(root);
  if(report.sourceDigest!==initialSourceDigest)throw new Error('Behavioral source changed during verification; rerun after edits finish');
  report.sourceDigestScope='core/tools/tests/demo/fixtures and research/photos-v1 except demo/qa and caches, plus module/package/oracle/toolchain lock files, pinned runtime versions and .github workflows';
  report.compiledArtifact={path:'dist/visionleak.js',sha256:createHash('sha256').update(readFileSync(new URL('../dist/visionleak.js',import.meta.url))).digest('hex')};
  report.cleanCopy={status:'see-release-attestation',path:'reports/release-verification.json',note:'The final ZIP checksum and extracted-copy execution are recorded outside the archive to avoid a self-referential checksum.'};
  report.status='passed';
}catch(error){report.status='failed';report.error=error.message;process.exitCode=1;}
finally{report.finishedAt=new Date().toISOString();save();}
