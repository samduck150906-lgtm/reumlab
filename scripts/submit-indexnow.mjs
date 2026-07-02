/**
 * IndexNow 제출 스크립트 (변경분만 제출)
 * ------------------------------------------------------------------
 * 빌드 후 실행: node scripts/submit-indexnow.mjs [--all] [--dry-run]
 * Naver(searchadvisor.naver.com)와 Bing(www.bing.com)에 동시 제출.
 *
 * 전략(§4-2): 색인 대상 URL은 이미 `out/sitemap.xml`에 lastmod와 함께 들어 있다.
 *   sitemap.xml의 <loc>+<lastmod>를 읽어 커밋된 매니페스트(scripts/.indexnow-manifest.json)와
 *   비교해 **새 URL·lastmod가 바뀐 URL만** 제출한다.
 *   lastmod는 git 커밋 기준으로 안정화(lib/lastmod.ts)돼 있으므로, 같은 커밋을
 *   재배포하면 변경분이 0이라 호스트에 아무것도 보내지 않는다(스팸 신호 방지).
 *
 * 폴백: out/sitemap.xml 이 없으면(빌드 전) 과거처럼 핵심 URL을 제출한다.
 * 플래그: --all = 전량 제출(매니페스트 무시), --dry-run = 제출 없이 변경분만 출력.
 *
 * 매니페스트는 커밋해 두면 배포 간 상태가 유지된다. CI에서 커밋하지 않으면
 * 매 배포가 "전량 신규"로 보일 수 있으니, 배포 파이프라인에서 매니페스트를
 * 커밋하거나 캐시에 보존할 것.
 *
 * 네이버 IndexNow 등록: https://searchadvisor.naver.com/indexnow
 * 키 파일: public/reumlab2026indexnow9370.txt (= https://reumlab.com/{key}.txt)
 *   → 파일명 = 키 값과 동일해야 키 검증을 통과(403 방지)한다.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SITE = 'https://reumlab.com';
const KEY = 'reumlab2026indexnow9370';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const SITEMAP_PATH = path.join(ROOT, 'out', 'sitemap.xml');
const MANIFEST_PATH = path.join(__dirname, '.indexnow-manifest.json');

const args = new Set(process.argv.slice(2));
const SUBMIT_ALL = args.has('--all');
const DRY_RUN = args.has('--dry-run');

/** out/sitemap.xml → [{ url, lastmod }] (색인 대상 URL만 들어 있음) */
function readSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) return null;
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const entries = [];
  const urlRe = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = urlRe.exec(xml))) {
    const block = m[1];
    const loc = /<loc>(.*?)<\/loc>/.exec(block)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = /<lastmod>(.*?)<\/lastmod>/.exec(block)?.[1]?.trim() ?? '';
    entries.push({ url: loc, lastmod });
  }
  return entries;
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

/** 빌드 전 등 사이트맵이 없을 때의 폴백 URL 목록 */
function fallbackCoreUrls() {
  const blogDir = path.join(ROOT, 'out', 'blog');
  const blogs = fs.existsSync(blogDir)
    ? fs
        .readdirSync(blogDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => `${SITE}/blog/${d.name}/`)
    : [];
  return [
    `${SITE}/`,
    `${SITE}/blog/`,
    `${SITE}/soho/`,
    `${SITE}/app-development/`,
    `${SITE}/web-development/`,
    `${SITE}/mvp-development/`,
    `${SITE}/flutter-development/`,
    ...blogs,
  ];
}

async function submitToHost(host, urlList) {
  const body = JSON.stringify({ host: 'reumlab.com', key: KEY, keyLocation: KEY_LOCATION, urlList });
  // 경로는 반드시 소문자 /indexnow — 네이버는 대소문자를 구분하며
  // /IndexNow(대문자)는 웹앱으로 라우팅돼 "invalid csrf token" 403을 반환한다.
  const url = `https://${host}/indexnow`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    console.log(`[IndexNow] ${host} → HTTP ${res.status} (${urlList.length} URLs)`);
    if (res.status >= 400) {
      const text = await res.text().catch(() => '');
      if (text) console.log(`[IndexNow] ${host} 응답: ${text.slice(0, 300)}`);
    }
  } catch (e) {
    console.warn(`[IndexNow] ${host} 실패:`, e.message);
  }
}

// ── 제출 대상 결정 ──────────────────────────────────────────────
const sitemap = readSitemap();
let urlList;
let nextManifest = null;

if (!sitemap) {
  console.warn('[IndexNow] out/sitemap.xml 없음 → 핵심 URL 폴백 제출');
  urlList = fallbackCoreUrls();
} else {
  const manifest = SUBMIT_ALL ? {} : loadManifest();
  nextManifest = Object.fromEntries(sitemap.map((e) => [e.url, e.lastmod]));
  urlList = sitemap.filter((e) => manifest[e.url] !== e.lastmod).map((e) => e.url);
  const kind = SUBMIT_ALL ? '전량' : '변경분';
  console.log(`[IndexNow] 사이트맵 ${sitemap.length}개 중 ${kind} ${urlList.length}개 제출 대상`);
}

if (urlList.length === 0) {
  console.log('[IndexNow] 변경된 URL 없음 — 제출 생략(호스트 호출 안 함).');
  process.exit(0);
}

urlList.forEach((u) => console.log(' ', u));

if (DRY_RUN) {
  console.log('[IndexNow] --dry-run: 실제 제출은 하지 않음.');
  process.exit(0);
}

// IndexNow는 요청당 최대 10,000 URL — 넉넉히 배치 처리
const BATCH = 10000;
for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH);
  await Promise.all([
    submitToHost('searchadvisor.naver.com', batch),
    submitToHost('www.bing.com', batch),
  ]);
}

// 제출 성공 후 매니페스트 갱신 (다음 배포의 변경분 판정 기준). 커밋해 두면 상태 유지.
if (nextManifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2) + '\n');
  console.log(`[IndexNow] 매니페스트 갱신: ${path.relative(ROOT, MANIFEST_PATH)} (커밋 권장)`);
}
