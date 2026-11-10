/** Exhaustive static HTML inventory. Reports facts; never claims content or search-engine completion. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { readSitemapLocs } from './read-sitemap.mjs';

const DOMAIN = 'https://reumlab.com';
const slash = s => s.split(sep).join('/');
const normalize = s => {
  const u = new URL(s, DOMAIN);
  u.pathname = u.pathname.split('/').map(p => encodeURIComponent(decodeURIComponent(p))).join('/');
  u.hash = '';
  return u.href;
};
function walk(dir, base = dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, base, files);
    else if (entry.isFile()) files.push(slash(relative(base, path)));
  }
  return files;
}
export function auditStaticSite(outputDirectory) {
  const root = resolve(outputDirectory);
  const files = walk(root);
  const available = new Set(files);
  const sitemap = new Set(readSitemapLocs(root).map(normalize));
  const rows = [];
  for (const file of files.filter(f => f.endsWith('.html'))) {
    const html = readFileSync(join(root, file), 'utf8');
    const doc = parse(html);
    const url = normalize(DOMAIN + '/' + (file.endsWith('index.html') ? file.slice(0, -10) : file));
    const body = doc.querySelector('main') ?? doc.querySelector('article') ?? doc.querySelector('body');
    const schemas = [];
    const schemaErrors = [];
    for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try { schemas.push(JSON.parse(script.textContent)); }
      catch (e) { schemaErrors.push(e.message); }
    }
    const links = [];
    const brokenLinks = [];
    for (const a of doc.querySelectorAll('a[href]')) {
      const raw = a.getAttribute('href');
      let target;
      try { target = new URL(raw, url); } catch { brokenLinks.push(raw); continue; }
      if (target.origin !== DOMAIN) continue;
      const pathname = decodeURIComponent(target.pathname).replace(/^\//, '');
      // Resolve real links only; do not generate query variants or request private endpoints.
      const candidate = resolve(root, pathname);
      if (candidate !== root && !candidate.startsWith(root + sep)) { brokenLinks.push(raw); continue; }
      const present = available.has(pathname) || available.has(pathname.replace(/\/$/, '') + '/index.html') || (pathname === '' && available.has('index.html'));
      links.push(normalize(target.href));
      if (!present) brokenLinks.push(raw);
    }
    const title = doc.querySelector('title')?.textContent.trim() ?? '';
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    const redirect = doc.querySelector('meta[http-equiv="refresh"]')?.getAttribute('content') ?? null;
    const h1 = doc.querySelectorAll('h1').map(x => x.textContent.trim());
    const issues = [];
    if (sitemap.has(url)) {
      if (!title) issues.push('missing_title');
      if (!description) issues.push('missing_description');
      if (h1.length !== 1) issues.push('h1_count_' + h1.length);
      if (!canonical || normalize(canonical) !== url) issues.push('canonical_mismatch');
      if (robots.toLowerCase().includes('noindex')) issues.push('sitemap_noindex');
      if (redirect) issues.push('sitemap_redirect_stub');
      if (schemaErrors.length) issues.push('invalid_jsonld');
      if (brokenLinks.length) issues.push('broken_internal_link');
    }
    rows.push({ url, file, in_sitemap: sitemap.has(url), title, description, h1, canonical, robots, redirect, html_sha256: createHash('sha256').update(html).digest('hex'), body_chars: body?.textContent.length ?? 0, headings: doc.querySelectorAll('h2,h3').map(x => x.textContent.trim()), schema_count: schemas.length, schema_errors: schemaErrors, links: [...new Set(links)], broken_links: [...new Set(brokenLinks)], issues });
  }
  const normalizedPages = new Set(rows.map(r => r.url));
  const missingSitemapPages = [...sitemap].filter(u => !normalizedPages.has(u));
  const incoming = new Map();
  for (const row of rows) for (const u of row.links) if (u !== row.url) incoming.set(u, (incoming.get(u) ?? 0) + 1);
  for (const row of rows) row.incoming_link_count = incoming.get(row.url) ?? 0;
  return {
    checked_at: new Date().toISOString(),
    summary: { html_routes: rows.length, sitemap_urls: sitemap.size, missing_sitemap_pages: missingSitemapPages, sitemap_pages_with_issues: rows.filter(r => r.in_sitemap && r.issues.length).length, sitemap_orphans: rows.filter(r => r.in_sitemap && !r.incoming_link_count && r.url !== DOMAIN + '/').map(r => r.url), noindex_routes: rows.filter(r => /noindex/i.test(r.robots)).length, redirect_stubs: rows.filter(r => r.redirect).length },
    rows,
  };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = auditStaticSite(process.argv[2] ?? 'out');
  const destination = resolve(process.argv[3] ?? 'docs/search-audit/static-inventory.json');
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result.summary, null, 2));
  if (result.summary.missing_sitemap_pages.length || result.summary.sitemap_pages_with_issues) process.exitCode = 1;
}
