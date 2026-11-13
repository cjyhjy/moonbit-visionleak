// One actual production invocation per fresh Node host, with OS high-water RSS.
import {readFile,writeFile} from 'node:fs/promises';
import {runAudit} from '../../tools/cli.mjs';
import {workflow} from '../../tools/workflow.mjs';
import {sourceDigest} from '../../tools/source-digest.mjs';
const config=JSON.parse(await readFile(process.argv[2]));
const start=performance.now();let receipt;
try{
 const {report}=await runAudit(config.audit);
 receipt={status:'returned',auditId:report.auditId,complete:report.complete,
  gateExitCode:workflow({operation:'gate',report,failOn:''}).exitCode,
  images:report.images.length,pairs:report.pairs.length,errors:report.errors,
  phases:report.phases,coverage:report.coverage,timing:report.timing};
}catch(error){receipt={status:'failed',error:{code:error.code??null,message:error.message}};process.exitCode=1;}
receipt.elapsedMilliseconds=Math.round(performance.now()-start);
receipt.sourceDigest=sourceDigest(process.cwd());
receipt.hostPeakRssBytes=process.resourceUsage().maxRSS*1024;
receipt.hostRssScope='OS per-invocation Node high-water RSS; Python/index children measured separately in report timing. Not process-tree sum or simultaneous peak.';
await writeFile(config.receipt,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:receipt.status,elapsedMilliseconds:receipt.elapsedMilliseconds,auditId:receipt.auditId,reason:receipt.phases?.orb?.reason,hostPeakRssBytes:receipt.hostPeakRssBytes}));
