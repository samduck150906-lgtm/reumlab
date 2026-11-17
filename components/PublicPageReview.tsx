import React from 'react';
import publishedReviews from '../content/public-page-review.json';
import { publicEvidence, type PublicReview } from '../lib/public-evidence';
import { JsonLdScript } from './JsonLd';

const reviews: Readonly<Record<string, PublicReview>> = publishedReviews;

export default function PublicPageReview({ path }: { path: string }) {
  const record = reviews[decodeURIComponent(path).normalize('NFC')];
  if (!record) return null;
  const evidence = publicEvidence(path, record);
  const reviewedAt = record.reviewedAt ?? '2026-11-11';
  return (
    <section id="public-page-review" className="public-page-review" aria-labelledby="public-page-review-title" data-reviewed-at={reviewedAt}>
      <JsonLdScript data={evidence.schema} />
      <h2 id="public-page-review-title">{record.heading}</h2>
      <p className="public-page-review-basis"><time dateTime={reviewedAt}>{reviewedAt} 확인 항목 보강</time></p>
      {record.rows.length > 0 && <dl>
        {evidence.parts.map(row => <div id={row.id} key={row.id}>
          <dt><a className="public-evidence-permalink" href={`#${row.id}`} aria-label={`${row.label} 항목의 고정 주소`}>{row.label}</a></dt>
          <dd>
            <blockquote className="public-evidence-excerpt" cite={row.sourceUrl}>
              <p>{row.basis}</p>
              <cite><a href={row.sourceUrl}>{row.source}</a></cite>
            </blockquote>
            <p>{row.check}</p>
          </dd>
        </div>)}
      </dl>}
      {record.navigation.length > 0 && <ul>
        {record.navigation.map(link => <li key={link.href}>
          <a href={link.href}>{link.label}</a>
          {link.check && <p>{link.check}</p>}
          {link.basis && <p className="public-page-review-basis">{link.basis}</p>}
        </li>)}
      </ul>}
    </section>
  );
}
