#!/usr/bin/env python3
"""Validate the final ZIP manifest, reinstall, rebuild and exercise an extracted copy."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time
import uuid
import zipfile
import shutil
from datetime import datetime, timezone
from release_metadata import release_version, read_checksums

ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'reports/release-verification.json'

def digest(data):return hashlib.sha256(data).hexdigest()
def timestamp():return datetime.now(timezone.utc).isoformat()

def main():
    report={'schemaVersion':'visionleak-release-verification-v1','status':'running','startedAt':timestamp(),'archive':None,'archiveSha256':None,'checks':[]}
    def save():REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    save()
    destination=ROOT/'reports/clean-room'/str(uuid.uuid4())
    project=destination/'visionleak'
    def run(name,args,env=None):
        start=time.monotonic()
        result=subprocess.run(args,cwd=project,env=env,capture_output=True,text=True,timeout=300)
        log=(result.stdout+result.stderr).replace(str(project),'<extracted-project>').replace(str(ROOT),'<source-project>')
        logfile=ROOT/'reports/logs'/f'release-{name}.log';logfile.write_text(log)
        check={'name':name,'command':[str(x).replace(str(ROOT),'<source-project>') for x in args],'exitCode':result.returncode,'elapsedSeconds':time.monotonic()-start,'status':'passed' if result.returncode==0 else 'failed','log':str(logfile.relative_to(ROOT))}
        report['checks'].append(check);save()
        if result.returncode:raise RuntimeError(f'{name} failed; inspect {check["log"]}')
        return result.stdout
    try:
        version=release_version(ROOT)
        archive=ROOT/'release'/f'visionleak-{version}.zip'
        report['archive']=str(archive.relative_to(ROOT))
        report['archiveSha256']=digest(archive.read_bytes());save()
        checksum=read_checksums(ROOT/'release/SHA256SUMS')
        if checksum.get(archive.name)!=report['archiveSha256']:raise ValueError('SHA256SUMS does not match the final archive')
        report['checks'].append({'name':'sha256sums','status':'passed'})
        with zipfile.ZipFile(archive) as z:
            names=z.namelist()
            for name in names:
                parts=Path(name).parts
                if not parts or parts[0]!='visionleak' or '..' in parts or Path(name).is_absolute():raise ValueError('Unsafe archive member')
                if any(p in {'.git','.toolchain','node_modules','.venv-oracle','__pycache__'} for p in parts):raise ValueError('Local state leaked into archive')
            manifest=json.loads(z.read('visionleak/PACKAGE-MANIFEST.json'))
            if manifest.get('schemaVersion')!='visionleak-package-v1' or manifest.get('version')!=version:raise ValueError('Archive manifest version does not match the selected release')
            expected={'visionleak/'+f['path'] for f in manifest['files']}|{'visionleak/PACKAGE-MANIFEST.json'}
            if set(names)!=expected or len(names)!=len(set(names)):raise ValueError('Archive member set mismatch')
            for item in manifest['files']:
                data=z.read('visionleak/'+item['path'])
                if digest(data)!=item['sha256'] or len(data)!=item['bytes']:raise ValueError('Manifest content mismatch')
            destination.mkdir(parents=True)
            z.extractall(destination)
        if release_version(project)!=version:raise ValueError('Extracted manifest versions do not match the selected release')
        os.chmod(project/'tools/moon',0o755)
        report['checks'].append({'name':'archive-manifest','status':'passed','files':len(manifest['files'])});save()
        # A new checkout and new node_modules. Cache is project-local; no global install.
        run('npm-ci',['npm','ci','--cache',str(ROOT/'.cache/npm-release'),'--no-audit','--no-fund'])
        env=os.environ.copy()
        if (ROOT/'.toolchain/bin/moon').is_file():
            env['MOON_HOME']=str(ROOT/'.toolchain')
            env['PATH']=str(ROOT/'.toolchain/bin')+os.pathsep+env.get('PATH','')
        run('rebuild',['node','tools/build.mjs'],env)
        expected_dist=next(x['sha256'] for x in manifest['files'] if x['path']=='dist/visionleak.js')
        if digest((project/'dist/visionleak.js').read_bytes())!=expected_dist:raise ValueError('Clean source rebuild differs from packaged artifact')
        report['checks'].append({'name':'compiled-artifact-reproducible','status':'passed','sha256':expected_dist});save()
        run('node-tests',['node','--test',*[str(p.relative_to(project)) for p in sorted((project/'tests').glob('*.test.mjs'))]])
        run('actual-images',['node','tools/cli.mjs','audit','--root','fixtures/benchmark','--out','acceptance-output'])
        actual=json.loads((project/'acceptance-output/report.json').read_text())
        reference=json.loads((project/'reports/evaluation-audit.json').read_text())
        def pairs(r):return sorted((tuple(sorted([p['left'],p['right']])),p['evidence'],p['distance']) for p in r['pairs'])
        if not actual['complete'] or actual['errors'] or pairs(actual)!=pairs(reference):raise ValueError('Clean image audit differs from recorded evaluation')
        if actual['auditId']!=reference['auditId']:raise ValueError('Stable audit ID differs in clean copy')
        report['checks'].append({'name':'clean-report-parity','status':'passed','images':len(actual['images']),'pairs':len(actual['pairs']),'auditId':actual['auditId']});save()
        run('mirror-images',['node','tools/cli.mjs','audit','--root','fixtures/benchmark','--out','mirror-output','--include-mirrors'])
        mirrored=json.loads((project/'mirror-output/report.json').read_text())
        mirror_reference=json.loads((project/'reports/mirror-evaluation-audit.json').read_text())
        if not mirrored['complete'] or mirrored['auditId']!=mirror_reference['auditId']:raise ValueError('Clean mirror audit differs from recorded evaluation')
        report['checks'].append({'name':'clean-mirror-report-parity','status':'passed','pairs':len(mirrored['pairs']),'auditId':mirrored['auditId']});save()
        for partition in ['development','holdout']:
            for mode,flags in [('default',[]),('mirrors',['--include-mirrors']),('orientations',['--include-mirrors','--include-rotations'])]:
                output=f'photo-output-{partition}-{mode}'
                run(f'photos-{partition}-{mode}',['node','tools/cli.mjs','audit','--root',f'fixtures/photos-v1/{partition}','--out',output,*flags])
                photo=json.loads((project/output/'report.json').read_text())
                expected_photo=json.loads((project/f'reports/photos-v1/current-{partition}/{mode}-audit.json').read_text())
                if not photo['complete'] or photo['auditId']!=expected_photo['auditId']:raise ValueError('Clean photo audit differs')
                report['checks'].append({'name':f'photo-parity-{partition}-{mode}','status':'passed','auditId':photo['auditId'],'pairs':len(photo['pairs'])});save()
        source=run('source-digest' ,['node','--input-type=module','-e',"import{sourceDigest}from'./tools/source-digest.mjs';console.log(sourceDigest(process.cwd()))"]).strip()
        if source!=manifest['sourceDigest']:raise ValueError('Extracted behavioral source digest mismatch')
        report['sourceDigest']=source
        report['extractedDirectory']=str(project.relative_to(ROOT))
        report['status']='passed'
    except Exception as error:
        report['status']='failed';report['error']=str(error)
        raise
    finally:
        if destination.exists():
            if report['status']=='passed':
                shutil.rmtree(destination)
                report['extractedCopyRetained']=False
            else:
                report['extractedCopyRetained']=True
                report['extractedDirectory']=str(project.relative_to(ROOT))
        report['finishedAt']=timestamp();save()
        print(json.dumps({k:report[k] for k in ('status','archive','archiveSha256')}))

if __name__=='__main__':main()
