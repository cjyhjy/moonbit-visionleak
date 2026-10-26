// Measure the installed decoder, in separate processes; stream API != bounded raw output.
import sharp from 'sharp';
import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
if(process.argv[2]==='child') {
 const mode=process.argv[3];
 sharp.cache(false);sharp.concurrency(1);
 const input=await sharp({create:{width:4000,height:3000,channels:3,background:{r:73,g:127,b:191}}}).png().toBuffer();
 let chunks=0,bytes=0,maxChunk=0;
 const decoded=sharp(input).ensureAlpha().raw();
 const start=performance.now();
 if(mode==='buffer'){const buffer=await decoded.toBuffer();chunks=1;bytes=maxChunk=buffer.length;}
 else for await(const chunk of decoded){chunks++;bytes+=chunk.length;maxChunk=Math.max(maxChunk,chunk.length);}
 console.log(JSON.stringify({mode,chunks,bytes,maxChunk,elapsedMs:performance.now()-start,peakRssBytes:process.resourceUsage().maxRSS*1024}));
} else {
 const rows=['buffer','stream'].map(mode=>{const run=spawnSync(process.execPath,[import.meta.filename,'child',mode],{encoding:'utf8'});if(run.status!==0)throw Error(run.stderr);return JSON.parse(run.stdout);});
 const report={sharp:sharp.versions,scope:'One synthetic 12MP PNG; isolated child processes; peak includes source generation. API/chunk probe, not proof of worst-case RSS.',rows,decision:'Do not replace toBuffer with stream as a memory optimization: installed raw stream still yields a full-image buffer. A real row/tile decoder needs a separate backend experiment.'};
 writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(rows));
}
