import assert from 'node:assert/strict';
import test from 'node:test';

import { PACKAGES, manwonText } from '../lib/pricing';
import { WEBSITE_INDUSTRIES, buildWebsiteContent, websiteDecision } from '../lib/website-industries';

// 업종 홈페이지(/website/<업종>/) 본문은 업종명을 템플릿에 끼워 넣어 만든다.
// 2026-10 점검에서 다음 결함이 294개 페이지 전체에 반복 노출돼 있었다.
//   · '{업종}제작'·'{업종}업체'·'{업종}마케팅'·'{업종}창업' 같은 붙임 키워드("안과제작는", "안과업체 교체 없이")
//   · 받침 있는 말 뒤 '를'("오시는 길 확인를", "레벨테스트 예약를")
//   · 접미어 중복("영상제작업체업체", "MCN회사 회사 소개")
//   · 마침표 없이 이어 붙은 문장("확인합니다 그래서")
// 검색엔진이 반복·자동 생성 문구로 읽을 수 있는 패턴이라 생성기 단계에서 막는다.

const GLUED_SUFFIXES = ['제작', '업체', '마케팅', '창업', '홈페이지', '상담', '예약'];

function hasBatchim(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
}

function allText(slug: string): string {
  const d = WEBSITE_INDUSTRIES.find((x) => x.slug === slug)!;
  const c = buildWebsiteContent(d);
  return [c.intro, c.why, ...c.features, ...c.journey, ...c.scope, c.pitfalls, c.searchLine, c.scenario, c.priceLine, c.cta, ...c.faqs.flatMap((f) => [f.q, f.a])].join('\n');
}

test('업종 홈페이지 본문에 업종명 붙임 키워드가 없다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    const text = allText(d.slug);
    for (const sfx of GLUED_SUFFIXES) {
      // 업종명 자체가 접미어로 끝나는 경우(예: "청소업체", "영상제작업체")는 업종명 그대로 쓰는 것이므로
      // 업종명 뒤에 같은 접미어가 한 번 더 붙은 경우만 본다.
      const glued = `${d.ko}${sfx}`;
      assert.ok(!text.includes(glued), `${d.slug}: '${glued}' 붙임 표기가 남아 있다`);
    }
  }
});

test('받침 있는 말 뒤에 목적격 조사 "를"이 붙지 않는다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    const text = allText(d.slug);
    for (const m of text.matchAll(/([가-힣])를(?=[\s.,·)]|$)/g)) {
      assert.ok(!hasBatchim(m[1]), `${d.slug}: '${m[1]}를' 조사 오류 — ${text.slice(Math.max(0, m.index! - 20), m.index! + 10)}`);
    }
  }
});

test('업종명과 페이지 항목 사이에 같은 말이 겹치지 않는다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    const text = allText(d.slug);
    assert.doesNotMatch(text, /(업체|회사|홈페이지)\s?\1/, `${d.slug}: 접미어 중복`);
  }
});

test('문장이 마침표 없이 다음 문장과 이어 붙지 않는다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    assert.doesNotMatch(allText(d.slug), /니다\s+(그래서|그만큼|름랩은)/, `${d.slug}: 마침표 누락`);
  }
});

test('검색 순위·노출을 보장하는 표현을 쓰지 않는다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    assert.doesNotMatch(allText(d.slug), /검색에 (잘 나오게|잡히도록 만듭니다)|상위\s*노출|노출\s*보장/, d.slug);
  }
});

test('업종 홈페이지 가격 문구는 가격 단일 출처(lib/pricing.ts)와 일치한다', () => {
  const starter = PACKAGES.find((p) => p.name === '웹 스타터')!;
  const business = PACKAGES.find((p) => p.name === '웹 비즈니스')!;
  for (const d of WEBSITE_INDUSTRIES) {
    const c = buildWebsiteContent(d);
    assert.ok(c.priceLine.includes(manwonText(starter.price)), d.slug);
    assert.ok(c.priceLine.includes(manwonText(business.price)), d.slug);
    assert.ok(c.faqs[0].a.includes(manwonText(starter.price)), d.slug);
  }
});

test('FAQ 질문은 업종명과 "홈페이지"를 띄어 쓴 자연스러운 질문이다', () => {
  for (const d of WEBSITE_INDUSTRIES) {
    const c = buildWebsiteContent(d);
    assert.ok(c.faqs[0].q.startsWith(`${d.ko} 홈페이지`), `${d.slug}: ${c.faqs[0].q}`);
  }
});

test('문구 정비 후에도 기존 색인 대상 업종 페이지는 모두 색인 대상으로 남는다', () => {
  const dropped = WEBSITE_INDUSTRIES.filter((d) => !websiteDecision(d.slug)?.shouldIndex).map((d) => d.slug);
  assert.deepEqual(dropped, []);
});

test('검색결과 설명에는 앞 문장에 기대는 문장이 실리지 않는다', async () => {
  const { websiteDescription } = await import('../lib/website-industries');
  for (const d of WEBSITE_INDUSTRIES) {
    const desc = websiteDescription(d);
    assert.doesNotMatch(desc, /그 시간|이 동선|\. (그래서|그만큼|대신) /, `${d.slug}: ${desc}`);
  }
});
