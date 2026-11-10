import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import test from 'node:test';
import { auditStaticSite } from './audit-static-site.mjs';

test('static inventory includes sitemap omissions, noindex targets and real broken links', () => {
  const root = mkdtempSync(join(tmpdir(), 'reumlab-static-'));
  try {
    mkdirSync(join(root, 'example'), { recursive: true });
    writeFileSync(join(root, 'index.html'), '<html><title>Home</title><body><a href="/example/">Example</a></body></html>');
    writeFileSync(join(root, 'example/index.html'), '<html><title>Example</title><meta name="description" content="Details"><meta name="robots" content="noindex"><link rel="canonical" href="https://reumlab.com/example/"><body><main><h1>Example</h1><a href="/missing/">Missing</a><a href="/#contact">Home</a></main></body></html>');
    writeFileSync(join(root, 'sitemap.xml'), '<urlset><url><loc>https://reumlab.com/example/</loc></url><url><loc>https://reumlab.com/not-built/</loc></url></urlset>');
    const result = auditStaticSite(root);
    assert.equal(result.summary.html_routes, 2);
    assert.deepEqual(result.summary.missing_sitemap_pages, ['https://reumlab.com/not-built/']);
    const example = result.rows.find(r => r.file === 'example/index.html');
    assert.deepEqual(example.broken_links, ['/missing/']);
    assert.ok(example.issues.includes('sitemap_noindex'));
    assert.equal(example.incoming_link_count, 1);
    assert.equal(result.summary.sitemap_orphans.length, 0);
  } finally {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    rmSync(root, { recursive: true, force: true });
  }
});
