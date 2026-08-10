/**
 * 최종 QA — 신호 교차 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:qa
 *   node scripts/qa-final.mjs [outDir]
 *
 * 개별 검사기 11종은 각자의 영역 안에서 이미 통과한다.
 * 이 스크립트가 보는 것은 그 사이의 "모순" 이다 — 각각은 맞는데 서로 다른 말을 하는 경우.
 *
 * 교차 검사 항목
 *   1. 5중 URL 정합 — 실제 경로 · canonical · og:url · schema url · sitemap loc
 *   2. 색인 판정 3중 정합 — robots 메타 · 사이트맵 포함 · 내부링크 존재
 *   3. JSON-LD 문법·중복·허위 필드
 *   4. Breadcrumb item 이 실제 200 이고 canonical 과 같은가
 *   5. 내부링크 → 404 / 리다이렉트 / 앵커 깨짐
 *   6. 동적 라우트의 없는 slug 가 실제로 404 인가
 *   7. 임시·플레이스홀더 문구가 공개 페이지에 남았는가
 *   8. 근거 없는 실적·수치 주장
 *   9. hidden SEO 텍스트
 *  10. 날짜가 빌드 시각으로 덮이는가
 *  11. 공개 경로의 민감 파일
 *
 * 이 검사는 정적이다. HTTP 헤더·리다이렉트 실동작·라이브 색인 상태는 배포 후에만 확인된다.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'out';
const DOMAIN = 'https://reumlab.com';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);
const read = (p) => readFileSync(p, 'utf8');

// ─── 페이지 수집
const NOT_A_PAGE = /^\/(404\.html|__forms\.html|google[\w-]*\.html|naver[\w-]*\.html)$/;
const pages = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) {
      const pathname = '/' + relative(OUT, p).replace(/index\.html$/, '');
      if (NOT_A_PAGE.test(pathname)) continue;
      const html = read(p);
      pages.push({
        pathname,
        html,
        noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
      });
    }
  }
})(OUT);
const indexed = pages.filter((p) => !p.noindex);
const byPath = new Map(pages.map((p) => [p.pathname, p]));

// 사이트맵
const sitemapXml = existsSync(join(OUT, 'sitemap.xml')) ? read(join(OUT, 'sitemap.xml')) : '';
const sitemapUrls = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

// 리다이렉트 출발지
const redirectFrom = new Set();
const redirectForce = new Set();
if (existsSync(join(OUT, '_redirects'))) {
  for (const line of read(join(OUT, '_redirects')).split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const from = t.split(/\s+/)[0];
    // 경로를 그대로 넣는다. 예전엔 끝에 슬래시를 붙여 정규화했는데, 그러면
    // `/portfolio → /portfolio/ 301` 규칙 때문에 실제 파일이 있는 /portfolio/ 까지
    // "리다이렉트 대상"으로 오판했다(경고 4,291건). Netlify 는 파일이 있으면 파일을 먼저 서빙한다.
    if (from) redirectFrom.add(from);
    // `!` 가 붙은 강제 규칙은 파일보다 우선한다 — 실제 페이지를 덮으면 색인 URL 이 사라진다.
    if (from && /\d{3}!\s*$/.test(t)) redirectForce.add(from);
  }
}

// ─── 1. 5중 URL 정합
let urlConflict = 0;
for (const p of indexed) {
  const expect = DOMAIN + p.pathname;
  const canon = (p.html.match(/<link rel="canonical" href="([^"]*)"/) || [, ''])[1];
  const ogUrl = (p.html.match(/<meta property="og:url" content="([^"]*)"/) || [, ''])[1];
  const schemaUrls = [...p.html.matchAll(/"@type":"(?:Service|Article|BlogPosting)","@id":"([^"#]+)#/g)].map((m) => m[1]);
  const inSitemap = sitemapUrls.has(expect);

  const problems = [];
  if (!canon) problems.push('canonical 없음');
  if (ogUrl && canon && ogUrl !== canon) problems.push(`og:url(${ogUrl}) ≠ canonical(${canon})`);
  for (const s of schemaUrls) {
    if (canon && s !== canon) problems.push(`schema url(${s}) ≠ canonical`);
  }
  if (canon && canon === expect && !inSitemap) problems.push('self-canonical 인데 사이트맵에 없음');
  if (inSitemap && canon && canon !== expect) problems.push(`사이트맵에 있는데 canonical 이 다른 곳(${canon})`);
  if (problems.length) {
    urlConflict++;
    add(fail, 'url-conflict', `${p.pathname} — ${[...new Set(problems)].join(' / ')}`);
  }
}

// ─── 2. 색인 판정 3중 정합
let indexConflict = 0;
const inbound = new Map();
for (const p of pages) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [p.html])[0];
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)"/g)) {
    if (m[1] === p.pathname) continue;
    inbound.set(m[1], (inbound.get(m[1]) || 0) + 1);
  }
}
for (const p of pages) {
  const url = DOMAIN + p.pathname;
  const inSitemap = sitemapUrls.has(url);
  const links = inbound.get(p.pathname) || 0;
  if (p.noindex && inSitemap) {
    indexConflict++;
    add(fail, 'index-conflict', `noindex 인데 사이트맵에 있음: ${p.pathname}`);
  }
  if (!p.noindex && !inSitemap) {
    indexConflict++;
    add(fail, 'index-conflict', `색인 대상인데 사이트맵에 없음: ${p.pathname}`);
  }
  if (!p.noindex && links === 0) {
    indexConflict++;
    add(fail, 'index-conflict', `색인 대상인데 내부링크 0 (고아): ${p.pathname}`);
  }
}

// ─── 3. JSON-LD 문법·중복·허위 필드
const schemaCount = new Map();
let jsonErr = 0, dupEntity = 0, fakeField = 0;
const FAKE_FIELDS = ['ratingValue', 'reviewCount', 'aggregateRating', '"@type":"Review"', '"@type":"AggregateRating"', '"award"'];
for (const p of pages) {
  for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      jsonErr++;
      add(fail, 'json-ld', `JSON 파싱 실패: ${p.pathname} — ${String(e).slice(0, 60)}`);
      continue;
    }
    const nodes = data['@graph'] || [data];
    const seen = new Map();
    for (const n of [].concat(nodes)) {
      const t = n['@type'];
      if (!t) continue;
      schemaCount.set(t, (schemaCount.get(t) || 0) + 1);
      // 사이트 전역 엔티티는 페이지당 한 번만
      if (['Organization', 'ProfessionalService', 'WebSite'].includes(t)) {
        seen.set(t, (seen.get(t) || 0) + 1);
      }
    }
    for (const [t, n] of seen) {
      if (n > 1) {
        dupEntity++;
        add(fail, 'json-ld', `${t} 노드 ${n}개 중복: ${p.pathname}`);
      }
    }
  }
  for (const f of FAKE_FIELDS) {
    if (p.html.includes(f)) {
      fakeField++;
      add(fail, 'json-ld', `검증 불가한 필드(${f}): ${p.pathname}`);
    }
  }
}
// 페이지 전체에서 전역 엔티티가 두 번 이상 렌더되는 경우(서로 다른 script 블록)
for (const p of pages) {
  for (const t of ['Organization', 'ProfessionalService', 'WebSite']) {
    const n = (p.html.match(new RegExp(`"@type":"${t}"`, 'g')) || []).length;
    if (n > 1) {
      dupEntity++;
      add(fail, 'json-ld', `${t} 가 페이지 전체에서 ${n}회 출력: ${p.pathname}`);
    }
  }
}

// ─── 4. Breadcrumb 정합
let crumbBad = 0;
for (const p of indexed) {
  for (const m of p.html.matchAll(/"@type":"BreadcrumbList"[^\]]*\]/g)) {
    const items = [...m[0].matchAll(/"position":(\d+),"name":"[^"]*","item":"([^"]+)"/g)];
    let expectPos = 1;
    for (const it of items) {
      if (+it[1] !== expectPos) {
        crumbBad++;
        add(fail, 'breadcrumb', `position 순서 오류(${it[1]} ≠ ${expectPos}): ${p.pathname}`);
      }
      expectPos++;
      const target = it[2].replace(DOMAIN, '');
      if (!target.startsWith('/')) continue;
      const tp = byPath.get(target);
      if (!tp) {
        crumbBad++;
        add(fail, 'breadcrumb', `존재하지 않는 URL 을 가리킴: ${it[2]} (출처 ${p.pathname})`);
      } else {
        const c = (tp.html.match(/<link rel="canonical" href="([^"]*)"/) || [, ''])[1];
        if (c && c !== it[2]) {
          crumbBad++;
          add(fail, 'breadcrumb', `item(${it[2]}) 이 대상의 canonical(${c}) 과 다름: ${p.pathname}`);
        }
      }
    }
  }
}

// ─── 5. 내부링크 · 앵커
let broken = 0, toRedirect = 0, brokenAnchor = 0;
for (const p of pages) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [p.html])[0];
  const ids = new Set([...p.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) {
    const raw = m[1];
    const [path, hash] = raw.split('#');
    if (!path) {
      if (hash && !ids.has(hash)) {
        brokenAnchor++;
        add(fail, 'anchor', `같은 페이지 앵커 없음: ${p.pathname}#${hash}`);
      }
      continue;
    }
    const clean = path.split('?')[0];
    if (/\.[a-z0-9]{2,5}$/i.test(clean)) {
      if (!existsSync(join(OUT, clean.replace(/^\//, '')))) {
        broken++;
        add(fail, 'link', `없는 파일: ${clean} (출처 ${p.pathname})`);
      }
      continue;
    }
    if (!byPath.has(clean)) {
      broken++;
      add(fail, 'link', `404 링크: ${clean} (출처 ${p.pathname})`);
    } else if (redirectFrom.has(clean) || redirectFrom.has(clean.replace(/\/$/, ''))) {
      // 파일이 존재하면(byPath 에 있으면) Netlify 는 파일을 서빙하므로 실제 리다이렉트가 아니다.
      // 여기 도달했다는 것은 byPath 에 있다는 뜻이라, 강제(!) 규칙일 때만 문제가 된다.
      if (redirectForce.has(clean) || redirectForce.has(clean.replace(/\/$/, ''))) {
        toRedirect++;
        add(fail, 'link', `강제 리다이렉트가 실제 페이지를 덮음: ${clean} (출처 ${p.pathname})`);
      }
    }
  }
}

// ─── 5-b. 홈 기준 도달성 · 클릭 깊이
// "색인 대상인데 인바운드가 noindex 페이지뿐" 같은 경우는 고아 검사로는 안 잡힌다.
// 실제로 홈에서 걸어 들어갈 수 있는지를 BFS 로 본다.
const graph = new Map();
for (const p of pages) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [p.html])[0];
  graph.set(p.pathname, new Set([...body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)"/g)].map((m) => m[1])));
}
const depth = new Map([['/', 0]]);
const queue = ['/'];
for (let i = 0; i < queue.length; i++) {
  const u = queue[i];
  for (const v of graph.get(u) || []) {
    if (graph.has(v) && !depth.has(v)) {
      depth.set(v, depth.get(u) + 1);
      queue.push(v);
    }
  }
}
let unreachable = 0, deep = 0, maxDepth = 0;
for (const p of indexed) {
  const d = depth.get(p.pathname);
  if (d === undefined) {
    unreachable++;
    add(fail, 'reach', `색인 대상인데 홈에서 도달 불가: ${p.pathname}`);
    continue;
  }
  maxDepth = Math.max(maxDepth, d);
  if (d >= 6) deep++;
}
if (deep) add(warn, 'reach', `클릭 깊이 6 이상인 색인 페이지 ${deep}개 (최대 ${maxDepth})`);

// ─── 6. 동적 라우트의 없는 slug → 404
const DYNAMIC_PROBES = ['/app/not-real-slug/', '/l/not-real-slug/', '/guide/not-real-slug/', '/blog/not-real-slug/', '/portfolio/not-real-slug/', '/cost/not-real-slug/'];
let leaked = 0;
for (const probe of DYNAMIC_PROBES) {
  if (existsSync(join(OUT, probe.replace(/^\//, ''), 'index.html'))) {
    leaked++;
    add(fail, '404', `없는 slug 인데 문서가 생성됨(200 서빙): ${probe}`);
  }
}
if (existsSync(join(OUT, '404', 'index.html'))) add(fail, '404', '/404/ 가 200 으로 서빙됨');
if (!existsSync(join(OUT, '404.html'))) add(fail, '404', 'out/404.html 없음 — Netlify 404 본문이 사라짐');
if (sitemapUrls.has(`${DOMAIN}/404.html`) || sitemapUrls.has(`${DOMAIN}/404/`)) add(fail, '404', '404 가 사이트맵에 포함됨');

// ─── 7. 임시·플레이스홀더 문구
const PLACEHOLDER = [
  { re: /\bTODO\b/, label: 'TODO' },
  { re: /lorem ipsum/i, label: 'lorem ipsum' },
  { re: /\[object Object\]/, label: '[object Object]' },
  { re: />\s*undefined\s*</, label: 'undefined 렌더' },
  { re: />\s*null\s*</, label: 'null 렌더' },
  { re: /준비중입니다|준비 중입니다/, label: '준비중' },
  { re: /your-domain/, label: 'your-domain 플레이스홀더' },
  { re: /샘플 텍스트|테스트 텍스트/, label: '샘플/테스트 텍스트' },
];
let placeholders = 0;
for (const p of indexed) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  for (const { re, label } of PLACEHOLDER) {
    if (re.test(body)) {
      placeholders++;
      add(fail, 'placeholder', `${label} 노출: ${p.pathname}`);
    }
  }
}

// ─── 8. 근거 없는 실적·수치 주장
const CLAIMS = [
  /업계\s*(1위|최고|최상위)/,
  /국내\s*최초/,
  /고객\s*만족도\s*[\d.]+/,
  /누적\s*(프로젝트|고객)\s*[\d,]+\s*(건|개|곳|명)/,
  /[\d,]+\s*(개|건|곳)\s*(이상)?\s*(기업|고객사|프로젝트)와?\s*(함께|진행)/,
  /경력\s*[\d]+\s*년/,
  /수상|대상 수상|어워드/,
  /[\d.]+\s*%\s*(증가|향상|절감|단축|상승)/,
  /사용자\s*[\d,]+\s*만\s*명/,
];
let claims = 0;
for (const p of indexed) {
  const t = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  for (const re of CLAIMS) {
    const m = t.match(re);
    if (!m) continue;
    // 부정문("수상 이력은 보유하고 있지 않으며")은 주장이 아니다
    const around = t.slice(Math.max(0, t.indexOf(m[0]) - 30), t.indexOf(m[0]) + m[0].length + 40);
    if (/없|아닙|하지 않|보유하고 있지/.test(around)) continue;
    claims++;
    // 백분율 절감 주장은 기존 영업 문구라 자동으로 지우지 않는다(사업 판단 영역).
    // 대신 계속 눈에 띄게 두고, 사이트 안에서 값이 갈리는지도 아래에서 따로 본다.
    const bucket = /%\s*(증가|향상|절감|단축|상승)/.test(m[0]) ? warn : fail;
    add(bucket, 'claim', `근거 없는 주장 가능성: ${p.pathname} — "${m[0]}"`);
  }
}

// ─── 8-b. 같은 주장에 서로 다른 숫자를 쓰고 있지 않은가 (§57 정책 충돌)
const pctByTopic = new Map();
for (const p of indexed) {
  const t = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ');
  for (const m of t.matchAll(/(Flutter|크로스플랫폼|네이티브)[^.]{0,60}?([\d]+\s*~\s*[\d]+|[\d]+)\s*%/g)) {
    const v = m[2].replace(/\s/g, '');
    const list = pctByTopic.get('flutter-cost') || new Map();
    list.set(v, [...(list.get(v) || []), p.pathname]);
    pctByTopic.set('flutter-cost', list);
  }
}
let claimConflict = 0;
for (const [topic, byValue] of pctByTopic) {
  if (byValue.size <= 1) continue;
  claimConflict++;
  const detail = [...byValue].map(([v, ps]) => `${v}%(${ps.length}p)`).join(' vs ');
  add(warn, 'claim-conflict', `같은 주장에 다른 숫자: ${topic} — ${detail}`);
}

// ─── 9. hidden SEO 텍스트
let hidden = 0;
const SR_ONLY = /class="[^"]*(sr-only|visually-hidden|screen-reader)/;
for (const p of indexed) {
  for (const m of p.html.matchAll(/<(div|p|span|section)[^>]*style="([^"]*)"[^>]*>([\s\S]{40,}?)<\/\1>/g)) {
    const style = m[2];
    if (!/display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?!\.)|left\s*:\s*-\d{4}/.test(style)) continue;
    if (SR_ONLY.test(m[0])) continue; // 접근성용은 제외
    const text = m[3].replace(/<[^>]+>/g, ' ').trim();
    if (text.length < 60) continue; // 아이콘·라벨 수준은 제외
    hidden++;
    add(fail, 'hidden', `숨겨진 긴 텍스트(${text.length}자): ${p.pathname} — "${text.slice(0, 50)}"`);
  }
}

// ─── 10. 날짜가 빌드 시각으로 덮이는가
const today = new Date().toISOString().slice(0, 10);
const pub = new Set();
const mod = new Set();
for (const p of pages) {
  for (const m of p.html.matchAll(/"datePublished":"([^"]{10})/g)) pub.add(m[1]);
  for (const m of p.html.matchAll(/"dateModified":"([^"]{10})/g)) mod.add(m[1]);
}
if (pub.size === 1 && pub.has(today)) add(fail, 'date', 'datePublished 가 전부 빌드 당일 — 실제 날짜를 쓰지 않고 있음');
if (mod.size === 1 && mod.has(today)) add(fail, 'date', 'dateModified 가 전부 빌드 당일 — 빌드마다 갱신되는 구현');
const lastmods = new Set([...sitemapXml.matchAll(/<lastmod>([^<]{10})/g)].map((m) => m[1]));
if (lastmods.size === 1 && lastmods.has(today)) add(fail, 'date', 'sitemap lastmod 가 전부 빌드 당일');

// ─── 11. 공개 경로 민감 파일
const SENSITIVE = /(^|\/)(\.env|\.git|id_rsa|secret|credential|\.pem|\.key)|\.(csv|xlsx|sql|log|bak)$/i;
let sensitive = 0;
(function walkAll(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walkAll(p);
    else if (SENSITIVE.test('/' + relative(OUT, p))) {
      sensitive++;
      add(fail, 'security', `공개 경로에 민감 파일: /${relative(OUT, p)}`);
    }
  }
})(OUT);

// ─── 결과
console.log(`문서 ${pages.length} · 색인 ${indexed.length} · 사이트맵 ${sitemapUrls.size}`);
console.log(`URL 정합    5중(경로·canonical·og:url·schema·sitemap) 충돌 ${urlConflict}`);
console.log(`색인 판정   robots·사이트맵·내부링크 3중 모순 ${indexConflict}`);
console.log(`JSON-LD     문법오류 ${jsonErr} · 전역엔티티 중복 ${dupEntity} · 검증불가 필드 ${fakeField}`);
console.log(`Breadcrumb  순서·대상·canonical 오류 ${crumbBad}`);
console.log(`내부링크    404 ${broken} · 리다이렉트 대상 ${toRedirect} · 앵커 깨짐 ${brokenAnchor}`);
console.log(`도달성      홈에서 도달 불가 ${unreachable} · 깊이 6 이상 ${deep} · 최대 깊이 ${maxDepth}`);
console.log(`동적 404    없는 slug 가 문서로 생성 ${leaked}`);
console.log(`콘텐츠      플레이스홀더 ${placeholders} · 근거없는 주장 ${claims} · 주장 값 충돌 ${claimConflict} · hidden 텍스트 ${hidden}`);
console.log(`보안        공개 민감 파일 ${sensitive}`);
console.log('\n스키마 출력 현황');
for (const [t, n] of [...schemaCount].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${t.padEnd(22)} ${n}`);
}
console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 10).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 30).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ 최종 QA 통과 — SEO 신호 간 모순 없음');
