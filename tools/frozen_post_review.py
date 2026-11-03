"""Immutable pre-followup snapshot validation and historical photos-v3 replay."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'research/baselines/0.7.0-pre-followup'


def verify_archive():
    snapshot = json.loads((BASELINE / 'snapshot.json').read_text())
    freeze = json.loads((ROOT / 'research/photos-v3/freeze-0.7.0.json').read_text())
    for name, expected in snapshot['files'].items():
        if hashlib.sha256((BASELINE / name).read_bytes()).hexdigest() != expected:
            raise ValueError('Historical snapshot changed: ' + name)
    for name, expected in freeze['implementationFiles'].items():
        if snapshot['files'].get(name) != expected:
            raise ValueError('Snapshot does not match original freeze: ' + name)
    return snapshot


def replay(out):
    verify_archive()
    out = out.resolve()
    if out.exists():
        raise ValueError('Use a new output directory')
    with tempfile.TemporaryDirectory(prefix='visionleak-frozen-replay-') as folder:
        root = Path(folder) / 'visionleak'
        shutil.copytree(BASELINE, root)
        (root / 'node_modules').symlink_to(ROOT / 'node_modules', target_is_directory=True)
        (root / 'research').mkdir()
        for name in ['photos-v1', 'photos-v2', 'photos-v3']:
            (root / 'research' / name).symlink_to(ROOT / 'research' / name, target_is_directory=True)
        subprocess.run([sys.executable, 'tools/evaluate-post-review.py', '--out', str(out)], cwd=root, check=True, capture_output=True, text=True)
    result = json.loads((out / 'evaluation.json').read_text())
    result['evaluationRole'] = 'historical-frozen-replay'
    result['scope'] = 'Replay of the original frozen 2026-10-30 implementation on already-known photos-v3. No new holdout or current-implementation claim.'
    result['originallyNewSourceFiles'] = result.pop('newSourceFiles')
    result['newSourceFiles'] = 0
    (out / 'evaluation.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status':'passed','evaluationRole':result['evaluationRole'],'newSourceFiles':0,'output':str(out)}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    if args.out:
        replay(args.out)
    else:
        snapshot = verify_archive()
        print(json.dumps({'status':'passed', 'files':len(snapshot['files']), 'scope':'Historical source and artifact integrity only'}))
