/**
 * 콘텐츠 클러스터 매핑 추출 (prebuild 단계)
 *
 *   node scripts/extract-content-cluster.mjs
 *   lib/content-cluster.ts + lib/{guides,compare,blog-posts}.ts → content/content-cluster.json
 *
 * 왜 필요한가
 *  서비스 허브 → 가이드 링크는 두 렌더러가 함께 써야 한다.
 *   · Next 라우트(components/SeoServicePage.tsx) — lib/content-cluster.ts 를 직접 import
 *   · 정적 목적별 랜딩(scripts/generate-purpose-landings.mjs) — .mjs 라 TS 를 import 할 수 없음
 *  그래서 매핑을 JSON 으로 한 번 내려 두 쪽이 같은 값을 쓰게 한다.
 *
 * ⚠️ 매핑을 이 파일이나 랜딩 생성기에 복제하지 말 것.
 *    고칠 곳은 lib/content-cluster.ts 하나다.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const { SERVICE_GUIDES, REGION_GUIDES, resolveCluster } = await import('../lib/content-cluster.ts');
const { getGuide } = await import('../lib/guides.ts');
const { getCompare } = await import('../lib/compare.ts');
const { getBlogPostBySlug } = await import('../lib/blog-posts.ts');

const lookup = { guide: getGuide, compare: getCompare, blog: getBlogPostBySlug };

const out = {};
let refs = 0;
let missing = 0;
for (const [path, list] of Object.entries(SERVICE_GUIDES)) {
  const links = resolveCluster(list, lookup);
  refs += list.length;
  // resolveCluster 는 실재하지 않는 slug 를 조용히 버린다 — 여기서 잡아 빌드를 세운다.
  if (links.length !== list.length) {
    missing += list.length - links.length;
    console.error(`✗ ${path}: 존재하지 않는 콘텐츠 참조 ${list.length - links.length}건`);
  }
  out[path] = links;
}
out['__region__'] = resolveCluster(REGION_GUIDES, lookup);
refs += REGION_GUIDES.length;
if (out['__region__'].length !== REGION_GUIDES.length) {
  missing += REGION_GUIDES.length - out['__region__'].length;
  console.error('✗ REGION_GUIDES: 존재하지 않는 콘텐츠 참조');
}

if (missing) {
  console.error(`✗ content-cluster: 깨진 참조 ${missing}건 — lib/content-cluster.ts 를 확인하세요.`);
  process.exit(1);
}

if (!existsSync('content')) mkdirSync('content', { recursive: true });
writeFileSync(join('content', 'content-cluster.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Generated content-cluster.json: 허브 ${Object.keys(SERVICE_GUIDES).length} · 링크 ${refs}`);
