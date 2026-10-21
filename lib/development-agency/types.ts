export type TextList = readonly [string, ...string[]];
export type ContentField =
  | 'audience' | 'actualProblems' | 'userRoles' | 'workflows'
  | 'coreFeatures' | 'adminFeatures' | 'integrations' | 'dataEntities'
  | 'edgeCases' | 'mvpScope' | 'expansionScope' | 'costDrivers'
  | 'timelineDrivers' | 'complianceChecks' | 'handover';

export interface AgencySection {
  id: string;
  heading: string;
  fields: readonly [ContentField, ...ContentField[]];
  format?: 'prose' | 'steps' | 'cards';
}

export interface AgencyFaq {
  question: string;
  answer: string;
}

export interface AgencyPage extends Record<ContentField, TextList> {
  slug: string;
  clusterIds: TextList;
  primaryKeyword: string;
  keywordVariants: TextList;
  searchIntent: string;
  industry: string;
  serviceAxis: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  updatedAt: string;
  sections: readonly AgencySection[];
  faq: readonly [AgencyFaq, AgencyFaq, AgencyFaq, AgencyFaq, AgencyFaq, AgencyFaq, ...AgencyFaq[]];
  relatedRoutes: readonly { href: string; label: string; reason: string }[];
  ctaContext: string;
  evidenceSources: readonly { title: string; url: string; use: string }[];
}

export const AGENCY_BASE = '/development-agency/';
export const AGENCY_DOMAIN = 'https://reumlab.com';

export function agencyHref(page: Pick<AgencyPage, 'slug'>): string {
  return page.slug ? `${AGENCY_BASE}${page.slug.split('/').map(encodeURIComponent).join('/')}/` : AGENCY_BASE;
}

export function agencySlugFromSegments(segments: readonly string[]): string | undefined {
  try {
    // Static export can pass percent-encoded catch-all segments. Decode once,
    // then retain the same restricted segment grammar as the source registry.
    const decoded = segments.map(segment => decodeURIComponent(segment).normalize('NFC'));
    if (!decoded.length || decoded.some(segment => !/^[a-z0-9가-힣-]+$/.test(segment))) return undefined;
    return decoded.join('/');
  } catch {
    return undefined;
  }
}

export function assertAgencyPages(pages: readonly AgencyPage[]): void {
  const seen = new Set<string>();
  const required: ContentField[] = ['audience','actualProblems','userRoles','workflows','coreFeatures','adminFeatures','integrations','dataEntities','edgeCases','mvpScope','expansionScope','costDrivers','timelineDrivers','complianceChecks','handover'];
  for (const page of pages) {
    if ((page.slug !== '' && !/^[a-z0-9가-힣-]+(?:\/[a-z0-9가-힣-]+)*$/.test(page.slug)) || seen.has(page.slug)) {
      throw new Error(`Invalid or duplicate development-agency slug: ${page.slug}`);
    }
    seen.add(page.slug);
    if (page.sections.length < 12 || page.faq.length < 6) throw new Error(`Incomplete article structure: ${page.slug}`);
    const rendered = new Set(page.sections.flatMap(section => section.fields));
    const ids = new Set(page.sections.map(section => section.id));
    if (ids.size !== page.sections.length) throw new Error(`Duplicate section id: ${page.slug}`);
    for (const field of required) {
      if (!page[field]?.length || page[field].some(text => !text.trim()) || !rendered.has(field)) {
        throw new Error(`Missing ${field} content or section: ${page.slug}`);
      }
    }
    if (page.relatedRoutes.some(link => link.href === agencyHref(page))) throw new Error(`Self-related link: ${page.slug}`);
    for (const source of page.evidenceSources) {
      let webAddress = false;
      try {
        const url = new URL(source.url);
        webAddress = (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
      } catch { /* Report the page and reference instead of exporting a broken link. */ }
      if (!webAddress || typeof source.title !== 'string' || !source.title.trim()
        || typeof source.use !== 'string' || !source.use.trim()) {
        throw new Error(`Invalid evidence source: ${page.slug} (${source.url})`);
      }
    }
  }
}
