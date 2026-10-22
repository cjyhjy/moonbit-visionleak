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
export async function fingerprint({ width, height, rgba }) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || !(rgba instanceof Uint8Array)) {
    throw new VisionLeakError('INVALID_PIXELS', 'Pixel dimensions must be safe integers and RGBA must be a Uint8Array');
  }
  const core = await loadCore();
  if (typeof core.fingerprint_rgba !== 'function') {
    throw new VisionLeakError('CORE_PROTOCOL', 'Missing fingerprint_rgba export');
  }
  return result(core.fingerprint_rgba(width, height, rgba), 'fingerprint');
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
