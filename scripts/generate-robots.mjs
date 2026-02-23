/**
 * robots.txt 생성 (sitemap 참조)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');

const templates = JSON.parse(fs.readFileSync(path.join(contentDir, 'templates.json'), 'utf8'));
const BASE = templates.site.url;

const txt = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'robots.txt'), txt, 'utf8');
console.log('Generated robots.txt');
