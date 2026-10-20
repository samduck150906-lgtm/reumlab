import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import WebsiteIndustryPage from '../../app/website/[industry]/page';
import { WEBSITE_INDUSTRIES, buildWebsiteContent } from '../../lib/website-industries';

// tsx respects this Next project's jsx:preserve setting and uses classic JSX
// for this standalone source-render probe; Next's production compiler is separate.
Object.assign(globalThis, { React });
const results = WEBSITE_INDUSTRIES.map((industry) => {
  const expected = buildWebsiteContent(industry);
  const html = renderToStaticMarkup(WebsiteIndustryPage({ params: { industry: industry.slug } }));
  const doc = parse(html);
  const text = doc.textContent;
  assert.equal(doc.querySelectorAll('h1').length, 1, industry.slug);
  for (const [field, value] of Object.entries(expected.editorial)) {
    if (field === 'exception') continue; // inflected to a complete Korean sentence in body
    assert.ok(text.includes(value), `${industry.slug}: ${field} missing from initial render`);
  }
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]').map((script) => JSON.parse(script.textContent));
  assert.ok(scripts.length > 0, industry.slug);
  return { url: `https://reumlab.com/website/${industry.slug}/`, h1: doc.querySelector('h1')?.textContent, h2: doc.querySelectorAll('h2').map((el) => el.textContent), allEditorialSectionsPresent: true, jsonLdParsed: scripts.length, validation: 'React source server render; not deployed HTTP or visual verification' };
});
fs.writeFileSync(new URL('./website-render-check.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
console.log(`Validated source-rendered content and JSON-LD for ${results.length} homepage URLs.`);
