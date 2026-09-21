import test from 'node:test';
import assert from 'node:assert/strict';
import { compareProtectedIndex } from './naver-index-protection.mjs';
import { NAVER_HOME_LINK_PATHS, NAVER_P1_PATHS, naverPriority } from './naver-priority.mjs';

test('네이버 보호 기준선 URL이 사이트맵에서 빠지면 배포를 차단한다', () => {
  const result = compareProtectedIndex(
    ['https://reumlab.com/', 'https://reumlab.com/mvp/'],
    ['https://reumlab.com/'],
  );

  assert.deepEqual(result.missing, ['https://reumlab.com/mvp/']);
  assert.equal(result.ok, false);
});

test('새 URL이 추가돼도 기존 보호 URL이 모두 남아 있으면 통과한다', () => {
  const result = compareProtectedIndex(
    ['https://reumlab.com/', 'https://reumlab.com/mvp/'],
    ['https://reumlab.com/', 'https://reumlab.com/mvp/', 'https://reumlab.com/ai-worker/'],
  );

  assert.deepEqual(result.missing, []);
  assert.equal(result.ok, true);
});

test('실데이터 핵심 URL만 P1이고 약관·일반 서비스 페이지는 자동 P1이 아니다', () => {
  assert.equal(naverPriority({ pathname: '/', type: 'home', indexable: true }), 'P1');
  assert.equal(naverPriority({ pathname: '/ai-worker/', type: 'service_or_hub', indexable: true }), 'P1');
  assert.equal(naverPriority({ pathname: '/website/cheongsoeobche/', type: 'service_or_hub', indexable: true }), 'P1');
  assert.equal(naverPriority({ pathname: '/privacy/', type: 'service_or_hub', indexable: true }), 'P3');
  assert.equal(naverPriority({ pathname: '/random-service/', type: 'service_or_hub', indexable: true }), 'P2');
  assert.equal(naverPriority({ pathname: '/guide/example/', type: 'guide', indexable: true }), 'P2');
  assert.equal(naverPriority({ pathname: '/l/thin-variant/', type: 'campaign', indexable: false }), 'P3');
});

test('홈에서 직접 연결하는 실측 상승 URL은 모두 P1 보호 대상이다', () => {
  assert.ok(NAVER_HOME_LINK_PATHS.length >= 10);
  for (const pathname of NAVER_HOME_LINK_PATHS) {
    assert.equal(NAVER_P1_PATHS.has(pathname), true, `${pathname} is not P1`);
  }
});
