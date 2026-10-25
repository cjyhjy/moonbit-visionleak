import { open, lstat, realpath, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve, dirname, join, relative, isAbsolute, sep } from 'node:path';
import { sha256_new, sha256_update, sha256_final } from '../dist/visionleak.js';
import { verifyReportIdentity } from '../demo/report-identity.mjs';
import { validateReport, validateReview, pairKey } from '../demo/review-validation.mjs';
import { decodeImage } from './decode.mjs';
import { fingerprint, sha256, VisionLeakError } from './runtime.mjs';
import { workflow } from './workflow.mjs';

async function readRegular(path, limit) {
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
    if (offset !== before.size || after.size !== before.size || after.mtimeMs !== before.mtimeMs) throw new VisionLeakError('INPUT_CHANGED', 'Input changed while being read');
    return bytes.subarray(0, offset);
  } finally { await handle.close(); }
}

async function containedFile(root, name) {
  if (typeof name !== 'string' || !name || name.includes('\\') || name.includes('\0') || isAbsolute(name) || name.split('/').some(p => !p || p === '.' || p === '..')) {
    throw new VisionLeakError('UNSAFE_PATH', 'Report paths must be relative files inside the selected root');
  }
  let path = root;
  for (const part of name.split('/')) {
    path = join(path, part);
    if ((await lstat(path)).isSymbolicLink()) throw new VisionLeakError('UNSAFE_PATH', 'Symbolic links are not followed');
  }
  const canonical = await realpath(path);
  const suffix = relative(root, canonical);
  if (!suffix || suffix === '..' || suffix.startsWith('..' + sep) || isAbsolute(suffix)) throw new VisionLeakError('UNSAFE_PATH', 'Input escaped the selected root');
  return canonical;
}

async function loadReport(path, reviewPath) {
  const bytes = await readRegular(resolve(path), 64 * 1024 * 1024);
  let raw;
  try { raw = JSON.parse(bytes); await verifyReportIdentity(raw); }
  catch (error) { throw new VisionLeakError('INVALID_REPORT', error.message); }
  let report, reviews;
  try { report = validateReport(raw); }
  catch(error) { throw new VisionLeakError('INVALID_REPORT',error.message); }
  try {
    reviews = raw.review ? validateReview(raw.review, report) : new Map();
    if (reviewPath) {
      const incoming = validateReview(JSON.parse(await readRegular(resolve(reviewPath), 32 * 1024 * 1024)), report);
      for (const [key, value] of incoming) if (!reviews.has(key) || Date.parse(value.updatedAt) >= Date.parse(reviews.get(key).updatedAt)) reviews.set(key, value);
    }
  } catch (error) { throw new VisionLeakError('INVALID_REVIEW', error.message); }
  return { raw, report, reviews };
}

export async function verifyFiles({ report: path, root: inputRoot }) {
  const { raw, report } = await loadReport(path);
  let root;
  try { root = await realpath(resolve(inputRoot)); if (!(await lstat(root)).isDirectory()) throw new Error(); }
  catch { throw new VisionLeakError('INVALID_ROOT', 'Dataset root must be a directory'); }
  const needed = workflow({operation:'verificationInputs',report:raw}).ids;
  const observations = [];
  for (const id of needed) {
    const image = report.images.get(id);
    try {
      const file = await containedFile(root, image.path);
      const bytes = await readRegular(file, 1024 * 1024 * 1024);
      const context = sha256_new();
      for (let offset = 0; offset < bytes.length; offset += 262144) sha256_update(context, bytes.subarray(offset, offset + 262144));
      const observed = { id, status: 'ok', byteDigest: sha256_final(context) };
      const decoded = await decodeImage(file, { maxDecodePixels: 100_000_000, maxFileBytes: 1024 * 1024 * 1024 });
      const fp = decoded.fullIdentity || await fingerprint(decoded);
      observed.pixelDigest = fp.pixelDigest;
      // The byte digest and decoded pixels must belong to the same read.
      if (decoded.byteDigest !== observed.byteDigest) throw new VisionLeakError('INPUT_CHANGED', 'Input changed between byte and pixel reads');
      observations.push(observed);
    } catch (error) {
      observations.push({ id, status: error.code === 'ENOENT' ? 'missing' : 'error', code: error.code || 'IO_ERROR' });
    }
  }
  return workflow({ operation: 'verify', report: raw, observations });
}

export async function exportFixes({ report: path, out, review }) {
  const { raw, reviews } = await loadReport(path, review);
  const result = workflow({ operation: 'fixes', report: raw, reviews: [...reviews.values()] });
  await writeFile(resolve(out), result.csv, { flag: 'wx' });
  return { ok: true, auditId: raw.auditId, file: resolve(out), rows: result.rows.length, exitCode: 0 };
}

const encode = value => Buffer.from(JSON.stringify(value)).toString('base64');
const rowHTML = row => `<article data-evidence="${encode(row)}"></article>\n`;
const STYLE = 'body{font:16px system-ui;max-width:1100px;margin:36px auto;padding:0 20px;background:#f7f7f2;color:#243733}article{border:1px solid #ccd4c8;padding:20px;margin:20px 0;border-radius:12px}img{max-width:45%;max-height:260px;margin:10px}pre,code{white-space:pre-wrap;overflow-wrap:anywhere}p{line-height:1.7}.warning{background:#ffedc9;padding:15px}';
const SCRIPT = `const decode=s=>JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));const meta=decode(document.querySelector('[data-report]').dataset.report);const put=(parent,tag,text)=>{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e};put(document.querySelector('#metadata'),'p','来源审计：'+meta.auditId+'；源报告'+(meta.complete?'完整':'不完整')+'；此只读快照覆盖 '+meta.includedPairs+' / '+meta.totalPairs+' 对证据。');if(meta.truncated)put(document.querySelector('#metadata'),'p','已达到输出大小上限；省略 '+meta.omittedPairs+' 对证据。').className='warning';if(meta.reportTruncated)put(document.querySelector('#metadata'),'p','报告 JSON 已按大小上限裁剪；配对详情保留在下方证据中，请另行保留完整源报告。').className='warning';const snapshot={...meta,evidence:[]};for(const el of document.querySelectorAll('[data-evidence]')){const row=decode(el.dataset.evidence);snapshot.evidence.push(row);put(el,'h2',row.pair.evidence+' · 距离 '+row.pair.distance);put(el,'p',row.left.path+' ↔ '+row.right.path);for(const value of [row.leftThumbnail,row.rightThumbnail]){if(value){const img=document.createElement('img');img.src=value;img.alt='配对图像缩略图';el.append(img)}else put(el,'p','缩略图不可用')}put(el,'p','人工复核：'+(row.review?.decision||'未复核')+(row.review?.note?'；'+row.review.note:''));const details=document.createElement('details');put(details,'summary','查看原始证据');put(details,'pre',JSON.stringify({pair:row.pair,left:row.left,right:row.right,review:row.review},null,2));el.append(details)}document.querySelector('#snapshot').textContent=JSON.stringify(snapshot,null,2);`;
function documentHTML(meta, rows) {
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>VisionLeak 离线证据快照</title><style>${STYLE}</style><body><h1>VisionLeak 离线证据快照</h1><p>只读副本。相似候选需要人工判断，页面不会修改任何源文件。</p><section id="metadata" data-report="${encode(meta)}"></section>${rows}<details><summary>内嵌报告快照 JSON</summary><pre id="snapshot"></pre></details><script>${SCRIPT}</script></body></html>`;
}

export async function exportHTML({ report: path, out, review, maxBytes = 20 * 1024 * 1024 }) {
  const { raw, report, reviews } = await loadReport(path, review);
  const root = await realpath(dirname(resolve(path)));
  const assets = new Map();
  for (const pair of report.pairs) for (const id of [pair.left, pair.right]) {
    if (assets.has(id)) continue;
    const image = report.images.get(id);
    let asset = null;
    try {
      if (!/^thumbnails\/[a-f0-9]{64}\.jpg$/.test(image.thumbnail)) throw new Error();
      const file = await containedFile(root, image.thumbnail), stat = await lstat(file);
      if (!stat.isFile() || stat.size > 2 * 1024 * 1024) throw new Error();
      asset = { file, size: stat.size, digest: image.thumbnailDigest };
    } catch { /* Missing or unsafe previews remain visibly unavailable. */ }
    assets.set(id, asset);
  }
  const bundle = {...raw, review:{schemaVersion:'visionleak-review-v1',auditId:raw.auditId,reviews:[...reviews.values()]}};
  const meta = workflow({operation:'offlineMetadata',report:bundle,maxBytes}).metadata;
  Object.assign(meta,{includedPairs:0,omittedPairs:0,truncated:false});
  const rows = report.pairs.map(pair => ({ pair, left: report.images.get(pair.left), right: report.images.get(pair.right),
    review: reviews.get(pairKey(pair.left, pair.right)) || null, leftThumbnail: null, rightThumbnail: null }));
  const imageBytes = new Map([...report.images].map(([id,image])=>[id,Buffer.byteLength(JSON.stringify(image))]));
  const overhead = Buffer.byteLength(JSON.stringify({pair:null,left:null,right:null,review:null,leftThumbnail:null,rightThumbnail:null})) - 16;
  const costs = rows.map(row => {
    let bytes = overhead + Buffer.byteLength(JSON.stringify(row.pair)) + imageBytes.get(row.pair.left)
      + imageBytes.get(row.pair.right) + Buffer.byteLength(JSON.stringify(row.review));
    for (const id of [row.pair.left, row.pair.right]) {
      const asset = assets.get(id);
      if (asset) bytes += 23 + 4 * Math.ceil(asset.size / 3);
    }
    return { bytes: 64 + 4 * Math.ceil(bytes / 3) };
  });
  const plan = workflow({ operation: 'offline', maxBytes, headerBytes: Buffer.byteLength(documentHTML(meta, '')) + 512, rows: costs });
  const loaded = new Map();
  async function data(id) {
    if (loaded.has(id)) return loaded.get(id);
    const asset = assets.get(id);
    let value = null;
    if (asset) try {
      const bytes = await readRegular(asset.file, 2 * 1024 * 1024);
      if (bytes.length === asset.size && sha256(bytes) === asset.digest) value = 'data:image/jpeg;base64,' + bytes.toString('base64');
    } catch { /* Changed previews are not embedded. */ }
    loaded.set(id, value);
    return value;
  }
  const fragments = [];
  for (const index of plan.selected) {
    const row = rows[index];
    row.leftThumbnail = await data(row.pair.left);
    row.rightThumbnail = await data(row.pair.right);
    fragments.push(rowHTML(row));
  }
  Object.assign(meta, { includedPairs: plan.includedPairs, omittedPairs: plan.omittedPairs, truncated: plan.truncated });
  const html = documentHTML(meta, fragments.join(''));
  if (Buffer.byteLength(html) > maxBytes) throw new VisionLeakError('EXPORT_SIZE_LIMIT', 'Offline export exceeds its byte limit');
  await writeFile(resolve(out), html, { flag: 'wx' });
  return { ok: true, auditId: raw.auditId, file: resolve(out), bytes: Buffer.byteLength(html), truncated: plan.truncated,
    includedPairs: plan.includedPairs, omittedPairs: plan.omittedPairs, exitCode: 0 };
}
