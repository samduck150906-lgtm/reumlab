/**
 * 의존성 없는 최소 HTML 파서 — 홈 리디자인 전/후 보호 항목 비교 전용.
 *
 * 새 패키지를 설치하지 않기 위해(리디자인 작업 범위 밖) 직접 만들었다.
 * 목표는 렌더링이 아니라 "무엇이 사라지거나 바뀌었는가"를 기계적으로 비교하는 것이므로
 * 태그 트리, 텍스트, 속성만 정확히 복원하면 충분하다.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

/** 원문 그대로 보존해야 하는(내부를 태그로 파싱하면 안 되는) 요소 */
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);

/** 자동으로 닫히는 태그 — <p><div> 같은 흔한 생략 패턴만 처리 */
const AUTO_CLOSE = {
  li: new Set(['li']),
  p: new Set(['p', 'div', 'section', 'ul', 'ol', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  td: new Set(['td', 'th', 'tr']),
  th: new Set(['td', 'th', 'tr']),
  tr: new Set(['tr']),
  option: new Set(['option']),
  dt: new Set(['dt', 'dd']),
  dd: new Set(['dt', 'dd']),
};

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  middot: '·', hellip: '…', mdash: '—', ndash: '–',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  times: '×', copy: '©', reg: '®', trade: '™',
  larr: '←', rarr: '→', uarr: '↑', darr: '↓',
  check: '✓', deg: '°', won: '₩', euro: '€',
};

export function decodeEntities(s) {
  return String(s).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const hit = ENTITIES[body] ?? ENTITIES[body.toLowerCase()];
    return hit === undefined ? m : hit;
  });
}

function parseAttrs(raw) {
  const attrs = {};
  const re = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (!(name in attrs)) attrs[name] = decodeEntities(value);
  }
  return attrs;
}

/**
 * HTML 문자열 → 노드 트리.
 * 노드: { type:'element'|'text'|'comment', tag, attrs, children, raw }
 */
export function parse(html) {
  const root = { type: 'element', tag: '#root', attrs: {}, children: [], parent: null };
  let cur = root;
  let i = 0;

  const openText = (text) => {
    if (text) cur.children.push({ type: 'text', value: decodeEntities(text), parent: cur });
  };

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) { openText(html.slice(i)); break; }
    if (lt > i) openText(html.slice(i, lt));

    // 주석 / doctype
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      const stop = end === -1 ? html.length : end + 3;
      cur.children.push({ type: 'comment', value: html.slice(lt + 4, end === -1 ? html.length : end), parent: cur });
      i = stop;
      continue;
    }
    if (html.startsWith('<!', lt)) {
      const end = html.indexOf('>', lt);
      i = end === -1 ? html.length : end + 1;
      continue;
    }

    // 닫는 태그
    if (html[lt + 1] === '/') {
      const end = html.indexOf('>', lt);
      const tag = html.slice(lt + 2, end === -1 ? html.length : end).trim().toLowerCase();
      // 가장 가까운 동일 태그까지 닫는다(미스매치 관용)
      let node = cur;
      while (node && node !== root && node.tag !== tag) node = node.parent;
      if (node && node !== root) cur = node.parent;
      i = end === -1 ? html.length : end + 1;
      continue;
    }

    // 여는 태그
    const m = /^<([a-zA-Z][^\s/>]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/.exec(html.slice(lt));
    if (!m) { openText('<'); i = lt + 1; continue; }
    const tag = m[1].toLowerCase();
    const attrs = parseAttrs(m[2]);
    const selfClosing = /\/\s*$/.test(m[2]);
    i = lt + m[0].length;

    // 생략된 닫는 태그 보정
    const closes = AUTO_CLOSE[cur.tag];
    if (closes && closes.has(tag)) cur = cur.parent;

    const node = { type: 'element', tag, attrs, children: [], parent: cur };
    cur.children.push(node);

    if (VOID.has(tag) || selfClosing) continue;

    if (RAW_TEXT.has(tag)) {
      const closeRe = new RegExp(`</${tag}\\s*>`, 'i');
      const rest = html.slice(i);
      const cm = closeRe.exec(rest);
      const inner = cm ? rest.slice(0, cm.index) : rest;
      node.children.push({ type: 'text', value: tag === 'script' || tag === 'style' ? inner : decodeEntities(inner), parent: node });
      node.raw = inner;
      i += cm ? cm.index + cm[0].length : rest.length;
      continue;
    }

    cur = node;
  }
  return root;
}

export function walk(node, fn) {
  fn(node);
  if (node.children) for (const c of node.children) walk(c, fn);
}

export function findAll(node, pred) {
  const out = [];
  walk(node, (n) => { if (n.type === 'element' && pred(n)) out.push(n); });
  return out;
}

export function byTag(node, tag) {
  return findAll(node, (n) => n.tag === tag);
}

export function hasClass(node, cls) {
  return String(node.attrs?.class || '').split(/\s+/).includes(cls);
}

/** 요소의 사람이 읽는 텍스트. script/style/noscript 는 제외하지 않고 옵션으로 받는다. */
export function textOf(node, { skip = new Set(['script', 'style']) } = {}) {
  let out = '';
  const rec = (n) => {
    if (n.type === 'text') { out += n.value; return; }
    if (n.type !== 'element') return;
    if (skip.has(n.tag)) return;
    if (n.tag === 'br') { out += '\n'; return; }
    for (const c of n.children || []) rec(c);
    // 블록 요소 뒤에는 경계를 넣어 단어가 붙지 않게 한다
    if (/^(p|div|section|li|h[1-6]|td|th|tr|ul|ol|figcaption|article|header|footer|nav|main|button|label|figure|option|table|span|a|b|em|strong|small|i|s)$/.test(n.tag)) out += ' ';
  };
  rec(node);
  return out;
}

/**
 * 비교용 텍스트 정규화.
 * 줄바꿈·연속 공백 같은 "표현상 차이"만 없앤다.
 * 숫자·부호·금액·조사·어순은 건드리지 않는다(마스터 프롬프트 9절).
 */
export function normText(s) {
  return String(s)
    .replace(/ /g, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
