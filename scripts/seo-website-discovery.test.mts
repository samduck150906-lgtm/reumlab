import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import sitemap from '../app/sitemap.ts';
import BusinessFooter from '../components/BusinessFooter.tsx';
import { RELATED_LINKS } from '../lib/ai-search-architecture.ts';
import { SITE } from '../lib/seo.ts';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const expectedPaths = [
  '/seo-website/',
  '/seo-website/regional/',
  '/seo-website/cost/',
  '/seo-website/staffing/',
  '/seo-website/guides/search-registration/',
  '/seo-website/guides/seo-checklist/',
] as const;

test('all SEO website pages are present exactly once in the sitemap', () => {
  const urls = sitemap().map((item) => item.url);
  for (const path of expectedPaths) {
    assert.equal(urls.filter((url) => url === `${SITE.domain}${path}`).length, 1, path);
  }
});

test('the shared service menu and business footer expose the service hub', async () => {
  const menu = JSON.parse(await readFile(new URL('../content/service-menu.json', import.meta.url), 'utf8'));
  assert.equal(menu.items.filter((item: { slug: string }) => item.slug === 'seo-website').length, 1);

  const footer = renderToStaticMarkup(React.createElement(BusinessFooter));
  assert.match(footer, /href="\/seo-website\/?"/);
  assert.match(footer, /검색 잘되는 홈페이지/);
});

test('homepage and adjacent service pages provide a crawlable discovery path', async () => {
  const files = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../app/website/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../app/geo-website/page.tsx', import.meta.url), 'utf8'),
  ]);
  for (const source of files) assert.match(source, /\/seo-website\//);
  assert.equal(RELATED_LINKS.some((link) => link.href === '/seo-website/'), true);
});
