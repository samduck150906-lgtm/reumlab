import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const CANONICAL = 'https://reumlab.com/ai-worker/multimodal/';
const ROUTE_PATH = join('ai-worker', 'multimodal', 'index.html');

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function verifyMultimodalArtifacts(outDir = 'out') {
  const errors = [];
  const routeFile = join(outDir, ROUTE_PATH);
  const parentFile = join(outDir, 'ai-worker', 'index.html');
  const llmsFile = join(outDir, 'llms.txt');

  if (!existsSync(routeFile)) return [`멀티모달 빌드 파일 없음: ${routeFile}`];
  const html = readFileSync(routeFile, 'utf8');
  const document = parse(html);

  if (!html.includes(`<link rel="canonical" href="${CANONICAL}"`)) errors.push('self-canonical 누락 또는 불일치');
  if (!html.includes('<h1') || !html.includes('보고 듣고 판단하고, 업무까지 처리하는 AI')) errors.push('승인된 H1 누락');
  if (!html.includes('멀티모달 AI Worker 개발 | 영상·음성·현장 업무 자동화 | 름랩')) errors.push('title 누락 또는 불일치');
  if (!html.includes('영상·사진·음성·문서를 이해하고 검수·견적·상담 분석부터 ERP·CRM 업무까지 연결')) errors.push('meta description 누락 또는 불일치');
  if (/name="robots"[^>]+noindex/i.test(html)) errors.push('운영 페이지에 noindex가 있습니다');
  if (!html.includes('"@type":"Service"')) errors.push('Service JSON-LD 누락');
  if (!html.includes('"@type":"FAQPage"')) errors.push('FAQPage JSON-LD 누락');
  // Next의 RSC payload가 HTML 문자열을 한 번 더 포함하므로 원문 정규식이 아니라 실제 DOM 노드를 센다.
  if (document.querySelectorAll('[data-multimodal-product]').length !== 10) errors.push('상품 패턴 10개가 아닙니다');
  if (document.querySelectorAll('[data-multimodal-faq]').length !== 10) errors.push('FAQ 10개가 아닙니다');
  if (!html.includes('name="유입_랜딩" value="/ai-worker/multimodal/"')) errors.push('문의 폼 유입 랜딩 값 누락');

  if (!existsSync(parentFile)) errors.push('AI Worker 부모 빌드 파일 없음');
  else if (count(readFileSync(parentFile, 'utf8'), /href="\/ai-worker\/multimodal\/"/g) !== 1) errors.push('부모 페이지의 멀티모달 링크가 정확히 1개가 아닙니다');

  const sitemapText = readdirSync(outDir)
    .filter((name) => /^sitemap.*\.xml$/.test(name))
    .map((name) => readFileSync(join(outDir, name), 'utf8'))
    .join('\n');
  if (count(sitemapText, new RegExp(escaped(CANONICAL), 'g')) !== 1) errors.push('사이트맵 canonical 항목이 정확히 1개가 아닙니다');

  if (!existsSync(llmsFile)) errors.push('llms.txt 없음');
  else if (count(readFileSync(llmsFile, 'utf8'), new RegExp(escaped(CANONICAL), 'g')) !== 1) errors.push('llms.txt canonical 항목이 정확히 1개가 아닙니다');

  return errors;
}

const isCli = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isCli) {
  const errors = verifyMultimodalArtifacts(process.argv[2] || 'out');
  if (errors.length) {
    console.error(`✗ 멀티모달 AI Worker 검증 실패 (${errors.length})`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
  } else {
    console.log('✓ 멀티모달 AI Worker: metadata · schema · content · parent · sitemap · llms 검증 통과');
  }
}
