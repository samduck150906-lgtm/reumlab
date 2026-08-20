/**
 * 상단 '서비스' 메뉴 검증 (빌드 후 실행)
 *
 *   node scripts/verify-service-menu.mjs [outDir]
 *
 * 무엇을 보나 — 메뉴가 갈리거나 죽은 링크를 가리키는 상황을 잡는다.
 *  1. content/service-menu.json 의 모든 항목이 실제로 존재하는 페이지를 가리키는가
 *  2. 정적 홈(index.html)의 데스크톱 드롭다운이 JSON 과 같은 순서·문구인가
 *  3. 정적 홈의 모바일 아코디언이 JSON 과 같은가
 *  4. 목적별 랜딩(생성 8개)의 내비가 JSON 과 같은가
 *  5. 메뉴 링크가 리다이렉트 대상이 아닌가(_redirects 대조)
 *
 * 2~4 가 갈렸던 것이 이 검사를 만든 이유다 — 랜딩에는 보이는데 홈에는 없던 항목이 있었다.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const MENU = 'content/service-menu.json';
const fail = [];
const add = (kind, msg) => fail.push(`[${kind}] ${msg}`);

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}

const { items } = JSON.parse(readFileSync(MENU, 'utf8'));
const expectedHrefs = items.map((i) => `/${i.slug}/`);
const expectedLabels = items.map((i) => i.label);

// ── 1. 링크 대상 페이지 실재 ──
for (const i of items) {
  if (!existsSync(join(OUT, i.slug, 'index.html'))) {
    add('missing-page', `메뉴 항목 "${i.label}" 의 대상 /${i.slug}/ 페이지가 out/ 에 없습니다`);
  }
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** 데스크톱 드롭다운(role=menuitem) 에서 href·label 을 순서대로 뽑는다 */
function readDesktop(html) {
  const block = html.match(/<div class="nav-dd__menu"[^>]*>([\s\S]*?)<\/div>/);
  if (!block) return null;
  return [...block[1].matchAll(/href="([^"]+)"><b>([^<]*)<\/b>/g)].map((m) => ({
    href: m[1],
    label: decode(m[2]),
  }));
}

/** 모바일 아코디언에서 href·label 을 순서대로 뽑는다 */
function readMobile(html) {
  const block = html.match(/<div class="mnav-acc__panel">([\s\S]*?)<\/div>/);
  if (!block) return null;
  return [...block[1].matchAll(/<a href="([^"]+)">([^<]*)<\/a>/g)].map((m) => ({
    href: m[1],
    label: decode(m[2]),
  }));
}

function compare(where, got) {
  if (!got) {
    add('no-menu', `${where}: 메뉴 블록을 찾지 못했습니다`);
    return;
  }
  const gotHrefs = got.map((x) => x.href);
  const gotLabels = got.map((x) => x.label);
  if (gotHrefs.length !== expectedHrefs.length) {
    add('count', `${where}: 항목 수 ${gotHrefs.length} (기대 ${expectedHrefs.length})`);
  }
  const missing = expectedHrefs.filter((h) => !gotHrefs.includes(h));
  const extra = gotHrefs.filter((h) => !expectedHrefs.includes(h));
  for (const h of missing) add('missing-item', `${where}: "${h}" 이 빠졌습니다`);
  for (const h of extra) add('extra-item', `${where}: "${h}" 은 JSON 에 없습니다`);
  if (!missing.length && !extra.length) {
    if (gotHrefs.join('|') !== expectedHrefs.join('|')) {
      add('order', `${where}: 순서가 JSON 과 다릅니다 (${gotHrefs.join(' → ')})`);
    }
    const labelMismatch = got.filter((x, n) => x.label !== expectedLabels[n]);
    for (const x of labelMismatch) add('label', `${where}: "${x.href}" 문구가 JSON 과 다릅니다 ("${x.label}")`);
  }
}

// ── 2·3. 정적 홈 ──
const homePath = join(OUT, 'index.html');
if (!existsSync(homePath)) add('no-home', 'out/index.html 이 없습니다');
else {
  const home = readFileSync(homePath, 'utf8');
  compare('홈 데스크톱 드롭다운', readDesktop(home));
  compare('홈 모바일 아코디언', readMobile(home));
}

// ── 4. 목적별 랜딩 ──
// 생성기가 만든 랜딩만 본다(메뉴에 있으나 Next 라우트인 soho·enterprise-ai 는 자체 내비를 쓴다).
let landingsChecked = 0;
for (const slug of readdirSync(OUT, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
  const f = join(OUT, slug, 'index.html');
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  if (!html.includes('class="nav-dd__menu"')) continue; // 이 내비를 쓰는 페이지만
  compare(`랜딩 /${slug}/`, readDesktop(html));
  landingsChecked++;
}

// ── 5. 리다이렉트 대상 여부 ──
const rd = join(OUT, '_redirects');
if (existsSync(rd)) {
  const rules = readFileSync(rd, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/\s+/)[0]);
  for (const h of expectedHrefs) {
    if (rules.includes(h) || rules.includes(h.replace(/\/$/, ''))) {
      add('redirect', `메뉴 링크 "${h}" 가 리다이렉트 규칙 대상입니다 (한 번 더 튕깁니다)`);
    }
  }
}

console.log(`서비스 메뉴 검증: 항목 ${items.length}개 · 정적 홈 2곳 · 랜딩 ${landingsChecked}곳`);
console.log(`  ${items.map((i) => i.label).join(' · ')}`);
if (fail.length) {
  console.error(`\n✖ 서비스 메뉴 불일치 ${fail.length}건`);
  for (const f of fail.slice(0, 20)) console.error('  ' + f);
  process.exit(1);
}
console.log('✓ 서비스 메뉴 검증 통과 — 홈·랜딩 메뉴가 단일 출처와 일치하고 링크 대상이 모두 실재합니다');
