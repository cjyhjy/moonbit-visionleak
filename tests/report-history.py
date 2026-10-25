"""Check actual 0.1.0–0.4.0 sample identities, including archived reports."""
import json
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def main():
    rows = []
    for path in sorted((ROOT/'reports').rglob('*.json')):
        if 'clean-room' in path.parts: continue
        try: report = json.loads(path.read_text())
        except (ValueError, UnicodeError): continue
        if isinstance(report,dict) and report.get('schemaVersion')=='visionleak-report-v1':
            rows.append({'path':str(path.relative_to(ROOT)),'report':report})
    for version in ['0.1.0','0.2.0','0.3.0','0.4.0']:
        path = ROOT/'release'/f'visionleak-{version}.zip'
        if not path.exists(): continue
        with zipfile.ZipFile(path) as archive:
            for name in sorted(archive.namelist()):
                if not name.startswith('visionleak/reports/') or not name.endswith('.json'): continue
                try: report = json.loads(archive.read(name))
                except (ValueError, UnicodeError): continue
                if isinstance(report,dict) and report.get('schemaVersion')=='visionleak-report-v1':
                    rows.append({'path':str(path.relative_to(ROOT))+':'+name,'report':report})
    script = '''import{readFileSync}from'node:fs';import{reportIdentity}from'./demo/report-identity.mjs';
const rows=JSON.parse(readFileSync(0,'utf8'));console.log(JSON.stringify(rows.map(({path,report})=>({path,auditId:report.auditId,actual:reportIdentity(report).digest}))));'''
    process = subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,input=json.dumps(rows),text=True,capture_output=True,check=True)
    results = json.loads(process.stdout)
    failed = [row for row in results if row['actual']!=row['auditId']]
    print(json.dumps({'status':'passed' if not failed else 'failed','reports':len(results),
                      'scope':'Valid report samples in reports/ and available original 0.1.0–0.4.0 ZIPs; excludes intentionally tampered QA inputs and old failed clean-room copies.',
                      'results':results},indent=2))
    if failed or not results: raise SystemExit('Historical report identity mismatch or absent samples')


if __name__=='__main__': main()
