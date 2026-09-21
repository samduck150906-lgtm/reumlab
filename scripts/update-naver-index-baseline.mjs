import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readSitemapLocs } from './read-sitemap.mjs';
import { mergeProtectedIndex } from './naver-index-protection.mjs';

const baselinePath = 'config/naver-index-baseline.json';
let previous = [];
try {
  previous = JSON.parse(readFileSync(baselinePath, 'utf8')).urls ?? [];
} catch {}

const current = readSitemapLocs('out');
const urls = mergeProtectedIndex(previous, current);
mkdirSync('config', { recursive: true });
writeFileSync(baselinePath, JSON.stringify({
  version: 1,
  policy: 'append-only: a protected URL may not disappear from the sitemap',
  capturedAt: new Date().toISOString(),
  urls,
}, null, 2) + '\n', 'utf8');

console.log(`NEO index baseline: ${previous.length} -> ${urls.length} protected URLs (never removes existing entries)`);
