import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

import { buildLandingMeta, withObjectParticle } from '../lib/search-intent';

test('목적격 조사는 받침에 맞춰 을/를을 고른다', () => {
  assert.equal(withObjectParticle('앱 개발 외주'), '앱 개발 외주를');
  assert.equal(withObjectParticle('쇼핑몰 제작'), '쇼핑몰 제작을');
  assert.equal(withObjectParticle('웹사이트'), '웹사이트를');
});

test('업종 랜딩 설명에 "외주을" 같은 조사 오류가 없다', () => {
  const { description } = buildLandingMeta({ keyword: '카페 앱개발외주', serviceKo: '앱 개발 외주', svcType: 'app', industryKo: '카페', slug: 'cafe-app-dev-out' });
  assert.match(description, /카페 앱 개발 외주를 기획부터/);
  assert.doesNotMatch(description, /외주을/);
});

// 빌드 산출물 검사 — out/ 이 있을 때만(다른 테스트와 같은 방식).
const HUB_DIR = new URL('../out/h/', import.meta.url);
test('허브 카드는 같은 목적지 URL을 한 번만 가리키고, 원본 스텁 설명을 노출하지 않는다', { skip: !existsSync(HUB_DIR) }, () => {
  for (const slug of readdirSync(HUB_DIR)) {
    const file = new URL(`${slug}/index.html`, HUB_DIR);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8').split('<script')[0];
    const grid = html.split('관련 견적·상담 페이지')[1]?.split('</section>')[0] ?? '';
    const hrefs = [...grid.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(hrefs).size, hrefs.length, `/h/${slug}/: 같은 URL을 가리키는 카드가 중복된다`);
    assert.doesNotMatch(grid, /문의하세요\. [^<]* - 름랩\./, `/h/${slug}/: landings.json 스텁 설명이 노출된다`);
  }
});
