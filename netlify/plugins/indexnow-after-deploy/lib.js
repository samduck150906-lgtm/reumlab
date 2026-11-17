// indexnow-after-deploy 플러그인의 순수 함수 — Netlify 플러그인 모듈은 이벤트 핸들러만 export 할 수 있어 분리했다.
import fs from 'node:fs';

export const ORIGIN = 'https://reumlab.com';

/** URL별로 더 최근(ISO 문자열 비교) lastmod 를 남기는 병합. */
export function mergeManifests(committed = {}, cached = {}) {
  const out = { ...committed };
  for (const [url, lastmod] of Object.entries(cached)) {
    if (!(url in out) || String(lastmod) > String(out[url])) out[url] = lastmod;
  }
  return out;
}

/** 최신 성공 배포와 커밋된 기준 중 페이지별로 더 최근에 확인된 내용을 사용한다. */
export function mergeContentManifests(committed = {}, cached = {}) {
  const out = { ...committed };
  for (const [url, item] of Object.entries(cached)) {
    if (!item || typeof item.hash !== 'string' || !Number.isFinite(Date.parse(item.lastmod))) continue;
    const previous = out[url];
    if (!previous || Date.parse(item.lastmod) > Date.parse(previous.lastmod)) out[url] = item;
  }
  return out;
}

export function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

/** This user-authorized GEO release must stay inside its build-verified URL set.
 * The submitter additionally intersects candidates with the indexable sitemap.
 */
export function verifiedGeoRelease(report, changes, pending) {
  if (report?.completed_page_coverage !== 2881 || report?.article_pages !== 59 ||
      !Array.isArray(report?.covered_paths) || !Array.isArray(changes) || !Array.isArray(pending)) return false;
  const paths = new Set(report.covered_paths);
  if (paths.size !== 2881 || report.covered_paths.length !== 2881 || changes.length <= 50 || changes.length > 2654) return false;
  const inScope = value => {
    try {
      const url = new URL(value);
      return url.origin === ORIGIN && !url.search && !url.hash &&
        paths.has(decodeURIComponent(url.pathname).normalize('NFC'));
    } catch { return false; }
  };
  return changes.every(change => change.action === 'changed' && inScope(change.url)) && pending.every(inScope);
}

/** 새 배포 공개 확인 — 이번 빌드에만 있는 정적 파일이 운영 도메인에서 200 인지 본다. */
export async function waitForLiveBuild({ buildId, fetchImpl = fetch, attempts = 12, delayMs = 15_000, origin = ORIGIN }) {
  const url = `${origin}/_next/static/${buildId}/_buildManifest.js`;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchImpl(url, { method: 'GET', headers: { 'cache-control': 'no-cache' } });
      if (res.status === 200) return { live: true, url, attempt: i + 1 };
    } catch {
      // 일시적 네트워크 오류는 재시도
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return { live: false, url, attempt: attempts };
}

