# Enternal AI Product Page Design

## Objective

Add one production product-and-PoC page at `/enternal-ai/` for **Enternal AI by ReumLab**. The page must introduce ReumLab's Private AI direction for connecting enterprise data and AI inside a customer-controlled environment, generate qualified PoC inquiries, and remain precise about the current product stage. It must not imply that a finished proprietary foundation model, guaranteed on-premises deployment, or verified customer outcome already exists.

The work includes the page, official supplied logo integration, internal discovery, search/AI-readable metadata, inquiry and analytics context, automated checks, preview verification, production deployment, and bounded search-engine submission. Existing URLs and their search intent remain intact.

## Current-system findings

- The production source is a Next.js 14 App Router site with static export, Netlify deployment, and the shared Netlify `main-apply` form.
- Existing AI-facing routes already divide intent across `/enterprise-ai/`, `/ai-worker/`, `/ai-worker/multimodal/`, `/ai-voice-development/`, and `/ai-search-optimization/`.
- `/enterprise-ai/` currently represents a practical RAG and enterprise knowledge-search implementation service. Its source permits commercial API model configurations and does not verify on-premises or closed-network delivery.
- `/ai-worker/` represents task-executing agents. Enternal AI therefore needs a separate role rather than replacing either existing service.
- Global `WebSite`, `Organization`, and business entities are emitted by the site layout. The new route must reference the established entity identifiers rather than duplicate those entities.
- The shared inquiry flow emits `generate_lead` only after a successful server response. Existing analytics classify pages through explicit route mapping and must be extended narrowly.
- Sitemap, content-cluster, llms, index-quality, and search-submission behavior are controlled by repository generators and verification scripts rather than hand-edited production artifacts alone.
- The supplied package includes a wide, white-background Enternal AI logo and a product brief. The logo is an identity asset, not evidence that the product has reached general availability.
- Implementation uses a clean worktree based on `origin/main`; unrelated changes in the original checkout and earlier worktrees are not touched.

## Product truth and positioning

The canonical definition is:

> Enternal AI는 기업 내부 환경에서 업무 데이터와 AI를 연결하기 위해 ReumLab이 개발하는 Private AI 제품입니다. 자체 사전학습 기반과 로컬 추론 구조를 목표로 하며, 현재는 기업별 PoC를 통해 적용 범위와 성능을 검증합니다.

The page separates three concepts:

- **Current offer:** enterprise environment discovery, data-scope definition, architecture design, and a bounded PoC.
- **Target architecture:** customer-controlled data paths, local or private inference options, and enterprise-specific AI capabilities.
- **Long-term product direction:** reducing dependence on external generative-AI APIs and developing a proprietary pretraining foundation.

Target architecture and long-term direction are always labelled as such. The page uses conditional language such as `고객 환경과 선택 모델에 따라 달라집니다`, `PoC에서 검증합니다`, and `목표 구조입니다` wherever deployment path, model ownership, data movement, or performance could otherwise be read as a present guarantee.

The following claims are prohibited unless later evidence is supplied and approved:

- Data never leaves the customer environment.
- A finished proprietary LLM or general-availability local model is already supplied.
- Security is complete, absolute, certified, or guaranteed.
- Fixed performance, accuracy, savings, ranking, delivery-time, or price claims.
- Invented customers, partners, certifications, awards, benchmarks, reviews, or case studies.
- The implication that every existing ReumLab enterprise-AI engagement is local or private AI.

## Information architecture

- Canonical: `https://reumlab.com/enternal-ai/`
- Breadcrumb: Home → Enternal AI
- Brand relationship: `Enternal AI by ReumLab`
- `/enterprise-ai/` remains the current RAG and enterprise knowledge-search implementation service.
- `/ai-worker/` remains the work-executing AI agent service.
- `/enternal-ai/` is the Private AI product direction and enterprise PoC entry point.
- `/enterprise-ai/` and `/ai-worker/` each gain one contextual link to Enternal AI. The Enternal page links back with a plain-language comparison so users can choose the correct service without intent collision.
- Do not create `/ai/enternal/`, `/enterprise-ai/enternal/`, or alternate trailing-slash variants as indexable pages. Any unavoidable legacy alias must be a single-hop permanent redirect to the canonical.

## Page structure and copy contract

1. **Hero** — product logo, `기업의 데이터는 기업 안에. Enternal AI`, supporting line `외부로 보내지 않는, 기업만의 AI를 목표로 개발합니다`, one primary PoC consultation CTA, one architecture CTA, and an immediately visible product-stage note.
2. **Why this product exists** — concrete problems with uncontrolled data paths, external API dependency, generic-model fit, and operational governance. These are risks to evaluate, not assertions that every external service is unsafe.
3. **Target data flow** — semantic, server-rendered flow: employee → Enternal AI → approved enterprise model or local inference layer → internal documents and systems → grounded response. A persistent label identifies this as a target structure whose final path is validated in the PoC.
4. **Capabilities** — internal knowledge search, document interpretation, draft/report assistance, controlled workflow support, and organization-specific adaptation. Each capability states its required data, expected output, and human boundary.
5. **Architecture comparison** — neutral comparison between a general external-API implementation and the Enternal target architecture across data path, model operation, customization, deployment, governance, and adoption method. The comparison must not disparage third-party services or claim superiority without measured evidence.
6. **Engagement process** — environment discovery → data and permission scope → PoC design → measured validation → adoption decision → optional expansion. Production adoption is not presented as automatic after PoC.
7. **Use scenarios** — manufacturing, education, professional services, and internal operations. Scenarios are labelled examples, not customer cases.
8. **Technology direction** — local/private inference, organization-specific evaluation, auditable retrieval, and proprietary pretraining research. Present capability, PoC scope, and research direction use visibly distinct labels.
9. **FAQ** — at least eight direct-answer questions covering product stage, external transmission, local operation, proprietary models, usable data, security responsibilities, performance validation, delivery range, cost, and relationship to existing ReumLab services.
10. **Final CTA and inquiry** — `기업 환경 진단 및 PoC 상담` with a short expectation-setting note and the shared Netlify form.

All important answers are present in server-rendered text. Visual headings and short summaries must remain quotable without surrounding marketing copy.

## Visual and interaction design

- Reuse the production header, footer, type system, focus treatment, and shared form so the page remains recognizably ReumLab.
- Use the supplied Enternal AI logo in its original aspect ratio, with explicit intrinsic dimensions. Its white background is placed on a deliberate white brand panel rather than blended into an artificial transparent mark.
- Page palette: white and deep navy foundations, restrained teal accents, and accessible neutral text. Avoid neon, glassmorphism, generic robot imagery, decorative dashboards, and fake product screenshots.
- The primary visual is a semantic data-flow diagram built with HTML and CSS or repository-native SVG, not a raster mockup that could be mistaken for a working interface.
- Present `현재 제공`, `PoC 검증`, and `개발 방향` as consistent status badges with text labels; color is never the only distinction.
- Keep the route server-first. Add no client component unless an interaction materially improves comprehension and still has a complete no-JavaScript fallback.
- Avoid autoplay, scroll-jacking, large background video, remote font dependency, and animation required to read content.

## Responsive and accessibility behavior

- No horizontal overflow at 320, 360, 375, 430, 768, 1024, 1440, or 1920 CSS pixels.
- The data flow changes from a horizontal sequence to a vertical reading order on narrow viewports.
- The architecture comparison changes to labelled comparison cards on mobile instead of shrinking a wide table.
- CTA and control targets meet practical touch sizing, maintain visible keyboard focus, and do not obscure content through a persistent overlay.
- Heading order, landmark structure, link names, contrast, alternative text, and form error relationships are programmatically meaningful.
- Decorative graphics are hidden from assistive technology; the full meaning of diagrams is also supplied as adjacent text.
- Motion is subtle and disabled by `prefers-reduced-motion`.
- Images reserve layout space and lazy-load only when they are below the fold. The hero logo must not become the largest unoptimized payload.

## Components and data boundaries

- `lib/enternal-ai.ts`: metadata constants, canonical product definition, status labels, capabilities, comparison data, process, scenarios, technology directions, FAQs, and index-quality decision. No UI state or personal data.
- `app/enternal-ai/page.tsx`: metadata, JSON-LD, semantic server-rendered page, internal links, and shared form.
- `app/enternal-ai/enternal-ai.module.css`: route-scoped responsive styling using established tokens.
- `public/enternal-ai/`: supplied identity asset copied without reinterpreting the brand. Any deterministic compression must preserve appearance and dimensions and must be visually checked.
- Existing shared modules receive only narrow changes: inquiry variant, analytics route map, source-of-truth content cluster, sitemap/llms generation, internal-link placements, and verification registration.
- Generated files are changed through their existing source/generator workflow. Do not hand-edit a generated output when a source file exists.

## SEO, AEO, GEO, and NEO

- Exactly one self-canonical and one H1.
- Metadata title and description use the product name plus verifiable category language such as `기업용 Private AI` and `사내 AI PoC`; they do not claim finished on-premises availability.
- Open Graph and Twitter metadata match the same stage-aware message.
- Structured data uses `WebPage`, `Service`, `BreadcrumbList`, and `FAQPage`, referencing the existing Organization identifier. Do not emit a new Organization node.
- Do not use `SoftwareApplication` until the repository has evidence that a usable product is available rather than a development and PoC engagement.
- Add the URL to the sitemap only if the existing index-quality gate passes. Add one concise, factual llms entry and relevant content-cluster relationships without asserting AI citation or ranking benefits.
- FAQ screen text and `FAQPage` answers share the same source so they cannot diverge.
- Internal links use the repository's approved link component and human-readable anchor text. The page must not depend on sitemap discovery alone.
- Search registration records distinguish `submitted`, `discovered`, and `indexed`; a successful submission is never reported as completed indexing.

## Inquiry and analytics flow

- Add an `enternal-ai` shared-form variant rather than creating a second form implementation.
- Exact landing path: `/enternal-ai/`.
- Inquiry context label: `Enternal AI 기업 도입·PoC`.
- Service classification remains within the existing AI service taxonomy unless the current form contract requires a new enumerated value.
- Preserve every existing `main-apply` field, honeypot, consent control, first-landing attribution, channel, and UTM value.
- `page_context` runs once per page lifecycle with `page_type=service` and `service=ai`.
- Existing CTA instrumentation emits `cta_click` once per intentional activation.
- `inquiry_form_start` emits once on the first meaningful form interaction.
- `generate_lead` emits once only after a successful form submission response, never merely on button click.
- No prompt, document name, internal system name, form free text, phone number, email, or other user content is sent to GA4, GTM, Sentry, or similar telemetry.

## Error handling and release safety

- If the supplied logo is missing or invalid, fail the route verification rather than silently substituting a fabricated brand mark.
- If the form submission fails, retain user-entered values, show a perceivable error, and do not emit `generate_lead`.
- If the route fails the content/index-quality decision, it must not be added to sitemap or search-submission batches.
- IndexNow is limited to the repository's existing production-only gates and bounded URL batch. Preview deploys never submit.
- Manual Google Search Console and Naver Search Advisor requests occur only after production canonical and status verification. The operator rechecks the logged-in account, property, and exact URL immediately before the irreversible request action.
- No search, traffic, lead, ranking, or citation outcome is promised.

## Verification and acceptance criteria

### Automated

- Unit tests are written first for product-data integrity, stage labels, FAQ count and direct-answer form, prohibited-claim checks, analytics classification, and inquiry variant mapping.
- Route verification checks status 200 output, one H1, self-canonical, indexability, title/description, logo dimensions, required stage disclosure, JSON-LD types, FAQ parity, relevant internal links, and absence of duplicate Organization or `SoftwareApplication` schema.
- Integration checks cover sitemap, content cluster, llms outputs, related-service links, Netlify form contract, and search-submission safety.
- Run the full `npm test`, typecheck, production build, route-specific verification, and existing SEO/NEO/AEO gates affected by the change.

### Browser and artifact

- Inspect the preview on desktop and at representative mobile widths, including 360 CSS pixels.
- Check header, footer, logo rendering, focus order, keyboard navigation, text contrast, comparison transformation, data-flow reading order, 404 behavior, and no-JavaScript content availability.
- Exercise the inquiry flow in preview without sending personal data and confirm event cardinality.
- Run mobile Lighthouse or the repository's equivalent performance checks and report measured results as observations, not guarantees.

### Production

- Deploy the exact reviewed commit through the repository's Netlify workflow.
- Verify `/enternal-ai/`, its canonical, sitemap membership, related links, and key existing pages after deployment.
- Submit one clearly labelled test inquiry only if the active production form test is in scope and the test contact details are provided or an approved non-contact test value is accepted; verify the submission in Netlify Forms and remove it only when authorized.
- Confirm IndexNow execution evidence if the production gate runs.
- Request Google and Naver collection for the exact canonical using the authenticated browser sessions, then record only the actual submission state.

## Out of scope

- Training or deploying a proprietary foundation model.
- Building a live inference backend, customer tenant, vector database, authentication system, or admin dashboard.
- Publishing confidential architecture, customer data, benchmarks, or invented product screenshots.
- Rewriting the existing `/enterprise-ai/` or `/ai-worker/` service into the Enternal product.
- Claiming that a search engine has indexed or ranked the page solely because a submission endpoint accepted it.

