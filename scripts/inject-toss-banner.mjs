/**
 * 토스페이먼츠 협력사 상단 띠배너를 정적 홈에 주입한다 (copy:home 마지막 단계).
 *
 *   node scripts/inject-toss-banner.mjs [target=out/index.html]
 *   node scripts/inject-toss-banner.mjs index.html   ← 소스 홈도 같은 조각으로 맞출 때
 *
 * 배너는 lib/toss-banner.mjs 가 단일 출처다. Next 페이지(app/layout.tsx)와 목적 랜딩
 * (generate-purpose-landings.mjs)은 그 모듈을 직접 쓰고, 손으로 관리하는 index.html 만
 * 이 스크립트가 마커 사이를 다시 쓴다(inject-service-menu.mjs 와 같은 방식).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { TOSS_BANNER_HTML } from '../lib/toss-banner.mjs';

const TARGET = process.argv[2] || 'out/index.html';
const RE = /(<!-- reumlab:toss-banner:start[^>]*-->)[\s\S]*?(<!-- reumlab:toss-banner:end -->)/;

if (!existsSync(TARGET)) {
  console.error(`✖ inject-toss-banner: ${TARGET} 이 없습니다 (copy:home 이후에 실행하세요).`);
  process.exit(1);
}
const html = readFileSync(TARGET, 'utf8');
if (!RE.test(html)) {
  console.error(`✖ inject-toss-banner: ${TARGET} 에 reumlab:toss-banner 마커가 없습니다.`);
  process.exit(1);
}
writeFileSync(TARGET, html.replace(RE, `$1\n${TOSS_BANNER_HTML}\n$2`), 'utf8');
console.log(`✓ inject-toss-banner: ${TARGET}`);
