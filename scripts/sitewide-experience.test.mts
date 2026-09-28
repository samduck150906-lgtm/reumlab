import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditSitewideExperience } from './sitewide-experience-lib.mjs';

const ORIGIN = 'https://reumlab.com';
const PHONE = '010-8111-9370';
const EMAIL = 'ceo@eternalsix.com';

function html({
  main = true,
  footer = true,
  phone = true,
  email = true,
  h1 = 1,
  links = [],
}: {
  main?: boolean;
  footer?: boolean;
  phone?: boolean;
  email?: boolean;
  h1?: number;
  links?: string[];
} = {}) {
  const headings = Array.from({ length: h1 }, (_, index) => `<h1>제목 ${index + 1}</h1>`).join('');
  const body = `${headings}${links.map((href) => `<a href="${href}">관련 문서</a>`).join('')}`;
  return `<!doctype html><html lang="ko"><body><nav>메뉴</nav>${main ? `<main>${body}</main>` : body}${footer ? `<footer>${phone ? PHONE : ''} ${email ? EMAIL : ''}</footer>` : ''}</body></html>`;
}

function writePage(root: string, pathname: string, body: string) {
  const relative = pathname === '/' ? '' : decodeURIComponent(pathname).replace(/^\//, '').replace(/\/$/, '');
  const dir = join(root, ...relative.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), body, 'utf8');
}

function writeSitemap(root: string, paths: string[]) {
  writeFileSync(
    join(root, 'sitemap.xml'),
    `<?xml version="1.0"?><urlset>${paths.map((pathname) => `<url><loc>${ORIGIN}${pathname}</loc></url>`).join('')}</urlset>`,
    'utf8',
  );
}

test('reports missing landmarks, NAP, H1, protected URLs, portfolio footer, and the orphaned registration guide', () => {
  const root = mkdtempSync(join(tmpdir(), 'reumlab-experience-'));
  try {
    const paths = [
      '/',
      '/missing-main/',
      '/missing-footer/',
      '/missing-nap/',
      '/missing-h1/',
      '/portfolio/example/',
      '/seo-website/guides/search-registration/',
    ];
    writeSitemap(root, paths);
    writePage(root, '/', html());
    writePage(root, '/missing-main/', html({ main: false }));
    writePage(root, '/missing-footer/', html({ footer: false }));
    writePage(root, '/missing-nap/', html({ phone: false, email: false }));
    writePage(root, '/missing-h1/', html({ h1: 0 }));
    writePage(root, '/portfolio/example/', html({ footer: false }));
    writePage(root, '/seo-website/guides/search-registration/', html());

    const result = auditSitewideExperience(root, [
      `${ORIGIN}/`,
      `${ORIGIN}/missing-protected/`,
    ]);

    assert.equal(result.counts.sitemapUrls, 7);
    assert.deepEqual(result.issues.missingMain, ['/missing-main/']);
    assert.deepEqual(result.issues.missingFooter, ['/missing-footer/', '/portfolio/example/']);
    assert.deepEqual(result.issues.missingNap, ['/missing-footer/', '/missing-nap/', '/portfolio/example/']);
    assert.deepEqual(result.issues.invalidH1, ['/missing-h1/']);
    assert.deepEqual(result.issues.missingProtected, [`${ORIGIN}/missing-protected/`]);
    assert.deepEqual(result.issues.portfolioMissingFooter, ['/portfolio/example/']);
    assert.deepEqual(result.issues.orphanSearchGuide, ['/seo-website/guides/search-registration/']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('accepts an encoded sitemap path and a contextual inbound link', () => {
  const root = mkdtempSync(join(tmpdir(), 'reumlab-experience-'));
  try {
    const guide = '/seo-website/guides/search-registration/';
    const korean = '/AI서비스개발/';
    writeSitemap(root, ['/', guide, korean]);
    writePage(root, '/', html({ links: [guide] }));
    writePage(root, guide, html());
    writePage(root, korean, html());

    const result = auditSitewideExperience(root, [`${ORIGIN}/`, `${ORIGIN}${guide}`, `${ORIGIN}${korean}`]);

    assert.equal(result.ok, true);
    assert.equal(result.counts.checkedHtml, 3);
    assert.deepEqual(result.issues.orphanSearchGuide, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

