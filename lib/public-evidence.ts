import { SITE } from './seo';

export type PublicReviewRow = { label: string; basis: string; check: string; source: string; href: string };
export type PublicReview = {
  reviewedAt?: string;
  heading: string;
  rows: PublicReviewRow[];
  navigation: { label: string; href: string; basis?: string; check?: string }[];
};

/** IDs depend on the label, not the excerpt or its position: existing citations survive copy edits. */
export function evidenceAnchor(label: string): string {
  let hash = 2166136261;
  for (const character of label.normalize('NFC')) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619);
  }
  return `review-evidence-${(hash >>> 0).toString(36)}`;
}

export function publicEvidence(path: string, review: PublicReview) {
  if (!path.startsWith('/') || path.startsWith('//') || /[?#]/.test(path)) {
    throw new Error('Evidence requires a canonical site pathname');
  }
  const page = new URL(path.normalize('NFC'), SITE.domain).href;
  const seen = new Set<string>();
  const parts = review.rows.map(row => {
    const id = evidenceAnchor(row.label);
    if (seen.has(id)) throw new Error(`Duplicate evidence label on ${path}: ${row.label}`);
    seen.add(id);
    const sourceUrl = new URL(row.href || page, page);
    if (sourceUrl.origin !== SITE.domain || sourceUrl.protocol !== 'https:') {
      throw new Error(`Public review source must be an existing site reference: ${row.href}`);
    }
    return { ...row, id, sourceUrl: sourceUrl.href };
  });
  const sectionId = `${page}#public-page-review`;
  return {
    page,
    parts,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPageElement',
      '@id': sectionId,
      url: sectionId,
      name: review.heading,
      inLanguage: 'ko-KR',
      publisher: { '@id': `${SITE.domain}/#organization` },
      isPartOf: { '@type': 'WebPage', '@id': `${page}#webpage`, url: page },
      hasPart: parts.map(row => ({
        '@type': 'WebPageElement',
        '@id': `${page}#${row.id}`,
        url: `${page}#${row.id}`,
        name: row.label,
        text: `${row.basis}\n${row.check}`,
        citation: row.sourceUrl,
        isPartOf: { '@id': sectionId },
      })),
    },
  };
}
