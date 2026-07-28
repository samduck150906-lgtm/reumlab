#!/usr/bin/env node
/**
 * 구글 비즈니스 프로필(GBP) 콘텐츠 자동생성기
 *
 * content/gbp.json(설정) + content/clusters.json(허브) + content/landings.json(랜딩)
 * + content/templates.json(Q&A 풀)을 읽어 GBP 에 그대로 붙여넣을 수 있는
 *   1) 사업 설명(description)
 *   2) 서비스 목록(services)
 *   3) 상품/패키지(products)
 *   4) 소식 포스트(posts) — 각 링크에 utm_content 자동 부여, 매칭 페이지로 연결
 *   5) Q&A(자주 묻는 질문) 시드
 * 를 생성합니다. 결과는 content/gbp/ 에 JSON + 붙여넣기 가이드(MD)로 저장합니다.
 *
 * 특징
 * - 결정적(deterministic): 무작위 없음, 발행일은 gbp.json schedule.start 기준으로 계산 →
 *   재실행해도 동일 결과(불필요한 git diff 방지).
 * - GBP 는 사이트에 서빙되는 자산이 아니므로 build/prebuild 체인에 넣지 않습니다.
 *   수동 실행: `npm run gen:gbp`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const outDir = path.join(contentDir, 'gbp');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf-8'));

const cfg = readJson(path.join(contentDir, 'gbp.json'));
const clusters = readJson(path.join(contentDir, 'clusters.json'));
const landings = readJson(path.join(contentDir, 'landings.json'));
const templates = readJson(path.join(contentDir, 'templates.json'));

const biz = cfg.business;
const base = cfg.website.base.replace(/\/$/, '');

// ── UTM 링크 빌더 ──────────────────────────────────────────────
function utmQuery(extra) {
  const params = new URLSearchParams({ ...cfg.website.utm, ...(extra || {}) });
  return params.toString();
}
/** pathname 예: '/', '/l/suwon-app-dev/', '/h/app-dev/'. utmContent 있으면 utm_content 부여 */
function siteUrl(pathname, utmContent) {
  const qs = utmQuery(utmContent ? { utm_content: utmContent } : null);
  return `${base}${pathname}?${qs}`;
}

// GBP '웹사이트' 필드에 넣는 확정 주소(홈 + UTM)
const WEBSITE_URL = siteUrl('/');

// ── 참조 맵(서비스/지역/업종 한글명) ─────────────────────────────
const serviceKo = {};
const regionKo = {};
const industryKo = {};
for (const c of Object.values(clusters)) {
  if (c.type === 'service') serviceKo[c.id] = c.ko;
  else if (c.type === 'region') regionKo[c.id] = c.ko;
  else if (c.type === 'industry') industryKo[c.id] = c.ko;
}
const serviceClusters = Object.values(clusters).filter((c) => c.type === 'service');

// ── 공통 문구 ──────────────────────────────────────────────────
const NAP = `${biz.name} · 대표 ${biz.representative} · 사업자등록번호 ${biz.bizNo} · ${biz.address} · ${biz.hours} · ${biz.phone} · ${biz.email}`;
const CONTACT_LINE = `문의: ${biz.phone} · ${biz.email} (${biz.hours})`;
const AREA_LINE = `${biz.areaServed.join(' · ')} 진행`;

/** 목적격 조사 을/를 — 마지막 글자 받침 유무로 선택 */
function withEulReul(word) {
  const w = word.trim();
  const code = w.charCodeAt(w.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return `${w}를`;
  return w + ((code - 0xac00) % 28 !== 0 ? '을' : '를');
}

// ── 1) 사업 설명(description) ───────────────────────────────────
function buildDescription() {
  const primary = [
    `${biz.company}입니다. Flutter 앱개발·MVP 개발·홈페이지 제작·랜딩페이지·AI 기능 개발을 ${biz.areaServed.slice(0, 4).join('·')} 등 경기 남부와 전국 원격으로 진행합니다.`,
    `름랩은 두 가지가 다릅니다. 첫째, 완성물의 소스코드와 계정 권한을 전부 넘겨 드려 다른 곳으로 옮겨도 외주에 묶이지 않습니다. 둘째, AI 보조 개발과 1:1 운영 교육으로 비전공자 대표님도 납품 후 직접 수정·운영할 수 있습니다.`,
    `견적은 VAT 포함 정액으로 먼저 공개합니다 — 웹 98만 원부터, 앱 580만 원부터. ${CONTACT_LINE}`,
  ].join(' ');
  // GBP 사업설명은 750자 제한
  return {
    primary: primary.slice(0, 740),
    charCount: Math.min(primary.length, 740),
    limit: 750,
  };
}

// ── 2) 서비스 목록(services) ────────────────────────────────────
function buildServices() {
  const priceHint = templates.pricingSnippets || {};
  return serviceClusters.map((c) => ({
    name: c.ko,
    url: siteUrl(`/h/${c.slug}/`, c.slug),
    description: [
      `${c.ko} 프로젝트를 VAT 포함 정액으로 진행합니다.`,
      priceHint[c.svcType] || '규모·기능에 맞춰 견적을 안내드립니다.',
      '소스코드 전체 이관 + 직접 운영 교육 포함.',
    ]
      .join(' ')
      .slice(0, 300),
  }));
}

// ── 3) 상품/패키지(products) ────────────────────────────────────
function buildProducts() {
  return (cfg.packages || []).map((p) => ({
    name: p.name,
    price: p.price,
    description: p.desc,
    url: WEBSITE_URL,
  }));
}

// ── 4) 소식 포스트(posts) ───────────────────────────────────────
// 주제 소스별 후보 생성
function topicsFromSource(source) {
  if (source === 'service') {
    return serviceClusters.map((c) => ({
      kind: 'service',
      keyword: c.ko,
      pathname: `/h/${c.slug}/`,
      slug: c.slug,
      desc: templates.hubBodyTemplates?.service || '',
    }));
  }
  return landings
    .filter((l) => l.pattern === source)
    .map((l) => ({
      kind: source,
      keyword: l.keyword,
      pathname: `/l/${l.slug}/`,
      slug: l.slug,
      serviceKey: l.serviceKey,
      regionKey: l.regionKey,
      industryKey: l.industryKey,
      desc: l.description || '',
    }));
}

// 라운드로빈으로 소스를 번갈아 뽑고 키워드 중복 제거 → count 개
function selectTopics() {
  const buckets = cfg.posts.sources.map((s) => topicsFromSource(s));
  const picked = [];
  const seen = new Set();
  const norm = (s) => s.replace(/\s+/g, '').toLowerCase();
  let idx = 0;
  while (picked.length < cfg.posts.count) {
    let advanced = false;
    for (const bucket of buckets) {
      const item = bucket[idx];
      if (!item) continue;
      advanced = true;
      if (seen.has(norm(item.keyword))) continue;
      seen.add(norm(item.keyword));
      picked.push(item);
      if (picked.length >= cfg.posts.count) break;
    }
    if (!advanced) break; // 모든 버킷 소진
    idx++;
  }
  return picked;
}

// 주제 → 포스트 본문 (kind별 2가지 변형을 index로 번갈아 사용)
function bodyForTopic(t, i) {
  const v = i % 2;
  const props = cfg.valueProps;
  if (t.kind === 'service') {
    return v === 0
      ? `${t.keyword}, 어디에 맡길지 고민이라면 름랩과 상담해 보세요. ${props[0]}. VAT 포함 정액 견적으로 먼저 금액을 공개합니다. ${AREA_LINE}. ${CONTACT_LINE}`
      : `${t.keyword} 외주를 준비 중이신가요? 름랩은 AI 보조 개발과 1:1 운영 교육으로, 납품 후 대표님이 직접 수정·운영할 수 있게 도와드립니다. 소스코드 전체 이관 포함. ${CONTACT_LINE}`;
  }
  if (t.kind === 'region_service') {
    const region = regionKo[t.regionKey] || '';
    return v === 0
      ? `${t.keyword} 맡길 곳 찾으신다면 름랩입니다. ${region ? region + ' 포함 ' : ''}전국 원격으로 진행하며, 소스코드·계정 권한을 전부 넘겨 드립니다. VAT 포함 정액 견적. ${CONTACT_LINE}`
      : `${t.keyword}, 원격으로도 문제없습니다. 화면 공유 미팅으로 기획부터 런칭까지 함께하고, 완성물은 소스코드까지 통째로 이관합니다. 웹 98만 원부터, 앱 580만 원부터. ${CONTACT_LINE}`;
  }
  if (t.kind === 'industry_service') {
    const industry = industryKo[t.industryKey] || '';
    return v === 0
      ? `${withEulReul(t.keyword)} 준비하신다면, ${industry || '업종'}에 필요한 기능부터 정리해 드립니다. 예약·결제·관리자 등 꼭 필요한 것만 담아 정액 견적으로 진행합니다. ${props[1]}. ${CONTACT_LINE}`
      : `${t.keyword}, 어디서부터 시작할지 막막하다면 름랩과 기능 우선순위부터 정리하세요. 소스코드 전체 이관 + 직접 운영 교육 포함이라 만든 뒤에도 직접 굴릴 수 있습니다. ${CONTACT_LINE}`;
  }
  // service_intent
  return v === 0
    ? `${t.keyword} 궁금하신가요? 름랩은 VAT 포함 정액으로 금액을 먼저 공개합니다. 범위·기간을 명확히 잡고 시작해 추가비용 걱정을 줄입니다. ${AREA_LINE}. ${CONTACT_LINE}`
    : `${t.keyword} — 견적은 범위가 정해져야 정확합니다. 꼭 필요한 기능만 정리해 정액으로 안내드리고, 소스코드·계정도 전부 넘겨 드립니다. ${CONTACT_LINE}`;
}

function titleForTopic(t) {
  const type = t.kind === 'service' ? '서비스 안내' : t.kind === 'service_intent' ? '견적 안내' : '진행 안내';
  return `[${type}] ${t.keyword}`;
}

function addDays(startYmd, days) {
  const [y, m, d] = startYmd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function buildPosts() {
  const posts = [];
  const { start, everyDays } = cfg.posts.schedule;
  let week = 0;

  // 월간 혜택(OFFER) 포스트를 맨 앞에
  if (cfg.monthlyOffer?.enabled) {
    posts.push({
      type: 'OFFER',
      title: cfg.monthlyOffer.headline,
      body: `${cfg.monthlyOffer.body} ${CONTACT_LINE}`.slice(0, 1490),
      ctaType: cfg.monthlyOffer.ctaType || 'LEARN_MORE',
      ctaLabel: cfg.posts.ctaLabel,
      link: siteUrl('/', 'offer'),
      publishAt: addDays(start, week * everyDays),
      imageHint: '패키지 가격표 또는 작업 화면(사무실/개발 화면) 이미지 권장',
    });
    week++;
  }

  for (const [i, t] of selectTopics().entries()) {
    posts.push({
      type: 'UPDATE',
      title: titleForTopic(t),
      body: bodyForTopic(t, i).slice(0, 1490),
      ctaType: cfg.posts.ctaType || 'LEARN_MORE',
      ctaLabel: cfg.posts.ctaLabel,
      link: siteUrl(t.pathname, t.slug),
      target: t.pathname,
      keyword: t.keyword,
      publishAt: addDays(start, week * everyDays),
      imageHint: '작업/사무실/교육 관련 실사진 권장(스톡·과장 이미지 지양)',
    });
    week++;
  }
  return posts;
}

// ── 5) Q&A 시드 ────────────────────────────────────────────────
function buildQa() {
  return (templates.faqPool || []).map((f) => ({ question: f.q, answer: f.a }));
}

// ── 조립 ───────────────────────────────────────────────────────
const description = buildDescription();
const services = buildServices();
const products = buildProducts();
const posts = buildPosts();
const qa = buildQa();

const content = {
  generatedFrom: 'scripts/generate-gbp.mjs',
  business: biz,
  nap: NAP,
  website: {
    profileWebsiteUrl: WEBSITE_URL,
    utm: cfg.website.utm,
  },
  categories: cfg.categories,
  attributes: cfg.attributes || [],
  description,
  services,
  products,
  posts,
  qa,
  counts: {
    services: services.length,
    products: products.length,
    posts: posts.length,
    qa: qa.length,
  },
};

// ── 붙여넣기 가이드(MD) ─────────────────────────────────────────
function mdGuide() {
  const L = [];
  L.push('# 구글 비즈니스 프로필(GBP) 붙여넣기 가이드');
  L.push('');
  L.push('> `npm run gen:gbp` 로 자동 생성된 문서입니다. 수정은 `content/gbp.json`(설정)에서 하고 재생성하세요.');
  L.push('> GBP 는 사이트에 서빙되지 않는 외부 채널이라, 아래 내용을 프로필 각 영역에 **직접 붙여넣기** 합니다.');
  L.push('');
  L.push('## 0. NAP(상호·주소·연락처) — 모든 채널 글자 단위 동일 유지');
  L.push('```');
  L.push(NAP);
  L.push('```');
  L.push('');
  L.push('## 1. 웹사이트 필드(확정 주소)');
  L.push('프로필 → 정보 → 웹사이트 에 아래 주소를 넣습니다(UTM 포함, GA4/GTM 에서 GBP 유입 추적).');
  L.push('```');
  L.push(WEBSITE_URL);
  L.push('```');
  L.push('');
  L.push('## 2. 카테고리 · 속성');
  L.push(`- **1차 카테고리**: ${cfg.categories.primary}`);
  L.push(`- **보조 카테고리 후보**: ${cfg.categories.additional.join(', ')}`);
  if ((cfg.attributes || []).length) L.push(`- **속성**: ${cfg.attributes.join(', ')}`);
  L.push('');
  L.push(`## 3. 사업 설명 (${description.charCount}/${description.limit}자)`);
  L.push('```');
  L.push(description.primary);
  L.push('```');
  L.push('');
  L.push(`## 4. 서비스 (${services.length}개)`);
  for (const s of services) {
    L.push(`### ${s.name}`);
    L.push(`- 설명: ${s.description}`);
    L.push(`- 연결: ${s.url}`);
  }
  L.push('');
  L.push(`## 5. 상품/패키지 (${products.length}개)`);
  for (const p of products) {
    L.push(`### ${p.name} — ${p.price}`);
    L.push(`- ${p.description}`);
    L.push(`- 링크: ${p.url}`);
  }
  L.push('');
  L.push(`## 6. 소식 포스트 (${posts.length}개 · 매주 발행 권장)`);
  L.push('발행일은 `content/gbp.json` 의 `posts.schedule` 로 계산됩니다. 각 포스트를 발행일에 맞춰 올리세요.');
  L.push('');
  for (const [i, p] of posts.entries()) {
    L.push(`### #${i + 1} · ${p.publishAt} · ${p.type} — ${p.title}`);
    L.push('```');
    L.push(p.body);
    L.push('```');
    L.push(`- 버튼: ${p.ctaLabel} → ${p.link}`);
    L.push(`- 이미지: ${p.imageHint}`);
    L.push('');
  }
  L.push(`## 7. Q&A 시드 (${qa.length}개 — 프로필 소유자가 직접 질문·답변 등록)`);
  for (const q of qa) {
    L.push(`- **Q. ${q.question}**`);
    L.push(`  - A. ${q.answer}`);
  }
  L.push('');
  return L.join('\n');
}

// ── 저장 ───────────────────────────────────────────────────────
fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, 'gbp-content.json');
const mdPath = path.join(outDir, 'GBP-PASTE-GUIDE.md');
fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2) + '\n');
fs.writeFileSync(mdPath, mdGuide());

console.log('🏢 GBP 콘텐츠 자동생성 완료');
console.log('   웹사이트(확정): ' + WEBSITE_URL);
console.log(`   서비스 ${services.length} · 상품 ${products.length} · 소식 ${posts.length} · Q&A ${qa.length}`);
console.log('   → ' + path.relative(root, jsonPath));
console.log('   → ' + path.relative(root, mdPath));
