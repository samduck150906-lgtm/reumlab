/**
 * 름랩 × 토스페이먼츠 협력사 상단 띠배너 — 단일 출처
 *
 * 쓰는 곳 (세 곳 모두 이 파일에서 만든다)
 *  - app/layout.tsx                         : Next 로 만드는 전 페이지
 *  - scripts/generate-purpose-landings.mjs  : 목적별 랜딩
 *  - index.html(홈)                         : scripts/inject-toss-banner.mjs 가 마커 사이를 다시 쓴다
 *
 * SEO 를 건드리지 않기 위한 원칙
 *  - 원문 HTML 에는 빈 자리표시자(<div id="rl-tb" data-nosnippet>)와 인라인 스크립트만 들어간다.
 *    배너 문구는 스크립트 문자열 안에 있어 원문 본문 텍스트·제목·링크·메타는 그대로다.
 *  - 렌더링 후에도 h1~h6 를 쓰지 않고 링크를 추가하지 않으며, data-nosnippet 으로
 *    검색 스니펫에 배너 문구가 쓰이지 않게 한다.
 *  - 스크립트는 자리표시자 바로 뒤에서 동기 실행돼 첫 페인트 전에 배너를 채운다 —
 *    나중에 끼워 넣어 본문이 밀리는 레이아웃 이동(CLS)이 없다.
 *  - React 는 dangerouslySetInnerHTML 요소의 자식을 하이드레이션하지 않으므로
 *    Next 페이지에서도 하이드레이션 불일치가 나지 않는다.
 *  - 문구 글자는 전부 Pretendard 서브셋 안에 있다 — 바꿀 때 scripts/verify-font-subset.mjs 의
 *    unicode-range 와 대조할 것(밖의 글자는 2MB 원본 폰트를 추가로 받게 한다).
 *
 * 위치 — 헤더 바로 아래 (맨 위에 두면 눈에 안 띈다)
 *  - 홈·목적 랜딩: 자리표시자를 sticky .header 뒤(<main> 앞)에 둔다. 흐름 안에 있어 그대로 밀어낸다.
 *  - Next 페이지: 자리표시자를 <Nav> 뒤에 둔다. #nav 가 fixed 이고 각 페이지 히어로가 저마다
 *    헤더 높이만큼 위 여백을 갖고 있어, 스크립트가 그 자리에서 헤더 높이(페이지·폭·노치마다 다름)를
 *    재서 margin-top 으로 헤더 아래에 놓고 같은 값의 음수 margin-bottom 으로 되돌린다 —
 *    본문은 배너 높이만큼만 내려가고 히어로 여백은 그대로다. 측정은 첫 페인트 전이라 CLS 가 없다.
 *
 * 닫기
 *  - "오늘 하루 보지 않기": 24시간(localStorage) · "×": 이번 방문(sessionStorage)
 */

export const TOSS_BANNER_ID = 'rl-tb';

// 높이는 고정이다(데스크톱 52px · 모바일 64px) — 웹폰트가 늦게 바뀌어도 배너 높이가 변하지 않아 본문이 밀리지 않는다.
const CSS = [
  // 대기업 파트너십 띠처럼: 짙은 네이비 그라데이션 + 흰 단색 파트너 로고 + PARTNER 배지.
  // z-index 는 헤더(홈 .header 100 · Next #nav 1000)보다 낮게 — 스크롤하면 헤더 아래로 지나간다.
  '#rl-tb{position:relative;z-index:90;color:#fff;',
  'background:radial-gradient(600px 120px at 78% 50%,rgba(49,130,246,.28),transparent 70%),linear-gradient(90deg,#050A16 0%,#0A1733 52%,#0C2252 100%);',
  'border-bottom:1px solid rgba(120,160,255,.18);',
  'font-family:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif;',
  'letter-spacing:-0.02em;word-break:keep-all;-webkit-font-smoothing:antialiased}',
  '#rl-tb *{box-sizing:border-box}',
  '#rl-tb .rl-tb-in{max-width:1240px;height:52px;margin:0 auto;padding:0 12px 0 20px;display:flex;align-items:center;gap:18px;overflow:hidden}',
  '#rl-tb .rl-tb-logos{flex:none;display:flex;align-items:center;gap:9px}',
  '#rl-tb .rl-tb-logos img{display:block;height:17px;width:auto;filter:brightness(0) invert(1)}',
  '#rl-tb .rl-tb-logos span{font-size:13px;color:rgba(255,255,255,.45)}',
  '#rl-tb .rl-tb-sep{flex:none;width:1px;height:20px;background:rgba(255,255,255,.18)}',
  '#rl-tb .rl-tb-badge{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 11px 0 8px;overflow:hidden;',
  'border:1px solid rgba(150,190,255,.45);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.03));',
  'font-size:10.5px;font-weight:800;letter-spacing:.16em;line-height:1;color:#DCE8FF;white-space:nowrap}',
  '#rl-tb .rl-tb-badge svg{display:block;flex:none}',
  '#rl-tb .rl-tb-badge::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;',
  'background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);animation:rl-tb-shine 1.2s ease .9s 1 both}',
  '@keyframes rl-tb-shine{to{left:130%}}',
  '#rl-tb .rl-tb-msg{flex:1;min-width:0;margin:0;font-size:14px;line-height:20px;color:#A9B9DA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '#rl-tb .rl-tb-msg strong{font-size:16px;font-weight:800;letter-spacing:-0.03em;color:#fff;margin-right:12px}',
  '#rl-tb .rl-tb-msg em{font-style:normal;font-weight:600;color:#E6EEFF}',
  '#rl-tb .rl-tb-act{flex:none;display:flex;align-items:center;gap:2px}',
  '#rl-tb button{border:0;background:transparent;font:inherit;cursor:pointer;color:rgba(255,255,255,.62);border-radius:8px}',
  '#rl-tb .rl-tb-day{font-size:13px;line-height:20px;padding:6px 8px;white-space:nowrap}',
  '#rl-tb .rl-tb-x{width:32px;height:32px;font-size:20px;line-height:32px;padding:0;text-align:center}',
  '#rl-tb button:hover{background:rgba(255,255,255,.1);color:#fff}',
  '#rl-tb button:focus-visible{outline:2px solid #7FB0FF;outline-offset:1px}',
  '@media (max-width:1100px){#rl-tb .rl-tb-long{display:none}}',
  '@media (max-width:960px){#rl-tb .rl-tb-logos,#rl-tb .rl-tb-sep{display:none}}',
  '@media (max-width:860px){',
  '#rl-tb .rl-tb-in{height:64px;padding:6px 8px 8px 16px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:30px 20px;gap:0 10px}',
  '#rl-tb .rl-tb-logos{display:flex;grid-column:1/3;grid-row:1}',
  '#rl-tb .rl-tb-logos img{height:14px}',
  '#rl-tb .rl-tb-act{grid-column:3;grid-row:1}',
  '#rl-tb .rl-tb-badge{grid-column:1;grid-row:2;height:20px;padding:0 8px 0 6px;font-size:9px;letter-spacing:.12em}',
  '#rl-tb .rl-tb-badge svg{width:11px;height:11px}',
  '#rl-tb .rl-tb-msg{grid-column:2/4;grid-row:2;font-size:12.5px}',
  '#rl-tb .rl-tb-msg strong{font-size:14px;margin-right:6px}',
  '#rl-tb .rl-tb-pg{display:none}',
  '#rl-tb .rl-tb-day{font-size:12px;padding:5px 6px}',
  '#rl-tb .rl-tb-x{width:30px;height:30px;line-height:30px}',
  '}',
  '@media (max-width:480px){#rl-tb .rl-tb-ben{display:none}}',
  '@media (prefers-reduced-motion:reduce){#rl-tb .rl-tb-badge::after{animation:none;display:none}}',
].join('');

// 배지 문구는 "협력사"의 영문 그대로 PARTNER 다 — 확인되지 않은 '공식·인증' 같은 표현은 쓰지 않는다.
const BADGE_ICON =
  '<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">' +
  '<path d="M8 .8l5.6 2.1v4.3c0 3.6-2.4 6.6-5.6 8-3.2-1.4-5.6-4.4-5.6-8V2.9z" fill="#3182F6"/>' +
  '<path d="M5.2 8.1l1.9 1.9 3.7-3.8" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const MARKUP =
  '<div class="rl-tb-in">' +
  '<div class="rl-tb-logos">' +
  '<img src="/assets/partners/toss-banner-reumlab.png" alt="름랩 REUMLAB" width="83" height="17">' +
  '<span aria-hidden="true">&times;</span>' +
  '<img src="/assets/partners/toss-banner-tosspayments.png" alt="토스페이먼츠" width="105" height="17">' +
  '</div>' +
  '<span class="rl-tb-sep" aria-hidden="true"></span>' +
  '<span class="rl-tb-badge">' + BADGE_ICON + 'TOSS PAYMENTS PARTNER</span>' +
  '<p class="rl-tb-msg"><strong>토스페이먼츠 협력사</strong>' +
  '<span class="rl-tb-ben"><span class="rl-tb-long">름랩 고객사 </span><em>가입비·수수료 혜택</em><span class="rl-tb-pg"> · <em>PG 연동 적극 지원</em></span></span></p>' +
  '<div class="rl-tb-act">' +
  '<button type="button" class="rl-tb-day" data-rl-tb="day">오늘 하루 보지 않기</button>' +
  '<button type="button" class="rl-tb-x" data-rl-tb="session" aria-label="배너 닫기">&times;</button>' +
  '</div>' +
  '</div>';

const RUNTIME = `(function(){var el=document.getElementById(${JSON.stringify(TOSS_BANNER_ID)});if(!el)return;
var DK='reumlab:toss-banner:hide-until',SK='reumlab:toss-banner:closed';
function g(s,k){try{return window[s].getItem(k)}catch(e){return null}}
function p(s,k,v){try{window[s].setItem(k,v)}catch(e){}}
if(g('sessionStorage',SK)||Number(g('localStorage',DK))>Date.now())return;
el.innerHTML=${JSON.stringify(`<style>${CSS}</style>${MARKUP}`)};
el.setAttribute('role','region');el.setAttribute('aria-label','토스페이먼츠 협력사 안내');
var n=document.getElementById('nav'),fx=!!n&&window.getComputedStyle(n).position==='fixed';
function f(){if(!fx||/(^|\\s)scrolled(\\s|$)/.test(n.className))return;var h=n.offsetHeight;el.style.marginTop=h+'px';el.style.marginBottom=-h+'px'}
f();if(fx)window.addEventListener('resize',f);
el.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rl-tb]');if(!b)return;
if(b.getAttribute('data-rl-tb')==='day')p('localStorage',DK,String(Date.now()+864e5));p('sessionStorage',SK,'1');
if(fx)window.removeEventListener('resize',f);el.innerHTML='';el.style.marginTop='';el.style.marginBottom='';
el.removeAttribute('role');el.removeAttribute('aria-label')});})();`;

/** 인라인 스크립트 본문(자리표시자 바로 뒤에 둔다) */
export const TOSS_BANNER_SCRIPT = RUNTIME.replace(/\n/g, '');

/** 정적 HTML 용 완성 조각 — 자리표시자 + 인라인 스크립트 */
export const TOSS_BANNER_HTML =
  `<div id="${TOSS_BANNER_ID}" data-nosnippet></div><script>${TOSS_BANNER_SCRIPT}</script>`;
