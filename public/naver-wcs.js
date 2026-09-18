/*
 * 네이버 검색광고 전환추적 (wcs.trans 버전)
 * 가이드: https://naver.github.io/conversion-tracking/pages/01_script_guide_wcstrans/
 *
 * 이 파일 하나가 네이버가 안내한 "공통 스크립트"와 같은 일을 한다.
 *   <script src="//wcs.naver.net/wcslog.js"></script>
 *   wcs_add["wa"] = "s_36bb821fab0f"; _nasa = {}; wcs.inflow(); wcs_do();
 * 모든 페이지가 이 파일을 부른다 — 정적 홈(index.html), 목적 랜딩 생성기,
 * 약관·개인정보·환불 페이지, Next 레이아웃(components/Analytics.tsx).
 * 안내문의 두 줄짜리 인라인 스니펫 대신 파일 하나로 둔 이유는 (1) 동기 로딩으로
 * 렌더를 막지 않기 위해서, (2) 아래 전환 브리지와 인증키를 한 곳에서만 고치기 위해서다.
 *
 * 왜 dataLayer 브리지인가
 *  전환 이벤트는 이미 홈(script.js)·Next 라우트(AnalyticsDataLayer, 폼 컴포넌트)·
 *  정적 목적 랜딩에서 같은 dataLayer 이벤트 이름으로 나가고 있다(lib/analytics.ts 규약).
 *  각 호출부에 네이버 코드를 흩뿌리지 않고, dataLayer.push 를 한 곳에서 받아
 *  네이버 전환 유형으로 번역한다. 새 폼이 규약대로 generate_lead 를 쏘면 자동으로 잡힌다.
 *
 * 전환 매핑 (한 번의 행동에 한 유형만)
 *  generate_lead → lead (문의 제출 성공 — 서버 성공 응답 이후에만 발화)
 *  form_submit_success·main_apply_submit 은 같은 성공에서 함께 나가므로 매핑하지 않는다.
 *
 *  ⚠️ type 값은 아무 문자열이나 되지 않는다. 네이버가 정한 전환이벤트 코드명
 *     (lead·sign_up·purchase·add_to_cart … 24종 + custom001~custom010)만 집계되고,
 *     목록에 없는 이름은 조용히 버려진다. 확인된 이름만 넣는다.
 *
 *  전화 클릭(phone_click)·카카오 상담 클릭(kakao_or_chat_click)은 아직 매핑하지 않았다.
 *  광고시스템 > 도구 > 전환추적 관리에서 사용자정의 전환(custom001·custom002)에
 *  이름을 붙인 뒤 아래 MAP 에 { phone_click: 'custom001', kakao_or_chat_click: 'custom002' }
 *  를 추가하면 바로 잡힌다. (AnalyticsDataLayer.tsx 기준 이 둘은 secondary conversion 이라
 *  문의 완료 lead 와 같은 유형으로 합치지 않는다.)
 *
 * ⚠️ 개인정보는 보내지 않는다. 유형 문자열만 전송한다.
 * ⚠️ 측정이 사용자 기능보다 우선할 수 없다 — 어떤 경우에도 예외를 던지지 않는다.
 */
(function (w, d) {
  var WA = 's_36bb821fab0f'; // 광고시스템 > 도구 > 전환추적 관리 의 공통 인증키 (공개값)
  var DOMAIN = 'reumlab.com'; // 신청사이트 URL — www·미리보기 호스트도 등록 도메인으로 정규화한다
  var MAP = { generate_lead: 'lead' };
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
      w._nasa = w._nasa || {}; // 안내 스니펫의 `if (!_nasa) var _nasa={};` 와 같은 자리
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
