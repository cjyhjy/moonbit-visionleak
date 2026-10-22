#!/usr/bin/env node
import { readdir, opendir, lstat, realpath, mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, join, relative, dirname, basename, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { decodeImage, thumbnail, DECODER, HARD_MAX_PIXELS, DEFAULT_MAX_FILE_BYTES, SUPPORTED_EXTENSIONS } from './decode.mjs';
import { audit, fingerprint, sha256, VisionLeakError, errorRecord } from './runtime.mjs';

const SPLITS = ['train', 'validation', 'test'];
const MARKER = '.visionleak-output.json';
const FORMAT = 'visionleak-output-v1';
const EXTENSIONS = new Set(SUPPORTED_EXTENSIONS);
const MAX_ENTRIES = 100_000;
export const DEFAULTS = Object.freeze({ threshold: 6, maxImages: 1000, maxPixels: HARD_MAX_PIXELS, maxTotalPixels: 100_000_000, maxFileBytes: DEFAULT_MAX_FILE_BYTES, maxComparisons: 1_000_000, maxPairs: 10_000 });
const NUMERIC = {
  '--threshold': ['threshold', 0, 64], '--max-images': ['maxImages', 1, 10_000],
  '--max-pixels': ['maxPixels', 1, HARD_MAX_PIXELS], '--max-total-pixels': ['maxTotalPixels', 1, 1_000_000_000],
  '--max-file-bytes': ['maxFileBytes', 1, 1024 * 1024 * 1024],
  '--max-comparisons': ['maxComparisons', 0, 10_000_000], '--max-pairs': ['maxPairs', 0, 100_000],
};
const HELP = `VisionLeak — local, read-only cross-split image audit

  node tools/cli.mjs audit --root DATASET --out OUTPUT [options]
  node tools/server.mjs --report OUTPUT/report.json --port 4173

DATASET contains train/, validation/, and/or test/ directories.
Options (all budgets are finite):
  --threshold N          Hamming threshold, 0..64 (default 6)
  --max-images N         1..10000 (default 1000)
  --max-pixels N         Per image, 1..4194304 (default 4194304)
  --max-total-pixels N   Across successfully decoded images (default 100000000)
  --max-file-bytes N     Per encoded file (default 33554432)
  --max-comparisons N    Core budget, 0..10000000 (default 1000000)
  --max-pairs N          Output-pair budget, 0..100000 (default 10000)
  --force               Replace only an intact VisionLeak-managed output directory
  --help                Show this help

Exit 0: complete; 2: incomplete report; 1: fatal error (JSON on stderr).
Finding duplicates does not change the exit code. Source files are never modified.
`;

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv[0] === 'help') return { help: true };
  if (argv[0] !== 'audit') throw new VisionLeakError('ARGUMENT_ERROR', 'Expected the audit command');
  const parsed = { options: { ...DEFAULTS }, force: false };
  const seen = new Set();
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (seen.has(arg)) throw new VisionLeakError('ARGUMENT_ERROR', `Duplicate option: ${arg}`);
    seen.add(arg);
    if (arg === '--force') { parsed.force = true; continue; }
    if (arg === '--root' || arg === '--out') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new VisionLeakError('ARGUMENT_ERROR', `Missing value: ${arg}`);
      parsed[arg.slice(2)] = value;
    } else if (NUMERIC[arg]) {
      const [key, min, max] = NUMERIC[arg];
      const raw = argv[++i];
      const value = Number(raw);
      if (!/^\d+$/.test(raw ?? '') || !Number.isSafeInteger(value) || value < min || value > max) {
        throw new VisionLeakError('ARGUMENT_ERROR', `${arg} must be an integer in ${min}..${max}`);
      }
      parsed.options[key] = value;
    } else throw new VisionLeakError('ARGUMENT_ERROR', `Unknown option: ${arg}`);
  }
  if (!parsed.root || !parsed.out) throw new VisionLeakError('ARGUMENT_ERROR', 'Both --root and --out are required');
  return parsed;
}

const slash = (path) => path.split(sep).join('/');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const within = (parent, child) => child === parent || child.startsWith(`${parent}${sep}`);

async function discover(root, maxImages) {
  const files = [];
  const errors = [];
  const missingSplits = [];
  let entries = 0;
  let ignoredFiles = 0;
  let stopped = false;
  let entryBudgetHit = false;
  async function walk(directory, split, depth) {
    if (stopped || entryBudgetHit) return;
    if (depth > 64) { errors.push({ code: 'PATH_DEPTH_BUDGET', message: 'Directory nesting exceeds 64 levels', path: slash(relative(root, directory)) }); return; }
    const children = [];
    try {
      // Streaming enumeration bounds memory even for a single enormous directory.
      for await (const child of await opendir(directory, { bufferSize: 32 })) {
        if (++entries > MAX_ENTRIES) {
          errors.push({ code: 'ENTRY_BUDGET', message: 'Directory scan exceeded its fixed entry budget', limit: MAX_ENTRIES });
          entryBudgetHit = true;
          break;
        }
        children.push(child);
      }
      children.sort((a, b) => compare(a.name, b.name));
    }
    catch { errors.push({ code: 'READ_ERROR', message: 'Could not read directory', path: slash(relative(root, directory)) }); return; }
    for (const child of children) {
      if (stopped) break;
      const absolute = join(directory, child.name);
      const path = slash(relative(root, absolute));
      if (child.isSymbolicLink()) { errors.push({ code: 'UNSAFE_PATH', message: 'Symbolic links are not followed', path }); continue; }
      if (child.isDirectory()) await walk(absolute, split, depth + 1);
      else if (child.isFile() && EXTENSIONS.has(extname(child.name).toLowerCase())) {
        files.push({ absolute, path, split });
        if (files.length > maxImages) { errors.push({ code: 'IMAGE_BUDGET', message: 'Dataset exceeds the image budget; only a bounded subset was processed', limit: maxImages }); stopped = true; }
      } else ignoredFiles++;
    }
  }
  for (const split of SPLITS) {
    const directory = join(root, split);
    let info;
    try { info = await lstat(directory); } catch (error) {
      if (error.code === 'ENOENT') { missingSplits.push(split); continue; }
      errors.push({ code: 'READ_ERROR', message: 'Could not inspect split directory', path: split }); continue;
    }
    if (!info.isDirectory() || info.isSymbolicLink()) { errors.push({ code: 'UNSAFE_PATH', message: 'Split must be a regular directory', path: split }); continue; }
    await walk(directory, split, 0);
  }
  files.sort((a, b) => compare(a.path, b.path));
  if (files.length === 0 && errors.length === 0) throw new VisionLeakError('EMPTY_DATASET', 'No supported images were found under train/, validation/, or test/');
  return { files: files.slice(0, maxImages), errors, missingSplits, ignoredFiles, entriesScanned: Math.min(entries, MAX_ENTRIES), discoveredAtLeast: files.length };
}

async function inspectOutput(out, force) {
  let stat;
  try { stat = await lstat(out); } catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new VisionLeakError('OUTPUT_EXISTS', 'Output must be a regular directory');
  const names = await readdir(out);
  if (names.length === 0) return true;
  if (!force) throw new VisionLeakError('OUTPUT_EXISTS', 'Output directory is not empty; use a new directory or --force for a previous managed report');
  let marker;
  try { marker = JSON.parse(await readFile(join(out, MARKER), 'utf8')); } catch { throw new VisionLeakError('UNMANAGED_OUTPUT', 'Refusing to replace an output without a VisionLeak ownership manifest'); }
  if (marker.format !== FORMAT || !Array.isArray(marker.files) || marker.files.some((x) => typeof x !== 'string' || !/^(report\.json|thumbnails\/[a-f0-9]{64}\.jpg)$/.test(x))) {
    throw new VisionLeakError('UNMANAGED_OUTPUT', 'Output ownership manifest is invalid');
  }
  const allowed = new Set([...marker.files, MARKER]);
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = slash(relative(out, join(directory, entry.name)));
      if (entry.isDirectory() && path === 'thumbnails') await check(join(directory, entry.name));
      else if (!entry.isFile() || !allowed.has(path)) throw new VisionLeakError('UNMANAGED_OUTPUT', 'Output contains unrelated files; choose a new directory');
    }
  }
  await check(out);
  return true;
}

export async function runAudit({ root: inputRoot, out: inputOut, options: overrides = {}, force = false }) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) throw new VisionLeakError('ARGUMENT_ERROR', 'Options must be an object');
  const options = { ...DEFAULTS, ...overrides };
  const allowed = new Set(Object.keys(DEFAULTS));
  if (Object.keys(overrides).some((key) => !allowed.has(key))) throw new VisionLeakError('ARGUMENT_ERROR', 'Unknown audit option');
  for (const [key, min, max] of Object.values(NUMERIC)) {
    if (!Number.isSafeInteger(options[key]) || options[key] < min || options[key] > max) {
      throw new VisionLeakError('ARGUMENT_ERROR', `${key} must be an integer in ${min}..${max}`);
    }
  }
  if (typeof inputRoot !== 'string' || !inputRoot || typeof inputOut !== 'string' || !inputOut || typeof force !== 'boolean') {
    throw new VisionLeakError('ARGUMENT_ERROR', 'Root and output paths are required; force must be boolean');
  }
  const started = performance.now();
  let root;
  try { root = await realpath(resolve(inputRoot)); if (!(await lstat(root)).isDirectory()) throw new Error(); }
  catch { throw new VisionLeakError('INVALID_ROOT', 'Dataset root does not exist or is not a directory'); }
  const out = resolve(inputOut);
  if (within(root, out) || within(out, root)) throw new VisionLeakError('UNSAFE_OUTPUT', 'Dataset and output directories must not overlap');
  const previous = await inspectOutput(out, force);
  const discovery = await discover(root, options.maxImages);
  await mkdir(dirname(out), { recursive: true });
  const realParent = await realpath(dirname(out));
  const canonicalOut = join(realParent, basename(out));
  if (within(root, canonicalOut) || within(canonicalOut, root)) throw new VisionLeakError('UNSAFE_OUTPUT', 'Resolved output directory overlaps the dataset');
  const stage = join(realParent, `.visionleak-stage-${randomUUID()}`);
  await mkdir(join(stage, 'thumbnails'), { recursive: true });
  const images = [];
  const errors = [...discovery.errors];
  let totalPixels = 0;
  try {
    for (const entry of discovery.files) {
      const remaining = options.maxTotalPixels - totalPixels;
      if (remaining <= 0) { errors.push({ code: 'TOTAL_PIXEL_BUDGET', message: 'Total decoded pixel budget exhausted', limit: options.maxTotalPixels, path: entry.path }); break; }
      try {
        const decoded = await decodeImage(entry.absolute, { maxPixels: Math.min(options.maxPixels, remaining), maxFileBytes: options.maxFileBytes });
        totalPixels += decoded.pixelCount;
        const fp = await fingerprint(decoded);
        const previewPath = `thumbnails/${sha256(entry.path)}.jpg`;
        const preview = await thumbnail(decoded);
        await writeFile(join(stage, previewPath), preview, { flag: 'wx' });
        images.push({ id: entry.path, path: entry.path, split: entry.split, byteDigest: decoded.byteDigest,
          pixelDigest: fp.pixelDigest, dhash: fp.dhash, width: fp.width, height: fp.height, contrast: fp.contrast,
          thumbnail: previewPath, thumbnailDigest: sha256(preview), format: decoded.format });
      } catch (error) {
        if (error.code === 'CORE_UNAVAILABLE' || error.code === 'CORE_PROTOCOL' || error.code === 'CORE_REJECTED') throw error;
        if (error.code === 'PIXEL_BUDGET' && remaining < options.maxPixels) {
          errors.push({ code: 'TOTAL_PIXEL_BUDGET', message: 'Next image exceeds the remaining total pixel budget', limit: options.maxTotalPixels, path: entry.path });
          break;
        }
        errors.push(errorRecord(error, entry.path));
      }
    }
    const coreOptions = Object.fromEntries(['threshold', 'maxComparisons', 'maxPairs', 'maxImages'].map((key) => [key, options[key]]));
    const computed = images.length > 0 ? await audit(images, coreOptions) : {
      ok: false, complete: false, status: 'incomplete', pairs: [], groups: [], stats: { reason: 'no-decodable-images', processedImages: 0 },
    };
    const complete = computed.complete === true && errors.length === 0;
    const report = {
      schemaVersion: 'visionleak-report-v1',
      normalization: 'vl-rgb-v1', decoder: DECODER,
      engine: { name: 'visionleak-moonbit', artifactDigest: sha256(await readFile(new URL('../dist/visionleak.js', import.meta.url))) },
      ...computed, complete, status: complete ? 'complete' : 'incomplete', images, options, errors,
      scope: { splits: SPLITS, missingSplits: discovery.missingSplits, supportedExtensions: SUPPORTED_EXTENSIONS,
        ignoredFiles: discovery.ignoredFiles, entriesScanned: discovery.entriesScanned, discoveredAtLeast: discovery.discoveredAtLeast,
        acceptedImages: images.length, totalDecodedPixels: totalPixels, maxDirectoryEntries: MAX_ENTRIES,
        source: 'local-files', allPairsAreCrossSplit: true, perceptualMatchesRequireReview: true },
    };
    // Bind scope, rejected files, completeness, core artifact and evidence as well as input digests.
    // Exclude only wall-clock metadata so an identical audit has a reproducible ID.
    report.auditId = sha256(JSON.stringify(report));
    report.createdAt = new Date().toISOString();
    report.timing = { elapsedMs: Math.round(performance.now() - started) };
    await writeFile(join(stage, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
    await writeFile(join(stage, MARKER), `${JSON.stringify({ format: FORMAT, files: ['report.json', ...images.map((i) => i.thumbnail)] }, null, 2)}\n`, { flag: 'wx' });
    if (previous) {
      // Revalidate immediately before replacing a directory; unrelated files always block --force.
      await inspectOutput(out, force);
      const backup = join(realParent, `.visionleak-old-${randomUUID()}`);
      await rename(out, backup);
      try { await rename(stage, out); } catch (error) { await rename(backup, out); throw error; }
      await rm(backup, { recursive: true });
    } else {
      try { await lstat(out); throw new VisionLeakError('OUTPUT_EXISTS', 'Output appeared while auditing; refusing to replace it'); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      await rename(stage, out);
    }
    return { report, out };
  } finally { await rm(stage, { recursive: true, force: true }); }
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    if (args.help) { process.stdout.write(HELP); return 0; }
    const { report, out } = await runAudit(args);
    process.stdout.write(`${JSON.stringify({ ok: report.ok, complete: report.complete, status: report.status, auditId: report.auditId,
      report: join(out, 'report.json'), images: report.images.length, pairs: report.pairs.length, errors: report.errors.length })}\n`);
    return report.complete ? 0 : 2;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, complete: false, status: 'error', error: errorRecord(error) })}\n`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
