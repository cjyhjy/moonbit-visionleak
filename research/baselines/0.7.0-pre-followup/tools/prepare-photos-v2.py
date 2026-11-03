#!/usr/bin/env python3
"""Fetch only the requested frozen partition and preserve CC0 provenance."""
import argparse,concurrent.futures,hashlib,io,json,pathlib,time,urllib.request
from PIL import Image,ImageOps
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'research/photos-v2'
SCENES=['Golden Gate Bridge','Eiffel Tower','Colosseum Rome','Sydney Opera House','Mount Fuji','Statue of Liberty','Tower Bridge London','Niagara Falls']

def fetch(row):
    dest=DATA/'originals'/(row['id']+'.jpg')
    if dest.exists():return row['id'],None
    if row['license']!='CC0-1.0':raise ValueError('unapproved image license')
    request=urllib.request.Request(row['downloadUrl'],headers={'User-Agent':'VisionLeak/0.5.0 (CC0 evaluation photographs)'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request,timeout=40) as response:raw=response.read(16*1024*1024+1)
            if len(raw)>16*1024*1024:raise ValueError('image byte budget')
            break
        except OSError:
            if attempt==2:raise
            time.sleep(attempt+1)
    image=ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB')
    image.thumbnail((384,384),Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True,exist_ok=True);image.save(dest,quality=92,subsampling=0)
    return row['id'],{'downloadSha256':hashlib.sha256(raw).hexdigest(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'storedFile':str(dest.relative_to(ROOT)),'storedWidth':image.width,'storedHeight':image.height,'modification':'EXIF transpose, RGB, longest side <=384, JPEG quality92 4:4:4; no content edits'}

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--partition',choices=['development','holdout'],required=True);args=parser.parse_args()
    path=DATA/'sources.json'
    if not path.exists():
        candidates=json.loads((DATA/'source-candidates.json').read_text());rows=[]
        for i,scene in enumerate(SCENES):
            assert len(candidates[scene])==4
            for row in candidates[scene]:rows.append(dict(row,partition='development' if i<4 else 'holdout'))
        assert len({r['id'] for r in rows})==32
        path.write_text(json.dumps({'schemaVersion':'visionleak-photo-sources-v2','partitionPolicy':'First four declared landmark scenes development; remaining four holdout. Source and scene disjoint. Metadata selected before image metrics; holdout downloads require implementation freeze.','images':rows},ensure_ascii=False,indent=2)+'\n')
    d=json.loads(path.read_text())
    if args.partition=='holdout':
        freeze=DATA/'freeze-0.5.0.json'
        if not freeze.exists():raise ValueError('Holdout download requires implementation freeze')
        recorded=json.loads(freeze.read_text());assert hashlib.sha256((ROOT/'core/crops.mbt').read_bytes()).hexdigest()==recorded['cropImplementationSha256']
    selected=[r for r in d['images'] if r['partition']==args.partition]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for key,result in pool.map(fetch,selected):
            row=next(r for r in d['images'] if r['id']==key)
            if result:row.update(result)
            if not row.get('sha256'):
                p=DATA/'originals'/(key+'.jpg');row.update({'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'storedFile':str(p.relative_to(ROOT))})
            print(key,'ready',flush=True)
    path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
