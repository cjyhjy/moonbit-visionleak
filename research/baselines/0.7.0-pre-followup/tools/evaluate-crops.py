#!/usr/bin/env python3
"""Frozen, source-disjoint crop evaluation with independent set and ImageHash oracles."""
import argparse,hashlib,itertools,json,pathlib,subprocess,tempfile,time,datetime,importlib.metadata
from PIL import Image
import imagehash
from evaluate import canonical,pair_key,score
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'research/photos-v2'
FROZEN_FILES=['core/crops.mbt','core/audit.mbt','core/fingerprint.mbt','core/cli_options.mbt','core/review_validation.mbt','core/workflow.mbt','tools/runtime.mjs','tools/cli.mjs','tools/decode.mjs','tools/evaluate-crops.py','tools/prepare-photos-v2.py','tests/crops.test.mjs','tests/metric_reference.py','dist/visionleak.js']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def check_freeze():
    f=json.loads((DATA/'freeze-0.5.0.json').read_text())
    for name,expected in f['implementationFiles'].items():assert digest(ROOT/name)==expected,('implementation changed after freeze',name)
    return f

def generate(rows,folder):
    records=[]
    for row in rows:
        source=ROOT/row['storedFile'];assert digest(source)==row['sha256']
        image=Image.open(source).convert('RGB')
        variants=[('original','train',image,None),('byte-copy','test',image,None),('pixel-repack','validation',image,None),('jpeg70','test',image,'JPEG')]
        for name,split,rect in [('center75','test',[125,125,875,875]),('offset75','validation',[250,0,1000,750]),('aspect75','test',[0,0,750,1000])]:
            box=tuple(v*(image.width if i%2==0 else image.height)//1000 for i,v in enumerate(rect))
            variants.append((name,split,image.crop(box),None))
        original=None
        for name,split,value,fmt in variants:
            p=folder/split/(row['id']+'-'+name+('.jpg' if fmt else '.png'));p.parent.mkdir(parents=True,exist_ok=True)
            if name=='byte-copy':p.write_bytes(original.read_bytes())
            elif fmt:value.save(p,format=fmt,quality=70,subsampling=0)
            else:value.save(p,format='PNG',compress_level=1 if name=='pixel-repack' else 6)
            if name=='original':original=p
            decoded=Image.open(p).convert('RGBA');identity,_,_=canonical(decoded.width,decoded.height,decoded.tobytes())
            records.append({'id':p.relative_to(folder).as_posix(),'path':p.relative_to(folder).as_posix(),'sourceId':row['id'],'scene':row['scene'],'transform':name,'split':split,'byteDigest':digest(p),'pixelDigest':identity['pixelDigest']})
    truth={'images':records,'pairs':[]}
    for a,b in itertools.combinations(records,2):
        if a['split']==b['split']:continue
        relation='byte-identical' if a['byteDigest']==b['byteDigest'] else 'pixel-identical' if a['pixelDigest']==b['pixelDigest'] else 'near-source' if a['sourceId']==b['sourceId'] else 'negative'
        truth['pairs'].append({'left':a['id'],'right':b['id'],'relation':relation})
    return truth

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--partition',choices=['development','holdout'],required=True);p.add_argument('--out',type=pathlib.Path,required=True);p.add_argument('--freeze',action='store_true');args=p.parse_args()
    if args.freeze:
        path=DATA/'freeze-0.5.0.json'
        if path.exists():raise ValueError('freeze is append-only')
        d={'schemaVersion':'visionleak-local-freeze-v1','frozenAt':now(),'cropImplementationSha256':digest(ROOT/'core/crops.mbt'),'implementationFiles':{name:digest(ROOT/name) for name in FROZEN_FILES},'threshold':6,'localProfile':'vl-local-dhash-v1','minimumGridContrast':16,'imageHashBaseline':{'function':'crop_resistant_hash','segmentation_image_size':300,'min_segment_size':500,'matches_region_cutoff':1,'hamming_cutoff':6},'holdoutDownloadedOrViewed':False,'policy':'No tuning after freeze; holdout original images have not been downloaded or viewed. Metadata and source/scene partition assigned before development image metrics.'}
        path.write_text(json.dumps(d,indent=2)+'\n')
    freeze=check_freeze();manifest=json.loads((DATA/'sources.json').read_text());rows=[r for r in manifest['images'] if r['partition']==args.partition]
    assert len(rows)==16
    args.out.mkdir(parents=True,exist_ok=False)
    with tempfile.TemporaryDirectory(prefix='vl-crop-eval-') as temp:
        data=pathlib.Path(temp)/'dataset';truth=generate(rows,data);reports={};timings={}
        for mode,extra in [('default',[]),('crops',['--include-crops'])]:
            out=pathlib.Path(temp)/mode;start=time.monotonic()
            command=['node','tools/cli.mjs','audit','--root',str(data),'--out',str(out),'--max-images','1000','--max-comparisons','10000000',*extra]
            run=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=300);assert run.returncode==0,run.stderr
            timings[mode]=time.monotonic()-start;report=json.loads((out/'report.json').read_text());reports[mode]=report
            (args.out/(mode+'-audit.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        records={r['id']:r for r in truth['images']};eligible={pair_key(p['left'],p['right']) for p in truth['pairs'] if p['relation'] not in ('byte-identical','pixel-identical')};positive={pair_key(p['left'],p['right']) for p in truth['pairs'] if p['relation']=='near-source'}
        def counts(predicted):
            predicted=set(predicted)&eligible;tp=predicted&positive;fp=predicted-positive;fn=positive-predicted
            return {'tp':len(tp),'fp':len(fp),'fn':len(fn),'precision':len(tp)/(len(tp)+len(fp)) if tp or fp else None,'recall':len(tp)/len(positive) if positive else None,'falsePositives':[list(k) for k in sorted(fp)],'falseNegatives':[list(k) for k in sorted(fn)]}
        ih={};oracle_start=time.monotonic()
        for row in truth['images']:
            ih[row['id']]=imagehash.crop_resistant_hash(Image.open(data/row['path']).convert('RGB'),segmentation_image_size=300,min_segment_size=500)
        predictions=[]
        for pair in truth['pairs']:
            a,b=pair['left'],pair['right']
            if ih[a].matches(ih[b],region_cutoff=1,hamming_cutoff=6) or ih[b].matches(ih[a],region_cutoff=1,hamming_cutoff=6):predictions.append(pair_key(a,b))
        crop=reports['crops'];global_keys={pair_key(p['left'],p['right']) for p in reports['default']['pairs']}
        assert all(p in crop['pairs'] for p in reports['default']['pairs'])
        assert crop['groups']==reports['default']['groups']
        # Independently exhaust all local hashes, including same-pair exclusion by preceding tiers.
        exhaustive=set()
        for a,b in itertools.combinations(crop['images'],2):
            key=pair_key(a['id'],b['id'])
            if a['split']==b['split'] or key in global_keys:continue
            if any(sum(x!=y for x,y in zip(ha,hb))<=6 for ha,ca in zip(a['localHashes'],a['localContrasts']) if ca>=16 for hb,cb in zip(b['localHashes'],b['localContrasts']) if cb>=16):exhaustive.add(key)
        local={pair_key(p['left'],p['right']) for p in crop['pairs'] if p['evidence']=='local-candidate'};assert local==exhaustive,'local BK index differs from independent exhaustive Hamming reference'
        hard={pair_key(p['left'],p['right']) for p in truth['pairs'] if p['relation']=='negative' and records[p['left']]['scene']==records[p['right']]['scene']}
        result={'schemaVersion':'visionleak-crop-evaluation-v1','evaluatedAt':now(),'partition':args.partition,'freezeSha256':digest(DATA/'freeze-0.5.0.json'),'frozenAt':freeze['frozenAt'],'sources':len(rows),'images':len(truth['images']),'hardNegativePairs':len(hard),'localCandidate':counts(local),'defaultCandidates':counts(global_keys),'combinedCandidates':counts(pair_key(p['left'],p['right']) for p in crop['pairs']),'imageHashCropBaseline':counts(predictions),'imageHashVersion':importlib.metadata.version('ImageHash'),'independentLocalIndexParity':True,'exactGroupsUnchanged':True,'scores':{mode:score(truth,r['pairs']) for mode,r in reports.items()},'hardNegativeFalsePositives':len(hard&local),'timingsSeconds':timings,'imageHashSeconds':time.monotonic()-oracle_start,'stats':{mode:r['stats'] for mode,r in reports.items()},'scope':'Generated transforms of independent CC0 photographs; different photographs of the same landmark are negatives, semantic similarity is outside ground truth.'}
        (args.out/'ground-truth.json').write_text(json.dumps(truth,ensure_ascii=False,indent=2)+'\n');(args.out/'evaluation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({'partition':args.partition,'sources':len(rows),'images':len(truth['images']),'hardNegativePairs':len(hard),**{name:{k:result[name][k] for k in ['tp','fp','fn','precision','recall']} for name in ['localCandidate','combinedCandidates','imageHashCropBaseline']}},ensure_ascii=False))
if __name__=='__main__':main()
