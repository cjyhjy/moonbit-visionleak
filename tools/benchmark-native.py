"""Five fixed native-release samples, identical current code except MIH marks.

Compilation and input construction are excluded from audit timings. No speed
threshold: negative results are retained. This is a core microbenchmark.
"""
import argparse
import hashlib
import json
from pathlib import Path
import platform
import shutil
import statistics
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def main(out):
    out.mkdir(parents=True, exist_ok=False)
    state = 1873421
    def hash_bits():
        nonlocal state
        result = ''
        for _ in range(64):
            state ^= (state << 13) & 0xffffffff; state ^= state >> 17; state ^= (state << 5) & 0xffffffff
            result += str(state & 1)
        return result
    images = [{'id': str(i), 'split': ['train', 'validation', 'test'][i % 3],
               'byteDigest': hashlib.sha256(f'b{i}'.encode()).hexdigest(),
               'pixelDigest': hashlib.sha256(f'p{i}'.encode()).hexdigest(),
               'dhash': hash_bits(), 'contrast': 100, 'localHashes': [hash_bits() for _ in range(20)],
               'localContrasts': [100] * 20} for i in range(1600)]
    photo = json.loads((ROOT / 'reports/post-review/photos/crops-audit.json').read_text())['images']
    cases = {'sparse1600': images, 'knownPhotos': photo}
    payloads = {name: json.dumps({'images': rows, 'options': {'includeCrops': True, 'maxComparisons': 1000000}}, separators=(',', ':')) for name, rows in cases.items()}
    protocol = {'samples': 5, 'warmups': 1, 'backend': 'native-release', 'platform': platform.platform(),
                'inputDigests': {name: hashlib.sha256(s.encode()).hexdigest() for name, s in payloads.items()},
                'variants': ['released-map', 'generation-marks'], 'scope': 'Core only; fixed budget, includes JSON parse/serialization, excludes build/decode/I/O. Sequential variant runs, no randomized timing claim.'}
    (out / 'protocol.json').write_text(json.dumps(protocol, indent=2) + '\n')
    results = {}
    with tempfile.TemporaryDirectory(prefix='visionleak-native-', dir='/tmp') as temporary:
        for variant in protocol['variants']:
            project = Path(temporary) / variant; (project / 'core').mkdir(parents=True)
            shutil.copyfile(ROOT / 'moon.mod', project / 'moon.mod')
            for path in (ROOT / 'core').glob('*'):
                if path.suffix in ('.mbt', '.mbti') and not path.name.endswith(('_wbtest.mbt', '_test.mbt')):
                    shutil.copyfile(path, project / 'core' / path.name)
            package = (ROOT / 'core/moon.pkg').read_text().replace('import {', 'import {\n  "moonbitlang/core/bench",', 1)
            (project / 'core/moon.pkg').write_text(package)
            if variant == 'released-map':
                shutil.copyfile(ROOT / 'research/baselines/0.7.0-released/mih.mbt', project / 'core/mih.mbt')
            source = ''
            for name, payload in payloads.items():
                source += f'''\n///|
test "native measured {name}" {{
  let input = {json.dumps(payload)}
  let warm = audit_json(input)
  for repetition in 0..<5 {{
    let started = @bench.monotonic_clock_start()
    let result = audit_json(input)
    let elapsed = @bench.monotonic_clock_end(started)
    assert_eq(result, warm)
    let sample : Json = {{"kind":"vl-native-sample", "case":"{name}", "repetition":Json(repetition), "elapsedUs":Json(elapsed), "outputDigest":Json(sha256(@utf8.encode(result)))}}
    println(sample.stringify())
  }}
}}
'''
            (project / 'core/integration_benchmark_wbtest.mbt').write_text(source)
            (out / f'{variant}-mih.sha256').write_text(hashlib.sha256((project / 'core/mih.mbt').read_bytes()).hexdigest() + '\n')
            command = [str(ROOT / 'tools/moon'), 'test', '--target', 'native', '--release', 'core/integration_benchmark_wbtest.mbt']
            run = subprocess.run(command, cwd=project, capture_output=True, text=True, timeout=180)
            (out / f'{variant}.log').write_text(run.stdout + run.stderr)
            assert run.returncode == 0, run.stdout + run.stderr
            rows = [json.loads(line) for line in run.stdout.splitlines() if line.startswith('{"kind":"vl-native-sample"')]
            assert len(rows) == 10, run.stdout
            results[variant] = rows
    summary = {}
    for name in cases:
        selected = {v: [x for x in rows if x['case'] == name] for v, rows in results.items()}
        assert len({x['outputDigest'] for rows in selected.values() for x in rows}) == 1
        medians = {v: statistics.median(x['elapsedUs'] for x in rows) for v, rows in selected.items()}
        summary[name] = {'medianMicroseconds': medians, 'speedup': medians['released-map'] / medians['generation-marks'], 'sameFullOutputDigest': selected['released-map'][0]['outputDigest']}
    (out / 'summary.json').write_text(json.dumps({'status': 'passed', 'protocol': protocol, 'results': results, 'summary': summary}, indent=2) + '\n')
    print(json.dumps({'status': 'passed', 'summary': summary}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--out', type=Path, required=True)
    main(parser.parse_args().out.resolve())
