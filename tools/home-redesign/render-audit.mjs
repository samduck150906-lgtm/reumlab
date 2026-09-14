/**
 * 실제 렌더링 검사 — 홈 리디자인 전/후를 같은 조건으로 비교한다.
 *
 *   NODE_PATH=/opt/node22/lib/node_modules \
 *   node tools/home-redesign/render-audit.mjs --base http://127.0.0.1:4321 --label before --out <dir>
 *
 * 하는 것: 뷰포트별 렌더링 DOM 수집, 전체 캡처, 가로 넘침, 로고 계산 스타일,
 *          대비, 터치 영역, 기능(FAQ·필터·모달·모바일 내비), 콘솔 오류·리소스 실패,
 *          JS 비활성 렌더링.
 * 하지 않는 것: 실제 폼 전송, 운영 계측 발송, 외부 네트워크 호출.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

/**
 * playwright 는 이 저장소의 의존성이 아니다(리디자인 작업에서 package.json 을
 * 건드리지 않기 위해 추가하지 않았다). 로컬에 설치된 것을 찾아 쓴다:
 *   1) 프로젝트 node_modules  2) PLAYWRIGHT_MODULE_PATH  3) NODE_PATH 목록  4) 전역 설치 경로
 */
const require_ = createRequire(import.meta.url);
function loadPlaywright() {
  const candidates = [
    'playwright',
    process.env.PLAYWRIGHT_MODULE_PATH,
    ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map((d) => join(d, 'playwright')),
    '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright',
    '/usr/local/lib/node_modules/playwright',
  ].filter(Boolean);
  for (const c of candidates) {
    try { return require_(c); } catch { /* 다음 후보 */ }
  }
  throw new Error(`playwright 를 찾지 못했습니다. 시도한 경로: ${candidates.join(', ')}`);
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const BASE = opt('--base', 'http://127.0.0.1:4321');
const LABEL = opt('--label', 'run');
const OUT = opt('--out', `./render-${LABEL}`);
const PATHNAME = opt('--path', '/');

mkdirSync(join(OUT, 'shots'), { recursive: true });

const VIEWPORTS = [
  { name: '360', width: 360, height: 800, mobile: true },
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '430', width: 430, height: 932, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: false },
  { name: '1280', width: 1280, height: 900, mobile: false },
  { name: '1440', width: 1440, height: 900, mobile: false },
];

const report = { label: LABEL, base: BASE, path: PATHNAME, startedAt: new Date().toISOString(), viewports: {}, checks: {} };

/** 외부 네트워크(광고·분석·폰트 CDN)는 전부 차단한다 — 로컬 검사가 운영 계측을 오염시키지 않도록. */
async function blockExternal(page) {
  const blocked = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1') || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    blocked.push(url);
    return route.abort();
  });
  return blocked;
}

function attachLogs(page, sink) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') sink.console.push({ type: m.type(), text: m.text().slice(0, 400) });
  });
  page.on('pageerror', (e) => sink.pageErrors.push(String(e.message).slice(0, 400)));
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (u.startsWith('http://127.0.0.1')) sink.failedLocal.push({ url: u, error: r.failure()?.errorText || '' });
  });
  page.on('response', (r) => {
    const u = r.url();
    if (u.startsWith('http://127.0.0.1') && r.status() >= 400) sink.badStatus.push({ url: u, status: r.status() });
  });
}

/** 페이지 안에서 실행되는 수집기 — 렌더링된 DOM 기준 */
const COLLECT = () => {
  const norm = (s) => String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const areaOf = (el) => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      if (n.tagName === 'HEADER') return 'header';
      if (n.tagName === 'FOOTER') return 'footer';
      if (n.tagName === 'SECTION') return n.id ? `section#${n.id}` : `section.${(n.className || '').split(/\s+/)[0] || 'unnamed'}`;
      if (n.id === 'mobileNav') return 'mobile-nav';
      if (n.id === 'mcta') return 'mobile-cta';
      if (n.id === 'pm') return 'portfolio-modal';
      n = n.parentElement;
    }
    return 'other';
  };

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: Number(h.tagName[1]), text: norm(h.innerText || h.textContent), visible: vis(h),
  }));

  const links = [...document.querySelectorAll('a')].map((a) => ({
    area: areaOf(a), href: a.getAttribute('href'), text: norm(a.innerText || a.textContent),
    rel: a.getAttribute('rel'), target: a.getAttribute('target'), visible: vis(a),
    dataCta: a.getAttribute('data-cta'), dataCtaLoc: a.getAttribute('data-cta-loc'),
  }));

  const logos = [...document.querySelectorAll('.logo')].map((el) => {
    const cs = getComputedStyle(el);
    const img = el.querySelector('img.logo__mark');
    const ics = img ? getComputedStyle(img) : null;
    const ko = el.querySelector('.logo__ko');
    const kcs = ko ? getComputedStyle(ko) : null;
    const r = el.getBoundingClientRect();
    const ir = img ? img.getBoundingClientRect() : null;
    return {
      area: areaOf(el), text: norm(el.innerText || el.textContent),
      box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
      wordmark: {
        fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing, color: cs.color, textTransform: cs.textTransform,
        fontStyle: cs.fontStyle, whiteSpace: cs.whiteSpace, gap: cs.gap, filter: cs.filter,
        opacity: cs.opacity, mixBlendMode: cs.mixBlendMode,
      },
      ko: kcs ? { fontSize: kcs.fontSize, fontWeight: kcs.fontWeight, color: kcs.color, letterSpacing: kcs.letterSpacing } : null,
      mark: ics ? {
        src: img.getAttribute('src'), naturalW: img.naturalWidth, naturalH: img.naturalHeight,
        renderW: +ir.width.toFixed(2), renderH: +ir.height.toFixed(2),
        aspect: ir.height ? +(ir.width / ir.height).toFixed(4) : null,
        filter: ics.filter, opacity: ics.opacity, mixBlendMode: ics.mixBlendMode,
        objectFit: ics.objectFit, transform: ics.transform, complete: img.complete,
      } : null,
    };
  });

  // 가로 넘침 — 뷰포트를 넘는 요소.
  // 자체 가로 스크롤 컨테이너(표 래퍼 등) 안쪽은 의도된 것이므로 제외하고 따로 센다.
  // 화면 밖 멀리(<-500px) 배치된 것은 허니팟처럼 의도적으로 숨긴 요소로 분류한다.
  const docW = document.documentElement.clientWidth;
  const overflow = [];
  const inScrollContainer = [];
  const offscreenByDesign = [];
  const hasScrollAncestor = (el) => {
    let n = el.parentElement;
    while (n && n !== document.documentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return n;
      n = n.parentElement;
    }
    return null;
  };
  const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : '');
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right <= docW + 1 && r.left >= -1) continue;
    const rec = { sel: label(el), left: +r.left.toFixed(1), right: +r.right.toFixed(1), overflowX: getComputedStyle(el).overflowX };
    if (r.left < -500 && r.right < 0) { offscreenByDesign.push(rec); continue; }
    const sc = hasScrollAncestor(el);
    if (sc) { rec.scrollContainer = label(sc); inScrollContainer.push(rec); continue; }
    overflow.push(rec);
  }

  // 텍스트 대비 — 화면에 보이는 텍스트 노드 기준
  const parseRGB = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const effBg = (el) => {
    let n = el;
    let acc = null;
    while (n && n !== document.documentElement) {
      const c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { acc = acc ? over(acc, c) : c; if (acc.a >= 0.999) return acc; }
      n = n.parentElement;
    }
    return acc && acc.a >= 0.999 ? acc : { r: 255, g: 255, b: 255, a: 1 };
  };
  const contrast = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!direct) continue;
    const cs = getComputedStyle(el);
    const fg0 = parseRGB(cs.color);
    if (!fg0) continue;
    const bg = effBg(el);
    const fg = fg0.a < 1 ? over(fg0, bg) : fg0;
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    const need = large ? 3 : 4.5;
    contrast.push({
      sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : ''),
      text: norm(el.textContent).slice(0, 60), fontSize: cs.fontSize, weight: cs.fontWeight,
      color: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      ratio: +ratio.toFixed(2), need, pass: ratio + 0.005 >= need, large,
    });
  }

  // 터치 영역 — 화면에 보이는 링크/버튼
  const tap = [...document.querySelectorAll('a,button,input[type=submit]')].filter(vis).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : ''),
      text: norm(el.innerText || el.textContent || el.getAttribute('aria-label') || '').slice(0, 40),
      w: +r.width.toFixed(1), h: +r.height.toFixed(1),
    };
  });

  // 위치 고정 요소가 본문을 가리는지
  const fixed = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el);
    return (cs.position === 'fixed' || cs.position === 'sticky') && vis(el);
  }).map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '.' + String(el.className).split(/\s+/)[0]), position: cs.position, top: +r.top.toFixed(1), h: +r.height.toFixed(1), z: cs.zIndex };
  });

  return {
    title: document.title,
    docWidth: docW,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    hasHorizontalScroll: document.documentElement.scrollWidth > docW + 1,
    headings, links, logos, overflow, inScrollContainer, offscreenByDesign, contrast, tap, fixed,
    visibleTextLength: norm(document.body.innerText).length,
    visibleTextSha: null,
    bodyText: norm(document.body.innerText),
    portfolioCards: document.querySelectorAll('#pfGrid .pf-card, #pfGrid > a, #pfGrid > article').length,
    faqItems: document.querySelectorAll('.faq-item').length,
    faqOpen: document.querySelectorAll('.faq-item.is-open, .faq-item[open]').length,
  };
};

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    userAgent: 'Mozilla/5.0 (ReumLab local redesign QA; Playwright) Chrome/141 Safari/537.36',
  });
  const page = await ctx.newPage();
  const sink = { console: [], pageErrors: [], failedLocal: [], badStatus: [] };
  attachLogs(page, sink);
  const blocked = await blockExternal(page);

  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(900);

  const data = await page.evaluate(COLLECT);
  data.logs = sink;
  data.blockedExternalHosts = [...new Set(blocked.map((u) => { try { return new URL(u).host; } catch { return u; } }))];

  await page.screenshot({ path: join(OUT, 'shots', `${LABEL}-${vp.name}-full.png`), fullPage: true });
  await page.screenshot({ path: join(OUT, 'shots', `${LABEL}-${vp.name}-fold.png`), fullPage: false });

  report.viewports[vp.name] = data;
  await ctx.close();
  console.log(`  · ${vp.name}px 수집 완료 (넘침 ${data.overflow.length} · 대비실패 ${data.contrast.filter((c) => !c.pass).length} · 콘솔오류 ${sink.console.length + sink.pageErrors.length})`);
}

/* ------------------------- 320px / 200% 확대 ------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await blockExternal(page);
  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  report.checks.w320 = await page.evaluate(COLLECT);
  await page.screenshot({ path: join(OUT, 'shots', `${LABEL}-320-full.png`), fullPage: true });
  await ctx.close();
}
{
  // 200% 확대 = 브라우저 확대. 디바이스 픽셀 비율이 아니라 CSS 픽셀 폭을 절반으로 본다.
  const ctx = await browser.newContext({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await blockExternal(page);
  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  report.checks.zoom200 = await page.evaluate(COLLECT);
  await page.screenshot({ path: join(OUT, 'shots', `${LABEL}-zoom200-full.png`), fullPage: true });
  await ctx.close();
}

/* ----------------------------- JS 비활성 ----------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await blockExternal(page);
  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  report.checks.noJs = await page.evaluate(() => {
    const norm = (s) => String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    return {
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((h) => norm(h.textContent)),
      headingCount: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
      linkCount: document.querySelectorAll('a[href]').length,
      bodyText: norm(document.body.innerText),
      bodyTextLength: norm(document.body.innerText).length,
      portfolioCards: document.querySelectorAll('#pfGrid > *').length,
      faqAnswersInDom: [...document.querySelectorAll('.faq-a')].map((n) => norm(n.textContent)).filter(Boolean).length,
    };
  });
  await page.screenshot({ path: join(OUT, 'shots', `${LABEL}-nojs-1280-full.png`), fullPage: true });
  await ctx.close();
}

/* ------------------------------ 기능 검사 ----------------------------- */
async function functional(width, height, mobile, tag) {
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const sink = { console: [], pageErrors: [], failedLocal: [], badStatus: [] };
  attachLogs(page, sink);
  await blockExternal(page);
  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const out = { tag, steps: [] };
  const step = (name, status, detail) => out.steps.push({ name, status, detail });

  // FAQ 첫 항목 열기/닫기
  try {
    const q = page.locator('.faq-item .faq-q').first();
    const item = page.locator('.faq-item').first();
    const beforeH = await item.evaluate((el) => el.querySelector('.faq-a').getBoundingClientRect().height);
    await q.click();
    await page.waitForTimeout(450);
    const openH = await item.evaluate((el) => el.querySelector('.faq-a').getBoundingClientRect().height);
    const answerVisible = await item.evaluate((el) => {
      const a = el.querySelector('.faq-a__in');
      const r = a.getBoundingClientRect();
      return r.height > 0 && getComputedStyle(a).visibility !== 'hidden';
    });
    await q.click();
    await page.waitForTimeout(450);
    const closeH = await item.evaluate((el) => el.querySelector('.faq-a').getBoundingClientRect().height);
    step('FAQ 열기/닫기', openH > beforeH && answerVisible && closeH < openH ? 'PASS' : 'FAIL',
      { closedH: +beforeH.toFixed(1), openH: +openH.toFixed(1), reclosedH: +closeH.toFixed(1), answerVisible });
  } catch (e) { step('FAQ 열기/닫기', 'ERROR', String(e.message).slice(0, 200)); }

  // 포트폴리오 필터
  try {
    const total = await page.locator('#pfGrid > *').count();
    await page.locator('.pf-filter__btn[data-filter="app"]').click();
    await page.waitForTimeout(400);
    const shown = await page.locator('#pfGrid > *:visible').count();
    await page.locator('.pf-filter__btn[data-filter="all"]').click();
    await page.waitForTimeout(400);
    const back = await page.locator('#pfGrid > *:visible').count();
    step('포트폴리오 필터', total > 0 && shown > 0 && shown < total && back === total ? 'PASS' : 'FAIL',
      { total, filteredVisible: shown, restored: back });
  } catch (e) { step('포트폴리오 필터', 'ERROR', String(e.message).slice(0, 200)); }

  // 포트폴리오 모달 열기 → 포커스 → ESC 닫기 → 포커스 복귀
  try {
    // 카드 자체가 아니라 script.js 가 위임 처리하는 [data-open] 트리거를 누른다.
    const card = page.locator('#pfGrid [data-open]').first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await page.waitForTimeout(500);
    const modalOpen = await page.locator('#pm').isVisible();
    const modalText = (await page.locator('#pmBody').innerText().catch(() => '')).trim().length;
    const focusInModal = await page.evaluate(() => !!document.activeElement?.closest('#pm'));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const modalClosed = !(await page.locator('#pm').isVisible());
    const focusRestored = await page.evaluate(() => !!document.activeElement && document.activeElement !== document.body);
    step('포트폴리오 모달', modalOpen && modalText > 50 && modalClosed ? 'PASS' : 'FAIL',
      { modalOpen, modalTextLength: modalText, focusInModal, modalClosed, focusRestoredToPage: focusRestored });
  } catch (e) { step('포트폴리오 모달', 'ERROR', String(e.message).slice(0, 200)); }

  // 내비게이션 (데스크톱 드롭다운 / 모바일 버거)
  if (mobile) {
    try {
      // 닫힌 내비도 display:block 이라 isVisible() 로는 판정할 수 없다 — 상태 클래스·aria 로 본다.
      const navState = () => page.evaluate(() => {
        const n = document.getElementById('mobileNav');
        const b = document.getElementById('burger');
        return { open: n.classList.contains('open'), ariaHidden: n.getAttribute('aria-hidden'), inert: n.hasAttribute('inert'), expanded: b.getAttribute('aria-expanded'), opacity: getComputedStyle(n).opacity };
      });
      await page.locator('#burger').click();
      await page.waitForTimeout(450);
      const opened = await navState();
      const itemCount = await page.locator('#mobileNav a:visible').count();
      await page.locator('.mnav-acc__btn').click();
      await page.waitForTimeout(350);
      const accItems = await page.locator('.mnav-acc__panel a:visible').count();
      await page.locator('#burger').click();
      await page.waitForTimeout(450);
      const closed = await navState();
      step('모바일 내비', opened.open && opened.expanded === 'true' && !opened.inert && itemCount > 0 && accItems >= 11 && !closed.open && closed.inert ? 'PASS' : 'FAIL',
        { opened, visibleLinks: itemCount, serviceMenuItems: accItems, closed });
    } catch (e) { step('모바일 내비', 'ERROR', String(e.message).slice(0, 200)); }
  } else {
    try {
      await page.locator('.nav-dd__btn').hover();
      await page.waitForTimeout(400);
      const ddItems = await page.locator('.nav-dd__menu a:visible').count();
      step('데스크톱 서비스 메뉴', ddItems >= 11 ? 'PASS' : 'FAIL', { visibleMenuItems: ddItems });
    } catch (e) { step('데스크톱 서비스 메뉴', 'ERROR', String(e.message).slice(0, 200)); }
  }

  // 키보드 탐색 — 보이는 포커스 링이 있는지
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    const seen = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      // outline 에 transition 이 걸린 버튼이 있어 즉시 읽으면 전환 중간값(0px)을 잡는다.
      await page.waitForTimeout(220);
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor,
          boxShadow: cs.boxShadow === 'none' ? 'none' : 'set',
          inViewport: r.top >= -2 && r.bottom <= window.innerHeight + 2,
          w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        };
      });
      if (info) seen.push(info);
    }
    const withRing = seen.filter((s) => (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow === 'set');
    step('키보드 포커스 가시성', seen.length > 0 && withRing.length === seen.length ? 'PASS' : 'FAIL',
      { tabbed: seen.length, withVisibleRing: withRing.length, missing: seen.filter((s) => !((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow === 'set')).map((s) => `${s.tag}:${s.text}`) });
  } catch (e) { step('키보드 포커스 가시성', 'ERROR', String(e.message).slice(0, 200)); }

  // 문의 폼 — 전송 직전까지만(네트워크 차단). 실제 발송 없음.
  try {
    let submitAttempt = null;
    await page.route('**/*', (route) => {
      const r = route.request();
      if (r.method() === 'POST') { submitAttempt = { url: r.url(), method: 'POST', bodyLength: (r.postData() || '').length }; return route.abort(); }
      if (r.url().startsWith('http://127.0.0.1')) return route.continue();
      return route.abort();
    });
    await page.locator('#af-name').fill('테스트 업체 (로컬 QA)');
    await page.locator('#af-phone').fill('010-0000-0000');
    await page.locator('#af-email').fill('qa@example.invalid');
    await page.locator('#af-features').fill('로컬 검증용 입력 — 실제 전송하지 않음');
    const validBefore = await page.locator('form[data-reum-apply]').evaluate((f) => f.checkValidity());
    await page.locator('.af-check input[type=checkbox]').check();
    const validAfter = await page.locator('form[data-reum-apply]').evaluate((f) => f.checkValidity());
    await page.locator('.af-submit').click();
    await page.waitForTimeout(900);
    const errShown = await page.locator('.af-error').isVisible().catch(() => false);
    const doneShown = await page.locator('.af-done').isVisible().catch(() => false);
    step('문의 폼(전송 차단)', validBefore === false && validAfter === true && submitAttempt ? 'PASS' : 'FAIL',
      { validityBeforeConsent: validBefore, validityAfterConsent: validAfter, submitIntercepted: submitAttempt, errorStateShown: errShown, successStateShown: doneShown });
  } catch (e) { step('문의 폼(전송 차단)', 'ERROR', String(e.message).slice(0, 200)); }

  out.logs = sink;
  await ctx.close();
  return out;
}

report.checks.functionalDesktop = await functional(1280, 900, false, 'desktop-1280');
report.checks.functionalMobile = await functional(390, 844, true, 'mobile-390');

/* ------------------------- 모션 감소 선호 ------------------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await blockExternal(page);
  await page.goto(BASE + PATHNAME, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  report.checks.reducedMotion = await page.evaluate(() => {
    const els = [...document.querySelectorAll('body *')].slice(0, 4000);
    const animated = els.filter((el) => {
      const cs = getComputedStyle(el);
      return cs.animationName !== 'none' && cs.animationDuration !== '0s' && parseFloat(cs.animationDuration) > 0.05;
    }).map((el) => ({ sel: el.tagName.toLowerCase() + '.' + String(el.className).split(/\s+/)[0], name: getComputedStyle(el).animationName, dur: getComputedStyle(el).animationDuration }));
    const longTransitions = els.filter((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.transitionDuration) > 0.05;
    }).length;
    return { animatedElements: animated.slice(0, 20), animatedCount: animated.length, elementsWithTransition: longTransitions, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
  });
  await ctx.close();
}

await browser.close();
report.finishedAt = new Date().toISOString();
writeFileSync(join(OUT, `render-${LABEL}.json`), JSON.stringify(report, null, 2), 'utf8');
console.log(`✓ render-audit(${LABEL}) → ${join(OUT, `render-${LABEL}.json`)}`);
