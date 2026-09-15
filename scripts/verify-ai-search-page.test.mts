/**
 * verify-ai-search-page 게이트가 "실제로 실패를 잡는지" 확인하는 테스트.
 *
 * 왜 필요한가
 *  정상 산출물에서 통과하는 것만 보면, 검사가 아무것도 안 보고 통과하는 경우와
 *  구분되지 않는다. fixture 복사본에 결함을 하나씩 주입해 종료코드가 non-zero 인지,
 *  의도한 실패 종류가 나오는지 본다. 실제 out/ 은 건드리지 않는다.
 *
 * 전제: 먼저 npm run build 로 out/ 이 만들어져 있어야 한다. 없으면 건너뛴다.
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const OUT = 'out';
const GATE = 'scripts/verify-ai-search-page.mjs';
const PAGE = join('ai-search-optimization', 'index.html');
const ready = existsSync(join(OUT, PAGE));

function runGate(dir: string) {
  const r = spawnSync(process.execPath, [GATE, dir], { encoding: 'utf8' });
  return { code: r.status ?? -1, output: `${r.stdout}\n${r.stderr}` };
}

/**
 * 최소 fixture — 대상 페이지 + 게이트가 참조하는 파일만 복사한다.
 * 내부 링크 존재 검사가 있으므로, 페이지가 거는 내부 링크의 스텁도 만든다.
 */
function makeFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'aisa-'));
  mkdirSync(join(dir, 'ai-search-optimization'), { recursive: true });
  cpSync(join(OUT, PAGE), join(dir, PAGE));
  for (const f of ['__forms.html', 'index.html', 'llms.txt', 'llms-full.txt', 'og-ai-search-architecture.jpg']) {
    if (existsSync(join(OUT, f))) cpSync(join(OUT, f), join(dir, f));
  }
  for (const f of readdirSync(OUT).filter((x) => /^sitemap.*\.xml$/.test(x))) cpSync(join(OUT, f), join(dir, f));

  const html = readFileSync(join(OUT, PAGE), 'utf8');
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const hrefs = [...new Set([...main.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))];
  for (const href of hrefs) {
    if (href === '/') continue;
    const d = join(dir, decodeURIComponent(href).replace(/^\//, ''));
    mkdirSync(d, { recursive: true });
    const f = join(d, 'index.html');
    if (!existsSync(f)) {
      // /geo-website/ 스텁은 "돌아오는 링크"를 포함해야 양방향 검사를 통과한다.
      const back = href.startsWith('/geo-website') ? '<a href="/ai-search-optimization/">기존 홈페이지 개선</a>' : 'stub';
      writeFileSync(f, `<!doctype html><html lang="ko"><head><link rel="canonical" href="https://reumlab.com${href}"/></head><body>${back}</body></html>`);
    }
  }
  return dir;
}

/** fixture 를 만들고 파일을 변형한 뒤 게이트를 돌린다. */
function withDefect(edit: (files: { page: string; forms: string; home: string; llms: string }) => Partial<{ page: string; forms: string; home: string; llms: string }>) {
  const dir = makeFixture();
  try {
    const read = (f: string) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : '');
    const next = edit({ page: read(PAGE), forms: read('__forms.html'), home: read('index.html'), llms: read('llms.txt') });
    if (next.page !== undefined) writeFileSync(join(dir, PAGE), next.page);
    if (next.forms !== undefined) writeFileSync(join(dir, '__forms.html'), next.forms);
    if (next.home !== undefined) writeFileSync(join(dir, 'index.html'), next.home);
    if (next.llms !== undefined) writeFileSync(join(dir, 'llms.txt'), next.llms);
    return runGate(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('verify-ai-search-page 게이트', { skip: ready ? false : 'out/ 없음 — npm run build 먼저 실행' }, () => {
  before(() => assert.ok(existsSync(GATE), `${GATE} 가 없습니다`));

  // ── 양성 대조군 ────────────────────────────────────────────────
  test('정상 fixture 는 통과한다', () => {
    const dir = makeFixture();
    try {
      const r = runGate(dir);
      assert.equal(r.code, 0, r.output);
      assert.match(r.output, /통과/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  // ── 결함 주입 ──────────────────────────────────────────────────
  test('canonical 이 바뀌면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('rel="canonical" href="https://reumlab.com/ai-search-optimization/"', 'rel="canonical" href="https://reumlab.com/geo-website/"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /canonical/);
  });

  test('canonical 이 두 개면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</head>', '<link rel="canonical" href="https://reumlab.com/ai-search-optimization/"/></head>') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /canonical 2개/);
  });

  test('noindex 가 섞이면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('content="index, follow"', 'content="noindex, nofollow"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /noindex/);
  });

  test('description 이 사라지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace(/<meta name="description"[^>]*>/, '') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /description 0개/);
  });

  test('화면 가격과 Offer 가 어긋나면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('"minPrice":2500000', '"minPrice":1500000') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /minPrice/);
  });

  test('Offer 에서 VAT 포함 표시가 빠지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('"valueAddedTaxIncluded":true', '"valueAddedTaxIncluded":false') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /valueAddedTaxIncluded/);
  });

  test('Offer 에 확정가(price)를 넣으면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('"@type":"Offer","name":"START', '"@type":"Offer","price":2500000,"name":"START') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /확정가/);
  });

  test('Service.provider 참조가 끊기면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('"provider":{"@id":"https://reumlab.com/#business"}', '"provider":{"@id":"https://reumlab.com/#studio"}') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /provider/);
  });

  test('ld+json 이 깨지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('"@type":"WebPage"', '"@type":WebPage') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /파싱 실패/);
  });

  test('전역 사업체 엔티티를 이 페이지에서 또 정의하면 실패', () => {
    const r = withDefect(({ page }) => ({
      page: page.replace('</body>', '<script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","@id":"https://reumlab.com/#business","name":"름랩"}</script></body>'),
    }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /중복 엔티티/);
  });

  test('스키마에만 있고 화면에 없는 FAQ 는 실패', () => {
    const r = withDefect(({ page }) => ({
      page: page.replace('"@type":"FAQPage","@id":"https://reumlab.com/ai-search-optimization/#faq","mainEntity":[', '"@type":"FAQPage","@id":"https://reumlab.com/ai-search-optimization/#faq","mainEntity":[{"@type":"Question","name":"화면에 없는 질문","acceptedAnswer":{"@type":"Answer","text":"화면에 없는 답변입니다 이 문장은 본문 어디에도 없습니다"}},'),
    }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /화면에 없는 FAQ|FAQ 수 불일치/);
  });

  test('FAQ 답변 본문이 사라지면(질문만 남으면) 실패', () => {
    const r = withDefect(({ page }) => {
      // 헤더 모바일 내비에도 <details> 가 있으므로 반드시 <main> 안쪽을 집는다.
      const main = page.indexOf('<main');
      const i = page.indexOf('<details', main);
      const j = page.indexOf('</details>', i);
      const block = page.slice(i, j);
      return { page: page.slice(0, i) + block.replace(/<p[^>]*>[\s\S]*?<\/p>/, '<p></p>') + page.slice(j) };
    });
    assert.notEqual(r.code, 0);
    assert.match(r.output, /답변 본문/);
  });

  test('개선 범위 카드가 JS 전용으로 바뀌어 HTML 에서 사라지면 실패', () => {
    const r = withDefect(({ page }) => {
      // 카드 한 장을 통째로 제거 — "초기 HTML 에 전체 설명이 있어야 한다" 규칙 위반
      const m = page.match(/<article class="[^"]*scopeCard[^"]*">[\s\S]*?<\/article>/);
      return { page: m ? page.replace(m[0], '') : page };
    });
    assert.notEqual(r.code, 0);
    assert.match(r.output, /범위 카드/);
  });

  test('본문을 inline style 로 숨기면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('<section id="pricing"', '<section id="pricing" style="opacity:0"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /인라인 style/);
  });

  test('목차 앵커 대상이 사라지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('id="pricing"', 'id="pricing-renamed"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /앵커 대상 없음/);
  });

  test('순위·노출 보장 표현이 들어가면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</main>', '<p>검색 순위를 보장합니다.</p></main>') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /금지 표현/);
  });

  test('"보장하지 않습니다" 같은 정상 고지는 실패로 잡지 않는다', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</main>', '<p>검색 순위와 AI 추천·인용은 보장하지 않습니다.</p></main>') }));
    assert.equal(r.code, 0, r.output);
  });

  test('상담 폼의 새 필드가 빠지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('name="관심패키지"', 'name="관심패키지_old"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /관심패키지/);
  });

  test('정적 감지 폼(__forms.html)과 필드가 어긋나면 실패', () => {
    const r = withDefect(({ forms }) => ({ forms: forms.replace('name="지속관리관심"', 'name="지속관리관심_old"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /__forms\.html/);
  });

  test('개인정보 동의가 미리 체크돼 있으면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('name="개인정보동의"', 'name="개인정보동의" checked=""') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /미리 체크/);
  });

  test('계약 전 민감 필드를 받으면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</form>', '<input name="관리자비밀번호"/></form>') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /민감 필드/);
  });

  test('사이트맵에서 빠지면 실패', () => {
    const dir = makeFixture();
    try {
      for (const f of readdirSync(dir).filter((x) => /^sitemap.*\.xml$/.test(x))) {
        writeFileSync(join(dir, f), readFileSync(join(dir, f), 'utf8').replaceAll('https://reumlab.com/ai-search-optimization/', 'https://reumlab.com/nowhere/'));
      }
      const r = runGate(dir);
      assert.notEqual(r.code, 0);
      assert.match(r.output, /사이트맵/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('llms.txt 에서 빠지면 실패', () => {
    const r = withDefect(({ llms }) => ({ llms: llms.replaceAll('/ai-search-optimization/', '/nowhere/') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /llms/);
  });

  test('/geo-website/ 로 돌아오는 링크가 없으면 실패(양방향 아님)', () => {
    const dir = makeFixture();
    try {
      const f = join(dir, 'geo-website', 'index.html');
      writeFileSync(f, readFileSync(f, 'utf8').replace('<a href="/ai-search-optimization/">기존 홈페이지 개선</a>', 'stub'));
      const r = runGate(dir);
      assert.notEqual(r.code, 0);
      assert.match(r.output, /양방향/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('죽은 내부 링크가 있으면 실패', () => {
    // replace() 는 첫 번째만 바꾼다 — 그 첫 번째가 RSC 페이로드라 화면 DOM 이 그대로 남는다.
    const r = withDefect(({ page }) => ({ page: page.replaceAll('href="/portfolio/"', 'href="/portfolio-old/"') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /존재하지 않는 내부 링크/);
  });

  test('표에서 caption 이 사라지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace(/<caption[^>]*>[\s\S]*?<\/caption>/, '') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /caption/);
  });

  test('th 의 scope 가 빠지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('<th scope="row"', '<th') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /scope/);
  });

  test('h1 이 둘이면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</main>', '<h1>추가 제목</h1></main>') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /h1 2개/);
  });

  test('id 가 중복되면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replace('</main>', '<div id="pricing"></div></main>') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /중복 id/);
  });

  test('공유 이미지 파일이 없으면 실패', () => {
    const dir = makeFixture();
    try {
      rmSync(join(dir, 'og-ai-search-architecture.jpg'), { force: true });
      const r = runGate(dir);
      assert.notEqual(r.code, 0);
      assert.match(r.output, /공유 이미지 파일 없음/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('화면 범위 수치가 데이터와 어긋나면 실패', () => {
    // React SSR 은 `최대 {값} URL` 을 `최대 <!-- -->300<!-- --> URL` 로 낸다.
    // 평문 형태만 바꾸면 비교표 쪽이 그대로 남아 게이트가 통과해 버린다 — 둘 다 바꾼다.
    const r = withDefect(({ page }) => ({
      page: page
        .replaceAll('최대 300 URL', '최대 3,000 URL')
        .replaceAll('최대 <!-- -->300<!-- --> URL', '최대 <!-- -->3,000<!-- --> URL'),
    }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /진단 URL/);
  });

  test('필수 고지 문구가 사라지면 실패', () => {
    const r = withDefect(({ page }) => ({ page: page.replaceAll('별도 견적', '추가 작업') }));
    assert.notEqual(r.code, 0);
    assert.match(r.output, /필수 고지 문구 누락/);
  });
});
