import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const root = process.argv[2] ?? 'out';
const records = JSON.parse(fs.readFileSync('content/public-page-review.json', 'utf8'));
const normalized = text => text.replace(/\s+/g, '').normalize('NFC');
const cache = new Map();
function documentFor(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (!cache.has(decoded)) {
    const filename = path.join(root, decoded.slice(1), 'index.html');
    if (!fs.existsSync(filename)) throw new Error('Missing public page: ' + decoded);
    cache.set(decoded, parse(fs.readFileSync(filename, 'utf8')));
  }
  return cache.get(decoded);
}
const results = [];
for (const [pathname, record] of Object.entries(records)) {
  const doc = documentFor(pathname);
  const sections = doc.querySelectorAll('section.public-page-review');
  if (sections.length !== 1) throw new Error('Review count ' + sections.length + ' on ' + pathname);
  const section = sections[0];
  if (normalized(section.querySelector('h2')?.textContent ?? '') !== normalized(record.heading)) {
    throw new Error('Missing review title on ' + pathname);
  }
  const text = normalized(section.textContent);
  for (const row of record.rows) {
    if (!text.includes(normalized(row.check)) || !text.includes(normalized(row.basis))) {
      throw new Error('Missing procedure or evidence on ' + pathname);
    }
    const source = new URL(row.href || pathname, 'https://reumlab.com' + pathname);
    const sourceDoc = documentFor(source.pathname);
    const original = parse((sourceDoc.querySelector('main') ?? sourceDoc.querySelector('body')).innerHTML);
    original.querySelectorAll('.public-page-review,script,style,nav,footer').forEach(node => node.remove());
    if (!normalized(original.textContent).includes(normalized(row.basis))) {
      throw new Error('Quoted basis absent outside new review on ' + pathname + ': ' + row.basis);
    }
  }
  for (const link of section.querySelectorAll('a[href]')) {
    const target = new URL(link.getAttribute('href'), 'https://reumlab.com' + pathname);
    const linked = documentFor(target.pathname);
    if (target.hash && !linked.querySelectorAll('[id]').some(node => node.id === decodeURIComponent(target.hash.slice(1)))) {
      throw new Error('Missing anchor ' + target.href + ' on ' + pathname);
    }
  }
  results.push({ path: pathname, rendered: true, rows: record.rows.length, source_facts_verified: true, links_verified: true });
}
if (results.length !== 2842) throw new Error('Unexpected scope count: ' + results.length);
fs.mkdirSync('docs/search-audit', { recursive: true });
fs.writeFileSync('docs/search-audit/remaining-public-review-verification.json', JSON.stringify({
  checked_at: new Date().toISOString(),
  page_count: results.length,
  source_facts: results.reduce((sum, row) => sum + row.rows, 0),
  scope: 'Rendered content, exact public source support and link destinations for every selected URL.',
  rows: results,
}, null, 2) + '\n');
console.log('Public-page review verified on ' + results.length + ' pages');
