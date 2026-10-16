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
 *  1) onPreBuild: 지난 배포에서 저장한 매니페스트를 빌드 캐시에서 복원해 커밋본과 합친다
 *     (URL별로 더 최근 lastmod 를 남긴다 → 이미 알린 변경을 다시 보내지 않는다).
 *  2) onSuccess: production 컨텍스트에서만, 이번 빌드의 Next BUILD_ID 정적 매니페스트가
 *     https://reumlab.com 에서 200으로 열리는지 확인한 뒤(=새 배포가 공개됨) 제출 스크립트를 실행한다.
 *     공개를 확인하지 못하면 제출하지 않는다. 어떤 경우에도 배포 자체를 실패시키지 않는다.
 *  3) 제출 후 매니페스트를 빌드 캐시에 저장한다.
 *
 * 제출 대상 계산·대량 제출 차단(기본 50개)·호스트별 성공 판정은 scripts/submit-indexnow.mjs 가 맡는다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { mergeManifests, readJson, waitForLiveBuild } from './lib.js';

const MANIFEST = 'scripts/.indexnow-manifest.json';
const CACHE_COPY = '.indexnow-manifest.cache.json';

export const onPreBuild = async ({ utils }) => {
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
  try {
    const buildId = fs.readFileSync(path.join('.next', 'BUILD_ID'), 'utf8').trim();
    const live = await waitForLiveBuild({ buildId });
    if (!live.live) {
      console.warn(`[indexnow-after-deploy] 새 배포 공개를 확인하지 못함(${live.url}) — 제출하지 않음`);
      return;
    }
    console.log(`[indexnow-after-deploy] 새 배포 공개 확인(${live.attempt}회차) — 변경 URL 제출 시작`);
    await utils.run.command('node --use-system-ca scripts/submit-indexnow.mjs --submit');
  } catch (e) {
    console.warn('[indexnow-after-deploy] 제출 단계 오류(배포에는 영향 없음):', e.shortMessage ?? e.message);
  } finally {
    try {
      fs.copyFileSync(MANIFEST, CACHE_COPY);
      await utils.cache.save(CACHE_COPY);
    } catch (e) {
      console.warn('[indexnow-after-deploy] 매니페스트 캐시 저장 실패:', e.message);
    }
  }
};
