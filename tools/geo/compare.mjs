#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregate, formatRate, normalizeRecord } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'prompts-v1.json'), 'utf8'));
const [beforeArg, afterArg] = process.argv.slice(2);
if (!beforeArg || !afterArg) {
  console.error('사용법: node tools/geo/compare.mjs <before.jsonl> <after.jsonl>');
  process.exit(2);
}
function load(fileArg) {
  const file = resolve(fileArg);
  if (!existsSync(file)) throw new Error(`파일 없음: ${file}`);
  return readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => normalizeRecord(JSON.parse(line), MANIFEST));
}
const before = aggregate(load(beforeArg), MANIFEST);
const after = aggregate(load(afterArg), MANIFEST);
console.log('| 지표 | 변경 전 | 변경 후 |');
console.log('|---|---:|---:|');
for (const [label, key] of [['언급률', 'mentioned'], ['추천률', 'recommended'], ['공식 인용률', 'cited'], ['추천+인용', 'both']]) {
  console.log(`| ${label} | ${formatRate(before[key], before.valid)} | ${formatRate(after[key], after.valid)} |`);
}
console.log(`\n표본: before valid ${before.valid}, after valid ${after.valid}. 조건·모델·surface가 다르면 인과 비교로 해석하지 마세요.`);
