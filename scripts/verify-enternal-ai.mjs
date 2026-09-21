import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const CANONICAL = 'https://reumlab.com/enternal-ai/';
const TITLE = 'Enternal AI | 기업용 Private AI·사내 AI PoC | 름랩';
const DESCRIPTION = '기업 데이터를 고객 환경 안에서 활용하는 Private AI를 목표로 개발합니다. 로컬 추론·사내 문서 연결·자체 사전학습 기반의 적용 범위를 기업별 PoC로 검증합니다.';
const H1 = '기업의 모든 지식이 기업 안에서 더 똑똑해집니다.';
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function count(text, pattern) {
  return (text.match(pattern) || []).length;
}

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readIfPresent(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function verifyPng(file, label, expectedWidth, expectedHeight, errors) {
  if (!existsSync(file)) {
    errors.push(`${label} 파일 없음: ${file}`);
    return;
  }
  const png = readFileSync(file);
  if (png.length < 24 || !png.subarray(0, 8).equals(PNG_SIGNATURE) || png.toString('ascii', 12, 16) !== 'IHDR') {
    errors.push(`${label} PNG signature 또는 IHDR이 올바르지 않습니다`);
    return;
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== expectedWidth || height !== expectedHeight) {
    errors.push(`${label} 크기 불일치: ${width}x${height} (예상 ${expectedWidth}x${expectedHeight})`);
  }
}

export function verifyEnternalArtifacts(outDir = 'out') {
  const errors = [];
  const routeDir = join(outDir, 'enternal-ai');
  const routeFile = join(routeDir, 'index.html');
  const logoFile = join(routeDir, 'enternal-ai-logo.png');
  const wordmarkFile = join(routeDir, 'enternal-ai-wordmark.png');
  const enterpriseFile = join(outDir, 'enterprise-ai', 'index.html');
  const workerFile = join(outDir, 'ai-worker', 'index.html');
  const llmsFile = join(outDir, 'llms.txt');

  if (!existsSync(routeFile)) return [`Enternal AI 빌드 파일 없음: ${routeFile}`];

  const html = readFileSync(routeFile, 'utf8');
  const document = parse(html);
  const title = document.querySelector('title')?.text.trim() ?? '';
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const robots = (document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '').toLowerCase().replace(/\s+/g, '');
  const h1s = document.querySelectorAll('h1');

  if (title !== TITLE) errors.push('title 누락 또는 불일치');
  if (description !== DESCRIPTION) errors.push('meta description 누락 또는 불일치');
  if (canonical !== CANONICAL) errors.push('self-canonical 누락 또는 불일치');
  if (robots !== 'index,follow') errors.push(`robots가 index,follow가 아닙니다: ${robots || '(없음)'}`);
  if (h1s.length !== 1 || h1s[0].text.trim() !== H1) errors.push('승인된 H1이 정확히 1개가 아닙니다');

  for (const disclosure of ['현재 제공', 'PoC 검증', '개발 방향', '목표 구조']) {
    if (!document.text.includes(disclosure)) errors.push(`${disclosure} 제품 단계 공개 누락`);
  }

  const ldScripts = document.querySelectorAll('script[type="application/ld+json"]').map((node) => node.text);
  const pageSchema = ldScripts.find((text) => text.includes('"@type":"WebPage"') && text.includes('"@type":"Service"')) ?? '';
  for (const type of ['WebPage', 'Service', 'BreadcrumbList', 'FAQPage']) {
    if (!pageSchema.includes(`"@type":"${type}"`)) errors.push(`${type} JSON-LD 누락`);
  }
  if (pageSchema.includes('"@type":"SoftwareApplication"')) errors.push('SoftwareApplication JSON-LD를 사용하면 안 됩니다');
  if (pageSchema.includes('"@type":"Organization"')) errors.push('페이지 스키마에 Organization 중복 선언이 있습니다');

  if (document.querySelectorAll('[data-enternal-flow]').length !== 5) errors.push('목표 흐름 5단계가 아닙니다');
  if (document.querySelectorAll('[data-enternal-comparison]').length !== 6) errors.push('구조 비교 6개가 아닙니다');
  if (document.querySelectorAll('[data-enternal-faq]').length !== 10) errors.push('FAQ 10개가 아닙니다');

  const landingInput = document.querySelector('input[name="유입_랜딩"]');
  if (landingInput?.getAttribute('value') !== '/enternal-ai/') errors.push('문의 폼 유입 랜딩 값 누락 또는 불일치');

  for (const [label, file] of [['enterprise-ai', enterpriseFile], ['ai-worker', workerFile]]) {
    const parent = readIfPresent(file);
    if (!parent) errors.push(`${label} 부모 빌드 파일 없음`);
    else if (count(parent, /href="\/enternal-ai\/"/g) < 1) errors.push(`${label}에서 Enternal AI 링크가 없습니다`);
  }

  const sitemapText = existsSync(outDir)
    ? readdirSync(outDir)
        .filter((name) => /^sitemap.*\.xml$/.test(name))
        .map((name) => readFileSync(join(outDir, name), 'utf8'))
        .join('\n')
    : '';
  if (count(sitemapText, new RegExp(escaped(CANONICAL), 'g')) !== 1) errors.push('사이트맵 canonical 항목이 정확히 1개가 아닙니다');

  if (!existsSync(llmsFile)) errors.push('llms.txt 없음');
  else if (count(readFileSync(llmsFile, 'utf8'), new RegExp(escaped(CANONICAL), 'g')) !== 1) errors.push('llms.txt canonical 항목이 정확히 1개가 아닙니다');

  verifyPng(logoFile, 'logo', 2172, 724, errors);
  verifyPng(wordmarkFile, 'wordmark', 432, 144, errors);
  return errors;
}

const isCli = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isCli) {
  const errors = verifyEnternalArtifacts(process.argv[2] || 'out');
  if (errors.length) {
    console.error(`✗ Enternal AI 검증 실패 (${errors.length})`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exitCode = 1;
  } else {
    console.log('✓ Enternal AI: metadata · stage · schema · content · parents · sitemap · llms · logo 검증 통과');
  }
}
