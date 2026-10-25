#!/usr/bin/env python3
"""Generate temporary deterministic raster datasets and record real CLI resources."""
import argparse,datetime,hashlib,json,pathlib,platform,re,subprocess,tempfile,time
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
def run_case(data,out,extra,max_images,log):
    command=['node','tools/cli.mjs','audit','--root',str(data),'--out',str(out),'--max-images',str(max_images),*extra]
    timing=['/usr/bin/time','-l','-o',str(log)] if platform.system()=='Darwin' else ['/usr/bin/time','-v','-o',str(log)]
    start=time.monotonic();run=subprocess.run(timing+command,cwd=ROOT,capture_output=True,text=True,timeout=600);wall=time.monotonic()-start
    assert run.returncode in (0,2),(run.returncode,run.stderr)
    raw=log.read_text();match=re.search(r'(\d+)\s+maximum resident set size',raw) if platform.system()=='Darwin' else re.search(r'Maximum resident set size \(kbytes\):\s*(\d+)',raw)
    rss=int(match[1])*(1 if platform.system()=='Darwin' else 1024)
    report=json.loads((out/'report.json').read_text());assert len(report['images'])==max_images
    return {'command':command[0:4]+['<generated-dataset>','--out','<temporary-output>',*command[7:]],'exitCode':run.returncode,'wallSeconds':wall,'peakRssBytes':rss,'complete':report['complete'],'images':len(report['images']),'stats':report['stats'],'errors':report['errors'],'timeLog':str(log.relative_to(ROOT)),'options':report['options']}
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--out',type=pathlib.Path,required=True);args=p.parse_args();args.out=args.out.resolve();args.out.mkdir(parents=True,exist_ok=False)
    result={'schemaVersion':'visionleak-scale-v1','createdAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'environment':{'platform':platform.platform()},'dataset':'Distinct SHAKE-256-seeded 32x32 RGB PNGs; balanced train/validation/test; generated at test time and not committed. This measures resource use, not natural-data detection quality.','runs':[]}
    with tempfile.TemporaryDirectory(prefix='vl-scale-') as temp:
        temp=pathlib.Path(temp)
        for count in [1000,5000]:
            data=temp/str(count)
            for i in range(count):
                path=data/['train','validation','test'][i%3]/f'{i:05d}.png';path.parent.mkdir(parents=True,exist_ok=True)
                pixels=hashlib.shake_256(f'visionleak-scale-v1-{i}'.encode()).digest(32*32*3)
                Image.frombytes('RGB',(32,32),pixels).save(path,compress_level=1)
            for mode,extra in [('default',[]),('mirrors',['--include-mirrors']),('orientations',['--include-mirrors','--include-rotations']),('crops',['--include-crops'])]:
                log=args.out/f'{count}-{mode}-time.log';row=run_case(data,temp/f'out-{count}-{mode}',extra,count,log);row.update({'count':count,'mode':mode});result['runs'].append(row)
                (args.out/'results.json').write_text(json.dumps(result,indent=2)+'\n');print(count,mode,round(row['wallSeconds'],3),round(row['peakRssBytes']/2**20,2),row['complete'],row['stats']['comparisons'],flush=True)
        data=temp/'64mp';(data/'train').mkdir(parents=True);Image.new('RGB',(8000,8000),(73,127,191)).save(data/'train/64mp.jpg',quality=90)
        row=run_case(data,temp/'out-64mp',[],1,args.out/'64mp-time.log');row.update({'sourcePixels':64000000,'scope':'One image at the default max-decode-pixels boundary; CLI RSS only, generation excluded. Highest permitted pixel count, not a proof of worst RSS over all codecs/contents.'});result['defaultDecodeBoundary']=row
        (args.out/'results.json').write_text(json.dumps(result,indent=2)+'\n');print('64MP',round(row['wallSeconds'],3),round(row['peakRssBytes']/2**20,2),row['complete'],flush=True)
if __name__=='__main__':main()
