import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { parse } from 'node-html-parser';

test('every canonical sitemap URL, including the separate agency sitemap, is reachable from home through indexable HTML links', () => {
  const out = path.resolve('out');
  const graph = new Map<string, string[]>();
  const indexable = new Set<string>();
  const normalize = (url: string) => {
    const pathname = decodeURIComponent(new URL(url, 'https://reumlab.com').pathname);
    return pathname.endsWith('/') ? pathname : pathname + '/';
  };
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(file); continue; }
      if (entry.name !== 'index.html') continue;
      const route = '/' + path.relative(out, file).replaceAll('\\', '/').slice(0, -10);
      const doc = parse(readFileSync(file, 'utf8'));
      const links = doc.querySelectorAll('a[href]')
        .filter(n => !/\bnofollow\b/i.test(n.getAttribute('rel') ?? ''))
        .map(n => n.getAttribute('href')!)
        .map(h => new URL(h, 'https://reumlab.com' + route))
        .filter(url => url.origin === 'https://reumlab.com')
        .map(url => normalize(url.href));
      graph.set(route, links);
      const canonicals = doc.querySelectorAll('link[rel="canonical"]');
      const selfCanonical = canonicals.length === 1 &&
        new URL(canonicals[0].getAttribute('href')!).origin === 'https://reumlab.com' &&
        normalize(canonicals[0].getAttribute('href')!) === route;
      if (selfCanonical && !doc.querySelectorAll('meta[name="robots"],meta[name="googlebot"],meta[name="yeti"]')
        .some(n => /noindex|nofollow|none/i.test(n.getAttribute('content') ?? ''))) indexable.add(route);
    }
  }
  walk(out);
  const urls = new Set<string>();
  // Fail if any independently registered root disappears, even if globbing still finds other files.
  for (const root of ['sitemap.xml', 'sitemap-development-agency.xml', 'sitemap-answers.xml']) {
    assert.ok(readFileSync(path.join(out, root), 'utf8').includes('<loc>'), root);
  }
  for (const file of readdirSync(out).filter(f => /^sitemap.*\.xml$/.test(f))) {
    const xml = readFileSync(path.join(out, file), 'utf8');
    if (xml.includes('<urlset')) for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  assert.ok(urls.size > 0, 'must inspect generated sitemap content');
  // Independent captured baselines prevent a deleted sitemap/URL from shrinking the tested set.
  for (const filename of ['naver-index-baseline.json', 'development-agency-index-baseline.json']) {
    const baseline = JSON.parse(readFileSync(path.resolve('config', filename), 'utf8'));
    for (const url of baseline.urls) assert.ok(urls.has(url), `protected URL missing: ${url}`);
  }
  assert.ok(indexable.has('/'), 'home must be self-canonical, indexable and followable');
  const reached = new Set(['/']);
  const queue = ['/'];
  for (let i = 0; i < queue.length; i++) {
    for (const route of graph.get(queue[i]) ?? []) {
      if (reached.has(route) || !indexable.has(route)) continue;
      reached.add(route); queue.push(route);
    }
  }
  const missing = [...urls].filter(url => !reached.has(normalize(url)));
  assert.equal(missing.length, 0, `${missing.length} sitemap URLs lack an indexable path from home: ${missing.slice(0, 3).join(', ')}`);
});
