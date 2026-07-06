/**
 * SEO 색인 리포트 — 실제 색인 게이트(index-quality.ts) 판정을 축별로 뽑아
 * "어떤 URL이 실제로 index / noindex 되는지"를 리포트로 만든다.
 *
 * 실행: npm run seo:report   (tsx 필요)
 * 산출: docs/SEO_색인_리포트.md  (+ 선택적으로 REPORT_JSON 경로에 JSON)
 *
 * 정적 허브/서비스(PAGE_SEO_MAP)는 게이트가 아니라 규칙(301/noindex/index)으로 판정하고,
 * 프로그래매틱 축(지역×서비스·업종×앱/비용/솔루션·가이드·비교)은 decideFromContent 점수로 판정한다.
 */
import { writeFileSync } from 'node:fs';
import { PAGE_SEO_MAP, REDIRECTED_PILLAR_SLUGS, NOINDEX_PILLAR_SLUGS } from '../lib/seo';
import { allRegionServiceParams, regionServiceDecision, regionServiceCanonical } from '../lib/pseo';
import { INDUSTRIES, industryDecision, industryCanonical } from '../lib/industries';
import { COSTS, costDecision, costCanonical, costTitleName } from '../lib/cost';
import { SOLUTIONS, solutionDecision, solutionCanonical, solutionTitleName } from '../lib/solution';
import { GUIDES, guideDecision, guideCanonical } from '../lib/guides';
import { COMPARES, compareDecision, compareCanonical } from '../lib/compare';
import type { IndexDecision } from '../lib/index-quality';

interface Row {
  axis: string;
  url: string;
  primary: string;
  score: number | null;
  verdict: string;
  inSitemap: boolean;
  reasons: string;
}

const rows: Row[] = [];

function push(axis: string, url: string, primary: string, d: IndexDecision | null) {
  if (!d) {
    rows.push({ axis, url, primary, score: null, verdict: 'n/a', inSitemap: false, reasons: 'decision=null' });
    return;
  }
  rows.push({ axis, url, primary, score: d.score, verdict: d.verdict, inSitemap: d.inSitemap, reasons: d.reasons.join('; ') });
}

// 1) 정적 허브/서비스 — 규칙 기반(게이트 아님)
for (const [slug, seo] of Object.entries(PAGE_SEO_MAP)) {
  let verdict = 'index';
  let inSitemap = true;
  let reasons = '';
  if (REDIRECTED_PILLAR_SLUGS.has(slug)) { verdict = '301'; inSitemap = false; reasons = '한글 pillar → 301 통합'; }
  else if (NOINDEX_PILLAR_SLUGS.has(slug)) { verdict = 'noindex'; inSitemap = false; reasons = '얇은 한글 pillar → noindex'; }
  rows.push({ axis: '허브/서비스(정적)', url: seo.canonical, primary: seo.primary ?? '', score: null, verdict, inSitemap, reasons });
}

// 2) 프로그래매틱 축 — 색인 게이트 실측
for (const { slug, region } of allRegionServiceParams()) {
  push('지역×서비스', regionServiceCanonical(slug, region), `${region} ${slug}`, regionServiceDecision(slug, region));
}
for (const ind of INDUSTRIES) push('업종×앱', industryCanonical(ind.slug), ind.keyword, industryDecision(ind.slug));
for (const c of COSTS) push('업종×비용', costCanonical(c.slug), costTitleName(c.slug), costDecision(c.slug));
for (const s of SOLUTIONS) push('업종×솔루션', solutionCanonical(s.slug), solutionTitleName(s.slug), solutionDecision(s.slug));
for (const g of GUIDES) push('가이드', guideCanonical(g.slug), g.slug, guideDecision(g.slug));
for (const c of COMPARES) push('비교', compareCanonical(c.slug), c.slug, compareDecision(c.slug));

// 집계
const axes = [...new Set(rows.map((r) => r.axis))];
type Agg = { total: number; index: number; soft: number; noindex: number; other: number };
const agg: Record<string, Agg> = {};
for (const a of axes) agg[a] = { total: 0, index: 0, soft: 0, noindex: 0, other: 0 };
for (const r of rows) {
  const g = agg[r.axis];
  g.total++;
  if (r.verdict === 'index') g.index++;
  else if (r.verdict === 'soft-noindex') g.soft++;
  else if (r.verdict === 'noindex') g.noindex++;
  else g.other++;
}
const totalIndexed = rows.filter((r) => r.inSitemap).length;

// 콘솔 요약
console.log('\n=== SEO 색인 리포트 ===');
console.log('축\t총\tindex\tsoft\tnoindex\t기타');
for (const a of axes) {
  const g = agg[a];
  console.log(`${a}\t${g.total}\t${g.index}\t${g.soft}\t${g.noindex}\t${g.other}`);
}
console.log(`\n총 URL ${rows.length} · 사이트맵(색인) 대상 ${totalIndexed} · 제외 ${rows.length - totalIndexed}`);

// 마크다운 리포트
const md: string[] = [];
md.push('# REUMLAB 색인 리포트 (자동 생성)');
md.push('');
md.push('`npm run seo:report` 로 재생성. 프로그래매틱 축은 `lib/index-quality.ts` 점수(80↑=index, 60~79=soft-noindex, 60미만=noindex)로 판정합니다.');
md.push('');
md.push('## 축별 요약');
md.push('');
md.push('| 축 | 총 URL | index | soft-noindex | noindex | 기타 |');
md.push('| --- | ---: | ---: | ---: | ---: | ---: |');
for (const a of axes) {
  const g = agg[a];
  md.push(`| ${a} | ${g.total} | ${g.index} | ${g.soft} | ${g.noindex} | ${g.other} |`);
}
md.push(`| **합계** | **${rows.length}** | | | | |`);
md.push('');
md.push(`**사이트맵(색인) 대상: ${totalIndexed} / 전체 ${rows.length} (${((totalIndexed / rows.length) * 100).toFixed(1)}%)**`);
md.push('');
// noindex/soft 로 빠지는 프로그래매틱 URL 상위 목록(운영 검수용)
const dropped = rows.filter((r) => !r.inSitemap && r.axis !== '허브/서비스(정적)');
md.push(`## 색인 제외(보강 필요) 프로그래매틱 URL — ${dropped.length}건`);
md.push('');
if (dropped.length) {
  md.push('| 축 | URL | 점수 | 판정 | 사유 |');
  md.push('| --- | --- | ---: | --- | --- |');
  for (const r of dropped.slice(0, 80)) {
    md.push(`| ${r.axis} | ${r.url.replace('https://reumlab.com', '')} | ${r.score ?? '-'} | ${r.verdict} | ${r.reasons} |`);
  }
  if (dropped.length > 80) md.push(`| … | (외 ${dropped.length - 80}건) | | | |`);
} else {
  md.push('_해당 없음 — 모든 프로그래매틱 URL이 색인 기준을 통과했습니다._');
}
md.push('');
writeFileSync('docs/SEO_색인_리포트.md', md.join('\n'), 'utf-8');
console.log('→ docs/SEO_색인_리포트.md 작성');

// 선택: JSON (Excel 시트용) — REPORT_JSON 환경변수가 있을 때만
const jsonPath = process.env.REPORT_JSON;
if (jsonPath) {
  writeFileSync(jsonPath, JSON.stringify({ agg, rows, totalIndexed, total: rows.length }, null, 2), 'utf-8');
  console.log(`→ ${jsonPath} 작성`);
}
