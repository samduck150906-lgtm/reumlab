/**
 * 전환 측정 규약 단위 테스트
 *
 *   npm test
 *   node --import tsx --test scripts/analytics.test.mts
 *
 * Node 내장 테스트 러너만 쓴다(새 의존성 없음).
 * 여기서 검증하는 것은 순수 함수 — 경로 분류와 파라미터 위생이다.
 * DOM 이 필요한 부분(폼 제출 흐름)은 scripts/verify-conversion.mjs 가 소스와
 * 빌드 산출물을 정적으로 대조해 검사한다.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pageTypeOf,
  serviceOf,
  pageContext,
  pushEvent,
  FORBIDDEN_PARAM_KEYS,
  EVENT,
} from '../lib/analytics';

test('pageTypeOf — 실제 사이트 경로를 올바른 유형으로 분류한다', () => {
  assert.equal(pageTypeOf('/'), 'home');
  assert.equal(pageTypeOf('/flutter/'), 'service');
  assert.equal(pageTypeOf('/erp/'), 'service');
  assert.equal(pageTypeOf('/mvp/'), 'service');
  assert.equal(pageTypeOf('/app-development/dongtan/'), 'location');
  assert.equal(pageTypeOf('/mvp/suwon/'), 'location');
  assert.equal(pageTypeOf('/app/academy/'), 'industry');
  assert.equal(pageTypeOf('/website/hospital/'), 'industry');
  assert.equal(pageTypeOf('/solution/hospital/'), 'industry');
  assert.equal(pageTypeOf('/l/app-dev-cost/'), 'landing');
  assert.equal(pageTypeOf('/h/app-dev/'), 'hub');
  assert.equal(pageTypeOf('/portfolio/'), 'portfolio');
  assert.equal(pageTypeOf('/portfolio/edu-erp/'), 'portfolio');
  assert.equal(pageTypeOf('/guide/app-duration/'), 'guide');
  assert.equal(pageTypeOf('/blog/flutter-oeju-jangdanjeom/'), 'blog');
  assert.equal(pageTypeOf('/compare/flutter-vs-react-native/'), 'comparison');
  // /cost/* 는 업종별이지만 "비용" 클러스터로 묶는다 — 업종 축은 page_path 로 복원 가능하고,
  // 비용 의도(112건)를 한 덩어리로 보는 쪽이 전환 분석에 쓸모 있다.
  assert.equal(pageTypeOf('/cost/hospital/'), 'cost');
  assert.equal(pageTypeOf('/cost/'), 'cost');
  assert.equal(pageTypeOf('/privacy/'), 'legal');
});

test('pageTypeOf — 쿼리·해시가 붙어도 같은 값을 낸다', () => {
  assert.equal(pageTypeOf('/flutter/?utm_source=naver'), 'service');
  assert.equal(pageTypeOf('/guide/app-cost/#faq'), 'guide');
});

test('serviceOf — 실제 제공 서비스만 반환하고, 모르면 빈 문자열', () => {
  assert.equal(serviceOf('/flutter/'), 'app');
  assert.equal(serviceOf('/app-development/dongtan/'), 'app');
  assert.equal(serviceOf('/website/'), 'web');
  assert.equal(serviceOf('/web-development/'), 'web');
  assert.equal(serviceOf('/mvp/'), 'mvp');
  assert.equal(serviceOf('/erp/'), 'erp');
  assert.equal(serviceOf('/admin-page-development/'), 'erp');
  assert.equal(serviceOf('/ai-automation/'), 'ai');
  assert.equal(serviceOf('/ai-development/'), 'ai');
  assert.equal(serviceOf('/data-seo/'), 'data');
  assert.equal(serviceOf('/platform/'), 'platform');
  // 서비스 축을 단정할 수 없는 경로는 값을 지어내지 않는다
  assert.equal(serviceOf('/guide/app-cost/'), '');
  assert.equal(serviceOf('/portfolio/edu-erp/'), '');
  assert.equal(serviceOf('/'), '');
  assert.equal(serviceOf('/service-renewal/'), '');
});

/** window.dataLayer 를 흉내 내고, 테스트가 끝나면 원복한다 */
function withFakeWindow(fn: (pushed: Record<string, unknown>[]) => void) {
  const g = globalThis as unknown as { window?: unknown };
  const had = 'window' in g;
  const prev = g.window;
  const pushed: Record<string, unknown>[] = [];
  g.window = { dataLayer: pushed };
  try {
    fn(pushed);
  } finally {
    if (had) g.window = prev;
    else delete g.window;
  }
}

test('pushEvent — 개인정보 성격의 파라미터는 실려 나가지 않는다', () => {
  withFakeWindow((pushed) => {
    // 실수로 들어온 경우를 가정한 방어선 테스트
    const dirty = Object.fromEntries(FORBIDDEN_PARAM_KEYS.map((k) => [k, 'X'])) as never;
    pushEvent(EVENT.lead, { page_type: 'guide', ...(dirty as object) });
    assert.equal(pushed.length, 1);
    const sent = pushed[0];
    assert.equal(sent.event, 'generate_lead');
    assert.equal(sent.page_type, 'guide');
    for (const k of FORBIDDEN_PARAM_KEYS) {
      assert.equal(k in sent, false, `${k} 가 전송됨`);
    }
  });
});

test('pushEvent — 빈 값은 파라미터로 보내지 않는다(카디널리티·잡음 방지)', () => {
  withFakeWindow((pushed) => {
    pushEvent(EVENT.ctaClick, { page_type: 'home', service: '', cta_location: undefined });
    assert.deepEqual(pushed[0], { event: 'cta_click', page_type: 'home' });
  });
});

test('pushEvent — dataLayer 가 없어도 예외를 던지지 않는다(측정이 UI 를 깨지 않는다)', () => {
  const g = globalThis as unknown as { window?: unknown };
  const had = 'window' in g;
  const prev = g.window;
  delete g.window;
  try {
    assert.doesNotThrow(() => pushEvent(EVENT.lead, { page_type: 'home' }));
  } finally {
    if (had) g.window = prev;
  }
});

test('pageContext — page_type 과 service 를 함께 낸다', () => {
  assert.deepEqual(pageContext('/erp/'), { page_type: 'service', service: 'erp' });
  assert.deepEqual(pageContext('/guide/erp-cost/'), { page_type: 'guide', service: '' });
});

test('EVENT — 기존 GTM 트리거 이름을 바꾸지 않았다', () => {
  // 이 이름들은 운영 중인 GTM 전환 트리거가 쓰고 있다. 값이 바뀌면 전환이 끊긴다.
  assert.equal(EVENT.formStart, 'inquiry_form_start');
  assert.equal(EVENT.ctaClick, 'cta_click');
  // GA4 권장 이름은 추가된 것이지 대체가 아니다
  assert.equal(EVENT.lead, 'generate_lead');
  assert.equal(EVENT.formError, 'form_error');
});
