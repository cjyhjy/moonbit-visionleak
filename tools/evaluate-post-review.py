#!/usr/bin/env python3
"""Predeclared new-source evaluation: controlled transforms, hard negatives and review load."""
import argparse, datetime, hashlib, itertools, json, pathlib, random, subprocess, sys, tempfile, time
from PIL import Image, ImageDraw, ImageEnhance, ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tests'))
from metric_reference import score
from evaluate import canonical
DATA=ROOT/'research/photos-v3'
FROZEN=['core/audit.mbt','core/crops.mbt','core/fingerprint.mbt','core/cli_options.mbt','core/mih.mbt','core/review_ranking.mbt','tools/decode.mjs','tools/runtime.mjs','tools/cli.mjs','tools/input.mjs','tools/fingerprint-cache.mjs','tools/evaluate-post-review.py','tools/prepare-photos-v3.py','dist/visionleak.js']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def freeze():
    path=DATA/'freeze-0.7.0.json'
    with path.open('x') as f:json.dump({'schemaVersion':'visionleak-evaluation-freeze-v3','frozenAt':now(),'selectionSha256':digest(DATA/'selection.json'),'implementationFiles':{n:digest(ROOT/n) for n in FROZEN},'protocol':{'threshold':6,'localProfile':'vl-local-dhash-v1','maxComparisonsPerApproximatePhase':10000000,'maxExactComparisons':1000000,'randomSeed':'SHA256(visionleak-v3-crop-{sourceId})','cropPolicy':'Two independent non-window-aligned rectangles: 58..86% per dimension; uniform integer offsets. Never snap to the product windows.','transforms':['original','byte-copy','pixel-repack','jpeg45','random-crop-a','random-crop-b','watermark','color','screenshot-border'],'hardNegatives':'different source files in the same predeclared scene, including brick textures; file-source lineage labels, no natural-contamination claim','groundTruth':'Same source-file lineage is near-source except exact byte/pixel identities. Different selected files are negatives; manual semantic adjudication not performed.','reviewLoad':'candidate pairs per 1000 images and top-25/50/100 precision for report versus optional support order','humanReviewTiming':'not measured; do not substitute automated runtime','noTuning':'Do not tune rules or remove difficult images after viewing results; errors remain visible.'}},f,ensure_ascii=False,indent=2);f.write('\n')
    print('Protocol frozen before downloading source image content')
def generated(rows,folder):
    records=[]
    for row in rows:
        path=ROOT/row['storedFile'];assert digest(path)==row['sha256'];image=Image.open(path).convert('RGB')
        rng=random.Random(int(hashlib.sha256(('visionleak-v3-crop-'+row['id']).encode()).hexdigest(),16))
        crops=[]
        for _ in range(2):
            w=max(1,image.width*rng.randint(58,86)//100);h=max(1,image.height*rng.randint(58,86)//100);x=rng.randint(0,image.width-w);y=rng.randint(0,image.height-h);crops.append((image.crop((x,y,x+w,y+h)),[x,y,x+w,y+h]))
        watermark=image.copy();draw=ImageDraw.Draw(watermark);draw.rectangle((0,image.height-26,image.width,image.height),fill='white');draw.text((5,image.height-20),'VISIONLEAK SAMPLE',fill='black')
        variants=[('original','train',image,None),('byte-copy','test',image,None),('pixel-repack','validation',image,None),('jpeg45','test',image,None),('random-crop-a','test',*crops[0]),('random-crop-b','validation',*crops[1]),('watermark','test',watermark,None),('color','validation',ImageEnhance.Color(ImageEnhance.Brightness(image).enhance(1.08)).enhance(0.65),None),('screenshot-border','test',ImageOps.expand(image,border=(17,29,13,19),fill='#e8e8e8'),None)]
        original=None
        for name,split,value,rect in variants:
            dest=folder/split/(row['id']+'-'+name+('.jpg' if name=='jpeg45' else '.png'));dest.parent.mkdir(parents=True,exist_ok=True)
            if name=='byte-copy':dest.write_bytes(original.read_bytes())
            elif name=='jpeg45':value.save(dest,quality=45,subsampling=2)
            else:value.save(dest,format='PNG',compress_level=0 if name=='pixel-repack' else 6)
            if name=='original':original=dest
            decoded=Image.open(dest).convert('RGBA');identity,_,_=canonical(decoded.width,decoded.height,decoded.tobytes())
            records.append({'id':dest.relative_to(folder).as_posix(),'path':dest.relative_to(folder).as_posix(),'split':split,'sourceId':row['id'],'scene':row['scene'],'transform':name,'cropPixels':rect,'byteDigest':digest(dest),'pixelDigest':identity['pixelDigest']})
    truth={'images':records,'pairs':[]}
    for a,b in itertools.combinations(records,2):
        if a['split']==b['split']:continue
        kind='byte-identical' if a['byteDigest']==b['byteDigest'] else 'pixel-identical' if a['pixelDigest']==b['pixelDigest'] else 'near-source' if a['sourceId']==b['sourceId'] else 'negative'
        truth['pairs'].append({'left':a['id'],'right':b['id'],'relation':kind})
    return truth

def key(p):return tuple(sorted((p['left'],p['right'])))
def run(out, regression=False):
    protocol=json.loads((DATA/'freeze-0.7.0.json').read_text())
    if regression:
        from frozen_post_review import verify_archive
        verify_archive()
        historical=json.loads((ROOT/'reports/post-review/photos/evaluation.json').read_text())
        assert digest(DATA/'sources.json')==historical['sourcesSha256'], 'known source manifest changed'
    else:
        for name,value in protocol['implementationFiles'].items():assert digest(ROOT/name)==value,('changed after freeze; use --regression for current code or tools/frozen_post_review.py for historical replay',name)
    assert digest(DATA/'selection.json')==protocol['selectionSha256']
    manifest=json.loads((DATA/'sources.json').read_text());out.mkdir(parents=True,exist_ok=False)
    previous=json.loads((ROOT/'research/photos-v2/sources.json').read_text())['images']+json.loads((ROOT/'research/photos-v1/sources.json').read_text())['images'];assert not {r['id'] for r in previous}&{r['id'] for r in manifest['images']}
    reports={};times={}
    with tempfile.TemporaryDirectory(prefix='vl-new-photos-') as temp:
        temp=pathlib.Path(temp);data=temp/'data';truth=generated(manifest['images'],data)
        if regression:
            assert truth==json.loads((ROOT/'reports/post-review/photos/ground-truth.json').read_text()), 'known transform labels changed'
        for mode,flags in [('default',[]),('crops',['--include-crops'])]:
            start=time.monotonic();result=subprocess.run(['node','tools/cli.mjs','audit','--root',str(data),'--out',str(temp/mode),'--max-comparisons','10000000',*flags],cwd=ROOT,capture_output=True,text=True,timeout=300);assert result.returncode==0,result.stderr
            times[mode]=time.monotonic()-start;reports[mode]=json.loads((temp/mode/'report.json').read_text())
            (out/(mode+'-audit.json')).write_text(json.dumps(reports[mode],ensure_ascii=False,indent=2)+'\n')
            if regression:
                old=json.loads((ROOT/f'reports/post-review/photos/{mode}-audit.json').read_text())
                assert reports[mode]['complete']
                assert reports[mode]['pairs']==old['pairs'], ('ordered evidence/witness regression',mode)
                assert reports[mode]['groups']==old['groups'], ('exact group regression',mode)
        assert reports['default']['groups']==reports['crops']['groups']
        assert all(p in reports['crops']['pairs'] for p in reports['default']['pairs'])
        crops=reports['crops'];global_keys={key(p) for p in reports['default']['pairs']};exhaustive=set()
        def bits(h):return int(h,2)
        for a,b in itertools.combinations(crops['images'],2):
            k=tuple(sorted((a['id'],b['id'])))
            if a['split']==b['split'] or k in global_keys:continue
            if any((bits(ha)^bits(hb)).bit_count()<=6 for ha,ca in zip(a['localHashes'],a['localContrasts']) if ca>=16 for hb,cb in zip(b['localHashes'],b['localContrasts']) if cb>=16):exhaustive.add(k)
        assert exhaustive=={key(p) for p in crops['pairs'] if p['evidence']=='local-candidate'}
        # Independently enumerate full-image Hamming candidates, including exact precedence.
        global_expected=set()
        for a,b in itertools.combinations(reports['default']['images'],2):
            if a['split']!=b['split'] and (a['byteDigest']==b['byteDigest'] or a['pixelDigest']==b['pixelDigest'] or (bits(a['dhash'])^bits(b['dhash'])).bit_count()<=6):global_expected.add(tuple(sorted((a['id'],b['id']))))
        assert global_expected==global_keys
        script="import{readFileSync}from'node:fs';import{workflow_json}from'./dist/visionleak.js';console.log(workflow_json(JSON.stringify({operation:'reviewOrder',report:JSON.parse(readFileSync(0,'utf8'))})));"
        ordering=json.loads(subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,input=json.dumps(crops),capture_output=True,text=True,check=True).stdout)
        labels={key(p):p['relation'] for p in truth['pairs']};record={r['id']:r for r in truth['images']}
        def near_order(pairs):return [key(p) for p in pairs if p['evidence'] not in ('byte-identical','pixel-identical')]
        def top(keys):return {str(k):{'reviewed':len(keys[:k]),'truePositive':sum(labels[p]=='near-source' for p in keys[:k]),'precision':sum(labels[p]=='near-source' for p in keys[:k])/len(keys[:k]) if keys[:k] else None} for k in [25,50,100]}
        lookup={json.dumps(list(key(p)),separators=(',',':')):p for p in crops['pairs']}
        candidate_count=len(near_order(crops['pairs']))
        same_scene={key(p) for p in truth['pairs'] if p['relation']=='negative' and record[p['left']]['scene']==record[p['right']]['scene']}
        hard_fp=same_scene&set(near_order(crops['pairs']))
        anchors={}
        for transform in protocol['protocol']['transforms'][3:]:
            target=[p for p in truth['pairs'] if labels[key(p)]=='near-source' and {record[p['left']]['transform'],record[p['right']]['transform']}=={'original',transform}]
            anchors[transform]={'targets':len(target),'found':sum(key(p) in {key(q) for q in crops['pairs']} for p in target)}
        result={'schemaVersion':'visionleak-post-review-evaluation-v1','evaluatedAt':now(),'freezeSha256':digest(DATA/'freeze-0.7.0.json'),'sourcesSha256':digest(DATA/'sources.json'),'newSourceFiles':12,'images':len(truth['images']),'scores':{m:score(truth,r['pairs']) for m,r in reports.items()},'independentGlobalIndexParity':True,'independentLocalIndexParity':True,'exactGroupsUnchanged':True,'sameSceneNegativePairs':len(same_scene),'sameSceneFalsePositivePairs':len(hard_fp),'anchorRetrievalByTransform':anchors,'reviewLoad':{'candidatePairs':candidate_count,'pairsPer1000Images':candidate_count*1000/len(truth['images']),'originalOrderTopK':top(near_order(crops['pairs'])),'experimentalOrderTopK':top(near_order([lookup[k] for k in ordering['keys']])),'scoredLocalPairs':ordering['scoredLocalPairs'],'unscoredLocalPairs':ordering['unscoredLocalPairs'],'humanReviewSeconds':None,'humanReviewStatus':'not-measured'},'automatedWallSeconds':times,'phases':{m:r['phases'] for m,r in reports.items()},'scope':'New source-file holdout under a frozen protocol; controlled transforms and metadata-selected same-scene negatives. No tuning after measurement. Natural contamination and human review time untested.'}
        if regression:
            source=subprocess.check_output(['node','--input-type=module','-e',"import{sourceDigest}from'./tools/source-digest.mjs';console.log(sourceDigest(process.cwd()))"],cwd=ROOT,text=True).strip()
            result.update(evaluationRole='known-source-regression',newSourceFiles=0,sourceFiles=len(manifest['images']),currentSourceDigest=source,currentArtifactSha256=digest(ROOT/'dist/visionleak.js'),orderedBaselineParity=True,scope='Current implementation on already-known photos-v3; unchanged source bytes, transforms and labels; strict ordered evidence and window-witness comparison to the frozen staged baseline. Not a new holdout; natural contamination and human review time untested.')
        (out/'ground-truth.json').write_text(json.dumps(truth,ensure_ascii=False,indent=2)+'\n');(out/'evaluation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({k:result[k] for k in ['newSourceFiles','images','reviewLoad','anchorRetrievalByTransform']},ensure_ascii=False))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--freeze',action='store_true');p.add_argument('--regression',action='store_true');p.add_argument('--out',type=pathlib.Path);args=p.parse_args()
    if args.freeze:freeze()
    else:
        if not args.out:p.error('--out required')
        run(args.out, regression=args.regression)
