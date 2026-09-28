# Sitewide Naver Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the home page's trust-first design and business identity to all indexable ReumLab templates without losing any protected Naver URL or unique search intent.

**Architecture:** Make small source-template changes that fan out through the static build, then enforce the contract by scanning every sitemap URL in `out/`. Preserve metadata and content sources; only shared shell, semantic landmarks, contextual linking, and portfolio presentation change.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, CSS, static export, Node test runner, Netlify.

**Spec:** `docs/superpowers/specs/2026-09-28-sitewide-naver-experience-design.md`

## Global Constraints

- Preserve all 786 URLs in `config/naver-index-baseline.json`.
- Preserve canonical, robots, redirects, sitemap membership, form field names, and analytics event timing.
- Do not create unverifiable claims, reviews, customers, metrics, offices, or dates.
- Reuse Pretendard and the existing navy/blue design tokens.
- Do not edit generated `out/` files as source.

## Review Focus

- Encoded and Korean paths must map to the correct exported HTML file.
- Static legal pages must pass the same NAP contract as Next.js pages.
- Shared footer changes must not create nested `<main>` or nested `<footer>` landmarks.
- Portfolio disclosure text must remain factual and must not imply public client identities or performance figures.
- The form and analytics tests must remain unchanged and passing.

---

### Task 1: Sitewide experience quality gate

**Files:**
- Create: `scripts/sitewide-experience-lib.mjs`
- Create: `scripts/sitewide-experience.test.mts`
- Create: `scripts/verify-sitewide-experience.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `auditSitewideExperience(outDir, protectedUrls)` returning counts and issue arrays.
- Consumes: `readSitemapLocs(outDir)` and `config/naver-index-baseline.json`.

- [ ] Write failing tests for missing `<main>`, footer, NAP, H1, missing protected URL, portfolio footer, and orphaned Search Advisor guide.
- [ ] Run the focused test and confirm it fails before the audit helper exists.
- [ ] Implement the audit helper and CLI verifier.
- [ ] Add `seo:verify:experience` and make the production build run it after existing Naver and protection checks.
- [ ] Run the focused test and confirm it passes.

### Task 2: Semantic landmarks for generated hubs and landings

**Files:**
- Modify: `components/HubPage.js`
- Modify: `components/LandingPage.js`

**Interfaces:**
- Produces: exactly one `<main>` per generated `/h/*` and `/l/*` document, with `BusinessFooter` outside it.

- [ ] Add source tests asserting the templates use a `<main>` landmark and sibling footer.
- [ ] Run focused tests and confirm the old `<div>` shell fails.
- [ ] Replace the shell while preserving every section, CTA, form, and content branch.
- [ ] Run focused tests and the build verifier.

### Task 3: Portfolio trust presentation and shared footer

**Files:**
- Modify: `app/portfolio/page.tsx`
- Modify: `app/portfolio/[id]/page.tsx`
- Modify: `app/portfolio/portfolio.css`
- Test: `scripts/sitewide-experience.test.mts`

**Interfaces:**
- Consumes: `BusinessFooter` and existing portfolio facts.
- Produces: 16 portfolio routes with the shared NAP footer and home-aligned hero presentation.

- [ ] Extend tests to require `BusinessFooter` on both portfolio templates.
- [ ] Run focused tests and confirm failure.
- [ ] Render the footer as a sibling of `<main>` on hub and detail pages.
- [ ] Restyle the portfolio header, disclosure, facts, CTA, focus, and mobile breakpoints using existing tokens.
- [ ] Run tests and inspect hub/detail at 390px and 1440px.

### Task 4: Content reachability and legal NAP

**Files:**
- Modify: `app/seo-website/page.tsx`
- Modify: `public/privacy/index.html`
- Modify: `public/terms/index.html`
- Modify: `public/refund/index.html`
- Test: `scripts/sitewide-experience.test.mts`

**Interfaces:**
- Produces: an inbound contextual link to `/seo-website/guides/search-registration/` and complete reference NAP on all legal pages.

- [ ] Add tests for the contextual guide link and complete legal-page NAP.
- [ ] Run focused tests and confirm failure.
- [ ] Add the guide link next to the existing SEO checklist link.
- [ ] Add the exact company, representative, registration number, phone, email, and address to legal footers.
- [ ] Run focused tests and the indexability audit.

### Task 5: Full regression and visual verification

**Files:**
- Modify only if a failing regression proves a required fix.

- [ ] Run `npm test` and `npm run typecheck`.
- [ ] Run `npm run build` and `npm run seo:verify:experience`.
- [ ] Run SEO, NEO, conversion, cannibalization, content, and GEO audits from the approved specification.
- [ ] Compare sitemap and protected URL counts with the baseline: 793 current and 786 protected.
- [ ] Start the built preview and inspect representative home, service, hub, landing, portfolio, guide, legal, form, and 404 routes at mobile and desktop sizes.
- [ ] Record console, overflow, heading, footer, CTA, and form results.

### Task 6: Release and search submission

**Files:**
- Update generated audit documentation only when produced by approved scripts.

- [ ] Review the complete diff for metadata, canonical, robots, sitemap, form, and analytics drift.
- [ ] Commit the tested changes with an accurate message and push the current approved branch.
- [ ] Confirm the Netlify production deployment and smoke-test changed canonical URLs.
- [ ] Submit only changed sitemap URLs through IndexNow.
- [ ] If the authenticated Search Advisor session is available, confirm sitemap status and request collection for at most three P0 URLs.
- [ ] Report indexing as `UNVERIFIED` until the engine confirms it.
