import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { htmlSignals, parseCsv, sha256, validateRssXml } from './neo-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('NEO 명령 세트가 PowerShell 호환 Node/npm 명령으로 등록돼 있다', () => {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const name of [
    'neo:audit', 'neo:verify:robots', 'neo:verify:canonical', 'neo:verify:sitemap',
    'neo:verify:rss', 'neo:verify:indexnow', 'neo:verify:entities', 'neo:verify:schema',
    'neo:verify:links', 'neo:verify:content', 'neo:report', 'neo:indexnow:dry-run',
  ]) assert.equal(typeof pkg.scripts[name], 'string', `${name} missing`);
  for (const [name, command] of Object.entries<string>(pkg.scripts).filter(([name]) => name.startsWith('neo:'))) {
    assert.doesNotMatch(command, /(?:^|\s)(?:cp|rm|sed)(?:\s|$)/, `${name} uses an OS-only command`);
  }
});

test('HTML signal parser extracts canonical and robots regardless of attribute order', () => {
  const html = '<title>름랩</title><link href="https://reumlab.com/mvp/" rel="canonical"><meta content="index,follow" name="robots"><h1><span>MVP</span> 개발</h1>';
  assert.deepEqual(htmlSignals(html), {
    canonical: 'https://reumlab.com/mvp/', robots: 'index,follow', title: '름랩', h1: 'MVP 개발',
  });
  assert.equal(sha256('same response'), sha256('same response'));
  assert.notEqual(sha256('browser'), sha256('bot'));
});

test('RSS validator rejects empty feeds, cross-host links, and link/guid mismatches', () => {
  const invalid = '<rss><channel><item><title>x</title><link>https://example.com/a</link><description>x</description><guid>https://reumlab.com/a</guid><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate></item></channel></rss>';
  const result = validateRssXml(invalid);
  assert.equal(result.itemCount, 1);
  assert.ok(result.errors.some((error: string) => error.includes('origin mismatch')));
  assert.ok(result.errors.some((error: string) => error.includes('link/guid mismatch')));
  assert.ok(validateRssXml('<rss><channel></channel></rss>').errors.includes('feed contains no item'));
});

test('NEO query map contains 40 non-brand questions and 5 brand controls', () => {
  const rows = parseCsv(readFileSync(path.join(ROOT, 'docs', 'neo', 'query-map.csv'), 'utf8'));
  assert.equal(rows.filter((row: Record<string, string>) => row.question_id.startsWith('Q')).length, 40);
  assert.equal(rows.filter((row: Record<string, string>) => row.question_id.startsWith('B')).length, 5);
  assert.equal(rows.every((row: Record<string, string>) => row.canonical_answer_page.startsWith('https://reumlab.com/')), true);
});

test('IndexNow verifier is read-only and validates the safety gates', () => {
  const result = spawnSync(process.execPath, ['scripts/verify-indexnow-config.mjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const output = `${result.stdout}\n${result.stderr}`;
  assert.equal(result.status, 0, output);
  assert.match(output, /외부 전송 없음/);
  assert.doesNotMatch(output, /HTTP \d{3}/);
});

test('닫힌 모바일 메뉴는 접근성 트리에서 제외되고 상태 이름을 갱신한다', () => {
  const html = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const script = readFileSync(path.join(ROOT, 'script.js'), 'utf8');
  assert.match(html, /id="burger"[^>]*aria-controls="mobileNav"/);
  assert.match(html, /id="mobileNav"[^>]*aria-hidden="true"[^>]*inert/);
  assert.match(script, /aria-label", open \? "메뉴 닫기" : "메뉴 열기"/);
  assert.match(script, /removeAttribute\("inert"\)/);
  assert.match(script, /burger\.focus\(\)/);
});
