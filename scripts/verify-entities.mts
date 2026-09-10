/**
 * 공개 산출물의 사업자 엔터티 정합성 검사.
 * SITE를 기준으로 Organization/ProfessionalService의 이름·연락처·주소·sameAs를 대조한다.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SITE } from '../lib/seo';

const OUT = process.argv[2] || 'out';
const fail: string[] = [];
const warn: string[] = [];
const htmlFiles: string[] = [];

if (!existsSync(OUT)) {
  console.error('out/이 없습니다. 먼저 npm run build를 실행하세요.');
  process.exit(1);
}

function walk(dir: string, sink: string[], predicate: (path: string) => boolean) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, sink, predicate);
    else if (predicate(path)) sink.push(path);
  }
}

walk(OUT, htmlFiles, (path) => path.endsWith('.html'));

const expectedAddress = SITE.addressParts;
const expectedSameAs = [...SITE.sameAs].sort();
let graphPages = 0;
let organizations = 0;
let businesses = 0;

function compareAddress(pathname: string, label: string, address: Record<string, unknown> | undefined) {
  if (!address) {
    fail.push(`${pathname}: ${label}.address 없음`);
    return;
  }
  for (const [key, value] of Object.entries(expectedAddress)) {
    if (address[key] !== value) fail.push(`${pathname}: ${label}.address.${key} 불일치`);
  }
}

for (const file of htmlFiles) {
  const rel = relative(OUT, file).replace(/\\/g, '/');
  if (/^(404\.html|__forms\.html|google[^/]*\.html|naver[^/]*\.html)$/.test(rel)) continue;
  const pathname = '/' + rel.replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const nodes: Record<string, unknown>[] = [];

  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const json = JSON.parse(match[1]);
      nodes.push(...(json['@graph'] ?? [json]));
    } catch {
      // JSON 문법은 qa-final이 상세 보고한다.
    }
  }

  const org = nodes.find((node) => node['@id'] === `${SITE.domain}/#organization`);
  const business = nodes.find((node) => node['@id'] === `${SITE.domain}/#business`);
  if (!org && !business) continue;
  graphPages++;

  if (org) {
    organizations++;
    if (org.name !== SITE.name) fail.push(`${pathname}: Organization.name 불일치`);
    if (org.alternateName !== SITE.nameEn) fail.push(`${pathname}: Organization.alternateName 불일치`);
    if (org.email !== SITE.email) fail.push(`${pathname}: Organization.email 불일치`);
    if (org.telephone !== SITE.phone) fail.push(`${pathname}: Organization.telephone 불일치`);
    if (org.legalName && !SITE.legalName) fail.push(`${pathname}: 미확인 legalName 노출`);
    if (org.founder) fail.push(`${pathname}: 대표자를 founder로 추정한 필드 노출`);
    compareAddress(pathname, 'Organization', org.address as Record<string, unknown> | undefined);
    const sameAs = Array.isArray(org.sameAs) ? [...org.sameAs].sort() : [];
    if (JSON.stringify(sameAs) !== JSON.stringify(expectedSameAs)) fail.push(`${pathname}: Organization.sameAs 불일치`);
  } else {
    fail.push(`${pathname}: Organization 노드 없음`);
  }

  if (business) {
    businesses++;
    if (business.name !== SITE.name) fail.push(`${pathname}: ProfessionalService.name 불일치`);
    if (business.email !== SITE.email) fail.push(`${pathname}: ProfessionalService.email 불일치`);
    if (business.telephone !== SITE.phone) fail.push(`${pathname}: ProfessionalService.telephone 불일치`);
    compareAddress(pathname, 'ProfessionalService', business.address as Record<string, unknown> | undefined);
  } else {
    fail.push(`${pathname}: ProfessionalService 노드 없음`);
  }
}

// 실제 프로젝트 지명일 수 있는 일반 단어는 자동 치환하지 않는다. 현재 확인된 과거 사업장 신호만 검사한다.
const sourceRoots = ['app', 'components', 'content', 'lib', 'src', 'scripts'];
const sourceFiles: string[] = ['index.html'];
for (const root of sourceRoots) {
  if (existsSync(root)) walk(root, sourceFiles, (path) => /\.(?:ts|tsx|js|mjs|mts|json|html)$/.test(path));
}
for (const file of sourceFiles) {
  if (file.endsWith('verify-entities.mts') || file.endsWith('geo-inventory.mjs')) continue;
  const text = readFileSync(file, 'utf8');
  if (/인계동\s*(?:본사|사무실|사업장)|인계동에\s*(?:위치|자리)/.test(text)) {
    fail.push(`${file.replace(/\\/g, '/')}: 과거 소재지 표현 후보`);
  } else if (text.includes('인계동')) {
    warn.push(`${file.replace(/\\/g, '/')}: 인계동 문맥 수동 확인 필요`);
  }
}

console.log(`엔터티 그래프 페이지 ${graphPages} · Organization ${organizations} · ProfessionalService ${businesses}`);
console.log(`기준 NAP: ${SITE.name} · ${SITE.address} · ${SITE.phone} · ${SITE.email}`);
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 10).forEach((item) => console.log('  ' + item));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 30).forEach((item) => console.log('  ' + item));
  if (fail.length > 30) console.log(`  ... 외 ${fail.length - 30}건`);
  process.exit(1);
}
console.log('✓ 사업자 엔터티 정합성 통과');
