# 프로그래매틱 SEO · 다이나믹 라우팅 · 색인 전략 (SSOT)

> **문서 성격**: 현행 코드베이스(Next.js 14 `output: 'export'`) 기준의 **기술·운영 단일 소스(Single Source of Truth)**.
> 마케팅·신뢰자산·채널 전략은 `docs/SEO_STRATEGY_2026.md`를 참고. 이 문서는 **라우팅 구조 / 색인 게이트 / 사이트맵·색인 운영**에만 집중한다.
> **원칙**: 블랙햇 금지(지역명 치환 도어웨이·가짜 후기·클로킹·키워드 도배 금지). 양(URL 수)이 아니라 **통과율(고유성 검증)** 을 관리한다.

---

## 0. 한 줄 요약 (현재 상태)

- **인프라는 이미 구축 완료.** 색인 품질 게이트(`lib/index-quality.ts`)가 **모든** 프로그래매틱 축(지역×서비스·업종·가이드·비교·블로그·레거시 랜딩)에 배선돼 있고, `app/sitemap.ts`가 동일 판정으로 동기화된다.
- **남은 것은 "생성"이 아니라 "운영"이다** — ① 색인 수확/회수 루프(GSC·서치어드바이저) ② 레거시 `/l/`·`/h/` vs 앱 pSEO 자기잠식 정리 ③ 사이트맵 `lastmod` 안정화 ④ 신규 축 추가 시 게이트 강제.

---

## 1. 아키텍처 개요

```
Next.js 14 App Router  ·  output: 'export' (정적 export)  ·  trailingSlash: true
        │
        ├─ 라우트별 generateStaticParams()  →  빌드 시 전 URL 정적 생성
        ├─ dynamicParams = false            →  미등록 파라미터는 404 (도어웨이 차단)
        ├─ generateMetadata() → robots      →  lib/index-quality 게이트 판정을 robots에 주입
        │
        ├─ app/sitemap.ts   →  동일 게이트 판정으로 index=true URL만 등록 (신호 일치)
        ├─ app/robots.ts    →  Allow: / + sitemap 위치 + host
        └─ scripts/submit-indexnow.mjs  →  Naver·Bing 즉시 색인 요청
```

**핵심 설계 불변식(Invariant)**: *페이지 `robots`, 사이트맵 포함 여부, 목록/내부링크 노출은 항상 같은 게이트 판정을 쓴다.* 세 신호가 어긋나면(예: noindex인데 사이트맵에 있음) 크롤러가 품질 신호를 불신한다.

---

## 2. 다이나믹 라우팅 맵 (현행)

| 라우트 | 파일 | 파라미터 소스 | 색인 규칙 | canonical 규칙 |
|---|---|---|---|---|
| `/` | 배포본 `index.html` (`copy:home`) | — | index | `https://reumlab.com/` |
| `/[slug]` (서비스 pillar) | `app/[slug]/page.tsx` | `PAGE_SEO_MAP` 키 | `NOINDEX_PILLAR_SLUGS`→noindex, `REDIRECTED_PILLAR_SLUGS`→301(생성 제외) | `seo.canonical` |
| `/[slug]/[region]` (**1축: 지역×서비스**) | `app/[slug]/[region]/page.tsx` | `SERVICES×REGIONS` (5×22=110) | `regionServiceDecision` 80점 게이트 | `regionServiceCanonical` |
| `/app/[industry]` (**2축: 업종**) | `app/app/[industry]/page.tsx` | `INDUSTRIES` (~19) | `industryDecision` 게이트 | `industryCanonical` |
| `/guide/[topic]` (**3축: 가이드**) | `app/guide/[topic]/page.tsx` | `GUIDES` (~14) | `guideDecision` 게이트 | `guideCanonical` |
| `/compare/[slug]` (**3축: 비교**) | `app/compare/[slug]/page.tsx` | `COMPARES` (~7) | `compareDecision` 게이트 | `compareCanonical` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `BLOG_POSTS` (~413) | `blogShouldIndex` (600자↑ + Jaccard<0.7) | `blogCanonical` |
| `/portfolio/[slug]` | `app/portfolio/[slug]/page.tsx` | `PORTFOLIO` (~7) | `hasPortfolio` 게이트 | `portfolioCanonical` |
| `/l/[slug]` (**레거시 랜딩**) | `app/l/[slug]/page.js` | `landings.json` (328) | `landingIndexable` allowlist | 자기 URL |
| `/h/[hubSlug]` (**레거시 허브**) | `app/h/[hubSlug]/page.js` | `clusters.json` (~37) | `DUP_HUB_CANONICAL` 중복 허브 noindex | 대표 허브로 통합 |
| `/soho` | `app/soho/page.tsx` | — | index | 자기 URL |

**규칙**
- **모든 프로그래매틱 라우트는 `dynamicParams = false`** — 데이터에 없는 조합은 404. 임의 지역명 치환 URL이 색인되는 도어웨이 리스크를 원천 차단한다. (신규 축 추가 시에도 이 기본값 유지)
- **canonical은 항상 trailingSlash 포함**(`/mvp/`) — `trailingSlash: true`와 일치. 슬래시 유무 분열 금지.
- **중복 허브/필러는 대표로 canonical 통합** — `mobile-app`→`app-dev`, 얇은 한글 pillar→충실한 트윈으로 301(`public/_redirects`).

---

## 3. 색인 품질 게이트 (`lib/index-quality.ts`)

프로그래매틱 페이지가 **무조건 `index:true`로 나가지 않도록** 고유성을 100점 만점으로 채점한다.

| 점수 | 판정 | robots | 사이트맵 |
|---|---|---|---|
| **80↑** | `index` | index, follow | 포함 |
| **60–79** | `soft-noindex` (보강 후 index) | noindex, follow | 제외 |
| **<60** | `noindex` | noindex, follow | 제외 |
| 중복(Jaccard ≥ 0.7) | 즉시 −40점 | — | — |

**채점 항목(요약)**: 고유 title/desc/H1(각 10) · 본문 800자↑(20) · 고유 FAQ 3개↑(15) · 내부링크 3개↑(10) · 의사결정정보(가격/기간/산출물, 정규식 실측 10) · 상담 CTA(5) · 고유 미디어(5) · 지역 접근성(5) · **중복 감점(−40)**.

**측정 대상 = "실제 렌더되는 텍스트"** — 데이터 모델의 `true` 가정이 아니라 `decideFromContent`가 화면 본문을 토큰화해 실측한다. `detectDecisionInfo` 정규식이 가격/기간 신호를 확인하고, `peerFingerprints`로 형제 페이지와 Jaccard 유사도를 비교한다.

> **축별 게이트 변형**
> - 지역×서비스: `peerFingerprints`를 **지역 고유성(intro+scene)** 만으로 비교 → 공통 서비스 단락 때문에 정상 페이지가 오탐되지 않게 한다.
> - 블로그: 단순화된 게이트 — 본문 600자↑ + 누적 Jaccard<0.7 dedup(`indexableBlogSlugs`).
> - 레거시 랜딩: 점수제 대신 allowlist(`service_intent` 대표키워드 · 본거지 지역 · GSC 실적 earner)만 색인.

---

## 4. 색인 운영 플레이북 (Indexing Operations)

인프라가 끝났으므로, 성과는 **운영 루프**에서 나온다.

### 4-1. 사이트맵
- **현재**: `app/sitemap.ts` 단일 파일, 게이트 통과 URL만(현행 320개). `public/sitemap.xml` 정적본은 이미 폐기됨(중복 해소 완료).
- **`lastmod` 안정화 ✅ 적용됨** (`lib/lastmod.ts`): 정적/프로그래매틱 엔트리는 이제 `new Date()`(빌드시각)가 아니라 **각 콘텐츠 소스 파일의 git 커밋 날짜**를 lastmod로 쓴다 → 같은 커밋을 재배포해도 lastmod 불변 → 크롤 예산 churn 제거. (블로그·가이드·포트폴리오는 기존대로 `publishedAt` 사용)
- **URL 중복 제거 ✅ 적용됨**: `app/sitemap.ts` 말미에서 URL당 1개만 남기는 최종 방어선 추가. 데이터에 중복 slug가 있어도 사이트맵에 loc가 중복되지 않는다.
- **샤딩 임계치**: 색인 URL이 **1,000개 미만이면 단일 파일 유지**(현행 320개 → 단일 OK). 초과 시 축별 sitemap index로 분리(`sitemap-region.xml`, `sitemap-blog.xml` …). 하드 한도는 파일당 50,000 URL / 50MB.
- **priority 남발 금지**: 홈 1.0, 본거지(동탄·화성·수원) 0.8, 나머지 프로그래매틱 0.65–0.75로 이미 계층화됨. 유지.

### 4-2. 즉시 색인 (IndexNow) ✅ 변경분만 제출로 개선됨
- `scripts/submit-indexnow.mjs`가 Naver·Bing에 제출. 키 파일 `public/reumlab2026indexnow9370.txt`. Netlify 빌드(`netlify.toml`)가 빌드 후 자동 실행.
- **개선 완료**: `out/sitemap.xml`(색인 대상 URL만)을 읽어 커밋된 매니페스트(`scripts/.indexnow-manifest.json`)와 **lastmod를 비교해 변경분만** 제출한다. lastmod가 git 커밋 기준으로 안정화됐으므로, **같은 커밋 재배포 시 변경분 0 → 호스트 호출 안 함**(스팸 신호 방지). 플래그: `--all`(전량), `--dry-run`(제출 없이 변경분만 출력). 수동 실행: `npm run seo:indexnow`.
- **매니페스트 지속성 주의**: Netlify 빌드는 ephemeral(fresh clone)이라 스크립트가 갱신한 매니페스트가 커밋되지 않으면 다음 배포에서 "전량 신규"로 보일 수 있다. 진짜 변경분만 제출하려면 콘텐츠 커밋과 함께 `scripts/.indexnow-manifest.json`을 커밋하거나 Netlify build cache 플러그인으로 보존할 것.
- 구글은 IndexNow 미지원 → 사이트맵 + GSC "URL 검사 > 색인 요청"으로 커버.

### 4-3. 색인 수확·회수 루프 (분기별)
1. **수확(Harvest)**: 신규 배포 후 GSC·서치어드바이저에 사이트맵 재제출 + 핵심 URL 색인 요청.
2. **점검(Audit)**: GSC "페이지" 리포트에서 *색인 안 됨* 사유 확인 — `크롤됨-미색인`/`중복, 사용자가 선택한 표준 아님`이 뜨면 게이트가 못 거른 얇은/중복 페이지다.
3. **회수(Prune)**: **노출 0 · 클릭 0**이 2분기 지속된 페이지는 게이트 데이터에서 `noindex`로 전환(allowlist에서 제거 or 콘텐츠 보강). 색인 예산을 실적 페이지로 재배분.
4. **보강(Enrich)**: `soft-noindex`(60–79점) 페이지는 고유 본문·FAQ를 채워 80점↑로 승격.

### 4-4. 크롤 예산 (정적 사이트 특성)
- 정적 export라 서버 응답은 빠름 → 병목은 **중복/얇은 URL이 예산을 잠식**하는 것. 게이트가 이걸 막는 1차 방어선.
- `/l/` 328개 중 다수가 noindex,follow — **링크 자산은 유지하되 색인 예산은 안 쓰는** 올바른 상태. 단 §5 자기잠식은 별도 문제.

---

## 5. 열린 전략 결정 (승인 필요 · 트래픽 영향)

아래는 **현재 색인/트래픽에 영향**을 주므로 대표 판단 후 별도 PR로 진행한다.

| # | 결정 사항 | 현황 | 권장안 |
|---|---|---|---|
| 1 | **레거시 `/l/`·`/h/` vs 앱 pSEO 단일화** | 두 시스템이 키워드 영역 중첩 → 자기잠식 가능 | `/l/` 색인분(실적 earner)만 앱 pSEO 축으로 **점진 이관** 후 `/l/` 전량 301. 실적 없는 것은 이미 noindex라 급하지 않음 |
| ✅ | **블로그 저품질 배치 제거** | 생성기 버그로 25개 글이 각 5중복(125엔트리) + 15종 깨진 slug(`/blog/-1/` 등) 렌더 | **완료** — `lib/blog-posts.ts`에서 불량 배치 125개 전량 제거(534→409글). 깨진 URL·중복·유일 색인 필러(`flutter-12`) 모두 소멸 |
| 2 | **소프트-noindex(60–79점) 승격** | 게이트가 자동 분류 | 분기별 상위 트래픽 잠재 페이지부터 본문 보강 |
| 3 | **홈 전략 확정** | 배포 홈=레거시 `index.html`, 앱 `app/page.tsx`는 데드 | 택1 — 앱 홈으로 통일하면 유지보수·구조화데이터 일원화 |

> lastmod 안정화 / IndexNow 변경분 제출 / 블로그 저품질 배치 제거는 **이번 작업에서 적용 완료**(§4-1·§4-2·§5).
> 참고: 생성기(`scripts/*generate-blog*.mjs`)의 slugify가 한글 제목을 빈 slug(`-N`)로 만들고 배치를 중복 append한 버그가 근본 원인 — 재사용 시 slugify·중복검사 보강 필요.

---

## 6. 신규 프로그래매틱 축 추가 규칙 (Playbook)

새 축(예: `/for/[situation]` 상황축)을 추가할 때 **반드시** 다음을 지킨다. 이 순서를 어기면 도어웨이 페널티.

1. **데이터 우선**: 각 파라미터는 *고유* 본문(대상·비용·기간·준비물·추천패키지·FAQ 3개·사례 1건)을 가진다. 변수 치환만으로 채우지 않는다.
2. **게이트 배선 필수**: 라우트 `generateMetadata`에서 `decideFromContent(...)` → `robotsFor(decision)`. `peerFingerprints`로 형제 중복 비교.
3. **사이트맵 동기화**: `app/sitemap.ts`에 `if (decision && !decision.inSitemap) continue;` 추가.
4. **`dynamicParams = false`** + `generateStaticParams()`로 조합 명시.
5. **내부링크**: 브레드크럼 + 형제 스포크 + 상위 허브 링크로 최소 3개 확보(게이트 10점).
6. **canonical**: trailingSlash 포함, 유사 축은 가장 강한 대표로 통합.

> **확장 우선순위**: 지역축 무한 증식보다 **상황축**(예비창업/비개발자/정부지원/투자데모/소스코드복구)이 B2B 전환에 강하다. 단, 사례 데이터가 쌓인 뒤 착수.

---

## 7. 우선순위 실행 리스트

| 순위 | 작업 | 위험 | 임팩트 |
|---|---|---|---|
| ✅ | 사이트맵 `lastmod` 안정화 + URL 중복 제거(§4-1) | — | 완료 |
| ✅ | IndexNow 변경분만 제출(§4-2) | — | 완료 |
| ✅ | 블로그 저품질 배치 125개 제거(§5) | — | 완료 |
| 1 | GSC·서치어드바이저 사이트맵 재제출 + 색인 수확 루프 가동(§4-3) | 없음 | 높음 |
| 2 | 분기 색인 회수: 노출0 페이지 noindex(§4-3) | 낮음 | 중(예산 재배분) |
| 3 | `/l/`·`/h/` 단일화 착수(§5-1) | 중 | 중(자기잠식 제거) |
| 4 | soft-noindex 페이지 본문 보강 → 승격(§5-2) | 낮음 | 높음(누적) |

---

## 8. 불변식 체크리스트 (배포 전 자가검증)

- [ ] 새 프로그래매틱 라우트에 `dynamicParams = false` + 게이트 배선했는가
- [ ] `robots` 판정 = 사이트맵 포함 여부 = 목록 노출, **셋이 일치**하는가
- [ ] canonical에 trailingSlash 있고, 유사 페이지는 대표로 통합됐는가
- [ ] 신규 페이지 본문이 변수 치환이 아니라 고유 콘텐츠인가(게이트 80점↑)
- [ ] 사이트맵 `lastmod`가 빌드시각이 아니라 콘텐츠/커밋 기준인가
- [ ] 색인 URL 1,000개 초과 시 sitemap index로 샤딩했는가

---

### 부록. 관련 파일
- 게이트: `lib/index-quality.ts`
- 1축 지역×서비스: `lib/pseo.ts` · `app/[slug]/[region]/page.tsx`
- 2·3축: `lib/industries.ts` `lib/guides.ts` `lib/compare.ts`
- 블로그 게이트: `lib/blog-posts.ts`(`indexableBlogSlugs`)
- 레거시 게이트: `lib/data.js`(`landingIndexable`) · `app/l/` `app/h/`
- 사이트맵/robots: `app/sitemap.ts` · `app/robots.ts`
- 즉시색인: `scripts/submit-indexnow.mjs`
- 리다이렉트: `public/_redirects`
- 마케팅·신뢰자산 전략: `docs/SEO_STRATEGY_2026.md`
