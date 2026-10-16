import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-ignore — 플러그인은 Netlify 빌드에서 그대로 실행되는 JS 모듈이다.
import { mergeManifests, waitForLiveBuild } from '../netlify/plugins/indexnow-after-deploy/lib.js';
// @ts-ignore
import { onSuccess } from '../netlify/plugins/indexnow-after-deploy/index.js';

test('캐시 매니페스트와 커밋본을 합칠 때 URL별로 더 최근 lastmod 를 남긴다', () => {
  const merged = mergeManifests(
    { 'https://reumlab.com/a/': '2026-09-01T00:00:00.000Z', 'https://reumlab.com/b/': '2026-10-01T00:00:00.000Z' },
    { 'https://reumlab.com/a/': '2026-10-16T00:00:00.000Z', 'https://reumlab.com/b/': '2026-09-01T00:00:00.000Z', 'https://reumlab.com/c/': 'x' },
  );
  assert.deepEqual(merged, {
    'https://reumlab.com/a/': '2026-10-16T00:00:00.000Z',
    'https://reumlab.com/b/': '2026-10-01T00:00:00.000Z',
    'https://reumlab.com/c/': 'x',
  });
});

test('새 빌드 파일이 운영 도메인에서 200이 될 때까지만 기다리고, 끝내 안 보이면 공개 미확인으로 돌려준다', async () => {
  const calls: string[] = [];
  let n = 0;
  const live = await waitForLiveBuild({
    buildId: 'B1', attempts: 3, delayMs: 1,
    fetchImpl: async (url: string) => { calls.push(url); n += 1; return { status: n < 2 ? 404 : 200 }; },
  });
  assert.equal(live.live, true);
  assert.equal(live.attempt, 2);
  assert.equal(calls[0], 'https://reumlab.com/_next/static/B1/_buildManifest.js');

  const never = await waitForLiveBuild({ buildId: 'B2', attempts: 2, delayMs: 1, fetchImpl: async () => ({ status: 404 }) });
  assert.equal(never.live, false);
});

test('production 이 아닌 컨텍스트에서는 아무 명령도 실행하지 않는다', async () => {
  const prev = process.env.CONTEXT;
  process.env.CONTEXT = 'deploy-preview';
  let ran = false;
  try {
    await onSuccess({ utils: { run: { command: async () => { ran = true; } }, cache: { save: async () => true } } });
  } finally {
    if (prev === undefined) delete process.env.CONTEXT; else process.env.CONTEXT = prev;
  }
  assert.equal(ran, false);
});
