/**
 * 지역 페이지 품질 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:regions
 *   node scripts/verify-region-pages.mjs [outDir]
 *
 * 검사 항목
 *   1. 렌더 사고 — 빈 H1 / H1 복수 / undefined / null / [object Object] / NaN
 *   2. 중복 metadata — title·description·H1 완전 중복
 *   3. 얇은 본문 — <main> 텍스트가 기준 미만
 *   4. 내부링크 — 링크 0개 / 산출물에 없는 href(404 링크)
 *   5. 중복 콘텐츠 — 같은 서비스의 다른 지역과 4-gram Jaccard 유사도,
 *      그리고 "지역명만 치환하면 똑같아지는 문장" 비율
 *
 * 색인 대상(noindex 아님)과 비색인을 나눠 리포트한다 — 검색에 실제 영향을 주는 쪽은 앞이다.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const SERVICES = ['app-development', 'web-development', 'mvp', 'flutter', 'ai-development'];
const MIN_BODY = 900; // 공백 제외 글자 수

const fail = [];
const add = (kind, msg) => fail.push(`[${kind}] ${msg}`);

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// ─── 페이지 수집
const pages = [];
for (const svc of SERVICES) {
  const dir = join(OUT, svc);
  if (!existsSync(dir)) continue;
  for (const e of readdirSync(dir)) {
    const d = join(dir, e);
    const f = join(d, 'index.html');
    if (!statSync(d).isDirectory() || !existsSync(f)) continue;
    const html = readFileSync(f, 'utf8');
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    pages.push({
      url: `/${svc}/${e}/`,
      svc,
      region: e,
      html,
      title: (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '',
      desc: (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '',
      h1s,
      canonical: (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || '',
      noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
      body: strip(main ? main[1] : html),
      links: [...new Set([...html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)].map((m) => m[1]))],
    });
  }
}
if (!pages.length) {
  console.error(`✗ ${OUT} 에 지역 페이지가 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}

// ─── 1. 렌더 사고
const BAD = /\bundefined\b|\bnull\b|\[object Object\]|\bNaN\b/;
for (const p of pages) {
  if (!p.h1s.length || !p.h1s[0]) add('h1', `H1 없음: ${p.url}`);
  if (p.h1s.length > 1) add('h1', `H1 ${p.h1s.length}개: ${p.url}`);
  if (!p.title) add('title', `title 없음: ${p.url}`);
  if (!p.desc) add('desc', `description 없음: ${p.url}`);
  if (!p.canonical) add('canonical', `canonical 없음: ${p.url}`);
  for (const [k, v] of [['title', p.title], ['description', p.desc], ['h1', p.h1s[0] || ''], ['body', p.body]]) {
    if (BAD.test(v)) add('render', `${k} 에 렌더 사고 문자열: ${p.url}`);
  }
}

// ─── 2. 중복 metadata
for (const key of ['title', 'desc', 'h1']) {
  const m = new Map();
  for (const p of pages) {
    const v = key === 'h1' ? p.h1s[0] || '' : p[key];
    (m.get(v) || m.set(v, []).get(v)).push(p.url);
  }
  for (const [v, urls] of m) {
    if (urls.length > 1) add('duplicate', `${key} 중복 ${urls.length}건 — ${urls.slice(0, 3).join(', ')}`);
  }
}

// ─── 3. 얇은 본문
for (const p of pages) {
  p.len = p.body.replace(/\s/g, '').length;
  if (p.len < MIN_BODY) add('thin', `본문 ${p.len}자 (<${MIN_BODY}): ${p.url}`);
}

// ─── 4. 내부링크
const exists = (href) => {
  const rel = decodeURIComponent(href).replace(/^\//, '');
  return [join(OUT, rel, 'index.html'), join(OUT, rel)].some((c) => existsSync(c) && statSync(c).isFile());
};
const linkCache = new Map();
for (const p of pages) {
  if (!p.links.length) add('links', `내부링크 0개: ${p.url}`);
  for (const href of p.links) {
    if (!linkCache.has(href)) linkCache.set(href, exists(href));
    if (!linkCache.get(href)) add('404', `없는 링크 ${href} (출처 ${p.url})`);
  }
}

// ─── 5. 중복 콘텐츠
const REGION_KO = {};
for (const p of pages) {
  // H1 = "{지역} {서비스}" 이므로 앞 토큰이 지역 표기
  REGION_KO[p.region] = (p.h1s[0] || '').split(' ')[0] || '';
}
const shingles = (t, n = 4) => {
  const k = t.toLowerCase().match(/[a-z0-9]+|[가-힣]+/g) || [];
  const s = new Set();
  for (let i = 0; i + n <= k.length; i++) s.add(k.slice(i, i + n).join(' '));
  return s;
};
const jac = (a, b) => { if (!a.size || !b.size) return 0; let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); };
for (const p of pages) {
  const ko = REGION_KO[p.region];
  const masked = ko ? p.body.split(ko).join('§') : p.body;
  p.sh = shingles(masked);
  p.sents = new Set(masked.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => s.length > 8));
}

function report(label, subset) {
  if (subset.length < 2) { console.log(`\n── ${label}: ${subset.length}개 (비교 불가)`); return; }
  let sum = 0, cnt = 0, b90 = 0, b80 = 0, b70 = 0, max = 0, maxPair = '';
  for (const svc of SERVICES) {
    const g = subset.filter((p) => p.svc === svc);
    for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
      const v = jac(g[i].sh, g[j].sh);
      sum += v; cnt++;
      if (v >= 0.9) b90++; else if (v >= 0.8) b80++; else if (v >= 0.7) b70++;
      if (v > max) { max = v; maxPair = `${g[i].url} ↔ ${g[j].url}`; }
    }
  }
  const swap = subset.map((p) => {
    const peers = subset.filter((q) => q !== p && q.svc === p.svc);
    if (!peers.length) return 0;
    let shared = 0;
    for (const s of p.sents) if (peers.some((q) => q.sents.has(s))) shared++;
    return p.sents.size ? shared / p.sents.size : 0;
  });
  const avgSwap = swap.reduce((a, b) => a + b, 0) / swap.length;
  console.log(`\n── ${label}: ${subset.length}개`);
  console.log(`   본문 길이  최소 ${Math.min(...subset.map((p) => p.len))} / 평균 ${Math.round(subset.reduce((a, b) => a + b.len, 0) / subset.length)} / 최대 ${Math.max(...subset.map((p) => p.len))}`);
  console.log(`   내부링크  평균 ${Math.round(subset.reduce((a, b) => a + b.links.length, 0) / subset.length)}개`);
  if (cnt) {
    console.log(`   같은 서비스·다른 지역 유사도  평균 ${(sum / cnt * 100).toFixed(1)}%  최대 ${(max * 100).toFixed(1)}%`);
    console.log(`     90%+ ${b90} / 80~90% ${b80} / 70~80% ${b70}`);
    if (max >= 0.8) console.log(`     최고 쌍: ${maxPair}`);
  }
  console.log(`   지역명만 치환하면 같아지는 문장 비율  평균 ${(avgSwap * 100).toFixed(1)}%`);
}

console.log(`지역×서비스 페이지 ${pages.length}개 (색인 ${pages.filter((p) => !p.noindex).length} / noindex ${pages.filter((p) => p.noindex).length})`);
report('색인 대상 (검색에 실제 영향)', pages.filter((p) => !p.noindex));
report('noindex (거점 밖)', pages.filter((p) => p.noindex));

console.log('\n───────────────────────────────────────────');
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 30).forEach((f) => console.log('  ' + f));
  if (fail.length > 30) console.log(`  ... 외 ${fail.length - 30}건`);
  process.exit(1);
}
console.log('✓ 지역 페이지 품질 검증 통과 — 문제 없음');
