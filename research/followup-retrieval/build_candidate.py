"""Rebuild the frozen retrieval candidate in a new isolated directory."""
import argparse, hashlib, json, pathlib, shutil, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2]
HERE=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--out',type=pathlib.Path,default=ROOT/'output/followup-retrieval/candidate');args=p.parse_args()
out=args.out.resolve();protocol=json.loads((HERE/'protocol.json').read_text())
for name,expected in protocol['files'].items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==expected,name
assert hashlib.sha256((ROOT/'dist/visionleak.js').read_bytes()).hexdigest()==protocol['baselineRuntimeSha256']
out.mkdir(parents=True,exist_ok=False)
for folder in ['core','tools','tests','demo','examples','fixtures','.github']:
    shutil.copytree(ROOT/folder,out/folder,ignore=shutil.ignore_patterns('__pycache__','qa'))
for folder in ['baselines','photos-v1','photos-v2','photos-v3']:
    shutil.copytree(ROOT/'research'/folder,out/'research'/folder,ignore=shutil.ignore_patterns('__pycache__'))
for name in ['moon.mod','package.json','package-lock.json','toolchain.lock.json','.node-version','.python-version','.gitattributes','.moonignore','requirements-oracle.txt']:
    shutil.copy2(ROOT/name,out/name)
for name in ['node_modules','.toolchain','reports']:
    assert (ROOT/name).exists(),name
    (out/name).symlink_to(ROOT/name,target_is_directory=True)
shutil.copy2(HERE/'mih-candidate.mbt.txt',out/'core/mih.mbt')
subprocess.run([str(ROOT/'tools/moon'),'fmt'],cwd=out,check=True)
subprocess.run(['node','tools/build.mjs'],cwd=out,check=True)
actual=hashlib.sha256((out/'dist/visionleak.js').read_bytes()).hexdigest()
expected=json.loads((ROOT/'reports/followup-retrieval/validation/verification.json').read_text())['candidateArtifactSha256']
assert actual==expected,(actual,expected)
print(json.dumps({'status':'reproduced','artifactSha256':actual}))
