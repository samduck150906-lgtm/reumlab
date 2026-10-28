import { agencyHub, agencyPages } from '@/lib/development-agency/catalog';
import { AGENCY_DOMAIN, agencyHref } from '@/lib/development-agency/types';
import { AGENCY_CATEGORIES, agencyCategoryHref, agencyCategoryPages } from '@/lib/development-agency/categories';

export const dynamic = 'force-static';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function GET() {
  // 범위별 하위 허브 — lastmod 는 그 범위 상세 중 가장 최근 갱신일
  const categoryUrls = AGENCY_CATEGORIES.map(c => {
    const lastmod = agencyCategoryPages(c.key).map(p => p.updatedAt).sort().at(-1) ?? agencyHub.updatedAt;
    return `  <url><loc>${escapeXml(AGENCY_DOMAIN + agencyCategoryHref(c))}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`;
  });
  const urls = [agencyHub, ...agencyPages].map(page =>
    `  <url><loc>${escapeXml(AGENCY_DOMAIN + agencyHref(page))}</loc><lastmod>${escapeXml(page.updatedAt)}</lastmod></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${categoryUrls.join('\n')}\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
