import sharp from 'sharp';
import { open, lstat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { VisionLeakError, sha256, fullPixelDigest, samplingPlan } from './runtime.mjs';

export const DECODER = Object.freeze({ name: 'sharp', version: sharp.versions.sharp, libvips: sharp.versions.vips });
export const HARD_MAX_PIXELS = 4_194_304;
export const DEFAULT_MAX_DECODE_PIXELS = 64_000_000;
export const HARD_MAX_DECODE_PIXELS = 100_000_000;
export const DEFAULT_MAX_FILE_BYTES = 32 * 1024 * 1024;
export const SUPPORTED_EXTENSIONS = Object.freeze(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff', '.gif']);
const FORMATS = new Set(['png', 'jpeg', 'webp', 'heif', 'tiff', 'gif']);

sharp.cache(false);
sharp.concurrency(1);

/** Decode exactly one still image. No fingerprint algorithm is implemented here. */
export async function decodeImage(path, { maxPixels = HARD_MAX_PIXELS, maxDecodePixels = DEFAULT_MAX_DECODE_PIXELS, maxFileBytes = DEFAULT_MAX_FILE_BYTES } = {}) {
  if (!Number.isSafeInteger(maxPixels) || maxPixels < 1 || maxPixels > HARD_MAX_PIXELS ||
      !Number.isSafeInteger(maxDecodePixels) || maxDecodePixels < 1 || maxDecodePixels > HARD_MAX_DECODE_PIXELS ||
      !Number.isSafeInteger(maxFileBytes) || maxFileBytes < 1 || maxFileBytes > 1024 * 1024 * 1024) {
    throw new VisionLeakError('INVALID_BUDGET', 'Invalid image decoding budget');
  }
  const before = await lstat(path);
  if (!before.isFile() || before.isSymbolicLink()) {
    throw new VisionLeakError('UNSAFE_PATH', 'Only regular image files are accepted');
  }
  if (before.size > maxFileBytes) {
    throw new VisionLeakError('FILE_BYTE_BUDGET', 'Image exceeds the encoded file byte budget', { limit: maxFileBytes, actual: before.size });
  }
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  let buffer;
  try {
    const info = await handle.stat();
    if (!info.isFile() || info.size > maxFileBytes || info.ino !== before.ino) {
      throw new VisionLeakError('INPUT_CHANGED', 'Input changed during inspection');
    }
    // A bounded read also protects against a file growing after stat().
    const allocation = Buffer.alloc(info.size + 1);
    let bytes = 0;
    while (bytes < allocation.length) {
      const { bytesRead } = await handle.read(allocation, bytes, allocation.length - bytes, null);
      if (bytesRead === 0) break;
      bytes += bytesRead;
    }
    const after = await handle.stat();
    if (bytes !== info.size || after.size !== info.size || after.mtimeMs !== info.mtimeMs) {
      throw new VisionLeakError('INPUT_CHANGED', 'Input changed while being read');
    }
    buffer = allocation.subarray(0, bytes);
  } finally { await handle.close(); }

  let metadata;
  try {
    metadata = await sharp(buffer, { limitInputPixels: maxDecodePixels, failOn: 'warning' }).metadata();
  } catch (error) {
    if (/pixel limit/i.test(error.message)) throw new VisionLeakError('PIXEL_BUDGET', 'Image exceeds the pixel budget', { limit: maxDecodePixels });
    throw new VisionLeakError('DECODE_ERROR', 'Image metadata could not be decoded');
  }
  if (!FORMATS.has(metadata.format)) throw new VisionLeakError('UNSUPPORTED_FORMAT', 'Only supported raster image formats are accepted');
  if ((metadata.pages ?? 1) > 1) throw new VisionLeakError('MULTIFRAME_IMAGE', 'Animated or multi-page images are outside the still-image audit scope');
  const sourcePixels = metadata.width * metadata.height;
  if (!Number.isSafeInteger(sourcePixels) || sourcePixels < 1 || sourcePixels > maxDecodePixels || metadata.width > 65_535 || metadata.height > 65_535) {
    throw new VisionLeakError('PIXEL_BUDGET', 'Image exceeds the pixel or dimension budget', { limit: maxDecodePixels, actual: sourcePixels });
  }
  let decoded;
  try {
    decoded = await sharp(buffer, { limitInputPixels: maxDecodePixels, failOn: 'warning' })
      .autoOrient().toColourspace('srgb').ensureAlpha().raw({ depth: 'uchar' })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new VisionLeakError('DECODE_ERROR', 'Image pixels could not be decoded');
  }
  const { width, height, channels } = decoded.info;
  if (channels !== 4 || decoded.data.length !== width * height * 4 || width * height > maxDecodePixels) {
    throw new VisionLeakError('DECODE_ERROR', 'Decoder returned an invalid RGBA image');
  }
  const identity = width * height > maxPixels ? await fullPixelDigest({ width, height, rgba: decoded.data }) : null;
  const downsampled = identity !== null;
  if (downsampled) {
    // Release the full raw image before the sampled decode. libvips still owns
    // bounded decode allocations; this is not OS-level memory isolation.
    decoded = null;
    const { width: sampleWidth, height: sampleHeight } = await samplingPlan(width, height, maxPixels);
    try {
      decoded = await sharp(buffer, { limitInputPixels: maxDecodePixels, failOn: 'warning' })
        .autoOrient().toColourspace('srgb').ensureAlpha()
        .resize({ width: sampleWidth, height: sampleHeight, fit: 'inside', withoutEnlargement: true })
        .raw({ depth: 'uchar' }).toBuffer({ resolveWithObject: true });
    } catch { throw new VisionLeakError('DECODE_ERROR', 'Sampled image pixels could not be decoded'); }
    if (decoded.info.channels !== 4 || decoded.data.length !== decoded.info.width * decoded.info.height * 4 || decoded.info.width * decoded.info.height > maxPixels) {
      throw new VisionLeakError('DECODE_ERROR', 'Decoder returned an invalid sampled RGBA image');
    }
  }
  return { width: decoded.info.width, height: decoded.info.height, rgba: decoded.data,
    byteDigest: sha256(buffer), format: metadata.format, pixelCount: width * height,
    sourceWidth: width, sourceHeight: height, downsampled, fullIdentity: identity };

}

/** Display-only preview; the pixel identity always covers full-resolution RGBA. */
export async function thumbnail(decoded) {
  return sharp(decoded.rgba, { raw: { width: decoded.width, height: decoded.height, channels: 4 } })
    .flatten({ background: '#ffffff' })
    .resize({ width: 360, height: 260, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, chromaSubsampling: '4:4:4' }).toBuffer();
}
