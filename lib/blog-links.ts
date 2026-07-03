/**
 * 블로그 → 머니페이지 내부링크 자동 매핑 (SEO 전략 §7·§10)
 * ------------------------------------------------------------------
 * 정보성 블로그 글(410편)의 링크 자산을 상위노출을 노리는 핵심 서비스
 * 허브로 흘려보낸다. 글마다 똑같은 CTA(`/#pricing`)만 달면 정보성 글의
 * 힘이 견적 페이지로 전달되지 않는다 → 글의 키워드/제목에 맞춰 관련 서비스
 * 허브 링크를 "다르게" 붙인다.
 *
 * 설계 원칙
 *  - 대상은 **색인 품질을 통과한 실제 허브 페이지**만 (얇은/301 페이지로 링크 자산 누수 방지).
 *  - 완전 결정적(Math.random·Date 미사용) — 같은 글은 항상 같은 링크 → 재빌드 시 HTML 안정.
 *  - 앵커 텍스트는 대상별 고유 문구 → "지역명만 바뀐 동일 CTA" 도어웨이 신호 회피.
 *
 * 순수 함수만 제공한다. app/blog/[slug]/page.tsx 에서 import 해 사용한다.
 */
import type { BlogPost } from './blog-posts';

export interface ServiceLink {
  /** 내부 경로 (trailing slash) — 색인되는 허브 canonical과 일치 */
  href: string;
  /** 대상별 고유 앵커 텍스트 */
  label: string;
  /** 링크 카드 보조 문구 */
  blurb: string;
}

/**
 * 머니페이지 6종 — 모두 색인 대상(rich 한글 허브 + pSEO 서비스 허브).
 * lib/seo.ts PAGE_SEO_MAP(flutter/mvp/ai-development/source-handover)과
 * lib/pseo.ts SERVICES(app-development/web-development)의 canonical에 맞춘다.
 */
const TARGETS = {
  flutter: {
    href: '/flutter/',
    label: 'Flutter 앱개발 외주',
    blurb: '하나의 코드로 iOS·Android 동시 출시 — VAT 포함 290만 원부터, 소스코드 전체 이관',
  },
  mvp: {
    href: '/mvp/',
    label: 'MVP 개발 외주',
    blurb: '검증에 필요한 핵심 기능부터 14~30일에 — 확장 가능한 구조로 이관',
  },
  ai: {
    href: '/ai-development/',
    label: 'AI 외주개발',
    blurb: '챗봇·상담 자동화 같은 실전형 AI를 최소 기능부터 단계별로',
  },
  source: {
    href: '/source-handover/',
    label: '소스코드 이관',
    blurb: '저장소·배포 권한·스토어 계정까지 통째로 — 외주사 종속 없이 직접 운영',
  },
  app: {
    href: '/app-development/',
    label: '앱개발 외주',
    blurb: '기획서가 없어도 아이디어와 핵심 기능만으로 정액 견적 상담',
  },
  web: {
    href: '/web-development/',
    label: '웹사이트·랜딩페이지 제작',
    blurb: '반응형 웹 49만 원부터 · 월 관리비 없이 소스코드 이관',
  },
} as const satisfies Record<string, ServiceLink>;

type TargetKey = keyof typeof TARGETS;

/**
 * 키워드/제목 → 서비스 매핑 규칙 (순서 = 우선순위).
 * 먼저 매칭된 규칙의 서비스가 "대표 링크"(하단 CTA 대상)가 된다.
 * 하나의 글이 여러 규칙에 걸리면 순서대로 모아 dedupe 후 상위 N개만 노출.
 */
const RULES: { test: RegExp; keys: TargetKey[] }[] = [
  // 소스코드/이관/외주 실패·종속 — 경쟁사 미점유 차별 토픽이라 최우선
  { test: /소스\s*코드|소스코드|이관|저작권|외주\s*실패|먹튀|종속|계약서|유지보수/, keys: ['source'] },
  // Flutter / 크로스플랫폼
  { test: /flutter|플러터|크로스\s*플랫폼|크로스플랫폼/i, keys: ['flutter', 'app'] },
  // MVP / 검증 / 프로토타입 / 스타트업
  { test: /mvp|최소\s*기능|프로토타입|시장\s*검증|스타트업|아이디어\s*검증|데모데이/i, keys: ['mvp', 'app'] },
  // AI / 챗봇 / 자동화 / LLM
  { test: /\bai\b|인공지능|챗봇|챗\s*봇|자동화|gpt|llm|추천\s*시스템|생성형/i, keys: ['ai'] },
  // 웹 / 홈페이지 / 랜딩 / 쇼핑몰
  { test: /홈페이지|웹사이트|웹\s*사이트|랜딩\s*페이지|랜딩페이지|반응형|쇼핑몰|웹\s*개발|웹개발|워드프레스/i, keys: ['web'] },
  // 앱 / 어플 / 모바일 / 스토어 (가장 일반적 → 뒤쪽에서 fallback 성격)
  { test: /앱\s*개발|앱개발|어플|모바일\s*앱|android|안드로이드|ios|아이폰|앱스토어|플레이스토어/i, keys: ['app'] },
];

/** 블로그 글에서 지역 링크를 붙일 본거지·인접 로컬(경기남부 중심)만 유지 */
const KEEP_REGIONS: { slug: string; test: RegExp; label: string }[] = [
  { slug: 'suwon', test: /수원|영통|광교|인계동/, label: '수원' },
  { slug: 'dongtan', test: /동탄/, label: '동탄' },
  { slug: 'hwaseong', test: /화성/, label: '화성' },
];

/** 지역×서비스 pSEO 페이지가 존재하는 서비스 슬러그 (lib/pseo.ts SERVICES와 동기화) */
const REGION_SERVICE_SLUG: Record<TargetKey, string | null> = {
  flutter: 'flutter',
  mvp: 'mvp',
  ai: 'ai-development',
  app: 'app-development',
  web: 'web-development',
  source: null, // 소스코드 이관은 지역×서비스 축이 없음 → 허브로만 연결
};

function haystack(post: BlogPost): string {
  return [post.title, ...post.keywords].join(' ');
}

/**
 * 이 글에 붙일 머니페이지 링크 목록 (대표 링크가 [0]).
 * @param limit 최대 링크 수 (기본 3)
 */
export function serviceLinksFor(post: BlogPost, limit = 3): ServiceLink[] {
  const text = haystack(post);
  const keys: TargetKey[] = [];
  for (const rule of RULES) {
    if (rule.test.test(text)) {
      for (const k of rule.keys) if (!keys.includes(k)) keys.push(k);
    }
  }
  // 매칭이 하나도 없으면 외주 독자 공통 관심사로 fallback
  if (keys.length === 0) keys.push('app', 'source');
  // 소스코드 차별 토픽은 앱/웹 글에도 항상 하나 더 얹어 준다(핵심 전환 페이지 강화).
  if (!keys.includes('source')) keys.push('source');
  return keys.slice(0, limit).map((k) => TARGETS[k]);
}

/**
 * 이 글에 붙일 지역 링크 (경기남부 keep 지역이 본문/키워드에 있을 때만).
 * 대표 서비스에 맞는 지역×서비스 pSEO 페이지로 연결한다. 없으면 null.
 */
export function regionLinkFor(post: BlogPost): ServiceLink | null {
  const text = haystack(post);
  const region = KEEP_REGIONS.find((r) => r.test.test(text));
  if (!region) return null;
  const primary = serviceLinksFor(post, 1)[0];
  // 대표 링크 href(/flutter/ 등)에서 서비스 키를 역추출
  const key = (Object.keys(TARGETS) as TargetKey[]).find((k) => TARGETS[k].href === primary.href);
  const serviceSlug = key ? REGION_SERVICE_SLUG[key] : null;
  const slug = serviceSlug ?? 'app-development';
  const svcShort =
    slug === 'web-development' ? '웹사이트 제작'
    : slug === 'mvp' ? 'MVP 개발'
    : slug === 'flutter' ? 'Flutter 앱개발'
    : slug === 'ai-development' ? 'AI 개발'
    : '앱개발';
  return {
    href: `/${slug}/${region.slug}/`,
    label: `${region.label} ${svcShort}`,
    blurb: `${region.label}·경기남부 기준 견적과 진행 방식 — 소스코드 이관 포함`,
  };
}
