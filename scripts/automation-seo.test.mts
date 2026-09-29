import assert from 'node:assert/strict';
import test from 'node:test';
import sitemap from '../app/sitemap.ts';
import {
  GENERATED_AUTOMATION_DOMAINS,
  automationCanonical,
  automationDistinctiveBodyParts,
} from '../lib/automation-domains.ts';
import { fingerprint, jaccard } from '../lib/index-quality.ts';

test('공개 자동화 상세 URL만 사이트맵에 정확히 한 번 들어간다', () => {
  const urls = sitemap().map((item) => String(item.url));
  for (const domain of GENERATED_AUTOMATION_DOMAINS) {
    const canonical = automationCanonical(domain);
    assert.equal(urls.filter((url) => url === canonical).length, 1, canonical);
  }
  assert.equal(
    urls.filter((url) => url.startsWith('https://reumlab.com/ai-automation/') && url !== 'https://reumlab.com/ai-automation/').length,
    GENERATED_AUTOMATION_DOMAINS.length,
  );
});

test('공개 페이지끼리 본문 토큰 유사도 70%를 넘지 않는다', () => {
  const pages = GENERATED_AUTOMATION_DOMAINS.map((domain) => ({
    slug: domain.slug,
    fp: fingerprint(automationDistinctiveBodyParts(domain).join(' ')),
  }));
  let highest = { pair: '', score: 0 };
  for (let left = 0; left < pages.length; left += 1) {
    for (let right = left + 1; right < pages.length; right += 1) {
      const score = jaccard(pages[left].fp, pages[right].fp);
      if (score > highest.score) highest = { pair: `${pages[left].slug}/${pages[right].slug}`, score };
    }
  }
  assert.ok(highest.score < 0.7, `${highest.pair}: ${highest.score.toFixed(3)}`);
});

test('검색어 연구 파일은 사이트맵 URL 수를 늘리지 않는다', () => {
  const urls = sitemap().map((item) => String(item.url));
  assert.ok(urls.length < 1_000, `unexpected sitemap growth: ${urls.length}`);
  assert.ok(!urls.some((url) => /\?|keyword|search=/.test(url)));
});
