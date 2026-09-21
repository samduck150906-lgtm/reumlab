# Enternal AI Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a truthful, responsive `/enternal-ai/` product-and-PoC page, connect it to ReumLab's discovery and lead systems, deploy the tested commit to Netlify, and request collection from Google and Naver without claiming completed indexing.

**Architecture:** Keep approved copy and indexability in one server-safe `lib/enternal-ai.ts` module, render the route as a static server component with route-scoped CSS, and reuse the site's schema, link, footer, analytics, and Netlify form primitives. Integrate the canonical through explicit sitemap, llms, content-cluster, analytics, inquiry, and related-link maps, then guard the full contract with unit, server-render, and built-artifact tests.

**Tech Stack:** Next.js 14 App Router, React 18 server rendering, TypeScript 5, CSS Modules, Node test runner with `tsx`, Netlify static export and Forms, JSON-LD, GA4/GTM dataLayer, IndexNow safety gates.

**Spec:** `docs/superpowers/specs/2026-09-21-enternal-ai-design.md`

## Global Constraints

- Canonical is exactly `https://reumlab.com/enternal-ai/`; do not create another indexable Enternal route.
- Product stage is development direction plus customer-specific PoC validation, not a generally available proprietary model.
- Preserve `/enterprise-ai/` as the current RAG and enterprise knowledge-search implementation service and `/ai-worker/` as the task-executing agent service.
- Never claim absolute non-transmission, complete security, finished proprietary LLM availability, fixed performance, verified customers, fixed price, or fixed delivery time.
- Use the supplied Enternal AI logo without inventing a replacement or altering its visual identity.
- Reuse existing global Organization and WebSite identifiers; page schema is `WebPage`, `Service`, `BreadcrumbList`, and `FAQPage`, never `SoftwareApplication`.
- Keep key content server-rendered and understandable without JavaScript.
- Keep the existing Netlify `main-apply` field contract, honeypot, first-landing attribution, channel, and UTM persistence.
- Analytics must emit no prompt, form free text, internal document name, contact detail, or other personal or customer content.
- `page_context`, `cta_click`, and `inquiry_form_start` occur once per intended lifecycle; `generate_lead` remains once-only and server-success-only.
- Generated files are updated through existing generators. Preview deploys never submit IndexNow.
- Submission acceptance is recorded as submitted, not indexed or ranked.

## Review Focus

- Product-stage drift: copy that moves a target architecture into present-tense availability must fail `scripts/enternal-ai.test.mts` prohibited-claim and status-label checks.
- Schema/content drift: a FAQ not rendered from `ENTERNAL_FAQS`, a duplicate Organization, or `SoftwareApplication` must fail `scripts/enternal-ai-page-source.test.mts` or the built-artifact verifier.
- Attribution drift with query/hash URLs: `/enternal-ai/?utm_source=naver#inquiry` must still classify as `page_type=service`, `service=ai`, and render the canonical landing value in inquiry tests.
- Missing or substituted identity asset: the built-artifact verifier must fail when `out/enternal-ai/enternal-ai-logo.png` is absent or its PNG intrinsic size is not 2172×724.
- Narrow-screen comparison overflow: page markup must use responsive comparison cards rather than a fixed-width table, and browser QA must pass at 320 and 360 CSS pixels without horizontal overflow.

---

## File Structure

- Create `lib/enternal-ai.ts`: copy, typed product data, canonical constants, and index-quality decision.
- Create `app/enternal-ai/page.tsx`: metadata, schema, semantic route markup, internal links, and inquiry form.
- Create `app/enternal-ai/enternal-ai.module.css`: all page-only responsive and accessible visual rules.
- Create `public/enternal-ai/enternal-ai-logo.png`: supplied 2172×724 brand asset.
- Create `scripts/enternal-ai.test.mts`: product-data and truthfulness tests.
- Create `scripts/enternal-ai-inquiry.test.mts`: shared-form variant contract tests.
- Create `scripts/enternal-ai-page-source.test.mts`: server-rendered route and schema tests.
- Create `scripts/verify-enternal-ai.mjs`: built-artifact verification.
- Create `scripts/verify-enternal-ai.test.mts`: sitemap, llms, parent-link, logo, and verifier fixture tests.
- Modify `components/LandingInquiryForm.tsx`: add the `enternal-ai` variant mapping only.
- Modify `lib/analytics.ts` and `scripts/analytics.test.mts`: classify the new first path segment as AI service.
- Modify `lib/content-cluster.ts`: map decision guides for the route.
- Modify `lib/llms-service-pages.ts` and `scripts/generate-llms.mts`: publish one stage-aware Enternal entry.
- Modify `lib/enterprise-ai.ts` and `lib/ai-worker.ts`: add one contextual Enternal related-service link to each existing service.
- Modify `app/sitemap.ts`: add the canonical behind `enternalAiDecision().inSitemap`.
- Modify `package.json`: register the verifier and run it in production builds.
- Regenerate `content/content-cluster.json` through `npm run prebuild` or the existing extractor; do not edit it manually.

### Task 1: Product content model and index-quality contract

**Files:**
- Create: `lib/enternal-ai.ts`
- Create: `scripts/enternal-ai.test.mts`

**Interfaces:**
- Consumes: `decideFromContent(input: ContentQualityInput): IndexDecision` from `lib/index-quality.ts`.
- Produces: canonical metadata constants, typed arrays used by page/schema/tests, and `enternalAiDecision(): IndexDecision`.

- [ ] **Step 1: Write failing product-contract tests**

Create `scripts/enternal-ai.test.mts` with these assertions:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ENTERNAL_CANONICAL,
  ENTERNAL_ENTITY_STATEMENT,
  ENTERNAL_STATUSES,
  ENTERNAL_FLOW,
  ENTERNAL_CAPABILITIES,
  ENTERNAL_COMPARISON,
  ENTERNAL_PROCESS,
  ENTERNAL_SCENARIOS,
  ENTERNAL_TECH_DIRECTIONS,
  ENTERNAL_FAQS,
  enternalAiDecision,
} from '../lib/enternal-ai';

test('Enternal AI는 단일 self-canonical과 색인 가능한 독립 답변을 제공한다', () => {
  assert.equal(ENTERNAL_CANONICAL, 'https://reumlab.com/enternal-ai/');
  assert.match(ENTERNAL_ENTITY_STATEMENT, /개발하는 Private AI 제품/);
  assert.match(ENTERNAL_ENTITY_STATEMENT, /PoC를 통해 적용 범위와 성능을 검증/);
  const decision = enternalAiDecision();
  assert.equal(decision.shouldIndex, true, decision.reasons.join(', '));
  assert.equal(decision.inSitemap, true, decision.reasons.join(', '));
});

test('현재 제공·PoC 검증·개발 방향이 서로 다른 상태로 고정된다', () => {
  assert.deepEqual(ENTERNAL_STATUSES.map((item) => item.id), ['available', 'poc', 'direction']);
  assert.deepEqual(ENTERNAL_FLOW.map((item) => item.id), ['employee', 'enternal', 'model', 'knowledge', 'answer']);
});

test('페이지 섹션 데이터는 중복 없는 완결된 항목을 제공한다', () => {
  for (const list of [ENTERNAL_CAPABILITIES, ENTERNAL_COMPARISON, ENTERNAL_PROCESS, ENTERNAL_SCENARIOS, ENTERNAL_TECH_DIRECTIONS]) {
    assert.ok(list.length >= 4);
    assert.equal(new Set(list.map((item) => item.id)).size, list.length);
  }
});

test('FAQ는 10개 직접 답변이며 제품 단계와 데이터 경로 한계를 포함한다', () => {
  assert.equal(ENTERNAL_FAQS.length, 10);
  const joined = ENTERNAL_FAQS.map((item) => `${item.q} ${item.a}`).join(' ');
  assert.match(joined, /자체 모델/);
  assert.match(joined, /외부/);
  assert.match(joined, /PoC/);
  for (const faq of ENTERNAL_FAQS) {
    const first = faq.a.split(/[.!?]/)[0].trim();
    assert.ok(first.length >= 8 && first.length <= 120, `${faq.q}: ${first}`);
    assert.doesNotMatch(first, /^(경우에 따라|상황에 따라|아마|보통은)/, faq.q);
  }
});

test('공개 문구는 완성·절대 보안·성과를 보장하지 않는다', () => {
  const copy = JSON.stringify({
    entity: ENTERNAL_ENTITY_STATEMENT,
    statuses: ENTERNAL_STATUSES,
    capabilities: ENTERNAL_CAPABILITIES,
    comparison: ENTERNAL_COMPARISON,
    scenarios: ENTERNAL_SCENARIOS,
    technology: ENTERNAL_TECH_DIRECTIONS,
    faqs: ENTERNAL_FAQS,
  });
  for (const forbidden of ['데이터가 절대 외부로', '완벽한 보안', '100% 안전', '완성된 자체 LLM', '정확도 보장', '비용 절감 보장', '실제 고객사']) {
    assert.equal(copy.includes(forbidden), false, `금지 표현: ${forbidden}`);
  }
});
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run: `node --import tsx --test scripts/enternal-ai.test.mts`

Expected: FAIL with `Cannot find module '../lib/enternal-ai'`.

- [ ] **Step 3: Implement the typed source of truth**

Create `lib/enternal-ai.ts` with these exact top-level constants:

```ts
import { decideFromContent, type IndexDecision } from './index-quality';

export const ENTERNAL_CANONICAL = 'https://reumlab.com/enternal-ai/';
export const ENTERNAL_TITLE = 'Enternal AI | 기업용 Private AI·사내 AI PoC | 름랩';
export const ENTERNAL_DESCRIPTION = '기업 데이터를 고객 환경 안에서 활용하는 Private AI를 목표로 개발합니다. 로컬 추론·사내 문서 연결·자체 사전학습 기반의 적용 범위를 기업별 PoC로 검증합니다.';
export const ENTERNAL_H1 = '기업의 데이터는 기업 안에. Enternal AI';
export const ENTERNAL_LEAD = '외부로 보내지 않는, 기업만의 AI를 목표로 개발합니다.';
export const ENTERNAL_ENTITY_STATEMENT = 'Enternal AI는 기업 내부 환경에서 업무 데이터와 AI를 연결하기 위해 ReumLab이 개발하는 Private AI 제품입니다. 자체 사전학습 기반과 로컬 추론 구조를 목표로 하며, 현재는 기업별 PoC를 통해 적용 범위와 성능을 검증합니다.';
export const ENTERNAL_KEYWORDS = ['Enternal AI', '기업용 AI', 'Private AI', '사내 AI', '로컬 AI', '설치형 AI', 'AI PoC'];

export type EnternalStatusId = 'available' | 'poc' | 'direction';
export interface EnternalStatus { id: EnternalStatusId; label: string; detail: string }
export const ENTERNAL_STATUSES: EnternalStatus[] = [
  { id: 'available', label: '현재 제공', detail: '기업 환경 진단, 데이터·권한 범위 정의와 PoC 설계를 제공합니다.' },
  { id: 'poc', label: 'PoC 검증', detail: '선정한 업무에서 데이터 경로, 답변 품질, 운영 조건과 적용 범위를 측정합니다.' },
  { id: 'direction', label: '개발 방향', detail: '로컬 추론과 자체 사전학습 기반을 목표로 연구·개발합니다.' },
];
```

Define all remaining items as typed arrays with stable `id` fields and the following complete content map:

- `ENTERNAL_PROBLEMS`: `data-path`, `api-dependency`, `generic-fit`, `governance`.
- `ENTERNAL_FLOW`: employee `업무 질문`, enternal `권한·맥락 확인`, model `승인된 모델 또는 로컬 추론`, knowledge `사내 문서·시스템`, answer `근거가 연결된 답변`; every item includes a limitation.
- `ENTERNAL_CAPABILITIES`: knowledge search, document analysis, report drafting, workflow support, organization adaptation; every item includes `status`, `input`, `output`, and `boundary`.
- `ENTERNAL_COMPARISON`: data path, model operation, customization, deployment, governance, adoption; each item has neutral `externalApi` and `enternalTarget` text.
- `ENTERNAL_PROCESS`: discovery, scope, PoC design, measured validation, adoption decision, optional expansion.
- `ENTERNAL_SCENARIOS`: manufacturing, education, professional services, internal operations; each includes `example` and `boundary` and is labelled as an example rather than a customer case.
- `ENTERNAL_TECH_DIRECTIONS`: private inference, organization evaluation, auditable retrieval, proprietary pretraining; each includes a `status` from `EnternalStatusId`.
- `ENTERNAL_RELATED_LINKS`: `/enterprise-ai/`, `/ai-worker/`, `/guide/enterprise-ai-adoption/`, `/guide/rag-development/` with descriptive Korean labels.
- `ENTERNAL_FAQS`: ten direct answers for current product stage, data leaving the company, local operation, proprietary model state, usable data, security responsibilities, performance measurement, engagement process, cost, and relationship to `/enterprise-ai/` and `/ai-worker/`.

End the module with the existing index-quality API:

```ts
export function enternalAiDecision(): IndexDecision {
  return decideFromContent({
    title: ENTERNAL_TITLE,
    description: ENTERNAL_DESCRIPTION,
    h1: ENTERNAL_H1,
    bodyParts: [
      ENTERNAL_LEAD,
      ENTERNAL_ENTITY_STATEMENT,
      ENTERNAL_STATUSES.flatMap((item) => [item.label, item.detail]),
      ENTERNAL_PROBLEMS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_FLOW.flatMap((item) => [item.label, item.detail, item.limit]),
      ENTERNAL_CAPABILITIES.flatMap((item) => [item.title, item.input, item.output, item.boundary]),
      ENTERNAL_COMPARISON.flatMap((item) => [item.item, item.externalApi, item.enternalTarget]),
      ENTERNAL_PROCESS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_SCENARIOS.flatMap((item) => [item.title, item.example, item.boundary]),
      ENTERNAL_TECH_DIRECTIONS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_FAQS.flatMap((item) => [item.q, item.a]),
    ],
    faqQuestions: ENTERNAL_FAQS.map((item) => item.q),
    internalLinks: ENTERNAL_RELATED_LINKS.length + 4,
    hasUniqueMedia: true,
    evidence: {
      firstPartyEvidence: 'partial',
      independentSources: 0,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-21',
      hasOriginalMedia: true,
    },
  });
}
```

- [ ] **Step 4: Run the focused product tests**

Run: `node --import tsx --test scripts/enternal-ai.test.mts`

Expected: 5 tests PASS, 0 failures.

- [ ] **Step 5: Commit the content model**

```powershell
git add -- lib/enternal-ai.ts scripts/enternal-ai.test.mts
git commit -m "feat(enternal-ai): define truthful product content"
```

### Task 2: Inquiry attribution and analytics classification

**Files:**
- Modify: `components/LandingInquiryForm.tsx:65-93`
- Modify: `lib/analytics.ts:42-76`
- Modify: `scripts/analytics.test.mts:36-86,139-142`
- Create: `scripts/enternal-ai-inquiry.test.mts`

**Interfaces:**
- Consumes: existing `LandingInquiryForm` props and shared `pageTypeOf`, `serviceOf`, and `pageContext` functions.
- Produces: accepted form variant `'enternal-ai'`, hidden landing and inquiry labels, and analytics classification `{ page_type: 'service', service: 'ai' }`.

- [ ] **Step 1: Write failing inquiry and analytics tests**

Create `scripts/enternal-ai-inquiry.test.mts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingInquiryForm from '../components/LandingInquiryForm';

(globalThis as unknown as { React: typeof React }).React = React;

test('Enternal AI 문의 변형은 기존 main-apply 계약과 전용 유입 문맥을 렌더한다', () => {
  const html = renderToStaticMarkup(React.createElement(LandingInquiryForm, {
    landingSlug: 'enternal-ai',
    defaultServiceType: 'AI 기능·업무 자동화',
    variant: 'enternal-ai' as never,
  }));
  assert.match(html, /name="main-apply"/);
  assert.match(html, /name="form-name" value="main-apply"/);
  assert.match(html, /name="유입_랜딩" value="\/enternal-ai\/"/);
  assert.match(html, /name="문의서비스" value="Enternal AI 기업 도입·PoC"/);
  assert.match(html, />PoC에서 확인하고 싶은 업무와 데이터 범위<\/label>/);
  assert.match(html, /placeholder="예: 사내 문서 검색, 로컬 추론 가능성, 외부 전송 범위, 검증할 업무"/);
  assert.match(html, /name="bot-field"/);
  assert.match(html, /name="핵심기능"/);
});

test('Enternal 문의 원문은 hidden 분석 파라미터로 복제되지 않는다', () => {
  const html = renderToStaticMarkup(React.createElement(LandingInquiryForm, {
    landingSlug: 'enternal-ai',
    variant: 'enternal-ai' as never,
  }));
  assert.doesNotMatch(html, /name="(이름|이메일|휴대폰번호|핵심기능)"[^>]*type="hidden"/);
});
```

Add these cases to `scripts/analytics.test.mts`:

```ts
assert.equal(pageTypeOf('/enternal-ai/'), 'service');
assert.equal(pageTypeOf('/enternal-ai/?utm_source=naver#inquiry'), 'service');
assert.equal(serviceOf('/enternal-ai/'), 'ai');
assert.equal(serviceOf('/enternal-ai/?utm_source=google#inquiry'), 'ai');
assert.deepEqual(pageContext('/enternal-ai/'), { page_type: 'service', service: 'ai' });
```

- [ ] **Step 2: Verify both focused suites fail for missing mapping**

Run: `node --import tsx --test scripts/enternal-ai-inquiry.test.mts scripts/analytics.test.mts`

Expected: FAIL because the form variant type/mappings and first-segment service map do not contain `enternal-ai`.

- [ ] **Step 3: Add only the required shared-form mappings**

In `components/LandingInquiryForm.tsx`, extend the existing tables:

```ts
type Variant = 'default' | 'geo-website' | 'ai-voice' | 'ai-search-architecture' | 'multimodal-ai-worker' | 'enternal-ai';

// LANDING_PATH
'enternal-ai': '/enternal-ai/',

// INQUIRY_SERVICE
'enternal-ai': 'Enternal AI 기업 도입·PoC',

// FEATURES_LABEL
'enternal-ai': 'PoC에서 확인하고 싶은 업무와 데이터 범위',

// FEATURES_PLACEHOLDER
'enternal-ai': '예: 사내 문서 검색, 로컬 추론 가능성, 외부 전송 범위, 검증할 업무',
```

Do not add Enternal-specific client state, event names, form fields, or PII analytics.

- [ ] **Step 4: Add the service segment classification**

In `SERVICE_BY_FIRST_SEGMENT` in `lib/analytics.ts`, add:

```ts
'enternal-ai': 'ai',
```

- [ ] **Step 5: Run inquiry and analytics tests**

Run: `node --import tsx --test scripts/enternal-ai-inquiry.test.mts scripts/analytics.test.mts`

Expected: all tests PASS, including query/hash classification and existing event-name stability.

- [ ] **Step 6: Commit the form and measurement integration**

```powershell
git add -- components/LandingInquiryForm.tsx lib/analytics.ts scripts/analytics.test.mts scripts/enternal-ai-inquiry.test.mts
git commit -m "feat(enternal-ai): preserve inquiry attribution"
```

### Task 3: Brand asset and server-rendered product route

**Files:**
- Create: `public/enternal-ai/enternal-ai-logo.png`
- Create: `app/enternal-ai/page.tsx`
- Create: `app/enternal-ai/enternal-ai.module.css`
- Create: `scripts/enternal-ai-page-source.test.mts`

**Interfaces:**
- Consumes: all exports from `lib/enternal-ai.ts`, `ServiceWebPageJsonLd`, `LandingInquiryForm`, `SiteLink`, `BusinessFooter`, `robotsFor`, and the established guide resolver.
- Produces: static `/enternal-ai/` HTML with one H1, four schema nodes, responsive card layouts, and the shared inquiry form.

- [ ] **Step 1: Write the failing server-render route test**

Create `scripts/enternal-ai-page-source.test.mts` with the repository's CSS-module test hook:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ENTERNAL_CANONICAL,
  ENTERNAL_ENTITY_STATEMENT,
  ENTERNAL_FAQS,
  ENTERNAL_H1,
} from '../lib/enternal-ai';

(globalThis as unknown as { React: typeof React }).React = React;
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.module.css')) return {
      format: 'module',
      source: "export default new Proxy({}, { get: (_target, property) => String(property) });",
      shortCircuit: true,
    };
    return nextLoad(url, context);
  },
});

const { default: EnternalAiPage, metadata } = await import('../app/enternal-ai/page');

test('Enternal AI 페이지는 self-canonical과 제품 단계를 서버 HTML에 제공한다', () => {
  assert.deepEqual(metadata.alternates, { canonical: ENTERNAL_CANONICAL });
  const html = renderToStaticMarkup(React.createElement(EnternalAiPage));
  assert.match(html, new RegExp(`<h1[^>]*>${ENTERNAL_H1}</h1>`));
  assert.ok(html.includes(ENTERNAL_ENTITY_STATEMENT));
  assert.match(html, /현재 제공/);
  assert.match(html, /PoC 검증/);
  assert.match(html, /개발 방향/);
  assert.match(html, /목표 구조/);
  assert.match(html, /name="유입_랜딩" value="\/enternal-ai\/"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.doesNotMatch(html, /"@type":"SoftwareApplication"/);
  assert.equal((html.match(/"@type":"Organization"/g) || []).length, 0);
  assert.doesNotMatch(html, /<table/i);
  for (const faq of ENTERNAL_FAQS) {
    assert.ok(html.includes(faq.q), faq.q);
    assert.ok(html.includes(faq.a), faq.q);
  }
});
```

- [ ] **Step 2: Run the route test and verify the missing-route failure**

Run: `node --import tsx --test scripts/enternal-ai-page-source.test.mts`

Expected: FAIL with missing `app/enternal-ai/page`.

- [ ] **Step 3: Copy and verify the supplied logo without editing it**

Use the stable attachment ZIP and a temporary extraction directory:

```powershell
$packageDir = Join-Path $env:TEMP ('reumlab-enternal-ai-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $packageDir | Out-Null
Expand-Archive -LiteralPath 'C:\Users\CORI\Downloads\EnternalAI_ReumLab_Codex_Package.zip' -DestinationPath $packageDir
New-Item -ItemType Directory -Force -Path 'public\enternal-ai' | Out-Null
Copy-Item -LiteralPath (Join-Path $packageDir 'enternal-ai-logo.png') -Destination 'public\enternal-ai\enternal-ai-logo.png'
```

Verify before using it:

```powershell
Get-Item 'public\enternal-ai\enternal-ai-logo.png' | Select-Object Length
```

Expected: 718833 bytes. Visual inspection must show the supplied horizontal `Enternal AI / ENTERPRISE AI` mark on white, not a generated substitute.

- [ ] **Step 4: Implement metadata, schema, and semantic page markup**

Create `app/enternal-ai/page.tsx` using this outer contract:

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { robotsFor } from '@/lib/index-quality';
import { SITE } from '@/lib/seo';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import * as E from '@/lib/enternal-ai';
import styles from './enternal-ai.module.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: E.ENTERNAL_TITLE },
  description: E.ENTERNAL_DESCRIPTION,
  keywords: E.ENTERNAL_KEYWORDS,
  alternates: { canonical: E.ENTERNAL_CANONICAL },
  openGraph: {
    type: 'website', locale: 'ko_KR', url: E.ENTERNAL_CANONICAL,
    siteName: SITE.name, title: E.ENTERNAL_TITLE, description: E.ENTERNAL_DESCRIPTION,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'Enternal AI by ReumLab' }],
  },
  twitter: { card: 'summary_large_image', title: E.ENTERNAL_TITLE, description: E.ENTERNAL_DESCRIPTION, images: [SITE.defaultOgImage] },
  robots: robotsFor(E.enternalAiDecision()),
};

const crumbs = [
  { name: '홈', url: `${SITE.domain}/` },
  { name: 'Enternal AI', url: E.ENTERNAL_CANONICAL },
];
```

Render in this exact semantic order:

1. breadcrumb;
2. hero with `<Image src="/enternal-ai/enternal-ai-logo.png" width={2172} height={724} priority sizes="(max-width: 768px) 82vw, 560px" alt="Enternal AI, Enterprise AI" />`, H1, lead, status note, and two anchors;
3. visible entity definition;
4. four problem cards;
5. ordered target flow with `data-enternal-flow` and a visible `목표 구조 · PoC에서 검증` label;
6. five capability cards with status badges and input/output/boundary definition lists;
7. six comparison cards with `data-enternal-comparison`; no `<table>`;
8. six-step ordered process;
9. four clearly labelled example scenarios;
10. four technology-direction cards whose labels come from `ENTERNAL_STATUSES`;
11. ten `<details data-enternal-faq>` elements from the same `ENTERNAL_FAQS` passed to schema;
12. decision-guide links resolved from `/enternal-ai/`;
13. related-service links from `ENTERNAL_RELATED_LINKS`;
14. `#inquiry` with the shared form below.

Use schema and form exactly as follows:

```tsx
<ServiceWebPageJsonLd
  url={E.ENTERNAL_CANONICAL}
  name="Enternal AI 기업용 Private AI PoC"
  description={E.ENTERNAL_DESCRIPTION}
  serviceType="기업용 Private AI 설계·PoC"
  crumbs={crumbs}
  faqs={E.ENTERNAL_FAQS}
/>

<LandingInquiryForm
  landingSlug="enternal-ai"
  defaultServiceType="AI 기능·업무 자동화"
  variant="enternal-ai"
  submitLabel="Enternal AI PoC 검토 요청하기"
/>
```

Every CTA anchor includes one unique existing `data-analytics` value such as `cta_enternal_hero_inquiry` or `cta_enternal_architecture`; do not add an event dispatcher.

- [ ] **Step 5: Implement responsive route-scoped CSS**

Create `app/enternal-ai/enternal-ai.module.css` with:

```css
.page { --enternal-navy: #0b1736; --enternal-teal: #0d817c; --enternal-mist: #eef7f6; color: #172033; background: #fff; overflow: clip; }
.page *, .page *::before, .page *::after { box-sizing: border-box; }
.hero, .section, .definition, .inquiry, .related { width: min(1180px, calc(100% - 40px)); margin-inline: auto; }
.hero { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr); gap: clamp(32px, 5vw, 72px); align-items: center; padding-block: clamp(54px, 8vw, 104px); }
.brandPanel { border: 1px solid #dfe7ee; border-radius: 28px; background: #fff; padding: clamp(24px, 4vw, 48px); box-shadow: 0 24px 70px rgba(11, 23, 54, .11); }
.brandPanel img { display: block; width: 100%; height: auto; }
.flow { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; list-style: none; padding: 0; }
.capabilityGrid, .scenarioGrid, .technologyGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.comparisonGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.primaryButton, .secondaryButton { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 12px 20px; font-weight: 700; }
.primaryButton:focus-visible, .secondaryButton:focus-visible, .related a:focus-visible { outline: 3px solid #1d9d96; outline-offset: 3px; }
@media (max-width: 800px) {
  .hero { grid-template-columns: 1fr; }
  .flow { grid-template-columns: 1fr; }
  .capabilityGrid, .scenarioGrid, .technologyGrid, .comparisonGrid { grid-template-columns: 1fr; }
}
@media (max-width: 430px) {
  .hero, .section, .definition, .inquiry, .related { width: min(100% - 24px, 1180px); }
  .primaryButton, .secondaryButton { width: 100%; }
}
@media (prefers-reduced-motion: reduce) { .page * { scroll-behavior: auto; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
```

Extend these foundations with the necessary heading, card, badge, definition-list, FAQ, guide, and inquiry styles. Keep every grid child at `min-width: 0`, do not set a content element wider than its container, and do not introduce remote fonts or background media.

- [ ] **Step 6: Run the route source test and typecheck**

Run:

```powershell
node --import tsx --test scripts/enternal-ai-page-source.test.mts
npm run typecheck
```

Expected: all route tests PASS and TypeScript exits 0.

- [ ] **Step 7: Commit the route and asset**

```powershell
git add -- app/enternal-ai lib/enternal-ai.ts public/enternal-ai/enternal-ai-logo.png scripts/enternal-ai-page-source.test.mts
git commit -m "feat(enternal-ai): add responsive product page"
```

### Task 4: Search discovery, llms, and existing-service relationships

**Files:**
- Modify: `app/sitemap.ts:1-20,78-135`
- Modify: `lib/content-cluster.ts` under the AI service section
- Modify: `lib/llms-service-pages.ts`
- Modify: `scripts/generate-llms.mts:20-24,75-85,137-152`
- Modify: `lib/enterprise-ai.ts:424-430`
- Modify: `lib/ai-worker.ts:426-440`
- Modify after generation: `content/content-cluster.json`
- Create: `scripts/verify-enternal-ai.test.mts` initially with the integration test only

**Interfaces:**
- Consumes: `ENTERNAL_CANONICAL`, `enternalAiDecision`, and the existing tuple type used by `PURPOSE_LANDINGS`.
- Produces: one sitemap record, one llms record, at least three valid decision-guide links, and one contextual related link from each existing AI service.

- [ ] **Step 1: Write the failing discovery integration test**

Start `scripts/verify-enternal-ai.test.mts` with:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import sitemap from '../app/sitemap';
import { guidesForService } from '../lib/content-cluster';
import { ENTERNAL_CANONICAL } from '../lib/enternal-ai';
import { ENTERNAL_LLMS_PAGE } from '../lib/llms-service-pages';
import { RELATED_LINKS as ENTERPRISE_LINKS } from '../lib/enterprise-ai';
import { RELATED_LINKS as WORKER_LINKS } from '../lib/ai-worker';

test('사이트맵·가이드·LLM 인덱스와 기존 AI 서비스가 Enternal canonical을 한 번 연결한다', () => {
  assert.equal(sitemap().filter((item) => item.url === ENTERNAL_CANONICAL).length, 1);
  assert.ok(guidesForService('/enternal-ai/').length >= 3);
  assert.equal(ENTERNAL_LLMS_PAGE[0], 'enternal-ai');
  assert.match(ENTERNAL_LLMS_PAGE[2], /PoC/);
  assert.match(ENTERNAL_LLMS_PAGE[2], /목표/);
  assert.equal(ENTERPRISE_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);
  assert.equal(WORKER_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);
});
```

- [ ] **Step 2: Run the integration test and confirm missing-export failures**

Run: `node --import tsx --test scripts/verify-enternal-ai.test.mts`

Expected: FAIL because `ENTERNAL_LLMS_PAGE` and route integrations do not exist.

- [ ] **Step 3: Add the canonical to the sitemap behind the quality gate**

In `app/sitemap.ts`, import the Enternal constants and add after the enterprise-AI/AI-worker service entries:

```ts
import { ENTERNAL_CANONICAL, enternalAiDecision } from '@/lib/enternal-ai';

const enternal = enternalAiDecision();
if (enternal.inSitemap) {
  out.push({
    url: ENTERNAL_CANONICAL,
    lastModified: gitLastModified('lib/enternal-ai.ts'),
    changeFrequency: 'monthly',
    priority: 0.84,
  });
}
```

- [ ] **Step 4: Add only real guide relationships**

In `SERVICE_GUIDES` in `lib/content-cluster.ts`, add:

```ts
'/enternal-ai/': [
  { guide: 'enterprise-ai-adoption' },
  { guide: 'rag-development' },
  { guide: 'enterprise-ai-cost' },
  { guide: 'dev-process' },
],
```

Run `npx tsx scripts/extract-content-cluster.mjs` and keep the generated `content/content-cluster.json` change only if the extractor reports zero missing references.

- [ ] **Step 5: Add the stage-aware llms tuple and generator entry**

In `lib/llms-service-pages.ts`:

```ts
export const ENTERNAL_LLMS_PAGE: [string, string, string] = [
  'enternal-ai',
  'Enternal AI 기업용 Private AI·사내 AI PoC',
  'Enternal AI는 기업 내부 환경에서 업무 데이터와 AI를 연결하기 위해 ReumLab이 개발하는 Private AI 제품입니다. 로컬 추론과 자체 사전학습 기반을 목표로 하며, 현재는 기업별 PoC에서 데이터 경로, 적용 범위와 성능을 검증합니다. 완성된 자체 LLM이나 외부 전송 차단을 일반 제공한다고 단정하지 않습니다.',
];
```

Import it in `scripts/generate-llms.mts`, add `기업용 Private AI 설계·PoC` to the provided-services summary, and insert `ENTERNAL_LLMS_PAGE` once in `PURPOSE_LANDINGS` next to the existing enterprise-AI and AI-worker entries.

- [ ] **Step 6: Add contextual links without changing existing service meaning**

Append to `RELATED_LINKS` in `lib/enterprise-ai.ts`:

```ts
{ href: '/enternal-ai/', label: '로컬·Private AI 방향과 기업별 PoC를 검토하는 Enternal AI' },
```

Append to `RELATED_LINKS` in `lib/ai-worker.ts` with the required `note` field:

```ts
{ href: '/enternal-ai/', label: 'Enternal AI', note: '기업 내부 데이터 경로와 로컬 추론 가능성을 PoC로 검증하는 Private AI 제품 방향' },
```

- [ ] **Step 7: Run discovery tests and generator**

Run:

```powershell
npx tsx scripts/extract-content-cluster.mjs
node --import tsx --test scripts/verify-enternal-ai.test.mts
npm run gen:llms
```

Expected: extractor reports zero broken references; test passes; `out/llms.txt` contains `https://reumlab.com/enternal-ai/` once.

- [ ] **Step 8: Commit search discovery integration**

```powershell
git add -- app/sitemap.ts lib/content-cluster.ts content/content-cluster.json lib/llms-service-pages.ts scripts/generate-llms.mts lib/enterprise-ai.ts lib/ai-worker.ts scripts/verify-enternal-ai.test.mts
git commit -m "feat(enternal-ai): connect search discovery paths"
```

### Task 5: Built-artifact quality gate

**Files:**
- Create: `scripts/verify-enternal-ai.mjs`
- Modify: `scripts/verify-enternal-ai.test.mts`
- Modify: `package.json`

**Interfaces:**
- Consumes: static `out/` HTML, copied public logo, split sitemap XML, existing pages, and generated `llms.txt`.
- Produces: `verifyEnternalArtifacts(outDir): string[]` and `npm run seo:verify:enternal-ai`.

- [ ] **Step 1: Add a failing artifact-fixture test**

Extend `scripts/verify-enternal-ai.test.mts` with a temporary `out` fixture. The passing fixture contains:

```html
<title>Enternal AI | 기업용 Private AI·사내 AI PoC | 름랩</title>
<meta name="description" content="기업 데이터를 고객 환경 안에서 활용하는 Private AI를 목표로 개발합니다. 로컬 추론·사내 문서 연결·자체 사전학습 기반의 적용 범위를 기업별 PoC로 검증합니다.">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://reumlab.com/enternal-ai/">
<script type="application/ld+json">{"@graph":[{"@type":"WebPage"},{"@type":"Service"},{"@type":"BreadcrumbList"},{"@type":"FAQPage"}]}</script>
```

The body contains one approved H1, `현재 제공`, `PoC 검증`, `개발 방향`, `목표 구조`, one hidden `/enternal-ai/` landing value, five `data-enternal-flow` elements, six `data-enternal-comparison` elements, and ten `data-enternal-faq` elements. Add one `/enternal-ai/` link to each fixture for `enterprise-ai/index.html` and `ai-worker/index.html`, one sitemap canonical, one llms canonical, and a PNG with a valid signature and IHDR width/height 2172×724.

Assert:

```ts
assert.deepEqual(verifyEnternalArtifacts(root), []);
rmSync(join(root, 'enternal-ai', 'enternal-ai-logo.png'));
assert.ok(verifyEnternalArtifacts(root).some((error) => error.includes('logo')));
```

Recreate the logo, change the schema to include `SoftwareApplication`, and assert the verifier reports that type. Then remove the stage disclosure and assert it reports the missing disclosure.

- [ ] **Step 2: Run the fixture test and verify the missing-module failure**

Run: `node --import tsx --test scripts/verify-enternal-ai.test.mts`

Expected: FAIL because `verifyEnternalArtifacts` is not exported yet.

- [ ] **Step 3: Implement the verifier**

Create `scripts/verify-enternal-ai.mjs` following the existing multimodal verifier API. It must:

- parse `out/enternal-ai/index.html` with `node-html-parser`;
- require exact canonical, title, description, approved H1, `index,follow`, and all three status labels;
- require `WebPage`, `Service`, `BreadcrumbList`, and `FAQPage`;
- reject `SoftwareApplication` and a page-level `Organization` node;
- count actual DOM nodes: 5 flow, 6 comparison, 10 FAQ;
- require hidden landing `/enternal-ai/`;
- require exactly one canonical in all `sitemap*.xml` files and exactly one in `llms.txt`;
- require at least one link from each of `enterprise-ai/index.html` and `ai-worker/index.html`;
- parse the PNG signature and IHDR using `Buffer.readUInt32BE(16)` and `Buffer.readUInt32BE(20)` and require 2172×724;
- export `verifyEnternalArtifacts(outDir = 'out')` and provide a CLI that exits non-zero with each error listed.

- [ ] **Step 4: Register the verifier in package scripts**

Add:

```json
"seo:verify:enternal-ai": "node scripts/verify-enternal-ai.mjs"
```

Append `&& npm run seo:verify:enternal-ai` to the existing `build` script after the other route-specific verifiers and before the font verifier.

- [ ] **Step 5: Run focused tests**

Run:

```powershell
node --import tsx --test scripts/verify-enternal-ai.test.mts
node --import tsx --test scripts/enternal-ai*.test.mts scripts/analytics.test.mts
```

Expected: all tests PASS and the negative fixtures report the intended individual failures.

- [ ] **Step 6: Commit the quality gate**

```powershell
git add -- scripts/verify-enternal-ai.mjs scripts/verify-enternal-ai.test.mts package.json
git commit -m "test(enternal-ai): gate production artifacts"
```

### Task 6: Full verification and preview browser QA

**Files:**
- Modify only when a failing check identifies a concrete defect in files from Tasks 1–5.

**Interfaces:**
- Consumes: complete feature branch and generated `out/`.
- Produces: clean test/build evidence and an inspected Netlify preview artifact.

**User-approved QA refinement:** During preview inspection, replace the initial white logo-card hero with the supplied-reference direction: route-specific enlarged co-brand header, dark responsive hero, natural Korean word wrapping, and a decorative CSS AI core. Keep the truthful product-stage disclosures, canonical, schema, form contract, and no-extra-raster performance boundary unchanged. Add regression tests before the visual source changes.

- [ ] **Step 1: Run the complete automated suite**

Run:

```powershell
npm test
npm run typecheck
npm run build
npm run seo:verify:enternal-ai
npm run seo:verify
npm run seo:verify:faq
npm run seo:verify:content
npm run neo:verify:canonical
npm run neo:verify:sitemap
npm run neo:verify:entities
git diff --check
```

Expected: every command exits 0. Inspect `git status --short`; generated changes must be intentional and source-derived.

- [ ] **Step 2: Review the built HTML and asset cardinality**

Run:

```powershell
rg -n "Enternal AI|현재 제공|PoC 검증|개발 방향|SoftwareApplication|Organization" out/enternal-ai/index.html
rg -n "https://reumlab.com/enternal-ai/" out -g "sitemap*.xml" -g "llms.txt"
```

Expected: required stage copy is present, page-level `SoftwareApplication` and `Organization` are absent, and the canonical appears once in sitemap output and once in llms output.

- [ ] **Step 3: Deploy a preview using the Netlify deploy workflow**

Before deployment, read and follow `netlify:netlify-deploy`. Deploy the tested `out/` as a preview, record the immutable preview URL and deploy ID, and do not run the production IndexNow submission path.

- [ ] **Step 4: Inspect desktop and mobile preview states**

Before browser interaction, read and follow `computer-use:computer-use`. Inspect `/enternal-ai/` at 1440×900, 768×1024, 360×800, and 320×800. Verify:

- header/footer and all content load;
- logo is crisp and not cropped;
- one H1 and all three stage labels are visible;
- flow reading order becomes vertical;
- comparison cards do not create horizontal page overflow;
- keyboard focus is visible and follows DOM order;
- reduced-motion mode does not hide content;
- `/enterprise-ai/` and `/ai-worker/` each expose their contextual link;
- an unknown preview path returns the intended 404.

- [ ] **Step 5: Exercise form and event behavior without personal data**

Use an approved test identity only. Verify first interaction produces one `inquiry_form_start`, CTA activation produces one `cta_click`, and no lead event fires before a successful server response. Submit only when the preview form test destination is confirmed; on success verify exactly one `generate_lead`, retained UTM/first-landing values, and one Netlify `main-apply` entry labelled `Enternal AI 기업 도입·PoC`.

- [ ] **Step 6: Run mobile Lighthouse and record measured observations**

Run Lighthouse against the preview in mobile mode for performance, accessibility, best practices, and SEO. Treat scores as observations; if LCP is dominated by the 718833-byte logo, use Next's static image optimizer output supported by the export or a visually lossless repository-approved compression step, recheck dimensions/appearance, and rerun the build and verifier.

- [ ] **Step 7: Commit any concrete QA fixes and rerun affected checks**

If QA produced source changes, stage only those named files, use `git diff --cached` to review them, commit with `fix(enternal-ai): resolve preview QA findings`, and rerun the smallest failing test plus the full build. If QA produced no source changes, leave the branch clean.

### Task 7: Whole-branch review, production deployment, and search submission

**Files:**
- No planned source file changes. A review fix must receive its own test and commit before release.

**Interfaces:**
- Consumes: clean reviewed branch, immutable preview evidence, and authenticated Netlify/Google/Naver sessions.
- Produces: pushed commit history, verified production deploy, bounded IndexNow evidence, and Google/Naver submission records.

- [ ] **Step 1: Review the full branch against the specification**

Run:

```powershell
git status --short --branch
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
git diff --check origin/main...HEAD
```

Read the complete diff and confirm every spec requirement maps to code or release evidence. Confirm no unrelated generated audit files, secrets, temporary package files, or attachment documents are staged.

- [ ] **Step 2: Run final verification from the exact release commit**

Use `superpowers:verification-before-completion`. Run:

```powershell
npm test
npm run typecheck
npm run build
npm run seo:verify:enternal-ai
git status --short --branch
```

Expected: all commands exit 0 and the worktree is clean apart from intentionally ignored build output.

- [ ] **Step 3: Push the feature branch and integrate without overwriting the dirty original checkout**

Push `codex/enternal-ai` to origin. Integrate through a fast-forwardable reviewed branch or GitHub pull request; never reset or clean the user's original `main` checkout. Confirm `origin/main` contains every Enternal commit before production deploy.

- [ ] **Step 4: Deploy the reviewed main commit to production**

Follow `netlify:netlify-deploy`. Confirm the production deploy commit SHA equals the reviewed main SHA. Verify HTTP 200 and rendered content for:

- `https://reumlab.com/enternal-ai/`
- `https://reumlab.com/enterprise-ai/`
- `https://reumlab.com/ai-worker/`
- `https://reumlab.com/sitemap.xml`
- `https://reumlab.com/llms.txt`
- one non-existent path for 404 behavior.

- [ ] **Step 5: Confirm bounded IndexNow evidence**

Use the existing production-only submission safety gate. Confirm `/enternal-ai/` is in the submitted change set and record the response. Describe HTTP 200 only as accepted by the endpoint, never indexed.

- [ ] **Step 6: Request Google Search Console collection**

Using the authenticated browser and `computer-use`, open the correct `reumlab.com` property, inspect `https://reumlab.com/enternal-ai/`, run the live URL test if available, confirm the exact canonical and account immediately before the request, then click `색인 생성 요청`. Record the actual UI response and timestamp; do not state that indexing is complete.

- [ ] **Step 7: Request Naver Search Advisor collection**

Using the authenticated browser, open the verified `reumlab.com` site, confirm sitemap ownership/status, enter `/enternal-ai/` in 웹 페이지 수집, recheck the exact path immediately before submission, and submit once. Record the actual request status and timestamp; do not repeatedly submit the same URL.

- [ ] **Step 8: Verify production form only with authorized test contact data**

If authorized test contact data is available, submit one `[테스트] Enternal AI 수신확인` inquiry on production, inspect the `main-apply` entry in Netlify Forms for landing, channel, UTM, service label, and entered fields, then delete the test only if explicitly authorized. If contact data is not available, report form registration and preview evidence without inventing or using the owner's phone number.

- [ ] **Step 9: Report exact completion state**

Report commit SHA, production deploy URL/ID, tested routes, automated check results, measured Lighthouse observations, form test result, IndexNow response, GSC request response, and Naver request response. Separate `VERIFIED`, `SUBMITTED`, `NOT TESTED`, and `BLOCKED` items so submission is never confused with indexing or ranking.
