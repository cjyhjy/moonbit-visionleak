import { mkdir, lstat, realpath, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, join, parse, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { readRegular } from './input.mjs';
import { sha256, VisionLeakError } from './runtime.mjs';

const FORMAT = 'vl-fingerprint-cache-v1';
export async function openCache(directory, configuration) {
  const absolute = resolve(directory);
  // The cache is optional, disposable local state. Never traverse symlink directories.
  let cursor = parse(absolute).root;
  for (const part of absolute.slice(cursor.length).split(sep)) {
    cursor = join(cursor, part);
    try { await mkdir(cursor); } catch (error) { if (error.code !== 'EEXIST') throw error; }
    const stat = await lstat(cursor);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new VisionLeakError('UNSAFE_CACHE', 'Cache ancestors must be regular directories');
  }
  const root = await realpath(absolute);
  const profile = { format: FORMAT, normalization: 'vl-rgb-v1', decoder: sharp.versions, ...configuration };
  const stats = { hits: 0, misses: 0, invalid: 0, writes: 0, writeErrors: 0 };
  const keyFor = byteDigest => sha256(JSON.stringify({ byteDigest, profile }));
  return {
    stats,
    async get(byteDigest, options) {
      const key = keyFor(byteDigest);
      try {
        const entry = JSON.parse(await readRegular(join(root, key + '.json'), 2 * 1024 * 1024));
        const { image, preview } = entry.payload ?? {};
        if (entry.key !== key || entry.format !== FORMAT || entry.payloadDigest !== sha256(JSON.stringify(entry.payload)) || !image || typeof preview !== 'string' ||
            image.byteDigest !== byteDigest || !/^[a-f0-9]{64}$/.test(image.pixelDigest) || image.pixelDigestBasis !== 'full' ||
            !Number.isSafeInteger(image.width) || image.width < 1 || image.width > 65535 || !Number.isSafeInteger(image.height) || image.height < 1 || image.height > 65535 ||
            !/^[01]{64}$/.test(image.dhash) || !Number.isInteger(image.contrast) || image.contrast < 0 || image.contrast > 255 ||
            !image.dhashBasis || !Number.isInteger(image.dhashBasis.width) || !Number.isInteger(image.dhashBasis.height) || image.dhashBasis.width < 1 || image.dhashBasis.height < 1 || image.dhashBasis.width * image.dhashBasis.height > options.maxPixels ||
            typeof image.dhashBasis.downsampled !== 'boolean' || typeof image.format !== 'string' ||
            (options.includeMirrors && !/^[01]{64}$/.test(image.dhashMirror)) ||
            (options.includeRotations && (!validHashes(image.dhashRotations, 3) || (options.includeMirrors && !validHashes(image.dhashMirrorRotations, 3)))) ||
            (options.includeCrops && (!validHashes(image.localHashes, 20) || image.localHashVersion !== 'vl-local-dhash-v1' || !Array.isArray(image.localContrasts) || image.localContrasts.length !== 20 || image.localContrasts.some(c => !Number.isInteger(c) || c < 0 || c > 255)))) throw new Error('Invalid cached fingerprint');
        const bytes = Buffer.from(preview, 'base64');
        if (bytes.length > 1024 * 1024 || sha256(bytes) !== image.thumbnailDigest) throw new Error('Invalid cached preview');
        // A warm cache never bypasses the current invocation's decode/total-pixel budgets.
        if (image.width * image.height > options.maxDecodePixels) throw new VisionLeakError('PIXEL_BUDGET', 'Image exceeds the pixel budget', { limit: options.maxDecodePixels });
        stats.hits++;
        return { image, preview: bytes, pixelCount: image.width * image.height };
      } catch (error) {
        if (error.code === 'PIXEL_BUDGET') throw error;
        stats.misses++;
        if (error.code !== 'ENOENT') stats.invalid++;
        return null;
      }
    },
    async put(image, preview) {
      const key = keyFor(image.byteDigest), path = join(root, key + '.json');
      const temporary = join(root, '.' + randomUUID() + '.tmp');
      try {
        // Atomically replace only the exact content-addressed entry, never source files.
        try { if ((await lstat(path)).isSymbolicLink()) throw new Error('Cache symlink'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        const payload = { image, preview: preview.toString('base64') };
        await writeFile(temporary, JSON.stringify({ format: FORMAT, key, payloadDigest: sha256(JSON.stringify(payload)), payload }), { flag: 'wx', mode: 0o600 });
        await rename(temporary, path); stats.writes++;
      } catch { stats.writeErrors++; }
      finally { await rm(temporary, { force: true }); }
    },
  };
}
function validHashes(values, length) { return Array.isArray(values) && values.length === length && values.every(h => typeof h === 'string' && /^[01]{64}$/.test(h)); }
