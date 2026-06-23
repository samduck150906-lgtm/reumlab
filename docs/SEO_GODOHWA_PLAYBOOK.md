# 름랩 REUMLAB — 상위노출 전략 고도화 플레이북

> 전제: `docs/SEO_STRATEGY_2026.md`(기본 진단·구조)를 이미 적용한 상태에서 **랭킹을 끌어올리는 7개 고급 레버**를 다룬다.
> 기본 전략이 "색인 가능하게 만들기"였다면, 고도화는 "**색인된 페이지를 실제로 1페이지에 올리기**"다.
> 모든 항목은 현재 코드베이스(Next.js 정적 export, ~500 URL pSEO)에 바로 매핑한다.

---

## 0. 고도화 7대 레버 (우선순위)

| # | 레버 | 무엇을 움직이나 | 현재 격차 |
|---|---|---|---|
| 1 | **토픽 권위(Topical Authority)** | 주제 전체에 대한 사이트 신뢰 | 허브-스포크는 있으나 pillar 본문이 얇음 |
| 2 | **엔티티 SEO** | 브랜드 SERP·지식패널·신뢰 | sameAs 1개, 대표 엔티티 없음 |
| 3 | **내부링크 equity 설계** | 깊은 페이지로 랭킹 파워 전달 | 스포크→허브는 있으나 contextual link·orphan 관리 없음 |
| 4 | **SERP CTR / 타이틀 엔지니어링** | 같은 순위에서 클릭률 → 순위 상승 | 타이틀이 기계적, 스니펫 캡처 설계 없음 |
| 5 | **네이버 C-Rank / D.I.A 고도화** | 네이버 통합검색·VIEW·스마트블록 | 자사 블로그·지식인·플레이스 신호 빈약 |
| 6 | **E-E-A-T (B2B)** | 신뢰·전문성 = 상업 키워드 상위 | 포트폴리오·후기·대표 프로필 0 |
| 7 | **프로그래매틱 가드레일 + CWV** | 대량 색인의 품질·속도 | 색인 게이트 미배선, 폰트 렌더블로킹 |

---

## 1. 토픽 권위 아키텍처 (가장 큰 레버)

구글·네이버 모두 "이 사이트가 **이 주제 전체**를 다루는가"를 본다. 키워드 단건이 아니라 **클러스터**로 이긴다.

### 1-A. 4개 Pillar(기둥) 정의 — 현재 라우트에 매핑

| Pillar(허브) | 라우트 | 클러스터(스포크) | 보강 필요 |
|---|---|---|---|
| **앱 MVP 개발** | `/mvp` | `/mvp/{region}`×22, `/app/{industry}`, 가이드(비용/기간) | pillar 본문 2,000자+로 확장 |
| **Flutter 앱개발** | `/flutter` | `/flutter/{region}`, `/compare/flutter-vs-*`, 블로그(장단점) | "Flutter vs 네이티브/RN" 비교 보강 |
| **AI 외주개발** | `/ai-development` | `/ai-development/{region}`, AI 챗봇/자동화 가이드 | 실전 적용 사례 글 3개 |
| **소스코드 이관** | (신설 `/source-handover`) | "외주사에서 소스 못 받았을 때", 계약 조항 가이드 | **허브 페이지 자체가 없음 → 신설** |

> 핵심: **각 pillar는 그 주제의 "최종 결정 문서"**여야 한다. 비용·기간·산출물·적합/부적합·FAQ·관련 글을 한 페이지에 모으고, 모든 스포크가 pillar를 가리키고 pillar가 핵심 스포크를 되가리킨다(양방향).

### 1-B. "소스코드 이관" pillar는 름랩의 해자(垓字)
경쟁사가 안 다루는 차별 주제다. `/source-handover` 허브 + 클러스터(`/for/source-code-recovery`, `/insight/why-source-code-handover`, `/faq/source-handover`)로 **이 토픽을 독점**하면 "소스코드 주는 외주", "외주사에서 소스코드 못 받았을 때" 같은 고전환 키워드를 선점한다.

### 1-C. 실행
1. 4개 pillar 본문을 각 1,500~2,500자로 확장(현재 허브는 짧음).
2. `/source-handover` 허브 신설(`lib/seo.ts` PAGE_SEO_MAP에 추가 + `SERVICES`에 편입해 region 스포크 자동 생성).
3. pillar 하단에 "이 주제 글 전부" 클러스터 링크 블록.

---

## 2. 엔티티 SEO — 름랩을 "검색이 아는 회사"로

### 2-A. NAP 완전 일관성 (지금 당장)
상호·주소·전화가 **모든 채널에서 글자 단위로 동일**해야 엔티티가 묶인다.
`름랩(REUMLAB) · 경기도 수원시 팔달구 인계로124번길 19, 12층 1208호 · 010-8111-9370` — 사이트 footer / JSON-LD / 네이버 플레이스 / 인스타 / 구글 비즈니스 전부 동일 표기.

### 2-B. sameAs 확장 (현재 1개 → 6개+)
`components/JsonLd.tsx`의 `sameAs: ['https://naver.me/FORRCoFc']` 한 줄이 엔티티 신뢰의 병목. 네이버 블로그·인스타·유튜브·구글 비즈니스·GitHub/포트폴리오를 개설해 **동일 sameAs 배열을 Organization·LocalBusiness에 공유**.

### 2-C. 대표(성아름) Person 엔티티
B2B 외주는 "누가 만드는가"가 신뢰다. `Person`(성아름, 대표, worksFor 름랩) schema + 대표 소개 페이지 + 기술 글 작성자 표기 → E-E-A-T의 Authoritativeness 직결.

### 2-D. 브랜드 SERP 장악
"름랩"/"REUMLAB" 검색 시 1페이지를 자사 자산(사이트·블로그·플레이스·인스타·유튜브)으로 채운다. 브랜드 SERP가 깨끗하면 비브랜드 키워드 신뢰도 함께 오른다.

---

## 3. 내부링크 equity 엔지니어링

현재: 스포크→허브, 허브→스포크(`SeoServicePage` 22개 지역 링크) ○. 부족: **contextual cross-link, 앵커 다양성, orphan 감사.**

### 3-A. 링크 흐름 규칙
- **홈(가장 강함) → 4 pillar**를 본문에서 명시적으로 링크(현재 앵커 위주).
- pillar → 핵심 스포크 6~10개 + 관련 가이드/블로그.
- 모든 블로그/가이드 본문에 **문맥 내(in-content) 링크**로 관련 서비스 허브 1~2개(사이드바·푸터 링크보다 본문 링크가 강함).
- breadcrumb 전 페이지 적용(이미 JSON-LD엔 있음 → 화면에도 노출).

### 3-B. 앵커 텍스트 다양성
같은 페이지로 가는 링크의 앵커를 `Flutter 앱개발`만 반복하지 말 것. `Flutter로 iOS·안드로이드 동시 개발`, `Flutter MVP 외주`, `크로스플랫폼 앱개발`처럼 변주 → 과최적화 회피 + 롱테일 커버.

### 3-C. Orphan(고아) 페이지 감사
사이트맵엔 있는데 **어떤 페이지에서도 링크 안 되는 URL** = 크롤 우선순위 바닥. 블로그·가이드·compare가 서로/허브와 연결되는지 분기마다 점검(아래 측정 루프).

---

## 4. SERP CTR / 타이틀 엔지니어링

같은 순위라도 CTR이 높으면 순위가 오른다(특히 네이버). 현재 지역 타이틀이 `{지역} {서비스} | 소스코드 이관·정액 패키지 — 름랩`으로 기계적.

### 4-A. 타이틀 패턴(의도별)
- **상업형**: 숫자·가격·기간 삽입 — `Flutter 앱개발 외주 비용 | VAT 499만원·21일 정액 — 름랩`
- **지역 상업형**: `수원 앱개발 업체, 정액 499만원부터 | 소스코드 이관 — 름랩`
- **정보형(가이드)**: `MVP 개발 비용, 화면 수로 정해지는 이유 (2026)` — 연도·괄호·구체 수치.
- 60자 내, 핵심 키워드 앞쪽, 브랜드 뒤쪽.

### 4-B. 스니펫·리치결과 캡처
- **FAQPage**(이미 적용) → 검색결과 FAQ 확장 노출.
- **Offer 가격**(이번 커밋에 추가) → 가격 리치결과.
- 가이드 글은 정의 문장을 **40~55자로 H2 직후 배치** → 피처드 스니펫/지식스니펫 캡처.
- description은 "클릭 이유"(정액·소스코드 이관·14~30일)를 앞 120자에.

---

## 5. 네이버 고도화 (C-Rank · D.I.A · VIEW)

네이버는 구글과 알고리즘이 다르다. **출처 신뢰(C-Rank) × 문서 품질(D.I.A)**.

### 5-A. C-Rank (출처가 이 주제를 꾸준히, 깊게 다루는가)
- **자사 네이버 블로그**를 주제 집중(앱개발/MVP/외주) 으로 주 3회 발행 → 블로그 출처 점수 누적.
- 블로그 글 하단에서 사이트 해당 허브로 링크(블로그↔사이트 시너지).
- 한 주제(예: "앱개발 외주")로 블로그·사이트·지식인이 **함께** 노출되면 통합검색 점유율↑.

### 5-B. D.I.A / D.I.A+ (문서 자체의 경험·구체성)
- 일반론 금지. **실제 진행 화면·견적 표·기간 캘린더·체크리스트** 같은 1차 정보가 D.I.A 점수를 올린다.
- 글 길이보다 "직접 경험/구체 데이터" 밀도가 핵심.

### 5-C. VIEW·스마트블록·지식인 선점
- "앱개발 외주 비용", "비개발자 앱개발" 같은 질문형은 **지식인 답변 + 블로그**로 선점(자문자답·도배 금지, 실제 도움 답변).
- 스마트블록(주제별 묶음)에 들기 위해 같은 주제 콘텐츠를 클러스터로 축적.

### 5-D. 플레이스 신뢰축
B2B라도 수원 사무실 = 실재 신뢰. 플레이스 상세설명·정액요금·사진(작업/사무실/교육)·저장 유도·사이트/블로그 연결을 채우면 "수원 앱개발" 지역 상업 키워드의 보조 신뢰가 된다. (단, 상담 방식 문구는 쓰지 않는다.)

---

## 6. E-E-A-T (B2B 외주 전환 직결)

| 요소 | 검색이 보는 신호 | 름랩 사이트 요소 (격차) |
|---|---|---|
| **Experience(경험)** | 실제로 만들어봤는가 | **포트폴리오/사례 0 → 최우선 보강** (`/portfolio`, 익명 사례 5건) |
| **Expertise(전문성)** | 깊이 있는 기술 설명·대표 이력 | 대표 Person 엔티티 + 기술 심화 글 |
| **Authoritativeness(권위)** | 외부 언급·후기·인용 | 동의 후기 5건, 외부 채널 sameAs |
| **Trust(신뢰)** | 사업자정보·계약 안정성 | 사업자정보 ○ + **소스코드 이관 보증을 신뢰 메시지로 전면화** |

→ 름랩의 차별점(소스코드 이관·정액·운영교육)을 그대로 **신뢰 증거**로 배치하면 E-E-A-T 4요소가 동시에 강해진다.

---

## 7. 프로그래매틱 가드레일 고도화 + CWV

### 7-A. 색인 게이트 배선 (코드 — 승인 시 머지)
`lib/index-quality.ts`는 준비됐다. `app/[slug]/[region]/page.tsx` 메타와 `app/sitemap.ts`에 동일 판정을 물려, 얇은 페이지가 자동으로 빠지게 한다.

```ts
// app/[slug]/[region]/page.tsx — generateMetadata 내부
import { scoreIndexability, robotsFor, fingerprint } from '@/lib/index-quality';
const decision = scoreIndexability({
  title, description, h1: `${region.full} ${service.ko}`,
  uniqueBodyText: region.intro + region.scene + service.intro + service.deliverables.join(' '),
  faqQuestions: [region.faq.q, service.faq.q, combinedFaq.q],
  internalLinks: 8, hasConsultCta: true, hasDecisionInfo: true,
  hasUniqueMedia: false,
  peerFingerprints: REGIONS.filter(r => r.slug !== region.slug).map(r => fingerprint(r.intro + r.scene)),
});
return { /* ...meta... */, robots: robotsFor(decision) };
// app/sitemap.ts — 동일 decision.inSitemap 으로 region URL 필터
```
현재 22개 지역은 모두 80점↑로 통과(고유 intro+scene+FAQ 보유) → **지금 색인엔 변화 없음**, 미래 신규/얇은 페이지만 자동 차단. *de-index 가능성이 있어 머지는 승인 후.*

### 7-B. 자기잠식 정리
레거시 `/l/` 328 + 앱 pSEO가 키워드 영역 중복. 둘 중 하나로 **canonical 통일** 또는 약한 쪽 noindex → 중복 신호 제거(크롤 버짓 절약).

### 7-C. 사이트맵 단일화 + lastmod 정확화
정적 `public/sitemap.xml`(2,216줄, 정체) 폐기, `app/sitemap.ts`만 출처로. 블로그/가이드 `lastmod`를 publishedAt 기준으로(이미 일부 적용) 정확히.

### 7-D. Core Web Vitals
- `app/layout.tsx`가 Google Fonts를 **렌더블로킹 stylesheet**로 로드(4개 패밀리). → LCP 손해. `next/font`로 전환하거나 폰트 수 축소 + `font-display: swap`(URL엔 이미 swap).
- 이미지 WebP/AVIF + width/height 고정(CLS), LCP 이미지 preload.
- 정적 HTML이라 Yeti/Googlebot 렌더링은 유리 — 이 장점을 CWV로 마저 살린다.

---

## 8. 측정·반복 루프 (고도화의 엔진)

격주 루틴:
1. **GSC / 서치어드바이저** — 쿼리별 노출·CTR·평균순위. CTR 낮고 노출 높은 쿼리 → 타이틀 재작성(4-A).
2. **11~20위 쿼리** = 기회. 해당 페이지에 내부링크 +2, 본문 보강 → 1페이지로.
3. **노출 0·색인 안 됨 페이지** → 게이트로 noindex 회수(크롤 버짓 절약).
4. **콘텐츠 디케이** — 6개월+ 글의 순위 하락분 리프레시(날짜·수치·사례 갱신).
5. **Orphan 감사** — 사이트맵 URL 중 내부링크 0개 탐지 → 링크 추가.

KPI 트리: 색인수 → 노출수 → 클릭수(CTR) → 상담문의수 → 계약. 각 단계 병목을 분기로 추적.

---

## 9. 90일 고도화 실행 시퀀스

**0–30일 (기반·신뢰)**
- 포트폴리오 5건(익명 가능) + `/portfolio` 공개 → Experience 신호.
- sameAs 6채널 연결 + NAP 통일 → 엔티티.
- `/source-handover` pillar 신설(해자 토픽 선점).
- 색인 게이트 배선 PR(승인 후) + 사이트맵 단일화.

**31–60일 (토픽 권위)**
- 4 pillar 본문 2,000자+ 확장 + 클러스터 양방향 링크.
- 네이버 블로그 주제 집중 발행(주 3) + 사이트 허브 링크.
- 타이틀/스니펫 엔지니어링 1차(상위 노출 쿼리부터).

**61–90일 (확장·반복)**
- 상황축 `/for/*` 사례 기반 확장(게이트 통과분만).
- 지식인/VIEW 선점 + 동의 후기 5건.
- 측정 루프 가동: 11~20위 쿼리 끌어올리기 + 디케이 리프레시.

---

## 10. 지금 당장(고도화 한정) 5개
1. **`/portfolio` + 실제 사례 5건** — E-E-A-T Experience, 모든 pillar의 고유 근거.
2. **sameAs 6채널 + NAP 통일** — 엔티티 묶기(코드 1곳: `JsonLd.tsx` sameAs).
3. **`/source-handover` pillar 신설** — 경쟁사 안 다루는 해자 키워드 선점.
4. **상위노출 쿼리 타이틀 재작성** — GSC CTR 낮은 것부터(즉효).
5. **색인 게이트 배선 승인** — 대량 확장 전 가드레일 확정.

### 부록. 이번 커밋 변경
- `index.html` · `components/JsonLd.tsx` — OfferCatalog/makesOffer에 STANDARD/DELUXE/PREMIUM **실가격(KRW)** 추가 → 가격 리치결과 대응.
- `docs/SEO_GODOHWA_PLAYBOOK.md` — 본 문서(고도화 7대 레버).
