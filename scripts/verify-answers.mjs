/**
 * 질문별 답변(/answers/) 빌드 결과 검사 — npm run build 마지막에 실행된다.
 *
 * 검사하는 것
 *  1) content/geo-keywords/ 의 검색어가 하나도 빠짐없이 어느 답변 페이지 화면에 보인다.
 *  2) 답변 페이지의 내부 링크가 모두 out/ 에 실제로 있는 페이지다(없는 페이지로 보내지 않는다).
 *  3) 허브·토픽 페이지가 sitemap 과 llms.txt·llms-full.txt 에 들어 있다.
 *  4) 비교 우위·보장 표현("1위", "최고", "보장합니다")을 쓰지 않는다.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const fail = [];
const kwData = JSON.parse(readFileSync('content/geo-keywords/app-web-keywords-20261021.json', 'utf8'));
const keywords = [...kwData.queried, ...kwData.expansion].map((r) => r.kw);

const dir = join(OUT, 'answers');
if (!existsSync(join(dir, 'index.html'))) fail.push('out/answers/index.html 없음');
const topics = existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
if (topics.length < 11) fail.push(`답변 토픽 페이지 ${topics.length}개 (11개 필요)`);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const htmls = topics.map((t) => ({ t, html: readFileSync(join(dir, t, 'index.html'), 'utf8') }));
const visible = htmls.map(({ html }) => decode(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' '))).join('\n');
const missing = keywords.filter((k) => !visible.includes(k));
if (missing.length) fail.push(`화면에 없는 검색어 ${missing.length}개: ${missing.slice(0, 10).join(', ')}`);

const pages = [{ t: '(hub)', html: readFileSync(join(dir, 'index.html'), 'utf8') }, ...htmls];
for (const { t, html } of pages) {
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const p = decodeURIComponent(m[1]);
    if (p.startsWith('/_next/') || /\.[a-z0-9]+$/i.test(p)) continue;
    const file = join(OUT, p, 'index.html');
    if (!existsSync(file)) fail.push(`${t}: 깨진 내부 링크 ${p}`);
  }
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const bad of ['1위', '최고의', '업계 최초', '유일한', '보장합니다']) {
    if (text.includes(bad)) fail.push(`${t}: 금지 표현 "${bad}"`);
  }
  if (!/application\/ld\+json/.test(html)) fail.push(`${t}: JSON-LD 없음`);
  if (!html.includes('rel="canonical"')) fail.push(`${t}: canonical 없음`);
}

const sitemaps = readdirSync(OUT).filter((f) => /^sitemap.*\.xml$/.test(f)).map((f) => readFileSync(join(OUT, f), 'utf8')).join('\n');
for (const t of topics) if (!sitemaps.includes(`https://reumlab.com/answers/${t}/`)) fail.push(`sitemap 누락: /answers/${t}/`);
if (!sitemaps.includes('<loc>https://reumlab.com/answers/</loc>')) fail.push('sitemap 누락: /answers/');
const llms = readFileSync(join(OUT, 'llms.txt'), 'utf8');
const full = readFileSync(join(OUT, 'llms-full.txt'), 'utf8');
if (!llms.includes('## 질문 유형별 답변')) fail.push('llms.txt 에 질문 유형별 답변 섹션 없음');
const fullMissing = keywords.filter((k) => !full.includes(k));
if (fullMissing.length) fail.push(`llms-full.txt 에 없는 검색어 ${fullMissing.length}개: ${fullMissing.slice(0, 10).join(', ')}`);

// 5) 내부 분석 자료가 공개 산출물에 새지 않는다 — 원본 파일명·조회 메모·제외 검색어 목록.
//    out/ 의 모든 HTML·txt·xml 을 훑는다(답변 페이지만이 아니라 사이트 전체).
const LEAKS = ['.xlsx', 'ReumLab_App_Web_Keywords', 'geo-keywords', '검색어 출처', '참고지수', '데이터랩 미조회', '수요 미검증', 'expansion 은', '제외검색어', '이런 검색에는 름랩이 맞지 않습니다'];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
for (const f of walk(OUT)) {
  if (!/\.(html|txt|xml|json)$/.test(f) || f.includes('_next')) continue;
  const body = readFileSync(f, 'utf8');
  for (const w of LEAKS) if (body.includes(w)) fail.push(`내부 자료 노출 "${w}": ${f}`);
}

if (fail.length) {
  console.error('✖ 질문별 답변 검사 실패');
  for (const f of fail.slice(0, 40)) console.error('  -', f);
  process.exit(1);
}
console.log(`✓ 질문별 답변 검사 통과 — 토픽 ${topics.length}개 · 검색어 ${keywords.length}개 화면·llms-full 노출 · 내부 링크·sitemap·스키마 정상`);
