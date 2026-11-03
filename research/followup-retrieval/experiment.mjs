// Core-only retrieval experiments. Image decoding and ORB are out of scope.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const output=join(root,'output/followup-retrieval');
const evidence=join(root,'reports/followup-retrieval');
const hash=value=>createHash('sha256').update(value).digest('hex');
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const write=(path,value)=>writeFileSync(path,JSON.stringify(value,null,2)+'\n');
const command=process.argv[2];
const names=['sparse','repeated-local','known-photos'];
function synthetic(count,repeated=false){
  let state=0x51a7c0de;
  const rand=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;};
  const bits=()=>rand().toString(2).padStart(32,'0')+rand().toString(2).padStart(32,'0');
  const pool=Array.from({length:512},bits);
  return Array.from({length:count},(_,i)=>({id:'image-'+String(i).padStart(5,'0'),split:i%2?'test':'train',
    byteDigest:hash('byte-'+i),pixelDigest:hash('pixel-'+i),dhash:bits(),contrast:150,
    localHashes:Array.from({length:20},(_,w)=>repeated?pool[(i*7+w*31)%pool.length]:bits()),localContrasts:Array(20).fill(150)}));
}
function input(name){return read(join(output,'inputs',name+'.json'));}
function functionName(source,suffix){
  const found=[...source.matchAll(/function ([A-Za-z0-9_$]+)\(/g)].map(x=>x[1]).filter(x=>x.endsWith(suffix));
  assert.equal(found.length,1,suffix);return found[0];
}
function editFunction(source,name,transform){
  const start=source.indexOf('function '+name+'(');assert.ok(start>=0);
  const end=source.indexOf('\nfunction ',start+1);assert.ok(end>start);
  return source.slice(0,start)+transform(source.slice(start,end))+source.slice(end);
}
function once(source,before,after){assert.equal(source.split(before).length,2,before);return source.replace(before,after);}
function instrument(source){
  const paths=functionName(source,'mih__paths'),contains=functionName(source,'mih__contains');
  const insert=functionName(source,'mih__insert'),localQuery=functionName(source,'local__query'),localInsert=functionName(source,'local__insert');
  source=editFunction(source,paths,body=>{
    body=once(body,'const mask =','__prof.probes++;\n          const mask =');
    body=once(body,'let cursor = id;','__prof.postings++;\n                let cursor = id;');
    body=once(body,'_M0MPB3Map3setGibE(paths, cursor, true);','__prof.ancestorMarks++;\n                    _M0MPB3Map3setGibE(paths, cursor, true);');
    return body;
  });
  source=editFunction(source,localQuery,body=>once(body,
    'if (_M0MPB3Map8containsGibE(seen, _j) || _M0MPC15array5Array2atGRPB4JsonE(items, _j).split === item.split) {',
    'const repeated = _M0MPB3Map8containsGibE(seen, _j);\n                    const sameSplit = _M0MPC15array5Array2atGRPB4JsonE(items, _j).split === item.split;\n                    __prof.memberVisits++; if(repeated)__prof.repeatedCandidates++; if(sameSplit)__prof.sameSplitMembers++;\n                    if (repeated || sameSplit) {'));
  const setup=`\nconst __prof={probes:0,postings:0,ancestorMarks:0,memberVisits:0,repeatedCandidates:0,sameSplitMembers:0,prunedTreeVisits:0,functions:{},context:'global'};\n`;
  const wrappers=[[paths,'mihPaths'],[contains,'mihContains'],[insert,'mihInsert'],[localQuery,'localQuery'],[localInsert,'localInsert']].map(([name,label])=>{
    const context=label.startsWith('local')?`__prof.context=${JSON.stringify(label)};`:'';
    return `{const original=${name};${name}=function(...args){const old=__prof.context;${context}const key=__prof.context+':${label}';const row=__prof.functions[key]??={calls:0,inclusiveMs:0};row.calls++;const start=performance.now();try{const value=original(...args);${label==='mihContains'?'if(!value)__prof.prunedTreeVisits++;':''}return value;}finally{row.inclusiveMs+=performance.now()-start;__prof.context=old;}};}`;
  }).join('\n');
  return source+setup+wrappers+'\nexport function profileCounters(){return __prof;}\n';
}
if(command==='prepare'){
  mkdirSync(join(output,'inputs'),{recursive:true});mkdirSync(evidence,{recursive:true});
  const options={includeCrops:true,maxImages:2000,maxComparisons:1000000,maxExactComparisons:1000000,maxPairs:100000};
  write(join(output,'inputs/sparse.json'),{images:synthetic(1600),options});
  write(join(output,'inputs/repeated-local.json'),{images:synthetic(400,true),options});
  const photo=read(join(root,'reports/post-review/photos/crops-audit.json'));
  write(join(output,'inputs/known-photos.json'),{images:photo.images,options:{...options,maxComparisons:1000000}});
  const baseline=readFileSync(join(root,'dist/visionleak.js'),'utf8');
  writeFileSync(join(output,'baseline.mjs'),baseline);writeFileSync(join(output,'profiled.mjs'),instrument(baseline));
  write(join(evidence,'inputs.json'),{scope:'Core fingerprint inputs only; no decoder or feature extraction timing. Photos are already-known v3.',artifactSha256:hash(baseline),inputs:names.map(name=>({name,images:input(name).images.length,sha256:hash(readFileSync(join(output,'inputs',name+'.json')))}))});
  console.log('Prepared frozen baseline and three workloads');
}else if(command==='worker'){
  const [modulePath,name,destination,mode='timing']=process.argv.slice(3);
  const module=await import(pathToFileURL(resolve(modulePath)));
  const data=JSON.stringify(input(name));
  if(mode==='timing'){module.audit_json(data);global.gc?.();}
  const start=performance.now();const raw=module.audit_json(data);const elapsedMs=performance.now()-start;
  const result=JSON.parse(raw);
  assert.ok(Array.isArray(result.pairs),JSON.stringify(result));
  const receipt={name,mode,node:process.version,platform:process.platform,arch:process.arch,inputSha256:hash(data),moduleSha256:hash(readFileSync(modulePath)),wallMs:elapsedMs,peakRssBytes:process.resourceUsage().maxRSS*1024,resultSha256:hash(raw),complete:result.complete,phases:result.phases,stats:result.stats,pairs:result.pairs.length};
  if(module.profileCounters)receipt.profile=module.profileCounters();
  write(destination,receipt);
  if(mode==='profile')writeFileSync(destination+'.report.json.gz',gzipSync(raw));
}else if(command==='profile'){
  const runs=[];
  for(const name of names){
    const expected=JSON.parse((await import(pathToFileURL(join(output,'baseline.mjs')))).audit_json(JSON.stringify(input(name))));
    const path=join(evidence,'profile-'+name+'.json');
    const r=spawnSync(process.execPath,['--max-old-space-size=768',fileURLToPath(import.meta.url),'worker',join(output,'profiled.mjs'),name,path,'profile'],{cwd:root,encoding:'utf8',timeout:60000});
    assert.equal(r.status,0,r.stderr);const row=read(path);
    assert.equal(row.resultSha256,hash(JSON.stringify(expected)),'instrumentation changed observable result');
    runs.push(row);
  }
  write(join(evidence,'profile-summary.json'),{status:'passed',scope:'Instrumented inclusive timings identify hotspots; instrumentation overhead makes these unsuitable as speedup evidence. Probes/postings/ancestor marks count successful index budget operations; member repeats are seen-candidate skips.',runs});
  console.log(JSON.stringify(runs.map(r=>({name:r.name,complete:r.complete,wallMs:r.wallMs,stats:r.stats,profile:r.profile})),null,2));
}else if(command==='compare'){
  const candidate=resolve(process.argv[3]),baseline=join(output,'baseline.mjs');
  const runs=[];
  for(let repeat=0;repeat<5;repeat++)for(const name of names){
    for(const [label,module] of repeat%2?[['candidate',candidate],['baseline',baseline]]:[['baseline',baseline],['candidate',candidate]]){
      const path=join(evidence,`timing-${name}-${repeat}-${label}.json`);
      const r=spawnSync(process.execPath,['--expose-gc','--max-old-space-size=768',fileURLToPath(import.meta.url),'worker',module,name,path],{cwd:root,encoding:'utf8',timeout:60000});
      assert.equal(r.status,0,r.stderr);runs.push({label,repeat,...read(path)});
    }
  }
  const median=x=>[...x].sort((a,b)=>a-b)[Math.floor(x.length/2)];
  const summary=names.map(name=>{
    const old=runs.filter(x=>x.name===name&&x.label==='baseline'),current=runs.filter(x=>x.name===name&&x.label==='candidate');
    assert.ok([...old,...current].every(x=>x.resultSha256===old[0].resultSha256),'complete output changed, including work and truncation');
    const a=median(old.map(x=>x.wallMs)),b=median(current.map(x=>x.wallMs));
    const memoryBefore=median(old.map(x=>x.peakRssBytes)),memoryAfter=median(current.map(x=>x.peakRssBytes));
    return {name,identicalFullOutput:true,baselineMedianMs:a,candidateMedianMs:b,speedup:a/b,baselineMedianRssBytes:memoryBefore,candidateMedianRssBytes:memoryAfter,memoryRatio:memoryAfter/memoryBefore,complete:old[0].complete,phases:old[0].phases};
  });
  const geometricMean=Math.exp(summary.reduce((sum,x)=>sum+Math.log(x.speedup),0)/summary.length);
  const gates={identicalOutputs:true,geometricMean:geometricMean>=1.10,hotWorkloadGain:summary.some(x=>x.baselineMedianMs>=50&&x.speedup>=1.15),noMaterialSlowdown:summary.every(x=>x.candidateMedianMs<=x.baselineMedianMs*1.05+2),memory:summary.every(x=>x.memoryRatio<=1.05)};
  const result={status:'measured',environment:{node:process.version,platform:process.platform,arch:process.arch},scope:'Fresh process per trial, one full warmup then GC then one timed audit; five alternating-order repetitions. Core only, identical input/budgets, complete output digest includes work counters and partial coverage.',geometricMeanSpeedup:geometricMean,gates,accepted: Object.values(gates).every(Boolean),summary,runs};
  write(join(evidence,'comparison.json'),result);console.log(JSON.stringify({geometricMeanSpeedup:geometricMean,gates,accepted:result.accepted,summary},null,2));
}else throw new Error('Use prepare, profile, worker or compare');
