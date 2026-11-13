#!/usr/bin/env node
import { readdir, opendir, lstat, realpath, mkdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, join, relative, dirname, basename, extname, sep, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { decodeImage, decodeBuffer, readImageBytes, thumbnail, DECODER, HARD_MAX_PIXELS, DEFAULT_MAX_FILE_BYTES, SUPPORTED_EXTENSIONS } from './decode.mjs';
import { audit, fingerprint, sha256, VisionLeakError, errorRecord } from './runtime.mjs';
import { cli_options_json } from '../dist/visionleak.js';
import { IDENTITY_VERSION, reportIdentity } from '../demo/report-identity.mjs';
import { workflow } from './workflow.mjs';
import { verifyFiles, exportFixes, exportHTML } from './report-tools.mjs';
import { capabilities } from './capabilities.mjs';
import { discoverManifest, containedFile } from './input.mjs';
import { openCache } from './fingerprint-cache.mjs';
import { runOrb } from './orb.mjs';

const SPLITS = ['train', 'validation', 'test'];
const MARKER = '.visionleak-output.json';
const FORMAT = 'visionleak-output-v1';
const EXTENSIONS = new Set(SUPPORTED_EXTENSIONS);
const MAX_ENTRIES = 100_000;
function cliCore(request) {
  const result = JSON.parse(cli_options_json(JSON.stringify(request)));
  if (!result.ok) throw new VisionLeakError(result.error.code, result.error.message, Object.fromEntries(Object.entries(result.error).filter(([key]) => !["code", "message"].includes(key))));
  return result;
}
export const DEFAULTS = Object.freeze(cliCore({ operation: 'defaults' }).options);
const HELP = `VisionLeak — local, read-only cross-split image audit

  node tools/cli.mjs doctor [--include-orb]
  node tools/cli.mjs capabilities
  node tools/cli.mjs audit --root DATASET --out OUTPUT [options]
  node tools/cli.mjs verify --report REPORT --root DATASET
  node tools/cli.mjs export-html --report REPORT --out FILE [--review REVIEW] [--max-bytes N]
  node tools/cli.mjs export-fixes --report REPORT --out FILE [--review REVIEW]
  node tools/server.mjs --report OUTPUT/report.json --port 4173

DATASET contains train/, validation/, and/or test/ directories.
Options (all budgets are finite):
  --manifest FILE        UTF-8 CSV path,split; paths relative to --root
  --cache DIRECTORY      Optional content/config keyed fingerprint cache
  --max-exact-comparisons N  Deterministic-stage budget (default 1000000)
  --threshold N          Hamming threshold, 0..64 (default 6)
  --max-images N         1..10000 (default 1000)
  --max-pixels N         Fingerprint sampling cap, 1..4194304 (default 4194304)
  --max-decode-pixels N  Source decode cap, 1..100000000 (default 64000000)
  --max-total-pixels N   Across decoded source pixels, 1..2000000000 (default 100000000)
  --max-file-bytes N     Per encoded file (default 33554432)
  --max-comparisons N    Budget for EACH perceptual/local stage, 0..10000000 (default 1000000)
  --max-pairs N          Output-pair budget, 0..100000 (default 10000)
  --include-orb-retrieval  Optional approximate descriptor search; requires --include-orb and --cache
  --max-orb-index-descriptors N  Index descriptor cap, 0..8000000 (default 4000000)
  --max-orb-index-visits N   Posting work cap, 0..1000000000 (default 100000000)
  --max-orb-index-memory-mib N   Index child RSS guard, 64..512 (default 256)
  --include-orb         Optional ORB geometry candidates; needs requirements-orb.txt
  --max-orb-images N    Feature prefix cap, 0..10000 (default 256; >512 needs --cache)
  --max-orb-pixels N    Per-image sampled pixels, 1..4194304 (default 1048576)
  --max-orb-total-pixels N  Total feature pixels, 0..2000000000 (default 33554432)
  --max-orb-comparisons N  Descriptor comparisons, 0..2000000000 (default 100000000)
  --max-orb-pair-checks N  Directional checks, 0..100000 (default 10000)
  --max-orb-candidates N   Additional pairs, 0..1000 (default 200)
  --max-orb-milliseconds N  Worker lifetime, 1..300000 (default 60000)
  --max-orb-memory-mib N    Worker RSS guard, 64..512 (default 256)
  --include-crops       Experimental local-window candidates (default off)
  --include-rotations   Also search clockwise 90/180/270-degree orientations (default off)
  --include-mirrors     Also search horizontal-reflection candidates (default off)
  --fail-on LEVEL       Exit 3 for exact, pixel, or candidate evidence (default off)
  --force               Replace only an intact VisionLeak-managed output directory
  --help                Show this help

Audit exit priority: 1 fatal > 3 fail-on hit > 2 incomplete > 0 complete.
Verify exits 4 for invalid/missing evidence, 1 for fatal errors, otherwise 0.
Without --fail-on, duplicates do not change the audit exit code. Source files are never modified.
`;

function parseArgs(argv) { return cliCore({ operation: 'parse', argv }).args; }

const slash = (path) => path.split(sep).join('/');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const within = (parent, child) => {
  const suffix = relative(parent, child);
  return suffix === '' || (suffix !== '..' && !suffix.startsWith(`..${sep}`) && !isAbsolute(suffix));
};

// Resolve the nearest existing ancestor before mkdir: a symlink alias must not
// allow a rejected output path to create directories inside the source dataset.
async function canonicalDestination(path) {
  let ancestor = dirname(path);
  const suffix = [basename(path)];
  while (true) {
    try { return join(await realpath(ancestor), ...suffix); }
    catch (error) {
      if (error.code !== 'ENOENT' || dirname(ancestor) === ancestor) throw error;
      suffix.unshift(basename(ancestor));
      ancestor = dirname(ancestor);
    }
  }
}

async function discover(root, maxImages) {
  const files = [];
  const errors = [];
  const missingSplits = [];
  const splitDirectories = {};
  const ignored = [];
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
        if (files.length > maxImages) { errors.push({ code: 'IMAGE_BUDGET', message: 'Dataset exceeds the image budget; only a bounded subset was processed', limit: maxImages, path }); stopped = true; }
      } else { ignoredFiles++; ignored.push({path,split}); }
    }
  }
  const present = new Map();
  for (const name of cliCore({ operation: 'splitAliases' }).aliases) {
    try { present.set(name, await lstat(join(root, name))); }
    catch (error) {
      if (error.code !== 'ENOENT') errors.push({ code: 'READ_ERROR', message: 'Could not inspect split directory', path: name });
    }
  }
  const selected = cliCore({ operation: 'splits', names: [...present.keys()] });
  missingSplits.push(...selected.missingSplits);
  for (const { directory: name, split } of selected.directories) {
    const info = present.get(name);
    if (!info.isDirectory() || info.isSymbolicLink()) { errors.push({ code: 'UNSAFE_PATH', message: 'Split must be a regular directory', path: name }); continue; }
    splitDirectories[name] = split;
    await walk(join(root, name), split, 0);
  }
  files.sort((a, b) => compare(a.path, b.path));
  if (files.length === 0 && errors.length === 0) throw new VisionLeakError('EMPTY_DATASET', 'No supported images were found under train/, validation/, or test/');
  return { files: files.slice(0, maxImages), discovered:files.map(({path,split})=>({path,split})), ignored, errors, missingSplits, splitDirectories, ignoredFiles, entriesScanned: Math.min(entries, MAX_ENTRIES), discoveredAtLeast: files.length };
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

export async function runAudit({ root: inputRoot, out: inputOut, options: overrides = {}, force = false, failOn = '', manifest, cache: cacheDirectory, signal }) {
  const options = cliCore({ operation: 'options', overrides }).options;
  workflow({operation:'gate',report:{complete:true,pairs:[]},failOn});
  if (typeof inputRoot !== 'string' || !inputRoot || typeof inputOut !== 'string' || !inputOut || typeof force !== 'boolean') {
    throw new VisionLeakError('ARGUMENT_ERROR', 'Root and output paths are required; force must be boolean');
  }
  const started = performance.now();
  let root;
  try { root = await realpath(resolve(inputRoot)); if (!(await lstat(root)).isDirectory()) throw new Error(); }
  catch { throw new VisionLeakError('INVALID_ROOT', 'Dataset root does not exist or is not a directory'); }
  const out = resolve(inputOut);
  if (within(root, out) || within(out, root)) throw new VisionLeakError('UNSAFE_OUTPUT', 'Dataset and output directories must not overlap');
  const intendedOut = await canonicalDestination(out);
  if (within(root, intendedOut) || within(intendedOut, root)) throw new VisionLeakError('UNSAFE_OUTPUT', 'Resolved output directory overlaps the dataset');
  const previous = await inspectOutput(out, force);
  if ((manifest !== undefined && (typeof manifest !== 'string' || !manifest)) || (cacheDirectory !== undefined && (typeof cacheDirectory !== 'string' || !cacheDirectory))) throw new VisionLeakError('ARGUMENT_ERROR', 'Manifest and cache paths must be nonempty strings');
  let cache, orbCacheDirectory;
  if (cacheDirectory) {
    const intendedCache = await canonicalDestination(resolve(cacheDirectory));
    if (within(root, intendedCache) || within(intendedCache, root) || within(intendedOut, intendedCache) || within(intendedCache, intendedOut)) throw new VisionLeakError('UNSAFE_CACHE', 'Cache, dataset and output directories must not overlap');
    orbCacheDirectory=intendedCache;
    cache = await openCache(intendedCache, { coreArtifact: sha256(await readFile(new URL('../dist/visionleak.js', import.meta.url))),
      maxPixels: options.maxPixels, includeMirrors: options.includeMirrors, includeRotations: options.includeRotations, includeCrops: options.includeCrops });
  }
  const discovery = manifest ? await discoverManifest(root, resolve(manifest), options.maxImages) : await discover(root, options.maxImages);
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
        const decodeOptions = { maxPixels: options.maxPixels, maxDecodePixels: Math.min(options.maxDecodePixels, remaining), maxFileBytes: options.maxFileBytes };
        // Recheck every ancestor before opening either discovery mode's input.
        const file = await containedFile(root, entry.path);
        let cached, buffer;
        if (cache) {
          buffer = await readImageBytes(file, decodeOptions);
          cached = await cache.get(sha256(buffer), { ...options, ...decodeOptions });
        }
        const previewPath = `thumbnails/${sha256(entry.path)}.jpg`;
        let image, preview;
        if (cached) {
          ({ image, preview } = cached);
          totalPixels += cached.pixelCount;
        } else {
          const decoded = buffer ? await decodeBuffer(buffer, decodeOptions) : await decodeImage(file, decodeOptions);
          totalPixels += decoded.pixelCount;
          const fp = await fingerprint({ ...decoded, includeMirrors: options.includeMirrors, includeRotations: options.includeRotations, includeCrops: options.includeCrops });
          preview = await thumbnail(decoded);
        image = { byteDigest: decoded.byteDigest,
          pixelDigest: decoded.fullIdentity?.pixelDigest ?? fp.pixelDigest, pixelDigestBasis: 'full',
          dhashBasis: { width: fp.width, height: fp.height, downsampled: decoded.downsampled }, dhash: fp.dhash, ...(options.includeMirrors ? { dhashMirror: fp.dhashMirror } : {}), ...(options.includeRotations ? { dhashRotations: fp.dhashRotations, ...(options.includeMirrors ? { dhashMirrorRotations: fp.dhashMirrorRotations } : {}) } : {}), width: decoded.sourceWidth, height: decoded.sourceHeight, contrast: decoded.fullIdentity?.contrast ?? fp.contrast,
          ...(options.includeCrops ? { localHashes: fp.localHashes, localContrasts: fp.localContrasts, localHashVersion: fp.localHashVersion } : {}),
          thumbnailDigest: sha256(preview), format: decoded.format };
          if (cache) await cache.put(image, preview);
        }
        await writeFile(join(stage, previewPath), preview, { flag: 'wx' });
        images.push({ id: entry.path, path: entry.path, split: entry.split, ...image, thumbnail: previewPath });
      } catch (error) {
        if (error.code === 'CORE_UNAVAILABLE' || error.code === 'CORE_PROTOCOL' || error.code === 'CORE_REJECTED') throw error;
        if (error.code === 'PIXEL_BUDGET' && remaining < options.maxDecodePixels) {
          errors.push({ code: 'TOTAL_PIXEL_BUDGET', message: 'Next image exceeds the remaining total pixel budget', limit: options.maxTotalPixels, path: entry.path });
          break;
        }
        errors.push(errorRecord(error, entry.path));
      }
    }
    const coreOptions = Object.fromEntries(['threshold', 'maxExactComparisons', 'maxComparisons', 'maxPairs', 'maxImages', 'includeMirrors', 'includeRotations', 'includeCrops'].map((key) => [key, options[key]]));
    const computed = images.length > 0 ? await audit(images, coreOptions) : {
      ok: false, complete: false, status: 'incomplete', pairs: [], groups: [], stats: { reason: 'no-decodable-images', processedImages: 0 },
    };
    let orb;
    if (options.includeOrb) {
      orb = await runOrb({root, images, computed, options, signal, cacheDirectory:orbCacheDirectory});
      computed.phases = {...computed.phases, orb:orb.phase};
      computed.stats = {...computed.stats, processedImages:Math.min(computed.stats.processedImages,orb.phase.processedImages),
        emittedPairs:computed.pairs.length, orbCandidatePairs:orb.phase.emittedPairs};
      if (!orb.phase.complete && !computed.stats.reason) computed.stats.reason = orb.phase.reason;
      computed.complete = computed.complete && orb.phase.complete;
      errors.push(...orb.errors);
    }
    const complete = computed.complete === true && errors.length === 0;
    const report = {
      ...(computed.localProfile ? { localProfile: computed.localProfile } : {}),
      ...(orb ? {orbProfile:orb.profile} : {}),
      schemaVersion: 'visionleak-report-v1',
      identityVersion: IDENTITY_VERSION,
      normalization: 'vl-rgb-v1', decoder: DECODER,
      engine: { name: 'visionleak-moonbit', artifactDigest: sha256(await readFile(new URL('../dist/visionleak.js', import.meta.url))) },
      ...computed, complete, status: complete ? 'complete' : 'incomplete', images, options, errors,
      scope: { ...(discovery.input ? { input: discovery.input } : {}), splits: SPLITS, splitDirectories: discovery.splitDirectories, missingSplits: discovery.missingSplits, supportedExtensions: SUPPORTED_EXTENSIONS,
        ignoredFiles: discovery.ignoredFiles, entriesScanned: discovery.entriesScanned, discoveredAtLeast: discovery.discoveredAtLeast,
        acceptedImages: images.length, totalDecodedPixels: totalPixels, maxDirectoryEntries: MAX_ENTRIES,
        source: 'local-files', allPairsAreCrossSplit: true, perceptualMatchesRequireReview: true },
    };
    report.coverage = workflow({operation:'coverage',report,ignored:discovery.ignored,discovered:discovery.discovered}).coverage;
    report.candidateGroups = workflow({operation:'groups',report}).candidateGroups;
    // Bind scope, rejected files, completeness, core artifact and evidence as well as input digests.
    // Exclude only wall-clock metadata so an identical audit has a reproducible ID.
    report.auditId = reportIdentity(report).digest;
    report.createdAt = new Date().toISOString();
    report.timing = { ...(orb ? {orb:orb.timing} : {}), ...(cache ? { cache: cache.stats } : {}), elapsedMs: Math.round(performance.now() - started) };
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
    return { report, out, ...(cache ? { cache: cache.stats } : {}) };
  } finally { await rm(stage, { recursive: true, force: true }); }
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    if (args.help) { process.stdout.write(HELP); return 0; }
    if (args.command === 'capabilities') {
      process.stdout.write(`${JSON.stringify(await capabilities())}\n`);
      return 0;
    }
    if (args.command) {
      const result = args.command === 'verify' ? await verifyFiles(args)
        : args.command === 'export-fixes' ? await exportFixes(args) : await exportHTML(args);
      process.stdout.write(`${JSON.stringify(result)}\n`);
      return result.exitCode ?? 0;
    }
    const { report, out } = await runAudit(args);
    const gate = workflow({operation:'gate',report,failOn:args.failOn});
    process.stdout.write(`${JSON.stringify({ ok: report.ok, complete: report.complete, status: report.status, auditId: report.auditId,
      report: join(out, 'report.json'), images: report.images.length, pairs: report.pairs.length, errors: report.errors.length,
      phases:report.phases, cache:report.timing.cache, coverage:report.coverage, ...(args.failOn ? {failOn:gate.failOn,matched:gate.matched,evidenceCounts:gate.counts}: {}) })}\n`);
    return gate.exitCode;
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, complete: false, status: 'error', error: errorRecord(error) })}\n`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
