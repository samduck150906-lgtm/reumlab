import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the existing AI service alias redirects through static shadowing and lowercase normalization', () => {
  const source = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
  for (const path of ['/AI서비스개발', '/AI서비스개발/', '/ai서비스개발', '/ai서비스개발/']) {
    const line = source.split('\n').find(line => line.trim().split(/\s+/)[0] === path);
    assert.ok(line, `Missing exact alias ${path}`);
    assert.deepEqual(line.trim().split(/\s+/), [path, '/ai-development/', '301!']);
  }
  assert.match(source, /^\/portfolio\/\*\s+\/portfolio\/\s+301\s*$/m, 'real portfolio pages must keep file shadowing');
});
