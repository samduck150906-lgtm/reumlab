/**
 * 사이트맵 분할 (next build 이후, finalize-out 이전에 실행)
 *
 *   node scripts/split-sitemap.mjs [outDir]
 *
 * 왜 나누나
 *  URL 859개는 사이트맵 용량 한계(50,000개)와는 아무 상관이 없다. 나누는 이유는
 *  서치콘솔이 "사이트맵 단위"로 색인 현황을 보여 주기 때문이다. 한 파일에 다 넣으면
 *  "제출 859 / 색인 xxx" 한 줄만 보이고, 프로그래매틱 축(업종·비용·홈페이지) 중
 *  어느 축이 실제로 색인되고 어느 축이 버려지는지 알 수 없다. 축별로 나누면
 *  그 숫자가 바로 보이고, 다음에 어디를 보강할지 데이터로 정한다.
 *
 * 왜 app/sitemap.ts 를 고치지 않고 후처리하나
 *  URL 선택 규칙(색인 게이트·중복 제거)은 app/sitemap.ts 한 곳에만 있어야 한다.
 *  여기서는 이미 확정된 URL 목록을 "재배치"만 한다. 재배치 전후의 URL 집합이
 *  완전히 같은지 스스로 검사하고, 하나라도 어긋나면 빌드를 실패시킨다
 *  (사이트맵에서 URL 이 조용히 사라지는 것이 이 작업의 유일한 실질 위험이다).
 *
 * 결과
 *  out/sitemap.xml            → sitemapindex (기존 URL 은 자식으로 이동)
 *  out/sitemap-<그룹>.xml     → 그룹별 urlset
 * robots.txt 의 `Sitemap: https://reumlab.com/sitemap.xml` 은 그대로 유효하다
 * (색인 파일도 같은 자리에서 읽힌다).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const SRC = join(OUT, 'sitemap.xml');
if (!existsSync(SRC)) {
  console.error('✖ split-sitemap: out/sitemap.xml 이 없습니다.');
  process.exit(1);
}

const xml = readFileSync(SRC, 'utf8');
if (xml.includes('<sitemapindex')) {
  console.log('✓ split-sitemap: 이미 sitemap index 입니다 — 건너뜁니다.');
  process.exit(0);
}

/** <url>…</url> 블록을 통째로 보존한다 (lastmod·changefreq·priority 를 잃지 않게) */
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  block: m[0],
  loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1] || '',
  lastmod: (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || '',
}));

if (!entries.length) {
  console.error('✖ split-sitemap: <url> 항목을 찾지 못했습니다.');
  process.exit(1);
}

/**
 * 그룹 규칙 — 위에서부터 먼저 맞는 것.
 * 이름은 서치콘솔 목록에서 사람이 바로 읽을 수 있게 짓는다.
 */
const GROUPS = [
  { name: 'cost', label: '업종별 비용·견적', test: (p) => p.startsWith('/cost/') && p !== '/cost/' },
  { name: 'industries', label: '업종별 앱개발', test: (p) => p.startsWith('/app/') && p !== '/app/' },
  { name: 'website', label: '업종별 홈페이지 제작', test: (p) => p.startsWith('/website/') && p !== '/website/' },
  { name: 'solutions', label: '업종별 솔루션 구축', test: (p) => p.startsWith('/solution/') && p !== '/solution/' },
  { name: 'systems', label: '기능·시스템별 개발', test: (p) => p.startsWith('/system/') && p !== '/system/' },
  // 사내 AI 클러스터 — 상업 1 + 가이드 3. 서치콘솔에서 이 클러스터만 따로 보려고 나눈다.
  { name: 'enterprise-ai', label: '사내 AI 클러스터', test: (p) => p === '/enterprise-ai/' || /^\/guide\/(rag-explained|enterprise-ai-cost|enterprise-ai-adoption)\/$/.test(p) },
  { name: 'guides', label: '가이드·비교', test: (p) => p.startsWith('/guide/') || p.startsWith('/compare/') },
  { name: 'blog', label: '블로그', test: (p) => p.startsWith('/blog/') },
  { name: 'portfolio', label: '개발 사례', test: (p) => p.startsWith('/portfolio/') },
  { name: 'landings', label: '키워드 랜딩·허브', test: (p) => p.startsWith('/l/') || p.startsWith('/h/') },
  // 지역×서비스는 /<서비스>/<지역>/ 2단 경로다. 위 규칙에 안 걸린 2단 경로만 남는다.
  { name: 'regions', label: '지역×서비스', test: (p) => /^\/[^/]+\/[^/]+\/$/.test(p) },
  // 나머지 — 홈·서비스 허브·목적별 랜딩·인덱스·법적 고지
  { name: 'pages', label: '메인·서비스·인덱스', test: () => true },
];

const buckets = new Map(GROUPS.map((g) => [g.name, []]));
for (const e of entries) {
  let path = '/';
  try {
    path = new URL(e.loc).pathname;
  } catch {
    /* loc 가 절대 URL 이 아니면 pages 로 떨어진다 */
  }
  const g = GROUPS.find((x) => x.test(path));
  buckets.get(g.name).push(e);
}

const origin = (() => {
  try {
    return new URL(entries[0].loc).origin;
  } catch {
    return 'https://reumlab.com';
  }
})();

const written = [];
for (const g of GROUPS) {
  const list = buckets.get(g.name);
  if (!list.length) continue;
  const file = `sitemap-${g.name}.xml`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list
    .map((e) => e.block)
    .join('\n')}\n</urlset>\n`;
  writeFileSync(join(OUT, file), body, 'utf8');
  // 색인 파일의 lastmod = 그 그룹에서 가장 최근 lastmod (없으면 생략)
  const lastmods = list.map((e) => e.lastmod).filter(Boolean).sort();
  written.push({ file, count: list.length, label: g.label, lastmod: lastmods[lastmods.length - 1] || '' });
}

const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${written
  .map(
    (w) =>
      `<sitemap><loc>${origin}/${w.file}</loc>${w.lastmod ? `<lastmod>${w.lastmod}</lastmod>` : ''}</sitemap>`,
  )
  .join('\n')}\n</sitemapindex>\n`;

// ── 무손실 검증 — 자식 사이트맵의 URL 합집합이 원본과 정확히 같아야 한다 ──
const before = entries.map((e) => e.loc).sort();
const after = written
  .flatMap((w) => [...readFileSync(join(OUT, w.file), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))
  .sort();
if (before.length !== after.length || before.some((u, i) => u !== after[i])) {
  const lost = before.filter((u) => !new Set(after).has(u));
  console.error(`✖ split-sitemap: URL 손실 — 원본 ${before.length} / 분할 후 ${after.length}`);
  for (const u of lost.slice(0, 10)) console.error('   누락:', u);
  process.exit(1);
}

writeFileSync(SRC, index, 'utf8');
console.log(`✓ split-sitemap: ${before.length} URL → ${written.length}개 사이트맵 + index`);
for (const w of written) console.log(`   ${w.file.padEnd(26)} ${String(w.count).padStart(4)}  ${w.label}`);
