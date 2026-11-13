"""Collect immutable terminal-container CI outputs with the archive-ci allowlist."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import subprocess

HERE = Path(__file__).resolve().parent
CONTEXT = 'colima-visionleak090'
CONTAINER = 'visionleak-090-ci-original-budget'
PREFIX = ['docker', '--context', CONTEXT]
info = json.loads(subprocess.check_output(PREFIX + ['inspect', CONTAINER], text=True))[0]
state = info['State']
if state['Running'] or state['Status'] not in ('exited', 'dead'):
    raise SystemExit('Same CI container is not terminal; keep waiting, do not restart')
out = HERE / 'ci'
out.mkdir(exist_ok=False)
source = PurePosixPath('/workspace/visionleak/.ci-artifacts')
def copy(name):
    path = PurePosixPath(name)
    if path.is_absolute() or '..' in path.parts:
        raise ValueError('Unsafe CI evidence path')
    destination = out / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(PREFIX + ['cp', CONTAINER + ':' + str(source / path), str(destination)], check=True)
copy('verification.json')
report = json.loads((out / 'verification.json').read_bytes())
files = set(c['log'] for c in report['checks'])
files.update(['evaluation-audit.json', 'evaluation-oracle.json', 'evaluation.json', 'evaluation.md', 'mirror-evaluation.json', 'mirror-evaluation-audit.json'])
for check in report['checks']:
    command = check['command']
    if check['id'] == 'bounded-scale':
        value = PurePosixPath(command[2])
        if not value.is_absolute():
            value = PurePosixPath('/workspace/visionleak') / value
        directory = value.relative_to(source)
        for name in ['summary.json', 'manifest.csv', 'default.json', 'orb.json', 'default.log', 'orb.log']:
            files.add(str(directory / name))
    if '--out' in command:
        value = PurePosixPath(command[command.index('--out') + 1])
        if not value.is_absolute():
            value = PurePosixPath('/workspace/visionleak') / value
        files.add(str(value.relative_to(source)))
for name in sorted(files):
    copy(name)
digests = {}
for file in out.rglob('*'):
    if file.is_symlink():
        raise ValueError('Unexpected evidence symlink')
    if file.is_file():
        digests[str(file.relative_to(out))] = hashlib.sha256(file.read_bytes()).hexdigest()
receipt = {'containerId': info['Id'], 'imageId': info['Image'], 'containerState': state,
           'networkMode': info['HostConfig']['NetworkMode'], 'mounts': info['Mounts'],
           'ciStatus': report['status'], 'sourceDigest': report['sourceDigest'],
           'files': digests, 'collectorSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
           'scope': 'Terminal original CI container; report contents and Linux command paths preserved without rewriting. Same log/output allowlist as tools/archive-ci.mjs. Linux x86 userland emulated by existing Rosetta in isolated ARM64 VM; no native-x86 performance claim.'}
(HERE / 'collection.json').write_text(json.dumps(receipt, indent=2)+'\n')
print(json.dumps({k: v for k, v in receipt.items() if k not in ('files', 'mounts')}))
if state['ExitCode'] or report['status'] != 'passed':
    raise SystemExit('CI failed; evidence retained, not promoted to passed')
