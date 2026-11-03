import { spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const run = spawnSync(root + 'tools/moon', ['build', '--target', 'js', '--release'], { cwd: root, stdio: 'inherit' });
if (run.status !== 0) process.exit(run.status || 1);
mkdirSync(root + 'dist', { recursive: true });
copyFileSync(root + '_build/js/release/build/core/core.js', root + 'dist/visionleak.js');
console.log('Built dist/visionleak.js from MoonBit.');
