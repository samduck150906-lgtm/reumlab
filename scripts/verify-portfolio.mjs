/**
 * 개발 사례(포트폴리오) 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:portfolio
 *   node scripts/verify-portfolio.mjs [outDir]
 *
 * 이 검사기의 목적은 두 가지다.
 *  ① 사례 페이지가 검색·AI 가 읽을 수 있는 형태로 나갔는가
 *  ② 같은 프로젝트가 화면마다 다른 사실을 말하고 있지 않은가
 *
 * ②가 특히 중요하다. 실적은 E-E-A-T 신호라, 홈 카드와 상세 페이지와 목적별 랜딩이
 * 같은 프로젝트를 서로 다르게 설명하면 신뢰가 아니라 잡음이 된다.
 *
 * 검사 항목
 *   1. 데이터 무결성 — 필수 필드, id 중복, slug 형식
 *   2. 라우트 — 허브 + 상세 전건이 실제로 생성됐는가
 *   3. metadata — title·description·canonical·OG 존재와 고유성
 *   4. 본문 — 원본 데이터의 문장이 초기 HTML 에 실제로 들어 있는가(JS 없이 읽히는가)
 *   5. 교차 일관성 — 홈 정적 카드·목적별 랜딩 카드가 상세와 같은 제목·범위를 쓰는가
 *   6. 내부링크 — 고아 사례, 깨진 /portfolio/ 링크, 서비스 허브에서의 연결
 *   7. 금지 신호 — Review·AggregateRating 스키마, 근거 없는 성과 수치
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'out';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);
const read = (p) => readFileSync(p, 'utf8');
const text = (html) => {
  const b = (html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  return b.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

// ─── 1. 데이터
const PROJECTS = JSON.parse(read('content/portfolio.json'));
const REQUIRED_DETAIL = ['overview', 'problemDetail', 'structure', 'userFlow', 'operator', 'tech', 'deliverables'];
const ids = new Set();
for (const p of PROJECTS) {
  if (!/^[a-z0-9-]+$/.test(p.id)) add(fail, 'data', `id 가 URL slug 로 부적합: ${p.id}`);
  if (ids.has(p.id)) add(fail, 'data', `중복 id: ${p.id}`);
  ids.add(p.id);
  for (const k of ['title', 'chip', 'problem', 'scope', 'cat']) {
    if (!String(p[k] || '').trim()) add(fail, 'data', `[${p.id}] ${k} 비어 있음`);
  }
  if (!Array.isArray(p.features) || !p.features.length) add(fail, 'data', `[${p.id}] features 없음`);
  for (const k of REQUIRED_DETAIL) {
    const v = p.detail?.[k];
    const empty = Array.isArray(v) ? !v.length : !String(v || '').trim();
    if (empty) add(fail, 'data', `[${p.id}] detail.${k} 비어 있음`);
  }
}

// ─── 2~4. 페이지
const HUB = join(OUT, 'portfolio', 'index.html');
if (!existsSync(HUB)) add(fail, 'route', '/portfolio/ 허브가 생성되지 않았습니다');

const titles = new Map();
const descs = new Map();
let thin = 0;
const hubHtml = existsSync(HUB) ? read(HUB) : '';
const pages = [];

for (const p of PROJECTS) {
  const f = join(OUT, 'portfolio', p.id, 'index.html');
  if (!existsSync(f)) {
    add(fail, 'route', `상세 페이지 없음: /portfolio/${p.id}/`);
    continue;
  }
  const html = read(f);
  const t = text(html);
  pages.push({ p, html, t });

  const title = (html.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, ''])[1];
  const expect = `https://reumlab.com/portfolio/${p.id}/`;

  if (!title) add(fail, 'meta', `title 없음: /portfolio/${p.id}/`);
  if (!desc) add(fail, 'meta', `description 없음: /portfolio/${p.id}/`);
  if (canon !== expect) add(fail, 'meta', `canonical 불일치: /portfolio/${p.id}/ — ${canon || '없음'}`);
  for (const k of ['og:type', 'og:locale', 'og:site_name', 'og:url', 'og:title', 'og:description', 'og:image']) {
    if (!html.includes(`property="${k}"`)) add(fail, 'meta', `${k} 누락: /portfolio/${p.id}/`);
  }
  // §38 — 프로젝트명만으로 된 제목은 검색결과에서 무엇인지 알 수 없다
  if (!/사례/.test(title)) add(warn, 'meta', `title 에 "사례" 표기가 없어 무슨 페이지인지 불분명: ${title}`);

  titles.set(p.id, title);
  descs.set(p.id, desc);

  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) add(fail, 'heading', `H1 ${h1}개: /portfolio/${p.id}/`);

  // 원본 데이터가 실제로 초기 HTML 에 들어갔는가 (JS 없이 읽히는가)
  const mustHave = [
    ['overview', p.detail.overview],
    ['problemDetail', p.detail.problemDetail],
    ...p.features.map((v) => ['features', v]),
    ...p.detail.userFlow.map((v) => ['userFlow', v]),
    ...p.detail.operator.map((v) => ['operator', v]),
    ...p.detail.tech.map((v) => ['tech', v]),
    ...p.detail.deliverables.map((v) => ['deliverables', v]),
  ];
  for (const [field, v] of mustHave) {
    const needle = String(v).replace(/\s+/g, ' ').trim();
    if (!t.includes(needle)) {
      add(fail, 'ssr', `초기 HTML 에 ${field} 값이 없음: /portfolio/${p.id}/ — "${needle.slice(0, 40)}"`);
    }
  }
  if (t.length < 700) {
    thin++;
    add(warn, 'thin', `본문 ${t.length}자: /portfolio/${p.id}/ — 원본에 더 넣을 정보가 있는지 확인 필요`);
  }
}

// 고유성
for (const [label, map] of [['title', titles], ['description', descs]]) {
  const rev = new Map();
  for (const [id, v] of map) {
    if (!v) continue;
    rev.set(v, [...(rev.get(v) || []), id]);
  }
  for (const [v, list] of rev) {
    if (list.length > 1) add(fail, 'dup', `중복 ${label} (${list.join(', ')}): ${v.slice(0, 60)}`);
  }
}

// ─── 5. 교차 일관성 — 같은 프로젝트를 화면마다 다르게 말하고 있지 않은가
const homeHtml = existsSync(join(OUT, 'index.html')) ? read(join(OUT, 'index.html')) : '';
for (const p of PROJECTS) {
  // 홈 정적 카드
  if (homeHtml && homeHtml.includes(`data-id="${p.id}"`)) {
    for (const [field, v] of [['title', p.title], ['problem', p.problem], ['scope', p.scope]]) {
      if (!text(homeHtml).includes(String(v).replace(/\s+/g, ' ').trim())) {
        add(fail, 'sync', `홈 카드의 ${field} 이 데이터와 다름: ${p.id}`);
      }
    }
  }
}
// 목적별 랜딩 카드
for (const slug of ['mvp', 'erp', 'ai-automation', 'platform', 'reservation-commerce', 'website', 'data-seo', 'service-renewal']) {
  const f = join(OUT, slug, 'index.html');
  if (!existsSync(f)) continue;
  const t = text(read(f));
  for (const p of PROJECTS) {
    if (!t.includes(p.title)) continue; // 이 랜딩에 안 실린 사례
    if (!t.includes(String(p.scope).replace(/\s+/g, ' ').trim())) {
      add(fail, 'sync', `/${slug}/ 의 "${p.title}" 담당 범위가 데이터와 다름`);
    }
  }
}

// ─── 6. 내부링크
const allHtml = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const q = join(d, e);
    if (statSync(q).isDirectory()) walk(q);
    else if (e.endsWith('.html')) allHtml.push(q);
  }
})(OUT);

const inbound = new Map();
let broken = 0;
for (const f of allHtml) {
  const html = read(f);
  const body = (html.match(/<body[\s\S]*<\/body>/) || [html])[0];
  const from = '/' + relative(OUT, f).replace(/index\.html$/, '');
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/portfolio\/[^"#?]*)"/g)) {
    const to = m[1];
    if (to === from) continue;
    if (!existsSync(join(OUT, to.replace(/^\//, ''), 'index.html'))) {
      broken++;
      add(fail, 'link', `깨진 포트폴리오 링크: ${to} (출처 ${from})`);
      continue;
    }
    inbound.set(to, (inbound.get(to) || 0) + 1);
  }
}
let orphan = 0;
for (const p of PROJECTS) {
  if (!inbound.get(`/portfolio/${p.id}/`)) {
    orphan++;
    add(fail, 'orphan', `어디에서도 링크되지 않음: /portfolio/${p.id}/`);
  }
}
if (!inbound.get('/portfolio/')) add(fail, 'orphan', '/portfolio/ 허브가 어디에서도 링크되지 않음');

// 서비스 허브 → 사례 연결
const SERVICE_HUBS = ['flutter', 'website', 'mvp', 'erp', 'admin-page-development', 'ai-automation', 'ai-development', 'data-seo'];
const noCases = [];
for (const s of SERVICE_HUBS) {
  const f = join(OUT, s, 'index.html');
  if (!existsSync(f)) continue;
  if (!/<a\b[^>]*href="\/portfolio\//.test(read(f))) noCases.push('/' + s + '/');
}
if (noCases.length) add(warn, 'service', `사례로 연결되지 않는 서비스 허브: ${noCases.join(', ')}`);

// ─── 7. 금지 신호
for (const { p, html, t } of pages) {
  for (const bad of ['"@type":"Review"', '"@type":"AggregateRating"', 'aggregateRating', 'ratingValue']) {
    if (html.includes(bad)) add(fail, 'schema', `검증 불가한 리뷰 스키마 사용(${bad}): /portfolio/${p.id}/`);
  }
  // 원본에 없는 정량 성과를 넣지 않았는지
  const claims = t.match(/\d+\s?(%|배|만 ?명|억|퍼센트)\s*(증가|감소|절감|향상|단축|상승)/g);
  if (claims) add(fail, 'claim', `근거 없는 성과 수치: /portfolio/${p.id}/ — ${[...new Set(claims)].join(', ')}`);
  for (const word of ['업계 1위', '최고의', '수상', '고객 만족도']) {
    if (t.includes(word)) add(warn, 'claim', `확인 불가한 주장 가능성(${word}): /portfolio/${p.id}/`);
  }
}

// ─── 결과
const hubLinks = hubHtml ? new Set([...hubHtml.matchAll(/<a\b[^>]*\shref="(\/portfolio\/[^"#?]+)"/g)].map((m) => m[1])).size : 0;
console.log(`사례 데이터 ${PROJECTS.length}건 · 상세 페이지 ${pages.length} · 허브에서 링크 ${hubLinks}`);
console.log(`metadata  title 중복 0 기준 · canonical·OG 7종 검사`);
console.log(`본문      원본 필드가 초기 HTML 에 없는 경우 ${fail.filter((f) => f.startsWith('[ssr]')).length} · 700자 미만 ${thin}`);
console.log(`일관성    화면 간 사실 불일치 ${fail.filter((f) => f.startsWith('[sync]')).length}`);
console.log(`링크      깨짐 ${broken} · 고아 ${orphan} · 사례 미연결 서비스 허브 ${noCases.length}`);
console.log(`금지신호  Review/AggregateRating ${fail.filter((f) => f.startsWith('[schema]')).length} · 근거 없는 수치 ${fail.filter((f) => f.startsWith('[claim]')).length}`);
console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 10).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 25).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ 포트폴리오 검증 통과 — 라우트·metadata·본문·화면 간 일관성·링크·금지 신호 이상 없음');
