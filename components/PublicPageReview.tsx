import React from 'react';
import publishedReviews from '../content/public-page-review.json';

type ReviewRow = { label: string; basis: string; check: string; source: string; href: string };
type ReviewLink = { label: string; href: string; basis?: string; check?: string };
type Review = { heading: string; rows: ReviewRow[]; navigation: ReviewLink[] };

const reviews: Readonly<Record<string, Review>> = publishedReviews;

export default function PublicPageReview({ path }: { path: string }) {
  const record = reviews[decodeURIComponent(path).normalize('NFC')];
  if (!record) return null;
  return (
    <section className="public-page-review" aria-labelledby="public-page-review-title">
      <h2 id="public-page-review-title">{record.heading}</h2>
      {record.rows.length > 0 && <dl>
        {record.rows.map(row => <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>
            <p>{row.check}</p>
            <p className="public-page-review-basis">
              {row.href ? <a href={row.href}>{row.source}</a> : <strong>{row.source}</strong>}
              {' · '}{row.basis}
            </p>
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
