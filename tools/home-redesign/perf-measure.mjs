/**
 * 성능 비교 — 기준본/변경본을 같은 기기·브라우저·조건에서 반복 측정한다.
 *
 *   NODE_PATH=... node tools/home-redesign/perf-measure.mjs \
 *     --before http://127.0.0.1:4321 --after http://127.0.0.1:4322 --runs 5 --out perf.json
 *
 * 측정하는 것: LCP, CLS, 첫 바이트~load, long task 총합(TBT 근사), 리소스 전송량(CSS/JS/이미지/폰트).
 * 측정하지 않는 것: Lighthouse 점수(미설치 → NOT RUN), 현장 INP(실사용자 데이터 없음 → 데이터 없음).
 *   long task 합계는 Lighthouse TBT 와 계산이 다르므로 TBT 라고 부르지 않는다.
 *   INP 를 이 값으로 대체하지 않는다.
 * 외부 요청(GTM·픽셀)은 차단한다 — 로컬 검사가 운영 계측을 오염시키지 않기 위해서다.
 * 따라서 이 수치는 "우리 자산이 만드는 차이"를 비교하는 값이고 실제 사용자 값이 아니다.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require_ = createRequire(import.meta.url);
function loadPlaywright() {
  const c = ['playwright', process.env.PLAYWRIGHT_MODULE_PATH,
    ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map((d) => join(d, 'playwright')),
    '/opt/node22/lib/node_modules/playwright'].filter(Boolean);
  for (const x of c) { try { return require_(x); } catch { /* next */ } }
  throw new Error('playwright 미설치');
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const BEFORE = opt('--before'), AFTER = opt('--after');
const RUNS = Number(opt('--runs', 5));
const OUT = opt('--out', './perf.json');
const VIEW = opt('--viewport', 'mobile');

const viewport = VIEW === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 900 };

const COLLECT = `(() => new Promise((resolve) => {
  const out = { lcp: 0, cls: 0, longTasks: 0, longTaskCount: 0 };
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) out.lcp = Math.max(out.lcp, e.startTime); })
      .observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { out.longTasks += Math.max(0, e.duration - 50); out.longTaskCount++; } })
      .observe({ type: 'longtask', buffered: true });
  } catch {}
  setTimeout(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0;
    const res = performance.getEntriesByType('resource').map((r) => ({
      name: r.name, type: r.initiatorType, size: r.transferSize || r.encodedBodySize || 0, dur: r.duration,
    }));
    resolve({
      lcp: +out.lcp.toFixed(1), cls: +out.cls.toFixed(4),
      longTasksOver50ms: +out.longTasks.toFixed(1), longTaskCount: out.longTaskCount,
      fcp: +fcp.toFixed(1),
      domContentLoaded: +(nav.domContentLoadedEventEnd || 0).toFixed(1),
      loadEvent: +(nav.loadEventEnd || 0).toFixed(1),
      resources: res,
    });
  }, 3500);
}))()`;

function bytesByType(resources) {
  const acc = { css: 0, js: 0, img: 0, font: 0, other: 0, total: 0 };
  for (const r of resources) {
    const n = r.name.split('?')[0];
    let k = 'other';
    if (/\.css$/i.test(n)) k = 'css';
    else if (/\.(m?js)$/i.test(n)) k = 'js';
    else if (/\.(png|jpe?g|webp|gif|svg|ico|avif)$/i.test(n)) k = 'img';
    else if (/\.(woff2?|ttf|otf)$/i.test(n)) k = 'font';
    acc[k] += r.size; acc.total += r.size;
  }
  return acc;
}

const med = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const stdev = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };

const browser = await chromium.launch();

async function measure(base, label) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    // 매 회 새 컨텍스트 = 빈 캐시. 같은 조건으로 반복한다.
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: VIEW === 'mobile', hasTouch: VIEW === 'mobile' });
    const page = await ctx.newPage();
    await page.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort()));
    await page.goto(base + '/', { waitUntil: 'load' });
    const m = await page.evaluate(COLLECT);
    m.bytes = bytesByType(m.resources);
    delete m.resources;
    runs.push(m);
    await ctx.close();
    process.stdout.write(`    ${label} run ${i + 1}/${RUNS}: LCP ${m.lcp}ms CLS ${m.cls} longTask ${m.longTasksOver50ms}ms\n`);
  }
  const pick = (f) => runs.map((r) => f(r));
  return {
    label, base, runs,
    median: {
      lcp: med(pick((r) => r.lcp)), cls: med(pick((r) => r.cls)),
      fcp: med(pick((r) => r.fcp)), loadEvent: med(pick((r) => r.loadEvent)),
      longTasksOver50ms: med(pick((r) => r.longTasksOver50ms)),
      bytesCss: med(pick((r) => r.bytes.css)), bytesJs: med(pick((r) => r.bytes.js)),
      bytesImg: med(pick((r) => r.bytes.img)), bytesFont: med(pick((r) => r.bytes.font)),
      bytesTotal: med(pick((r) => r.bytes.total)),
    },
    stdev: {
      lcp: +stdev(pick((r) => r.lcp)).toFixed(1), cls: +stdev(pick((r) => r.cls)).toFixed(4),
      longTasksOver50ms: +stdev(pick((r) => r.longTasksOver50ms)).toFixed(1),
    },
  };
}

console.log(`  기준본(${BEFORE}) ${RUNS}회 · ${VIEW} ${viewport.width}x${viewport.height}`);
const before = await measure(BEFORE, 'before');
console.log(`  변경본(${AFTER}) ${RUNS}회`);
const after = await measure(AFTER, 'after');
await browser.close();

const pct = (a, b) => (a === 0 ? null : +(((b - a) / a) * 100).toFixed(1));
const verdictRows = [];
const L = before.median, R = after.median;
verdictRows.push({ metric: 'LCP(ms)', before: L.lcp, after: R.lcp, deltaPct: pct(L.lcp, R.lcp), warnIf: '+10% 이상 악화', warn: pct(L.lcp, R.lcp) !== null && pct(L.lcp, R.lcp) >= 10 });
verdictRows.push({ metric: 'CLS', before: L.cls, after: R.cls, delta: +(R.cls - L.cls).toFixed(4), warnIf: '+0.02 이상 증가', warn: (R.cls - L.cls) >= 0.02 });
verdictRows.push({ metric: 'long task >50ms 합(ms)', before: L.longTasksOver50ms, after: R.longTasksOver50ms, deltaPct: pct(L.longTasksOver50ms, R.longTasksOver50ms), warnIf: '+10% 이상 악화(기준값 0이면 절대값으로 판단)', warn: L.longTasksOver50ms === 0 ? R.longTasksOver50ms > 0 : pct(L.longTasksOver50ms, R.longTasksOver50ms) >= 10 });
verdictRows.push({ metric: 'CSS 전송(byte)', before: L.bytesCss, after: R.bytesCss, deltaPct: pct(L.bytesCss, R.bytesCss), warnIf: '증가 기록', warn: R.bytesCss > L.bytesCss });
verdictRows.push({ metric: 'JS 전송(byte)', before: L.bytesJs, after: R.bytesJs, deltaPct: pct(L.bytesJs, R.bytesJs), warnIf: '초기 JS 증가 금지', warn: R.bytesJs > L.bytesJs });
verdictRows.push({ metric: '이미지 전송(byte)', before: L.bytesImg, after: R.bytesImg, deltaPct: pct(L.bytesImg, R.bytesImg), warnIf: '증가 기록', warn: R.bytesImg > L.bytesImg });
verdictRows.push({ metric: '전체 전송(byte)', before: L.bytesTotal, after: R.bytesTotal, deltaPct: pct(L.bytesTotal, R.bytesTotal), warnIf: '증가 기록', warn: R.bytesTotal > L.bytesTotal });

const result = {
  viewport: VIEW, runsPerSide: RUNS, measuredAt: new Date().toISOString(),
  environment: '로컬 컨테이너 · Chromium(Playwright) · 외부 요청 차단 · 네트워크 스로틀 없음 · 매회 빈 캐시',
  notRun: {
    lighthouseScore: 'NOT RUN — Lighthouse 미설치',
    fieldINP: '데이터 없음 — 실사용자 데이터 없이 현장 INP 를 산출할 수 없다. long task 합계로 대체하지 않는다.',
    throttledNetwork: 'NOT RUN — 네트워크/CPU 스로틀 조건은 측정하지 않았다',
  },
  before, after, comparison: verdictRows,
};
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8');

console.log('\n  지표            기준본 → 변경본 (중앙값, ' + RUNS + '회)');
for (const r of verdictRows) {
  const d = r.deltaPct !== undefined && r.deltaPct !== null ? `${r.deltaPct > 0 ? '+' : ''}${r.deltaPct}%` : (r.delta !== undefined ? `${r.delta > 0 ? '+' : ''}${r.delta}` : '');
  console.log(`  ${r.warn ? '⚠' : '·'} ${String(r.metric).padEnd(24)} ${String(r.before).padStart(10)} → ${String(r.after).padStart(10)}  ${d}`);
}
console.log(`\n  LCP 편차(σ): before ${before.stdev.lcp}ms / after ${after.stdev.lcp}ms`);
console.log(`  → ${OUT}`);
