#!/usr/bin/env python3
"""Metadata-first CC0 evaluation sources; downloading requires a frozen protocol."""
import argparse, datetime, hashlib, io, json, pathlib, re, urllib.parse, urllib.request
from PIL import Image, ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'research/photos-v3'
SCENES=['Brooklyn Bridge','Leaning Tower of Pisa','Arc de Triomphe','brick wall']
def digest(data):return hashlib.sha256(data).hexdigest()
def get(url,limit=16*1024*1024):
    req=urllib.request.Request(url,headers={'User-Agent':'VisionLeak/0.7.0 (public CC0 evaluation; local research)'})
    with urllib.request.urlopen(req,timeout=45) as response:data=response.read(limit+1)
    if len(data)>limit:raise ValueError('download budget')
    return data

def metadata():
    destination=DATA/'selection.json'
    if destination.exists():raise ValueError('source selection is append-only')
    excluded=json.loads((ROOT/'research/photos-v2/sources.json').read_text())['images']+json.loads((ROOT/'research/photos-v1/sources.json').read_text())['images']
    ids={str(r['id']) for r in excluded};sha1s={r.get('upstreamSha1') for r in excluded};rows=[];queries=[]
    for scene in SCENES:
        query='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','generator':'search','gsrsearch':scene+' filetype:bitmap incategory:"CC-Zero"','gsrnamespace':6,'gsrlimit':12,'prop':'imageinfo','iiprop':'url|extmetadata|sha1|size','iiurlwidth':512})
        raw=get(query);d=json.loads(raw);queries.append({'scene':scene,'url':query,'responseSha256':digest(raw)})
        (DATA/('metadata-'+str(len(queries))+'.json')).write_bytes(raw)
        count=0
        for page in sorted(d.get('query',{}).get('pages',{}).values(),key=lambda p:p.get('index',0)):
            info=page['imageinfo'][0];meta=info.get('extmetadata',{})
            if meta.get('LicenseShortName',{}).get('value')!='CC0' or str(page['pageid']) in ids or info['sha1'] in sha1s:continue
            if not urllib.parse.urlparse(info['url']).path.lower().endswith(('.jpg','.jpeg','.png')) or info['width']<320 or info['height']<240:continue
            rows.append({'id':str(page['pageid']),'title':page['title'],'scene':scene,'author':re.sub('<[^>]*>','',meta.get('Artist',{}).get('value','unknown')),'license':'CC0-1.0','licenseUrl':meta.get('LicenseUrl',{}).get('value'),'licenseEvidence':info['descriptionurl'],'downloadUrl':info.get('thumburl',info['url']),'upstreamSha1':info['sha1'],'width':info['width'],'height':info['height']})
            count+=1
            if count==3:break
        if count<3:raise ValueError('not enough eligible sources: '+scene)
    assert len({r['id'] for r in rows})==12
    destination.write_text(json.dumps({'schemaVersion':'visionleak-source-selection-v3','selectedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'policy':'First 3 eligible API search results per declared scene, selected from metadata only. No image content downloaded or evaluated at selection. All sources unseen by prior v1/v2 evaluations; same-scene different files treated as negatives under source-file ground truth.','queries':queries,'images':rows},ensure_ascii=False,indent=2)+'\n')
    print('Selected',len(rows),'CC0 photos from metadata only',flush=True)

def download():
    freeze=json.loads((DATA/'freeze-0.7.0.json').read_text())
    for name,value in freeze['implementationFiles'].items():assert digest((ROOT/name).read_bytes())==value,('changed after freeze',name)
    selection=DATA/'selection.json';assert digest(selection.read_bytes())==freeze['selectionSha256']
    manifest=DATA/'sources.json'
    if manifest.exists():raise ValueError('download receipt is append-only; use existing stored images')
    d=json.loads(selection.read_text());(DATA/'originals').mkdir(exist_ok=True)
    for row in d['images']:
        raw=get(row['downloadUrl']);image=ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB');image.thumbnail((384,384),Image.Resampling.LANCZOS)
        path=DATA/'originals'/(row['id']+'.png');image.save(path,format='PNG')
        row.update({'downloadSha256':digest(raw),'sha256':digest(path.read_bytes()),'storedFile':path.relative_to(ROOT).as_posix(),'storedWidth':image.width,'storedHeight':image.height,'modification':'EXIF transpose, RGB, longest edge <=384 using Pillow LANCZOS, lossless PNG storage; no content editing'})
        print(row['id'],'stored',flush=True)
    d['downloadedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat();d['freezeSha256']=digest((DATA/'freeze-0.7.0.json').read_bytes());manifest.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    lines=['# 新来源照片（0.7.0）','','12 个先前 v1/v2 未使用的文件来源，先冻结规则，再下载评测。每场景 3 张不同照片；不代表自然污染。','']
    for row in d['images']:lines.append(f"- `{row['id']}` · {row['scene']} · {row['author']} · [来源与 CC0 许可]({row['licenseEvidence']}) · SHA-256 `{row['sha256']}`")
    (DATA/'ATTRIBUTION.md').write_text('\n'.join(lines)+'\n')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('operation',choices=['metadata','download']);args=p.parse_args();DATA.mkdir(exist_ok=True);metadata() if args.operation=='metadata' else download()
