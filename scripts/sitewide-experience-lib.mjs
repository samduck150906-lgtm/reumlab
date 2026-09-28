import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSitemapLocs } from './read-sitemap.mjs';

const ORIGIN = 'https://reumlab.com';
const PHONE = '010-8111-9370';
const EMAIL = 'ceo@eternalsix.com';
const SEARCH_REGISTRATION_PATH = '/seo-website/guides/search-registration/';

function decodePath(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function pathnameFor(url) {
  return decodePath(new URL(url, ORIGIN).pathname);
}

function htmlPath(outDir, pathname) {
  const relative = pathname === '/' ? '' : pathname.replace(/^\//, '').replace(/\/$/, '');
  return join(outDir, ...relative.split('/').filter(Boolean), 'index.html');
}

function normalizedUrl(url) {
  const parsed = new URL(url, ORIGIN);
  return `${parsed.origin}${pathnameFor(parsed.href)}`;
}

function countTag(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b`, 'gi'))].length;
}

function hasInboundSearchGuideLink(documents) {
  const absolute = `${ORIGIN}${SEARCH_REGISTRATION_PATH}`;
  return documents.some(({ pathname, html }) => {
    if (pathname === SEARCH_REGISTRATION_PATH) return false;
    return [...html.matchAll(/href=["']([^"']+)["']/gi)].some((match) => {
      const href = match[1];
      return href === SEARCH_REGISTRATION_PATH || href === absolute;
    });
  });
}

export function auditSitewideExperience(outDir, protectedUrls) {
  const sitemapUrls = readSitemapLocs(outDir);
  const sitemapSet = new Set(sitemapUrls.map(normalizedUrl));
  const issues = {
    missingHtml: [],
    missingNav: [],
    missingMain: [],
    missingFooter: [],
    missingNap: [],
    invalidH1: [],
    missingProtected: protectedUrls.map(normalizedUrl).filter((url) => !sitemapSet.has(url)),
    portfolioMissingFooter: [],
    orphanSearchGuide: [],
  };
  const documents = [];

  for (const url of sitemapUrls) {
    const pathname = pathnameFor(url);
    const file = htmlPath(outDir, pathname);
    if (!existsSync(file)) {
      issues.missingHtml.push(pathname);
      continue;
    }

    const html = readFileSync(file, 'utf8');
    documents.push({ pathname, html });
    const hasNav = countTag(html, 'nav') > 0;
    const hasMain = countTag(html, 'main') === 1;
    const hasFooter = countTag(html, 'footer') > 0;
    const hasNap = html.includes(PHONE) && html.includes(EMAIL);
    const h1Count = countTag(html, 'h1');

    if (!hasNav) issues.missingNav.push(pathname);
    if (!hasMain) issues.missingMain.push(pathname);
    if (!hasFooter) issues.missingFooter.push(pathname);
    if (!hasNap) issues.missingNap.push(pathname);
    if (h1Count !== 1) issues.invalidH1.push(pathname);
    if (pathname.startsWith('/portfolio/') && !hasFooter) issues.portfolioMissingFooter.push(pathname);
  }

  if (
    sitemapUrls.some((url) => pathnameFor(url) === SEARCH_REGISTRATION_PATH)
    && !hasInboundSearchGuideLink(documents)
  ) {
    issues.orphanSearchGuide.push(SEARCH_REGISTRATION_PATH);
  }

  for (const values of Object.values(issues)) values.sort();
  const issueCount = Object.values(issues).reduce((sum, values) => sum + values.length, 0);

  return {
    ok: issueCount === 0,
    counts: {
      sitemapUrls: sitemapUrls.length,
      protectedUrls: new Set(protectedUrls.map(normalizedUrl)).size,
      checkedHtml: documents.length,
      issueCount,
    },
    issues,
  };
}
