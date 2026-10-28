/**
 * 토스페이먼츠 협력사 띠배너·소개 섹션을 정적 홈에 주입한다 (copy:home 마지막 단계).
 *
 *   node scripts/inject-toss-banner.mjs [target=out/index.html]
 *   node scripts/inject-toss-banner.mjs index.html   ← 소스 홈도 같은 조각으로 맞출 때
 *
 * 두 조각 모두 lib/toss-banner.mjs 가 단일 출처다. Next 페이지(app/layout.tsx·푸터 컴포넌트)와
 * 목적 랜딩(generate-purpose-landings.mjs)은 그 모듈을 직접 쓰고, 손으로 관리하는 index.html 만
 * 이 스크립트가 마커 사이를 다시 쓴다(inject-service-menu.mjs 와 같은 방식).
 *   reumlab:toss-banner  — 헤더 아래(<main> 앞) 띠배너
 *   reumlab:toss-section — <footer> 앞 소개 섹션
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { TOSS_BANNER_HTML, TOSS_SECTION_HTML } from '../lib/toss-banner.mjs';

const TARGET = process.argv[2] || 'out/index.html';
const BLOCKS = [
  ['toss-banner', TOSS_BANNER_HTML],
  ['toss-section', TOSS_SECTION_HTML],
];

if (!existsSync(TARGET)) {
  console.error(`✖ inject-toss-banner: ${TARGET} 이 없습니다 (copy:home 이후에 실행하세요).`);
  process.exit(1);
}
let html = readFileSync(TARGET, 'utf8');
for (const [name, fragment] of BLOCKS) {
  const re = new RegExp(`(<!-- reumlab:${name}:start[^>]*-->)[\\s\\S]*?(<!-- reumlab:${name}:end -->)`);
  if (!re.test(html)) {
    console.error(`✖ inject-toss-banner: ${TARGET} 에 reumlab:${name} 마커가 없습니다.`);
    process.exit(1);
  }
  html = html.replace(re, (_, start, end) => `${start}\n${fragment}\n${end}`);
}
writeFileSync(TARGET, html, 'utf8');
console.log(`✓ inject-toss-banner: ${TARGET} (${BLOCKS.map(([n]) => n).join(', ')})`);
