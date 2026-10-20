import test from 'node:test';
import assert from 'node:assert/strict';
import {parseUnicodeRange, readAgencyFontCoverage} from './font-coverage.mts';

test('declared full-font fallback covers an industry name outside the compact subset', () => {
  const coverage = readAgencyFontCoverage();
  const code = '셰'.codePointAt(0)!;
  assert.equal(coverage.subset.has(code), false);
  assert.equal(coverage.supported.has(code), true);
  assert.equal(coverage.supported.has(0x10ffff), false);
});

test('coverage reads inclusive ranges and rejects malformed or reversed ranges', () => {
  assert.deepEqual([...parseUnicodeRange('U+0041-0043, U+005A')], [65,66,67,90]);
  assert.throws(() => parseUnicodeRange('U+0043-0041'));
  assert.throws(() => parseUnicodeRange('U+ZZZZ'));
});
