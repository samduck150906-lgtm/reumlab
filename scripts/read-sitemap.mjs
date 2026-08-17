/**
 * 사이트맵 읽기 공통 헬퍼.
 *
 * out/sitemap.xml 은 빌드 마지막에 sitemapindex 로 바뀐다(scripts/split-sitemap.mjs).
 * 그 전까지 검사 스크립트들은 이 파일을 urlset 으로 가정하고 <loc> 를 직접 긁었다.
 * 색인 파일로 바뀌면 그 스크립트들이 "URL 0개"를 보고 전 페이지를 사이트맵 누락으로
 * 잘못 신고한다 — 실제로는 자식 사이트맵에 그대로 있는데도.
 *
 * 그래서 "사이트맵 전체의 URL 목록"을 얻는 경로를 한 곳으로 모은다.
 * index 든 단일 urlset 이든 같은 결과를 돌려준다.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

/** sitemapindex 면 자식 파일들의 <url> 블록을 하나로 이어 붙인 urlset XML 을 만든다 */
export function readSitemapXml(outDir = 'out') {
  const root = join(outDir, 'sitemap.xml');
  if (!existsSync(root)) return '';
  const xml = readFileSync(root, 'utf8');
  if (!xml.includes('<sitemapindex')) return xml;

  const children = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => basename(m[1]));
  const blocks = [];
  for (const file of children) {
    const p = join(outDir, file);
    if (!existsSync(p)) continue;
    const child = readFileSync(p, 'utf8');
    for (const m of child.matchAll(/<url>[\s\S]*?<\/url>/g)) blocks.push(m[0]);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${blocks.join('\n')}\n</urlset>\n`;
}

/** 사이트맵에 실린 모든 URL (index 포함 전체) */
export function readSitemapLocs(outDir = 'out') {
  return [...readSitemapXml(outDir).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/** sitemapindex 여부 */
export function isSitemapIndex(outDir = 'out') {
  const root = join(outDir, 'sitemap.xml');
  return existsSync(root) && readFileSync(root, 'utf8').includes('<sitemapindex');
}
