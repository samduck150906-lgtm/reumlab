import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sitemap from '../app/sitemap';
import { guidesForService } from '../lib/content-cluster';
import { ENTERNAL_CANONICAL } from '../lib/enternal-ai';
import { ENTERNAL_LLMS_PAGE } from '../lib/llms-service-pages';
import { RELATED_LINKS as ENTERPRISE_LINKS } from '../lib/enterprise-ai';
import { RELATED_LINKS as WORKER_LINKS } from '../lib/ai-worker';
import { verifyEnternalArtifacts } from './verify-enternal-ai.mjs';

test('사이트맵·가이드·LLM 인덱스와 기존 AI 서비스가 Enternal canonical을 한 번 연결한다', () => {
  assert.equal(sitemap().filter((item) => item.url === ENTERNAL_CANONICAL).length, 1);
  assert.ok(guidesForService('/enternal-ai/').length >= 3);
  assert.equal(ENTERNAL_LLMS_PAGE[0], 'enternal-ai');
  assert.match(ENTERNAL_LLMS_PAGE[2], /PoC/);
  assert.match(ENTERNAL_LLMS_PAGE[2], /목표/);
  assert.equal(ENTERPRISE_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);
  assert.equal(WORKER_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);

  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['seo:verify:enternal-ai'], 'node scripts/verify-enternal-ai.mjs');
  assert.match(pkg.scripts.build, /seo:verify:enternal-ai/);
});

test('빌드 산출물 검증기는 완전한 계약만 통과시키고 로고·스키마·제품 단계 누락을 보고한다', () => {
  const root = mkdtempSync(join(tmpdir(), 'reumlab-enternal-'));
  const route = join(root, 'enternal-ai');
  const logoFile = join(route, 'enternal-ai-logo.png');
  const schema = '{"@graph":[{"@type":"WebPage"},{"@type":"Service"},{"@type":"BreadcrumbList"},{"@type":"FAQPage"}]}';
  const flowMarkers = Array.from({ length: 5 }, () => '<li data-enternal-flow></li>').join('');
  const comparisonMarkers = Array.from({ length: 6 }, () => '<article data-enternal-comparison></article>').join('');
  const faqMarkers = Array.from({ length: 10 }, () => '<details data-enternal-faq></details>').join('');
  const validHtml = `<!doctype html><html><head><title>Enternal AI | 기업용 Private AI·사내 AI PoC | 름랩</title><meta name="description" content="기업 데이터를 고객 환경 안에서 활용하는 Private AI를 목표로 개발합니다. 로컬 추론·사내 문서 연결·자체 사전학습 기반의 적용 범위를 기업별 PoC로 검증합니다."><meta name="robots" content="index,follow"><link rel="canonical" href="${ENTERNAL_CANONICAL}"><script type="application/ld+json">${schema}</script></head><body><h1>기업의 데이터는 기업 안에. Enternal AI</h1><p>현재 제공</p><p>PoC 검증</p><p>개발 방향</p><p>목표 구조</p><input name="유입_랜딩" value="/enternal-ai/">${flowMarkers}${comparisonMarkers}${faqMarkers}</body></html>`;

  function writeLogo() {
    const png = Buffer.alloc(24);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
    png.writeUInt32BE(13, 8);
    png.write('IHDR', 12, 4, 'ascii');
    png.writeUInt32BE(2172, 16);
    png.writeUInt32BE(724, 20);
    writeFileSync(logoFile, png);
  }

  try {
    mkdirSync(route, { recursive: true });
    mkdirSync(join(root, 'enterprise-ai'), { recursive: true });
    mkdirSync(join(root, 'ai-worker'), { recursive: true });
    writeFileSync(join(route, 'index.html'), validHtml);
    writeLogo();
    writeFileSync(join(root, 'enterprise-ai', 'index.html'), '<a href="/enternal-ai/">Enternal AI</a>');
    writeFileSync(join(root, 'ai-worker', 'index.html'), '<a href="/enternal-ai/">Enternal AI</a>');
    writeFileSync(join(root, 'sitemap-services.xml'), `<url><loc>${ENTERNAL_CANONICAL}</loc></url>`);
    writeFileSync(join(root, 'llms.txt'), `[Enternal AI](${ENTERNAL_CANONICAL})`);

    assert.deepEqual(verifyEnternalArtifacts(root), []);

    rmSync(logoFile);
    assert.ok(verifyEnternalArtifacts(root).some((error) => error.includes('logo')));

    writeLogo();
    writeFileSync(join(route, 'index.html'), validHtml.replace('"@type":"FAQPage"', '"@type":"FAQPage"},{"@type":"SoftwareApplication"'));
    assert.ok(verifyEnternalArtifacts(root).some((error) => error.includes('SoftwareApplication')));

    writeFileSync(join(route, 'index.html'), validHtml.replace('<p>개발 방향</p>', ''));
    assert.ok(verifyEnternalArtifacts(root).some((error) => error.includes('개발 방향')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
