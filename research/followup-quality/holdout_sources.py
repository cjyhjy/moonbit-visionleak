"""Frozen metadata selection, followed by bounded CC0 source acquisition."""
import argparse, datetime, hashlib, io, json, pathlib, re, time, urllib.error, urllib.parse, urllib.request
from PIL import Image, ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[2]
HERE=pathlib.Path(__file__).resolve().parent
DATA=HERE/'holdout'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def write(path,value):path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def read(path):return json.loads(path.read_text())
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def get(url,limit=16*1024*1024):
    for attempt in range(5):
        time.sleep(5)
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'VisionLeak/0.7.0 (CC0 reproducible research)'})
            with urllib.request.urlopen(req,timeout=45) as response:raw=response.read(limit+1)
            if len(raw)>limit:raise ValueError('Source download byte limit exceeded')
            return raw
        except urllib.error.HTTPError as error:
            if error.code!=429:raise
            try:delay=max(60,int(error.headers.get('Retry-After','60')))
            except ValueError:delay=60
            if delay>300:raise RuntimeError('Retry-After exceeds this acquisition session; resume later')
            print('Honoring rate limit:',delay,'seconds',flush=True)
            while delay>0:
                step=min(30,delay);time.sleep(step);delay-=step
    raise RuntimeError('Five paced download attempts exhausted')
def frozen():
    f=read(HERE/'holdout-freeze.json')
    for path,expected in f['files'].items():assert sha(ROOT/path)==expected,path
    return f
def metadata():
    f=frozen();DATA.mkdir(exist_ok=True)
    target=DATA/'selection.json'
    if target.exists():raise ValueError('Selection already exists; do not reselect')
    ids=set(f['knownSourceIds']);hashes=set(f['knownUpstreamSha1']);rows=[];queries=[]
    for number,scene in enumerate(f['selectionPolicy']['scenes'],1):
        query='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','generator':'search','gsrsearch':scene+' filetype:bitmap incategory:"CC-Zero"','gsrnamespace':6,'gsrlimit':20,'prop':'imageinfo','iiprop':'url|extmetadata|sha1|size','iiurlwidth':512})
        raw=get(query);(DATA/f'metadata-{number}.json').write_bytes(raw);data=json.loads(raw)
        queries.append({'scene':scene,'url':query,'responseSha256':hashlib.sha256(raw).hexdigest()})
        count=0
        for page in sorted(data.get('query',{}).get('pages',{}).values(),key=lambda p:p.get('index',0)):
            info=page['imageinfo'][0];meta=info.get('extmetadata',{});id=str(page['pageid'])
            if meta.get('LicenseShortName',{}).get('value')!='CC0' or id in ids or info['sha1'] in hashes:continue
            if not urllib.parse.urlparse(info['url']).path.lower().endswith(('.jpg','.jpeg','.png')) or info['width']<320 or info['height']<240:continue
            row={'id':id,'title':page['title'],'scene':scene,'author':re.sub('<[^>]*>','',meta.get('Artist',{}).get('value','unknown')),'license':'CC0-1.0','licenseUrl':meta.get('LicenseUrl',{}).get('value'),'licenseEvidence':info['descriptionurl'],'downloadUrl':info.get('thumburl',info['url']),'originalUrl':info['url'],'upstreamSha1':info['sha1'],'width':info['width'],'height':info['height']}
            rows.append(row);ids.add(id);hashes.add(info['sha1']);count+=1
            if count==f['selectionPolicy']['filesPerScene']:break
        if count<f['selectionPolicy']['filesPerScene']:
            write(DATA/'selection-incomplete.json',{'scene':scene,'count':count,'queries':queries,'images':rows,'status':'incomplete-no-images-downloaded'})
            raise ValueError('Too few eligible sources in the declared query: '+scene)
    write(target,{'selectedAt':now(),'policy':f['selectionPolicy'],'queries':queries,'images':rows})
    write(HERE/'holdout-selection-freeze.json',{'frozenAt':now(),'algorithmFreezeSha256':sha(HERE/'holdout-freeze.json'),'selectionSha256':sha(target),'imageContentDownloaded':False})
    print('Selected',len(rows),'sources from metadata only',flush=True)
def download():
    f=frozen();binding=read(HERE/'holdout-selection-freeze.json')
    assert binding['algorithmFreezeSha256']==sha(HERE/'holdout-freeze.json')
    assert binding['selectionSha256']==sha(DATA/'selection.json')
    target=DATA/'sources.json'
    if target.exists():raise ValueError('Source manifest already exists; reuse frozen files')
    selected=read(DATA/'selection.json');(DATA/'originals').mkdir(exist_ok=True);(DATA/'downloads').mkdir(exist_ok=True)
    rows=[]
    for row in selected['images']:
        cached=DATA/'downloads'/(row['id']+'.json')
        if cached.exists():
            row=read(cached);assert sha(ROOT/row['storedFile'])==row['sha256'];rows.append(row);continue
        raw=get(row['downloadUrl']);image=ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB');image.thumbnail((384,384),Image.Resampling.LANCZOS)
        path=DATA/'originals'/(row['id']+'.png');image.save(path,format='PNG')
        row.update(downloadSha256=hashlib.sha256(raw).hexdigest(),sha256=sha(path),storedFile=path.relative_to(ROOT).as_posix(),storedWidth=image.width,storedHeight=image.height,modification='EXIF transpose, RGB, longest edge <=384 with Pillow LANCZOS, PNG storage; downstream preparation applies product sRGB normalization to every source before crops.')
        write(cached,row);rows.append(row);print(row['id'],'stored',flush=True)
    write(target,{'downloadedAt':now(),'algorithmFreezeSha256':sha(HERE/'holdout-freeze.json'),'selectionFreezeSha256':sha(HERE/'holdout-selection-freeze.json'),'images':rows})
    lines=['# Frozen new-source controlled crop holdout','','Metadata-selected CC0 file sources. Source-file labels; no human semantic adjudication or natural-contamination claim.','']
    lines += [f"- `{r['id']}` · {r['scene']} · {r['author']} · [source and declared CC0 license]({r['licenseEvidence']}) · SHA-256 `{r['sha256']}`" for r in rows]
    (DATA/'ATTRIBUTION.md').write_text('\n'.join(lines)+'\n')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('operation',choices=['metadata','download']);a=p.parse_args()
    metadata() if a.operation=='metadata' else download()
