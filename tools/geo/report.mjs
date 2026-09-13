#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregate, formatRate, normalizeRecord } from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'prompts-v1.json'), 'utf8'));
function arg(name, fallback) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : fallback; }
const input = resolve(ROOT, arg('--input', '.geo-measurements/runs.jsonl'));
const output = resolve(ROOT, arg('--output', 'docs/geo/measurement-latest.md'));
const records = existsSync(input)
  ? readFileSync(input, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => normalizeRecord(JSON.parse(line), MANIFEST))
  : [];
const metrics = aggregate(records, MANIFEST);
const status = metrics.valid ? 'MEASURED' : 'NOT_RUN';
const surfaceRows = MANIFEST.surfaces.map((surface) => {
  const row = metrics.bySurface[surface.id];
  return `| ${surface.label} | ${row.attempted} | ${row.valid} | ${row.no_ai_feature} | ${formatRate(row.mentioned, row.valid)} | ${formatRate(row.recommended, row.valid)} | ${formatRate(row.cited, row.valid)} |`;
}).join('\n');
const markdown = `# REUMLAB GEO measurement report\n\n- Status: **${status}**\n- Dataset: \`${MANIFEST.dataset_version}\`\n- Generated: ${new Date().toISOString()}\n- Input: \`${relative(ROOT, input).replace(/\\/g, '/')}\` (${existsSync(input) ? '존재' : '미수집'})\n- 합성 데이터는 모든 실측 집계에서 제외함\n\n## 분모\n\n| 항목 | 건수 |\n|---|---:|\n| N_planned | ${metrics.planned} |\n| N_attempted | ${metrics.attempted} |\n| N_valid_answers | ${metrics.valid} |\n| N_unresolved | ${metrics.unresolved} |\n\n${metrics.valid ? `## 핵심 결과\n\n| 지표 | 결과 |\n|---|---:|\n| 본문 브랜드 언급률 | ${formatRate(metrics.mentioned, metrics.valid)} |\n| 추천 포함률 | ${formatRate(metrics.recommended, metrics.valid)} |\n| 공식 사이트 인용률 | ${formatRate(metrics.cited, metrics.valid)} |\n| 추천+공식 인용 동시 발생률 | ${formatRate(metrics.both, metrics.valid)} |\n| 확인 가능한 Top 3 | ${formatRate(metrics.top3, metrics.rankable)} |\n| 확인 가능한 Top 5 | ${formatRate(metrics.top5, metrics.rankable)} |\n| 순위 없는 추천 | ${metrics.unranked} |\n| 이 질문 세트 내 추천 점유율 | ${formatRate(metrics.recommendationShare.reumlab, metrics.recommendationShare.total)} |\n` : `## 핵심 결과\n\n실제 답변 원문과 출처를 갖춘 REVIEWED/VERIFIED 레코드가 없으므로 비율은 **N/A**입니다. 0%로 기록하지 않습니다.\n`}\n## Surface별\n\n| Surface | 시도 | 유효 답변 | AI 기능 미표시 | 언급 | 추천 | 공식 인용 |\n|---|---:|---:|---:|---:|---:|---:|\n${surfaceRows}\n\n## 판정 주의\n\n- 브랜드 대조군 B01~B05는 비브랜드 지표에서 제외했습니다.\n- 일반 검색, API, 소비자용 AI 웹 화면은 각각 다른 surface로 보관해야 합니다.\n- 원문·해시·실제 인용 URL이 없거나 검토 상태가 아닌 답변은 성과로 집계하지 않습니다.\n`;
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, markdown, 'utf8');
console.log(`측정 리포트: ${relative(ROOT, output)} (${status}, valid ${metrics.valid})`);
