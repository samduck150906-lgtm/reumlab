import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const HUB_ITEMS = JSON.parse(readFileSync(join(REPO_ROOT, 'content', 'automation-domains.json'), 'utf8'));
const GENERATED = HUB_ITEMS.filter((item) => item.published && item.href?.startsWith('/ai-automation/') && item.href !== '/ai-automation/');

function occurrences(value, pattern) {
  return (value.match(pattern) || []).length;
}

export function verifyAutomationOutput(outDir = join(REPO_ROOT, 'out')) {
  const issues = [];
  const hubPath = join(outDir, 'ai-automation', 'index.html');
  if (!existsSync(hubPath)) return ['AI 업무자동화 허브 산출물 없음: ai-automation/index.html'];
  const hub = readFileSync(hubPath, 'utf8');
  const hubCount = occurrences(hub, /data-automation-category=/g);
  if (hubCount !== 70) issues.push(`허브 분야 70개 필요: actual=${hubCount}`);
  if (!hub.includes('id="automation-search"')) issues.push('허브 검색 입력 누락: automation-search');
  for (const item of HUB_ITEMS.filter((candidate) => candidate.published)) {
    if (!hub.includes(`href="${item.href}"`)) issues.push(`허브 공개 링크 누락: ${item.href}`);
  }

  for (const item of GENERATED) {
    const pagePath = join(outDir, 'ai-automation', item.slug, 'index.html');
    if (!existsSync(pagePath)) {
      issues.push(`${item.slug}: 상세 산출물 없음`);
      continue;
    }
    const html = readFileSync(pagePath, 'utf8');
    const canonical = `https://reumlab.com/ai-automation/${item.slug}/`;
    if (occurrences(html, /rel="canonical"/g) !== 1 || !html.includes(`href="${canonical}"`)) {
      issues.push(`${item.slug}: self-canonical 누락 또는 중복`);
    }
    if (!html.includes(`<h1`) || !html.includes(`${item.name} 프로그램 개발`)) issues.push(`${item.slug}: 고유 H1 누락`);
    if (!html.includes('name="form-name"') || !html.includes('value="main-apply"')) issues.push(`${item.slug}: main-apply 문의 폼 누락`);
    if (!html.includes('application/ld+json') || !html.includes('"@type":"Service"')) issues.push(`${item.slug}: Service schema 누락`);
    if (/noindex/i.test(html)) issues.push(`${item.slug}: 공개 페이지에 noindex 존재`);
  }
  return issues;
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isCli) {
  const issues = verifyAutomationOutput();
  if (issues.length) {
    console.error(`Automation SEO QA failed (${issues.length})`);
    for (const issue of issues) console.error(`- ${issue}`);
    process.exitCode = 1;
  } else {
    console.log(`Automation SEO QA passed: 70-domain hub, ${GENERATED.length} generated detail pages`);
  }
}
