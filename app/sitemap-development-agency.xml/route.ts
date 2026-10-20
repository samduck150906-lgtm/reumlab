import { agencyHub, agencyPages } from '@/lib/development-agency/catalog';
import { AGENCY_DOMAIN, agencyHref } from '@/lib/development-agency/types';

export const dynamic = 'force-static';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function GET() {
  const urls = [agencyHub, ...agencyPages].map(page =>
    `  <url><loc>${escapeXml(AGENCY_DOMAIN + agencyHref(page))}</loc><lastmod>${escapeXml(page.updatedAt)}</lastmod></url>`
  ).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
