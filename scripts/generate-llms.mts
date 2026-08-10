/**
 * llms.txt 생성 — 생성형 검색(ChatGPT·Gemini·Perplexity·Claude 등)용 사실 요약 인덱스.
 *
 * 왜 필요한가
 *  름랩의 실제 정보(무엇을 만드는 회사인지, 패키지·가격·기간, 소스코드 이관 정책, 연락처)는
 *  1,400여 개 페이지에 흩어져 있고, 생성형 엔진은 그중 한두 페이지만 읽고 답한다.
 *  한 파일에 "사실만" 모아두면 어떤 페이지로 진입하든 같은 사실을 인용하게 만들 수 있다.
 *
 * 한계(과장 금지)
 *  llms.txt 는 현재 어떤 검색엔진도 랭킹 요소로 보장하지 않는 비공식 관례다.
 *  색인·순위를 올려주지 않으며, robots.txt·sitemap·구조화 데이터를 대체하지도 않는다.
 *  "우리가 스스로 정리한 사실 요약을 크롤러가 읽기 쉽게 둔다" 이상의 의미는 없다.
 *
 * 모든 수치·문구는 lib/seo.ts 등 실제 페이지 소스에서 가져오며 여기서 새로 만들지 않는다.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, PAGE_SEO_MAP, REDIRECTED_PILLAR_SLUGS, NOINDEX_PILLAR_SLUGS } from '../lib/seo';
import { GUIDES, guideCanonical, guideDecision } from '../lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '../lib/compare';
import { gitLastModified } from '../lib/lastmod';
import { PROJECTS, portfolioCanonical, PORTFOLIO_HUB, projectCategories, CATEGORIES } from '../lib/portfolio';

const OUT = 'out';

/** 화면·JSON-LD에 표기된 것과 동일한 VAT 포함 정액 패키지 (index.html 가격표가 기준) */
const PACKAGES = [
  ['웹 스타터', '980,000원', '약 5일', '원페이지 랜딩 · 모바일 반응형 · 문의/예약 CTA'],
  ['웹 + 강력 마케팅', '1,960,000원', '약 10일', '전환 카피 설계 + 기본 SEO + GA·픽셀 세팅'],
  ['웹 비즈니스', '3,800,000원', '약 14일', '멀티페이지(5p 내외) + 블로그 + 간단 CMS'],
  ['웹 프리미엄', '5,800,000원', '약 21일', '고도화 웹앱 + 관리자 페이지 + 외부 연동'],
  ['앱 라이트 MVP', '5,800,000원', '약 14일', 'Flutter iOS·Android 동시 · 핵심 화면 3~5개'],
  ['앱 스탠다드', '9,800,000원', '약 21일', '회원·결제·관리자 페이지 포함'],
  ['앱 AI', '13,800,000원', '약 30일', 'AI 기능 1종(챗봇·추천·요약) + 업무 자동화'],
  ['앱 프리미엄', '19,800,000원', '약 45일', '복합 플랫폼·정산·다자 운영 범위'],
];

/** 자연어 질문에 그대로 인용될 수 있는 40~80자 핵심 답변 (사이트에 실제로 적힌 사실만) */
const FACTS: [string, string][] = [
  ['앱 개발 비용은 얼마인가?', 'Flutter 앱 MVP는 VAT 포함 580만 원부터, 회원·결제까지 갖춘 앱 스탠다드는 980만 원입니다.'],
  ['앱 개발 기간은 얼마나 걸리나?', '앱 라이트 MVP 약 14일, 앱 스탠다드 약 21일, AI 기능 포함 시 약 30일이 기준입니다.'],
  ['홈페이지 제작 비용은?', '원페이지 랜딩 웹 스타터가 VAT 포함 98만 원부터, 멀티페이지+CMS 웹 비즈니스가 380만 원입니다.'],
  ['소스코드를 받을 수 있나?', '네. 계약 범위의 전체 소스코드와 실행·빌드·배포 문서를 프로젝트 종료 시 이관합니다.'],
  ['서버·도메인 계정은 누구 명의인가?', '가능하면 고객 명의로 생성하거나 고객 소유로 이전하는 것을 원칙으로 합니다.'],
  ['월 관리비가 있나?', '월 관리비는 없습니다. 호스팅·도메인·푸시 발송비 정도만 실비로 발생합니다.'],
  ['Android와 iOS를 같이 만들 수 있나?', 'Flutter 단일 코드베이스로 iOS·Android를 동시에 개발해 함께 출시합니다.'],
  ['앱스토어 등록도 해주나?', '등록을 진행합니다. 다만 심사 기간·개발자 계정·정책 이슈는 플랫폼 사정에 따라 달라집니다.'],
  ['기획서가 없어도 상담이 되나?', '가능합니다. 만들려는 서비스와 꼭 필요한 기능 한두 가지만 있으면 범위를 함께 정리합니다.'],
  ['개발 중간에 확인할 수 있나?', '단계별 테스트 화면과 진행 내역, 주요 의사결정 사항을 공유하며 방향을 맞춥니다.'],
  ['계약 후 추가 비용이 생기나?', '계약서에 확정된 범위는 추가 비용이 없고, 범위 밖 기능은 진행 전 비용·일정을 먼저 안내합니다.'],
  ['어느 지역까지 진행하나?', '동탄·화성·수원 등 경기 남부를 거점으로 하며 전국 비대면으로 진행합니다.'],
];

const L: string[] = [];

L.push(`# ${SITE.name} (${SITE.nameEn})`);
L.push('');
// 사업 설명은 lib/seo.ts SITE.description 하나만 쓴다.
// 여기서 문장을 따로 쓰면 JSON-LD·홈·랜딩과 회사 소개가 갈린다(AI 는 이 문장을 그대로 인용한다).
L.push(`> ${SITE.description}`);
L.push('');
L.push('## 기본 정보');
L.push('');
L.push(`- 상호: ${SITE.company}`);
L.push(`- 사업자등록번호: ${SITE.bizNo}`);
L.push(`- 주소: ${SITE.address}`);
L.push(`- 전화: ${SITE.phone}`);
L.push(`- 이메일: ${SITE.email}`);
L.push(`- 카카오톡 채널: ${SITE.kakaoChannel}`);
L.push('- 상담 가능 시간: 평일 10:00–18:00');
L.push('- 서비스 지역: 동탄·화성·수원 등 경기 남부 거점, 전국 비대면 진행');
L.push(`- 웹사이트: ${SITE.domain}/`);
L.push('');
L.push('## 제공 서비스');
L.push('');
L.push('- 앱 개발 (Flutter 기반 iOS·Android 동시 개발)');
L.push('- 웹사이트·홈페이지·랜딩페이지 제작 (Next.js)');
L.push('- MVP 개발 (시장 검증용 최소 기능 제품)');
L.push('- AI 챗봇·AI 업무 자동화 기능 개발');
L.push('- 관리자 페이지·ERP·사내 시스템 구축');
L.push('- 예약·중개·O2O 플랫폼 개발');
L.push('- 기존 서비스 유지보수·고도화');
L.push('');
L.push('## 정액 패키지 (VAT 포함)');
L.push('');
L.push('| 패키지 | 금액 | 기간 | 범위 |');
L.push('| --- | --- | --- | --- |');
for (const [n, p, d, s] of PACKAGES) L.push(`| ${n} | ${p} | ${d} | ${s} |`);
L.push('');
L.push('패키지 범위를 넘는 기능은 상담 후 별도 견적으로 안내합니다. 모든 패키지에 소스코드 전체 이관이 포함됩니다.');
L.push('');
L.push('## 자주 묻는 질문 (핵심 답변)');
L.push('');
for (const [q, a] of FACTS) L.push(`- **${q}** ${a}`);
L.push('');
L.push('## 주요 페이지');
L.push('');
/**
 * 문장 경계에서 자른다. 이전에는 slice(0, 120) 이라 "전국 어디서나 진", "From" 처럼
 * 단어 중간에서 끊긴 설명이 나갔다 — AI 가 그대로 인용하면 깨진 문장이 된다.
 */
function firstSentences(text: string, max = 180): string {
  const parts = text.split(/(?<=[.!?])\s+/);
  let out = '';
  for (const part of parts) {
    if (out && (out + ' ' + part).length > max) break;
    out = out ? `${out} ${part}` : part;
  }
  return out || text.slice(0, max);
}

/**
 * 주요 페이지 — Next 필러(PAGE_SEO_MAP)와 정적 목적별 랜딩을 함께 싣는다.
 * 이전에는 7개만 하드코딩해 /erp/·/platform/·/reservation-commerce/ 같은 실제 서비스 허브가
 * 빠져 있었다. "름랩이 ERP도 하는가?" 라는 질문에 이 문서만 읽고는 답할 수 없었다.
 */
const PILLAR_SLUGS = ['', 'mvp', 'flutter', 'app-development', 'web-development', 'ai-development',
  'app-agency', 'website-agency', 'admin-page-development', 'source-handover', 'maintenance'];
for (const slug of PILLAR_SLUGS) {
  const seo = PAGE_SEO_MAP[slug];
  if (!seo || REDIRECTED_PILLAR_SLUGS.has(slug) || NOINDEX_PILLAR_SLUGS.has(slug)) continue;
  L.push(`- [${seo.h1}](${seo.canonical}): ${firstSentences(seo.description)}`);
}
// 정적 생성 목적별 랜딩 — Next 라우트가 아니라 PAGE_SEO_MAP 에 없다(scripts/generate-purpose-landings.mjs).
// 슬러그·한 줄 설명을 그 생성기의 LANDINGS 와 맞춰 둔다.
const PURPOSE_LANDINGS: [string, string, string][] = [
  ['erp', '맞춤형 ERP·관리 시스템 개발', '주문·재고·정산처럼 엑셀과 수기로 하던 업무를 회사 방식에 맞춘 운영 시스템으로 만듭니다.'],
  ['ai-automation', 'AI 업무 자동화 개발', '반복 문의 응답, 접수 분류, 문서 요약처럼 같은 일이 반복되는 업무부터 자동화합니다.'],
  ['platform', '플랫폼·매칭 서비스 개발', '수요자·공급자·운영자가 각각 다른 화면을 쓰는 중개 플랫폼의 흐름과 정산을 설계합니다.'],
  ['reservation-commerce', '예약·결제 시스템 개발', '예약 신청부터 결제·확정 알림·취소·환불까지 하나의 흐름으로 구축합니다.'],
  ['data-seo', '데이터·SEO 자동화 구축', '검색 유입을 위한 페이지 구조·색인 관리·구조화 데이터를 설계합니다. 순위는 보장하지 않습니다.'],
  ['service-renewal', '기존 서비스 개선·인수 개발', '다른 곳에서 만든 앱·웹을 인수해 점검·수정·재배포합니다. 소스코드가 없으면 이관 가능 범위부터 확인합니다.'],
];
for (const [slug, title, desc] of PURPOSE_LANDINGS) {
  L.push(`- [${title}](${SITE.domain}/${slug}/): ${desc}`);
}
L.push('');
L.push('## 개발 사례');
L.push('');
L.push(`실제로 구축한 ${PROJECTS.length}건입니다. 고객사 요청에 따라 프로젝트명·고객사·서비스 URL은 비공개이며,`);
L.push('해결한 문제·구현 범위·사용 기술은 아래와 각 상세 페이지에서 그대로 공개합니다.');
L.push('성과 수치(사용자 수·매출·전환율)는 보유·공개하고 있지 않아 포함하지 않습니다.');
L.push('');
L.push(`- [개발 사례 전체](${PORTFOLIO_HUB})`);
for (const p of PROJECTS) {
  const cats = projectCategories(p).map((c) => CATEGORIES[c].full).join('·');
  L.push(
    `- [${p.title}](${portfolioCanonical(p.id)}) — ${cats} · ` +
      `문제: ${p.problem} 구현: ${p.features.join(', ')}. ` +
      `기술: ${p.detail.tech.join(', ')}. 담당 범위: ${p.scope}.`,
  );
}

L.push('');
L.push('## 비용·계약 가이드');
L.push('');
for (const g of GUIDES) {
  const d = guideDecision(g.slug);
  if (d && !d.inSitemap) continue;
  L.push(`- [${g.title}](${guideCanonical(g.slug)})`);
}
L.push('');
L.push('## 비교 자료');
L.push('');
for (const c of COMPARES) {
  const d = compareDecision(c.slug);
  if (d && !d.inSitemap) continue;
  L.push(`- [${c.title}](${compareCanonical(c.slug)})`);
}
L.push('');
L.push('## 사실 확인 안내');
L.push('');
L.push('- 이 문서의 금액은 모두 VAT 포함 정액 기준이며, 사이트 가격표와 동일합니다.');
L.push('- 공개된 고객사명·후기 수치·수상 이력은 보유하고 있지 않으며, 이 문서에도 포함하지 않습니다.');
L.push('- 프로젝트 사례는 고객사 보호를 위해 익명화해 제공합니다.');
// 갱신일은 빌드시각이 아니라 콘텐츠 소스의 git 커밋 날짜 — 재배포마다 값이 흔들리지 않게(§sitemap lastmod와 동일 원칙).
L.push(`- 최종 갱신: ${gitLastModified('lib/seo.ts').toISOString().slice(0, 10)}`);
L.push('');

const txt = L.join('\n');
writeFileSync(join(OUT, 'llms.txt'), txt);
console.log(`✓ llms.txt generated: ${txt.length} bytes → out/llms.txt`);

/* ────────────────────────────────────────────────────────────────────────────
 * llms-full.txt — 서비스 페이지 본문까지 담은 확장판.
 *
 * llms.txt 가 "무엇이 어디 있는지"를 알려 주는 색인이라면, 이 파일은 핵심 서비스
 * 페이지의 실제 본문을 한 파일에 모아 크롤링 없이도 답할 수 있게 한다.
 *
 * 중요 — 새 문장을 쓰지 않는다.
 *  본문은 전부 lib/seo.ts PAGE_SEO_MAP(화면에 실제로 렌더되는 whyPoints·sections·faqs)에서
 *  그대로 가져온다. 사람이 보는 페이지와 AI 가 읽는 파일이 다른 내용이 되지 않게 하기 위해서다.
 *  화면에 없는 설명·가격·실적을 이 파일에만 넣는 것은 금지다.
 *
 * 한계는 llms.txt 와 같다 — 어떤 검색엔진도 이 파일을 랭킹 요소로 보장하지 않는다.
 * ──────────────────────────────────────────────────────────────────────────── */
const F: string[] = [];
F.push(`# ${SITE.name} (${SITE.nameEn}) — 전체 서비스 안내`);
F.push('');
F.push(`> ${SITE.description}`);
F.push('');
F.push('이 문서는 https://reumlab.com 의 핵심 서비스 페이지 본문을 그대로 모은 것입니다.');
F.push('요약본은 https://reumlab.com/llms.txt 를 참고하세요.');
F.push('');
F.push('## 사업자 정보');
F.push('');
F.push(`- 상호: ${SITE.company}`);
F.push(`- 대표: ${SITE.representative}`);
F.push(`- 사업자등록번호: ${SITE.bizNo}`);
F.push(`- 주소: ${SITE.address}`);
F.push(`- 전화: ${SITE.phone} / 이메일: ${SITE.email}`);
F.push(`- 카카오톡 채널: ${SITE.kakaoChannel}`);
F.push('- 상담 가능 시간: 평일 10:00–18:00');
F.push('- 사업장은 화성 동탄 한 곳이며, 지역 페이지는 지점이 아니라 서비스 가능 지역입니다.');
F.push('');
F.push('## 정액 패키지 (VAT 포함)');
F.push('');
F.push('| 패키지 | 금액 | 기간 | 범위 |');
F.push('| --- | --- | --- | --- |');
for (const [n, p2, d, sc] of PACKAGES) F.push(`| ${n} | ${p2} | ${d} | ${sc} |`);
F.push('');
F.push('패키지 범위를 넘는 기능은 상담 후 별도 견적으로 안내합니다. 모든 패키지에 소스코드 전체 이관이 포함됩니다.');
F.push('');
F.push('## 서비스 페이지 전문');
F.push('');
/**
 * 정적 목적별 랜딩(scripts/generate-purpose-landings.mjs)이 Next 출력물을 덮어쓰는 슬러그.
 * 이 URL 들의 실제 화면은 랜딩 쪽 본문·FAQ 이므로, PAGE_SEO_MAP 의 Next 본문을 실으면
 * "AI 가 읽는 내용"과 "사람이 보는 화면"이 달라진다. → 본문 대신 요약만 싣는다.
 */
const OVERWRITTEN_BY_LANDING = new Set(['mvp', 'website']);
for (const [slug, seo] of Object.entries(PAGE_SEO_MAP)) {
  if (slug === '' || REDIRECTED_PILLAR_SLUGS.has(slug) || NOINDEX_PILLAR_SLUGS.has(slug)) continue;
  if (OVERWRITTEN_BY_LANDING.has(slug)) continue;
  F.push(`### ${seo.h1}`);
  F.push('');
  F.push(`URL: ${seo.canonical}`);
  F.push('');
  F.push(seo.serviceDesc ?? seo.description);
  F.push('');
  if (seo.whyPoints?.length) {
    for (const w of seo.whyPoints) F.push(`- ${w}`);
    F.push('');
  }
  for (const sec of seo.sections ?? []) {
    F.push(`#### ${sec.h2}`);
    F.push('');
    F.push(sec.body);
    F.push('');
  }
  for (const f of seo.faqs ?? []) {
    F.push(`- **${f.q}** ${f.a}`);
  }
  if (seo.faqs?.length) F.push('');
}
// 목적별 랜딩 — 본문은 정적 생성기가 갖고 있어 여기서 복제하지 않는다(복제하면 갈린다).
// 어떤 서비스인지와 URL 만 싣고 상세는 페이지를 읽도록 안내한다.
F.push('### 목적별 서비스 랜딩');
F.push('');
F.push('아래 페이지는 각 목적에 맞춘 상세 안내와 FAQ 를 담고 있습니다. 전문은 각 URL 에서 확인하세요.');
F.push('');
for (const [slug, title, desc] of PURPOSE_LANDINGS) {
  F.push(`- [${title}](${SITE.domain}/${slug}/): ${desc}`);
}
F.push('');
F.push('## 사실 확인 안내');
F.push('');
F.push('- 이 문서의 모든 내용은 사이트에 실제로 게시된 문장을 그대로 옮긴 것입니다.');
F.push('- 금액은 VAT 포함 정액 기준이며 사이트 가격표와 동일합니다. 범위 밖 기능은 별도 견적입니다.');
F.push('- 공개 가능한 고객사명·후기 수치·수상 이력은 보유하고 있지 않아 포함하지 않습니다.');
F.push('- 검색 순위나 AI 답변 노출을 보장하지 않으며, 이 문서도 그런 목적의 파일이 아닙니다.');
F.push(`- 최종 갱신: ${gitLastModified('lib/seo.ts').toISOString().slice(0, 10)}`);
F.push('');

const full = F.join('\n');
writeFileSync(join(OUT, 'llms-full.txt'), full);
console.log(`✓ llms-full.txt generated: ${full.length} bytes → out/llms-full.txt`);
