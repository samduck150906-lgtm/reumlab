import { agencyPages } from './catalog';
import type { AgencyPage } from './types';
import { agencyHref } from './types';

/**
 * 개발사 상세 페이지의 형제 링크 — 같은 업종의 다른 개발 범위 + 같은 개발 범위의 이웃 업종.
 *
 * 왜 필요한가 (2026-10 네이버 색인 감사)
 *  상세 1,795개 중 974개가 허브 한 곳에서만 링크를 받았다. 허브는 2.4MB 짜리 접힌 목록이라
 *  수집기가 깊이 따라가지 않으면 그 페이지들은 사이트 안에서 사실상 고립된다. 같은 업종
 *  (예: 창호업체의 홈페이지·관리 프로그램·앱)끼리도 서로 링크가 없었다.
 *
 * 규칙
 *  - 같은 업종: 같은 industry 의 다른 페이지, 최대 SAME_INDUSTRY_MAX 개(카탈로그 순서).
 *  - 같은 개발 범위: 같은 serviceAxis 를 허브와 같은 순서(대표 키워드 가나다)로 세운 원형 목록에서
 *    앞뒤 이웃을 번갈아 고른다. 원형이라 모든 페이지가 이웃에게서 고르게 링크를 받는다.
 *  - 자기 자신·relatedRoutes 에 이미 있는 링크·앞 목록에 이미 나온 페이지는 다시 넣지 않는다.
 */
const SAME_INDUSTRY_MAX = 6;
const SAME_AXIS_MAX = 6;

const byIndustry = new Map<string, AgencyPage[]>();
const byAxis = new Map<string, AgencyPage[]>();
for (const page of agencyPages) {
  byIndustry.set(page.industry, [...(byIndustry.get(page.industry) ?? []), page]);
  byAxis.set(page.serviceAxis, [...(byAxis.get(page.serviceAxis) ?? []), page]);
}
for (const list of byAxis.values()) list.sort((a, b) => a.primaryKeyword.localeCompare(b.primaryKeyword, 'ko'));

export function agencySiblings(page: AgencyPage): { sameIndustry: AgencyPage[]; sameAxis: AgencyPage[] } {
  const taken = new Set<string>([agencyHref(page), ...page.relatedRoutes.map((link) => link.href)]);
  const pick = (candidate: AgencyPage) => {
    const href = agencyHref(candidate);
    if (taken.has(href)) return false;
    taken.add(href);
    return true;
  };

  const sameIndustry: AgencyPage[] = [];
  for (const candidate of byIndustry.get(page.industry) ?? []) {
    if (sameIndustry.length >= SAME_INDUSTRY_MAX) break;
    if (pick(candidate)) sameIndustry.push(candidate);
  }

  const ring = byAxis.get(page.serviceAxis) ?? [];
  const at = ring.findIndex((candidate) => candidate.slug === page.slug);
  const sameAxis: AgencyPage[] = [];
  for (let step = 1; at >= 0 && step < ring.length && sameAxis.length < SAME_AXIS_MAX; step++) {
    for (const offset of [step, -step]) {
      if (sameAxis.length >= SAME_AXIS_MAX) break;
      const candidate = ring[(at + offset + ring.length) % ring.length];
      if (pick(candidate)) sameAxis.push(candidate);
    }
  }
  return { sameIndustry, sameAxis };
}
