# BASELINE — AI 전화상담 직원 구축 서비스 페이지 고도화 전 기준선

수집 시각: 2026-09-16 · 수집 방법: 작업 트리 직접 조사 + 직전 빌드 산출물(`out/`) 측정
이 문서는 **변경 전 상태의 사실 기록**이다. 목표치나 예상값을 적지 않는다.

---

## 1. 저장소·브랜치

| 항목 | 값 |
|---|---|
| 저장소 | `samduck150906-lgtm/reumlab` |
| 기본 브랜치 | `main` |
| 작업 브랜치 | `claude/ai-voice-consultation-page-bq0jef` (main `a5aa77e`에서 분기) |
| 분기 시 HEAD | `a5aa77e` — perf: Link prefetch 낭비 제거 · 정적 덮어쓰기 경로 내비 수정 |
| 작업 시작 시 dirty 파일 | 없음 (`git status --porcelain` 출력 0줄) |
| 사용자 미커밋 변경 | 없음 — 삭제·스태시할 대상이 애초에 없었다 |

`out/` 은 `a5aa77e` 에서 생성된 직전 빌드 산출물(2026-09-15 06:17 UTC, HTML 1,351개)이며
이번 회귀 대조의 **BEFORE** 로 사용한다.

---

## 2. 배포 구조 (확인됨)

- Next.js 14 App Router, `output: 'export'` 정적 export → `out/`
- Netlify 배포. `netlify.toml`: 기본 `npm run build`, `[context.production]` 은 빌드 후 IndexNow 제출
- **POST Route Handler / Server Action 을 쓸 수 없다.** 정적 호스팅이라 실행되지 않는다.
- 빌드 파이프라인(순서 그대로):

```
prebuild → gen:feed → prepare-next-public → next build
        → copy:home(copy-home-assets → inject-portfolio-static → inject-service-menu)
        → generate-purpose-landings → gen:llms → split-sitemap → finalize-out
        → seo:verify:home-guide → seo:verify:ai-search → seo:verify:font
```

`next build` 이후 후처리가 산출물을 덮어쓰므로 **판정은 언제나 최종 `out/` 기준**이다.

---

## 3. 기존 `/ai-voice-development/` 구현 경로

| 파일 | 줄 수 | 역할 |
|---|---:|---|
| `app/ai-voice-development/page.tsx` | 661 | Server Component. metadata·JSON-LD·13개 섹션 렌더 |
| `app/ai-voice-development/ai-voice.module.css` | 445 | 페이지 전용 CSS Module |
| `app/ai-voice-development/ConversationDemo.tsx` | 91 | `'use client'`. 단일 시나리오 14발화 데모 |
| `lib/ai-voice.ts` | 493 | 콘텐츠 데이터 단일 출처. `lib/seo` · `lib/pricing` · `lib/index-quality` import |
| `lib/ai-voice-demo.ts` | 46 | **import 0개** 모듈. 데모 대사 14줄 + 필드 6개 |

### 3.1 클라이언트 경계 (보존 대상)

`lib/ai-voice-demo.ts` 는 의존성이 하나도 없는 모듈로 분리돼 있다.
`ConversationDemo.tsx`(`'use client'`)가 `lib/ai-voice.ts` 를 직접 import 하면
`lib/seo.ts`(1,124줄) → `lib/pricing.ts` 가 클라이언트 번들에 통째로 들어간다.
**이 분리를 되돌리지 않는다.**

### 3.2 변경 전 측정값

| 항목 | 값 |
|---|---:|
| `out/ai-voice-development/index.html` | 187,527 bytes |
| `<h1>` 개수 | 1 |
| `id="voice-*"` 고유 앵커 | 27 |
| `application/ld+json` 블록 | 4 |
| 라우트 전용 client chunk | `app/ai-voice-development/page-80cf….js` — 7,535 B raw / **3,164 B gzip** |
| 같은 라우트가 쓰는 공유 first-party chunk | `401`(19,257/6,669gz) `972`(26,066/8,671gz) `255`(6,377/2,478gz) |
| 참조 chunk 합계 | 588,419 B raw (framework 포함) |

§13.4 예산(신규 first-party client JS gzip +35KB 이내)의 **기준 파일은 라우트 전용 chunk
`app/ai-voice-development/page-*.js` 의 gzip 크기(3,164 B)** 로 정의한다.

---

## 4. 메타·색인 현황 (변경 전)

| 항목 | 값 |
|---|---|
| title | `AI 전화상담·음성 AI 개발 \| AI 상담원·예약 자동화 \| 름랩` |
| canonical | `https://reumlab.com/ai-voice-development/` (self-canonical) |
| robots | `index, follow` — `aiVoiceDecision()` 이 `index` 판정 |
| H1 | `AI 음성 상담·전화 자동화 개발` |
| OG 이미지 | `SITE.defaultOgImage` 재사용 (전용 이미지 없음) |
| JSON-LD | `ServiceWebPageJsonLd` — WebPage · Service · BreadcrumbList · FAQPage |

### 4.1 기존 섹션 앵커 (보존 대상)

`#voice-flow` `#voice-define` `#voice-how` `#voice-features` `#voice-demo` `#voice-industry`
`#voice-compare` `#voice-arch` `#voice-process` `#voice-cases` `#voice-cost` `#voice-faq`
`#voice-inquiry` `#voice-related`

명세가 요구하는 `#voice-demo` · `#voice-inquiry` 는 **이미 존재**한다. 그대로 쓴다.

### 4.2 이미 등록된 생성 파이프라인

| 파이프라인 | 상태 |
|---|---|
| `app/sitemap.ts` | `aiVoiceDecision()` 호출로 등록됨 ✓ |
| `scripts/generate-llms.mts` | 141행에 전용 요약 1줄 등록됨 ✓ |
| `lib/content-cluster.ts` | 145행 — 가이드 4개 배선됨 ✓ |
| `content/service-menu.json` (→ `inject-service-menu.mjs`) | 5번째 항목으로 등록됨 ✓ — 중복 추가하지 않는다 |

---

## 5. 문의 폼 경로 (확인된 계약)

```
LandingInquiryForm (variant="ai-voice")
  → fetch('/__forms.html', POST, application/x-www-form-urlencoded)
  → Netlify Forms 접수 저장
  → [담당자 알림 — 이 환경에서 미검증]
```

| 항목 | 값 |
|---|---|
| 폼 이름 | `main-apply` |
| 허니팟 | `bot-field` (`data-netlify-honeypot`) |
| hidden | `form-name` |
| 감지 스켈레톤 원본 | **`public/__forms.html`** (수작업 파일. 빌드가 `out/` 로 복사) |
| ai-voice 전용 기존 필드 | `현재응대방식`, `연동대상시스템` |
| 공통 필드 | `이름` `휴대폰번호` `이메일` `서비스유형` `핵심기능` `예상예산` `희망일정` `참고서비스` `개인정보동의` |
| 유입 맥락 hidden | `유입_랜딩` `문의서비스` `유입_경로` `페이지_유형` `관심_서비스축` `유입_출처` `최초_유입_페이지` `유입_채널` + `utm_*` `fbclid` |
| 성공 이벤트 | `inquiry_form_submit` · `main_apply_submit` · `form_submit_success` (dataLayer) + `EVENT.lead` — `leadSentRef` 로 1회 보장 |

### 5.1 확인되지 않은 지점 (이 환경의 한계)

- **Netlify Forms 실제 저장** — `reumlab.com` · `*.netlify.app` 은 이 컨테이너의 프록시가
  CONNECT 403 으로 차단한다. 실제 POST 를 보낼 수 없다.
- **담당자 알림 수신** — 알림 설정은 Netlify 대시보드 영역이며 여기서 확인 불가.
- 따라서 `LEAD_DELIVERY_VERIFIED` 는 이번 작업에서 **BLOCKED** 로 보고한다.
  로컬 정적 서버가 POST 에 200 을 돌려주는 것을 접수 성공으로 인정하지 않는다(§10.3-6).

### 5.2 폼을 공유하는 다른 페이지 (회귀 대상)

`variant="default"`(랜딩 `/l/*`), `"geo-website"`, `"ai-search-architecture"`, 홈 `index.html`,
`/soho/`(별도 `soho-diagnosis` 폼). **ai-voice 변형 밖을 건드리지 않는다.**

---

## 6. 검사 기준선 (변경 전 실행 결과)

| 명령 | 결과 |
|---|---|
| `npx tsc --noEmit` | **PASS** — exit 0, 오류 0 |
| `npm test` | **PASS** — 92/92 (suites 2, fail 0, 6.16s) |
| `npm run build` | 직전 빌드 성공 (산출물 `out/` 1,351 HTML) |

이번 페이지를 참조하는 자동 검증 스크립트: `scripts/verify-faq.mjs`(FAQ 화면↔스키마 패리티),
`scripts/verify-conversion.mjs`(폼·이벤트), `scripts/qa-final.mjs`(교차 검증),
`scripts/audit-indexability.mjs`, `scripts/verify-cannibalization.mjs`.
**FAQ 문구를 바꾸면 `verify-faq` 가 화면↔스키마 불일치로 실패한다** — 양쪽을 같은 배열에서 렌더할 것.

---

## 7. 회귀 대조 기준 (BEFORE 지문)

`/tmp/…/baseline/pages-before.txt` 에 12개 대표 URL 의
`title · description · canonical · robots · h1 수 · main-apply 폼 수 · tel 링크 수 ·
ld+json 수 · 내부 링크 수` 를 저장했다. 대상:

`/` `/ai-development/` `/enterprise-ai/` `/ai-automation/` `/geo-website/`
`/ai-search-optimization/` `/mvp/` `/reservation-commerce/` `/ai-voice-development/`
`/website/` `/flutter/` `/erp/`

(명세 §14.5 권장 8개를 모두 포함하며 4개를 더했다. 12개 모두 현재 존재함을 확인했다.)

---

## 8. 이번 작업에서 새로 발견한 경로

명세 §1.3 목록에 없었으나 실제로 필요한 파일:

| 경로 | 왜 필요한가 |
|---|---|
| `public/__forms.html` | 정적 감지 스켈레톤의 **실제 원본**. 명세는 "생성 원본을 찾으라"고만 했다. 생성기가 아니라 수작업 파일이다 |
| `content/service-menu.json` | 서비스 메뉴 **단일 출처**. 주입 스크립트가 아니라 이 JSON 이 원본이다 (ai-voice 이미 등록됨) |
| `scripts/verify-faq.mjs` | FAQ 화면↔스키마 패리티 게이트 — FAQ 를 16개로 늘릴 때 반드시 통과해야 함 |
| `components/SiteLink.tsx` | 정적 덮어쓰기 경로는 `<a>`, 나머지는 `next/link`. 내부 링크는 이걸 쓴다 |
| `lib/ai-search-form.ts` | import 0개 폼 상수 모듈의 **선례**. voice 폼 enum 도 같은 패턴을 따른다 |
