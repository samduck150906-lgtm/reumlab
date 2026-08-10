/**
 * 개발 사례(포트폴리오) 단일 접근 모듈.
 *
 * 데이터 출처는 `script.js` 의 PROJECTS 하나뿐이다.
 * scripts/extract-portfolio.mjs 가 빌드 전에 content/portfolio.json 으로 옮기고,
 * 이 모듈은 그걸 읽기만 한다. 여기에 사례 내용을 직접 적지 말 것.
 *
 * ⚠️ 이 파일에는 프로젝트에 관한 "새 사실"이 없다.
 *    제목·문제·기능·범위·기술·산출물은 전부 PROJECTS 필드를 그대로 쓰고,
 *    이 모듈이 만드는 것은 URL·분류 라벨·서비스 허브 연결처럼 사이트 구조에 속한 값뿐이다.
 *    고객명·서비스 URL·성과 수치·기간·날짜는 원본에 없으므로 어디에서도 만들어내지 않는다.
 */
import raw from '../content/portfolio.json';
import { SITE } from './seo';

export interface ProjectDetail {
  /** 무엇을 만든 프로젝트인지 한 문단 */
  overview: string;
  /** 고객이 겪던 문제(원본에 기록된 범위) */
  problemDetail: string;
  /** 서비스 구조 노드 (예: 사용자 앱 → API → DB → 관리자) */
  structure: string[];
  /** 주요 사용자 흐름 (순서 있음) */
  userFlow: string[];
  /** 운영자·관리자 기능 */
  operator: string[];
  /** 이 프로젝트에 실제로 쓴 기술 */
  tech: string[];
  /** 납품 산출물 */
  deliverables: string[];
}

export interface Project {
  /** URL slug 로도 쓰인다 (/portfolio/<id>/) */
  id: string;
  /** 공백으로 구분된 분류 토큰 — CATEGORY 키 */
  cat: string;
  /** 카드 배지 문구 */
  chip: string;
  /** CSS 로 그리는 목업 종류. 실제 스크린샷 파일이 아니다. */
  shot: string;
  title: string;
  problem: string;
  features: string[];
  scope: string;
  detail: ProjectDetail;
}

export const PROJECTS = raw as Project[];

/**
 * 분류 taxonomy — PROJECTS 의 `cat` 토큰에 실제로 존재하는 5종만 둔다.
 * 홈 포트폴리오 필터(index.html)의 버튼과 같은 키·같은 라벨을 쓴다.
 */
export const CATEGORIES = {
  web: { label: '웹', full: '웹 서비스' },
  app: { label: '모바일 앱', full: '모바일 앱' },
  erp: { label: 'ERP·SaaS', full: 'ERP·업무 시스템' },
  ai: { label: 'AI·자동화', full: 'AI·업무 자동화' },
  data: { label: '데이터·SEO', full: '데이터·SEO 시스템' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export function projectCategories(p: Project): CategoryKey[] {
  return p.cat.split(/\s+/).filter((c): c is CategoryKey => c in CATEGORIES);
}

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function projectsByCategory(cat: CategoryKey): Project[] {
  return PROJECTS.filter((p) => projectCategories(p).includes(cat));
}

/** 사례 상세 URL */
export function portfolioCanonical(id: string): string {
  return `${SITE.domain}/portfolio/${id}/`;
}
export const PORTFOLIO_HUB = `${SITE.domain}/portfolio/`;

/**
 * 분류 → 관련 서비스 허브.
 *
 * 실제로 사이트에 존재하는 URL 만 적는다. 사례가 없는 서비스에는 아무것도 연결하지 않는다.
 * (역방향 — 서비스 허브에서 어떤 사례를 보여줄지 — 도 이 표를 그대로 뒤집어 쓴다.)
 */
export const CATEGORY_SERVICES: Record<CategoryKey, { href: string; label: string }[]> = {
  app: [
    { href: '/flutter/', label: 'Flutter 앱개발 외주' },
    { href: '/mvp/', label: '앱·SaaS MVP 개발' },
  ],
  web: [
    { href: '/website/', label: '홈페이지·랜딩페이지 제작' },
    { href: '/web-development/', label: '웹사이트·랜딩페이지 제작' },
  ],
  erp: [
    { href: '/erp/', label: 'ERP·운영관리 시스템 개발' },
    { href: '/admin-page-development/', label: '관리자 페이지 개발' },
  ],
  ai: [
    { href: '/ai-automation/', label: 'AI 업무 자동화 개발' },
    { href: '/ai-development/', label: 'AI 외주개발' },
  ],
  data: [{ href: '/data-seo/', label: '데이터·SEO 시스템 구축' }],
};

/** 이 사례와 이어지는 서비스 허브(중복 제거, 등장 순서 유지) */
export function relatedServices(p: Project) {
  const out: { href: string; label: string }[] = [];
  for (const c of projectCategories(p)) {
    for (const s of CATEGORY_SERVICES[c]) {
      if (!out.some((x) => x.href === s.href)) out.push(s);
    }
  }
  return out;
}

/**
 * 관련 사례 — 분류가 겹치는 것을 우선하고, 겹치는 분류 수가 많은 순으로 고른다.
 * 무작위로 채우지 않는다: 겹치는 사례가 없으면 빈 배열을 돌려준다.
 */
export function relatedProjects(p: Project, limit = 3): Project[] {
  const mine = new Set(projectCategories(p));
  return PROJECTS.filter((o) => o.id !== p.id)
    .map((o) => ({ o, shared: projectCategories(o).filter((c) => mine.has(c)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.o.id.localeCompare(b.o.id))
    .slice(0, limit)
    .map((x) => x.o);
}

/**
 * 사례 상세 title.
 * 프로젝트명이 이미 서비스 유형을 담고 있으므로("교육기관 운영 ERP") 유형을 덧붙이지 않고,
 * 검색결과에서 "개발 사례"임을 알 수 있게 성격만 명시한다.
 */
export function portfolioTitle(p: Project): string {
  return `${p.title} 개발 사례 — ${p.scope.split(' · ')[0]} | ${SITE.name} ${SITE.nameEn}`;
}

/** overview 첫 문장 (설명이 길 때 description 용으로 자른다) */
export function overviewShort(p: Project): string {
  const s = p.detail.overview.trim();
  const cut = s.indexOf('. ');
  return cut > 40 ? s.slice(0, cut + 1) : s;
}

/**
 * 사례 상세 description — 실제 구축 범위만으로 만든다.
 * 성과·기간·고객사는 원본에 없으므로 넣지 않는다.
 */
export function portfolioDescription(p: Project): string {
  const feats = p.features.slice(0, 3).join(' · ');
  return `${overviewShort(p)} 구현한 기능: ${feats}. 담당 범위: ${p.scope}.`;
}

/** 서비스 허브 → 그 서비스와 이어지는 사례 (§14 / §43) */
export function projectsForService(href: string, limit = 3): Project[] {
  const cats = CATEGORY_KEYS.filter((c) => CATEGORY_SERVICES[c].some((s) => s.href === href));
  if (!cats.length) return [];
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const c of cats) {
    for (const p of projectsByCategory(c)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
