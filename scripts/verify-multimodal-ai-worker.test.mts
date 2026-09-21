import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sitemap from '../app/sitemap';
import { WORKER_CARDS, WORKERS } from '../lib/ai-worker';
import { guidesForService } from '../lib/content-cluster';
import { MULTIMODAL_CANONICAL, MULTIMODAL_PRODUCTS, MULTIMODAL_FAQS } from '../lib/multimodal-ai-worker';
import { MULTIMODAL_LLMS_PAGE } from '../lib/llms-service-pages';
import { verifyMultimodalArtifacts } from './verify-multimodal-ai-worker.mjs';

test('부모·사이트맵·가이드·LLM 인덱스가 새 하위 서비스를 정확히 한 번 연결한다', () => {
  assert.equal(WORKER_CARDS.filter((card) => card.href === '/ai-worker/multimodal/').length, 1);
  assert.deepEqual(WORKERS.map((worker) => worker.slug), ['office', 'sales', 'document']);
  assert.equal(sitemap().filter((item) => item.url === MULTIMODAL_CANONICAL).length, 1);
  assert.ok(guidesForService('/ai-worker/multimodal/').length >= 3);
  assert.equal(MULTIMODAL_LLMS_PAGE[0], 'ai-worker/multimodal');
  assert.match(MULTIMODAL_LLMS_PAGE[2], /영상·사진·음성·문서/);

  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['seo:verify:multimodal-ai-worker'], 'node scripts/verify-multimodal-ai-worker.mjs');
  assert.match(pkg.scripts.build, /seo:verify:multimodal-ai-worker/);
});

test('빌드 산출물 검증기는 정상 계약을 통과시키고 누락을 오류로 보고한다', () => {
  const root = mkdtempSync(join(tmpdir(), 'reumlab-multimodal-'));
  try {
    const route = join(root, 'ai-worker', 'multimodal');
    mkdirSync(route, { recursive: true });
    const productMarkers = Array.from({ length: MULTIMODAL_PRODUCTS.length }, () => '<article data-multimodal-product></article>').join('');
    const faqMarkers = Array.from({ length: MULTIMODAL_FAQS.length }, () => '<details data-multimodal-faq></details>').join('');
    writeFileSync(join(route, 'index.html'), `<!doctype html><html><head><title>멀티모달 AI Worker 개발 | 영상·음성·현장 업무 자동화 | 름랩</title><meta name="description" content="영상·사진·음성·문서를 이해하고 검수·견적·상담 분석부터 ERP·CRM 업무까지 연결하는 맞춤형 멀티모달 AI Worker를 구축합니다."><meta name="robots" content="index,follow"><link rel="canonical" href="${MULTIMODAL_CANONICAL}"><script type="application/ld+json">{"@graph":[{"@type":"Service"},{"@type":"FAQPage"}]}</script></head><body><h1>보고 듣고 판단하고, 업무까지 처리하는 AI</h1><input name="유입_랜딩" value="/ai-worker/multimodal/">${productMarkers}${faqMarkers}</body></html>`);
    mkdirSync(join(root, 'ai-worker'), { recursive: true });
    writeFileSync(join(root, 'ai-worker', 'index.html'), '<a href="/ai-worker/multimodal/">멀티모달</a>');
    writeFileSync(join(root, 'sitemap-services.xml'), `<url><loc>${MULTIMODAL_CANONICAL}</loc></url>`);
    writeFileSync(join(root, 'llms.txt'), `[멀티모달 AI Worker](${MULTIMODAL_CANONICAL})`);

    assert.deepEqual(verifyMultimodalArtifacts(root), []);
    writeFileSync(join(root, 'llms.txt'), 'missing');
    assert.ok(verifyMultimodalArtifacts(root).some((error) => error.includes('llms.txt')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
