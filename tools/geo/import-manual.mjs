#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeRecord, sha256, validateRecord } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'prompts-v1.json'), 'utf8'));

function arg(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function csvRows(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') { cell += '"'; index += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (!quoted && char === ',') { row.push(cell); cell = ''; continue; }
    if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = '';
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      continue;
    }
    cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [headers = [], ...values] = rows;
  return values.map((cells) => Object.fromEntries(headers.map((header, index) => [header.trim(), cells[index] ?? ''])));
}

function readInput(file) {
  const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  if (extname(file).toLowerCase() === '.csv') return csvRows(text);
  return text.split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line));
}

function safeRunId(value, index) {
  const candidate = String(value || `manual-${Date.now()}-${index + 1}`);
  return candidate.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120);
}

const inputArg = arg('--input');
if (!inputArg) {
  console.error('사용법: node tools/geo/import-manual.mjs --input <csv|jsonl> [--output-dir .geo-measurements]');
  process.exit(2);
}

const input = resolve(ROOT, inputArg);
const outputDir = resolve(ROOT, arg('--output-dir', '.geo-measurements'));
const rawDir = join(outputDir, 'raw');
const outputFile = join(outputDir, 'runs.jsonl');
if (!existsSync(input)) {
  console.error(`입력 파일을 찾을 수 없습니다: ${input}`);
  process.exit(2);
}
mkdirSync(rawDir, { recursive: true });

const normalized = [];
const failures = [];
for (const [index, source] of readInput(input).entries()) {
  const runId = safeRunId(source.run_id, index);
  const record = { ...source, run_id: runId };
  let rawText = String(record.raw_response_text || '');
  if (!rawText && record.raw_response_path) {
    const sourcePath = isAbsolute(record.raw_response_path)
      ? record.raw_response_path
      : resolve(dirname(input), record.raw_response_path);
    if (existsSync(sourcePath)) rawText = readFileSync(sourcePath, 'utf8');
  }
  if (rawText) {
    const rawFile = join(rawDir, `${runId}.txt`);
    writeFileSync(rawFile, rawText, 'utf8');
    record.raw_response_path = relative(outputDir, rawFile).replace(/\\/g, '/');
    record.raw_response_hash = sha256(rawText);
  }
  delete record.raw_response_text;
  const item = normalizeRecord(record, MANIFEST);
  const errors = validateRecord(item, MANIFEST);
  if (errors.length) failures.push({ line: index + 2, run_id: runId, errors });
  else normalized.push(item);
}

if (failures.length) {
  for (const failure of failures) {
    console.error(`line ${failure.line} (${failure.run_id}): ${failure.errors.join(' | ')}`);
  }
  console.error(`가져오기 중단: ${failures.length}건의 검증 오류. 유효한 레코드도 쓰지 않았습니다.`);
  process.exit(1);
}

writeFileSync(outputFile, normalized.map((record) => JSON.stringify(record)).join('\n') + (normalized.length ? '\n' : ''), 'utf8');
console.log(`가져오기 완료: ${normalized.length}건 -> ${relative(ROOT, outputFile)}`);
console.log(`원문 보관: ${relative(ROOT, rawDir)} (기본 Git/배포 제외)`);
