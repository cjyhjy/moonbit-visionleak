import {spawnSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {sha256} from './runtime.mjs';
const [reference,cache,out]=process.argv.slice(2);if(!out)throw new Error('Usage: node tools/run-orb-lsh-grid.mjs REFERENCE CACHE NEW_OUT');
await mkdir(out,{recursive:false});const results=[];
for(const bits of [12,16,20,24])for(const tables of [4,8]){
 const path=join(out,`bits-${bits}-tables-${tables}.json`);
 const result=spawnSync(process.execPath,['tools/orb-lsh-experiment.mjs',reference,cache,path,String(bits),String(tables)],{encoding:'utf8',timeout:120000,maxBuffer:65536});
 if(result.status!==0)throw new Error(`LSH experiment failed: ${result.error?.message||result.stderr}`);
 const report=JSON.parse(await readFile(path));results.push(report);
 console.log(JSON.stringify({bits,tables,metrics:report.results.map(r=>({k:r.k,recall:r.recall,reduction:r.pairReduction}))}));
}
const qualifying=results.flatMap(r=>r.results.filter(s=>s.recall>=0.99&&s.pairReduction>=10).map(s=>({bits:r.configuration.bits,tables:r.configuration.tables,k:s.k,recall:s.recall,pairReduction:s.pairReduction,postingVisits:r.measurements.postingVisits})));
qualifying.sort((a,b)=>b.pairReduction-a.pairReduction||a.postingVisits-b.postingVisits||a.bits-b.bits||a.tables-b.tables||a.k-b.k);
await writeFile(join(out,'summary.json'),JSON.stringify({referenceSha256:sha256(await readFile(reference)),selected:qualifying[0]||null,qualifying,scope:'Development selection only; independent holdout required before product integration.'},null,2)+'\n',{flag:'wx'});
