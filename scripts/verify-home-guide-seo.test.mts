/**
 * verify-home-guide-seo 게이트가 "실제로 실패를 잡는지" 확인하는 테스트.
 *
 * 왜 필요한가 (§7-4)
 *  정상 산출물에 대해 통과하는 것만 보면, 검사가 아무것도 안 보고 통과하는 경우와
 *  구분되지 않는다. 그래서 복사본(fixture)에 결함을 하나씩 주입하고 종료코드가
 *  non-zero 인지, 의도한 실패 종류가 나오는지 본다. 실제 out/ 은 건드리지 않는다.
 *
 * 전제: 먼저 npm run build 로 out/ 이 만들어져 있어야 한다. 없으면 테스트를 건너뛴다.
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const OUT = 'out';
const GATE = 'scripts/verify-home-guide-seo.mjs';
const ready = existsSync(join(OUT, 'index.html')) && existsSync(join(OUT, 'guide', 'index.html'));

/** 게이트를 fixture 디렉터리에 대해 실행하고 {code, output} 을 돌려준다. */
function runGate(dir: string) {
  const r = spawnSync(process.execPath, [GATE, dir], { encoding: 'utf8' });
  return { code: r.status ?? -1, output: `${r.stdout}\n${r.stderr}` };
}

/**
 * 최소 fixture — 홈·가이드 실물 + 사이트맵 + FAQ 링크 대상 스텁.
 * out/ 1,344개를 전부 복사하지 않으려고 필요한 것만 만든다.
 */
function makeFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'hg-seo-'));
  mkdirSync(join(dir, 'guide'), { recursive: true });
  cpSync(join(OUT, 'index.html'), join(dir, 'index.html'));
  cpSync(join(OUT, 'guide', 'index.html'), join(dir, 'guide', 'index.html'));
  for (const f of readdirSync(OUT).filter((x) => /^sitemap.*\.xml$/.test(x))) {
    cpSync(join(OUT, f), join(dir, f));
  }
  // 홈 FAQ 의 no-JS 검사가 참조한다(접힘 규칙 ↔ noscript 대비).
  if (existsSync(join(OUT, 'styles.css'))) cpSync(join(OUT, 'styles.css'), join(dir, 'styles.css'));
  // FAQ 섹션이 거는 내부 링크 대상 — 존재 검사만 하므로 canonical 을 갖춘 최소 스텁으로 둔다.
  const guideHtml = readFileSync(join(OUT, 'guide', 'index.html'), 'utf8');
  const section = guideHtml.match(/<section[^>]*aria-labelledby="guide-faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  const hrefs = [...new Set([...section.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]))];
  for (const href of hrefs) {
    const d = join(dir, href.replace(/^\//, ''));
    mkdirSync(d, { recursive: true });
    writeFileSync(
      join(d, 'index.html'),
      `<!doctype html><html lang="ko"><head><link rel="canonical" href="https://reumlab.com${href}"/></head><body>stub</body></html>`,
    );
  }
  return dir;
}

/** fixture 를 만들고 홈/가이드 HTML 을 변형한 뒤 게이트를 돌린다. */
function withDefect(edit: (html: { home: string; guide: string }) => { home?: string; guide?: string }) {
  const dir = makeFixture();
  try {
    const home = readFileSync(join(dir, 'index.html'), 'utf8');
    const guide = readFileSync(join(dir, 'guide', 'index.html'), 'utf8');
    const next = edit({ home, guide });
    if (next.home !== undefined) writeFileSync(join(dir, 'index.html'), next.home);
    if (next.guide !== undefined) writeFileSync(join(dir, 'guide', 'index.html'), next.guide);
    return runGate(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('verify-home-guide-seo 게이트', { skip: ready ? false : 'out/ 없음 — npm run build 먼저 실행' }, () => {
  before(() => {
    assert.ok(existsSync(GATE), `${GATE} 가 없습니다`);
  });

  test('정상 산출물(양성 대조)에서는 통과한다', () => {
    const dir = makeFixture();
    try {
      const { code, output } = runGate(dir);
      assert.equal(code, 0, `정상 fixture 에서 실패했습니다:\n${output}`);
      assert.match(output, /회귀 검사 통과/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('description 을 지우면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/<meta name="description"[^>]*>/, ''),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /\[description\]/);
  });

  test('description 이 중복이면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/(<meta name="description"[^>]*>)/, '$1$1'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /\[description\].*2개/s);
  });

  test('canonical 이 중복이면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/(<link rel="canonical"[^>]*>)/, '$1$1'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /\[canonical\]/);
  });

  test('canonical 도메인이 틀리면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/(<link rel="canonical" href=")[^"]*(")/, '$1https://example.com/$2'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /\[canonical\]/);
  });

  test('가이드가 홈을 canonical 로 지정하면 전파로 잡는다', () => {
    const { code, output } = withDefect(({ guide }) => ({
      guide: guide.replace(/(<link rel="canonical" href=")[^"]*(")/, '$1https://reumlab.com/$2'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /canonical-propagation|\[canonical\]/);
  });

  test('JSON-LD 가 깨지면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/(<script type="application\/ld\+json">)/, '$1{"broken":,'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /jsonld-parse/);
  });

  test('같은 사업장을 다른 @id 로 또 정의하면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(
        '"@type": "LocalBusiness",',
        '"@type": "LocalBusiness", "sameEntityProbe": true,',
      ).replace(
        /(<script type="application\/ld\+json">\s*\{)/,
        '$1"__probe__":1,',
      ).replace(
        '"@graph": [',
        '"@graph": [{"@type":"LocalBusiness","@id":"https://reumlab.com/#localbusiness","name":"름랩"},',
      ),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /business-dup/);
  });

  test('사업체 타입이 되돌아가면(ProfessionalService) 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace('"@type": "LocalBusiness",', '"@type": "ProfessionalService",'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /business-type/);
  });

  test('스키마에만 있고 화면에 없는 질문이면 실패한다', () => {
    const { code, output } = withDefect(({ guide }) => {
      const q = JSON.parse(
        guide.match(/<script type="application\/ld\+json">([^<]*"FAQPage"[^<]*)<\/script>/)![1],
      );
      q.mainEntity.push({
        '@type': 'Question',
        name: '화면에 없는 유령 질문입니다',
        acceptedAnswer: { '@type': 'Answer', text: '화면 어디에도 없는 답변입니다' },
      });
      return {
        guide: guide.replace(
          /<script type="application\/ld\+json">[^<]*"FAQPage"[^<]*<\/script>/,
          `<script type="application/ld+json">${JSON.stringify(q)}</script>`,
        ),
      };
    });
    assert.notEqual(code, 0);
    assert.match(output, /faq-sync|\[faq\]/);
  });

  test('스키마 답변을 본문과 다르게 바꾸면 실패한다', () => {
    const { code, output } = withDefect(({ guide }) => {
      const raw = guide.match(/<script type="application\/ld\+json">([^<]*"FAQPage"[^<]*)<\/script>/)![1];
      const q = JSON.parse(raw);
      q.mainEntity[0].acceptedAnswer.text = '본문과 전혀 다른 답변으로 바꿔 버렸습니다';
      return {
        guide: guide.replace(
          /<script type="application\/ld\+json">[^<]*"FAQPage"[^<]*<\/script>/,
          `<script type="application/ld+json">${JSON.stringify(q)}</script>`,
        ),
      };
    });
    assert.notEqual(code, 0);
    assert.match(output, /faq-sync/);
  });

  test('HTML id 가 중복이면 실패한다', () => {
    const { code, output } = withDefect(({ guide }) => ({
      guide: guide.replace('id="guide-faq-quote-prep"', 'id="guide-faq-where-to-start"'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /html-id/);
  });

  test('이스케이프되지 않은 </script 가 JSON-LD 에 있으면 실패한다', () => {
    const { code, output } = withDefect(({ guide }) => ({
      guide: guide.replace('"@type":"FAQPage"', '"probe":"</script>","@type":"FAQPage"'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /jsonld-escape|jsonld-parse/);
  });

  test('상담 폼이 사라지면 실패한다', () => {
    const { code, output } = withDefect(({ home }) => ({
      home: home.replace(/name="main-apply"/g, 'name="removed-apply"'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /\[form\]/);
  });

  test('홈의 noscript FAQ 펼침 대비가 사라지면 실패한다', () => {
    const dir = makeFixture();
    try {
      // 게이트는 out/styles.css 의 접힘 규칙과 홈의 noscript 를 함께 본다.
      cpSync(join(OUT, 'styles.css'), join(dir, 'styles.css'));
      const home = readFileSync(join(dir, 'index.html'), 'utf8');
      // 홈에는 noscript 가 여러 개 있다(픽셀·GTM·포트폴리오 안내). FAQ 대비 블록만 골라 지운다.
      const blocks = [...home.matchAll(/<noscript>[\s\S]*?<\/noscript>/g)].map((m) => m[0]);
      const target = blocks.find((b) => b.includes('faq-a'));
      assert.ok(target, '홈에서 FAQ noscript 블록을 찾지 못했습니다');
      writeFileSync(join(dir, 'index.html'), home.replace(target!, ''));
      const { code, output } = runGate(dir);
      assert.notEqual(code, 0);
      assert.match(output, /faq-nojs/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('가이드 목록 링크를 일괄 제거하면 실패한다', () => {
    const { code, output } = withDefect(({ guide }) => ({
      guide: guide.replace(/href="\/guide\/[a-z0-9-]+\//g, 'href="/removed/'),
    }));
    assert.notEqual(code, 0);
    assert.match(output, /guide-links|faq-link/);
  });
});
