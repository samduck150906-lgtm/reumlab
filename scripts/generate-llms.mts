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
import { SITE, PAGE_SEO_MAP } from '../lib/seo';
import { GUIDES, guideCanonical, guideDecision } from '../lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '../lib/compare';
import { gitLastModified } from '../lib/lastmod';

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
L.push(
  `> ${SITE.name}(${SITE.nameEn})은 앱, 웹사이트, 관리자 페이지와 MVP를 기획부터 개발·배포까지 구축하는 ` +
    `앱·웹 개발 스튜디오입니다. 완성 후 소스코드와 운영 권한을 고객에게 이관하며, ` +
    `VAT 포함 정액 패키지로 가격과 기간을 먼저 공개합니다.`,
);
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
const KEY_SLUGS = ['', 'mvp', 'flutter', 'web-development', 'app-development', 'ai-development', 'source-handover'];
for (const slug of KEY_SLUGS) {
  const seo = PAGE_SEO_MAP[slug];
  if (!seo) continue;
  L.push(`- [${seo.h1}](${seo.canonical}): ${seo.description.slice(0, 120)}`);
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
