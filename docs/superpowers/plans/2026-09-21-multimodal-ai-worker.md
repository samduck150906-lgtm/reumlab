# Multimodal AI Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/ai-worker/multimodal/` as a production-ready child service of the existing AI Worker hub, with truthful multimodal product content, accessible interaction, complete search metadata, existing-form conversion tracking, regression verification, and Netlify deployment.

**Architecture:** Keep canonical content and index decisions in a pure data module, render the page as a Server Component, and isolate the only stateful interaction in a small client selector. Integrate through the existing AI Worker parent, shared JSON-LD, shared inquiry form, analytics classifier, sitemap, content cluster, llms generator, and verification scripts.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, CSS Modules, Node test runner, Netlify static export and Forms.

**Spec:** `docs/superpowers/specs/2026-09-21-multimodal-ai-worker-design.md`

## Global Constraints

- Preserve `/ai-worker/` and all existing role URLs, metadata, canonical tags, schema, and indexability.
- Use `/ai-worker/multimodal/` with one H1 and a self canonical.
- Do not add dependencies, invented prices, customer claims, accuracy claims, ranking promises, review/rating markup, or a second Organization entity.
- Core content must remain readable without JavaScript; only the industry example selector may require hydration.
- API is preferred; Computer Use is conditional and must name its CAPTCHA/MFA/VDI/network/UI-change limits.
- High-risk actions remain human-approved or HUMAN_ONLY as defined in the design.
- Reuse `main-apply`; preserve once-only `inquiry_form_start` and server-success-only `generate_lead` behavior.
- Do not modify or discard the unrelated dirty files in the original checkout.

## Review Focus

- JavaScript disabled: the core flow, all ten products, safety limitations, FAQs, and inquiry route remain understandable.
- Unknown industry selector value: resolve to the B2B default instead of rendering empty or leaking a previous selection.
- 320px viewport: no horizontal overflow, clipped CTA, or unusable selector target.
- Analytics: nested `/ai-worker/multimodal/` remains `service/ai`, while no form-entered content is added to `dataLayer`.
- Search integration: page, sitemap, llms, breadcrumb, and parent link all use the exact same trailing-slash canonical.

---

### Task 1: Canonical multimodal content model

**Files:**
- Create: `lib/multimodal-ai-worker.ts`
- Create: `scripts/multimodal-ai-worker.test.mts`

**Interfaces:**
- Consumes: `SITE` and `decideFromContent()` from existing SEO/index-quality modules.
- Produces: `MULTIMODAL_PATH`, `MULTIMODAL_CANONICAL`, metadata constants, `MULTIMODAL_PRODUCTS`, `MULTIMODAL_INDUSTRIES`, `MULTIMODAL_FAQS`, `getMultimodalIndustry(id)`, and `multimodalDecision()`.

- [ ] **Step 1: Write the failing data-contract tests**

  Assert the exact canonical, ten unique product IDs, ten unique industry IDs, ten direct-answer FAQs, safe default industry fallback, required permission levels, and absence of forbidden guarantee/customer language.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `node --import tsx --test scripts/multimodal-ai-worker.test.mts`

  Expected: FAIL because `lib/multimodal-ai-worker.ts` does not exist.

- [ ] **Step 3: Implement the minimal pure data module**

  Add the approved hero/entity copy, static flow, engine stages, ten product definitions, ten industry examples, permissions, safety/privacy guidance, FAQs, related links, and index-quality evidence/limitations.

- [ ] **Step 4: Run focused and full tests and verify GREEN**

  Run: `node --import tsx --test scripts/multimodal-ai-worker.test.mts`

  Run: `npm test`

  Expected: all tests pass.

- [ ] **Step 5: Commit the content model**

  Commit: `feat(ai-worker): define multimodal service content`

### Task 2: Accessible selector and production page

**Files:**
- Create: `app/ai-worker/multimodal/MultimodalIndustrySelector.tsx`
- Create: `app/ai-worker/multimodal/page.tsx`
- Create: `app/ai-worker/multimodal/multimodal-ai-worker.module.css`
- Create: `scripts/multimodal-page-source.test.mts`

**Interfaces:**
- Consumes: all Task 1 exports, `IndustryServiceJsonLd`, `SiteLink`, `LandingInquiryForm`, and `BusinessFooter`.
- Produces: server-rendered route `/ai-worker/multimodal/` and one client selector accepting `industries` plus `defaultIndustryId`.

- [ ] **Step 1: Write failing source-contract tests**

  Assert that the route files exist and contain the approved H1, canonical metadata, `IndustryServiceJsonLd`, one labelled `Interactive Example`, `aria-pressed`, an `aria-live` result, the shared inquiry form, and CSS rules for 320px wrapping plus reduced motion.

- [ ] **Step 2: Run the source test and verify RED**

  Run: `node --import tsx --test scripts/multimodal-page-source.test.mts`

  Expected: FAIL because the route files do not exist.

- [ ] **Step 3: Implement the page and selector**

  Render the hero, quotable definition, semantic core flow, engine, ten product cards, selector/demo, connection/permission guidance, privacy/security, commercial model, FAQs, related links, and inquiry form. Use existing brand variables, restrained contrast, and responsive CSS without images or new dependencies.

- [ ] **Step 4: Run focused tests, typecheck, and full tests**

  Run: `node --import tsx --test scripts/multimodal-page-source.test.mts`

  Run: `npm run typecheck`

  Run: `npm test`

  Expected: all commands exit 0.

- [ ] **Step 5: Commit the page**

  Commit: `feat(ai-worker): add multimodal service page`

### Task 3: Conversion and analytics integration

**Files:**
- Modify: `lib/analytics.ts`
- Modify: `scripts/analytics.test.mts`
- Modify: `components/LandingInquiryForm.tsx`
- Create: `scripts/multimodal-inquiry.test.mts`

**Interfaces:**
- Consumes: the existing `PageType`, `ServiceKey`, `LandingInquiryForm` variant contract, and `main-apply` field set.
- Produces: `/ai-worker/*` → `page_type=service`, `service=ai`, and a `multimodal-ai-worker` form variant with exact landing and inquiry labels.

- [ ] **Step 1: Add failing route and form-variant tests**

  Add assertions for `/ai-worker/`, `/ai-worker/multimodal/`, query/hash variants, exact hidden landing path, exact inquiry service label, and the continued absence of new sensitive analytics parameters.

- [ ] **Step 2: Run both focused tests and verify RED**

  Run: `node --import tsx --test scripts/analytics.test.mts scripts/multimodal-inquiry.test.mts`

  Expected: FAIL because `ai-worker` and the new form variant are not mapped.

- [ ] **Step 3: Implement the narrow mappings**

  Add `ai-worker: 'ai'`, add the new form variant, landing path, inquiry label, feature label, and placeholder. Do not change form submission or event timing.

- [ ] **Step 4: Run focused and full tests and verify GREEN**

  Run: `node --import tsx --test scripts/analytics.test.mts scripts/multimodal-inquiry.test.mts`

  Run: `npm test`

  Expected: all tests pass.

- [ ] **Step 5: Commit the integration**

  Commit: `feat(analytics): classify multimodal AI worker leads`

### Task 4: Parent, sitemap, llms, and internal-link integration

**Files:**
- Modify: `lib/ai-worker.ts`
- Modify: `app/ai-worker/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `lib/content-cluster.ts`
- Modify: `scripts/generate-llms.mts`
- Modify: `content/service-menu.json` only if verification proves the parent label cannot expose the child without it
- Create: `scripts/verify-multimodal-ai-worker.mjs`
- Create: `scripts/verify-multimodal-ai-worker.test.mts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `multimodalDecision()` and canonical exports from Task 1.
- Produces: parent inbound card, exact child sitemap entry, guide cluster, llms summary, and `seo:verify:multimodal-ai-worker`.

- [ ] **Step 1: Write the failing integration test**

  Assert one parent link, one sitemap integration guarded by `multimodalDecision().inSitemap`, one child content cluster, one llms entry, one package script, and no changes to the three existing role slugs.

- [ ] **Step 2: Run the integration test and verify RED**

  Run: `node --import tsx --test scripts/verify-multimodal-ai-worker.test.mts`

  Expected: FAIL because no integration exists.

- [ ] **Step 3: Implement narrow integrations**

  Add the child card and update parent count language, add sitemap/cluster/llms wiring, and add a build-output verifier for metadata, schema, content counts, internal links, and indexability.

- [ ] **Step 4: Run focused, full, and static checks**

  Run: `node --import tsx --test scripts/verify-multimodal-ai-worker.test.mts`

  Run: `npm test`

  Run: `npm run typecheck`

  Expected: all commands exit 0.

- [ ] **Step 5: Commit search integration**

  Commit: `feat(seo): connect multimodal AI worker entity`

### Task 5: Production build and regression QA

**Files:**
- Modify only files required by demonstrated failures.
- Verify: `out/ai-worker/multimodal/index.html`, `out/ai-worker/index.html`, `out/sitemap.xml`, `out/llms.txt`, and existing priority pages.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: a tested static `out/` artifact and evidence-backed QA record.

- [ ] **Step 1: Run the production build**

  Run: `npm run build`

  Expected: exit 0 with the new route exported.

- [ ] **Step 2: Run focused build-output verification**

  Run: `npm run seo:verify:multimodal-ai-worker`

  Expected: PASS for route, H1, title, description, canonical, robots, OG, JSON-LD, parent/child links, selector fallback, products, FAQs, sitemap, and llms.

- [ ] **Step 3: Run the complete relevant verification matrix**

  Run: `npm test`

  Run: `npm run typecheck`

  Run: `npm run seo:verify`

  Run: `npm run seo:verify:services`

  Run: `npm run seo:verify:faq`

  Run: `npm run seo:verify:content`

  Run: `npm run seo:verify:conversion`

  Run: `npm run seo:verify:naver`

  Run: `npm run geo:check-entities`

  Run: `npm run seo:qa`

  Expected: all applicable commands exit 0; skipped or unavailable checks are reported as NOT VERIFIED rather than PASS.

- [ ] **Step 4: Inspect the generated regression targets**

  Compare the parent/home metadata, canonical, Organization/WebSite IDs, robots, sitemap inclusion, llms entries, and shared form fields before and after. Record any unrelated generator churn without committing it.

- [ ] **Step 5: Commit verified fixes if the build exposed any**

  Commit: `fix(ai-worker): resolve multimodal QA findings`

### Task 6: Preview, responsive review, and production deploy

**Files:**
- No source changes unless a verified preview defect requires a RED→GREEN fix.

**Interfaces:**
- Consumes: the verified `out/` artifact from Task 5.
- Produces: Netlify preview evidence, production deployment URL, and post-deploy status.

- [ ] **Step 1: Verify Netlify authentication and site link**

  Run: `npx netlify status`

  Expected: authenticated and linked to the existing ReumLab site.

- [ ] **Step 2: Deploy the verified artifact as a preview without rebuilding**

  Run: `npx netlify deploy --dir=out --message "Multimodal AI Worker preview"`

  Expected: a unique preview URL.

- [ ] **Step 3: Review preview behavior**

  Verify `/ai-worker/multimodal/`, `/ai-worker/`, `/`, `/geo-website/`, and `/mvp/`; check 320/375/430/768/1024/1440 widths, keyboard selector, focus visibility, no horizontal overflow, no console/hydration error, working CTAs, canonical/schema, and a form start without sending a test lead.

- [ ] **Step 4: Deploy the same artifact to production**

  Run: `npx netlify deploy --prod --dir=out --message "Ship Multimodal AI Worker"`

  Expected: production URL `https://reumlab.com` and a successful deploy record.

- [ ] **Step 5: Verify production and search notification status**

  Confirm the production URL returns the expected page and metadata, record the already accepted Google/Naver `/ai-worker/` requests separately, and run the existing IndexNow path only if the production safety gate detects this new URL as a bounded change.

- [ ] **Step 6: Commit the final QA record**

  Commit: `docs(ai-worker): record multimodal release verification`
