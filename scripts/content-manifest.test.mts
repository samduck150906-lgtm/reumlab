import test from 'node:test';
import assert from 'node:assert/strict';
import { contentFingerprint, syncSitemapIndexLastmod } from './content-manifest.mjs';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const page = (body: string, build = 'a') => `<html><head><title>설계 안내</title><meta name="description" content="검수 기준"><link rel="canonical" href="https://reumlab.com/guide/"><script src="/_next/${build}.js"></script></head><body><nav>메뉴 ${build}</nav><main>${body}<script>window.build="${build}"</script></main><footer>${build}</footer></body></html>`;
test('build assets and shared chrome do not refresh editorial lastmod', () => {
  assert.equal(contentFingerprint(page('<h1>검수</h1><p>권한을 확인합니다.</p>', 'a')), contentFingerprint(page('<h1>검수</h1><p>권한을 확인합니다.</p>', 'b')));
});
test('content and destination changes refresh editorial lastmod', () => {
  const original=contentFingerprint(page('<p>권한을 확인합니다.</p><a href="/cost/">비용</a>'));
  assert.notEqual(original,contentFingerprint(page('<p>환불 권한을 확인합니다.</p><a href="/cost/">비용</a>')));
  assert.notEqual(original,contentFingerprint(page('<p>권한을 확인합니다.</p><a href="/app/">비용</a>')));
});

test('final child dates replace stale sitemap-index dates and remain stable on repeat', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reumlab-sitemap-dates-'));
  try {
    const index = '<sitemapindex><sitemap><loc>https://reumlab.com/sitemap-cost.xml</loc><lastmod>2026-08-17T14:11:20.000Z</lastmod></sitemap><sitemap><loc>https://reumlab.com/sitemap-pages.xml</loc></sitemap></sitemapindex>';
    writeFileSync(join(dir, 'sitemap.xml'), index);
    writeFileSync(join(dir, 'sitemap-cost.xml'), '<urlset><url><loc>https://reumlab.com/cost/academy/</loc><lastmod>2026-10-20T05:43:05.510Z</lastmod></url><url><loc>https://reumlab.com/cost/hospital/</loc><lastmod>2026-09-01T00:00:00.000Z</lastmod></url></urlset>');
    writeFileSync(join(dir, 'sitemap-pages.xml'), '<urlset><url><loc>https://reumlab.com/</loc><lastmod>2026-10-19T10:00:00.000Z</lastmod></url></urlset>');
    syncSitemapIndexLastmod(dir);
    const first = readFileSync(join(dir, 'sitemap.xml'), 'utf8');
    assert.ok(!first.includes('2026-08-17'));
    assert.match(first, /sitemap-cost\.xml<\/loc><lastmod>2026-10-20T05:43:05\.510Z<\/lastmod>/);
    assert.match(first, /sitemap-pages\.xml<\/loc><lastmod>2026-10-19T10:00:00\.000Z<\/lastmod>/);
    syncSitemapIndexLastmod(dir);
    assert.equal(readFileSync(join(dir, 'sitemap.xml'), 'utf8'), first);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
