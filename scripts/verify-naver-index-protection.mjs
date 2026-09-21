import { existsSync, readFileSync } from 'node:fs';
import { readSitemapLocs } from './read-sitemap.mjs';
import { compareProtectedIndex } from './naver-index-protection.mjs';

const baselinePath = 'config/naver-index-baseline.json';
if (!existsSync(baselinePath)) {
  throw new Error(`${baselinePath}이 없습니다. npm run neo:protect:index:update를 먼저 실행하세요.`);
}
if (!existsSync('out')) {
  throw new Error('out/이 없습니다. 먼저 npm run build를 실행하세요.');
}

const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const result = compareProtectedIndex(baseline.urls ?? [], readSitemapLocs('out'));

if (!result.ok) {
  console.error(`NEO index protection FAILED: 보호 URL ${result.missing.length}개가 사이트맵에서 사라졌습니다.`);
  for (const url of result.missing) console.error(`- ${url}`);
  process.exitCode = 1;
} else {
  console.log(`NEO index protection: ${result.protectedCount} protected URLs preserved (${result.currentCount} current sitemap URLs)`);
}
