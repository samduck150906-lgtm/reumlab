/**
 * sitemap.xml 생성 (메인 + 허브 38 + 랜딩 328 = 367 URL)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');

const templates = JSON.parse(fs.readFileSync(path.join(contentDir, 'templates.json'), 'utf8'));
const landings = JSON.parse(fs.readFileSync(path.join(contentDir, 'landings.json'), 'utf8'));
const clusters = JSON.parse(fs.readFileSync(path.join(contentDir, 'clusters.json'), 'utf8'));

const BASE = templates.site.url;
const now = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: BASE + '/', lastmod: now, changefreq: 'weekly', priority: '1.0' },
  { loc: BASE + '/consultation/', lastmod: now, changefreq: 'monthly', priority: '0.9' },
  { loc: BASE + '/vvip/', lastmod: now, changefreq: 'monthly', priority: '0.9' },
  ...Object.keys(clusters).map((slug) => ({
    loc: `${BASE}/h/${slug}/`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  ...landings.map((l) => ({
    loc: `${BASE}/l/${l.slug}/`,
    lastmod: now,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
console.log('Generated sitemap.xml:', urls.length, 'URLs');
