# 름랩 마케팅 소스 킷 — 다른 사이트에 이식하기

름랩(reumlab.com)이 실제로 굴리고 있는 유입 소스 전부를 한 덩어리로 묶은 것이다.
프로그래매틱 SEO 4축 + 지역축, 검색 SEO 공통 레이어, GEO(생성형 검색 대응),
광고 자동화, 배포 전 검증 스크립트, 전략 문서가 들어 있다.

만드는 법: `npm run pack:kit` → `dist-kit/reumlab-marketing-kit.zip`

> **중요 — 이 킷의 콘텐츠는 름랩 사업 정보다.**
> 가격·주소·전화번호·포트폴리오·업종 문장은 름랩 것이다. 다른 사이트에 그대로 올리면
> 사실과 다른 페이지가 색인된다. 아래 "① 갈아끼울 것"을 먼저 처리하고 시작할 것.

---

## 폴더 구조

| 폴더 | 내용 | 사이트가 바뀌어도 그대로 쓰나 |
|---|---|---|
| `00-config/` | next.config · tsconfig · netlify.toml · tailwind · `.env.example` · npm 스크립트 발췌 | 대부분 그대로 |
| `01-seo-core/` | 메타·구조화 데이터·사이트맵·robots·색인 게이트·전환 측정 | **로직은 그대로, 상수만 교체** |
| `02-programmatic-seo/` | 프로그래매틱 축의 데이터·라우트·생성 스크립트 | 구조는 그대로, 데이터는 교체 |
| `03-geo-ai-search/` | llms.txt 생성·GEO 검증·IndexNow·GBP 게시물 | 로직 그대로, 사실 문장 교체 |
| `04-ads-automation/` | 캠페인 생성·플랫폼 연동·성과 기반 자동 최적화 | 그대로 (API 키만) |
| `05-verify-qa/` | 배포 전 SEO/GEO 회귀 검증 18종 | 대부분 그대로 |
| `06-content-data/` | 랜딩·클러스터·템플릿 JSON | **전량 교체 대상** |
| `07-docs/` | SEO 전략·감사 리포트·키워드 시트 | 읽는 용도 |

`MANIFEST.txt` 에 전체 파일 목록이 있다.

---

## ① 갈아끼울 것 (순서대로)

1. **`01-seo-core/lib/seo.ts` 의 `SITE` 상수**
   상호·영문표기·도메인·OG 이미지·로고·전화·주소(+`addressParts`)·이메일·채널 링크.
   사이트 이름과 도메인이 여기 한 곳에서 나가므로 **제일 먼저** 바꾼다.
   같은 파일의 `PAGE_SEO_MAP`(필러 페이지 25개의 title/description/keywords)도 새 사이트의
   서비스로 다시 쓴다.
2. **`01-seo-core/lib/pricing.ts`** — 가격 단일 출처. 화면·구조화 데이터·llms.txt가 전부
   여기를 참조한다. 새 가격표로 교체하지 않으면 름랩 금액이 검색 스니펫에 나간다.
3. **`06-content-data/*.json`** — 랜딩·클러스터·템플릿·포트폴리오. 전량 교체.
4. **`02-programmatic-seo/lib/` 의 축 데이터** — 아래 ② 참고. 업종/지역 목록을 새 사업에 맞게.
5. **`03-geo-ai-search/scripts/generate-llms.mts` 의 `PACKAGES` 배열** — 패키지·가격·기간.
6. **소유권 증명 파일은 킷에 넣지 않았다.** Search Console·네이버 서치어드바이저·IndexNow 키는
   새 도메인에서 각자 발급받아 `public/` 에 넣는다. 코드에는 름랩 IndexNow 키 파일명이
   문자열로 남아 있으니(`routes/robots.ts`, `scripts/submit-indexnow.mjs`) 새 키로 바꿀 것 —
   남의 도메인 키로 제출하면 색인 요청이 무시된다.

---

## ② 프로그래매틱 SEO — 축이 어떻게 생겼나

각 축은 `데이터 배열 + 라우트 1개 + canonical 함수 + 색인 판정 함수` 네 조각이 한 세트다.
새 축을 만들 때도 이 네 조각을 그대로 복제하면 된다.

| 축 | 라우트 | 데이터 | 현재 항목 수 |
|---|---|---|---|
| 지역 × 서비스 | `/[slug]/[region]` | `lib/pseo.ts` (`REGIONS` × `SERVICES`) | 70 × 5 |
| 서비스 허브(필러) | `/[slug]` | `lib/seo.ts` `PAGE_SEO_MAP` | 25 |
| 업종 × 앱개발 | `/app/[industry]` | `lib/industries.ts` | 112 |
| 업종 × 웹사이트 | `/website/[industry]` | `lib/website-industries.ts` | 294 |
| 업종 × 제작비용 | `/cost/[industry]` | `lib/cost.ts` | 112 |
| 업종 × 솔루션 | `/solution/[industry]` | `lib/solution.ts` | 112 |
| 정보성 가이드 | `/guide/[topic]` | `lib/guides.ts` | 45 |
| 비교 | `/compare/[slug]` | `lib/compare.ts` | 3 |
| 시스템 구축 | `/system/[slug]` | `lib/systems.ts` | 7 |
| 블로그 | `/blog/[slug]` | `lib/blog-posts.ts` | — |
| 레거시 허브·랜딩 | `/h/[hubSlug]`, `/l/[slug]` | `content/*.json` → `lib/data.js` | — |

### 도어웨이 페이지가 되지 않게 만든 장치

이 킷에서 실제로 값이 나가는 부분은 페이지를 많이 찍는 코드가 아니라, **찍은 페이지 중
색인할 자격이 없는 것을 걸러내는 코드**다. 그대로 가져가길 권한다.

- **`lib/index-quality.ts`** — 페이지마다 고유 title/description/H1, 고유 본문, 고유 FAQ,
  내부링크 수, 의사결정 정보(가격·기간·산출물), 고유 미디어를 점수화한다.
  80점↑ index + 사이트맵, 60~79 `noindex,follow`, 60 미만 색인 제외.
  본문 토큰 Jaccard 유사도 0.7 이상이면 중복으로 보고 감점한다.
- **`lib/region-service.ts`** — 지역축과 서비스축을 각각 고유하게 써도 "조합"이 비면 결국
  같은 문장이 된다. 조합 단위 고유 문단을 따로 둔 이유.
- **`lib/search-intent.ts`** — 축마다 제목 문형을 여러 개 두고 slug 해시로 결정적으로 고른다.
  (빌드마다 흔들리면 색인이 요동치므로 `Math.random()` 금지)
- **`lib/voice.ts`** — CTA 문구·어투도 같은 방식으로 페이지마다 분기.
- **`lib/sibling-picker.ts`** — 관련 링크를 앞에서 N개 자르지 않고 고정 스트라이드로 뽑아,
  모든 항목이 정확히 같은 수의 내부링크를 받게 한다.
- **`lib/content-cluster.ts`** — 필러 ↔ 클러스터 양방향 배선(정보성 글 → 서비스 허브,
  서비스 허브 → 근거 가이드).
- **`lib/lastmod.ts`** — 사이트맵 lastmod 를 빌드시각이 아니라 콘텐츠 파일의 git 커밋일로.
  같은 커밋 재배포에도 lastmod 가 안 움직여 크롤 예산이 낭비되지 않는다.

---

## ③ GEO (생성형 검색 대응)

- **`scripts/generate-llms.mts`** — `llms.txt` / `llms-full.txt` 생성. 사이트 전체에 흩어진
  사실(무엇을 하는 회사인지·패키지·가격·기간·연락처)을 한 파일에 모아, 어떤 페이지로
  진입한 AI든 같은 사실을 인용하게 한다.
- **`scripts/verify-geo.mjs`** — GEO 회귀 검증. 파일 존재/인코딩/robots 차단 여부,
  Organization·ProfessionalService·llms.txt 의 사업 설명이 서로 같은지, 문서 안 URL 이
  실제 산출물에 있는지, 근거 없는 신뢰 신호("업계 1위", "100%")가 없는지,
  AI 가 답할 수 있어야 하는 질문 13개가 어디선가 답해지는지.
- **`01-seo-core/routes/robots.ts`** — AI 크롤러 그룹 처리. robots.txt 는 크롤러가 자기와
  가장 구체적으로 맞는 그룹 **하나만** 읽으므로, `User-agent: GPTBot` 그룹을 따로 두면
  그 크롤러는 `*` 의 Disallow 를 보지 않는다. 그래서 차단 경로를 배열 하나로 묶어
  모든 그룹이 공유하게 짰다. 새 차단 경로는 그 배열에만 추가할 것.
- **`scripts/submit-indexnow.mjs`** — Bing/네이버 계열 즉시 색인 제출.
- **`03-geo-ai-search/gbp/`** — 구글 비즈니스 프로필 게시물 생성물과 붙여넣기 가이드.

> llms.txt 는 어떤 검색엔진도 랭킹 요소로 보장하지 않는 비공식 관례다. robots.txt·사이트맵·
> 구조화 데이터를 대체하지 않는다. 원본 파일 주석에도 같은 한계를 적어 두었다.

---

## ④ 광고 자동화

`04-ads-automation/lib/programmatic-marketing.ts` 가 캠페인 타입(키워드·광고 카피·예산·타깃·
입찰·일정)을 정의하고, `ad-platform-integrations.ts` 가 구글/네이버/메타 API 연동,
`performance-optimizer.ts` 가 성과 기반 자동 조정, `marketing-dashboard-api.ts` 가 대시보드
집계를 맡는다. 실행은 `scripts/auto-marketing-campaigns.mjs` →
`deploy-campaigns-to-platforms.mjs` → `monitor-and-optimize.mjs` 순.
키는 `.env` 로만 넣고 코드에 박지 말 것.

---

## ⑤ 배포 전 검증 (이게 킷의 절반이다)

`05-verify-qa/scripts/` 를 `npm run` 에 배선해 두면 페이지가 늘어도 품질이 안 무너진다.

```
verify-sitemap          사이트맵 URL 실재성·중복
verify-cannibalization  축 간 자기잠식(같은 의도 페이지 충돌)
audit-indexability      색인 게이트 판정 집계
verify-faq / -content / -media / -pricing / -conversion   페이지 구성요소 존재
verify-region-pages / -service-hubs / -menu / -portfolio  축별 구조
verify-naver            네이버 대응
verify-geo              생성형 검색 대응 (③ 참고)
seo-audit / seo-index-report / qa-final                   종합
```

---

## ⑥ 새 사이트에 얹는 최소 절차

1. Next.js 14 App Router + 정적 export 프로젝트를 만든다 (`00-config/next.config.mjs` 참고).
2. `01-seo-core/` 를 `lib/` · `app/` · `components/` 로 옮기고 `SITE` 상수를 새 사이트 값으로.
3. 축을 하나만 먼저 켠다. 보통 "업종 × 서비스" 하나가 가장 빨리 붙는다 —
   `lib/industries.ts` 의 데이터 배열만 새 업종으로 갈아끼우고 라우트는 그대로.
4. `app/sitemap.ts` 에서 켠 축만 남기고 나머지 import 를 지운다.
5. `npm run seo:verify` · `seo:audit:index` · `seo:verify:cannibalization` 를 돌려
   색인 판정이 의도대로 나오는지 확인한 뒤 배포.
6. 그다음 축을 추가한다. 축을 한 번에 다 켜면 어느 축이 자기잠식을 만들었는지 못 찾는다.

## ⑦ 하지 말 것

- 지역 페이지를 "지점"으로 쓰지 말 것. 사업장이 한 곳이면 지역은 `Service.areaServed` 로만
  표현한다. (`01-seo-core/lib/seo-optimizer.ts` 는 없는 지점을 만들어 내는 구버전 모듈이라
  현재 어디에도 배선돼 있지 않다. 파일 상단 경고를 읽고, 스키마는 `lib/schema.ts` 만 쓸 것.)
- 평점·리뷰수·수상 등 근거 없는 신뢰 신호를 구조화 데이터에 넣지 말 것.
- 빌드마다 값이 달라지는 생성기(`Date.now()`, `Math.random()`)를 쓰지 말 것.
- 변수만 치환한 페이지를 색인하지 말 것 — 색인 게이트를 끄면 이 킷의 전제가 무너진다.
