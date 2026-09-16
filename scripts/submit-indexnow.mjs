/**
 * IndexNow 제출 스크립트 (변경분만 제출)
 * ------------------------------------------------------------------
 * 프로덕션 빌드 후 실행: node scripts/submit-indexnow.mjs --submit [--all]
 * 검증: node scripts/submit-indexnow.mjs --dry-run
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
 * 키 파일: public/67cc4ff3436125d6a5eb18de9bb63dd0.txt (= https://reumlab.com/{key}.txt)
 *   → 파일명 = 키 값과 동일해야 키 검증을 통과(403 방지)한다.
 */
import fs from 'fs';
import { readSitemapXml } from './read-sitemap.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SITE = 'https://reumlab.com';
// IndexNow 규격(8~128자 16진수)에 맞춘 공개 소유권 키.
const KEY = '67cc4ff3436125d6a5eb18de9bb63dd0';
const SITEMAP_PATH = path.join(ROOT, 'out', 'sitemap.xml');
const MANIFEST_PATH = path.join(__dirname, '.indexnow-manifest.json');

const args = new Set(process.argv.slice(2));
const SUBMIT_ALL = args.has('--all');
const DRY_RUN = args.has('--dry-run');
const SUBMIT_REQUESTED = args.has('--submit');
const ALLOW_LARGE_BATCH = args.has('--allow-large-batch') || SUBMIT_ALL;
const parsedMaxAutomaticUrls = Number.parseInt(process.env.INDEXNOW_MAX_AUTO_URLS ?? '50', 10);
const MAX_AUTOMATIC_URLS = Number.isFinite(parsedMaxAutomaticUrls) && parsedMaxAutomaticUrls > 0
  ? parsedMaxAutomaticUrls
  : 50;

// Netlify deploy-preview·branch-deploy는 검증용 산출물이다. 여기서 production
// canonical URL을 IndexNow에 보내면 공개 전 변경을 검색엔진에 알리게 된다.
// 로컬의 명시적 실행은 그대로 허용하고, Netlify가 CONTEXT를 제공한 경우에만
// production 외 컨텍스트를 차단한다. --dry-run은 어떤 컨텍스트에서도 허용한다.
const NETLIFY_CONTEXT = process.env.CONTEXT?.trim();
if (!DRY_RUN && NETLIFY_CONTEXT && NETLIFY_CONTEXT !== 'production') {
  console.log(`[IndexNow] Netlify ${NETLIFY_CONTEXT} 컨텍스트 — 외부 제출 생략.`);
  process.exit(0);
}

// 호출자가 실전송 의도를 명시하지 않으면 기본적으로 닫힌다. Netlify production은
// package.json의 seo:indexnow가 --submit을 붙이고, 수동 실행도 같은 명령만 사용한다.
if (!DRY_RUN && !SUBMIT_REQUESTED) {
  console.log('[IndexNow] 명시적 --submit 없음 — 외부 제출 생략. 검증은 --dry-run을 사용하세요.');
  process.exit(0);
}

/** out/sitemap.xml → [{ url, lastmod }] (색인 대상 URL만 들어 있음) */
function readSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) return null;
  // 사이트맵은 index 로 분할돼 있을 수 있다 — 자식까지 합쳐 읽는다.
  const xml = readSitemapXml(path.join(ROOT, 'out'));
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
  // 키가 호스트 루트의 /{key}.txt에 있으므로 option 1을 사용한다.
  // 루트 키에 keyLocation을 함께 보내면 Bing이 별도 경로(option 2) 검증으로 처리해
  // SiteVerificationNotCompleted를 반환할 수 있다.
  const body = JSON.stringify({ host: 'reumlab.com', key: KEY, urlList });
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
    return res.status < 400;
  } catch (e) {
    console.warn(`[IndexNow] ${host} 실패:`, e.message);
    return false;
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

// 한 소스 파일의 lastmod가 많은 URL에 공유되거나 매니페스트가 유실되면 정상적인
// 콘텐츠 변경보다 훨씬 큰 배치가 생길 수 있다. 자동 배포에서는 이를 그대로 보내지
// 않고, 사람이 변경 범위를 확인한 뒤 --allow-large-batch 또는 --all로 승인한다.
if (urlList.length > MAX_AUTOMATIC_URLS && !ALLOW_LARGE_BATCH) {
  console.log(
    `[IndexNow] 대량 제출 차단 — 변경분 ${urlList.length}개, 자동 한도 ${MAX_AUTOMATIC_URLS}개. ` +
    '범위를 확인한 뒤 --allow-large-batch를 명시하세요.',
  );
  process.exit(0);
}

urlList.forEach((u) => console.log(' ', u));

if (DRY_RUN) {
  console.log('[IndexNow] --dry-run: 실제 제출은 하지 않음.');
  process.exit(0);
}

// IndexNow는 요청당 최대 10,000 URL — 넉넉히 배치 처리
const BATCH = 10000;
let submissionFailed = false;
for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH);
  const results = await Promise.all([
    submitToHost('searchadvisor.naver.com', batch),
    submitToHost('www.bing.com', batch),
  ]);
  if (results.some((ok) => !ok)) submissionFailed = true;
}

// 제출 성공 후 매니페스트 갱신 (다음 배포의 변경분 판정 기준). 커밋해 두면 상태 유지.
if (nextManifest && !submissionFailed) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2) + '\n');
  console.log(`[IndexNow] 매니페스트 갱신: ${path.relative(ROOT, MANIFEST_PATH)} (커밋 권장)`);
}

if (submissionFailed) {
  console.error('[IndexNow] 하나 이상의 검색엔진이 제출을 거부했습니다. 매니페스트는 갱신하지 않습니다.');
  process.exitCode = 1;
}
