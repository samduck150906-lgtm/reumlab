/**
 * 름랩 × 토스페이먼츠 협력사 안내 팝업 (사이트 전역)
 *
 * SEO 를 건드리지 않기 위한 원칙
 *  - 정적 HTML 에는 이 파일을 부르는 defer 스크립트 한 줄만 들어간다. 팝업 마크업은
 *    window load 이후에 JS 로 붙이므로 크롤러가 받는 원문 HTML·제목·본문·링크는 그대로다.
 *  - 렌더링된 DOM 에서도 문서 개요를 흔들지 않도록 h1~h6 를 쓰지 않고, 루트에
 *    data-nosnippet 을 달아 검색 스니펫에 팝업 문구가 쓰이지 않게 한다.
 *  - 화면 고정(fixed) 레이어라 레이아웃 이동(CLS)이 없고, 로고 이미지는 팝업이 열릴 때만 받는다.
 *  - 문구의 글자는 전부 Pretendard 서브셋 안에 있다 — 새 글자를 넣으면 2MB 원본을 추가로
 *    받게 되니 바꿀 때 scripts/verify-font-subset.mjs 의 unicode-range 와 대조할 것.
 *
 * 닫기 동작
 *  - "오늘 하루 보지 않기": 24시간 동안 모든 페이지에서 다시 띄우지 않는다(localStorage).
 *  - "닫기"·바깥 클릭·ESC: 이번 방문(탭 세션) 동안 다시 띄우지 않는다(sessionStorage).
 */
(function () {
  'use strict';

  var HIDE_KEY = 'reumlab:toss-popup:hide-until';
  var SESSION_KEY = 'reumlab:toss-popup:closed';
  var DAY_MS = 24 * 60 * 60 * 1000;
  var ROOT_ID = 'rl-toss-popup';

  function read(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function write(store, key, value) {
    try { window[store].setItem(key, value); } catch (e) { /* 저장 불가(사파리 개인정보 모드 등)면 이번 화면만 닫힌다 */ }
  }

  function suppressed() {
    if (read('sessionStorage', SESSION_KEY)) return true;
    var until = Number(read('localStorage', HIDE_KEY));
    return until > Date.now();
  }

  var CSS = [
    '#rl-toss-popup{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;',
    'font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif;',
    'letter-spacing:-0.02em;word-break:keep-all;-webkit-font-smoothing:antialiased;color:#111827}',
    '#rl-toss-popup *{box-sizing:border-box}',
    '#rl-toss-popup .rl-tp-dim{position:absolute;inset:0;background:rgba(15,23,42,.55);opacity:0;transition:opacity .2s ease}',
    '#rl-toss-popup .rl-tp-card{position:relative;width:100%;max-width:460px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);',
    'display:flex;flex-direction:column;background:#fff;border-radius:18px;overflow:hidden;',
    'box-shadow:0 24px 64px rgba(15,23,42,.28);transform:translateY(12px);opacity:0;transition:transform .22s ease,opacity .22s ease}',
    '#rl-toss-popup .rl-tp-card:focus{outline:none}',
    '#rl-toss-popup.is-open .rl-tp-dim{opacity:1}',
    '#rl-toss-popup.is-open .rl-tp-card{transform:none;opacity:1}',
    '#rl-toss-popup .rl-tp-body{overflow-y:auto;padding:28px 28px 22px}',
    '#rl-toss-popup .rl-tp-x{position:absolute;top:12px;right:12px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;',
    'color:#6B7280;font-size:22px;line-height:36px;text-align:center;cursor:pointer;padding:0}',
    '#rl-toss-popup .rl-tp-x:hover{background:#F3F4F6;color:#111827}',
    '#rl-toss-popup .rl-tp-logos{display:flex;align-items:center;gap:12px;padding-right:32px}',
    '#rl-toss-popup .rl-tp-logos img{display:block;height:22px;width:auto}',
    '#rl-toss-popup .rl-tp-logos span{font-size:16px;font-weight:300;color:#9CA3AF}',
    '#rl-toss-popup .rl-tp-title{margin:20px 0 0;font-size:24px;line-height:1.35;font-weight:700;letter-spacing:-0.035em;color:#111827}',
    '#rl-toss-popup .rl-tp-desc{margin:10px 0 0;font-size:15px;line-height:1.65;color:#4B5563}',
    '#rl-toss-popup .rl-tp-list{list-style:none;margin:20px 0 0;padding:0;border-top:2px solid #111827}',
    '#rl-toss-popup .rl-tp-list li{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #E5E7EB}',
    '#rl-toss-popup .rl-tp-num{flex:none;width:22px;font-size:13px;font-weight:700;line-height:22px;color:#4F46E5}',
    '#rl-toss-popup .rl-tp-item strong{display:block;font-size:16px;line-height:22px;font-weight:700;color:#111827}',
    '#rl-toss-popup .rl-tp-item span{display:block;margin-top:2px;font-size:14px;line-height:1.55;color:#4B5563}',
    '#rl-toss-popup .rl-tp-foot{flex:none;display:flex;border-top:1px solid #E5E7EB;background:#F9FAFB}',
    '#rl-toss-popup .rl-tp-foot button{flex:1;min-height:50px;border:0;background:transparent;font:inherit;font-size:14px;cursor:pointer;color:#4B5563;padding:0 12px}',
    '#rl-toss-popup .rl-tp-foot button+button{border-left:1px solid #E5E7EB;color:#111827;font-weight:600}',
    '#rl-toss-popup .rl-tp-foot button:hover{background:#F3F4F6}',
    '#rl-toss-popup button:focus-visible{outline:2px solid #4F46E5;outline-offset:-2px}',
    '@media (max-width:480px){',
    '#rl-toss-popup .rl-tp-body{padding:24px 20px 18px}',
    '#rl-toss-popup .rl-tp-logos img{height:18px}',
    '#rl-toss-popup .rl-tp-title{margin-top:16px;font-size:20px}',
    '#rl-toss-popup .rl-tp-desc{font-size:14px}',
    '#rl-toss-popup .rl-tp-list{margin-top:16px}',
    '#rl-toss-popup .rl-tp-list li{padding:10px 0}',
    '#rl-toss-popup .rl-tp-item strong{font-size:15px}',
    '#rl-toss-popup .rl-tp-item span{font-size:13px}',
    '}',
    '@media (prefers-reduced-motion:reduce){#rl-toss-popup .rl-tp-dim,#rl-toss-popup .rl-tp-card{transition:none}}'
  ].join('');

  var ITEMS = [
    ['가입비 혜택', '토스페이먼츠 가입 시 가입비 혜택을 받을 수 있습니다.'],
    ['수수료 혜택', '결제 수수료 혜택으로 운영 비용 부담을 줄입니다.'],
    ['PG 연동 적극 지원', '개발 과정에서 PG사 연동이 필요하면 가입부터 연동·테스트까지 함께 진행합니다.']
  ];

  function build() {
    var list = ITEMS.map(function (it, i) {
      return '<li><span class="rl-tp-num">0' + (i + 1) + '</span><div class="rl-tp-item"><strong>' +
        it[0] + '</strong><span>' + it[1] + '</span></div></li>';
    }).join('');

    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('data-nosnippet', '');
    root.innerHTML =
      '<div class="rl-tp-dim" data-rl-tp-close="session"></div>' +
      '<div class="rl-tp-card" role="dialog" aria-modal="true" aria-labelledby="rl-tp-title" tabindex="-1">' +
        '<button type="button" class="rl-tp-x" data-rl-tp-close="session" aria-label="팝업 닫기">&times;</button>' +
        '<div class="rl-tp-body">' +
          '<div class="rl-tp-logos">' +
            '<img src="/assets/partners/reumlab-logo-popup.png" alt="름랩 REUMLAB" width="107" height="22">' +
            '<span aria-hidden="true">&times;</span>' +
            '<img src="/assets/partners/tosspayments-logo-popup.png" alt="토스페이먼츠" width="135" height="22">' +
          '</div>' +
          '<p class="rl-tp-title" id="rl-tp-title">결제까지 완성하는 개발,<br>토스페이먼츠와 함께합니다.</p>' +
          '<p class="rl-tp-desc">름랩은 토스페이먼츠 협력사입니다. 름랩 고객사는 가입비·수수료 혜택을 받을 수 있으며, ' +
            'PG 연동이 필요한 개발은 름랩이 적극 지원합니다.</p>' +
          '<ul class="rl-tp-list">' + list + '</ul>' +
        '</div>' +
        '<div class="rl-tp-foot">' +
          '<button type="button" data-rl-tp-close="day">오늘 하루 보지 않기</button>' +
          '<button type="button" data-rl-tp-close="session">닫기</button>' +
        '</div>' +
      '</div>';
    return root;
  }

  function open() {
    if (suppressed() || document.getElementById(ROOT_ID)) return;

    var style = document.createElement('style');
    style.id = ROOT_ID + '-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = build();
    var card = root.querySelector('.rl-tp-card');
    var lastFocus = document.activeElement;
    document.body.appendChild(root);

    function close(mode) {
      if (mode === 'day') write('localStorage', HIDE_KEY, String(Date.now() + DAY_MS));
      write('sessionStorage', SESSION_KEY, '1');
      document.removeEventListener('keydown', onKey, true);
      root.parentNode && root.parentNode.removeChild(root);
      style.parentNode && style.parentNode.removeChild(style);
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* noop */ }
      }
    }

    function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Esc') { close('session'); return; }
      if (e.key !== 'Tab') return;
      // 포커스를 팝업 안에 가둔다(aria-modal)
      var f = root.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1], active = document.activeElement;
      if (!root.contains(active) || active === card) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-rl-tp-close]') : null;
      if (t) close(t.getAttribute('data-rl-tp-close'));
    });
    document.addEventListener('keydown', onKey, true);

    // 다음 프레임에 열어 페이드인 트랜지션이 걸리게 한다
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.className = 'is-open';
        // 대화상자 자체에 포커스 — 스크린리더가 제목을 읽고, 버튼에 포커스 링이 미리 뜨지 않는다
        try { card.focus({ preventScroll: true }); } catch (e) { card.focus(); }
      });
    });
  }

  function schedule() {
    // 첫 화면 렌더(LCP)·상호작용을 방해하지 않게 load 이후 잠깐 쉬었다가 띄운다
    setTimeout(open, 800);
  }

  if (suppressed()) return;
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
