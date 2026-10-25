import { createHash } from 'node:crypto';

export class VisionLeakError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'VisionLeakError';
    this.code = code;
    this.details = details;
  }
}

let corePromise;
async function loadCore() {
  corePromise ??= import('../dist/visionleak.js').catch(() => {
    throw new VisionLeakError('CORE_UNAVAILABLE', 'Build the MoonBit core first: npm run build');
  });
  return corePromise;
}

function result(raw, operation) {
  let value;
  try { value = JSON.parse(raw); } catch {
    throw new VisionLeakError('CORE_PROTOCOL', `${operation} did not return valid JSON`);
  }
  if (!value || typeof value.ok !== 'boolean') {
    throw new VisionLeakError('CORE_PROTOCOL', `${operation} returned an invalid envelope`);
  }
  if (!value.ok) {
    throw new VisionLeakError('CORE_REJECTED', `${operation} rejected input`, { coreError: value.error });
  }
  return value;
}

/** The compiled MoonBit Bytes ABI accepts a Uint8Array, including a Buffer. */
export async function fingerprint({ width, height, rgba, includeMirrors = false, includeRotations = false }) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 || width > 65535 || height > 65535 || width * height > 4_194_304 || !(rgba instanceof Uint8Array)) {
    throw new VisionLeakError('INVALID_PIXELS', 'Pixel dimensions must be safe integers and RGBA must be a Uint8Array');
  }
  if (typeof includeMirrors !== 'boolean' || typeof includeRotations !== 'boolean') throw new VisionLeakError('INVALID_PIXELS', 'includeMirrors must be boolean');
  const core = await loadCore();
  const method = includeRotations ? 'fingerprint_oriented_rgba' : includeMirrors ? 'fingerprint_mirrored_rgba' : 'fingerprint_rgba';
  if (typeof core[method] !== 'function') {
    throw new VisionLeakError('CORE_PROTOCOL', 'Missing fingerprint_rgba export');
  }
  return result(core[method](width, height, rgba, includeMirrors), 'fingerprint');
}

export async function audit(images, options) {
  const core = await loadCore();
  return result(core.audit_json(JSON.stringify({ images, options })), 'audit');
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function errorRecord(error, path) {
  return {
    code: error instanceof VisionLeakError ? error.code : 'IO_ERROR',
    message: error instanceof VisionLeakError ? error.message : 'An input or output operation failed',
    ...(path === undefined ? {} : { path }),
    ...(error instanceof VisionLeakError ? error.details : {}),
  };
}

/** Full-resolution identity; chunks contain whole RGBA pixels in row order. */
export async function fullPixelDigest({ width, height, rgba }) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 ||
      width > 65535 || height > 65535 || width * height > 100_000_000 ||
      !(rgba instanceof Uint8Array) || rgba.length !== width * height * 4) {
    throw new VisionLeakError('INVALID_PIXELS', 'Invalid full-resolution pixel stream');
  }
  const core = await loadCore();
  const context = core.pixel_digest_new(width, height);
  const rowBytes = width * 4;
  const chunkBytes = Math.max(rowBytes, Math.floor(262144 / rowBytes) * rowBytes);
  for (let offset = 0; offset < rgba.length; offset += chunkBytes) {
    if (!core.pixel_digest_update_rgba(context, rgba.subarray(offset, offset + chunkBytes))) {
      throw new VisionLeakError('CORE_REJECTED', 'Full-resolution pixel stream rejected');
    }
  }
  return result(core.pixel_digest_final(context), 'full-resolution pixel digest');
}

export async function samplingPlan(width, height, maximum) {
  const core = await loadCore();
  return result(core.sampling_plan_json(width, height, maximum), 'sampling plan');
}
