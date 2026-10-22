import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import http from 'node:http';
import sharp from 'sharp';
import { decodeImage } from '../tools/decode.mjs';
import { fingerprint, sha256 } from '../tools/runtime.mjs';
import { startServer } from '../tools/server.mjs';
import { runAudit } from '../tools/cli.mjs';

const PROJECT = fileURLToPath(new URL('../', import.meta.url));
const CLI = join(PROJECT, 'tools/cli.mjs');

function run(...args) {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd: PROJECT, encoding: 'utf8', timeout: 30_000 });
  assert.equal(result.error, undefined, result.error?.message);
  return { ...result, json: JSON.parse(result.stdout || result.stderr) };
}

async function fixture(t) {
  await mkdir(join(PROJECT, '.cache'), { recursive: true });
  const temp = await mkdtemp(join(PROJECT, '.cache', 'test-cli-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const root = join(temp, 'dataset');
  for (const split of ['train', 'validation', 'test']) await mkdir(join(root, split), { recursive: true });
  const width = 18, height = 16;
  const pixels = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 3;
    pixels[i] = (x * 13 + y * 7) % 256;
    pixels[i + 1] = (x * 9 + y * 11) % 256;
    pixels[i + 2] = (x * 4 + y * 15) % 256;
  }
  const original = await sharp(pixels, { raw: { width, height, channels: 3 } }).png({ compressionLevel: 0 }).toBuffer();
  const encoded = await sharp(pixels, { raw: { width, height, channels: 3 } }).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(join(root, 'train', 'original.png'), original);
  await writeFile(join(root, 'validation', 'reencoded.png'), encoded);
  await writeFile(join(root, 'test', 'renamed.png'), original);
  return { temp, root, out: join(temp, 'output'), original, width, height, pixels };
}

test('real CLI separates byte equality from decoded pixel equality, preserves input, and binds stable audit IDs', async (t) => {
  const f = await fixture(t);
  const result = run('audit', '--root', f.root, '--out', f.out);
  assert.equal(result.status, 0, result.stderr);
  const reportText = await readFile(join(f.out, 'report.json'), 'utf8');
  const report = JSON.parse(reportText);
  assert.equal(report.complete, true);
  assert.equal(report.images.length, 3);
  assert.equal(report.pairs.length, 3);
  assert.equal(report.pairs.filter((p) => p.evidence === 'byte-identical').length, 1);
  assert.equal(report.pairs.filter((p) => p.evidence === 'pixel-identical').length, 2);
  assert.ok(!reportText.includes(f.root));
  assert.deepEqual(report.images.map((i) => i.id), ['test/renamed.png', 'train/original.png', 'validation/reencoded.png']);
  assert.deepEqual(await readFile(join(f.root, 'train', 'original.png')), f.original);
  for (const image of report.images) {
    const preview = await sharp(join(f.out, image.thumbnail)).metadata();
    assert.equal(preview.format, 'jpeg');
    assert.ok(preview.width <= 360 && preview.height <= 260);
  }
  const second = run('audit', '--root', f.root, '--out', join(f.temp, 'second'));
  assert.equal(second.json.auditId, report.auditId);
  const differentThreshold = run('audit', '--root', f.root, '--out', join(f.temp, 'threshold'), '--threshold', '0');
  assert.notEqual(differentThreshold.json.auditId, report.auditId);
});

test('decode plus real core follows EXIF orientation and canonical white alpha semantics', async (t) => {
  const f = await fixture(t);
  const exif = join(f.temp, 'oriented.jpg');
  const jpeg = await sharp(f.pixels, { raw: { width: f.width, height: f.height, channels: 3 } })
    .jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).withMetadata({ orientation: 6 }).toBuffer();
  await writeFile(exif, jpeg);
  const decoded = await decodeImage(exif);
  assert.equal(decoded.width, f.height);
  assert.equal(decoded.height, f.width);
  const straight = await sharp(jpeg).toColourspace('srgb').ensureAlpha().raw().toBuffer();
  for (let y = 0; y < f.height; y++) for (let x = 0; x < f.width; x++) {
    const oldIndex = (y * f.width + x) * 4;
    const newIndex = (x * f.height + (f.height - y - 1)) * 4;
    assert.deepEqual(decoded.rgba.subarray(newIndex, newIndex + 4), straight.subarray(oldIndex, oldIndex + 4));
  }
  const transparent = await fingerprint({ width: 1, height: 1, rgba: Buffer.from([99, 18, 241, 0]) });
  const opaque = await fingerprint({ width: 1, height: 1, rgba: Buffer.from([255, 255, 255, 255]) });
  assert.equal(transparent.pixelDigest, opaque.pixelDigest);
  const prefix = Buffer.alloc(11);
  prefix.write('VL1'); prefix.writeUInt32BE(1, 3); prefix.writeUInt32BE(1, 7);
  assert.equal(opaque.pixelDigest, sha256(Buffer.concat([prefix, Buffer.from([255, 255, 255])])));
});

test('a bad image and a symlink leave reviewable partial evidence and explicit errors', async (t) => {
  const f = await fixture(t);
  await writeFile(join(f.root, 'train', 'broken.png'), 'not a PNG');
  await symlink(join(f.root, 'train', 'original.png'), join(f.root, 'test', 'link.png'));
  const result = run('audit', '--root', f.root, '--out', f.out);
  assert.equal(result.status, 2);
  const report = JSON.parse(await readFile(join(f.out, 'report.json')));
  assert.equal(report.complete, false);
  assert.equal(report.status, 'incomplete');
  assert.equal(report.images.length, 3);
  assert.ok(report.errors.some((e) => e.code === 'DECODE_ERROR' && e.path === 'train/broken.png'));
  assert.ok(report.errors.some((e) => e.code === 'UNSAFE_PATH' && e.path === 'test/link.png'));
});

test('image, pixel, file, total-pixel, comparison, and output budgets are observable', async (t) => {
  const f = await fixture(t);
  const cases = [
    ['--max-images', '2', 'IMAGE_BUDGET'], ['--max-pixels', '1', 'PIXEL_BUDGET'],
    ['--max-file-bytes', '1', 'FILE_BYTE_BUDGET'], ['--max-total-pixels', String(f.width * f.height), 'TOTAL_PIXEL_BUDGET'],
    ['--max-comparisons', '0', null], ['--max-pairs', '0', null],
  ];
  for (const [flag, limit, code] of cases) {
    const out = join(f.temp, flag.slice(2));
    const result = run('audit', '--root', f.root, '--out', out, flag, limit);
    assert.equal(result.status, 2, `${flag}: ${result.stderr || result.stdout}`);
    const report = JSON.parse(await readFile(join(out, 'report.json')));
    assert.equal(report.complete, false);
    if (code) assert.ok(report.errors.some((error) => error.code === code), `${flag}: ${JSON.stringify(report.errors)}`);
    else assert.notEqual(report.stats.reason, 'complete');
  }
});

test('fatal arguments and empty roots return structured errors without creating a report', async (t) => {
  const f = await fixture(t);
  const empty = join(f.temp, 'empty');
  await mkdir(empty);
  const cases = [
    [[], 'ARGUMENT_ERROR'],
    [['--root', join(f.temp, 'missing'), '--out', f.out], 'INVALID_ROOT'],
    [['--root', empty, '--out', f.out], 'EMPTY_DATASET'],
    [['--root', f.root, '--out', f.out, '--threshold', 'NaN'], 'ARGUMENT_ERROR'],
    [['--root', f.root, '--out', f.out, '--max-pixels', '4194305'], 'ARGUMENT_ERROR'],
    [['--root', f.root, '--out', join(f.root, 'report')], 'UNSAFE_OUTPUT'],
  ];
  for (const [args, code] of cases) {
    const result = run('audit', ...args);
    assert.equal(result.status, 1);
    assert.equal(result.json.complete, false);
    assert.equal(result.json.error.code, code);
  }
  assert.ok(!(await readdir(f.temp)).includes('output'));
});

test('overwrite is explicit and refuses unrelated files even with --force', async (t) => {
  const f = await fixture(t);
  assert.equal(run('audit', '--root', f.root, '--out', f.out).status, 0);
  const before = await readFile(join(f.out, 'report.json'));
  const rejected = run('audit', '--root', f.root, '--out', f.out);
  assert.equal(rejected.json.error.code, 'OUTPUT_EXISTS');
  assert.deepEqual(await readFile(join(f.out, 'report.json')), before);
  assert.equal(run('audit', '--root', f.root, '--out', f.out, '--force').status, 0);
  await writeFile(join(f.out, 'my-notes.txt'), 'preserve me');
  const unrelated = run('audit', '--root', f.root, '--out', f.out, '--force');
  assert.equal(unrelated.json.error.code, 'UNMANAGED_OUTPUT');
  assert.equal(await readFile(join(f.out, 'my-notes.txt'), 'utf8'), 'preserve me');
});

test('exported API merges partial options, validates them, and audit identity includes scan scope and errors', async (t) => {
  const f = await fixture(t);
  const first = await runAudit({ root: f.root, out: f.out, options: { threshold: 0 } });
  assert.equal(first.report.options.threshold, 0);
  assert.equal(first.report.options.maxImages, 1000);
  await assert.rejects(runAudit({ root: f.root, out: join(f.temp, 'bad'), options: { unknown: 1 } }), { code: 'ARGUMENT_ERROR' });
  await assert.rejects(runAudit({ root: f.root, out: join(f.temp, 'bad'), options: { maxPixels: NaN } }), { code: 'ARGUMENT_ERROR' });
  await writeFile(join(f.root, 'train', 'notes.txt'), 'out of supported image scope');
  const second = await runAudit({ root: f.root, out: join(f.temp, 'scope'), options: { threshold: 0 } });
  assert.equal(second.report.images.length, first.report.images.length);
  assert.notEqual(second.report.auditId, first.report.auditId);
  await writeFile(join(f.root, 'train', 'broken.png'), 'broken');
  const third = await runAudit({ root: f.root, out: join(f.temp, 'errors'), options: { threshold: 0 } });
  assert.notEqual(third.report.auditId, second.report.auditId);
  assert.equal(third.report.complete, false);
});

function request(url, path, options = {}) {
  return new Promise((resolveResponse, reject) => {
    const req = http.request(new URL(url), { path, ...options }, (response) => {
      const buffers = [];
      response.on('data', (chunk) => buffers.push(chunk));
      response.on('end', () => resolveResponse({ status: response.statusCode, headers: response.headers, body: Buffer.concat(buffers) }));
    });
    req.on('error', reject); req.end();
  });
}

test('loopback server serves only fixed assets and one report, and denies traversal, symlinks, writes, and foreign hosts', async (t) => {
  const f = await fixture(t);
  assert.equal(run('audit', '--root', f.root, '--out', f.out).status, 0);
  const { server, url } = await startServer({ report: join(f.out, 'report.json'), port: 0 });
  t.after(() => new Promise((done) => { server.close(done); server.closeAllConnections(); }));
  assert.equal(server.address().address, '127.0.0.1');
  const served = await request(url, '/report.json');
  assert.equal(served.status, 200);
  const report = JSON.parse(served.body);
  assert.equal((await request(url, '/')).status, 200);
  assert.equal((await request(url, `/${report.images[0].thumbnail}`)).status, 200);
  assert.equal((await request(url, '/package.json')).status, 404);
  assert.equal((await request(url, '/%2e%2e/package.json')).status, 400);
  assert.equal((await request(url, '/report.json', { method: 'POST' })).status, 405);
  assert.equal((await request(url, '/report.json', { headers: { Host: 'attacker.invalid' } })).status, 403);
  assert.equal((await request(url, '/report.json', { headers: { Origin: 'https://attacker.invalid' } })).status, 403);
  assert.equal((await request(url, '/report.json', { method: 'HEAD' })).body.length, 0);
  assert.match(served.headers['content-security-policy'], /default-src 'none'/);
  const preview = join(f.out, report.images[0].thumbnail);
  const previewBytes = await readFile(preview);
  await writeFile(preview, Buffer.concat([previewBytes, Buffer.from('changed')]));
  assert.equal((await request(url, `/${report.images[0].thumbnail}`)).status, 409);
  await rm(preview);
  await symlink(join(f.root, 'train', 'original.png'), preview);
  assert.equal((await request(url, `/${report.images[0].thumbnail}`)).status, 404);
});
