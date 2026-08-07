# REUMLAB SEO Audit (2026-08)

- 기준 커밋: `2bca403` (2026-07-28, "SEO·GEO·전환 구조 감사 및 수정")
- 감사 범위: 코드 기준 정적 점검 (실제 배포 응답 헤더·GSC/서치어드바이저 데이터는 미포함)
- 이 문서는 **수정 전 기준점(baseline)** 이며, 이 단계에서 코드는 변경하지 않았다.

## 사이트 규모 (코드에서 실측)

`app/sitemap.ts` 실행 결과 **사이트맵 URL 835개** (sitemap index 없이 단일 `sitemap.xml`).

| 축 | 라우트 | 생성 페이지 | 사이트맵 포함 |
|---|---|---|---|
| 필러/서비스 | `app/[slug]` | 21 | 18 (301 3종 제외) |
| 목적별 랜딩 | 정적 생성 8종 | 8 | 8 |
| 지역×서비스 | `app/[slug]/[region]` | 350 (5×70) | **15** |
| 업종×앱개발 | `app/app/[industry]` | 112 | 112 |
| 업종×홈페이지 | `app/website/[industry]` | 294 | 294 |
| 업종×비용 | `app/cost/[industry]` | 112 | 112 |
| 업종×솔루션 | `app/solution/[industry]` | 112 | 112 |
| 가이드 | `app/guide/[topic]` | 35 | 35 |
| 비교 | `app/compare/[slug]` | 3 | 3 |
| 블로그 | `app/blog/[slug]` | 9 | 9 |
| 레거시 랜딩 | `app/l/[slug]` | 328 | 101 |
| 레거시 허브 | `app/h/[hubSlug]` | — | 7 |
| 법적 고지 | 정적 | 3 | 3 |

---

## 1. 현재 잘 되어 있는 부분 (건드리지 말 것)

1. **전역 metadata 골격이 정석대로**다 — `app/layout.tsx`에 `metadataBase`, `title.template`, `description`, `alternates.canonical`, OG, Twitter Card, `robots`, `manifest`, `icons`, `verification`이 모두 선언돼 있다.
2. **canonical이 전 라우트에 있다.** `[slug]`, `[slug]/[region]`, `blog`, `guide`, `compare`, `app`, `website`, `cost`, `solution`, `l`, `h`, `soho`, `404` 모두 `alternates.canonical` 명시. 헬퍼(`blogCanonical`, `guideCanonical`, `industryCanonical` 등)가 전부 trailing slash로 통일돼 `trailingSlash: true` 설정과 일치한다. **URL 정규화 불일치 없음.**
3. **색인 게이트와 사이트맵이 동기화돼 있다.** `lib/index-quality.ts`의 판정 하나로 페이지 `robots` 메타와 `sitemap.ts` 포함 여부를 같이 결정한다 — "사이트맵엔 있는데 noindex"라는 GSC 최악의 모순이 구조적으로 발생하지 않는다.
4. **sitemap `lastmod`가 빌드시각이 아니라 git 커밋일**(`lib/lastmod.ts`)이다. 재배포마다 lastmod가 튀어 크롤 예산이 낭비되는 흔한 실수를 이미 피했다.
5. **robots.txt / sitemap.xml 단일 출처.** `scripts/prepare-next-public.mjs`가 `public/robots.txt`·`public/sitemap.xml`을 빌드 전에 지워 `app/robots.ts`·`app/sitemap.ts`만 남긴다.
6. **레거시 URL 301 정리가 촘촘하다.** `public/_redirects`에 얇은 한글 필러, 삭제된 자동생성 블로그 400편, `/l/` 통합분, `/portfolio`, `.html` 평면 URL이 전부 매핑돼 있다. `_redirects`의 non-forced 규칙이 정적 파일보다 후순위라는 점까지 이해하고 `/AI서비스개발/`에 canonical+refresh 스텁을 따로 둔 것은 정확한 처리다.
7. **404가 noindex + 고유 메타.** `app/not-found.tsx`에서 홈 메타 상속을 끊어 soft-404를 막았다.
8. **JSON-LD 직렬화가 안전하다.** `components/JsonLd.tsx`의 `ldJson()`이 `<`, `>`, `&`, U+2028/2029를 이스케이프해 script 조기 종료를 막는다.
9. **홈 포트폴리오가 정적 주입된다.** `scripts/inject-portfolio-static.mjs`가 `script.js`의 `PROJECTS`를 빌드 시 HTML에 심어, JS를 실행하지 않는 Yeti·GPTBot·ClaudeBot도 신뢰 자산을 읽는다. 클로킹이 아니라 같은 내용의 사전 렌더다.
10. **지역 페이지 히어로가 인라인 SVG**(`regionServiceMedia`)라 외부 이미지 없이도 페이지마다 alt·색상이 다르다. SVG `<title>`을 쓰지 않은 이유(네이버가 문서 title로 중복 집계)까지 주석에 남아 있다.
11. **모든 `<img>`에 width/height + loading/decoding + 의미 있는 한글 alt**가 들어가 있다 (CLS 방어).
12. **`llms.txt` 생성기**(`scripts/generate-llms.mts`)가 존재하고, 수치를 `lib/seo.ts`에서 가져와 페이지와 어긋나지 않게 만든다. 과장 없는 한계 주석까지 붙어 있다.
13. **`WebSiteJsonLd`에서 `SearchAction`을 의도적으로 제거**했다 — 정적 export라 사이트 검색이 없는데 스키마로 주장하는 위반을 스스로 걷어낸 판단이 옳다.

---

## 2. Critical — 검색 노출·색인에 직접 영향

### C1. `feed.xml`이 죽은 URL만 담고 신규 콘텐츠는 하나도 없다

`scripts/generate-feed.mjs`의 `STATIC_PAGES`가 **2026-07 개편 이전 상태에 멈춰 있다.**

피드에 들어가는 URL:

| 피드 항목 | 현재 실제 상태 |
|---|---|
| `/웹개발/` | `NOINDEX_PILLAR_SLUGS` — noindex |
| `/앱개발/` | `_redirects` 301 → `/flutter/` |
| `/스타트업MVP/` | 301 → `/mvp/` |
| `/솔루션SaaS/` | 301 → `/ai-development/` |
| `/플랫폼개발/` | noindex |
| `/기업용ERP/` | noindex |
| `/l/*` **328개 전부** | 101개만 색인 대상, **227개가 noindex** |
| `/h/*` 전부 | `hubShouldIndex` 미적용 — noindex 허브 포함 |

반대로 피드에 **없는 것**: 블로그 9편, 가이드 35편, 비교 3편, 업종축 630개, 지역축 15개, 목적별 랜딩 8종 — 즉 **실제로 색인시키고 싶은 페이지가 단 한 개도 없다.**

영향: RSS는 네이버 서치어드바이저의 정식 수집 채널이고, 이 피드는 `app/layout.tsx:76-80`에서 **모든 하위 페이지 `<head>`에 `rel="alternate"`로 선언**돼 있다. 지금 구조는 네이버·피드 리더에게 "우리 최신 콘텐츠는 이 301·noindex URL들"이라고 계속 알리는 역방향 신호다.

- 파일: `scripts/generate-feed.mjs`

### C2. 홈(`/`)이 Next 메타데이터 파이프라인 밖에 있고, 두 소스가 서로 다른 내용을 말한다

`package.json`의 `copy:home`이 루트 `index.html`을 `out/`에 복사해 **Next가 만든 홈을 덮어쓴다.** 즉 `app/page.tsx`와 `app/layout.tsx`의 홈 metadata는 프로덕션에서 사용되지 않는다.

그런데 `sitemap.ts`, `generate-llms.mts`, `generate-feed.mjs`, `JsonLd.tsx`는 전부 `PAGE_SEO_MAP['']`(= `lib/seo.ts`)를 홈의 사실로 삼는다. 두 값이 실제로 다르다:

| 항목 | `lib/seo.ts` PAGE_SEO_MAP[''] (사이트맵·llms.txt 기준) | `index.html` (실제 검색결과에 나가는 값) |
|---|---|---|
| title | `름랩 REUMLAB \| Flutter 앱개발, 랜딩페이지 제작, MVP 외주개발 — 동탄·수원 개발 스튜디오` | `앱·웹·AI MVP 개발 스튜디오 름랩 REUMLAB — 소스코드·운영 권한까지 이관` |
| description | "화성 동탄 외주개발 스튜디오 름랩. Flutter 앱개발·MVP…" | "아이디어를 실제로 운영 가능한 서비스로 만드는…" |
| og:title | `외주 맡긴 앱, 다시는 외주에 묶이지 않게.` | `름랩 REUMLAB \| 앱·웹·AI MVP 개발 스튜디오` |
| H1 | `외주 맡긴 앱, 다시는 외주에 묶이지 않게` | (index.html 본문 기준, 별도) |

또한 `index.html`에는 **`rel="alternate" hreflang`도, RSS `rel="alternate"`도 없다**(둘 다 `layout.tsx`에만 있음).

영향: 사이트에서 가장 중요한 URL의 title·description이 "관리 대상 데이터"와 어긋나 있어, `lib/seo.ts`를 고쳐도 검색결과는 바뀌지 않는다. 이후 어떤 SEO 작업을 해도 홈만 반영되지 않는 구조적 사각지대다.

- 파일: `index.html`, `lib/seo.ts`, `package.json`(`copy:home`), `app/page.tsx`

> 주의: 이 구조 자체는 의도된 것이고 `app/page.tsx:1`에 경고 주석도 있다. **홈 HTML을 Next로 되돌리라는 뜻이 아니다** — 두 소스의 title/description/JSON-LD를 한쪽으로 맞추거나 빌드 시 검증(assert)을 넣자는 뜻이다.

---

## 3. High

### H1. JSON-LD 엔티티 그래프가 파편화돼 있다 — dangling `@id` + 중복 Organization

**(이것이 2단계 작업의 정확한 대상이다.)**

현재 Organization 노드가 서로 연결되지 않은 채 4곳에서 따로 선언된다:

| 위치 | 노드 | `@id` | 문제 |
|---|---|---|---|
| `index.html:47~` | `WebSite` / `Organization` / `LocalBusiness+ProfessionalService` | `#website` `#organization` `#localbusiness` | 유일하게 완전. 단 하드코딩 사본이라 `SITE`와 이중 관리 |
| `JsonLd.tsx` `OrganizationJsonLd` (전 `/[slug]/` 페이지) | `Organization` | **없음** | `@id`가 없어 홈의 `#organization`과 병합되지 않는 **별개 노드**가 됨 |
| `JsonLd.tsx` `LandingServiceJsonLd` / `RegionServiceJsonLd` / `IndustryServiceJsonLd` | `ProfessionalService` / `Service` | `provider: {"@id": ".../#organization"}` | 해당 페이지에 `#organization` 노드가 **없다** → **dangling reference** |
| `scripts/generate-purpose-landings.mjs:579` | `Service` 안에 `Organization` 인라인 | 없음 | 또 다른 익명 Organization 8개 |

추가로 `ReumHomeGraphJsonLd`와 `WebSiteJsonLd`는 `app/page.tsx`에만 있어 **프로덕션에서 출력되지 않는다**(C2로 덮임). 즉 `WebSite` 스키마는 `index.html` 하드코딩본만 실제로 존재한다.

영향: 구글이 "름랩 = 하나의 엔티티"로 병합하기 어렵고, `provider` 참조가 빈 노드를 가리켜 Service ↔ Organization 관계가 성립하지 않는다. 지식 패널·로고 리치결과·생성형 검색의 엔티티 인식이 약해진다.

- 파일: `components/JsonLd.tsx`, `app/[slug]/page.tsx`, `scripts/generate-purpose-landings.mjs`, `index.html`

### H2. `og-image.jpg`가 확장자와 다른 4.3MB PNG이고, 선언 치수도 틀렸다

```
public/og-image.jpg : PNG image data, 2848 x 1504  (4,316,912 bytes)
public/og-default.png: 동일 파일 (md5 일치)
```

- 확장자는 `.jpg`인데 실제 바이트는 **PNG** → 정적 호스팅이 `Content-Type: image/jpeg`로 서빙 → 카카오톡·X 등 엄격한 스크래퍼에서 카드 실패 가능.
- 선언은 `og:image:width 1200 / height 630`인데 실제는 **2848×1504**.
- 4.3MB는 OG 스크래퍼 실측 상한(X 5MB, 카카오는 더 낮음)에 근접.
- 이 파일이 `SITE.defaultOgImage`로 **모든 페이지의 og:image**이자, JSON-LD의 `Organization.logo` / `LocalBusiness.image`로도 쓰인다. 구글 로고 리치결과는 로고 형태 이미지를 기대하는데 2848×1504 배너가 들어가 있다.

- 파일: `public/og-image.jpg`, `public/og-default.png`, `lib/seo.ts:7`, `components/JsonLd.tsx`, `index.html`

### H3. 색인 품질 게이트가 업종축 630개에서 사실상 작동하지 않는다

`lib/index-quality.ts`는 80점 이상만 색인하는데, 실측 점수 분포:

```
/website/[industry] (294개)  score min 87 / avg 93.7 / max 95  → 294개 전부 통과
/app/[industry]     (112개)  score min 87 / avg 87.8 / max 95  → 112개 전부 통과
/cost/, /solution/  (112+112)                                   → 전부 통과
```

**탈락 0건.** 게이트가 지역축(`INDEXED_REGION_SLUGS`로 하드 차단, 350→15)에서만 기능하고, 정작 페이지 수가 많은 업종축에서는 아무것도 거르지 못한다. `peerFingerprints` Jaccard≥0.7 중복 검사도 한 건도 걸리지 않았다.

영향: **630개 업종 템플릿 페이지가 무조건 색인 요청된다.** 지역축은 "지역명만 치환하면 도어웨이"라는 이유로 엄격히 막았는데, 같은 논리가 "업종명만 치환"에는 적용되지 않고 있다 — 일관성이 깨진 상태다. 게이트가 있다는 사실 자체가 안전하다는 착시를 준다.

> 판단 유보 항목: 실제 업종 페이지의 고유 콘텐츠 비율은 `buildWebsiteContent()`의 문장 단위 검증이 더 필요하다. **지금 당장 noindex를 걸라는 뜻이 아니라**, GSC "크롤됨-현재 색인 안 됨" 수치를 확인한 뒤 임계값(80)을 재보정할 대상이라는 뜻이다.

- 파일: `lib/index-quality.ts`, `lib/website-industries.ts`, `lib/industries.ts`, `lib/cost.ts`, `lib/solution.ts`

### H4. 목적별 랜딩 8종이 완전히 동일한 FAQPage를 출력한다

`scripts/generate-purpose-landings.mjs:584`가 8개 페이지 전부에 `FAQ_COMMON` 하나를 그대로 뿌린다. `/erp/`, `/ai-automation/`, `/platform/`, `/reservation-commerce/`, `/data-seo/`, `/service-renewal/`, `/mvp/`, `/website/`의 FAQ 구조화 데이터가 문자 단위로 같다. 화면 FAQ도 같으므로 스키마 위반은 아니지만, "이 페이지 고유 정보"가 0인 블록이 8배 중복된다.

- 파일: `scripts/generate-purpose-landings.mjs`

### H5. 폰트가 두 갈래로 갈려 양쪽 다 렌더 블로킹이다

| | 폰트 | 로딩 |
|---|---|---|
| 홈 `/` + 목적별 랜딩 8종 | Pretendard (jsdelivr CDN) | 렌더 블로킹 `<link rel=stylesheet>`, `font-display` 통제 불가 |
| Next 라우트 전체 (약 800페이지) | Plus Jakarta Sans(5) + **Noto Sans KR(5)** + JetBrains Mono(3) + Outfit(6) | 렌더 블로킹 `<link>`, `display=swap`은 있음 |

- 한 사이트 안에서 본문 서체가 페이지마다 다르다(브랜드 일관성 + 체감 이질감).
- Noto Sans KR 5 weight는 한글 웹폰트 중 가장 무거운 축이고, `next/font`(자체 호스팅·preload·자동 subsetting)를 전혀 쓰지 않는다. `next.config.mjs`의 `images.unoptimized: true`와 합쳐 LCP/FCP에 직접 영향.
- 4개 패밀리 19 weight를 실제로 다 쓰는지 검증 필요.

- 파일: `app/layout.tsx:67-72`, `index.html:159-160`, `scripts/generate-purpose-landings.mjs:613-614`

---

## 4. Medium

### M1. robots.txt가 최소 규칙만 있다

```
User-agent: *
Allow: /
Host: reumlab.com
Sitemap: https://reumlab.com/sitemap.xml
```

- **Yeti·Googlebot·Bingbot 명시 규칙 없음.** 기능적으로는 `*` 허용으로 전부 통과하므로 **차단 문제는 없다**. 다만 네이버 서치어드바이저는 Yeti 명시 블록을 권장한다.
- **AI 크롤러(GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot / Google-Extended) 정책 미선언.** allow-all이라 현재 전부 허용 — GEO 관점에선 유리한 기본값이지만, "의도적 허용"이 아니라 "미선언"인 상태다.
- `Host:` 지시자는 Yandex 전용이고 구글·네이버는 무시한다(무해).
- `/admin`, `/api` 경로는 이 프로젝트에 존재하지 않으므로 차단 불필요.

- 파일: `app/robots.ts`

### M2. `llms-full.txt` 없음

`out/llms.txt`만 생성된다(`scripts/generate-llms.mts:132`). `llms-full.txt`는 부재.

### M3. `theme-color`가 3곳에서 서로 다르다

`app/layout.tsx` `#0f1f3a` / `index.html` `#0a1830` / `public/site.webmanifest` `#5b3df5`.

### M4. 배포되지만 관리되지 않는 정적 HTML

- `public/assets/admin-guide-example.html` — GTM은 들어 있는데 **canonical도 robots 메타도 없다.** `/assets/admin-guide-example.html`로 색인 가능.
- `public/SITE_VERIFICATION_README.txt` — 내부 메모가 그대로 공개 배포된다.
- `vvip/index.html`은 저장소 루트에 있어 `out/`에 복사되지 않는다 → `/vvip/`는 404. 파일 안의 canonical `https://reumlab.com/vvip/`가 존재하지 않는 URL을 가리키는 사문 상태.

### M5. `/404/`가 200으로 열린다

`trailingSlash: true` + 정적 export 조합으로 `out/404/index.html`이 생겨 `/404/`가 200을 반환한다. `not-found.tsx`가 noindex를 명시해 **실질 피해는 막혀 있으나**, canonical이 `${SITE.domain}/404`(trailing slash 없음)라 사이트 전체 규칙과 어긋난다.

### M6. `next/image` 미사용

`images.unoptimized: true`(정적 export 필수)라 `next/image`의 이점이 없어 순수 `<img>`를 쓰는 것 자체는 타당하다. 다만 이미지가 전부 원본 JPG이고 WebP/AVIF 변형이 없다.

### M7. 홈 hero 아래 자동재생 비디오

`index.html:609` — `cms-promo.mp4` **1.25MB**, `autoplay muted loop playsinline preload="metadata"` + poster 지정. 페이지 중단부(라인 609/1141)라 LCP 요소는 아니고, `preload="metadata"`·poster·width/height 처리가 이미 되어 있어 **현재 설정은 적절하다.** 다만 뷰포트 진입 전에도 메타데이터를 받으므로 모바일 저속 회선에서 대역폭을 조금 쓴다.

---

## 5. Low

- `PAGE_SEO_MAP` 21개 중 `앱개발`·`스타트업MVP`·`솔루션SaaS`는 301 대상이라 렌더되지 않는데 데이터는 남아 있다(의도적. `_redirects`와 동기화 주석 있음).
- `app/page.tsx`의 `HOME_FAQS` 8문항과 `index.html` FAQ JSON-LD가 별도 관리 — 프로덕션에는 후자만 나가므로 전자는 사문.
- `components/Footer.tsx`와 `src/components/Footer.tsx` 두 벌 존재.
- 루트의 `privacy.html` / `terms.html` / `refund.html`은 배포되지 않는다(`public/{privacy,terms,refund}/index.html`이 실제). `_redirects`가 이미 커버.
- `build:legacy` 계열 스크립트(`gen:sitemaps`, `gen:robots`, `build:hubs` 등)가 남아 있어, 실수로 실행하면 단일 출처가 깨진다.

---

## 6. 구조화 데이터 현황

| Schema | 출력 위치 | 상태 |
|---|---|---|
| `WebSite` | `index.html` 하드코딩만 (`WebSiteJsonLd`는 `app/page.tsx` → 미배포) | ⚠️ 단일 출처 아님 |
| `Organization` | `index.html`(`@id` 있음) / `JsonLd.OrganizationJsonLd`(`@id` **없음**, 전 `/[slug]/`) / purpose landing 인라인 | ⚠️ 3벌 분산 |
| `LocalBusiness` | `index.html`(`LocalBusiness`+`ProfessionalService` 결합), `RegionServiceJsonLd`(지역 15+335 페이지) | ⚠️ 홈 외에는 `#organization` 연결 없음 |
| `ProfessionalService` | `index.html`, `ReumHomeGraphJsonLd`(미배포), `LandingServiceJsonLd`(`/l/`, `/h/`) | ⚠️ `provider` dangling |
| `Service` | `RegionServiceJsonLd`, `IndustryServiceJsonLd`, purpose landing | ⚠️ `provider` dangling |
| `BreadcrumbList` | `[slug]`, `[slug]/[region]`, `app`, `website`, `cost`, `solution`, `guide`, `compare`, `blog`, `l`, `h`, purpose landing | ✅ 광범위 |
| `FAQPage` | 홈, 필러(`seo.faqs`), 지역×서비스, 업종축, 가이드/비교, 블로그, `h`, soho, purpose landing 8종 | ⚠️ purpose landing 8종 동일 |
| `Article` | `blog/[slug]`, `guide/[topic]`, `compare/[slug]` | ✅ |
| `Person` | `Organization.founder`(성아름) 안에만 | ➖ 독립 Person 노드 없음 |
| `Offer` / `OfferCatalog` | `index.html`(8종 전체), `JsonLd.PACKAGE_OFFERS`(3종) | ⚠️ 개수 불일치 (8 vs 3) |

**핵심 결론:** 스키마 종류·커버리지는 충분하다. 문제는 **`@id` 기반 엔티티 연결이 홈에서만 완성돼 있고 나머지 800여 페이지에서 끊겨 있다**는 것. → 2단계 작업 대상.

---

## 7. sitemap / robots 현황

**sitemap**
- 생성: `app/sitemap.ts` → `out/sitemap.xml` (Next `MetadataRoute.Sitemap`)
- sitemap index **미사용** (835 URL이므로 50,000 한계 대비 불필요 — 적절)
- `lastmod` 전 항목 존재, git 커밋일 기준
- URL 중복 제거 로직 있음 (`sitemap.ts:249-255`)
- canonical과 사이트맵 URL **일치** (같은 헬퍼 사용)
- **gzip/Content-Encoding 문제 없음**: `netlify.toml`에 `[[headers]]` 없음, `public/_headers` 없음, 사전 압축 파일 없음. `.xml` 확장자로 정적 서빙되므로 Netlify 기본 `application/xml`로 나간다.

**robots**
- 생성: `app/robots.ts` → `out/robots.txt`
- 내용: `User-agent: *` / `Allow: /` / `Host: reumlab.com` / `Sitemap: https://reumlab.com/sitemap.xml`
- Googlebot·Yeti·Bingbot·AI 크롤러 **전부 접근 가능**(와일드카드) — 차단 사고 없음
- 명시 규칙 부재 → M1

---

## 8. 지역 SEO 페이지 현황

**총 페이지 수**
- 생성: **350개** (서비스 5종 × 지역 70종, `app/[slug]/[region]`)
- 사이트맵·색인: **15개** (`app-development`/`web-development`/`mvp`/`flutter`/`ai-development` × `dongtan`/`hwaseong`/`suwon`)
- 나머지 **335개는 `noindex, follow`** — `INDEXED_REGION_SLUGS`(`lib/pseo.ts:1087`)로 하드 차단
- 레거시 `/l/*` 328개 중 색인 101개, 227개 noindex, 18개는 301로 `/[service]/[region]/`에 통합

**주요 URL 패턴**
```
/app-development/{region}/     /web-development/{region}/
/mvp/{region}/                 /flutter/{region}/
/ai-development/{region}/
/l/{keyword-slug}/             (레거시)
/h/{hub}/                      (레거시 키워드 허브)
```

**중복 콘텐츠 위험 — 낮음.** 템플릿은 공통이지만 지역마다 `intro`·`access`·`scene`·`faq` 4개 필드가 **실제 서술로 각각 작성**돼 있고(변수 치환 아님), 히어로 SVG의 alt·색상도 지역별로 다르다. 무엇보다 **거점 3곳 외 전부 noindex**라 도어웨이 노출 자체가 없다. `siblingRegions()`가 같은 상권 그룹 우선으로 내부링크를 분산시켜 특정 6개에만 링크가 몰리는 문제도 이미 해결돼 있다.

**개선 전략 (제안, 이번 단계 실행 안 함)**
1. 현 정책(거점 3곳만 색인) 유지 — 전국 비대면 사업 모델과 정합적이고 리스크가 가장 낮다.
2. 색인 확장은 **네이버 플레이스·GBP 등 실제 로컬 신호가 생긴 지역**에 한해 `INDEXED_REGION_SLUGS`에 추가하는 방식으로.
3. noindex 335개는 `follow`라 링크 주스를 허브로 전달 중 — 유지.

---

## 9. 네이버 SEO 현황

| 항목 | 상태 |
|---|---|
| 사이트 소유 확인 (meta) | ✅ `app/layout.tsx:57` `naver-site-verification` — **단, `/` 는 index.html이라 meta 없음** |
| 사이트 소유 확인 (HTML 파일) | ✅ `public/naverc5cec99213f37fb5e43c436811e8664e.html` → 홈 포함 전 사이트 커버 |
| robots Yeti 허용 | ✅ (와일드카드) / ⚠️ 명시 블록 없음 |
| sitemap | ✅ `/sitemap.xml` 835 URL |
| RSS 피드 | ⚠️ 존재하나 **내용이 죽어 있음 → C1** |
| JS-only 렌더링 | ✅ 없음. 정적 export + 포트폴리오 정적 주입으로 Yeti가 본문을 전부 읽는다 |
| 네이버 채널 sameAs | ✅ 플레이스·블로그·인스타·카카오채널·GBP 5종 (`lib/seo.ts:23-30`) |
| 사업자 정보 노출 | ✅ 사업자등록번호·대표자·주소를 `BusinessFooter`·JSON-LD `identifier`로 노출 (E-E-A-T) |

**네이버 관점 최대 리스크는 C1(피드)** 하나다. 나머지 기술 기반은 국내 대행사 평균 대비 상당히 정돈돼 있다.

---

## 10. AI Search / GEO 현황

| 파일 | 상태 |
|---|---|
| `/llms.txt` | ✅ 빌드마다 생성 (`scripts/generate-llms.mts`). 내용이 `lib/seo.ts`·`index.html` 가격표에서 파생돼 **실제 서비스 구조와 일치**. 패키지 8종·자연어 QA 12쌍·기본 정보 포함 |
| `/llms-full.txt` | ❌ 없음 → 추가 대상 |

- AI 크롤러 차단 없음(robots allow-all) — 인용 가능 상태.
- JS 없이 본문이 읽히는 정적 HTML이라 GPTBot·ClaudeBot·PerplexityBot 인용에 유리.
- 다만 `llms.txt`가 참조하는 홈 서술과 실제 `index.html` 홈 문구가 C2 때문에 어긋난다.
- IndexNow 키 파일(`public/reumlab2026indexnow9370.txt`) + `scripts/submit-indexnow.mjs`가 빌드 후 자동 실행되어 Bing/Yandex 즉시 통보. ✅

---

## 11. Core Web Vitals 위험요소

| # | 항목 | 근거 | 영향 |
|---|---|---|---|
| 1 | **Google Fonts 4패밀리 19 weight 렌더 블로킹** | `app/layout.tsx:69-72`. Noto Sans KR 5 weight 포함, `next/font` 미사용 | **FCP/LCP — 가장 큼** (800여 페이지 전체) |
| 2 | **Pretendard CDN 렌더 블로킹** | `index.html:160`, purpose landing. 서드파티 도메인 의존 | FCP (홈 + 랜딩 9페이지) |
| 3 | `styles.css` 100KB + `script.js` 40KB 비압축 원본 | 루트 파일, 번들러 미경유 | FCP / TBT |
| 4 | `og-image.jpg` 4.3MB | H2 | 페이지 렌더에는 무관, 스크래퍼·이미지 크롤 대역폭 |
| 5 | GTM + GA4 gtag + Meta Pixel 3종 동시 로드 | `index.html:6-21,163`, `components/Analytics.tsx` | TBT / INP |
| 6 | `cms-promo.mp4` 1.25MB 자동재생 | `index.html:609` | 낮음 — `preload="metadata"` + poster + 중단부 배치로 **이미 방어됨** |
| 7 | hero 이미지 우선 로딩 | 홈 hero는 CSS 그라디언트/SVG 기반, `<img>`는 전부 `loading="lazy"` | 낮음 — 문제 없음 |
| 8 | client component | 8개뿐(`Nav`, `FloatingContact`, `SohoForm` 등), 전부 소형 | 낮음 — hydration 부담 작음 |
| 9 | CLS | 모든 `<img>`에 width/height 명시 | 낮음 — 방어됨 |

**요약: CWV 리스크의 대부분이 폰트 로딩 하나에 몰려 있다.** 나머지는 이미 정석대로 처리돼 있다.

---

## 12. 수정 권장 순서

> 원칙: 기존 URL 삭제·slug 변경·리팩터링·SEO 무관 UI 수정은 하지 않는다.

1. **[2단계] 구조화 데이터 엔티티 그래프 통합** (H1)
   `SITE`를 단일 출처로 `#organization` / `#localbusiness` / `#website` `@id` 노드를 정의하고, 모든 페이지가 그 `@id`를 참조하도록 배선. dangling `provider` 제거, `@id` 없는 중복 Organization 제거, `index.html` 하드코딩본을 같은 값으로 정렬.
2. **`og-image` 정상화** (H2) — 실제 JPG 1200×630(200KB 이하) 재생성 + `Organization.logo`용 정사각 로고 분리.
3. **`feed.xml` 재작성** (C1) — 사이트맵과 같은 색인 게이트를 통과한 URL만, 블로그·가이드 최신순으로.
4. **robots.txt 명시화 + `llms-full.txt` 추가** (M1, M2) — Yeti/Googlebot/Bingbot/AI 크롤러 블록 명시(허용 유지).
5. **홈 메타 단일 출처화** (C2) — `index.html`과 `lib/seo.ts` 값 정렬 + 빌드 시 불일치 검증. 홈에 hreflang·RSS alternate 추가.
6. **purpose landing FAQ 개별화** (H4).
7. **색인 게이트 임계 재보정** (H3) — GSC "크롤됨-현재 색인 안 됨" 확인 **후** 판단.
8. **폰트 통합 및 `next/font` 도입** (H5) — 패밀리·weight 실사용 조사 후.
9. **잔여 정리** (M3~M5) — theme-color 통일, `admin-guide-example.html` noindex, `SITE_VERIFICATION_README.txt` 제거, 404 canonical trailing slash.

---

## 실제 수정이 필요한 파일 경로

**2단계(구조화 데이터) 대상**
- `components/JsonLd.tsx`
- `lib/seo.ts`
- `app/[slug]/page.tsx`
- `app/page.tsx`
- `index.html`
- `scripts/generate-purpose-landings.mjs`

**3~4단계 대상**
- `scripts/generate-feed.mjs`
- `app/robots.ts`
- `scripts/generate-llms.mts`
- `public/og-image.jpg`
- `public/og-default.png`

**5단계 이후 대상**
- `app/layout.tsx`
- `package.json` (`copy:home` 검증 단계 추가 시)
- `lib/index-quality.ts`
- `lib/website-industries.ts` / `lib/industries.ts` / `lib/cost.ts` / `lib/solution.ts`
- `public/site.webmanifest`
- `public/assets/admin-guide-example.html`
- `public/SITE_VERIFICATION_README.txt` (삭제)
- `app/not-found.tsx`

**변경하지 않을 것**
- `app/sitemap.ts` — 현 구조 정상
- `public/_redirects` — 301 매핑 정상
- `lib/pseo.ts` `INDEXED_REGION_SLUGS` — 현 지역 정책 유지
- `lib/lastmod.ts` — 정상
- 모든 `*Canonical()` 헬퍼 — URL 구조 유지
