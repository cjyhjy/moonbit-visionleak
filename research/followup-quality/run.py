"""Run predeclared profiles once, sequentially, with the outer time bound."""
import argparse, datetime, hashlib, importlib.metadata, json, pathlib, platform, subprocess, sys, time
ROOT=pathlib.Path(__file__).resolve().parents[2]
HERE=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--dataset',type=pathlib.Path,required=True);p.add_argument('--partition',choices=['development','holdout'],required=True);args=p.parse_args()
protocol=json.loads((HERE/'protocol.json').read_text())
profiles=['v1-reference']+(protocol['explorationBudget']['scheduledProfiles'] if args.partition=='development' else [json.loads((HERE/'holdout-freeze.json').read_text())['selectedProfile']])
out=ROOT/'reports/followup-quality'/args.partition;out.mkdir(parents=True,exist_ok=True)
receipt={'startedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'partition':args.partition,'python':sys.version,'platform':platform.platform(),'packages':{n:importlib.metadata.version(n) for n in ['numpy','Pillow','opencv-python-headless']},'outerTimeoutSeconds':protocol['explorationBudget']['driverTimeoutSeconds'],'runs':[]}
for profile in profiles:
    target=out/(profile+'.json')
    if target.exists():raise SystemExit('Profile already measured: '+profile)
    start=time.monotonic()
    command=[sys.executable,str(HERE/'experiment.py'),'evaluate','--dataset',str(args.dataset),'--profile',profile,'--out',str(target)]
    try:
        result=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,timeout=receipt['outerTimeoutSeconds'])
        log=result.stdout+result.stderr;code=result.returncode
    except subprocess.TimeoutExpired as error:
        log='Outer driver time limit exceeded\n';code=124
    (out/(profile+'.log')).write_text(log)
    row={'profile':profile,'exitCode':code,'wallSecondsIncludingOracle':time.monotonic()-start,'log':profile+'.log'}
    if target.exists():row['resultSha256']=hashlib.sha256(target.read_bytes()).hexdigest()
    receipt['runs'].append(row)
    receipt['status']='running' if code==0 else 'failed'
    (out/'runs.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print(profile,code,log,flush=True)
    if code:raise SystemExit(code)
receipt['status']='passed';receipt['finishedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
(out/'runs.json').write_text(json.dumps(receipt,indent=2)+'\n')
