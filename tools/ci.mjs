import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { sourceDigest } from './source-digest.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, '.ci-artifacts');
const python = process.env.VISIONLEAK_ORACLE_PYTHON || 'research/.venv-oracle/bin/python';
mkdirSync(output, { recursive: true });
const report = {
  schemaVersion: 'visionleak-ci-v1',
  startedAt: new Date().toISOString(),
  status: 'running',
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  commit: process.env.GITHUB_SHA || null,
  runUrl: process.env.GITHUB_RUN_ID
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  checks: [],
  scope: 'Fresh source build, three MoonBit backends, Node CLI/HTTP, independent ImageHash and exhaustive index oracle. Browser screenshots and ZIP reports remain historical.',
};
const save = () => writeFileSync(join(output, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
function run(id, command, args) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: root, encoding: 'utf8', timeout: 300_000, maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const log = ((result.stdout || '') + (result.stderr || '')).replaceAll(root, './');
  writeFileSync(join(output, `${id}.log`), log);
  process.stdout.write(log);
  const passed = result.status === 0 && !result.error;
  report.checks.push({ id, command: [command, ...args], status: passed ? 'passed' : 'failed',
    exitCode: result.status, elapsedMs: Date.now() - started, log: `${id}.log` });
  save();
  if (!passed) throw new Error(`${id} failed: ${result.error?.message || result.status}`);
  return log.trim();
}
const digest = () => createHash('sha256').update(readFileSync(join(root, 'dist/visionleak.js'))).digest('hex');
try {
  report.sourceDigest = sourceDigest(root);
  report.environment.moon = run('toolchain', './tools/moon', ['version', '--all']);
  run('format', './tools/moon', ['fmt', '--check']);
  const committedArtifact = digest();
  for (const target of ['js', 'wasm-gc', 'native']) {
    run(`check-${target}`, './tools/moon', ['check', '--target', target]);
    if (target === 'native') {
      // This compiler cannot link a native foreign_library; build and execute
      // the real release test binary, in addition to the original debug tests.
      run('build-native-test-executable', './tools/moon', ['test', '--target', target, '--release', '--build-only']);
      run('test-native-release', './tools/moon', ['test', '--target', target, '--release']);
    } else {
      run(`build-${target}`, './tools/moon', ['build', '--target', target, '--release']);
    }
    run(`test-${target}`, './tools/moon', ['test', '--target', target]);
  }
  run('runtime-build', 'node', ['tools/build.mjs']);
  report.compiledArtifact = { sha256: digest(), matchesCommitted: digest() === committedArtifact };
  if (!report.compiledArtifact.matchesCommitted) throw new Error('Committed dist/visionleak.js differs from the fresh pinned build');
  run('node-integration', 'npm', ['test']);
  run('mooncakes-compatibility', python, ['tests/mooncakes-dry-run.py']);
  run('release-contract', python, ['tests/release-contract.py']);
  run('evaluation-compatibility', python, ['tests/evaluation-compatibility.py']);
  run('report-history', python, ['tests/report-history.py']);
  run('metric-regression', python, ['tests/oracle-metrics.py']);
  run('imagehash-oracle', python, ['tools/evaluate.py', '--out', '.ci-artifacts/evaluation.json']);
  run('mirror-oracle', python, ['tools/evaluate-mirrors.py','--out','.ci-artifacts/mirror-evaluation.json']);
  for (const partition of ['development','holdout']) run(`photo-${partition}`,python,['tools/evaluate-photos.py','--partition',partition,'--out',`.ci-artifacts/photos-${partition}`,'--include-orientations','--replace']);
  if (sourceDigest(root) !== report.sourceDigest) throw new Error('Behavioral sources changed during CI acceptance');
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = error.message;
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  save();
  console.log(`CI acceptance: ${report.status}; .ci-artifacts/verification.json`);
}
