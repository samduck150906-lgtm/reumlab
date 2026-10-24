/**
 * Bing 색인 준비 상태 검사 — ChatGPT 검색·Microsoft Copilot 은 Bing 색인을 근거로 답한다.
 * 네이버 검사(verify-naver.mjs)와 같은 위치에서 빌드 결과물(out/)만 본다. 외부 요청은 하지 않는다.
 *
 *  1) Bing 웹마스터 도구 소유 확인 파일(BingSiteAuth.xml)이 배포본에 있다.
 *  2) IndexNow 키 파일이 키 값과 같은 이름으로 배포본에 있다(Bing·네이버 즉시 색인 알림).
 *  3) robots.txt 가 bingbot 을 막지 않고, sitemap 을 알린다.
 *  4) sitemap index 의 자식 사이트맵이 모두 존재하고 URL 이 https://reumlab.com 으로 시작한다.
 *  5) 핵심 페이지가 Bing 이 읽는 기본 신호(title·description·canonical·og:title·JSON-LD)를 갖는다.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const SITE = 'https://reumlab.com';
const KEY = '67cc4ff3436125d6a5eb18de9bb63dd0';
const fail = [];

if (!existsSync(join(OUT, 'BingSiteAuth.xml'))) fail.push('out/BingSiteAuth.xml 없음 (Bing 웹마스터 소유 확인)');
const keyFile = join(OUT, `${KEY}.txt`);
if (!existsSync(keyFile) || readFileSync(keyFile, 'utf8').trim() !== KEY) fail.push('IndexNow 키 파일 없음 또는 내용 불일치');

const robots = existsSync(join(OUT, 'robots.txt')) ? readFileSync(join(OUT, 'robots.txt'), 'utf8') : '';
if (!/User-Agent:\s*bingbot/i.test(robots)) fail.push('robots.txt 에 bingbot 그룹 없음');
if (/User-Agent:\s*bingbot[\s\S]*?Disallow:\s*\/\s*$/im.test(robots)) fail.push('robots.txt 가 bingbot 전체 차단');
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail.push('robots.txt 에 Sitemap 선언 없음');

const index = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
let urls = 0;
for (const c of children) {
  const f = join(OUT, new URL(c).pathname);
  if (!existsSync(f)) { fail.push(`sitemap 자식 없음: ${c}`); continue; }
  const locs = [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  urls += locs.length;
  for (const u of locs) if (!u.startsWith(`${SITE}/`)) fail.push(`다른 호스트 URL: ${u}`);
}

const CORE = ['/', '/app-development/', '/web-development/', '/mvp/', '/answers/', '/answers/app-development/', '/answers/website/'];
for (const p of CORE) {
  const f = join(OUT, p, 'index.html');
  if (!existsSync(f)) { fail.push(`핵심 페이지 없음: ${p}`); continue; }
  const h = readFileSync(f, 'utf8');
  if (!/<title>[^<]{10,}<\/title>/.test(h)) fail.push(`${p}: title 없음`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(h)) fail.push(`${p}: description 없음/짧음`);
  if (!/rel="canonical"/.test(h)) fail.push(`${p}: canonical 없음`);
  if (!/property="og:title"/.test(h)) fail.push(`${p}: og:title 없음`);
  if (!/application\/ld\+json/.test(h)) fail.push(`${p}: JSON-LD 없음`);
  if (/<meta name="robots" content="[^"]*noindex/.test(h)) fail.push(`${p}: noindex`);
}

if (fail.length) {
  console.error('✖ Bing 색인 준비 검사 실패');
  for (const f of fail.slice(0, 40)) console.error('  -', f);
  process.exit(1);
}
console.log(`✓ Bing 검사 통과 — 소유확인·IndexNow 키·bingbot 허용·사이트맵 ${children.length}개(${urls} URL)·핵심 페이지 메타 정상`);
