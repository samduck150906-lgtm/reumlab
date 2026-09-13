#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeRecord, sha256, validateRecord } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'prompts-v1.json'), 'utf8'));
const file = resolve(ROOT, process.argv[2] || '.geo-measurements/runs.jsonl');
if (!existsSync(file)) {
  console.error(`측정 데이터가 없습니다: ${file}`);
  process.exit(2);
}

const records = readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const failures = [];
for (const [index, input] of records.entries()) {
  const record = normalizeRecord(input, MANIFEST);
  const errors = validateRecord(record, MANIFEST);
  if (record.raw_response_path && record.raw_response_hash) {
    const rawPath = isAbsolute(record.raw_response_path)
      ? record.raw_response_path
      : resolve(dirname(file), record.raw_response_path);
    if (!existsSync(rawPath)) errors.push(`raw_response_path 파일 없음: ${record.raw_response_path}`);
    else if (sha256(readFileSync(rawPath, 'utf8')) !== record.raw_response_hash) errors.push('raw_response_hash 불일치');
  }
  if (errors.length) failures.push({ line: index + 1, run_id: record.run_id, errors });
}

if (failures.length) {
  for (const failure of failures) console.error(`line ${failure.line} (${failure.run_id || 'no-run-id'}): ${failure.errors.join(' | ')}`);
  process.exit(1);
}
console.log(`측정 데이터 검증 통과: ${records.length}건`);
