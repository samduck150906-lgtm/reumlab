import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = new URL('./verify-near-duplicate.mjs', import.meta.url);
function runFixture(pages: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'reumlab-duplicate-'));
  try {
    for (const [slug, html] of Object.entries(pages)) {
      const folder = join(dir, 'website', slug);
      mkdirSync(folder, { recursive: true });
      writeFileSync(join(folder, 'index.html'), html);
    }
    return spawnSync(process.execPath, [fileURLToPath(script), dir], { encoding: 'utf8' });
  } finally {
    assert.equal(dirname(resolve(dir)), resolve(tmpdir()));
    rmSync(dir, { recursive: true, force: true });
  }
}

test('rendered duplicate pages fail on native Windows and POSIX paths', () => {
  const html = '<main><h1>예약 홈페이지 제작</h1><p>동일한 문장을 모든 업종 페이지에 복사하면 사용자가 얻을 수 있는 독립적인 정보가 없습니다.</p></main>';
  const result = runFixture({ first: html, second: html });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /website\s+2p/);
  assert.match(result.stderr, /평균 Jaccard/);
});

test('an empty comparison cannot be reported as a successful audit', () => {
  const result = runFixture({});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /비교할 페이지 묶음이 없습니다/);
});

test('distinct visible content passes the comparison', () => {
  const result = runFixture({
    first: '<main><h1>공방 홈페이지 제작</h1><p>도자기 수강생은 가마 소성 일정과 작품 수령일을 확인한 뒤 준비물을 선택합니다.</p></main>',
    second: '<main><h1>장비 홈페이지 제작</h1><p>기업 구매자는 모델별 기술 사양 도면 호환 부품을 내려받아 견적 요청서를 구성합니다.</p></main>',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /website\s+2p/);
});
