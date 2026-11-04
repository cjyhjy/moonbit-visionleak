// Copy only files produced by the recorded successful run, never stale scratch tests.
import {readFileSync,mkdirSync,cpSync,existsSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
const source=resolve('.ci-artifacts'), destination=resolve(process.argv[2] || '');
if(!process.argv[2] || existsSync(destination)) throw new Error('Pass a new evidence directory');
const report=JSON.parse(readFileSync(join(source,'verification.json')));
if(report.status!=='passed')throw new Error('Only successful CI can be archived');
const files=new Set(['verification.json',...report.checks.map(c=>c.log),'evaluation-audit.json','evaluation-oracle.json','evaluation.json','evaluation.md','mirror-evaluation.json','mirror-evaluation-audit.json']);
for(const check of report.checks){
  if(check.id==='bounded-scale'){
    const directory=relative(source,resolve(check.command[2]));
    if(directory.startsWith('..'))throw new Error('Output outside CI evidence directory');
    // Generated images and thumbnails are reproducible scratch data. Keep the
    // manifest, source hashes, counters and measurements, not duplicate pixels.
    for(const file of ['summary.json','manifest.csv','default.json','orb.json','default.log','orb.log'])files.add(join(directory,file));
  }
  const index=check.command.indexOf('--out');
  if(index<0)continue;
  const name=relative(source,resolve(check.command[index+1]));
  if(name.startsWith('..'))throw new Error('Output outside CI evidence directory');
  files.add(name);
}
mkdirSync(destination,{recursive:true});
for(const name of [...files].sort())cpSync(join(source,name),join(destination,name),{recursive:true});
console.log(JSON.stringify({status:'passed',destination,checks:report.checks.length}));
