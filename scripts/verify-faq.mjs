/**
 * FAQ 품질·구조화 데이터 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:faq
 *   node scripts/verify-faq.mjs [outDir]
 *
 * 검사 항목
 *   1. 한 페이지에 FAQPage 가 두 번 이상 나오는가 (중복 스키마)
 *   2. 스키마의 질문·답변이 화면 HTML 에도 실제로 있는가
 *      — schema 에만 있고 화면에 없는 FAQ 는 정책 위반이다
 *   3. acceptedAnswer.text 에 HTML 태그가 섞여 있는가 (plain text 여야 함)
 *   4. 빈 질문/답변, 너무 짧은 답변
 *   5. 페이지 간 완전 중복 질문 — 같은 질문이 몇 개 페이지에 깔려 있는가
 *   6. answer-first — 답변 첫 문장이 곧바로 답하는가(휴리스틱: 홍보성 도입부 감지)
 *   7. 페이지당 질문 수 분포
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'out';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) files.push(p);
  }
})(OUT);

const LD = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
/** 화면 텍스트만 남긴다(스크립트·스타일 제거) — 스키마 JSON 이 섞이지 않게 */
const visibleText = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** 비교용 정규화 — 공백·구두점 차이를 무시 */
const norm = (s) => String(s).replace(/[\s.,·…"'"'()]/g, '');

/** 홍보성 도입부로 시작하는 답변 감지 (answer-first 위반 휴리스틱) */
const PROMO_LEAD = /^(름랩은|저희는|저희 회사는|디지털|최근|요즘|오늘날|바야흐로|4차 산업)/;

let pagesWithFaq = 0;
let totalQ = 0;
const qCount = new Map();
const perPage = [];

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const url = '/' + relative(OUT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  const vis = visibleText(html);
  let m;
  LD.lastIndex = 0;
  let blocks = 0;
  let items = [];
  while ((m = LD.exec(html))) {
    let d;
    try {
      d = JSON.parse(m[1]);
    } catch {
      continue;
    }
    for (const n of d['@graph'] ?? [d]) {
      if (n['@type'] !== 'FAQPage') continue;
      blocks++;
      items.push(...(n.mainEntity || []));
    }
  }
  if (!blocks) continue;
  pagesWithFaq++;
  if (blocks > 1) add(fail, 'duplicate-schema', `FAQPage ${blocks}개: ${url}`);

  const seenOnPage = new Set();
  for (const q of items) {
    totalQ++;
    const name = q.name || '';
    const text = q.acceptedAnswer?.text || '';
    if (!name.trim()) add(fail, 'empty', `빈 질문: ${url}`);
    if (!text.trim()) add(fail, 'empty', `빈 답변 (${name.slice(0, 30)}): ${url}`);
    if (/<[a-z/][^>]*>/i.test(text) || /<[a-z/][^>]*>/i.test(name)) {
      add(fail, 'html', `스키마 답변에 HTML 태그: ${url} — ${name.slice(0, 30)}`);
    }
    if (text.trim() && text.replace(/\s/g, '').length < 25) {
      add(warn, 'short', `답변이 25자 미만: ${url} — ${name.slice(0, 30)}`);
    }
    // 화면에 실제로 있는가
    if (name.trim() && !norm(vis).includes(norm(name))) {
      add(fail, 'hidden', `스키마 질문이 화면에 없음: ${url} — ${name.slice(0, 40)}`);
    }
    if (text.trim() && !norm(vis).includes(norm(text))) {
      add(fail, 'hidden', `스키마 답변이 화면에 없음: ${url} — ${name.slice(0, 40)}`);
    }
    if (PROMO_LEAD.test(text.trim())) {
      add(warn, 'answer-first', `답변이 홍보성 도입부로 시작: ${url} — ${name.slice(0, 30)}`);
    }
    if (seenOnPage.has(name)) add(fail, 'duplicate', `같은 페이지에 같은 질문 2번: ${url} — ${name.slice(0, 30)}`);
    seenOnPage.add(name);
    qCount.set(name, (qCount.get(name) || 0) + 1);
  }
  perPage.push({ url, n: items.length });
}

const dupQ = [...qCount].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
const spread = dupQ.filter(([, c]) => c >= 20);

console.log(`FAQPage 보유 페이지 ${pagesWithFaq} / HTML ${files.length}`);
console.log(`총 질문 ${totalQ} · 고유 질문 ${qCount.size}`);
console.log(`페이지당 질문 수  최소 ${Math.min(...perPage.map((p) => p.n))} / 평균 ${(perPage.reduce((a, b) => a + b.n, 0) / perPage.length).toFixed(1)} / 최대 ${Math.max(...perPage.map((p) => p.n))}`);
console.log(`\n여러 페이지에 반복되는 질문 ${dupQ.length}종 (20개 페이지 이상 반복: ${spread.length}종)`);
dupQ.slice(0, 8).forEach(([q, c]) => console.log(`  ${String(c).padStart(4)}회  ${q.slice(0, 56)}`));

console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 12).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 25).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ FAQ 검증 통과 — 화면/스키마 불일치·중복 스키마·HTML 혼입 없음');
