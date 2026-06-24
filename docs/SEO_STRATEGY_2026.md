# 름랩 REUMLAB — 검색 상위노출 전략 (2026 재설계)

> 작성 기준: 실제 코드베이스(`reumlab.com`, Next.js 14 static export) 분석.
> 대상: 대표(성아름) 우선순위 판단 / 개발자 즉시 작업 / 마케터 즉시 운영.
> 핵심 원칙: 블랙햇 금지. 가짜 후기·키워드 도배·지역명 치환 도어웨이·클로킹 금지.

---

## 0. 전제 정정 — "단일 1페이지" 진단은 더 이상 유효하지 않다

브리프는 사이트를 "커스텀 HTML 단일 랜딩(앵커 1페이지)"으로 가정한다. **실제로는 아니다.**
현재 `reumlab.com`은 이미 **Next.js 14 정적 export 기반의 ~500 URL 프로그래매틱 SEO 시스템**이다.

| 구성 | 라우트 | 규모 | 코드 위치 |
|---|---|---|---|
| 메인(영업 랜딩) | `/` | 1 | 배포본은 **레거시 `index.html`** (`copy:home`이 Next 출력 위에 덮어씀) |
| 한글 서비스 슬러그 | `/웹개발` `/앱개발` `/스타트업MVP` `/솔루션SaaS` `/플랫폼개발` `/기업용ERP` | 6 | `lib/seo.ts` + `app/[slug]/page.tsx` |
| 영문 서비스 | `/app-development` `/web-development` `/mvp-development` `/flutter-development` | 4 | `lib/seo.ts` |
| 서비스 허브 | `/mvp` `/flutter` `/ai-development` | 3 | `lib/seo.ts` |
| **지역×서비스 (pSEO 1축)** | `/{service}/{region}` | **5×22 = 110** | `lib/pseo.ts` + `app/[slug]/[region]/page.tsx` |
| 업종×앱개발 (2축) | `/app/{industry}` | `lib/industries.ts` | `app/app/[industry]/page.tsx` |
| 가이드 / 비교 | `/guide/{topic}` `/compare/{slug}` | `lib/guides.ts` `lib/compare.ts` | — |
| 블로그 | `/blog/{slug}` | `lib/blog-posts.ts` | — |
| **레거시 랜딩/허브** | `/l/{slug}` `/h/{hub}` | **328 + 38** | `content/landings.json` `content/clusters.json` |
| SOHO | `/soho` | 1 | `app/soho/page.tsx` |

→ **개별 키워드 색인은 이미 가능하다.** `public/sitemap.xml`에 367+ URL이 들어 있고 JSON-LD·canonical·OG도 페이지별로 적용돼 있다.

**그래서 진짜 병목은 정반대다.** "더 많은 페이지"가 아니라 **"이미 많은 페이지를 색인당해도 페널티를 안 맞도록 품질을 통제하는 것"** 이 핵심이다.

---

## 1. 한 줄 결론

- **지금 가장 큰 병목 = ① 색인 품질 게이트 부재(전 페이지 무조건 `index:true`) + ② 신뢰자산(실제 포트폴리오·후기) 부재 + ③ 레거시/앱 이중 시스템·홈 canonical 분열 같은 기술 부채.**
- **수천/수만 색인을 노리기 전에 먼저 할 일 = 지금 색인 중인 ~500개부터 "고유성 검증 통과한 것만 남기고 나머지는 noindex"로 정리.** 양이 아니라 통과율을 관리해야 구글 Helpful Content / 네이버 저품질 필터를 피한다.

---

## 2. 현재 상태 진단

| 항목 | 평가 | 근거 |
|---|---|---|
| 네이버 검색자산(웹문서/블로그/지식인) | △ | 서치어드바이저 소유확인 메타 존재(`app/layout.tsx`), 사이트맵 제출 가능. 그러나 **자사 블로그/지식인 활동 흔적 없음**, sameAs는 `naver.me/FORRCoFc` 1개뿐 |
| 스마트플레이스(보조축) | △ | `naver.me` 링크 1개로 연결 추정. 플레이스 상세설명·요금·사진·톡톡 동선은 코드로 확인 불가 → §15 체크 |
| 포트폴리오/후기 신뢰자산 | ✗ | **실제 포트폴리오 0건.** `templates.json`에 가공 후기 19개가 있었음 → **본 작업에서 제거**(§3). 신뢰 증거가 비어 있는 게 최대 전환 병목 |
| 메인 페이지 SEO | △ | 배포 홈이 레거시 `index.html`. canonical이 `https://reumlab.com`(슬래시 없음)였음 → **`/`로 정정**(§14). 단, 앱의 `ReumSalesLanding`(`app/page.tsx`)은 `/`에서 안 쓰임(데드) |
| 구조화데이터 | ○ | Organization/LocalBusiness/ProfessionalService/Service/FAQPage/BreadcrumbList/Article/WebSite 모두 구현(`components/JsonLd.tsx`). **가짜 평점/리뷰 schema 없음 = 안전** |
| sitemap/robots | △ | `app/sitemap.ts`(동적) + `public/sitemap.xml`(정적 2,216줄) **이중 존재** → 빌드 시 출처 단일화 필요. robots는 `Allow:/`만 |
| 프로그래매틱 구조(멀티페이지) | ○ | 이미 5축 가까이 구현. 단 **품질 게이트가 없어** 얇은 페이지도 전부 색인 |
| 콘텐츠 허브(인사이트/블로그) | △ | `lib/blog-posts.ts`(47KB) 존재. 발행 주기·내부링크 밀도·네이버 연동은 운영 영역 |
| 외부채널 sameAs | ✗ | `naver.me` 1개. 인스타/유튜브/카카오/깃허브/구글비즈 미연결 → 엔티티 신뢰 약함 |

---

## 3. 스팸 위험 진단 (이 시스템 고유)

**현재 위험 (이번에 조치한 것 포함)**
- ❌→✅ **가공 후기 19개**(`templates.json.reviewPool`, "B사 대표/스타트업 N" 등)가 레거시 랜딩 빌더(`build-landings-pages.mjs`)에서 "고객 후기"로 렌더됨 → **표시광고법 위반 + 검색 신뢰 훼손**. **본 작업에서 데이터·렌더·헬퍼 전부 제거.**
- ⚠ **지역×서비스 110개 전부 `index:true`** + 무게중심이 "수원 본사 1곳" → 강남/송파/인천처럼 본사와 무관한 지역까지 색인하면 **도어웨이 페널티 리스크**. `lib/pseo.ts`가 지역별 고유 단락(intro/scene/access/faq)을 갖춘 건 좋으나, **고유성을 자동 검증하는 게이트가 없다.** (지역 페이지의 차별화는 상담 방식이 아니라 **지역 상권(`scene`)**에 싣는다 — 페이지 본문은 상담 모드를 언급하지 않는다.)
- ⚠ **레거시 `/l/` 328 + 앱 pSEO** 가 키워드 영역이 겹침 → 자기잠식·중복 색인 가능.

**대량 페이지 생성 시 위험**
- 데이터 치환만으로 수천 개를 찍으면 즉시 저품질 필터. 네이버는 신생 도메인의 대량 유사 페이지에 특히 가혹하다.

**피해야 할 방식**: 본문 동일 + 지역명만 치환 / 빈 CTA-only 페이지 / 모든 페이지 동일 이미지·FAQ / 가짜 후기·평점 / 보이지 않는 schema.

**안전한 방식**: §4 색인 게이트(80점 룰)를 **모든 프로그래매틱 라우트에 강제** → 통과한 것만 `index`+사이트맵, 나머지는 `noindex,follow`(링크 자산은 유지).

---

## 4. Programmatic SEO 아키텍처 + 색인 게이트

**이미 추가됨:** `lib/index-quality.ts` — 15요소/100점 채점기.

```
80점↑  → index           (사이트맵 포함)
60–79  → soft-noindex    (보강 후 index, 지금은 noindex,follow + 사이트맵 제외)
60 미만 → noindex,follow  (사이트맵 제외)
중복(Jaccard ≥0.7) → -40점 즉시 탈락
```

**배선(다음 PR에서 적용) — 코드 패턴:**
```ts
// app/[slug]/[region]/page.tsx > generateMetadata
import { scoreIndexability, robotsFor, fingerprint } from '@/lib/index-quality';

const decision = scoreIndexability({
  title, description, h1,
  uniqueBodyText: region.intro + region.scene + region.access + service.intro,
  faqQuestions: [region.faq.q, service.faq.q, combinedFaq.q],
  internalLinks: siblings.length + 2,
  hasConsultCta: true,
  hasDecisionInfo: true,                 // priceLine + deliverables 존재
  hasLocalAccessInfo: Boolean(region.access),
  hasUniqueMedia: false,
  peerFingerprints: REGIONS.filter(r => r.slug !== region.slug)
                           .map(r => fingerprint(r.intro + r.scene)),
});
return { ...meta, robots: robotsFor(decision) };
```
→ **사이트맵(`app/sitemap.ts`)에서도 동일 `decision.inSitemap`으로 필터**해야 신호가 일치한다.

**색인 조건(요약)**: 고유 title/desc/H1 + 본문 800자↑ + 고유 FAQ 3개 + 내부링크 3개 + 의사결정정보 + 상담 CTA + (지역이면)접근성 + 중복<70%.
**noindex 조건**: 위 미달 / 본문 500자 미만 / 동일 이미지·FAQ / 빈 CTA-only / 70%↑ 중복 / 아직 실제 제공 어려운 지역·용도.
**canonical 조건**: 매우 유사한 지역은 가장 강한 대표(수원/경기 본진)로 canonical, 핵심 서비스 허브(`/flutter` `/mvp` `/app-development`)를 축으로. UTM은 원본으로 통일, 외부 리다이렉트 URL 비색인.
**sitemap 조건**: `inSitemap===true`만 포함, lastmod 자동, priority 남발 금지, 1,000개 단위 분리(sitemap index).

---

## 5. 1차로 "남길" 페이지 (신규 생성 X — 기존 정리 우선)

신생 도메인 단계에서 **새 페이지를 더 찍는 것보다, 색인 자격 통과 50개를 확정**하는 게 먼저다.

| 그룹 | URL | 검색의도 | 대표 키워드 | index |
|---|---|---|---|---|
| 메인 | `/` | 브랜드/외주개발 | 름랩, 앱개발 외주 | ✅ |
| 서비스 허브 | `/flutter` | Flutter 외주 | Flutter 앱개발 외주 | ✅ |
| 서비스 허브 | `/mvp` | MVP 검증 | MVP 개발 외주 | ✅ |
| 서비스 허브 | `/ai-development` | AI 챗봇 외주 | AI 외주개발 | ✅ |
| 서비스 | `/앱개발` `/웹개발` `/스타트업MVP` | 상업형 | 앱개발/홈페이지제작 | ✅ |
| 지역×서비스 (수원·경기 핵심) | `/app-development/suwon` `/.../hwaseong` `/.../yongin` `/.../dongtan` `/.../seongnam` `/.../bundang` `/.../pangyo` 등 **상권 서술이 분명한 핵심 ~20개** | 지역 상업형 | 수원 앱개발 등 | ✅ |
| 지역×서비스 (원거리) | `/.../incheon` `/.../songpa` `/.../mapo` 등 | 지역 상업형 | — | △→게이트 판정 |
| 가이드 | `/guide/*` 비용/체크리스트 | 정보형 | MVP 개발 비용 | ✅ |
| 블로그 | `/blog/*` 상위 6~8개 | 정보형 | 외주 전 체크리스트 등 | ✅ |

> 권장: **22개 지역 전부 유지**하되, 각 페이지 차별화는 `scene`(지역 상권)에 싣는다. 수원/화성/용인/동탄/성남/분당/판교처럼 검색량·상권 서술이 분명한 지역을 우선 노출하고, 상권 서술이 빈약한 지역은 §4 게이트의 **중복 70% 룰**로 모니터링해 통과 못 하면 noindex. 지역명만 다르고 본문이 같으면 색인 가치가 없다. (지역 차별화에 상담 방식 언급은 쓰지 않는다.)

---

## 6. 2차 확장 전략 (지금이 아니라, 신뢰자산 쌓인 뒤)

- **확장 조합**: 서비스(5) × 상황(예비창업/비개발자/정부지원/투자데모/소스코드복구) — `app/for/*` 신설. 지역축 무한 증식보다 **상황축**이 B2B 전환에 강하다.
- **필요 데이터**: 상황별 고유 (대상·예상비용·기간·준비물·추천패키지·FAQ 3개·실제/익명 사례 1건).
- **noindex 처리**: 사례가 없는 상황 페이지, 본문 800자 미만, 기존과 70%↑ 중복.

---

## 7. 장기 수천/수만 페이지 — "가능 조건"부터

수만 색인은 **고유 콘텐츠 DB가 선행될 때만** 결과로 따라온다. 선결 조건:
1. **포트폴리오/사례 DB** — 프로젝트마다 (문제→해결→결과→산출물→스크린샷→기술스택). 1건이 (서비스/업종/지역/기술) 여러 색인 페이지의 "고유 근거"가 됨.
2. **FAQ DB** — 실제 상담에서 나온 질문을 슬러그가 아니라 주제별로 축적.
3. **자동 생성 품질 기준** = `lib/index-quality.ts` 80점 + 중복<70% 통과분만 사이트맵 등록.
4. **색인 관리** = 분기별 GSC/서치어드바이저에서 "노출 0·클릭 0·색인 안됨" 페이지를 noindex로 회수.

---

## 8. 메타태그 코드 (현황 + 교정)

- 메인: `index.html` `<head>` — title/desc/OG 양호, **canonical을 `/`로 정정 완료**.
- 서비스/지역/업종/가이드/블로그: `generateMetadata`로 페이지별 고유화 이미 됨(`app/**/page.tsx`). 추가 작업은 **robots에 `robotsFor(decision)` 주입**뿐.
- OG 이미지: 코드 전반 `og-image.jpg` 통일 권장(`templates.json.site.ogImage`만 `og-default.png` → `og-image.jpg`로 맞출 것).

---

## 9. JSON-LD (현황 = 양호, 보강점만)

`components/JsonLd.tsx`에 Organization/LocalBusiness/ProfessionalService/Service/FAQPage/BreadcrumbList/Article/WebSite 모두 구현됨. 보강:
- **`makesOffer`/`OfferCatalog`** 에 STANDARD(₩1,490,000)/DELUXE(₩4,990,000)/PREMIUM(₩7,990,000) 3개 Offer를 `priceCurrency:KRW`, `price`, `eligibleQuantity`로 명시 → 화면 표기와 1:1 일치(현재 홈 `index.html`엔 서비스명만, 가격 누락).
- **`sameAs`** 를 1개→다채널로(§11). 동일 배열을 Organization/LocalBusiness에 공유.
- **후기 schema는 실제 동의 후기 확보 전까지 금지**(현 상태 유지).
- 대표 신뢰가 필요하면 `Person`(성아름) 추가 가능, 단 화면에 보이는 정보만.

---

## 10. footer 사업자정보 (`components/BusinessFooter.tsx` 기준 보강)

표기 일관성 필수: **름랩(REUMLAB) · 대표 성아름 · 사업자등록번호 793-12-03247 · 경기도 수원시 팔달구 인계로124번길 19, 12층 1208호 · 평일 10:00–18:00 · 010-8111-9370 · ceo@eternalsix.com**.
footer 링크 = 네이버 플레이스 / 네이버 블로그 / 인스타 / 유튜브 / 카카오채널 → 이 목록이 곧 JSON-LD `sameAs` 배열과 **글자 그대로 일치**해야 엔티티가 강해진다.

---

## 11. 외부 채널 / sameAs (현재 최대 약점)

| 채널 | 역할 | reumlab.com → 보낼 링크 | → 사이트로 받을 링크 | sameAs |
|---|---|---|---|---|
| 네이버 스마트플레이스 | 지역 신뢰·저장 | 사이트/예약 | 플레이스 URL | ✅ |
| 네이버 블로그 | 정보형 검색 | 사이트 인사이트 | 글 하단 사이트 | ✅ |
| 네이버 지식인/카페 | 질문 선점 | 사이트 가이드 | — | — |
| 인스타그램 | 작업기/신뢰 | 프로필 링크 | 게시물→사이트 | ✅ |
| 유튜브/쇼츠 | 작업·교육 | 설명란 링크 | — | ✅ |
| 카카오채널 | 상담 동선 | 상담 CTA | — | ✅ |
| GitHub/포트폴리오 | 기술 신뢰 | 포트폴리오 | — | ✅ |
| 구글 비즈니스 | 구글 지역 | 사이트 | — | ✅ |

→ **즉시 할 일: 위 채널을 개설/연결하고 동일 NAP(상호·주소·전화)로 통일 → `JsonLd.tsx` sameAs 배열 교체.**

---

## 12. 경쟁사 분석 (브리프에 URL 미입력 → 프레임만)

분석축: title/desc, URL 구조(단일 vs 멀티), schema, footer 사업자정보, 네이버 블로그/지식인 연동, **포트폴리오 수**, 가격공개 여부, 내부링크, 속도/모바일, CTA.
**름랩이 이미 이기는 점**: 멀티페이지 pSEO·구조화데이터·가격 선공개(정액)·소스코드 이관 메시지.
**름랩이 지는 점(추격 필요)**: 실제 포트폴리오/후기 수, 외부 채널 신뢰, 블로그 발행 누적.
**단순 모방 금지선**: 경쟁사 키워드 페이지 복제 X. 차별 메시지(소스코드 이관+정액제+AI 운영교육)로만 승부.

---

## 13. 차별화 포지셔닝 (카피 뱅크)

핵심 문장: "외주 맡긴 앱, 다시는 외주에 묶이지 않게." / "만들고 끝이 아니라, 직접 운영 가능한 상태로 넘깁니다." / "VAT 포함 정액, 가격 먼저 공개." / "Flutter로 iOS·안드로이드 한 번에." / "소스코드·배포 권한 통째 이관." / "비개발자 대표도 직접 고칠 수 있게 1:1 교육." / "안 되는 건 안 된다고 먼저 말합니다." / "전국 어디서나 같은 패키지·같은 품질." / "14~30일, 핵심부터 빠르게." / "MVP로 검증하고 같은 코드 위에서 키웁니다."

---

## 14. 코드 적용 (이번 작업에서 한 것 / 남은 것)

**이번에 적용(이 브랜치):**
1. 가공 후기 제거 — `content/templates.json`(reviewPool 비움+정책 주석), `lib/data.js`(pickReviews/reviewPool 삭제), `scripts/build-landings-pages.mjs`(헬퍼·렌더·CSS 삭제).
2. 홈 canonical/OG 분열 정정 — `index.html` canonical·og:url·JSON-LD url을 `https://reumlab.com/`로 통일.
3. **색인 품질 게이트 신설** — `lib/index-quality.ts`(순수 함수, 빌드 무영향).

**남은 것(대표 승인 후 별도 PR):**
4. 게이트 배선 — `app/[slug]/[region]/page.tsx` + `app/sitemap.ts`에 `robotsFor`/`inSitemap` 적용(→ 일부 원거리 지역 noindex 전환, **현재 색인/트래픽에 영향**하므로 승인 필요).
5. 레거시 `/l/`·`/h/` vs 앱 pSEO **단일화** — 둘 중 하나로 통합(자기잠식 제거).
6. 사이트맵 출처 단일화 — `public/sitemap.xml` 정적본 폐기, `app/sitemap.ts`만.
7. `makesOffer` Offer 3종 + sameAs 다채널 주입.
8. 홈 전략 확정 — `/`를 레거시 `index.html`로 갈지 앱 `ReumSalesLanding`으로 갈지 택1(현재 앱 홈이 데드).

---

## 15. 네이버 스마트플레이스 개선안 (보조축)

체크: 업체명(름랩/REUMLAB) · 대표카테고리(앱개발/소프트웨어개발) · 보조카테고리(IT서비스) · 주소(인계로124번길 19, 1208호) · 전화 · 영업시간(평일 10–18, 주말휴무) · 톡톡/문의 동선 · 대표키워드 · 상세설명 · 이용요금(정액 패키지) · 사진(작업화면/사무실/상담/교육) · 사이트·블로그·인스타 연결 · 저장 유도.

**상세설명(800자 안)**: "름랩(REUMLAB)은 수원 인계동 외주개발 스튜디오입니다. Flutter로 iOS·안드로이드 앱을 한 번에 만드는 앱·웹 MVP 개발, AI 챗봇·자동화 개발, 소스코드 전체 이관, 그리고 비개발자 대표가 직접 운영·수정할 수 있도록 돕는 1:1 AI 운영 교육까지 한곳에서 진행합니다. VAT 포함 정액(웹 149만 원 / 앱 499만 원 / AI·고도화 799만 원)으로 가격을 먼저 공개하고 숨은 비용 없이 견적을 안내합니다. '만들고 끝'이 아니라 '운영 가능한 상태로 넘김'이 원칙이라, 완성 후 소스코드·GitHub 저장소·배포 권한을 통째로 이관합니다. 전국 어디서나 같은 패키지·같은 품질로 진행합니다. 기획서가 없어도 아이디어와 핵심 기능 한두 가지만 있으면 30분 무료 상담으로 시작할 수 있습니다."

대표 키워드 10: 수원 앱개발 / 앱개발 외주 / MVP 개발 / Flutter 앱개발 / 홈페이지 제작 / AI 챗봇 개발 / 소스코드 이관 / 비개발자 앱개발 / 경기 외주개발 / 스타트업 MVP.

---

## 16. 30일 신뢰자산 플랜 (가짜 금지)

- 진행 중/완료 프로젝트 **5건을 익명 사례화**(문제→해결→결과→산출물). 동의 시 실명/스크린샷.
- 실제 고객 **동의 후기 5건** 확보 — 납품 후 요청문(앱/웹/AI/교육용 각각), 대가성은 반드시 표기.
- 네이버 블로그 **실제 진행기 3건**.
- `/portfolio` 신설 → 사례 페이지가 §7 색인 DB의 1차 고유 근거가 됨.

---

## 17. 8주 콘텐츠 캘린더 (요지)

매주: 네이버 블로그 3 + 사이트 인사이트 2 + 인스타/쇼츠 3 + 지식인/플레이스 2.
주제 풀: 외주 전 체크리스트 / MVP 비용이 천차만별인 이유 / 초기창업에 Flutter / AI 챗봇 작게 시작 / 소스코드 이관을 받아야 하는 이유 / 유지보수비 줄이기 / 계약서 필수조항 / 예비창업패키지 앱 / 소스코드 못 받았을 때 / 화면 수와 비용 / 스토어 반려 사유 / 비개발자가 AI로 고칠 수 있는 수정 / 노코드 vs 외주 / 기능 우선순위 / 자동화로 줄인 반복업무.
재활용: 블로그(롱폼)→사이트 인사이트(정제)→인스타 카드→쇼츠. 각 글 하단 내부링크 = 관련 서비스 허브 + 상담 CTA(전화/이메일).

---

## 18. 우선순위 실행 리스트 (임팩트×난이도)

| 순위 | 작업 | 임팩트 | 난이도 |
|---|---|---|---|
| 1 | 가짜 후기 제거 *(완료)* | 높음(법/신뢰) | 낮음 |
| 2 | 색인 게이트 배선 + 사이트맵 동기화 | 높음 | 중 |
| 3 | 실제 포트폴리오/후기 5건 + `/portfolio` | 높음(전환) | 중 |
| 4 | sameAs 다채널 + 플레이스 정비 | 높음 | 낮음 |
| 5 | 레거시/앱 pSEO 단일화 | 중 | 중 |
| 6 | 사이트맵 출처 단일화 | 중 | 낮음 |
| 7 | Offer 3종 JSON-LD | 중 | 낮음 |
| 8 | 블로그 발행 루틴 가동 | 높음(누적) | 중 |

---

## 19. 2주 로드맵
- W1: 본 PR 머지 → 게이트 배선 PR(원거리 지역 noindex) → GSC/서치어드바이저에 사이트맵 재제출.
- W2: 포트폴리오 3건 + 후기 요청 발송 + sameAs 채널 3개 연결.

## 20. 1개월 로드맵
- 포트폴리오/후기 5건 완성, `/portfolio` 공개. 레거시/앱 단일화. 블로그 8편. 플레이스 사진 20장+상세설명 적용.

## 21. 3개월 로드맵
- 상황축(`/for/*`) 사례 기반 확장(게이트 통과분만). 색인 회수 1차(노출0 페이지 noindex). 키워드 순위·상담문의 KPI 측정.

---

## 22. 지금 당장 해야 할 10개 (순서대로)

1. **이 PR 리뷰·머지** (가짜 후기 제거 + 홈 canonical 정정 + 색인 게이트 모듈).
2. **§14-4 게이트 배선 승인 여부 결정** — 원거리 지역 페이지를 noindex로 돌릴지 대표 판단. (현 색인/트래픽 영향)
3. **서치어드바이저·GSC에서 사이트맵 재제출** + 주요 10개 URL 수집 요청.
4. **네이버 스마트플레이스** 상세설명(§15)·대표키워드·영업시간·사진 업데이트, 톡톡 동선 확인.
5. **sameAs 채널 연결** — 네이버블로그/인스타/유튜브/카카오/구글비즈 개설→`JsonLd.tsx` 배열 교체.
6. **실제 포트폴리오 3건 익명 사례화** 착수 + `/portfolio` 골격.
7. **납품 고객에게 동의 후기 요청** 발송(대가성 표기 양식).
8. **레거시 `/l/`·`/h/` 운명 결정** — 유지 통합 or 폐기(자기잠식 제거).
9. **사이트맵 출처 단일화**(`public/sitemap.xml` 폐기, `app/sitemap.ts`만) + Offer 3종 JSON-LD.
10. **블로그 첫 2편 발행**(외주 전 체크리스트 / MVP 비용 가이드) + 사이트 인사이트·상담 CTA 내부링크.

---

### 부록 A. 이번 커밋 변경 파일
- `content/templates.json` — reviewPool 비움 + 정책 주석
- `lib/data.js` — pickReviews/reviewPool 제거
- `scripts/build-landings-pages.mjs` — 후기 헬퍼·렌더·CSS 제거
- `index.html` — canonical/og:url/JSON-LD url 트레일링 슬래시 통일
- `lib/index-quality.ts` — **신규**: 색인 품질 게이트(15요소/100점, 중복 Jaccard)
- `docs/SEO_STRATEGY_2026.md` — 본 문서
