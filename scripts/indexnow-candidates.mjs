/** 현재 사이트맵의 실제 변경 URL과 이전 전송 실패분만 재시도한다. */
export function selectIndexNowUrls(sitemap, changes, pending, manifest, submitAll = false) {
  const candidates = submitAll
    ? new Set(sitemap.map((entry) => entry.url))
    : new Set([...pending, ...changes.filter((entry) => entry.action === 'added' || entry.action === 'changed').map((entry) => entry.url)]);
  return sitemap.filter((entry) => candidates.has(entry.url) && (submitAll || manifest[entry.url] !== entry.lastmod)).map((entry) => entry.url);
}
