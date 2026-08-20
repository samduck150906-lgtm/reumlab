/**
 * 콘텐츠 클러스터 배선 — 서비스 허브(pillar) ↔ 정보성 가이드(cluster).
 *
 * 조사에서 확인한 문제
 *  가이드 40건·비교 3건이 서비스 허브로는 링크를 보내고 있었지만, 반대 방향이 없었다.
 *  서비스 허브 14곳에서 /guide/ 로 나가는 링크가 0개였고, /compare/ 허브는 사이트
 *  어디에서도 링크되지 않았다(인바운드 0). 정보성 검색으로 들어온 사람이 서비스로
 *  넘어갈 길만 있고, 서비스를 보다 판단이 안 서는 사람이 근거를 찾아갈 길이 없었다.
 *
 * 이 파일은 그 역방향 연결만 정의한다. 새 문장이나 새 사실은 없다.
 *
 * 원칙
 *  · 검색 의도가 실제로 맞는 것만 연결한다. 개수를 채우려고 넣지 않는다.
 *  · 한 허브에 3~5개. 그 이상은 링크가 아니라 목록이 된다.
 *  · 여기에 적는 slug 는 반드시 실재해야 한다 — verify-content.mjs 가 전수 대조한다.
 */

/** /guide/<slug> */
type GuideRef = { guide: string };
/** /compare/<slug> */
type CompareRef = { compare: string };
/** /blog/<slug> */
type BlogRef = { blog: string };
export type ClusterRef = GuideRef | CompareRef | BlogRef;

export function clusterHref(r: ClusterRef): string {
  if ('guide' in r) return `/guide/${r.guide}/`;
  if ('compare' in r) return `/compare/${r.compare}/`;
  return `/blog/${r.blog}/`;
}

/**
 * 서비스 허브 → 그 서비스를 검토하는 사람이 실제로 궁금해할 순서로.
 * 키는 허브의 경로(선행·후행 슬래시 포함).
 */
export const SERVICE_GUIDES: Record<string, ClusterRef[]> = {
  // ── 앱
  '/flutter/': [
    { guide: 'flutter-cost' },
    { guide: 'app-duration' },
    { compare: 'flutter-vs-react-native' },
    { guide: 'dev-process' },
    { guide: 'quote' },
  ],
  '/app-development/': [
    { guide: 'outsourcing-checklist' },
    { guide: 'app-cost' },
    { guide: 'app-duration' },
    { guide: 'dev-process' },
    { guide: 'agency-choice' },
    { guide: 'non-developer-app' },
  ],
  '/app-agency/': [
    { guide: 'outsourcing-checklist' },
    { guide: 'agency-choice' },
    { guide: 'outsourcing-cost' },
    { guide: 'quote' },
    { compare: 'outsourcing-vs-inhouse' },
  ],
  '/app/': [
    { guide: 'app-cost' },
    { guide: 'app-duration' },
    { guide: 'dev-process' },
  ],

  // ── MVP
  '/mvp/': [
    { guide: 'mvp-priority' },
    { guide: 'mvp-cost' },
    { guide: 'startup-mvp' },
    { guide: 'app-duration' },
    { guide: 'dev-process' },
  ],
  '/mvp-development/': [
    { guide: 'mvp-priority' },
    { guide: 'mvp-cost' },
    { guide: 'startup-mvp' },
    { compare: 'outsourcing-vs-inhouse' },
  ],

  // ── 웹
  '/website/': [
    { guide: 'web-cost' },
    { guide: 'dev-process' },
    { guide: 'agency-choice' },
    { blog: 'website-or-app-first' },
  ],
  '/web-development/': [
    { guide: 'web-cost' },
    { guide: 'app-duration' },
    { guide: 'dev-process' },
    { guide: 'agency-choice' },
  ],
  '/website-agency/': [
    { guide: 'outsourcing-checklist' },
    { guide: 'agency-choice' },
    { guide: 'web-cost' },
    { guide: 'quote' },
  ],
  '/soho/': [
    { guide: 'web-cost' },
    { blog: 'website-or-app-first' },
    { guide: 'dev-process' },
  ],

  // ── 업무 시스템
  '/erp/': [
    { guide: 'erp-cost' },
    { guide: 'enterprise-ai-adoption' },
    { guide: 'dev-process' },
    { guide: 'agency-choice' },
  ],
  '/admin-page-development/': [
    { guide: 'erp-cost' },
    { guide: 'app-cost' },
    { guide: 'dev-process' },
  ],
  '/platform/': [
    { guide: 'app-cost' },
    { guide: 'app-duration' },
    { guide: 'dev-process' },
  ],
  '/reservation-commerce/': [
    { guide: 'booking-app-guide' },
    { guide: 'app-cost' },
    { guide: 'dev-process' },
  ],

  // ── AI
  '/ai-automation/': [
    { guide: 'ai-automation-guide' },
    { guide: 'chatbot-cost' },
    // 자동화(실행)를 찾다가 "회사 자료로 답하는 AI"가 필요하다고 깨닫는 흐름이 실제로 있다.
    { guide: 'enterprise-ai-adoption' },
    { guide: 'dev-process' },
  ],
  '/ai-development/': [
    { guide: 'ai-automation-guide' },
    { guide: 'chatbot-cost' },
    { guide: 'rag-development' },
    { guide: 'agency-choice' },
  ],
  // 사내 AI — 개념(RAG) → 비용 → 도입 준비 순으로 배선한다.
  // 정보 검색으로 들어온 방문자가 상업 페이지로, 상업 페이지에서 판단 근거로 오갈 수 있게 한다.
  '/enterprise-ai/': [
    { guide: 'rag-development' },
    { guide: 'enterprise-ai-cost' },
    { guide: 'enterprise-ai-adoption' },
    { guide: 'ai-automation-guide' },
    { guide: 'dev-process' },
  ],

  // ── 기타 허브
  '/data-seo/': [{ guide: 'dev-process' }, { guide: 'agency-choice' }],
  '/service-renewal/': [
    { guide: 'agency-choice' },
    { guide: 'dev-process' },
    { compare: 'outsourcing-vs-nocode' },
  ],
  '/source-handover/': [
    { guide: 'outsourcing-checklist' },
    { guide: 'agency-choice' },
    { guide: 'dev-process' },
    { guide: 'quote' },
  ],
  '/maintenance/': [{ guide: 'agency-choice' }, { guide: 'dev-process' }],
  '/renewal/': [{ guide: 'agency-choice' }, { compare: 'outsourcing-vs-nocode' }],
  '/cost/': [{ guide: 'app-cost' }, { guide: 'app-duration' }, { guide: 'quote' }],
};

/**
 * 지역 페이지용 공통 세트.
 *
 * §45 — 지역마다 "수원 앱개발 비용" 같은 별도 글을 만들지 않는다.
 * 지역 페이지에서 지역명 없는 공통 가이드로 보낸다.
 */
export const REGION_GUIDES: ClusterRef[] = [
  { guide: 'app-cost' },
  { guide: 'app-duration' },
  { guide: 'dev-process' },
  { guide: 'agency-choice' },
];

/**
 * 앵커 텍스트 — §36 "모든 링크를 '자세히 보기'로 만들지 않는다".
 * 가이드의 H1(질문형)을 그대로 쓴다. 검색자가 던지는 질문과 같은 문장이라
 * 클릭 전에 무엇을 읽게 될지 알 수 있다.
 */
export interface ClusterLink {
  href: string;
  label: string;
  kind: '가이드' | '비교' | '칼럼';
}

export function resolveCluster(
  refs: ClusterRef[],
  lookup: {
    guide: (slug: string) => { h1: string } | undefined;
    compare: (slug: string) => { title: string } | undefined;
    blog: (slug: string) => { title: string } | undefined;
  },
): ClusterLink[] {
  const out: ClusterLink[] = [];
  for (const r of refs) {
    if ('guide' in r) {
      const g = lookup.guide(r.guide);
      if (g) out.push({ href: clusterHref(r), label: g.h1, kind: '가이드' });
    } else if ('compare' in r) {
      const c = lookup.compare(r.compare);
      if (c) out.push({ href: clusterHref(r), label: c.title, kind: '비교' });
    } else {
      const b = lookup.blog(r.blog);
      if (b) out.push({ href: clusterHref(r), label: b.title, kind: '칼럼' });
    }
  }
  return out;
}

export function guidesForService(path: string): ClusterRef[] {
  return SERVICE_GUIDES[path] ?? [];
}

/** 이 파일이 참조하는 모든 slug — 검증 스크립트가 실재 여부를 대조한다 */
export function allClusterRefs(): ClusterRef[] {
  return [...Object.values(SERVICE_GUIDES).flat(), ...REGION_GUIDES];
}
