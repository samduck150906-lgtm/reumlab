# Search-friendly Website Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a non-duplicative Korean ‘검색 잘되는 홈페이지 제작’ service cluster that reuses indexed industry URLs, submits real inquiries through `main-apply`, and ships with verified SEO discovery paths.

**Architecture:** A typed server-side content source owns six new routes and mappings to nine existing industry routes. New server components render meaningful initial HTML and safe JSON-LD; the existing inquiry client receives one additive variant and keeps the Netlify contract. Existing discovery sources are extended without changing legacy canonicals or prices.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript 5.9, Node test runner, Netlify Forms, Netlify static deploy.

**Spec:** `docs/superpowers/specs/2026-09-22-seo-website-service-design.md`

## Global Constraints

- Preserve all existing user work, indexed URLs, canonical URLs, verification assets, prices, forms, and search-engine protections.
- Publish no ranking, indexing, inquiry, revenue, response-time, or AI citation guarantee.
- Use ‘범위 확인 후 개별 견적’ for the new service.
- Keep major copy and links in initial HTML; do not turn the full page into a client component.
- Reuse `main-apply`; never send personal form values to analytics.
- Add only verified indexable 200 canonical URLs to the sitemap.

## Review Focus

- Unknown `/seo-website/**` slugs must export as real 404s rather than soft 200s.
- Existing selected industry pages must retain their original canonical and index decision.
- One `main-apply` submission must emit `generate_lead` only after success and only once.
- The static Netlify form must contain every field rendered by the SEO variant.
- New sitemap entries must not remove any URL in the Naver protection baseline.

---

### Task 1: Typed content and route contract

**Files:**
- Create: `lib/seo-website.ts`
- Create: `scripts/seo-website.test.mts`

**Interfaces:**
- Produces: `SEO_WEBSITE_PAGES`, `SEO_WEBSITE_INDUSTRIES`, `getSeoWebsitePage()`, `seoWebsiteCanonical()`, `SEO_WEBSITE_GUIDES`.
- Consumes: `SITE.domain` and existing `/website/<slug>/` canonicals.

- [ ] Write tests with literal expected URLs proving six new routes are unique, nine industry mappings reuse existing routes, every profile has distinct decision information, and unknown slugs return undefined.
- [ ] Run `node --import tsx --test scripts/seo-website.test.mts`; expect FAIL because the module does not exist.
- [ ] Implement the typed data and helpers without importing client modules.
- [ ] Re-run the focused test; expect all assertions PASS.

### Task 2: Server-rendered pages and existing industry enhancements

**Files:**
- Create: `app/seo-website/page.tsx`
- Create: `app/seo-website/[slug]/page.tsx`
- Create: `app/seo-website/guides/[slug]/page.tsx`
- Create: `app/seo-website/seo-website.module.css`
- Create: `components/SeoWebsiteIndustryEnhancement.tsx`
- Modify: `app/website/[industry]/page.tsx`
- Create: `scripts/seo-website-page-source.test.mts`

**Interfaces:**
- Consumes Task 1 page/profile data.
- Produces initial HTML with one H1, self-canonical, breadcrumb, actual links, accessible FAQ, and `#inquiry`.

- [ ] Write source-contract tests for the six new routes and conditional enhancements; expected failure is missing route files/components.
- [ ] Implement metadata/static params/404 behavior and page UI with `ServiceWebPageJsonLd` or `GuideArticleJsonLd` without new FAQPage markup.
- [ ] Add selected industry detail sections and links while preserving existing metadata/canonical decisions.
- [ ] Run focused tests and `npm run typecheck`; expect PASS.

### Task 3: Inquiry fields and analytics context

**Files:**
- Create: `lib/seo-website-form.ts`
- Modify: `components/LandingInquiryForm.tsx`
- Modify: `lib/analytics.ts`
- Modify: `public/__forms.html`
- Create: `scripts/seo-website-inquiry.test.mts`

**Interfaces:**
- Consumes page id and default industry from Task 2.
- Produces existing `main-apply` POST fields and non-PII event parameters including `service_key=seo_website`.

- [ ] Write tests proving the rendered variant includes `main-apply`, service context, optional URL, industry/status/region/scope fields, privacy agreement, honeypot, and matching static detection fields.
- [ ] Watch tests fail for missing variant and fields.
- [ ] Implement enum-backed choices, URL validation reuse, page/industry defaults, and one-time success analytics after server success.
- [ ] Re-run focused inquiry and analytics tests; expect PASS.

### Task 4: Discovery, sitemap, and related-service boundaries

**Files:**
- Modify: `content/service-menu.json`
- Modify: `components/BusinessFooter.tsx`
- Modify: `index.html`
- Modify: `app/website/page.tsx`
- Modify: `app/geo-website/page.tsx`
- Modify: `app/ai-search-optimization/page.tsx`
- Modify: `scripts/generate-purpose-landings.mjs`
- Modify: `app/sitemap.ts`
- Modify: `scripts/generate-llms.mts`
- Modify: `lib/analytics.ts`
- Create: `scripts/seo-website-discovery.test.mts`

**Interfaces:**
- Consumes Task 1 canonical list.
- Produces header/home/footer/context links, six sitemap entries, and LLM index entries.

- [ ] Write tests that run against the real data sources and fail when the new service is absent or a protected old path is removed.
- [ ] Add concise role-separating links and sitemap/LLM records with git-derived lastmod.
- [ ] Run focused discovery tests, menu verifier, sitemap verifier, and Naver index protection.

### Task 5: Build-artifact QA and required documentation

**Files:**
- Create: `scripts/check-seo-website.mjs`
- Create: `scripts/check-seo-website.test.mts`
- Modify: `package.json`
- Create/update: `docs/seo-website/*.md` and `*.csv`

**Interfaces:**
- Consumes `out/` from the project build.
- Produces a JSON/console report covering status, title, H1, canonical, robots, initial HTML, internal links, JSON-LD and sitemap inclusion.

- [ ] Write a fixture test where canonical, form schema, link, or sitemap membership is broken; expect the checker to fail each mutation.
- [ ] Implement the checker and `seo:verify:seo-website` command.
- [ ] Build, run the checker, full test suite, typecheck, existing SEO gates, and record exact evidence in `qa-report.md`.
- [ ] Generate the full keyword map, page manifest, measurement, search registration, and handover documents from observed facts only.

### Task 6: Browser QA, deploy, operating smoke, and search registration

**Files:**
- Update: `docs/seo-website/qa-report.md`
- Update: `docs/seo-website/search-registration.md`
- Update: `docs/seo-website/handover.md`

**Interfaces:**
- Consumes a green build and deploy URL.
- Produces viewport/accessibility/form evidence, deploy identifier, operating HTTP evidence, and separate Google/Naver states.

- [ ] Deploy a preview, test 360/390/768/1280/1440 layouts, keyboard/FAQ/form error states, 404, and console/network errors.
- [ ] If no P0 defect exists, commit/push according to the existing branch policy and deploy production.
- [ ] Verify production URLs, sitemap, canonical, verification assets, and existing core pages independently from local results.
- [ ] Prepare one clearly marked non-PII form test; perform the actual submission only under the applicable confirmation rule and record server/final-receipt levels separately.
- [ ] In authenticated official consoles, verify the existing property/site, sitemap state and representative URL; submit only deployed canonical URLs and mark external processing as pending rather than indexed.
