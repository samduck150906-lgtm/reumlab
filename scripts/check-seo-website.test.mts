import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { checkSeoWebsite, SEO_WEBSITE_EXPECTED } from './check-seo-website.mjs';

async function fixture(overrides: Record<string, string> = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'reumlab-seo-site-'));
  const sitemap: string[] = [];
  for (const page of SEO_WEBSITE_EXPECTED) {
    const canonical = `https://reumlab.com${page.path}`;
    sitemap.push(`<url><loc>${canonical}</loc></url>`);
    const form = page.form
      ? '<form name="main-apply"><input name="service_key" value="seo_website"><input name="industry"><input name="site_status"><input name="current_site_url"><input name="service_region"><input name="interest_scope"><input name="source_landing"><input name="current_page"><input name="cta_location"></form>'
      : '';
    const html = overrides[page.path] ?? `<!doctype html><html><head><title>${page.title}</title><link rel="canonical" href="${canonical}"></head><body><h1>${page.h1}</h1><p>${page.marker}</p><a href="/seo-website/">서비스 보기</a>${form}<script type="application/ld+json">{"@context":"https://schema.org","@type":"${page.schemaType}"}</script></body></html>`;
    const target = path.join(root, page.path, 'index.html');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
  }
  await writeFile(path.join(root, 'sitemap.xml'), `<urlset>${sitemap.join('')}</urlset>`, 'utf8');
  return root;
}

test('accepts a complete static export contract', async () => {
  const result = await checkSeoWebsite(await fixture());
  assert.equal(result.issues.length, 0, result.issues.join('\n'));
  assert.equal(result.checked, SEO_WEBSITE_EXPECTED.length);
});

test('reports canonical, noindex, form and service-link regressions together', async () => {
  const root = await fixture({
    '/seo-website/': '<html><head><title>wrong</title><meta name="robots" content="noindex"><link rel="canonical" href="https://example.com/"></head><body><h1>A</h1><h1>B</h1></body></html>',
  });
  const result = await checkSeoWebsite(root);
  const joined = result.issues.join('\n');
  assert.match(joined, /canonical/);
  assert.match(joined, /noindex/);
  assert.match(joined, /H1/);
  assert.match(joined, /main-apply/);
  assert.match(joined, /service link/);
});
