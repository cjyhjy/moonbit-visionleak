#!/usr/bin/env node
import http from 'node:http';
import { lstat, readFile, realpath } from 'node:fs/promises';
import { resolve, join, dirname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VisionLeakError, errorRecord, sha256 } from './runtime.mjs';

const DEMO = fileURLToPath(new URL('../demo/', import.meta.url));
const ASSETS = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/review-validation.mjs', ['review-validation.mjs', 'text/javascript; charset=utf-8']],
]);
const HEADERS = {
  'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer', 'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

async function regularFile(path, root, limit) {
  const suffix = relative(root, path);
  if (suffix.startsWith(`..${sep}`) || suffix === '..' || suffix.startsWith(sep)) throw new Error('outside');
  let current = root;
  for (const part of suffix.split(sep)) {
    current = join(current, part);
    if ((await lstat(current)).isSymbolicLink()) throw new Error('symlink');
  }
  const info = await lstat(path);
  if (!info.isFile() || info.size > limit) throw new Error('not permitted');
  return readFile(path);
}

export async function startServer({ report: reportPath, port = 4173 }) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new VisionLeakError('ARGUMENT_ERROR', 'Port must be 0..65535');
  let path, directory, reportBytes, report;
  try {
    path = resolve(reportPath);
    if ((await lstat(path)).isSymbolicLink()) throw new Error();
    directory = await realpath(dirname(path));
    path = join(directory, basename(path));
    reportBytes = await regularFile(path, directory, 64 * 1024 * 1024);
    report = JSON.parse(reportBytes);
  } catch { throw new VisionLeakError('INVALID_REPORT', 'Report is missing, oversized, or invalid JSON'); }
  if (report.schemaVersion !== 'visionleak-report-v1' || !/^[a-f0-9]{64}$/.test(report.auditId) || !Array.isArray(report.images) || report.images.length > 10_000) {
    throw new VisionLeakError('INVALID_REPORT', 'Not a supported VisionLeak report');
  }
  const thumbnails = new Map();
  for (const image of report.images) {
    if (typeof image.thumbnail !== 'string' || !/^thumbnails\/[a-f0-9]{64}\.jpg$/.test(image.thumbnail) || !/^[a-f0-9]{64}$/.test(image.thumbnailDigest)) {
      throw new VisionLeakError('INVALID_REPORT', 'Report contains an invalid thumbnail path');
    }
    thumbnails.set(`/${image.thumbnail}`, { path: join(directory, image.thumbnail), digest: image.thumbnailDigest });
  }
  let base;
  const server = http.createServer(async (request, response) => {
    const send = (status, body, type = 'text/plain; charset=utf-8', extra = {}) => {
      response.writeHead(status, { ...HEADERS, 'Content-Type': type, ...extra });
      response.end(request.method === 'HEAD' ? undefined : body);
    };
    // A user may open the workbench by clicking a link from another site/app.
    // Only the two public shell documents allow cross-site top-level navigation;
    // cross-site fetches of reports, images and assets remain rejected.
    const entryNavigation = request.method === 'GET' && ['/', '/index.html'].includes(request.url.split('?')[0]) &&
      request.headers['sec-fetch-mode'] === 'navigate' && request.headers['sec-fetch-dest'] === 'document';
    if (request.headers.host !== base.slice('http://'.length) ||
        (request.headers.origin && request.headers.origin !== base) ||
        (request.headers['sec-fetch-site'] === 'cross-site' && !entryNavigation)) {
      send(403, 'Local origin required\n'); return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') { send(405, 'Read-only server\n', undefined, { Allow: 'GET, HEAD' }); return; }
    let pathname;
    try {
      if (!request.url.startsWith('/') || request.url.startsWith('//')) throw new Error();
      pathname = decodeURIComponent(request.url.split('?')[0]);
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some((part) => part === '..' || part === '.')) throw new Error();
    } catch { send(400, 'Invalid path\n'); return; }
    try {
      if (pathname === '/report.json') { send(200, reportBytes, 'application/json; charset=utf-8'); return; }
      if (ASSETS.has(pathname)) {
        const [filename, type] = ASSETS.get(pathname);
        send(200, await regularFile(join(DEMO, filename), DEMO, 2 * 1024 * 1024), type); return;
      }
      if (thumbnails.has(pathname)) {
        const item = thumbnails.get(pathname);
        const bytes = await regularFile(item.path, directory, 2 * 1024 * 1024);
        if (sha256(bytes) !== item.digest) { send(409, 'Thumbnail changed; restart with a matching report\n'); return; }
        send(200, bytes, 'image/jpeg'); return;
      }
      send(404, 'Not found\n');
    } catch { send(404, 'Not found\n'); }
  });
  server.requestTimeout = 10_000;
  server.headersTimeout = 10_000;
  server.maxRequestsPerSocket = 100;
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolveListen);
  }).catch((error) => { throw new VisionLeakError('LISTEN_ERROR', 'Could not bind the loopback port; check local permissions or choose another --port', { cause: error.code }); });
  base = `http://127.0.0.1:${server.address().port}`;
  return { server, url: `${base}/`, auditId: report.auditId };
}

async function main(argv) {
  try {
    if (argv.includes('--help')) {
      console.log('node tools/server.mjs --report OUTPUT/report.json [--port 4173]\nRead-only loopback server. Serves only this report, its thumbnails, and the fixed demo assets.'); return;
    }
    const args = {};
    for (let i = 0; i < argv.length; i++) {
      if (!['--report', '--port'].includes(argv[i]) || args[argv[i].slice(2)] !== undefined) throw new VisionLeakError('ARGUMENT_ERROR', 'Expected --report PATH and optional --port NUMBER');
      const flag = argv[i];
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new VisionLeakError('ARGUMENT_ERROR', `Missing value: ${flag}`);
      args[flag.slice(2)] = flag === '--port' ? (/^\d+$/.test(value) ? Number(value) : NaN) : value;
    }
    if (!args.report) throw new VisionLeakError('ARGUMENT_ERROR', '--report is required');
    const { server, url, auditId } = await startServer(args);
    console.log(JSON.stringify({ ok: true, url, auditId, readOnly: true, binding: '127.0.0.1', scope: 'one-report-and-its-thumbnails' }));
    const stop = () => { server.close(); server.closeAllConnections(); };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: errorRecord(error) }));
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
