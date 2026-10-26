import test from 'node:test';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cli_options_json } from '../dist/visionleak.js';
import { capabilities } from '../tools/capabilities.mjs';

const cli = new URL('../tools/cli.mjs', import.meta.url);
test('installed capability contract agrees with real parser bounds, artifact and package', async () => {
  const contract = await capabilities();
  assert.equal(contract.version, JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).version);
  assert.equal(contract.engine.artifactSha256, createHash('sha256').update(readFileSync(new URL('../dist/visionleak.js', import.meta.url))).digest('hex'));
  for (const [key, limit] of Object.entries(contract.limits)) {
    for (const value of [limit.minimum, limit.default, limit.maximum]) {
      const result = JSON.parse(cli_options_json(JSON.stringify({ operation: 'parse', argv: ['audit','--root','data','--out','report',limit.flag,String(value)] })));
      assert.equal(result.ok, true, `${key}=${value}`);
    }
    const result = JSON.parse(cli_options_json(JSON.stringify({ operation: 'options', overrides: { [key]: limit.maximum + 1 } })));
    assert.equal(result.ok, false, key);
  }
  const run = spawnSync(process.execPath, [fileURLToPath(cli), 'capabilities'], { cwd: '/tmp', encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), contract);
  const bad = spawnSync(process.execPath, [fileURLToPath(cli), 'capabilities', '--root', 'data'], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.equal(contract.verification.candidatesRecomputed, false);
  assert.equal(contract.features.incrementalAudit, false);
});
