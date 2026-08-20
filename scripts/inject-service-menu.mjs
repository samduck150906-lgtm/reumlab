/**
 * 상단 '서비스' 메뉴를 out/index.html 에 주입한다 (copy:home 이후 실행).
 *
 * 문제
 *  이 메뉴는 두 곳에서 각각 손으로 관리됐다 —
 *   · index.html 의 `.nav-dd__menu`(데스크톱 호버) 와 `.mnav-acc__panel`(모바일)
 *   · scripts/generate-purpose-landings.mjs 의 PURPOSES (목적별 랜딩 8개의 내비)
 *  그래서 /enterprise-ai/ 를 추가했을 때 랜딩 8개에는 보이는데 정작 홈에서는
 *  안 보이는 상태가 됐다. 서비스가 늘 때마다 같은 사고가 반복된다.
 *
 * 해결
 *  content/service-menu.json 을 단일 출처로 두고,
 *   · 목적별 랜딩은 그 파일을 직접 읽어 내비를 만들고,
 *   · 정적 홈(index.html)은 빌드 시 이 스크립트가 마커 사이를 다시 쓴다.
 *  소스 index.html 에도 같은 마크업을 그대로 두므로(주입은 덮어쓰기일 뿐),
 *  파일을 브라우저로 직접 열어도 메뉴가 비지 않는다.
 *
 * 검증은 scripts/verify-service-menu.mjs 가 맡는다 — 주입 결과와 JSON,
 * 그리고 링크 대상 페이지의 실재 여부까지 대조한다.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const MENU = 'content/service-menu.json';
const TARGET = process.argv[2] || 'out/index.html';

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

if (!existsSync(TARGET)) {
  console.error(`✖ inject-service-menu: ${TARGET} 이 없습니다 (copy:home 이후에 실행하세요).`);
  process.exit(1);
}

const { items } = JSON.parse(readFileSync(MENU, 'utf8'));
if (!Array.isArray(items) || !items.length) {
  console.error(`✖ inject-service-menu: ${MENU} 에 items 가 없습니다.`);
  process.exit(1);
}

/** 마커 사이를 갈아끼운다. 마커가 없으면 조용히 넘어가지 않고 실패시킨다. */
function replaceBetween(html, name, body) {
  const re = new RegExp(
    `(<!-- service-menu:${name}:start[\\s\\S]*?-->\\n)[\\s\\S]*?(\\s*<!-- service-menu:${name}:end -->)`,
  );
  if (!re.test(html)) {
    console.error(`✖ inject-service-menu: '${name}' 마커를 찾지 못했습니다 — index.html 의 주석을 지우지 마세요.`);
    process.exit(1);
  }
  return html.replace(re, (_m, start, end) => `${start}${body}${end}`);
}

const desktop = items
  .map(
    (i) =>
      `          <a role="menuitem" href="/${i.slug}/"><b>${esc(i.label)}</b><span>${esc(i.short)}</span></a>`,
  )
  .join('\n');

const mobile = items.map((i) => `      <a href="/${i.slug}/">${esc(i.label)}</a>`).join('\n');

let html = readFileSync(TARGET, 'utf8');
html = replaceBetween(html, 'desktop', desktop);
html = replaceBetween(html, 'mobile', mobile);
writeFileSync(TARGET, html, 'utf8');

console.log(`✓ inject-service-menu: ${items.length}개 항목 → ${TARGET} (데스크톱·모바일)`);
console.log(`   ${items.map((i) => i.label).join(' · ')}`);
