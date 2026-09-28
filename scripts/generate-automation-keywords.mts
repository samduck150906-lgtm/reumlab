import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  generateAutomationKeywords,
  generateAutomationQuestions,
  type AutomationKeywordRow,
} from '../lib/automation-keywords.ts';

const OUTPUT_DIR = resolve('content/seo');

function csvCell(value: unknown): string {
  const stringValue = String(value ?? '');
  return /[",\r\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

function toCsv(rows: AutomationKeywordRow[]): string {
  const headers = Object.keys(rows[0]) as Array<keyof AutomationKeywordRow>;
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n') + '\n';
}

const keywords = generateAutomationKeywords();
const questions = generateAutomationQuestions();
await mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all([
  writeFile(resolve(OUTPUT_DIR, 'automation-keywords.json'), `${JSON.stringify(keywords, null, 2)}\n`, 'utf8'),
  writeFile(resolve(OUTPUT_DIR, 'automation-keywords.csv'), toCsv(keywords), 'utf8'),
  writeFile(resolve(OUTPUT_DIR, 'automation-questions.json'), `${JSON.stringify(questions, null, 2)}\n`, 'utf8'),
]);

console.log(`Generated automation keyword research: ${keywords.length} keywords, ${questions.length} AEO questions`);
