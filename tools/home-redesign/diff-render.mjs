/**
 * 렌더링 전/후 비교 — "DOM 에 있다"가 아니라 "화면에서 같은 것을 읽을 수 있다"를 본다.
 *
 *   node tools/home-redesign/diff-render.mjs <render-before.json> <render-after.json> [--out diff.json]
 *
 * 이번 변경이 만든 손실만 FAIL 로 센다. 변경 전에도 있던 문제는 BASELINE ISSUE 로 분리한다.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [ap, bp] = process.argv.slice(2);
const outPath = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
const A = JSON.parse(readFileSync(ap, 'utf8'));
const B = JSON.parse(readFileSync(bp, 'utf8'));

const rows = [];
const add = (status, area, detail, extra) => rows.push({ status, area, detail, ...(extra !== undefined ? { extra } : {}) });
const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);

/* 대비·터치영역처럼 "같은 요소"를 짚어야 하는 항목의 키 */
const ckey = (c) => `${c.sel}|${c.text}|${c.fontSize}`;
const tkey = (t) => `${t.sel}|${t.text}`;

for (const vp of Object.keys(A.viewports)) {
  const a = A.viewports[vp], b = B.viewports[vp];
  if (!b) { add('FAIL', `${vp}px`, 'after 에 해당 뷰포트 결과 없음'); continue; }

  /* 1) 읽히는 텍스트 — 화면에서 사라진 글자가 있는가.
     공백은 레이아웃(예: flex 항목 사이)에서 생기거나 사라지므로,
     "글자가 사라졌는가"(공백 제외 완전 일치)와 "공백이 달라졌는가"를 나눠서 본다. */
  const strip = (s) => s.replace(/\s+/g, '');
  if (a.bodyText === b.bodyText) add('PASS', `${vp}px 화면 텍스트`, `완전 동일 (${b.visibleTextLength}자)`);
  else if (strip(a.bodyText) === strip(b.bodyText)) {
    // 어느 자리의 공백이 달라졌는지 정확히 짚는다
    const spots = [];
    let i = 0, j = 0;
    const A2 = a.bodyText, B2 = b.bodyText;
    while (i < A2.length && j < B2.length) {
      if (A2[i] === B2[j]) { i++; j++; continue; }
      if (/\s/.test(A2[i])) { spots.push({ side: 'before에만 공백', at: A2.slice(Math.max(0, i - 18), i + 18) }); i++; continue; }
      if (/\s/.test(B2[j])) { spots.push({ side: 'after에만 공백', at: B2.slice(Math.max(0, j - 18), j + 18) }); j++; continue; }
      break;
    }
    add('PASS', `${vp}px 화면 텍스트`,
      `글자 손실 없음 — 공백만 다름 (${a.visibleTextLength}→${b.visibleTextLength}자, 공백 제외 ${strip(B2).length}자 동일)`,
      spots.slice(0, 10));
  } else {
    const seg = (s) => s.split(/(?<=[.?!다요])\s+/).map((x) => x.trim()).filter(Boolean);
    const sa = seg(a.bodyText), sb = new Set(seg(b.bodyText));
    const lost = sa.filter((x) => !sb.has(x));
    add('FAIL', `${vp}px 화면 텍스트`, `공백 제외 글자가 달라짐 (${strip(a.bodyText).length}→${strip(b.bodyText).length}자)`, lost.slice(0, 10));
  }

  /* 2) 헤딩 — 텍스트·레벨·순서·가시성 */
  add(eq(a.headings, b.headings) ? 'PASS' : 'FAIL', `${vp}px 헤딩`,
    eq(a.headings, b.headings) ? `${b.headings.length}개 동일(가시성 포함)` : '변경됨',
    eq(a.headings, b.headings) ? undefined : { before: a.headings.filter((h, i) => !eq(h, b.headings[i])).slice(0, 6), after: b.headings.filter((h, i) => !eq(h, a.headings[i])).slice(0, 6) });

  /* 3) 링크 — 목적지·문구·속성·영역·가시성·개수 */
  add(eq(a.links, b.links) ? 'PASS' : 'FAIL', `${vp}px 링크`,
    eq(a.links, b.links) ? `${b.links.length}개 동일(영역·가시성 포함)` : '변경됨',
    eq(a.links, b.links) ? undefined : { before: a.links.filter((l, i) => !eq(l, b.links[i])).slice(0, 6), after: b.links.filter((l, i) => !eq(l, a.links[i])).slice(0, 6) });

  /* 4) 로고 — 워드마크 서체·자간·색, 마크 비율·필터 */
  const norm = (L) => L.map((l) => ({ area: l.area, text: l.text, wordmark: l.wordmark, ko: l.ko,
    mark: l.mark ? { src: l.mark.src, naturalW: l.mark.naturalW, naturalH: l.mark.naturalH, aspect: l.mark.aspect,
      filter: l.mark.filter, opacity: l.mark.opacity, mixBlendMode: l.mark.mixBlendMode, objectFit: l.mark.objectFit, transform: l.mark.transform } : null }));
  const la = norm(a.logos), lb = norm(b.logos);
  add(eq(la, lb) ? 'PASS' : 'FAIL', `${vp}px 로고 외형`,
    eq(la, lb) ? `${lb.length}개 동일(서체·자간·색·비율·필터)` : '변경됨',
    eq(la, lb) ? undefined : { before: la, after: lb });
  // 표시 크기는 등비 변화만 허용
  for (let i = 0; i < Math.min(a.logos.length, b.logos.length); i++) {
    const ma = a.logos[i].mark, mb = b.logos[i].mark;
    if (!ma || !mb) continue;
    const ok = Math.abs((ma.aspect ?? 0) - (mb.aspect ?? 0)) < 0.001;
    add(ok ? 'PASS' : 'FAIL', `${vp}px 로고 마크 비율(${a.logos[i].area})`,
      ok ? `가로세로비 ${mb.aspect} 유지 (표시 ${ma.renderW}×${ma.renderH} → ${mb.renderW}×${mb.renderH})`
         : `비율이 ${ma.aspect} → ${mb.aspect} 로 변함`);
  }

  /* 5) 가로 넘침 */
  add(b.overflow.length <= a.overflow.length ? 'PASS' : 'FAIL', `${vp}px 가로 넘침`,
    `${a.overflow.length} → ${b.overflow.length}개 (문서 가로스크롤 ${a.hasHorizontalScroll} → ${b.hasHorizontalScroll})`,
    b.overflow.slice(0, 6));
  add(!b.hasHorizontalScroll ? 'PASS' : 'FAIL', `${vp}px 문서 가로 스크롤 없음`, `scrollWidth ${b.scrollWidth} / docWidth ${b.docWidth}`);

  /* 6) 대비 — 새로 실패한 것만 FAIL */
  const beforeFail = new Set(a.contrast.filter((c) => !c.pass).map(ckey));
  const afterFail = b.contrast.filter((c) => !c.pass);
  const newFail = afterFail.filter((c) => !beforeFail.has(ckey(c)));
  const stillFail = afterFail.filter((c) => beforeFail.has(ckey(c)));
  add(newFail.length ? 'FAIL' : 'PASS', `${vp}px 대비(새 실패)`,
    newFail.length ? `${newFail.length}개 새로 미달` : '새로 미달한 요소 없음',
    newFail.map((c) => ({ sel: c.sel, text: c.text, ratio: c.ratio, need: c.need, color: c.color, bg: c.bg })));
  if (stillFail.length) add('BASELINE ISSUE', `${vp}px 대비(기존 미달)`, `${stillFail.length}개`,
    stillFail.map((c) => ({ sel: c.sel, text: c.text, ratio: c.ratio, need: c.need })));
  // 좋아진 것도 기록
  const afterPass = new Map(b.contrast.map((c) => [ckey(c), c]));
  const improved = [...beforeFail].filter((k) => afterPass.get(k)?.pass);
  if (improved.length) add('PASS', `${vp}px 대비(개선)`, `${improved.length}개가 기준 통과로 바뀜`, improved.slice(0, 6));

  /* 7) 터치 영역 — 44px 미만으로 새로 줄어든 것 */
  const ta = new Map(a.tap.map((t) => [tkey(t), t]));
  const shrunk = b.tap.filter((t) => {
    const p = ta.get(tkey(t));
    return p && p.h >= 44 && t.h < 44;
  });
  add(shrunk.length ? 'FAIL' : 'PASS', `${vp}px 터치 영역`,
    shrunk.length ? `${shrunk.length}개가 44px 미만으로 줄어듦` : '44px 이상이던 요소가 줄어들지 않음',
    shrunk.slice(0, 8));
  const grown = b.tap.filter((t) => { const p = ta.get(tkey(t)); return p && p.h < 44 && t.h >= 44; });
  if (grown.length) add('PASS', `${vp}px 터치 영역(개선)`, `${grown.length}개가 44px 이상으로 커짐`, grown.slice(0, 6).map((t) => `${t.sel}:${t.text}`));

  /* 8) 콘솔·리소스 오류 */
  const errA = a.logs.pageErrors.length + a.logs.console.length + a.logs.failedLocal.length + a.logs.badStatus.length;
  const errB = b.logs.pageErrors.length + b.logs.console.length + b.logs.failedLocal.length + b.logs.badStatus.length;
  const newErrs = b.logs.pageErrors.filter((e) => !a.logs.pageErrors.includes(e));
  add(newErrs.length || errB > errA ? 'FAIL' : 'PASS', `${vp}px 콘솔·리소스`,
    `오류 ${errA} → ${errB}${newErrs.length ? ` (새 오류 ${newErrs.length})` : ''}`,
    { newPageErrors: newErrs, afterLogs: b.logs });
  if (b.logs.pageErrors.length) add('BASELINE ISSUE', `${vp}px 기존 JS 오류`, b.logs.pageErrors.join(' / '));

  /* 9) 포트폴리오 카드·FAQ 개수 */
  add(a.portfolioCards === b.portfolioCards ? 'PASS' : 'FAIL', `${vp}px 포트폴리오 카드 수`, `${a.portfolioCards} → ${b.portfolioCards}`);
  add(a.faqItems === b.faqItems ? 'PASS' : 'FAIL', `${vp}px FAQ 항목 수`, `${a.faqItems} → ${b.faqItems}`);
  add(a.faqOpen === b.faqOpen ? 'PASS' : 'FAIL', `${vp}px FAQ 초기 접힘 상태`, `열린 항목 ${a.faqOpen} → ${b.faqOpen}`);
}

/* --------------------------- 320px / 200% 확대 / JS 비활성 --------------------------- */
for (const k of ['w320', 'zoom200']) {
  const a = A.checks[k], b = B.checks[k];
  add(!b.hasHorizontalScroll ? 'PASS' : 'FAIL', `${k} 가로 스크롤 없음`, `${a.scrollWidth} → ${b.scrollWidth} (docWidth ${b.docWidth})`);
  add(b.overflow.length <= a.overflow.length ? 'PASS' : 'FAIL', `${k} 넘침 요소`, `${a.overflow.length} → ${b.overflow.length}`, b.overflow.slice(0, 5));
  const fa = new Set(a.contrast.filter((c) => !c.pass).map(ckey));
  const nf = b.contrast.filter((c) => !c.pass && !fa.has(ckey(c)));
  add(nf.length ? 'FAIL' : 'PASS', `${k} 대비(새 실패)`, nf.length ? `${nf.length}개` : '없음', nf.slice(0, 5));
}
{
  const a = A.checks.noJs, b = B.checks.noJs;
  for (const f of ['title', 'headingCount', 'linkCount', 'portfolioCards', 'faqAnswersInDom']) {
    add(eq(a[f], b[f]) ? 'PASS' : 'FAIL', `JS 비활성 ${f}`, `${JSON.stringify(a[f])} → ${JSON.stringify(b[f])}`);
  }
  add(eq(a.h1, b.h1) ? 'PASS' : 'FAIL', 'JS 비활성 H1', JSON.stringify(b.h1));
  const st = (s) => s.replace(/\s+/g, '');
  if (a.bodyText === b.bodyText) add('PASS', 'JS 비활성 본문 텍스트', `완전 동일 (${b.bodyTextLength}자)`);
  else if (st(a.bodyText) === st(b.bodyText)) add('PASS', 'JS 비활성 본문 텍스트', `글자 손실 없음 — 공백만 다름 (${a.bodyTextLength} → ${b.bodyTextLength}자, 공백 제외 ${st(b.bodyText).length}자 동일)`);
  else add('FAIL', 'JS 비활성 본문 텍스트', `공백 제외 글자가 달라짐 (${st(a.bodyText).length} → ${st(b.bodyText).length}자)`);
}

/* --------------------------------- 기능 --------------------------------- */
for (const k of ['functionalDesktop', 'functionalMobile']) {
  const a = A.checks[k], b = B.checks[k];
  const am = new Map(a.steps.map((s) => [s.name, s]));
  for (const s of b.steps) {
    const prev = am.get(s.name);
    if (!prev) { add('FAIL', `${b.tag} ${s.name}`, 'before 에 없던 검사'); continue; }
    if (s.status === 'PASS') add('PASS', `${b.tag} ${s.name}`, `PASS (전: ${prev.status})`);
    else if (prev.status !== 'PASS') add('BASELINE ISSUE', `${b.tag} ${s.name}`, `${s.status} (변경 전에도 ${prev.status})`, s.detail);
    else add('FAIL', `${b.tag} ${s.name}`, `${s.status} — 변경 전에는 PASS 였음`, { before: prev.detail, after: s.detail });
  }
}

/* ------------------------------- 모션 감소 ------------------------------- */
{
  const a = A.checks.reducedMotion, b = B.checks.reducedMotion;
  add(b.animatedCount <= a.animatedCount ? 'PASS' : 'FAIL', 'prefers-reduced-motion 애니메이션',
    `${a.animatedCount} → ${b.animatedCount}개`, b.animatedElements.slice(0, 5));
  add(b.elementsWithTransition <= a.elementsWithTransition ? 'PASS' : 'FAIL', 'prefers-reduced-motion 트랜지션',
    `${a.elementsWithTransition} → ${b.elementsWithTransition}개 요소`);
}

const fails = rows.filter((r) => r.status === 'FAIL');
const baseline = rows.filter((r) => r.status === 'BASELINE ISSUE');
const summary = { total: rows.length, pass: rows.filter((r) => r.status === 'PASS').length, fail: fails.length, baselineIssue: baseline.length, verdict: fails.length ? 'FAIL' : 'PASS' };
if (outPath) writeFileSync(outPath, JSON.stringify({ summary, rows }, null, 2), 'utf8');

console.log(`\n렌더링 diff: PASS ${summary.pass} · FAIL ${summary.fail} · BASELINE ISSUE ${summary.baselineIssue} → ${summary.verdict}`);
for (const r of rows) {
  if (r.status === 'PASS') continue;
  console.log(`  ${r.status === 'FAIL' ? '✖' : '△'} [${r.status}] ${r.area} — ${r.detail}`);
  if (r.extra !== undefined) { const s = JSON.stringify(r.extra); if (s !== '[]' && s !== '{}') console.log(`      ${s.slice(0, 900)}`); }
}
console.log(`\n(PASS ${summary.pass}건은 --out JSON 에 전부 기록)`);
if (outPath) console.log(`기계 판독용: ${outPath}`);
process.exit(fails.length ? 1 : 0);
