# Multimodal AI Worker Design

## Objective

Add one production service page at `/ai-worker/multimodal/` beneath the existing `/ai-worker/` parent. The page must explain and sell a custom B2B AI Worker that can interpret images, video, voice, documents, and text, then act through approved API, ERP, CRM, database, or Computer Use workflows. Existing AI Worker URLs, copy, metadata, structured data, and role pages remain intact.

## Current-system findings

- The production source is Next.js 14 App Router with static export and Netlify Forms.
- `/ai-worker/` and `/ai-worker/{office,sales,document}/` already exist on `origin/main`.
- The parent page's source of truth is `lib/ai-worker.ts`; the sitemap, llms generator, content cluster, analytics classification, and index-quality gate each have their own explicit integrations.
- Global `WebSite`, `Organization`, and business entities are emitted by `app/layout.tsx`; the new page must not duplicate them.
- The shared inquiry flow is `LandingInquiryForm` → Netlify `main-apply`; its successful response is the point at which `generate_lead` is emitted.
- The original checkout contains unrelated generated-file changes and is behind `origin/main`, so implementation uses an isolated worktree based on `origin/main`.

## Information architecture

- Parent: `/ai-worker/`
- Child: `/ai-worker/multimodal/`
- Breadcrumb: Home → AI Worker 구축 → 멀티모달 AI Worker
- Parent gains one contextual card/link for the child. The three existing role pages remain unchanged.
- Child links back to the parent and only to existing relevant services/guides.
- The child is a dedicated static route rather than another entry in the generic `[role]` page because it needs a different content model, an industry selector, a multimodal flow, ten product sections, and privacy/security guidance.

## Page structure

1. Hero with the approved H1, two CTAs, and one quotable entity statement.
2. A semantic, server-rendered core flow: inputs → perception → understanding → AI Worker → approved systems → business outcomes.
3. A shared engine explanation: input → understanding → reasoning → workflow/rules → permission → action → result.
4. Ten product sections with explicit evidence, uncertainty, and human-handoff limits.
5. An accessible industry selector for cleaning, lodging, construction, logistics, academy, hospital, real estate, automotive, franchise, and B2B.
6. A clearly labelled `Interactive Example` that changes only explanatory example content; it must never imply a live customer system or integration.
7. API-first and conditional Computer Use guidance, including CAPTCHA, MFA, VDI, network, security-policy, and UI-change constraints.
8. READ / WRITE / CONFIRM / HUMAN_ONLY permission model and human responsibility boundary.
9. Privacy and security checklist covering minimization, retention/deletion, access control, tenant isolation, encryption, audit, and provider policy.
10. Commercial model without invented prices: build fee + monthly operations/monitoring + usage where needed.
11. Ten direct-answer FAQs.
12. Shared Netlify inquiry form and related links.

## Components and boundaries

- `lib/multimodal-ai-worker.ts`: canonical copy, product data, selector data, FAQs, metadata constants, and the index-quality decision. No UI state.
- `app/ai-worker/multimodal/MultimodalIndustrySelector.tsx`: the only new client component. It changes selected example content and exposes a keyboard-accessible button group plus polite live region.
- `app/ai-worker/multimodal/page.tsx`: server-rendered metadata, JSON-LD, semantic content, internal links, and inquiry form.
- `app/ai-worker/multimodal/multimodal-ai-worker.module.css`: responsive page-only styling, using existing brand tokens and no neon/glass/robot imagery.
- Existing modules receive only narrow integration changes: parent card, analytics route classification, inquiry-form variant copy, sitemap, content cluster, llms generator, and verification scripts.

## SEO, AEO, GEO, and NEO

- Canonical: `https://reumlab.com/ai-worker/multimodal/`
- Title: `멀티모달 AI Worker 개발 | 영상·음성·현장 업무 자동화 | 름랩`
- Description: `영상·사진·음성·문서를 이해하고 검수·견적·상담 분석부터 ERP·CRM 업무까지 연결하는 맞춤형 멀티모달 AI Worker를 구축합니다.`
- Exactly one H1, `index,follow` through the existing index-quality gate, self-canonical, OG/Twitter metadata, `Service`, `FAQPage`, and `BreadcrumbList` via the existing JSON-LD component.
- Reuse the existing organization identifier by reference; do not emit another Organization node.
- Add the URL to the sitemap only when the content-quality decision permits it.
- Add one concise llms entry without claiming ranking impact.
- All important content is server rendered and readable without JavaScript.

## Truth and safety constraints

- Product cards are implementation patterns, not customer case studies.
- No customer, partner, award, review, accuracy, savings, ranking, or performance claim is invented.
- Visual detections are candidates/evidence, not definitive safety, legal, insurance, construction-cost, accident-history, or measurement judgments.
- External send, reservation change, and ERP confirmation require preview, human approval, server revalidation, one-time execution, and audit.
- Refunds, contracts, account deletion, permission changes, and destructive actions are HUMAN_ONLY.

## Analytics and inquiry flow

- `/ai-worker/*` is classified as `page_type=service` and `service=ai`.
- CTA anchors preserve the existing `cta_click` instrumentation.
- The shared form receives a new non-PII variant that records the exact landing path and inquiry service label.
- `inquiry_form_start` fires once on first interaction; `generate_lead` remains server-success-only and once per successful form lifecycle.
- No image, voice, document, address, phone number, or user-entered content is sent to analytics.

## Responsive and accessibility behavior

- Core layout must not overflow at 320, 375, 430, 768, 1024, 1440, or 1920 CSS pixels.
- Selector buttons use native buttons, visible focus, `aria-pressed`, and a labelled region. Updated example content uses `aria-live="polite"`.
- Flow and tables wrap into stacked cards on narrow screens; no forced wide table is required for the new page.
- Motion is optional, subtle, and removed for `prefers-reduced-motion`.
- Lighthouse targets are goals, not claims; only measured results may be reported.

## Verification and release

- Unit tests cover data integrity, ten product/industry/FAQ counts, truthful copy rules, route classification, and inquiry variant mapping.
- Static verification covers H1, canonical, meta description, JSON-LD types, parent/child links, selector fallback content, demo label, sitemap, and llms entry.
- Run the full test suite, typecheck, production build, SEO/NEO verification commands, and preview deploy before production deploy.
- Verify the preview at desktop and mobile widths, then deploy the same tested `out/` artifact to production.
- IndexNow may run only through the existing production safety gates. Google and Naver manual requests are recorded separately from index completion.
