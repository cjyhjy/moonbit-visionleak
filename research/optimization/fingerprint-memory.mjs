import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
if(process.argv[2]==='child') {
 const core=await import(pathToFileURL(resolve(process.argv[3])));const crops=process.argv[4]==='crops';
 const width=2048,height=2048,rgba=Buffer.alloc(width*height*4);
 for(let p=0;p<width*height;p++){rgba[p*4]=(p*13)%256;rgba[p*4+1]=(p*7)%256;rgba[p*4+2]=(p*19)%256;rgba[p*4+3]=p%256;}
 const start=performance.now();
 let fp;
 if(crops&&core.fingerprint_combined_rgba)fp=JSON.parse(core.fingerprint_combined_rgba(width,height,rgba,false,false));
 else {fp=JSON.parse(core.fingerprint_rgba(width,height,rgba));if(crops)Object.assign(fp,JSON.parse(core.fingerprint_local_rgba(width,height,rgba)));}
 console.log(JSON.stringify({elapsedMs:performance.now()-start,peakRssBytes:process.resourceUsage().maxRSS*1024,fp}));
} else {
 const rows=[];
 for(const mode of ['default','crops'])for(let trial=0;trial<3;trial++) {
  const values={};for(const [name,path] of [['baseline',process.argv[2]],['candidate','dist/visionleak.js']]) {
   const r=spawnSync(process.execPath,[import.meta.filename,'child',path,mode],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);values[name]=JSON.parse(r.stdout);
  }
  assert.deepEqual(values.baseline.fp,values.candidate.fp);for(const value of Object.values(values))delete value.fp;
  rows.push({mode,trial,...values});
 }
 const report={scope:'Three isolated process observations per mode, synthetic 4,194,304-pixel RGBA including alpha. Peak includes input allocation and module load; no universal memory/speed claim.',rows};
 writeFileSync(process.argv[3],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(rows));
}
