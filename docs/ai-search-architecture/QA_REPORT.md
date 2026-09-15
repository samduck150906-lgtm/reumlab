# QA 리포트 — /ai-search-optimization/

- 일시: 2026-09-15
- 브랜치: `claude/ai-search-architecture` (기준선 커밋 `16d04a4`)
- 환경: Linux 컨테이너, Node 22.22.2, Chromium 1194(`/opt/pw-browsers`), Lighthouse 13.4.1
- 검수 대상: **모든 후처리가 끝난 `out/`** 을 로컬 정적 서버로 서비스한 결과 (`next dev`/`next start` 로 대체하지 않음)
- 증거 보관: 세션 스크래치패드 `…/scratchpad/aisa/` (빌드 로그, 검증 로그, Lighthouse 원본, 스크린샷 14장). **공개 저장소에 커밋하지 않는다.**

상태 표기: `PASS` / `FAIL` / `NOT_RUN` / `BLOCKED` / `NOT_APPLICABLE`.
도구·권한이 없어 못 한 검사는 PASS 로 쓰지 않는다.

## 1. 실행한 명령과 결과

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run build` (전체 후처리) | exit 0 · 산출물 1,351 HTML · 사이트맵 792 URL |
| `npm test` | **90/90 pass** (기존 57 + 새 게이트 결함주입 33) |
| `npm run seo:verify` / `:faq` / `:pricing` / `:menu` / `:naver` / `:conversion` / `:cannibalization` / `:content` / `:geo` / `:portfolio` / `:media` / `:services` / `:regions` / `:home-guide` / `:ai-search` | 전부 exit 0 |
| `npm run seo:qa` · `seo:audit:index` · `geo:check-entities` · `neo:verify:indexnow` | 전부 exit 0 |

`seo:verify:services` 가 경고 1건을 남긴다 — `Service.name` 이 H1 과 다름. H1 은 명세가 지정한 문장(`기존 홈페이지에, / 검색과 AI가 이해할 구조를 더합니다.`)이고 `Service.name` 은 상품명이라 의도적으로 다르다. 기존 `/ai-voice-development/`·`/soho/` 도 같은 경고를 갖고 있고 스크립트는 exit 0 이다.

## 2. 필수 QA 매트릭스

| ID | 항목 | 상태 | 근거 |
|---|---|---|---|
| B01 | 변경 전 기준선 | PASS | `16d04a4` 에서 기준선 빌드·대표 10개 URL 메타 스냅샷 저장. `SEO_PRESERVATION.md` |
| B02 | 타입/빌드 | PASS | `typecheck` exit 0, 전체 후처리 `build` exit 0 |
| B03 | 반복 빌드 | PASS | 연속 재빌드 후 11개 핵심 산출물 해시 동일(buildId·청크 해시 제외) |
| U01 | 신규 경로 | PASS | `out/ai-search-optimization/index.html` 존재, 로컬 정적 서버 200, 화면 렌더 확인 |
| U02 | 기존 경로 | PASS | 사이트맵 791→792, 삭제 0. 기존 HTML 1,350개 canonical 변경 0 |
| S01 | 메타 | PASS | title/description/canonical 각 1개, 브랜드명 중복 없음, description 126자 |
| S02 | 초기 HTML | PASS | JS 끈 상태에서 H1·가격 3종·FAQ 15문항(질문+답변)·범위 카드 6장·목차 앵커 전부 확인 |
| S03 | canonical | PASS | https·reumlab.com·trailing slash·query/fragment 없음. 전역 canonical 스윕 통과 |
| S04 | 사이트맵 | PASS | `sitemap-pages.xml` 에 1회 등록. 기존 URL 보존, 전체 lastmod 갱신 없음 |
| S05 | robots | PASS | `robots.txt` 미변경, 새 페이지 `index, follow`, noindex 혼입 0 |
| S06 | schema | PASS | JSON 파싱 OK, 전역 `@id` 재사용·중복 정의 0, Offer 3종 minPrice/KRW/VAT 가 화면과 일치 |
| S07 | 내부 링크 | PASS | 내부 링크 9개 전부 실재. `/geo-website/` ↔ 새 페이지 양방향 |
| S08 | 경로 중복 | PASS | 새 URL 1개만 생성, `seo:verify:cannibalization` 통과 |
| C01 | 가격 | PASS | 250/390/690만 · VAT 포함 · "부터" · 범위 주석이 화면·비교표·Offer 에 일치 |
| C02 | 경계 | PASS | 진단 URL / 실제 수정 페이지 / 템플릿 / 기간 / 제외 항목이 카드·비교표·FAQ 에 구분 표기 |
| C03 | 사실 | PASS | 허위 점수·후기·가짜 AI 답변·성과·파트너 배지 없음. 금지 표현 검사 통과. 구조도에 "실제 AI 답변 화면이 아닙니다" 캡션 |
| C04 | NEO | PASS | "름랩 내부 작업 분류이며 네이버 공식 서비스명·인증명이 아니다" 고지가 본문·FAQ 에 있고 게이트가 강제 |
| F01 | 선택 전달 | PASS | START/GROWTH/ENTERPRISE CTA 클릭 → `#lf-package` 값 동기화 확인. hash 만 사용, query 없음 |
| F02 | validation | PASS | 필수 미입력·동의 미체크 시 전송 0건, `:invalid` 표시, 주소 200자·상담내용 1000자 제한, `javascript:` 스킴 거부, `example.com → https://example.com/` 정규화 |
| F03 | 폼 계약 | PASS | 실 폼 31필드 ↔ `__forms.html` 감지 폼 필드 일치(게이트가 대조) |
| F04 | 실패 처리 | PASS | 서버 500 → 성공 표시 없음·오류 메시지 노출·입력 보존·버튼 재활성. `form_error{error_type:server}` 만 전송 |
| F05 | 접수 확인 | **NOT_RUN** | 로컬 목 서버 200 은 Netlify 실제 접수가 아니다. 운영 스모크 테스트는 권한 밖 → `OWNER_ACTIONS.md` |
| F06 | 중복 제출 | PASS | 응답 지연 중 3회 연속 클릭 → POST 1건, `generate_lead` 1회 |
| F07 | no-JS | PASS | 본문·가격·FAQ·링크 접근 가능. 같은 섹션에 전화·카카오·이메일 대안 제공 |
| A01 | 이벤트 | PASS | 기존 `inquiry_form_submit`/`main_apply_submit`/`form_submit_success` 각 1회 유지, `generate_lead` 1회. 가격 CTA 는 `cta_click{cta_location:pricing, package_tier}` |
| A02 | 개인정보 | PASS | dataLayer 에 이름·연락처·주소 없음. 폼 입력값을 localStorage/sessionStorage/URL 에 쓰지 않음. 비밀번호·API 키 필드 없음(게이트가 검사) |
| V01 | 반응형 | PASS | 320/360/390/430/768/1024/1280/1440px 가로 넘침 0px. 200% 확대(640×512)도 0px |
| V02 | 키보드 | PASS | 범위 탭 방향키 이동, FAQ summary 포커스·열기, 폼을 키보드만으로 작성·제출 성공 |
| V03 | 접근성 | PASS | Lighthouse Accessibility **100** (2차 작업에서 공용 버튼 대비를 고친 뒤). label·scope·caption·focus-visible 규칙 확인 |
| P01 | 성능 | **부분 미달 — 원인 기록** | 모바일 5회 중앙값 **Performance 76** (목표 90). 아래 3절 |
| R01 | 홈/메뉴 | PASS | 홈 본문 10,368자 → 10,368자(동일). 메뉴 항목 1개 추가만 |
| R02 | 기존 폼 | PASS | default/geo-website/ai-voice 필드·유입_랜딩 유지, 새 필드 누출 없음 |
| R03 | footer/schema | PASS | 사업자 정보·로고·전역 엔티티·GTM/픽셀 ID 모두 동일 |
| D01 | 프리뷰 | PASS | noindex 혼입 0, 새 analytics 태그 0. 폼은 정적 export 방식 그대로(서버 라우트 추가 없음) |
| D02 | 운영 인계 | PASS | `DEPLOY_AND_ROLLBACK.md` · `OWNER_ACTIONS.md` 에 배포·복구·미확인 항목 명시 |

**요약: PASS 32 · 부분 미달(원인 기록) 1 (P01) · NOT_RUN 1 (F05) · FAIL 0**

> 2026-09-15 2차 작업에서 V03 이 97 → **100** 이 되었고, 폰트 전송량을 2,009KB → 222KB 로
> 줄였다. P01 관련 수치와 정정 내용은 `OWNER_ACTIONS.md` 의 E1 절에 있다.

## 3. 성능 — 목표 미달 항목과 원인

모바일 Lighthouse 5회 중앙값(동일 환경·동일 로컬 서버, `out/` 서비스):

| 페이지 | Perf | A11y | BP | SEO | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| **/ai-search-optimization/** (신규) | **76** | 97 | 100 | 100 | 2.55s | 5.36s | **0.0007** | 45ms |
| /geo-website/ (기존) | 81 | 97 | 100 | 100 | 1.95s | 4.93s | 0.0007 | 25ms |
| /ai-voice-development/ (기존) | 78 | 97 | 100 | 100 | 2.25s | 5.31s | 0.0009 | 52ms |

- **원인:** LCP 를 지배하는 것은 사이트 공통 자산 `/fonts/PretendardVariable-1.3.9.woff2` **2.0MB** 다. Lighthouse 모바일 스로틀링(≈1.6Mbps)에서 이 파일 하나가 약 10초를 차지한다. 기존 `/geo-website/` 도 LCP 4.93s 로 같은 병목을 갖는다 — 이번 페이지가 만든 회귀가 아니다.
- **이번 페이지의 추가분:** 콘텐츠가 많아 HTML 이 `/geo-website/`(86KB)보다 큰 136KB 다. 5점 차이의 대부분이 여기서 온다.
- **개선한 것:** 최초 측정에서 CLS 0.0427 이었다. 웹폰트 교체 시점에 히어로 보조제목·설명·가격 한 줄·구조도 캡션의 줄 수가 뒤집혀 아래 요소가 밀리는 것이 원인이었고, 320~1600px 16개 폭에서 웹폰트/폴백 줄 수를 실측해 구간별 `min-height` 를 예약했다. 결과 **CLS 0.0427 → 0.0007**, 16개 폭 전부에서 폰트 교체 후 히어로 CTA·구조도·목차 위치 변동 0px.
- **남은 제한:** Performance 90 은 폰트 서브셋(한글 상용 + Latin) 또는 unicode-range 분할 없이는 어렵고, 그것은 **사이트 전역 자산 변경**이라 이 작업 범위 밖이다 → `OWNER_ACTIONS.md` 에 후속 항목으로 기록.
- 측정은 로컬 정적 서버 기준이며 **실사용자 데이터(CrUX)가 아니다.** 신설 페이지라 실사용자 LCP/INP/CLS 는 **측정 데이터 없음**.
- 5회 중 1~2회는 FCP 12.4s / Perf 55 로 튀었다. 같은 현상이 기존 `/ai-voice-development/` 에서도 재현돼 **이 컨테이너의 Lighthouse 시뮬레이션 변동**으로 판단했고, 한 번의 수치 차이를 회귀로 해석하지 않기 위해 5회 중앙값을 기록했다.

## 4. 접근성 — 2차 작업에서 해소

1차 측정에서 남아 있던 `color-contrast` 실패 1건(공용 상담 폼 제출 버튼: `bg-accent` #3d7cff 위 흰 글자 = 3.80:1)을 2차 작업에서 고쳤다.

- 흰 글자가 올라가는 `bg-accent` 를 전부 `bg-accent-deep`(#2563eb, **5.17:1**)로 바꾸고, hover 는 새로 추가한 `accent.darker`(#1d4ed8, **6.70:1**)로 보냈다. hover 가 밝은 쪽으로 가면 그 상태에서 다시 AA 미달이 되기 때문이다.
- 대상: `LandingInquiryForm`(모든 랜딩 폼 제출 버튼), `LandingPage.js`·`HubPage.js`(전화 CTA·번호 뱃지·순번 원형), `ReumSalesLanding.tsx`.
- 결과: `/ai-search-optimization/` Lighthouse Accessibility **97 → 100**.
- `/geo-website/` 는 여전히 97 이다 — 그 페이지 고유 컴포넌트에 별도 대비 항목이 남아 있고, 이번 범위가 아니라 건드리지 않았다.

공용 폼 안내문 1건이 12px 인 것은 그대로 두었다(사이트 공통 문구). 이 페이지는 같은 취지의 필수 고지를 상담 섹션에 13.5px 로 별도 표시한다.

공용 폼 안내문 1건이 12px 다(`문의만으로 계약이 진행되지 않습니다 …`). 같은 이유로 손대지 않았고, 이 페이지는 같은 취지의 필수 고지를 상담 섹션에 13.5px 로 별도 표시한다.

## 5. 이 페이지가 만들지 않은 것 (의도적)

- 가짜 진단기(URL 입력 → 점수), 타이머 후 임의 점수, 가짜 AI 답변 화면, 사람 데이터처럼 보이는 목업 리포트 — 전부 만들지 않았다. 홈페이지 주소는 상담 정보일 뿐이고 **자동 fetch 하지 않는다**(SSRF 공격면 없음).
- 실측 데이터가 없으므로 샘플 리포트에 숫자를 채우지 않고 `질문 / 실행 조건 / 확인한 출처 / 관찰 결과 / 다음 작업` 문서 구조만 보여 준다.
- 새 고객 로고·후기·파트너 배지·수상 표기 없음.

## 6. 기존 저장소의 선행 결함 (이 작업과 무관, 미수정)

`out/index.html`(홈)에서 브라우저 콘솔 오류 1건: `ReferenceError: updateMobileCta is not defined`.

- 원인: `script.js:679` 의 `function updateMobileCta()` 가 `if (mcta) { … }` 블록 안에 선언돼 있고, 빌드 시 미니파이어가 `"use strict"` 를 붙이면서 블록 스코프 함수 선언이 바깥(`script.js:693`의 IntersectionObserver 콜백)에서 보이지 않는다.
- `script.js` 와 `scripts/copy-home-assets.mjs` 는 이번 브랜치에서 **한 줄도 바뀌지 않았다**(마지막 변경 커밋 `60ad015`). 기준선 빌드에서도 동일하게 재현된다.
- 영향: 모바일 고정 CTA 의 "문의 영역이 보이면 숨김" 동작만 작동하지 않는다. 스크롤 표시/숨김 자체는 정상.
- **2026-09-15 2차 작업에서 수정했다.** 선언을 `if` 블록 밖으로 빼고 `var updateMobileCta = function () {…}` 함수식으로 바꿨다(엄격 모드에서도 같은 스코프에 남는다). 브라우저 회귀 검사에서 홈 콘솔 오류 0건.
