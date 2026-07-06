/**
 * 프로그래매틱 업종 페이지(앱/비용/솔루션)의 "다른 업종" 형제 링크 선택기.
 *
 * 배열 앞쪽 N개만 고정 슬라이스하면(.slice(0, 8)) 뒤에 추가된 업종은
 * 다른 페이지에서 거의 링크를 받지 못한다. 고정 스트라이드로 오프셋을 주면
 * 전체 배열에서 각 항목이 정확히 같은 횟수만큼 인바운드 링크를 받는다
 * (오프셋 하나당 정확히 1개 페이지가 그 항목을 가리키는 전단사 성질).
 */
const STRIDE = 13;

export function pickSiblings<T extends { slug: string }>(all: T[], currentSlug: string, count: number): T[] {
  const n = all.length;
  const i = all.findIndex((x) => x.slug === currentSlug);
  if (i === -1 || n <= 1) return [];

  const picked: T[] = [];
  const seen = new Set([currentSlug]);
  for (let k = 1; picked.length < count && k < n; k++) {
    const item = all[(i + k * STRIDE) % n];
    if (!seen.has(item.slug)) {
      seen.add(item.slug);
      picked.push(item);
    }
  }
  return picked;
}
