# Sitewide Naver Experience Design

## Goal

Preserve every protected and currently indexable ReumLab URL while extending the home page's trust-first visual language, semantic structure, business identity, and conversion clarity to every indexable template.

## Baseline

- 786 URLs are protected by `config/naver-index-baseline.json`.
- The production build emits 793 sitemap URLs and 1,359 HTML documents.
- Canonical, sitemap, redirect, duplicate metadata, SSR, OG, RSS, and form checks pass.
- The current actionable gaps are structural rather than index-count gaps:
  - 16 portfolio routes do not render the shared business footer.
  - generated hub and keyword landing templates do not expose a semantic `<main>` landmark.
  - `/seo-website/guides/search-registration/` is indexable but orphaned.
  - the three legal pages do not expose the complete reference NAP.

## Approach

Use template-level changes rather than editing hundreds of generated HTML files. Keep each page's unique title, H1, content, canonical, schema, and search intent intact. Improve the shared experience through semantic landmarks, the existing `BusinessFooter`, a more deliberate portfolio hero treatment, and a build-time verifier that scans every sitemap URL.

## Design System

- Reuse the existing Pretendard font and navy/blue trust palette from `app/globals.css`.
- Keep the global navigation and CTA behavior unchanged.
- Give portfolio hubs and details a restrained navy hero surface, readable Korean line lengths, factual disclosure, and clear contact actions.
- Use the existing business footer as the single source of NAP and service discovery for Next.js routes.
- Preserve 44px touch targets, visible focus, responsive grids, and reduced-motion support.

## Content and Indexing Rules

- Never remove a protected URL, add broad `noindex`, change canonical targets, or collapse live pages for visual consistency.
- Do not invent customers, reviews, performance metrics, offices, or project dates.
- Preserve page-specific service, problem, deliverable, process, limitation, FAQ, and related-link content.
- Add only contextual internal links. The orphaned Search Advisor registration guide must be linked from the SEO website service cluster.
- Legal pages must show the same company, representative, registration number, phone, email, and address as `lib/seo.ts`.

## Verification

Add a sitewide experience verifier that reads the built sitemap and asserts, for every indexable HTML page:

- a real HTML file exists;
- one H1 and a semantic `<main>` exist;
- global navigation and a footer exist;
- the reference phone and email are present;
- no protected URL disappeared;
- portfolio pages carry the shared business footer;
- the Search Advisor guide has at least one internal inbound link.

Run the existing test, typecheck, build, NEO, SEO, conversion, canonical, content, and GEO gates. Verify representative routes at mobile and desktop sizes before deployment. IndexNow and Search Advisor actions happen only after production verification, and a successful request is never reported as completed indexing.

## Rollout

1. Pin the current baseline and add failing template-quality tests.
2. Fix semantic landmarks and shared business identity at template level.
3. Improve the portfolio visual shell without changing case facts.
4. Repair the orphaned guide and legal-page NAP.
5. Build and run every regression gate.
6. Visually inspect representative page families.
7. Commit, push, deploy, verify production, submit changed URLs, and report account-bound steps separately.
