# AI Search Architecture — 구현 문서

새 서비스 페이지 `/ai-search-optimization/` 의 구조, 실제로 바꾼 파일, 재현 명령을 적는다.
가격·범위 숫자는 여기 쓰지 않는다 → `SCOPE_AND_PRICING.md` 와 `lib/ai-search-architecture.ts` 가 단일 출처다.

## 1. 이 페이지의 역할과 기존 페이지와의 경계

| URL | 역할 | 이 페이지와의 차이 |
|---|---|---|
| `/ai-search-optimization/` (신규) | **이미 운영 중인 홈페이지**의 검색·답변·정보 구조를 진단하고 합의 범위를 실제 코드·콘텐츠에 반영 | — |
| `/geo-website/` | GEO 관점의 **신규 홈페이지 제작**(기존 사이트 개선은 선택지 중 하나) | 새로 만드는 쪽. 두 페이지를 문맥 링크로 상호 연결했고 canonical 통합·삭제는 하지 않았다 |
| `/data-seo/` | 수집·검색·대량 페이지 생성 **시스템 구축** | 이 페이지를 "대량 SEO 페이지 생성 상품"으로 설명하지 않는다 |
| `/service-renewal/` | 앱·웹 **기능 자체**의 인수·개선 | 검색 구조가 아니라 기능을 고치는 범위 |

`scripts/verify-cannibalization.mjs` 가 통과한다(중복 의도 페이지를 새로 만들지 않았다). 지역·업종 변형 페이지는 만들지 않았다.

## 2. 파일 구조

### 새로 만든 파일

| 파일 | 줄 | 역할 |
|---|---|---|
| `lib/ai-search-architecture.ts` | 642 | **단일 데이터 원본.** 메타·히어로·범위 6영역·패키지 3종·CARE 2종·FAQ 15문항·참고 문서·표시 헬퍼·색인 게이트·Offer 노드 생성. 화면과 구조화 데이터가 여기서 함께 파생된다. |
| `lib/ai-search-form.ts` | 87 | **import 가 하나도 없는 모듈.** 폼 선택지(패키지·CARE·환경·권한), 비식별 enum `PACKAGE_TIER`, 길이 제한, 주소 정규화 `normalizeSiteUrl()`. 클라이언트 컴포넌트가 `lib/ai-search-architecture.ts` 를 직접 import 하면 `lib/seo.ts` 전체가 브라우저 번들에 딸려 들어가므로 값만 분리했다. |
| `app/ai-search-optimization/page.tsx` | 750 | Server Component. 16개 섹션 전부를 데이터에서 렌더한다. 숫자·문장을 이 파일에서 다시 쓰지 않는다. |
| `app/ai-search-optimization/ai-search.module.css` | 369 | 페이지 전용 CSS Module. `app/globals.css` 토큰만 쓰고 전역 `h1/button/a/table` 을 덮어쓰지 않는다. |
| `scripts/verify-ai-search-page.mjs` | 528 | 최종 `out/` HTML 회귀 게이트(18종 검사). 빌드 체인 마지막에서 실행된다. |
| `scripts/verify-ai-search-page.test.mts` | 323 | 위 게이트에 결함 32종을 주입해 "실제로 잡는지" 확인하는 테스트. |
| `scripts/og/ai-search-architecture.html` | 81 | 공유 이미지 원본(HTML). 헤드리스 크로미움으로 1200×630 렌더한다. |
| `public/og-ai-search-architecture.jpg` | — | 실제 공유 이미지 파일 (1200×630, 42KB). |

### 고친 파일 (전부 가산 변경)

| 파일 | 변경 |
|---|---|
| `components/LandingInquiryForm.tsx` | `ai-search-architecture` variant 추가. 기존 `default`/`geo-website`/`ai-voice` 동작·필드·이벤트는 그대로. |
| `components/JsonLd.tsx` | `ServiceWebPageJsonLd` 에 **선택** prop `offers` 추가(넘기지 않으면 기존과 동일). |
| `lib/schema.ts` | `ServiceNodeInput.offers` 선택 필드 추가. 값이 없으면 `offers` 키 자체를 만들지 않는다. |
| `components/AnalyticsDataLayer.tsx` | CTA 에 `data-cta-package` 가 있을 때만 `package_tier` 파라미터를 함께 보낸다(+4줄). |
| `lib/analytics.ts` | 서비스 축 매핑에 `ai-search-optimization → web` 추가, `EventParams.package_tier` 추가. |
| `app/sitemap.ts` | 색인 게이트를 통과할 때만 새 canonical 1건 추가. 기존 URL은 건드리지 않는다. |
| `content/service-menu.json` | 메뉴 항목 1개 추가(`AI 검색 구조 개선`). 순서·기존 항목 변경 없음. |
| `app/geo-website/page.tsx` | 제작 유형 카드와 관련 서비스에 새 페이지 문맥 링크 2개 추가. 기존 문구·견적 표기 유지. |
| `scripts/generate-llms.mts` | llms.txt / llms-full.txt 에 새 서비스 1줄 추가(역할 차이 명시). |
| `lib/pricing.ts` · `scripts/verify-pricing.mjs` | `RETIRED_PRICE_EXCEPTIONS` 도입. `690만` 은 구 홈 요금표 잔재로 전역 금지 상태였는데 이 페이지의 현행 시작가와 겹친다 → **경로 한정**으로만 예외 처리하고, 다른 경로에서는 여전히 실패시킨다. |
| `public/__forms.html` | Netlify 감지용 정적 폼에 새 필드 5개 추가. 기존 필드 삭제 없음. |
| `package.json` | `seo:verify:ai-search` 추가 + 빌드 체인 마지막에 연결. |

## 3. 상호작용 — 어디까지가 JS 없이 동작하나

| 기능 | 구현 | JS 없을 때 |
|---|---|---|
| 페이지 목차 | 평범한 `#앵커` 링크 + `scroll-margin-top: 96px` | 그대로 이동 |
| 개선 범위 구조도 | `input[type=radio]` 6개 + `:checked ~` 형제 선택자 | 6장 카드 전체가 그대로 보인다(선택 강조만 사라짐) |
| FAQ | native `<details>/<summary>` | 클릭으로 열림. 질문·답변 모두 초기 HTML |
| 패키지 CTA → 폼 동기화 | 서버 렌더된 `<a href="#inquiry" data-aisa-package="...">` + 폼의 document 클릭 위임 | `#inquiry` 로 이동하고 방문자가 직접 선택 |
| 상담 폼 | 기존 `LandingInquiryForm`(클라이언트) | 폼은 동작하지 않지만 전화·카카오·이메일 링크가 같은 섹션에 있다 |

이 페이지가 브라우저로 내려보내는 JS 는 **라우트 청크 1.26 kB / First Load 104 kB** 로, `/geo-website/`(104 kB)와 같다. 공통 프레임워크(87.4 kB)를 제외한 증가분은 약 17 kB 로 목표(50 kB gzip 이하) 안이다.

## 4. 재현 명령

```bash
npm ci
npm run typecheck
npm run build                 # 전체 후처리 포함. 마지막에 seo:verify:home-guide → seo:verify:ai-search 가 자동 실행된다
npm test                      # 게이트 결함 주입 테스트 포함 (90 tests)
npm run seo:verify:ai-search  # 이 페이지만 다시 검사
```

정적 서버로 검수할 때는 반드시 **모든 후처리가 끝난 `out/`** 을 서비스한다. `next dev` / `next start` 로 대체하지 않는다 — 홈은 정적 `index.html` 이 `out/` 을 덮어쓰고, 서비스 메뉴·llms·사이트맵 분할도 빌드 후 단계에서 만들어진다.

공유 이미지를 다시 만들 때:
```bash
# scripts/og/ai-search-architecture.html 상단 주석의 명령 참고 (playwright 필요, 수동 1회)
```

## 5. 구조화 데이터

한 문서에 `@graph` 두 블록이 나간다.

1. 루트 레이아웃이 내는 전역 그래프 — `WebSite` / `Organization` / `LocalBusiness`(고정 `@id`). 이 페이지는 **다시 선언하지 않고 참조만** 한다.
2. 페이지 그래프 — `WebPage`(`#webpage`) → `mainEntity` → `Service`(`#service`) → `provider` → `#business`, `BreadcrumbList`(`#breadcrumb`, 홈 > 현재 페이지 2단계), `FAQPage`(`#faq`).

`Service.offers` 는 3개 `Offer` 이며 각각 `PriceSpecification { priceCurrency: KRW, minPrice, valueAddedTaxIncluded: true }` 를 갖는다.
**`price` 가 아니라 `minPrice`** 인 이유: 화면 문구가 "…원부터"이고 `price` 를 쓰면 확정가라는 뜻이 되어 화면과 어긋난다. `Product` 노드는 만들지 않는다(서비스 페이지를 상품으로 오인시키지 않는다).

FAQPage 는 화면에 실제로 렌더되는 15문항과 질문·답변이 완전히 같을 때만 나간다(게이트가 대조한다). Google 의 FAQ 리치 결과는 더 이상 표시되지 않으므로, 이 스키마를 노출 근거로 판매하지 않는다.
