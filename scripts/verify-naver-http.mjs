/**
 * Production/preview HTTP smoke test for Naver Yeti parity. Read-only: no form
 * submission, Search Advisor mutation, or IndexNow submission is performed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { htmlSignals, sha256 } from './neo-lib.mjs';

const argv = process.argv.slice(2);
const option = (name, fallback = '') => {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : fallback;
};
const origin = new URL(option('--origin', 'https://reumlab.com')).origin;
const jsonPath = option('--json');
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36';
const YETI_UA = 'Mozilla/5.0 (compatible; Yeti/1.1; +https://naver.me/spd)';
const key = '67cc4ff3436125d6a5eb18de9bb63dd0';

const documents = [
  { path: '/', label: '홈/문의', status: 200 },
  { path: '/app-agency/', label: '대표 서비스', status: 200 },
  { path: '/guide/mvp-cost/', label: '대표 가이드', status: 200 },
  { path: '/portfolio/edu-erp/', label: '대표 사례', status: 200 },
  { path: '/geo-website/', label: 'NEO 연관 서비스', status: 200 },
  { path: '/__neo-http-missing__/', label: '404', status: 404 },
];
const assets = [
  { path: '/robots.txt', status: 200, type: /text\/plain/i },
  { path: '/sitemap.xml', status: 200, type: /(?:application|text)\/xml/i },
  { path: '/feed.xml', status: 200, type: /(?:application|text)\/(?:rss\+)?xml/i },
  { path: `/${key}.txt`, status: 200, type: /text\/plain/i },
];
const redirects = [
  ['/l/seongnam-app-dev-cost', '/app-development/seongnam/'],
  ['/l/seongnam-app-dev-quote', '/app-development/seongnam/'],
  ['/l/seongnam-web-dev-cost', '/web-development/seongnam/'],
  ['/l/seongnam-homepage-dev-quote', '/web-development/seongnam/'],
];

async function request(path, userAgent, redirect = 'manual') {
  const response = await fetch(new URL(path, origin), {
    redirect,
    headers: { 'user-agent': userAgent, accept: '*/*', 'accept-language': 'ko-KR,ko;q=0.9' },
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.text();
  return {
    status: response.status,
    location: response.headers.get('location') ?? '',
    contentType: response.headers.get('content-type') ?? '',
    body,
    sha256: sha256(body),
    ...htmlSignals(body),
  };
}

const failures = [];
const results = [];
for (const target of [...documents, ...assets]) {
  const [browser, yeti] = await Promise.all([
    request(target.path, BROWSER_UA),
    request(target.path, YETI_UA),
  ]);
  const expectedCanonical = `${origin}${target.path}`;
  const isIndexableDocument = documents.includes(target) && target.status === 200;
  if (browser.status !== target.status || yeti.status !== target.status) {
    failures.push(`${target.path}: expected ${target.status}, browser ${browser.status}, Yeti ${yeti.status}`);
  }
  if (browser.status !== yeti.status || browser.sha256 !== yeti.sha256) {
    failures.push(`${target.path}: browser/Yeti response differs`);
  }
  if (target.type && (!target.type.test(browser.contentType) || !target.type.test(yeti.contentType))) {
    failures.push(`${target.path}: unexpected content-type ${browser.contentType} / ${yeti.contentType}`);
  }
  if (isIndexableDocument) {
    if (browser.canonical !== expectedCanonical) failures.push(`${target.path}: canonical ${browser.canonical || 'missing'} != ${expectedCanonical}`);
    if (/noindex/i.test(browser.robots)) failures.push(`${target.path}: indexable representative has noindex`);
  }
  results.push({ kind: 'resource', label: target.label ?? target.path, path: target.path, expectedStatus: target.status, browser, yeti, parity: browser.status === yeti.status && browser.sha256 === yeti.sha256 });
}

for (const [from, finalPath] of redirects) {
  const [browser, yeti] = await Promise.all([request(from, BROWSER_UA), request(from, YETI_UA)]);
  const expectedLocation = `${origin}${finalPath}`;
  const browserLocation = new URL(browser.location || from, origin).href;
  const yetiLocation = new URL(yeti.location || from, origin).href;
  if (browser.status !== 301 || yeti.status !== 301) failures.push(`${from}: single-hop status is not 301`);
  if (browserLocation !== expectedLocation || yetiLocation !== expectedLocation) failures.push(`${from}: final location mismatch`);
  const final = await request(finalPath, YETI_UA);
  if (final.status !== 200) failures.push(`${from}: final canonical ${finalPath} returned ${final.status}`);
  if (final.canonical !== expectedLocation) failures.push(`${from}: destination canonical mismatch (${final.canonical || 'missing'})`);
  results.push({ kind: 'redirect', path: from, expectedLocation, browser, yeti, final: { path: finalPath, status: final.status, canonical: final.canonical } });
}

const report = { generatedAt: new Date().toISOString(), origin, readOnly: true, failures, results };
if (jsonPath) {
  const absolute = resolve(jsonPath);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(`JSON ${absolute}`);
}
for (const row of results) {
  if (row.kind === 'resource') console.log(`${row.path} ${row.browser.status} · ${row.browser.contentType || '-'} · Yeti parity ${row.parity ? 'O' : 'X'}${row.browser.canonical ? ` · ${row.browser.canonical}` : ''}`);
  else console.log(`${row.path} ${row.browser.status} → ${row.final.path} ${row.final.status}`);
}
for (const failure of failures) console.error(`✗ ${failure}`);
if (failures.length) process.exit(1);
console.log(`✓ HTTP/Yeti 검증 통과 — ${results.length}개 대상, 브라우저/Yeti 본문 차이 0`);
