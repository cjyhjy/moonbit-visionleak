#!/usr/bin/env python3
"""Create a deterministic local source/runtime ZIP only from verified sources.

Use tools/accept-release.py on the resulting final archive. Never packages local
toolchains, dependency caches, credentials or an existing Git checkout.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import zipfile
import tempfile
import os
from release_metadata import release_version, read_checksums

ROOT=Path(__file__).resolve().parents[1]
ROOT_FILES=['README.md','CHANGELOG.md','DELIVERY.md','LICENSE','THIRD_PARTY.md','moon.mod','package.json','package-lock.json','requirements-oracle.txt','toolchain.lock.json','.gitignore','.gitattributes','.moonignore','.node-version','.python-version']
TREES=['.github','core','tools','tests','demo','examples','docs','fixtures','LICENSES','dist','research']
REPORTS=['mirror-evaluation.json','mirror-evaluation-audit.json','README.md','core-optimization.json','verification.json','performance.json','evaluation.json','evaluation.md','evaluation-audit.json','evaluation-oracle.json','npm-dependencies.json']

def sha(data): return hashlib.sha256(data).hexdigest()

def main():
    version=release_version(ROOT)
    verification=json.loads((ROOT/'reports/verification.json').read_text())
    if verification.get('status')!='passed': raise SystemExit('Verification must pass before packaging')
    current=subprocess.check_output(['node','--input-type=module','-e',"import{sourceDigest}from'./tools/source-digest.mjs';console.log(sourceDigest(process.cwd()))"],cwd=ROOT,text=True).strip()
    if current!=verification.get('sourceDigest'): raise SystemExit('Source digest changed: rerun tools/verify.mjs')
    if sha((ROOT/'dist/visionleak.js').read_bytes())!=verification['compiledArtifact']['sha256']: raise SystemExit('Compiled artifact changed')
    if verification.get('browser',{}).get('status')!='passed': raise SystemExit('Browser QA must pass')
    if not verification.get('evidenceDigests'): raise SystemExit('Evidence digest map missing: rerun verification')
    for name,expected in verification['evidenceDigests'].items():
        if sha((ROOT/name).read_bytes())!=expected: raise SystemExit(f'Evidence changed after verification: {name}')
    for folder in ['reports/demo','reports/mirror-demo','reports/photos-demo']:
        demo=json.loads((ROOT/folder/'report.json').read_text())
        for item in demo['images']:
            name=item['thumbnail']
            if not name.startswith('thumbnails/') or '..' in Path(name).parts: raise SystemExit('Unsafe thumbnail reference')
            if sha((ROOT/folder/name).read_bytes())!=item['thumbnailDigest']: raise SystemExit(f'Thumbnail evidence changed: {name}')
    candidates=[ROOT/p for p in ROOT_FILES]
    for tree in TREES:
        candidates.extend(p for p in (ROOT/tree).rglob('*') if p.is_file() and not any(part.startswith('.') or part=='__pycache__' for part in p.relative_to(ROOT/tree).parts))
    candidates.extend(ROOT/'reports'/p for p in REPORTS)
    candidates.extend(p for p in (ROOT/'reports/logs').glob('*.log') if not p.name.startswith('release-'))
    candidates.extend(p for p in (ROOT/'reports/demo').rglob('*') if p.is_file() and not p.name.startswith('.'))
    candidates.extend(p for p in (ROOT/'reports/mirror-demo').rglob('*') if p.is_file() and not p.name.startswith('.'))
    for folder in ['reports/photos-v1','reports/photos-demo']:
        candidates.extend(p for p in (ROOT/folder).rglob('*') if p.is_file() and not p.name.startswith('.'))
    candidates.extend(p for p in (ROOT/'reports/plan-0.5.0').rglob('*') if p.is_file() and not p.name.startswith('.'))
    payload={}
    for path in sorted(set(candidates)):
        if path.is_symlink(): raise SystemExit(f'Symlink not allowed: {path}')
        payload[path.relative_to(ROOT).as_posix()]=path.read_bytes()
    manifest={'schemaVersion':'visionleak-package-v1','version':version,'sourceDigest':current,'files':[{'path':p,'sha256':sha(b),'bytes':len(b)} for p,b in sorted(payload.items())]}
    payload['PACKAGE-MANIFEST.json']=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
    release=ROOT/'release';release.mkdir(exist_ok=True)
    target=release/f'visionleak-{version}.zip'
    checksums=read_checksums(release/'SHA256SUMS')
    temporary=None
    try:
        with tempfile.NamedTemporaryFile(dir=release,prefix='.package-',suffix='.zip',delete=False) as handle:
            temporary=Path(handle.name)
        with zipfile.ZipFile(temporary,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
            for name,data in sorted(payload.items()):
                info=zipfile.ZipInfo('visionleak/'+name,date_time=(2026,10,22,0,0,0))
                info.compress_type=zipfile.ZIP_DEFLATED
                info.external_attr=(0o100755 if name=='tools/moon' else 0o100644)<<16
                z.writestr(info,data)
        digest=sha(temporary.read_bytes())
        if target.exists() and sha(target.read_bytes())!=digest:
            raise SystemExit('Refusing to overwrite a different release archive; use a new version')
        os.replace(temporary,target)
    finally:
        if temporary is not None: temporary.unlink(missing_ok=True)
    checksums[target.name]=digest
    (release/'SHA256SUMS').write_text(''.join(f'{value}  {name}\n' for name,value in sorted(checksums.items())))
    print(json.dumps({'path':str(target.relative_to(ROOT)),'sha256':digest,'bytes':target.stat().st_size,'files':len(payload)}))

if __name__=='__main__': main()
