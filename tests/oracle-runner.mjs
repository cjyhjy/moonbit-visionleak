// Small process boundary for the independent Python/ImageHash oracle.
import fs from 'node:fs';
import path from 'node:path';
import { fingerprint } from '../tools/runtime.mjs';
import { decodeImage } from '../tools/decode.mjs';

const request = JSON.parse(fs.readFileSync(0, 'utf8'));
const results = [];
if (request.mode === 'vectors') {
  for (const item of request.items) {
    results.push({ id: item.id, fingerprint: await fingerprint(item) });
  }
} else if (request.mode === 'files') {
  for (const relativePath of request.paths) {
    const decoded = await decodeImage(path.resolve(request.root, relativePath));
    results.push({ path: relativePath, width: decoded.width, height: decoded.height,
      rgbaBase64: Buffer.from(decoded.rgba).toString('base64'),
      fingerprint: await fingerprint(decoded) });
  }
} else {
  throw new Error('Unknown oracle request mode');
}
process.stdout.write(JSON.stringify(results));
