import { readFileSync } from 'node:fs';
import { auditSitewideExperience } from './sitewide-experience-lib.mjs';

const outDir = process.argv[2] || 'out';
const baseline = JSON.parse(readFileSync('config/naver-index-baseline.json', 'utf8'));
const result = auditSitewideExperience(outDir, baseline.urls ?? []);

console.log('\n사이트 전체 디자인·충실성 검사');
console.log('───────────────────────────────────────────');
console.log(`사이트맵 ${result.counts.sitemapUrls} · 보호 URL ${result.counts.protectedUrls} · HTML ${result.counts.checkedHtml}`);

for (const [name, values] of Object.entries(result.issues)) {
  console.log(`${name.padEnd(24)} ${values.length}`);
  for (const value of values.slice(0, 20)) console.log(`  - ${value}`);
  if (values.length > 20) console.log(`  … ${values.length - 20}개 더 있음`);
}

console.log('───────────────────────────────────────────');
if (!result.ok) {
  console.error(`✗ 사이트 전체 경험 검사 실패 — ${result.counts.issueCount}건`);
  process.exitCode = 1;
} else {
  console.log('✓ 사이트 전체 경험 검사 통과 — 색인 보호·랜드마크·NAP·H1·포트폴리오 푸터·가이드 연결 정상');
}
