import { open, lstat, realpath } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, relative, isAbsolute, sep, extname } from 'node:path';
import { cli_options_json } from '../dist/visionleak.js';
import { SUPPORTED_EXTENSIONS } from './decode.mjs';
import { sha256, VisionLeakError } from './runtime.mjs';

export async function readRegular(path, limit) {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const before = await handle.stat();
    if (!before.isFile() || before.size > limit) throw new VisionLeakError('INPUT_LIMIT', 'Input must be a bounded regular file');
    const bytes = Buffer.alloc(before.size + 1);
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesRead } = await handle.read(bytes, offset, bytes.length - offset, null);
      if (!bytesRead) break;
      offset += bytesRead;
    }
    const after = await handle.stat();
    if (offset !== before.size || after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs) throw new VisionLeakError('INPUT_CHANGED', 'Input changed while being read');
    return bytes.subarray(0, offset);
  } finally { await handle.close(); }
}

export function relativePath(name) {
  if (typeof name !== 'string' || !name || name.length > 4096 || /[\\\u0000-\u001f\u007f]/u.test(name) || /^[a-z]:/i.test(name) || isAbsolute(name) || name.split('/').some(p => !p || p === '.' || p === '..')) {
    throw new VisionLeakError('UNSAFE_PATH', 'Paths must be canonical relative files inside the selected root');
  }
  return name;
}

export async function containedFile(root, name) {
  relativePath(name);
  let path = root;
  for (const part of name.split('/')) {
    path = join(path, part);
    if ((await lstat(path)).isSymbolicLink()) throw new VisionLeakError('UNSAFE_PATH', 'Symbolic links are not followed');
  }
  const canonical = await realpath(path);
  const suffix = relative(root, canonical);
  if (!suffix || suffix === '..' || suffix.startsWith('..' + sep) || isAbsolute(suffix)) throw new VisionLeakError('UNSAFE_PATH', 'Input escaped the selected root');
  if (!(await lstat(canonical)).isFile()) throw new VisionLeakError('UNSAFE_PATH', 'Input must be a regular file');
  return canonical;
}

// Bounded RFC 4180 reader. Reject ambiguous quoting instead of guessing a dialect.
export function parseCSV(text) {
  const rows = [], row = [];
  let cell = '', quoted = false, closed = false, atStart = true;
  const finishCell = () => { row.push(cell); cell = ''; closed = false; atStart = true; };
  const finishRow = () => { finishCell(); rows.push(row.splice(0)); if (rows.length > 10001) throw new VisionLeakError('MANIFEST_LIMIT', 'Manifest exceeds 10000 images'); };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { quoted = false; closed = true; }
      } else cell += c;
    } else if (c === ',' ) finishCell();
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[++i] !== '\n') throw new VisionLeakError('INVALID_MANIFEST', 'CSV requires LF or CRLF line endings');
      finishRow();
    } else if (closed) throw new VisionLeakError('INVALID_MANIFEST', 'Unexpected text after a closing CSV quote');
    else if (c === '"') {
      if (!atStart) throw new VisionLeakError('INVALID_MANIFEST', 'CSV quotes must enclose the whole field');
      quoted = true; atStart = false;
    } else { cell += c; atStart = false; }
  }
  if (quoted) throw new VisionLeakError('INVALID_MANIFEST', 'Unclosed CSV quote');
  if (cell !== '' || row.length || closed) finishRow();
  return rows;
}

export async function discoverManifest(root, manifest, maxImages) {
  const bytes = await readRegular(manifest, 8 * 1024 * 1024);
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw new VisionLeakError('INVALID_MANIFEST', 'Manifest must be UTF-8 CSV'); }
  const rows = parseCSV(text);
  if (JSON.stringify(rows.shift()) !== '["path","split"]' || rows.length === 0) throw new VisionLeakError('INVALID_MANIFEST', 'Manifest requires path,split header and at least one image');
  const aliases = JSON.parse(cli_options_json('{"operation":"limits"}')).splitAliases;
  const splits = new Map(Object.entries(aliases).flatMap(([split, names]) => names.map(name => [name, split])));
  const seen = new Set(), records = [];
  for (const [index, row] of rows.entries()) {
    if (row.length !== 2 || !splits.has(row[1])) throw new VisionLeakError('INVALID_MANIFEST', 'Every row needs a path and a known split', { row: index + 2 });
    const path = relativePath(row[0]), split = splits.get(row[1]);
    if (seen.has(path)) throw new VisionLeakError('MANIFEST_CONFLICT', 'Each path may appear only once, even in the same split', { path, row: index + 2 });
    if (!SUPPORTED_EXTENSIONS.includes(extname(path).toLowerCase())) throw new VisionLeakError('INVALID_MANIFEST', 'Manifest contains an unsupported image extension', { path });
    seen.add(path); records.push({ path, split });
  }
  records.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const errors = [], files = [];
  for (const entry of records.slice(0, maxImages)) {
    // Missing/unsafe files are visible rejected inputs; valid rows still produce evidence.
    try { files.push({ ...entry, absolute: await containedFile(root, entry.path) }); }
    catch (error) { errors.push({ code: error.code === 'ENOENT' ? 'MISSING_INPUT' : 'UNSAFE_PATH', message: 'Manifest input is missing or not a contained regular file', path: entry.path, split: entry.split }); }
  }
  if (records.length > maxImages) errors.push({ code: 'IMAGE_BUDGET', message: 'Manifest exceeds the image budget', limit: maxImages, path: records[maxImages].path, split: records[maxImages].split });
  return { files, discovered: records, ignored: [], errors, missingSplits: ['train', 'validation', 'test'].filter(s => !records.some(r => r.split === s)), splitDirectories: {}, ignoredFiles: 0, entriesScanned: records.length, discoveredAtLeast: records.length,
    input: { layout: 'csv-manifest', sha256: sha256(bytes), mappingSha256: sha256(JSON.stringify(records)), records: records.length, scope: 'listed-files-only' } };
}
