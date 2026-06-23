/**
 * IndexNow 제출 스크립트
 * 빌드 후 실행: node scripts/submit-indexnow.mjs
 * Naver(searchadvisor.naver.com)와 Bing(www.bing.com)에 동시 제출
 *
 * 네이버 IndexNow 등록: https://searchadvisor.naver.com/indexnow
 * 키 파일: public/reumlab2026indexnow9370.txt (= 표준 위치 https://reumlab.com/{key}.txt)
 *   → 파일명 = 키 값과 동일해야 IndexNow 키 검증을 통과(403 방지)한다.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SITE = 'https://reumlab.com';
const KEY = 'reumlab2026indexnow9370';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

// 블로그 포스트 slug 목록 읽기 (빌드 결과 디렉터리 기준)
function getBlogSlugs() {
  const blogDir = path.join(ROOT, 'out', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `${SITE}/blog/${d.name}/`);
}

// 핵심 URL 목록 (홈·블로그 인덱스·상담·서비스 페이지·블로그 글)
const CORE_URLS = [
  `${SITE}/`,
  `${SITE}/blog/`,
  `${SITE}/consultation/`,
  `${SITE}/soho/`, // 소상공인·자영업자 홈페이지제작 전용 랜딩
  `${SITE}/app-development/`,
  `${SITE}/web-development/`,
  `${SITE}/mvp-development/`,
  `${SITE}/flutter-development/`,
  ...getBlogSlugs(),
];

async function submitToHost(host) {
  const body = JSON.stringify({
    host: 'reumlab.com',
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: CORE_URLS,
  });

  const url = `https://${host}/IndexNow`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    console.log(`[IndexNow] ${host} → HTTP ${res.status} (${CORE_URLS.length} URLs)`);
  } catch (e) {
    console.warn(`[IndexNow] ${host} 실패:`, e.message);
  }
}

console.log('[IndexNow] 제출 URL 목록:');
CORE_URLS.forEach((u) => console.log(' ', u));

await Promise.all([
  submitToHost('searchadvisor.naver.com'),
  submitToHost('www.bing.com'),
]);
