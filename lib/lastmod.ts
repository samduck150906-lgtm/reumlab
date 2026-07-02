/**
 * 사이트맵 lastmod 안정화 헬퍼 (빌드 타임 전용)
 * ------------------------------------------------------------------
 * 문제: `app/sitemap.ts`가 다수 엔트리에 `new Date()`(빌드시각)를 쓰면
 *      매 배포마다 "모든 URL이 변경됨" 신호를 보내 크롤 예산을 낭비하고
 *      lastmod 신뢰도를 떨어뜨린다.
 *
 * 해결: 콘텐츠 소스 파일의 **git 마지막 커밋 날짜**를 lastmod로 쓴다.
 *      → 같은 커밋을 재배포하면 lastmod가 그대로라 크롤러가 churn을 겪지 않고,
 *        해당 소스가 실제로 바뀐 배포에서만 lastmod가 전진한다.
 *
 * 폴백 순서: 파일별 커밋 날짜 → (shallow clone 등으로 없으면) HEAD 커밋 날짜 →
 *           (git 미가용 시) 고정 상수. 어느 경우에도 "빌드마다 변하는 값"은 없다.
 *
 * 이 모듈은 `next build` 시 Node 런타임에서만 호출된다(정적 export sitemap).
 */
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();

/** git 미가용(폴백) 시 사용할 고정 날짜 — 빌드마다 변하지 않는 값이면 목적 달성 */
const FALLBACK = new Date('2026-01-01T00:00:00Z');

const cache = new Map<string, Date>();
let headDate: Date | null | undefined; // undefined=미조회, null=조회했으나 없음

function gitDate(args: string[]): string {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function getHeadDate(): Date | null {
  if (headDate !== undefined) return headDate;
  const iso = gitDate(['log', '-1', '--format=%cI']);
  headDate = iso ? new Date(iso) : null;
  return headDate;
}

/**
 * 소스 파일(레포 상대경로)의 git 마지막 커밋 날짜를 lastmod로 반환.
 * 결과는 프로세스 내 캐시된다.
 */
export function gitLastModified(relPath: string): Date {
  const cached = cache.get(relPath);
  if (cached) return cached;

  let date = FALLBACK;
  const iso = gitDate(['log', '-1', '--format=%cI', '--', relPath]);
  if (iso) {
    date = new Date(iso);
  } else {
    // 파일별 이력이 없으면(shallow clone) HEAD 커밋 날짜로 — 커밋 단위로는 안정적
    const head = getHeadDate();
    if (head) date = head;
  }

  cache.set(relPath, date);
  return date;
}
