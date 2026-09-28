/**
 * 색인 가능한 홈페이지 업종 링크 추출 (prebuild 단계)
 *
 * 정적 /website/ 랜딩은 Next가 만든 업종 인덱스를 마지막에 덮어쓴다. 따라서
 * lib/website-industries.ts의 색인 판정을 JSON으로 내려 정적 생성기도 같은 목록을
 * 쓰게 한다. 업종을 추가하거나 색인 판정이 바뀌어도 허브 링크가 자동으로 맞춰진다.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const { WEBSITE_INDUSTRIES, websiteDecision } = await import('../lib/website-industries.ts');

const industries = WEBSITE_INDUSTRIES
  .filter((industry) => websiteDecision(industry.slug)?.shouldIndex)
  .map(({ slug, ko, category }) => ({ slug, ko, category }));

if (!existsSync('content')) mkdirSync('content', { recursive: true });
writeFileSync(
  join('content', 'website-industries.json'),
  `${JSON.stringify(industries, null, 2)}\n`,
  'utf8',
);

console.log(`Generated website-industries.json: 색인 대상 ${industries.length}개`);
