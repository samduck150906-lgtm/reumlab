/**
 * "개발 · 소통 방식" 절차 섹션 — 푸터 위 협력사 섹션 바로 앞에 같이 그려진다.
 *
 * 붙이는 방법·SEO 원칙은 토스페이먼츠 협력사 섹션과 같다(lib/toss-banner.mjs 머리말):
 * 같은 자리표시자([data-rl-tps])를 같은 인라인 스크립트가 채우므로 원문 HTML·제목·링크는 그대로다.
 * 문구는 절차 안내 원안 그대로이고, 제목 태그 대신 p/strong + 순서 목록(ol)을 쓴다.
 *
 * 디자인 — REUMLAB 디자인 시스템: 연회색 면 위 흰 표, 상단 1.5px 네이비 선 + 행 사이 헤어라인,
 * 순서는 숫자 단계 점(네이비 테두리 원)과 세로 연결선, 마지막 단계 점만 라임.
 * 문구 글자는 전부 Pretendard 서브셋 안에 있다 — 바꿀 때 scripts/verify-font-subset.mjs 와 대조할 것.
 */

const FONT = '"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif';
const LATIN = '"Helvetica Neue",Arial,sans-serif';

/** [단계 이름, 설명 줄들] — 설명이 없는 단계도 있다 */
const STEPS = [
  ['견적 최종 협의', ['필요 시 온·오프라인 미팅이 가능합니다.']],
  ['계약서 작성', ['모두싸인으로 전자계약서를 작성합니다.', '대면 계약도 가능합니다.']],
  ['착수금 입금', []],
  ['UI·UX 디자인 3안 제공', ['3일 이내, 계약 범위의 모든 화면을 A·B·C안으로 제공합니다.']],
  ['디자인 선택 및 수정 요청', ['A·B·C안 중 선택해 수정사항을 전달해 주세요. 태블릿으로 UI·UX PDF에 직접 표시하거나 \'화면번호 – 수정사항\' 형식으로 적어주셔도 됩니다.']],
  ['확정 UI·UX 공유', ['모든 수정사항을 반영한 디자인을 공유합니다.']],
  ['개발 진행 및 소통', ['카카오톡(단톡방 등), 전화, 미팅 등 선택하여 진행합니다.']],
];

export const PROCESS_CSS = [
  `.rl-pcs{background:#f4f5f8;color:#141a24;font-family:${FONT};letter-spacing:-0.02em;word-break:keep-all;-webkit-font-smoothing:antialiased;border-top:1px solid #e2e5eb}`,
  '.rl-pcs *{box-sizing:border-box}',
  '.rl-pcs-in{max-width:1228px;margin:0 auto;padding:112px 24px;display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:64px;align-items:start}',
  `.rl-pcs-eb{display:flex;align-items:center;gap:10px;margin:0;font:700 11px/1 ${LATIN};letter-spacing:.22em;color:#6b7383}`,
  '.rl-pcs-eb:before{content:"";width:6px;height:6px;background:#0f1f3a}',
  '.rl-pcs-h{margin:22px 0 0;font-size:48px;line-height:1.15;font-weight:800;letter-spacing:-0.04em;color:#0f1f3a}',
  '.rl-pcs-sub{margin:16px 0 0;font-size:18px;line-height:1.6;color:#3d4655}',
  // 단계 표: 흰 면 + 상단 굵은 네이비 선, 왼쪽 단계 점을 세로선이 잇는다
  '.rl-pcs-ol{list-style:none;margin:0;padding:0 36px;background:#fff;border:1px solid #e2e5eb;border-top:1.5px solid #0f1f3a;border-radius:0 0 11px 11px}',
  '.rl-pcs-ol li{position:relative;display:grid;grid-template-columns:44px minmax(0,15em) minmax(0,1fr);gap:0 28px;align-items:center;min-height:96px;padding:22px 0;border-top:1px solid #e2e5eb}',
  '.rl-pcs-ol li:first-child{border-top:0}',
  '.rl-pcs-ol li:before{content:"";position:absolute;left:21.5px;top:0;bottom:0;width:1px;background:#d5dae4}',
  '.rl-pcs-ol li:first-child:before{top:50%}.rl-pcs-ol li:last-child:before{bottom:50%}',
  `.rl-pcs-n{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:999px;background:#fff;border:1.5px solid #0f1f3a;font:700 13px/1 ${LATIN};letter-spacing:.04em;color:#0f1f3a}`,
  '.rl-pcs-ol li:last-child .rl-pcs-n{background:#c8f04a;border-color:#c8f04a;color:#2c3a06}',
  '.rl-pcs-ol strong{font-size:19px;line-height:1.4;font-weight:700;letter-spacing:-0.03em;color:#0f1f3a}',
  '.rl-pcs-d{margin:0;font-size:15.5px;line-height:1.7;color:#3d4655}',
  '@media (max-width:1024px){.rl-pcs-in{grid-template-columns:minmax(0,1fr);gap:40px}.rl-pcs-h{font-size:40px}}',
  '@media (max-width:760px){',
  '.rl-pcs-in{padding:72px 20px}',
  '.rl-pcs-h{margin-top:18px;font-size:31px}.rl-pcs-sub{margin-top:12px;font-size:16px}',
  '.rl-pcs-ol{padding:0 18px}',
  '.rl-pcs-ol li{grid-template-columns:36px minmax(0,1fr);gap:4px 16px;align-items:start;min-height:0;padding:20px 0}',
  '.rl-pcs-ol li:before{left:17.5px}',
  '.rl-pcs-ol li:first-child:before{top:38px}.rl-pcs-ol li:last-child:before{bottom:auto;height:38px}',
  '.rl-pcs-n{grid-row:1/3;width:36px;height:36px;font-size:12px}',
  '.rl-pcs-ol strong{grid-column:2;padding-top:6px;font-size:17px}',
  '.rl-pcs-d{grid-column:2;font-size:14.5px;line-height:1.65}',
  '}',
].join('');

export const PROCESS_MARKUP =
  '<section class="rl-pcs" aria-label="개발 · 소통 방식"><div class="rl-pcs-in">' +
  '<div><p class="rl-pcs-eb">PROCESS</p>' +
  '<p class="rl-pcs-h">개발 · 소통 방식</p>' +
  '<p class="rl-pcs-sub">계약부터 개발까지의 진행 안내</p></div>' +
  '<ol class="rl-pcs-ol">' +
  STEPS.map(
    ([title, lines], i) =>
      `<li><span class="rl-pcs-n" aria-hidden="true">0${i + 1}</span><strong>${title}</strong>` +
      (lines.length ? `<p class="rl-pcs-d">${lines.join('<br>')}</p>` : '') +
      '</li>',
  ).join('') +
  '</ol></div></section>';
