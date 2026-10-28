/**
 * 색인 가능한 홈페이지 업종 링크 추출 (prebuild 단계)
 *
 * /website/ 는 정적 목적 랜딩(scripts/generate-purpose-landings.mjs)이 유일한 페이지다(예전에는 Next 가 만든
 * 업종 인덱스를 덮어썼고, 그 그림자 Next 허브는 2026-10 에 지웠다). lib/website-industries.ts 의 색인 판정을
 * JSON 으로 내려 정적 생성기가 같은 업종 목록을 쓰게 한다. 업종을 추가하거나 색인 판정이 바뀌어도 허브 링크가 자동으로 맞춰진다.
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
