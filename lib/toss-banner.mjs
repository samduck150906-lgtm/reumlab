/**
 * 름랩 × 토스페이먼츠 협력사 — 헤더 아래 띠배너 + 푸터 위 소개 섹션. 단일 출처.
 *
 * 쓰는 곳 (모두 이 파일에서 만든다)
 *  - 띠배너   app/layout.tsx(<Nav> 뒤) · generate-purpose-landings.mjs(헤더 뒤) · index.html(마커, inject-toss-banner.mjs)
 *  - 소개 섹션 components/TossPartnerSection.tsx(푸터 컴포넌트들 바로 위) · generate-purpose-landings.mjs(FOOTER 앞)
 *             · index.html(<footer> 앞 마커, inject-toss-banner.mjs)
 *
 * SEO 를 건드리지 않기 위한 원칙 (둘 다 같다)
 *  - 원문 HTML 에는 빈 자리표시자(data-nosnippet)와 인라인 스크립트만 들어간다. 문구는 스크립트
 *    문자열 안에 있어 원문 본문 텍스트·제목·링크·메타는 그대로다(빌드 전후 전 HTML 비교로 확인).
 *  - 렌더링 후에도 h1~h6 를 쓰지 않고(문서 개요 보존) 링크를 추가하지 않으며, data-nosnippet 으로
 *    검색 스니펫에 쓰이지 않게 한다.
 *  - 스크립트는 자리표시자 바로 뒤에서 동기 실행돼 첫 페인트 전에 채운다 — 본문이 밀리는 CLS 가 없다.
 *  - React 는 dangerouslySetInnerHTML 요소의 자식을 하이드레이션하지 않으므로 불일치가 없다.
 *  - 문구 글자는 전부 Pretendard 서브셋 안에 있다 — 바꿀 때 scripts/verify-font-subset.mjs 의
 *    unicode-range 와 대조할 것(밖의 글자는 2MB 원본 폰트를 추가로 받게 한다).
 *  - 팝업은 쓰지 않는다.
 *
 * 띠배너 위치 — 헤더 바로 아래
 *  - 홈·목적 랜딩: sticky .header 뒤(<main> 앞). 흐름 안에 있어 그대로 밀어낸다.
 *  - Next 페이지: #nav 가 fixed 이고 히어로마다 헤더 높이만큼 위 여백이 있어, 헤더 높이(페이지·폭·노치마다
 *    다름)를 재 margin-top 으로 헤더 아래에 놓고 같은 값의 음수 margin-bottom 으로 되돌린다.
 *  - "오늘 하루 보지 않기" 24시간(localStorage) · "×" 이번 방문(sessionStorage).
 *
 * 소개 섹션 — 푸터 바로 위, 닫기 없음. 같은 자리표시자에 "개발 · 소통 방식" 절차(lib/process-section.mjs)를
 *   먼저 그리고 그 아래 협력사 소개를 그린다(본문 → 절차 → 협력사 → 푸터).
 *  - Next 는 클라이언트 내비게이션 때 React 가 새로 그린 자리표시자의 인라인 스크립트를 실행하지 않으므로,
 *    첫 실행 때 MutationObserver 를 걸어 빈 자리표시자가 DOM 에 들어오면 페인트 전에 채운다.
 *
 * 디자인 — REUMLAB 디자인 시스템: 네이비 #0f1f3a 면, Pretendard 800/700/400, 영문 라벨 +22% 자간,
 *  라임은 눈금(6px 사각) 한 곳, 그림자·그라데이션 없음, 표 상단 굵은 선 + 헤어라인.
 *  배지·라벨은 "협력사"의 영문 PARTNER 까지만 — 확인되지 않은 '공식·인증' 표현은 쓰지 않는다.
 */

import { PROCESS_CSS, PROCESS_MARKUP } from './process-section.mjs';

export const TOSS_BANNER_ID = 'rl-tb';

const LOGO_REUMLAB = '/assets/partners/toss-partner-reumlab-ondark.png'; // 389×80
const LOGO_TOSS = '/assets/partners/toss-partner-tosspayments-ondark.png'; // 493×80
const FONT = '"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif';
const LATIN = '"Helvetica Neue",Arial,sans-serif';

const lockup = (h, cls, lazy = false) =>
  `<div class="${cls}">` +
  `<img src="${LOGO_REUMLAB}" alt="름랩 REUMLAB" width="${Math.round((389 * h) / 80)}" height="${h}" decoding="async"${lazy ? ' loading="lazy"' : ''}>` +
  '<i aria-hidden="true"></i>' +
  `<img src="${LOGO_TOSS}" alt="토스페이먼츠" width="${Math.round((493 * h) / 80)}" height="${h}" decoding="async"${lazy ? ' loading="lazy"' : ''}>` +
  '</div>';

/* ───────────────────────── 띠배너 ───────────────────────── */

// 높이 고정(데스크톱 52px · 모바일 64px) — 웹폰트가 늦게 바뀌어도 배너 높이가 변하지 않는다.
const BANNER_CSS = [
  // z-index 는 헤더(홈 .header 100 · Next #nav 1000)보다 낮게 — 스크롤하면 헤더 아래로 지나간다.
  `#rl-tb{position:relative;z-index:90;background:#0f1f3a;border-bottom:1px solid #1b2f52;color:#fff;font-family:${FONT};`,
  'letter-spacing:-0.02em;word-break:keep-all;-webkit-font-smoothing:antialiased}',
  '#rl-tb *{box-sizing:border-box}',
  '#rl-tb .rl-tb-in{max-width:1228px;height:52px;margin:0 auto;padding:0 12px 0 24px;display:flex;align-items:center;gap:24px;overflow:hidden}',
  '#rl-tb .rl-tb-logos{flex:none;display:flex;align-items:center;gap:14px}',
  '#rl-tb .rl-tb-logos img{display:block;height:17px;width:auto}',
  '#rl-tb .rl-tb-logos i{width:1px;height:17px;background:rgba(255,255,255,.24)}',
  `#rl-tb .rl-tb-eb{flex:none;display:flex;align-items:center;gap:8px;font:700 10px/1 ${LATIN};letter-spacing:.22em;color:rgba(255,255,255,.66);white-space:nowrap}`,
  '#rl-tb .rl-tb-eb:before,#rl-tb .rl-tb-msg:before{content:"";flex:none;width:6px;height:6px;background:#c8f04a}',
  '#rl-tb .rl-tb-msg{flex:1;min-width:0;margin:0;display:flex;align-items:baseline;gap:14px;white-space:nowrap;overflow:hidden}',
  '#rl-tb .rl-tb-msg:before{display:none}',
  '#rl-tb .rl-tb-msg strong{flex:none;font-size:15px;font-weight:800;letter-spacing:-0.03em;color:#fff}',
  '#rl-tb .rl-tb-msg span{min-width:0;overflow:hidden;text-overflow:ellipsis;font-size:14px;color:rgba(255,255,255,.72)}',
  '#rl-tb .rl-tb-s{display:none}',
  '#rl-tb .rl-tb-act{flex:none;display:flex;align-items:center}',
  '#rl-tb button{border:0;background:transparent;font:inherit;cursor:pointer;color:rgba(255,255,255,.62);border-radius:8px;padding:0}',
  '#rl-tb .rl-tb-day{order:-1;height:44px;padding:0 10px;font-size:13px;white-space:nowrap}',
  '#rl-tb .rl-tb-x{width:44px;height:44px;display:flex;align-items:center;justify-content:center}',
  '#rl-tb button:hover{color:#fff;background:rgba(255,255,255,.08)}',
  '#rl-tb button:focus-visible{outline:2px solid #8eafff;outline-offset:-2px}',
  '@media (max-width:1100px){#rl-tb .rl-tb-eb{display:none}}',
  '@media (max-width:860px){',
  '#rl-tb .rl-tb-in{height:64px;padding:5px 4px 7px 20px;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:26px 24px;gap:0 8px;align-items:center}',
  '#rl-tb .rl-tb-logos{grid-column:1;grid-row:1;gap:12px}',
  '#rl-tb .rl-tb-logos img,#rl-tb .rl-tb-logos i{height:14px}',
  '#rl-tb .rl-tb-msg{grid-column:1;grid-row:2;align-items:center;gap:8px}',
  '#rl-tb .rl-tb-msg:before{display:block;width:5px;height:5px}',
  '#rl-tb .rl-tb-msg strong{font-size:14px}',
  '#rl-tb .rl-tb-msg span{font-size:12px}',
  '#rl-tb .rl-tb-l{display:none}#rl-tb .rl-tb-s{display:inline}',
  '#rl-tb .rl-tb-act{grid-column:2;grid-row:1/3;flex-direction:column;align-items:flex-end}',
  '#rl-tb .rl-tb-x{width:44px;height:30px}',
  '#rl-tb .rl-tb-day{order:0;height:26px;padding:0 12px;font-size:11px}',
  '}',
  '@media (max-width:340px){#rl-tb .rl-tb-msg span{display:none}}',
].join('');

const CLOSE_ICON =
  '<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>';

const BANNER_MARKUP =
  '<div class="rl-tb-in">' +
  lockup(17, 'rl-tb-logos') +
  '<span class="rl-tb-eb">PAYMENT PARTNER</span>' +
  '<p class="rl-tb-msg"><strong>토스페이먼츠 협력사</strong>' +
  '<span class="rl-tb-l">름랩 고객사 가입비·수수료 혜택 · PG 연동 적극 지원</span>' +
  '<span class="rl-tb-s">가입비·수수료 혜택</span></p>' +
  '<div class="rl-tb-act">' +
  '<button type="button" class="rl-tb-x" data-rl-tb="session" aria-label="배너 닫기">' + CLOSE_ICON + '</button>' +
  '<button type="button" class="rl-tb-day" data-rl-tb="day"><span class="rl-tb-l">오늘 하루 보지 않기</span><span class="rl-tb-s">하루 안 보기</span></button>' +
  '</div>' +
  '</div>';

// Next 클라이언트 내비게이션 때 레이아웃이 다시 그려지면 자리표시자가 빈 채로 새로 들어온다 —
// 소개 섹션과 같이 MutationObserver 로 페인트 전에 다시 채운다(닫은 뒤에는 저장된 표시 때문에 채우지 않는다).
const BANNER_RUNTIME = `(function(){var ID=${JSON.stringify(TOSS_BANNER_ID)},DK='reumlab:toss-banner:hide-until',SK='reumlab:toss-banner:closed';
function g(s,k){try{return window[s].getItem(k)}catch(e){return null}}
function p(s,k,v){try{window[s].setItem(k,v)}catch(e){}}
function off(){return g('sessionStorage',SK)||Number(g('localStorage',DK))>Date.now()}
function setup(el){if(!el||el.firstChild||off())return;
el.innerHTML=${JSON.stringify(`<style>${BANNER_CSS}</style>${BANNER_MARKUP}`)};
el.setAttribute('role','region');el.setAttribute('aria-label','토스페이먼츠 협력사 안내');
var n=document.getElementById('nav'),fx=!!n&&window.getComputedStyle(n).position==='fixed';
function f(){if(!fx||/(^|\\s)scrolled(\\s|$)/.test(n.className))return;var h=n.offsetHeight;el.style.marginTop=h+'px';el.style.marginBottom=-h+'px'}
f();if(fx)window.addEventListener('resize',f);
el.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rl-tb]');if(!b)return;
if(b.getAttribute('data-rl-tb')==='day')p('localStorage',DK,String(Date.now()+864e5));p('sessionStorage',SK,'1');
if(fx)window.removeEventListener('resize',f);el.innerHTML='';el.style.marginTop='';el.style.marginBottom='';
el.removeAttribute('role');el.removeAttribute('aria-label')})}
setup(document.getElementById(ID));
if(!window.__rlTb&&window.MutationObserver){window.__rlTb=1;
new MutationObserver(function(r){for(var i=0;i<r.length;i++)if(r[i].addedNodes.length){setup(document.getElementById(ID));return}}).observe(document.body||document.documentElement,{childList:true,subtree:true})}})();`;

/** 띠배너 인라인 스크립트 본문(자리표시자 바로 뒤에 둔다) */
export const TOSS_BANNER_SCRIPT = BANNER_RUNTIME.replace(/\n/g, '');

/** 띠배너 정적 HTML 조각 — 자리표시자 + 인라인 스크립트 */
export const TOSS_BANNER_HTML =
  `<div id="${TOSS_BANNER_ID}" data-nosnippet></div><script>${TOSS_BANNER_SCRIPT}</script>`;

/* ───────────────────────── 소개 섹션 ───────────────────────── */

/** 소개 섹션 자리표시자 표식(한 페이지에 하나, Next 는 푸터 컴포넌트마다) */
export const TOSS_SECTION_ATTR = 'data-rl-tps';

// 문구는 협력사 소개 원안(section.html) 그대로다. 제목 태그 대신 p/strong — 페이지 문서 개요를 바꾸지 않는다.
const SECTION_CSS = [
  `.rl-tps{position:relative;background-color:#0f1f3a;color:#fff;font-family:${FONT};letter-spacing:-0.02em;word-break:keep-all;-webkit-font-smoothing:antialiased;`,
  // 표지용 12mm 격자(흰색 4.5%) — REUMLAB 시스템의 네이비 면 처리
  'background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:45px 45px;background-position:-1px -1px}',
  '.rl-tps *{box-sizing:border-box}',
  '.rl-tps-in{max-width:1228px;margin:0 auto;padding:112px 24px 104px}',
  '.rl-tps-top{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,.14)}',
  `.rl-tps-eb{display:flex;align-items:center;gap:10px;margin:0;font:700 11px/1 ${LATIN};letter-spacing:.22em;color:rgba(255,255,255,.66)}`,
  '.rl-tps-eb:before{content:"";width:6px;height:6px;background:#c8f04a}',
  '.rl-tps-logos{display:flex;align-items:center;gap:22px}',
  '.rl-tps-logos img{display:block;height:34px;width:auto}',
  '.rl-tps-logos i{width:1px;height:34px;background:rgba(255,255,255,.24)}',
  '.rl-tps-h{margin:56px 0 0;font-size:56px;line-height:1.18;font-weight:800;letter-spacing:-0.04em;color:#fff}',
  '.rl-tps-h span{color:#a9c1ff}',
  '.rl-tps-p{margin:24px 0 0;max-width:820px;font-size:19px;line-height:1.75;color:rgba(255,255,255,.74)}',
  '.rl-tps-list{list-style:none;margin:72px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1.5px solid rgba(255,255,255,.9)}',
  '.rl-tps-list li{padding:32px 36px 4px;border-left:1px solid rgba(255,255,255,.14)}',
  '.rl-tps-list li:first-child{padding-left:0;border-left:0}',
  `.rl-tps-n{display:block;font:700 13px/1 ${LATIN};letter-spacing:.14em;color:#8eafff}`,
  '.rl-tps-list strong{display:block;margin-top:18px;font-size:23px;line-height:1.35;font-weight:700;letter-spacing:-0.03em;color:#fff}',
  '.rl-tps-list p{margin:10px 0 0;font-size:16px;line-height:1.7;color:rgba(255,255,255,.7)}',
  '@media (max-width:1024px){.rl-tps-h{font-size:44px}.rl-tps-list li{padding:28px 24px 4px}}',
  '@media (max-width:760px){',
  '.rl-tps-in{padding:72px 20px 64px}',
  '.rl-tps-top{flex-direction:column;align-items:flex-start;gap:20px;padding-bottom:24px}',
  '.rl-tps-logos{gap:16px}.rl-tps-logos img,.rl-tps-logos i{height:24px}',
  '.rl-tps-h{margin-top:40px;font-size:31px;line-height:1.26}',
  '.rl-tps-p{margin-top:18px;font-size:16px;line-height:1.7}.rl-tps-p br{display:none}',
  '.rl-tps-list{margin-top:44px;grid-template-columns:minmax(0,1fr)}',
  '.rl-tps-list li,.rl-tps-list li:first-child{padding:24px 0;border-left:0;border-top:1px solid rgba(255,255,255,.14)}',
  '.rl-tps-list li:first-child{border-top:0}',
  '.rl-tps-list strong{margin-top:12px;font-size:20px}.rl-tps-list p{font-size:15px}',
  '}',
].join('');

const ITEMS = [
  ['가입비 혜택', '토스페이먼츠 가입 시 가입비 혜택을 받을 수 있습니다.'],
  ['수수료 혜택', '결제 수수료 혜택으로 운영 비용 부담을 줄입니다.'],
  ['PG 연동 적극 지원', '개발 과정에서 PG사 연동이 필요하면 가입부터 연동·테스트까지 함께 진행합니다.'],
];

const SECTION_MARKUP =
  '<aside class="rl-tps" aria-label="름랩 × 토스페이먼츠 협력사 안내"><div class="rl-tps-in">' +
  '<div class="rl-tps-top"><p class="rl-tps-eb">PAYMENT PARTNER</p>' + lockup(34, 'rl-tps-logos', true) + '</div>' +
  '<p class="rl-tps-h">결제까지 완성하는 개발,<br><span>토스페이먼츠와 함께합니다.</span></p>' +
  '<p class="rl-tps-p">름랩은 토스페이먼츠 협력사입니다. 름랩 고객사는 가입비·수수료 혜택을 받을 수 있으며, <br>' +
  'PG 연동이 필요한 개발은 름랩이 적극 지원합니다.</p>' +
  '<ul class="rl-tps-list">' +
  ITEMS.map(([t, d], i) => `<li><span class="rl-tps-n">0${i + 1}</span><strong>${t}</strong><p>${d}</p></li>`).join('') +
  '</ul></div></aside>';

const SECTION_RUNTIME = `(function(){var H=${JSON.stringify(`<style>${PROCESS_CSS}${SECTION_CSS}</style>${PROCESS_MARKUP}${SECTION_MARKUP}`)};
function fill(el){if(el&&!el.firstChild)el.innerHTML=H}
function all(){var l=document.querySelectorAll('[${TOSS_SECTION_ATTR}]');for(var i=0;i<l.length;i++)fill(l[i])}
var s=document.currentScript;fill(s&&s.previousElementSibling&&s.previousElementSibling.hasAttribute('${TOSS_SECTION_ATTR}')?s.previousElementSibling:null);
if(!window.__rlTps&&window.MutationObserver){window.__rlTps=1;
new MutationObserver(function(r){for(var i=0;i<r.length;i++)if(r[i].addedNodes.length){all();return}}).observe(document.body||document.documentElement,{childList:true,subtree:true})}})();`;

/** 소개 섹션 인라인 스크립트 본문(자리표시자 바로 뒤에 둔다) */
export const TOSS_SECTION_SCRIPT = SECTION_RUNTIME.replace(/\n/g, '');

/** 소개 섹션 정적 HTML 조각 — 자리표시자 + 인라인 스크립트 */
export const TOSS_SECTION_HTML =
  `<div ${TOSS_SECTION_ATTR} data-nosnippet></div><script>${TOSS_SECTION_SCRIPT}</script>`;
