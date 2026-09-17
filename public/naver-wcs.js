/*
 * 네이버 검색광고 전환추적 (wcs.trans 버전)
 * 가이드: https://naver.github.io/conversion-tracking/pages/01_script_guide_wcstrans/
 *
 * 왜 dataLayer 브리지인가
 *  전환 이벤트는 이미 홈(script.js)·Next 라우트(AnalyticsDataLayer, 폼 컴포넌트)·
 *  정적 목적 랜딩에서 같은 dataLayer 이벤트 이름으로 나가고 있다(lib/analytics.ts 규약).
 *  각 호출부에 네이버 코드를 흩뿌리지 않고, dataLayer.push 를 한 곳에서 받아
 *  네이버 전환 유형으로 번역한다. 새 폼이 규약대로 generate_lead 를 쏘면 자동으로 잡힌다.
 *
 * 전환 매핑 (한 번의 행동에 한 유형만)
 *  generate_lead        → lead    (문의 제출 성공 — 서버 성공 응답 이후에만 발화)
 *  phone_click          → call    (전화 링크 클릭)
 *  kakao_or_chat_click  → inquiry (카카오 채널 클릭)
 *  form_submit_success·main_apply_submit 는 generate_lead 와 같은 성공에서 함께 나가므로 매핑하지 않는다.
 *
 * ⚠️ 개인정보는 보내지 않는다. 유형 문자열만 전송한다.
 * ⚠️ 측정이 사용자 기능보다 우선할 수 없다 — 어떤 경우에도 예외를 던지지 않는다.
 */
(function (w, d) {
  var WA = '__NAVER_WA__'; // 광고시스템 > 도구 > 전환추적 관리 의 공통 인증키 (공개값)
  var DOMAIN = 'reumlab.com';
  var MAP = { generate_lead: 'lead', phone_click: 'call', kakao_or_chat_click: 'inquiry' };
  var DEDUPE_MS = 3000;

  if (!WA || WA.indexOf('__') === 0 || w.__reumNaverWcs) return;
  w.__reumNaverWcs = true;

  var ready = false;
  var pending = [];
  var lastSent = {};

  function send(type) {
    var now = Date.now();
    if (lastSent[type] && now - lastSent[type] < DEDUPE_MS) return; // 같은 클릭의 중복 push 방지
    lastSent[type] = now;
    try {
      w.wcs.trans({ type: type });
    } catch (e) {
      /* wcs 차단 시 무시 */
    }
  }

  function handle(item) {
    try {
      var type = item && typeof item === 'object' ? MAP[item.event] : undefined;
      if (!type) return;
      if (ready) send(type);
      else pending.push(type);
    } catch (e) {
      /* 무시 */
    }
  }

  // 1) dataLayer 브리지 — GTM 은 나중에 로드되며 기존 push 를 감싸서 호출하므로 체인이 유지된다.
  try {
    var dl = (w.dataLayer = w.dataLayer || []);
    for (var i = 0; i < dl.length; i++) handle(dl[i]);
    var origPush = dl.push;
    dl.push = function () {
      var result = origPush.apply(dl, arguments);
      for (var j = 0; j < arguments.length; j++) handle(arguments[j]);
      return result;
    };
  } catch (e) {
    /* 무시 */
  }

  // 2) 공통 스크립트 — 광고 클릭 유입(inflow)을 놓치지 않도록 지연 로더(8초)와 분리해 바로 로드한다.
  var s = d.createElement('script');
  s.async = true;
  s.src = 'https://wcs.naver.net/wcslog.js';
  s.onload = function () {
    try {
      if (!w.wcs) return;
      w.wcs_add = w.wcs_add || {};
      w.wcs_add.wa = WA;
      w.wcs.inflow(DOMAIN);
      if (typeof w.wcs_do === 'function') w.wcs_do();
      ready = true;
      var queued = pending;
      pending = [];
      for (var k = 0; k < queued.length; k++) send(queued[k]);
    } catch (e) {
      /* 무시 */
    }
  };
  (d.head || d.documentElement).appendChild(s);
})(window, document);
