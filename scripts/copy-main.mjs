/**
 * index.html + assets → public/ 복사
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(publicDir, 'index.html'));
console.log('Copied index.html → public/index.html');

const assetsSrc = path.join(root, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  console.log('Copied assets/ → public/assets/');
}

const vvipSrc = path.join(root, 'vvip');
const vvipDest = path.join(publicDir, 'vvip');
if (fs.existsSync(vvipSrc)) {
  fs.cpSync(vvipSrc, vvipDest, { recursive: true });
  console.log('Copied vvip/ → public/vvip/');
}
