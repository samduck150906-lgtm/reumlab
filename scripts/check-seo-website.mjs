#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const SITE = 'https://reumlab.com';

export const SEO_WEBSITE_EXPECTED = [
  { path: '/seo-website/', title: '검색 잘되는 홈페이지 제작', h1: '검색 잘되는 홈페이지 제작', marker: '검색', schemaType: 'Service', form: true },
  { path: '/seo-website/regional/', title: '지역별 검색을 고려한 홈페이지 제작', h1: '여러 지역에서 찾을 수 있도록, 지역별 홈페이지 구조를 설계합니다.', marker: '지역', schemaType: 'Service', form: true },
  { path: '/seo-website/cost/', title: 'SEO 홈페이지 제작 비용', h1: 'SEO 홈페이지 제작 비용', marker: '비용', schemaType: 'Service', form: true },
  { path: '/seo-website/staffing/', title: '인력사무소 홈페이지 제작', h1: '인력사무소·인력업체 홈페이지 제작', marker: '인력', schemaType: 'Service', form: true },
  { path: '/seo-website/guides/search-registration/', title: '홈페이지 검색 등록과 상위노출', h1: '홈페이지 검색 등록과 상위노출은 어떻게 다른가요?', marker: '사이트맵', schemaType: 'Article', form: false },
  { path: '/seo-website/guides/seo-checklist/', title: 'SEO 포함 홈페이지 제작', h1: 'SEO 포함 홈페이지 제작, 견적 전에 확인할 10가지', marker: '체크', schemaType: 'Article', form: false },
];

const FORM_FIELDS = ['service_key', 'industry', 'site_status', 'current_site_url', 'service_region', 'interest_scope', 'source_landing', 'current_page', 'cta_location'];

function collectSchemaTypes(value, types = new Set()) {
  if (!value || typeof value !== 'object') return types;
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
    return types;
  }
  const type = value['@type'];
  for (const item of Array.isArray(type) ? type : [type]) if (typeof item === 'string') types.add(item);
  for (const item of Object.values(value)) collectSchemaTypes(item, types);
  return types;
}

export async function checkSeoWebsite(rootDir = 'out') {
  const issues = [];
  let sitemap = '';
  try {
    const names = (await readdir(rootDir)).filter((name) => /^sitemap(?:-[^.]+)?\.xml$/.test(name));
    sitemap = (await Promise.all(names.map((name) => readFile(path.join(rootDir, name), 'utf8')))).join('\n');
    if (!names.length) throw new Error('no sitemap');
  } catch {
    issues.push('sitemap.xml: missing');
  }

  for (const page of SEO_WEBSITE_EXPECTED) {
    const label = page.path;
    const canonical = `${SITE}${page.path}`;
    let html;
    try {
      html = await readFile(path.join(rootDir, page.path, 'index.html'), 'utf8');
    } catch {
      issues.push(`${label}: HTML missing`);
      continue;
    }
    const document = parse(html);
    const title = document.querySelector('title')?.text.trim() ?? '';
    if (!title.includes(page.title)) issues.push(`${label}: title mismatch`);
    const h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1 || !h1s[0]?.text.includes(page.h1)) issues.push(`${label}: H1 must be exactly one and match`);
    const canonicalHref = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    if (canonicalHref !== canonical) issues.push(`${label}: canonical mismatch (${canonicalHref ?? 'missing'})`);
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.toLowerCase() ?? '';
    if (robots.includes('noindex')) issues.push(`${label}: noindex is not allowed`);
    if (!document.text.includes(page.marker)) issues.push(`${label}: key content marker missing`);
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) issues.push(`${label}: sitemap entry missing`);

    const hasServiceLink = document.querySelectorAll('a').some((a) => {
      const href = a.getAttribute('href') ?? '';
      return href === '/seo-website/' || href === '/seo-website';
    });
    if (!hasServiceLink) issues.push(`${label}: service link missing`);

    if (page.form) {
      const form = document.querySelector('form[name="main-apply"]');
      if (!form) issues.push(`${label}: main-apply form missing`);
      else for (const field of FORM_FIELDS) {
        if (!form.querySelector(`[name="${field}"]`)) issues.push(`${label}: form field ${field} missing`);
      }
    }

    const types = new Set();
    for (const node of document.querySelectorAll('script[type="application/ld+json"]')) {
      try { collectSchemaTypes(JSON.parse(node.text), types); } catch { issues.push(`${label}: invalid JSON-LD`); }
    }
    if (!types.has(page.schemaType)) issues.push(`${label}: ${page.schemaType} schema missing`);
  }

  return { checked: SEO_WEBSITE_EXPECTED.length, issues };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('out');
  const result = await checkSeoWebsite(root);
  if (result.issues.length) {
    console.error(`SEO website QA failed (${result.issues.length})`);
    for (const issue of result.issues) console.error(`- ${issue}`);
    process.exitCode = 1;
  } else {
    console.log(`SEO website QA passed: ${result.checked} pages`);
  }
}
