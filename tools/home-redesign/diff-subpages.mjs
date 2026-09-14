/**
 * 서브페이지 전/후 비교 — 홈 전용 CSS 가 다른 템플릿으로 새지 않았는지 확인한다.
 *
 *   node tools/home-redesign/diff-subpages.mjs <before.json> <after.json> [--out diff.json]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [ap, bp] = process.argv.slice(2);
const outPath = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
const A = JSON.parse(readFileSync(ap, 'utf8'));
const B = JSON.parse(readFileSync(bp, 'utf8'));
const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);

const rows = [];
for (const path of Object.keys(A.pages)) {
  const pa = A.pages[path], pb = B.pages[path];
  if (!pb) { rows.push({ status: 'FAIL', path, area: '수집', detail: 'after 결과 없음' }); continue; }
  for (const vp of ['1280', '390']) {
    const a = pa[vp], b = pb[vp];
    const diffs = [];
    for (const f of ['status', 'title', 'canonical', 'robots', 'stylesheets', 'bodyAttrs', 'body', 'h1', 'headingCount', 'linkCount', 'bodyTextLength', 'docWidth', 'scrollWidth', 'rootVars']) {
      if (!eq(a[f], b[f])) diffs.push({ field: f, before: a[f], after: b[f] });
    }
    for (const sel of Object.keys(a.probes)) {
      if (!eq(a.probes[sel], b.probes[sel])) diffs.push({ field: `computed ${sel}`, before: a.probes[sel], after: b.probes[sel] });
    }
    rows.push({
      status: diffs.length ? 'FAIL' : 'PASS',
      path, area: `${vp}px`,
      detail: diffs.length ? `${diffs.length}개 항목이 달라짐` : `렌더 계산값 동일 (${pa.template})`,
      ...(diffs.length ? { diffs } : {}),
    });
  }
}

const fails = rows.filter((r) => r.status === 'FAIL');
const summary = { samples: Object.keys(A.pages).length, checks: rows.length, pass: rows.length - fails.length, fail: fails.length, verdict: fails.length ? 'FAIL' : 'PASS', note: '표본 검사다. 전체 1,349개 페이지 전수 검사가 아니다.' };
if (outPath) writeFileSync(outPath, JSON.stringify({ summary, rows }, null, 2), 'utf8');

console.log(`\n서브페이지 영향: ${summary.pass}/${summary.checks} PASS · ${summary.fail} FAIL → ${summary.verdict}`);
console.log(`(표본 ${summary.samples}개 페이지 × 2뷰포트 — 전수 아님)`);
for (const r of rows) {
  console.log(`  ${r.status === 'PASS' ? '✓' : '✖'} ${r.path} ${r.area} — ${r.detail}`);
  if (r.diffs) for (const d of r.diffs.slice(0, 6)) console.log(`      ${d.field}: ${JSON.stringify(d.before)} → ${JSON.stringify(d.after)}`.slice(0, 400));
}
if (outPath) console.log(`\n기계 판독용: ${outPath}`);
process.exit(fails.length ? 1 : 0);
