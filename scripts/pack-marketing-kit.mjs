/**
 * 마케팅 소스 킷 패키징 — 다른 사이트에 이식할 수 있는 형태로 묶는다.
 *
 *   node scripts/pack-marketing-kit.mjs [outDir]     기본 outDir = dist-kit
 *
 * 무엇을 묶나
 *  름랩이 쓰는 유입 관련 소스 전부 — 프로그래매틱 SEO 축(지역×서비스·업종·비용·솔루션·
 *  가이드·비교·시스템), 검색 SEO 공통 레이어(메타·구조화 데이터·사이트맵·색인 게이트),
 *  GEO(생성형 검색 llms.txt·AI 크롤러 정책), 광고 자동화, 검증 스크립트, 콘텐츠 데이터,
 *  전략 문서.
 *
 * 무엇을 빼나
 *  - 사이트 소유권 증명 파일(google*.html, naver*.html, IndexNow 키) — 다른 도메인에서
 *    쓰면 틀린 파일이다. 새 사이트에서 각자 발급받아야 한다.
 *  - 이미지/영상 등 저작물 에셋, node_modules, 빌드 산출물.
 *
 * 원본을 수정하지 않는다. outDir 은 .gitignore 대상이다.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_ROOT = process.argv[2] || 'dist-kit';
const KIT_NAME = 'reumlab-marketing-kit';
const KIT = join(OUT_ROOT, KIT_NAME);

/** [원본경로, 킷 내부 경로] — 원본이 없으면 조용히 건너뛰고 리포트에 남긴다. */
const MAP = [];
const add = (src, dest) => MAP.push([src, dest ?? src]);
const addAll = (srcs, destDir) => srcs.forEach((s) => add(s, join(destDir, s.split('/').pop())));

// ── 00. 설정 — 빌드 파이프라인을 그대로 재현하는 데 필요한 것들
addAll(['next.config.mjs', 'tsconfig.json', 'netlify.toml', 'postcss.config.cjs', 'tailwind.config.cjs', '.env.example'], '00-config');

// ── 01. SEO 코어 — 사이트가 달라도 구조가 그대로 가는 공통 레이어
addAll([
  'lib/seo.ts',            // ★ SITE 상수: 새 사이트에서 제일 먼저 바꿀 파일
  'lib/schema.ts',         // JSON-LD 단일 출처(@id 그래프)
  'lib/index-quality.ts',  // 색인 품질 게이트 — 얇은 페이지 noindex 판정
  'lib/search-intent.ts',  // 검색 의도별 title/description 조립
  'lib/keyword-coverage.ts',
  'lib/voice.ts',          // 페이지마다 CTA·어투를 결정적으로 다르게
  'lib/sibling-picker.ts', // 내부링크 균등 분배
  'lib/lastmod.ts',        // 사이트맵 lastmod = git 커밋일
  'lib/pricing.ts',        // 가격 단일 출처
  'lib/analytics.ts',      // 전환 이벤트 규약
  'lib/seo-optimizer.ts',  // (미배선 참고 모듈 — 파일 상단 경고 확인)
], '01-seo-core/lib');
addAll(['app/sitemap.ts', 'app/robots.ts', 'app/layout.tsx'], '01-seo-core/routes');
addAll(['components/JsonLd.tsx', 'components/Analytics.tsx', 'components/AnalyticsDataLayer.tsx'], '01-seo-core/components');

// ── 02. 프로그래매틱 SEO — 축별 데이터 + 라우트 + 생성 스크립트
addAll([
  'lib/pseo.ts',              // 지역 × 서비스
  'lib/region-service.ts',    // 지역×서비스 조합 고유 콘텐츠
  'lib/industries.ts',        // 업종 × 앱
  'lib/website-industries.ts',// 업종 × 웹
  'lib/cost.ts',              // 업종 × 비용
  'lib/solution.ts',          // 업종 × 솔루션
  'lib/guides.ts',            // 정보성 가이드
  'lib/compare.ts',           // 비교
  'lib/systems.ts',           // 시스템 구축
  'lib/enterprise-ai.ts',
  'lib/deep-dive.ts',
  'lib/hub-content.ts',
  'lib/portfolio.ts',
  'lib/content-cluster.ts',   // 필러 ↔ 클러스터 양방향 배선
  'lib/blog-posts.ts',
  'lib/blog-links.ts',
  'lib/blog-generator.ts',
  'lib/content-marketing.ts',
  'lib/data.js',
  'lib/landing-content.js',
], '02-programmatic-seo/lib');
add('app', '02-programmatic-seo/routes');
addAll([
  'scripts/generate-landings.mjs',
  'scripts/generate-purpose-landings.mjs',
  'scripts/build-hubs.mjs',
  'scripts/build-landings-pages.mjs',
  'scripts/extract-content-cluster.mjs',
  'scripts/extract-portfolio.mjs',
  'scripts/generate-blog-posts.mjs',
  'scripts/bulk-generate-blog.mjs',
  'scripts/mega-generate-blog.mjs',
  'scripts/distribute-blog-posts.mjs',
  'scripts/generate-sitemaps.mjs',
  'scripts/split-sitemap.mjs',
  'scripts/generate-feed.mts',
  'scripts/prepare-next-public.mjs',
  'scripts/finalize-out.mjs',
  'scripts/copy-main.mjs',
  'scripts/inject-portfolio-static.mjs',
  'scripts/inject-service-menu.mjs',
], '02-programmatic-seo/scripts');

// ── 03. GEO(생성형 검색) — llms.txt · AI 크롤러 정책 · 색인 제출 · GBP
addAll([
  'scripts/generate-llms.mts',   // llms.txt / llms-full.txt
  'scripts/verify-geo.mjs',      // AI 검색 대응 검증(사실 일관성·링크 실재성)
  'scripts/generate-robots.mjs',
  'scripts/submit-indexnow.mjs', // Bing/Naver 계열 즉시 색인 제출
  'scripts/generate-gbp.mjs',    // 구글 비즈니스 프로필 게시물
], '03-geo-ai-search/scripts');
add('content/gbp', '03-geo-ai-search/gbp');
add('content/gbp.json', '03-geo-ai-search/gbp.json');

// ── 04. 광고·캠페인 자동화
addAll([
  'lib/programmatic-marketing.ts',
  'lib/ad-platform-integrations.ts',
  'lib/marketing-dashboard-api.ts',
  'lib/performance-optimizer.ts',
], '04-ads-automation/lib');
addAll([
  'scripts/auto-marketing-campaigns.mjs',
  'scripts/deploy-campaigns-to-platforms.mjs',
  'scripts/marketing-automation-workflow.mjs',
  'scripts/monitor-and-optimize.mjs',
  'scripts/generate-dashboard.mjs',
  'scripts/seo-optimization.mjs',
], '04-ads-automation/scripts');
addAll(['META_ADS.md', 'META_CAMPAIGNS.md', 'docs/PLATFORM-API-INTEGRATION.md'], '04-ads-automation/docs');

// ── 05. 검증·QA — 배포 전에 SEO/GEO 회귀를 잡는 게이트
addAll([
  'scripts/verify-sitemap.mjs',
  'scripts/verify-region-pages.mjs',
  'scripts/verify-service-hubs.mjs',
  'scripts/verify-service-menu.mjs',
  'scripts/verify-faq.mjs',
  'scripts/verify-media.mjs',
  'scripts/verify-naver.mjs',
  'scripts/verify-portfolio.mjs',
  'scripts/verify-content.mjs',
  'scripts/verify-conversion.mjs',
  'scripts/verify-pricing.mjs',
  'scripts/verify-cannibalization.mjs',
  'scripts/audit-indexability.mjs',
  'scripts/seo-audit.mjs',
  'scripts/seo-index-report.mts',
  'scripts/read-sitemap.mjs',
  'scripts/qa-final.mjs',
  'scripts/analytics.test.mts',
], '05-verify-qa/scripts');

// ── 06. 콘텐츠 데이터 — 새 사이트에서 통째로 갈아끼울 대상
addAll([
  'content/landings.json',
  'content/clusters.json',
  'content/content-cluster.json',
  'content/templates.json',
  'content/service-menu.json',
  'content/blog-generation-config.json',
  'content/portfolio.json',
], '06-content-data');

// ── 07. 전략 문서
add('docs/MARKETING-KIT.md', 'README.md');   // 킷 최상단 사용 안내
add('docs', '07-docs');
addAll(['README.md', 'NETLIFY_FORMS.md', 'DEPLOY_NETLIFY.md'], '07-docs/repo-root');

// ── 복사 ───────────────────────────────────────────────────────────
rmSync(OUT_ROOT, { recursive: true, force: true });
mkdirSync(KIT, { recursive: true });

const copied = [];
const missing = [];
for (const [src, dest] of MAP) {
  const from = join(ROOT, src);
  if (!existsSync(from)) { missing.push(src); continue; }
  const to = join(KIT, dest);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  copied.push(dest);
}

// npm 스크립트 발췌 — 원본 package.json 전체 대신 마케팅 파이프라인만
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
writeFileSync(
  join(KIT, '00-config/package.scripts.json'),
  JSON.stringify({ scripts: pkg.scripts, dependencies: pkg.dependencies, devDependencies: pkg.devDependencies }, null, 2) + '\n',
);

// 파일 목록(MANIFEST) — 무엇이 들어 있는지 한 장으로
const walk = (dir, base = '') => readdirSync(join(KIT, dir), { withFileTypes: true }).flatMap((e) => {
  const rel = join(base, e.name);
  return e.isDirectory() ? walk(join(dir, e.name), rel) : [rel];
});
const files = walk('.').sort();
const totalBytes = files.reduce((n, f) => n + statSync(join(KIT, f)).size, 0);
writeFileSync(
  join(KIT, 'MANIFEST.txt'),
  `${KIT_NAME} — 파일 ${files.length}개, ${(totalBytes / 1024 / 1024).toFixed(2)} MB\n\n` + files.join('\n') + '\n',
);

// ── 압축 ───────────────────────────────────────────────────────────
const zipPath = join(OUT_ROOT, `${KIT_NAME}.zip`);
execFileSync('zip', ['-qr', KIT_NAME + '.zip', KIT_NAME], { cwd: OUT_ROOT });

console.log(`✓ ${KIT}  (파일 ${files.length}개, ${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
console.log(`✓ ${zipPath}  (${(statSync(join(ROOT, zipPath)).size / 1024 / 1024).toFixed(2)} MB)`);
if (missing.length) console.log(`- 없어서 건너뜀 ${missing.length}개: ${missing.join(', ')}`);
