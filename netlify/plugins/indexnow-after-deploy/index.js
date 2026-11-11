/**
 * IndexNow 변경 URL 알림 — 운영 배포가 실제로 공개된 뒤에만 보낸다.
 *
 * 예전 구성은 [context.production] 의 build command 끝에서 `npm run seo:indexnow` 를 실행했다.
 * build command 는 산출물 업로드·공개 "전에" 끝나므로, 검색엔진이 알림을 받고 바로 수집하면
 * 이전 버전을 가져가고, 이후 배포 단계가 실패해도 알림은 이미 나간 상태가 됐다.
 * 또 Netlify 빌드 컨테이너에서 갱신된 매니페스트(scripts/.indexnow-manifest.json)가
 * 저장되지 않아, 다음 배포마다 같은 URL을 다시 보냈다.
 *
 * 이 플러그인은
 *  1) onPreBuild: 성공적으로 공개된 콘텐츠 지문·전송 기록·미전송 대기열을 캐시에서 복원한다.
 *  2) onSuccess: production 컨텍스트에서만, 이번 빌드의 Next BUILD_ID 정적 매니페스트가
 *     https://reumlab.com 에서 200으로 열리는지 확인한 뒤(=새 배포가 공개됨) 제출 스크립트를 실행한다.
 *     공개를 확인하지 못하면 제출하지 않는다. 어떤 경우에도 배포 자체를 실패시키지 않는다.
 *  3) 미전송 대기열을 보존하고 공개 확인에 성공한 빌드의 콘텐츠 지문을 캐시에 저장한다.
 *
 * 제출 대상 계산·대량 제출 차단(기본 50개)·호스트별 성공 판정은 scripts/submit-indexnow.mjs 가 맡는다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { mergeManifests, mergeContentManifests, readJson, waitForLiveBuild } from './lib.js';

const MANIFEST = 'scripts/.indexnow-manifest.json';
const CACHE_COPY = '.indexnow-manifest.cache.json';
const CONTENT_BASELINE = 'config/content-manifest.json';
const CONTENT_CACHE = '.content-manifest.cache.json';
const CONTENT_RESULT = 'docs/execution-20261020/content-manifest-after.json';
const PENDING = '.indexnow-pending.json';

export const onPreBuild = async ({ utils }) => {
  if (process.env.CONTEXT !== 'production') return;
  try {
    if (await utils.cache.restore(CONTENT_CACHE)) {
      const merged = mergeContentManifests(readJson(CONTENT_BASELINE) ?? {}, readJson(CONTENT_CACHE) ?? {});
      fs.writeFileSync(CONTENT_BASELINE, JSON.stringify(merged, null, 2) + '\n');
      console.log(`[indexnow-after-deploy] 콘텐츠 기준 복원: ${Object.keys(merged).length}개 URL`);
    }
    await utils.cache.restore(PENDING);
  } catch (e) {
    throw new Error(`콘텐츠 기준 또는 대기열 복원 실패: ${e.message}`);
  }
  try {
    if (!(await utils.cache.restore(CACHE_COPY))) {
      console.log('[indexnow-after-deploy] 캐시된 매니페스트 없음 — 커밋본만 사용');
      return;
    }
    const merged = mergeManifests(readJson(MANIFEST) ?? {}, readJson(CACHE_COPY) ?? {});
    fs.writeFileSync(MANIFEST, JSON.stringify(merged, null, 2) + '\n');
    console.log(`[indexnow-after-deploy] 캐시 매니페스트 병합: ${Object.keys(merged).length}개 URL`);
  } catch (e) {
    console.warn('[indexnow-after-deploy] 매니페스트 복원 실패(제출 판정은 커밋본 기준):', e.message);
  }
};

export const onSuccess = async ({ utils }) => {
  if (process.env.CONTEXT !== 'production') {
    console.log(`[indexnow-after-deploy] ${process.env.CONTEXT ?? 'local'} 컨텍스트 — 제출 생략`);
    return;
  }
  let liveVerified = false;
  try {
    const buildId = fs.readFileSync(path.join('.next', 'BUILD_ID'), 'utf8').trim();
    const live = await waitForLiveBuild({ buildId });
    if (!live.live) {
      console.warn(`[indexnow-after-deploy] 새 배포 공개를 확인하지 못함(${live.url}) — 제출하지 않음`);
      return;
    }
    liveVerified = true;
    console.log(`[indexnow-after-deploy] 새 배포 공개 확인(${live.attempt}회차) — 변경 URL 제출 시작`);
    // This release was explicitly requested for all 2,842 remaining public pages.
    // Allow its verified URL set through the ordinary 50-URL automatic limit.
    const review = readJson('docs/search-audit/remaining-public-review-verification.json');
    const changes = readJson('docs/execution-20261020/content-changes.json') ?? [];
    const pending = readJson(PENDING) ?? [];
    const verifiedPaths = new Set((review?.rows ?? []).map(row => row.path));
    const reviewedBatch = review?.page_count === 2842 && verifiedPaths.size === 2842 && changes.length > 50
      && changes.every(change => change.action === 'changed'
        && verifiedPaths.has(decodeURIComponent(new URL(change.url).pathname)))
      && pending.every(url => verifiedPaths.has(decodeURIComponent(new URL(url).pathname)));
    const command = 'node --use-system-ca scripts/submit-indexnow.mjs --submit';
    await utils.run.command(command + (reviewedBatch ? ' --allow-large-batch' : ''));
  } catch (e) {
    console.warn('[indexnow-after-deploy] 제출 단계 오류(배포에는 영향 없음):', e.shortMessage ?? e.message);
  } finally {
    const files = [[MANIFEST, CACHE_COPY], [PENDING, PENDING]];
    if (liveVerified) files.push([CONTENT_RESULT, CONTENT_CACHE]);
    for (const [source, destination] of files) {
      try {
        if (!fs.existsSync(source)) continue;
        if (source !== destination) fs.copyFileSync(source, destination);
        await utils.cache.save(destination);
      } catch (e) {
        console.warn(`[indexnow-after-deploy] ${destination} 캐시 저장 실패:`, e.message);
      }
    }
  }
};
