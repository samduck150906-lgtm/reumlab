/**
 * 포트폴리오 카드를 out/index.html 에 정적으로 주입한다.
 *
 * 문제
 *  홈의 포트폴리오 그리드(`<div class="pf-grid2" id="pfGrid">`)는 비어 있고, 카드가
 *  script.js 의 PROJECTS 배열로 클라이언트에서만 렌더된다. 즉 HTML 소스에는
 *  프로젝트 제목·해결한 문제·기능·담당 범위가 한 글자도 없다.
 *  - 네이버 Yeti 등 JS 실행이 제한적인 크롤러는 사이트의 핵심 신뢰 자산을 전혀 못 본다.
 *  - 생성형 검색 크롤러(GPTBot·ClaudeBot·PerplexityBot 등)는 대부분 JS를 실행하지 않아
 *    "름랩이 실제로 무엇을 만들었는지"를 인용할 근거가 없다.
 *
 * 해결
 *  빌드 시 script.js 의 PROJECTS(단일 출처)를 읽어, renderPortfolio()가 만드는 것과
 *  같은 카드 마크업을 HTML에 미리 넣는다. 런타임 동작은 건드리지 않는다 —
 *  script.js 는 평소대로 같은 내용을 다시 렌더하므로 화면·필터·모달은 그대로다.
 *  (크롤러가 보는 내용 = 사용자가 보는 내용 → 클로킹 아님)
 *
 * 데이터를 이 파일에 복제하지 않는다. script.js 가 바뀌면 여기 결과도 자동으로 따라간다.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SCRIPT = 'script.js';
const TARGET = 'out/index.html';
const MARKER = '<div class="pf-grid2" id="pfGrid">';

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

/** script.js 안의 `var PROJECTS = [...];` 배열 리터럴을 균형 잡힌 괄호로 잘라내 평가 */
function extractProjects(src) {
  const start = src.indexOf('var PROJECTS = [');
  if (start === -1) throw new Error('script.js 에서 PROJECTS 배열을 찾지 못했습니다.');
  const open = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('PROJECTS 배열의 끝을 찾지 못했습니다.');
  const literal = src.slice(open, end + 1);
  // 우리 저장소의 자체 소스만 평가한다(외부 입력 없음).
  return new Function(`return ${literal};`)();
}

function cardHtml(p) {
  const feats = p.features
    .slice(0, 3)
    .map((f) => `<li>${esc(f)}</li>`)
    .join('');
  return (
    `<article class="pf-card2" data-cat="${esc(p.cat)}" data-id="${esc(p.id)}">` +
    `<div class="pf-card2__shot shot shot--${esc(p.shot)}" aria-hidden="true"></div>` +
    `<div class="pf-card2__body">` +
    `<span class="pf-chip">${esc(p.chip)}</span>` +
    `<h3 class="pf-card2__title">${esc(p.title)}</h3>` +
    `<p class="pf-card2__problem">${esc(p.problem)}</p>` +
    `<ul class="pf-feats">${feats}</ul>` +
    `<p class="pf-card2__scope"><b>담당 범위</b> ${esc(p.scope)}</p>` +
    `<button class="pf-card2__more" type="button" data-open="${esc(p.id)}">자세히 보기 <span aria-hidden="true">→</span></button>` +
    `</div></article>`
  );
}

if (!existsSync(TARGET)) {
  console.error(`✗ ${TARGET} 이 없습니다. next build → copy:home 이후에 실행하세요.`);
  process.exit(1);
}

const projects = extractProjects(readFileSync(SCRIPT, 'utf8'));
const html = readFileSync(TARGET, 'utf8');

if (!html.includes(MARKER)) {
  console.error(`✗ ${TARGET} 에서 포트폴리오 그리드 마커를 찾지 못했습니다: ${MARKER}`);
  process.exit(1);
}

const cards = projects.map(cardHtml).join('');
const injected = html.replace(
  MARKER,
  `${MARKER}\n<!-- 아래 카드는 scripts/inject-portfolio-static.mjs 가 script.js 의 PROJECTS 로부터 빌드 시 주입합니다. 직접 편집하지 마세요. -->\n${cards}`,
);

writeFileSync(TARGET, injected);
console.log(`✓ 포트폴리오 정적 주입: ${projects.length}건 → ${TARGET}`);
