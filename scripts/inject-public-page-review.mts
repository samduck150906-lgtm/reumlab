import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import PublicPageReview from '../components/PublicPageReview';
import reviews from '../content/public-page-review.json';

// These routes are already rendered by static source files after Next export.
// React routes render the same component in their ordinary server page.
const staticPaths = [
  '/', '/mvp/', '/erp/', '/ai-automation/', '/platform/',
  '/reservation-commerce/', '/website/', '/data-seo/', '/service-renewal/',
  '/privacy/', '/terms/', '/refund/',
];
let changed = 0;
for (const pathname of staticPaths) {
  const file = join('out', pathname.slice(1), 'index.html');
  let html = readFileSync(file, 'utf8');
  const review = reviews[pathname as keyof typeof reviews];
  if (!review) continue;
  html = html.replace(/<section class="public-page-review"[\s\S]*?<\/section>/, '');
  if (['/privacy/', '/terms/', '/refund/'].includes(pathname)) {
    const headings = parse(html).querySelectorAll('main h2');
    if (JSON.stringify(headings.map(node => node.textContent.trim())) !==
        JSON.stringify(review.navigation.map(node => node.label))) {
      throw new Error('Policy headings changed; regenerate the clause navigation for ' + pathname);
    }
    let number = 0;
    html = html.replace(/<h2\b[^>]*>/g, opening => {
      number++;
      if (opening.includes(`id="policy-clause-${number}"`)) return opening;
      if (/\bid=/.test(opening)) throw new Error('Preserve existing policy anchor: ' + pathname);
      return opening.replace('>', ` id="policy-clause-${number}">`);
    });
  }
  const markup = renderToStaticMarkup(React.createElement(PublicPageReview, { path: pathname }));
  const location = ['/privacy/', '/terms/', '/refund/'].includes(pathname)
    ? html.indexOf('<h2') : html.lastIndexOf('</main>');
  if (location < 0) throw new Error('Missing insertion point: ' + pathname);
  html = html.slice(0, location) + markup + html.slice(location);
  if (!html.includes('href="/assets/public-page-review.css"')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/public-page-review.css"></head>');
  }
  writeFileSync(file, html);
  changed++;
}
console.log(`Public source review rendered for ${changed} static-source routes`);
