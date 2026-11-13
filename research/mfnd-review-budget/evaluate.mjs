// Fixed before the first audit. Rank deterministic evidence first, then dHash
// distance, then ORB inlier count. Ties use stable image paths.
import {readFile, writeFile, mkdtemp} from 'node:fs/promises';
import {join} from 'node:path';
import {runAudit} from '../../tools/cli.mjs';
const dataset = '.cache/mfnd-first-volume';
const sample = JSON.parse(await readFile('research/mfnd-review-budget/sample.json'));
const work = await mkdtemp(join(dataset,'run-'));
const results = [];
const rank = { 'byte-identical':0, 'pixel-identical':1, 'perceptual-candidate':2, 'orb-candidate':3 };
for (const [part, groups] of Object.entries(sample.groups)) {
  const positives = new Set(groups.map(([a,b]) => 'test/'+b+'.jpg|train/'+a+'.jpg'));
  for (const [config, flags] of Object.entries({default:{},mirror:{includeMirrors:true},threshold10:{threshold:10},orb:{includeOrb:true}})) {
    let report;
    for (let attempt=0; attempt<20; attempt++) {
      const out = join(work,part+'-'+config+'-'+attempt);
      await runAudit({root:join(dataset,part),out,cache:join(work,part+'-cache'),options:{
        ...flags,maxOrbComparisons:2000000000,maxOrbMilliseconds:300000,
        maxOrbCandidates:1000,maxTotalPixels:1000000000,maxOrbTotalPixels:1000000000}});
      report=JSON.parse(await readFile(join(out,'report.json')));
      if(report.complete)break;
      if(report.phases.orb?.reason!=='ORB_WORK_BUDGET')throw Error(JSON.stringify(report.errors)+report.phases.orb?.reason);
    }
    if (!report.complete) throw Error('Incomplete gallery');
    const key=p=>[p.left,p.right].sort().join('|');
    const order=[...report.pairs].sort((a,b)=>(rank[a.evidence]-rank[b.evidence])||
      ((a.distance??0)-(b.distance??0))||((b.matchOrb?.inliers??0)-(a.matchOrb?.inliers??0))||key(a).localeCompare(key(b)));
    if(order.some(p=>!(p.evidence in rank)))throw Error('Unranked evidence '+order.map(p=>p.evidence));
    const labelled = order.filter(p=>positives.has(key(p))).length;
    const row={part,config,positivePairs:groups.length,found:labelled,candidates:order.length,
      foundInFirst50:order.slice(0,50).filter(p=>positives.has(key(p))).length,
      unlabelled:order.length-labelled,auditId:report.auditId};
    results.push(row); console.log(row);
    await writeFile('reports/post-090/mfnd.json',JSON.stringify(results,null,2)+'\n');
  }
}
