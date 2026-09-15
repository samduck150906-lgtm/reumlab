# 운영자만 처리할 수 있는 항목

계정 권한·운영 배포·실서버 확인이 필요해 이 작업에서 **하지 않았거나 할 수 없었던** 것들이다.
"구조를 만들었다" 와 "검색엔진·AI 가 실제로 추천한다" 는 다르므로, 아래는 완료로 표기하지 않았다.

## A. 배포 (권한 경계)

| # | 할 일 | 비고 |
|---|---|---|
| A1 | 이 브랜치를 검토하고 원격 push / PR / main merge 결정 | 브랜치 `claude/ai-search-architecture`. 지시 없이 push·merge 하지 않았다 |
| A2 | main 배포 시 **IndexNow 자동 제출이 함께 나간다**는 점 확인 | `netlify.toml` `[context.production]` = `npm run build && npm run seo:indexnow` (네이버·Bing) |
| A3 | 배포 후 `DEPLOY_AND_ROLLBACK.md` 3절 12개 항목 실서버 확인 | 로컬 `out/` 검증과 실서버 응답은 다른 검사다 |

## B. 실제 접수 확인 (QA F05 = NOT_RUN)

| # | 할 일 | 비고 |
|---|---|---|
| B1 | 배포 후 상담 폼 **실제 1건 제출** → Netlify Forms 접수 내역에 새 필드 5종(`홈페이지주소상태`, `홈페이지환경`, `수정권한`, `관심패키지`, `지속관리관심`)이 저장되는지 확인 | 로컬 검사는 목 서버 200 응답까지만 확인했다. **이것을 접수 성공으로 간주하지 않았다** |
| B2 | 새 필드가 영업 알림 메일 템플릿에 포함되는지 확인 | 필요하면 Netlify 알림 설정 수정 |
| B3 | 테스트 제출 건은 접수 내역에서 삭제 | — |

## C. 검색엔진 등록 (권한 필요)

| # | 할 일 | 비고 |
|---|---|---|
| C1 | Google Search Console → URL 검사 → `https://reumlab.com/ai-search-optimization/` 색인 요청 | 사이트맵 등록은 코드에서 끝났지만 색인 요청은 계정 작업 |
| C2 | 네이버 서치어드바이저 → 웹페이지 수집 요청 | 소유확인 태그·RSS·사이트맵은 기존 그대로 보존됨 |
| C3 | 색인 상태·노출·클릭은 실제 계정에서 확인될 때까지 **미확인**으로 둔다 | 이 작업에서는 확인할 수 없었다 |

## D. 이전 작업에서 남아 있는 항목

| # | 할 일 | 비고 |
|---|---|---|
| D1 | 커밋 `16d04a4`(가이드 FAQ·LocalBusiness 전환·홈 FAQ no-JS 대비)가 **로컬에만 있고 원격에 없다** | 이 브랜치의 기준선이다. 함께 올릴지 결정 필요 |
| D2 | `/guide/` 신규 FAQ 6문항 배포 후 GSC 색인 요청 | — |

## E. 후속으로 처리한 항목 (2026-09-15 2차 작업)

| # | 내용 | 상태 |
|---|---|---|
| E0 | **(발견) `/l/*` 202개 · `/h/*` 38개가 스타일 없이 렌더되던 선행 결함** — Tailwind CSS 미로드 + `@tailwind base` 누락 | ✅ 완료 · A11y **99 / 98** (아래 상세) |
| E1 | **폰트 서브셋** — 2.0MB Pretendard → 실제 사용 글자 222KB 서브셋 분리 | ✅ 완료 · 첫 방문 전송량 **−1.8MB** (아래 상세) |
| E2 | **공용 폼 버튼 대비** — 흰 글자 위 `accent`(3.80:1) → `accent-deep`(5.17:1), hover 는 `accent-darker`(6.70:1) | ✅ 완료 · `/ai-search-optimization/` A11y 97 → **100** |
| E3 | **홈 JS 오류** — `script.js` 의 `updateMobileCta` 블록 스코프 문제 | ✅ 완료 · 홈 콘솔 오류 0건 |
| E4 | **`prebuild` 2회 실행** — `build` 스크립트의 중복 호출 제거 | ✅ 완료 |
| F1 | `/privacy/` 수집 항목에 상담 폼의 프로젝트 정보·미수집 항목 명시 | ✅ 완료 (보유기간·해외이전은 그대로 비워 둠) |
| F3 | 계약 후 접근 권한 온보딩 절차 문서화 | ✅ 완료 → `CLIENT_ONBOARDING.md` |

### E0 (발견) `/l/*` 202개 · `/h/*` 38개가 스타일 없이 렌더되고 있었다 — 수정함

2차 작업 중 우연히 발견한 **선행 결함**이다. 사장님 목록에 없던 항목이지만 240개 페이지가
사실상 깨진 채로 색인되고 있어서 같이 고쳤다.

**무엇이 문제였나 (두 겹)**

1. Tailwind 유틸리티(`@tailwind components/utilities`)는 `app/reum-sales.css` 에만 있고,
   이 파일은 홈·`/geo-website/`·`/ai-voice-development/`·`/ai-search-optimization/` 네 곳에서만
   import 되고 있었다. `app/l/[slug]/page.js` 와 `app/h/[hubSlug]/page.js` 는 import 가 없어,
   `components/LandingPage.js` · `components/HubPage.js` 가 Tailwind 클래스로 작성돼 있는데도
   **CSS 가 한 줄도 로드되지 않았다.** 헤더·푸터만 globals.css 로 살아 있고 본문은 민무늬였다.
2. `app/reum-sales.css` 에 **`@tailwind base` 가 없었다.** `corePlugins.preflight: false` 라
   base 레이어는 CSS 리셋을 내보내지 않지만, Tailwind v3 가 `*,::before,::after` 에 까는
   `--tw-shadow` · `--tw-gradient-from-position` · `--tw-ring-shadow` 같은 **기본 커스텀 속성**은
   이 지시문이 있어야 나온다. 없으면 그 변수를 참조하는 유틸이 계산 단계에서 통째로 무효가 된다.
   → `bg-gradient-to-b` 가 `background-image: none` 이 되고, `shadow-lg` 가 그림자를 잃는다.
   1번만 고치면 랜딩 히어로가 **흰 배경 위 흰 글씨**가 되어 오히려 더 나빠진다.

**고친 것**

- `app/reum-sales.css` 맨 앞에 `@tailwind base;` 추가 — 리셋은 그대로 꺼져 있고(빌드 산출물에서
  `html{}`·`body{}` 리셋 규칙 0건 확인) `--tw-*` 기본값만 나온다. 기존 페이지의 그림자·변형도
  이제 의도대로 렌더된다.
- `app/l/[slug]/page.js` · `app/h/[hubSlug]/page.js` 에 `import '../../reum-sales.css'` 추가.
- 이때 드러난 대비 미달 4건 수정: 흰 배경 위 `text-accent`(3.80:1) → `text-accent-deep`(5.17:1) 3곳,
  12px 캡션 `text-slate-400`(2.56:1) → `text-slate-500`(4.76:1) 1곳.

**결과 (모바일 Lighthouse)**

| 페이지 | 변경 전 | 변경 후 |
|---|---|---|
| `/l/academy-app-dev/` | 스타일 없음 | Accessibility **99** · Best Practices 100 |
| `/h/gangnam/` | 스타일 없음 | Accessibility **98** · Best Practices 100 |

`/l/*`·`/h/*` 의 SEO 점수 69 는 이 페이지들이 **의도적으로 `noindex, follow`** 이기 때문이다
(`landingIndexable` 게이트). Lighthouse 가 색인 차단을 감점하는 것이며 회귀가 아니다.
색인 대상인 `/h/academy/` 는 SEO 100 이다.

**되돌리려면**: `app/l/[slug]/page.js` 와 `app/h/[hubSlug]/page.js` 의 import 한 줄씩만 빼면
이전 상태로 돌아간다. `@tailwind base` 는 그대로 두는 편이 좋다 — 그것 없이는 홈·서비스
페이지의 그림자·그라데이션도 계속 죽어 있다.

### E1 폰트 서브셋 — 측정 결과와 정정

`@font-face` 를 둘로 나눴다. 원본(2.0MB, 범위 = 폰트 cmap 전체)을 먼저 선언하고,
실제 사용 글자 서브셋(222KB, 1,338자)을 나중에 선언한다. 겹치는 글자는 나중 선언이
이기므로 평소에는 222KB 만 받고, 서브셋 밖 글자가 나오는 페이지만 원본을 추가로 받는다.
두 범위의 합집합이 원본 cmap 과 같아 **글자 손실이 없다**(희귀 음절 주입 실측으로 확인).

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| 첫 방문 총 전송량 (`/ai-search-optimization/`) | 2,897KB | **1,110KB** |
| 첫 방문 총 전송량 (`/geo-website/`) | 2,803KB | **1,016KB** |
| 첫 방문 총 전송량 (홈) | 2,310KB | **523KB** |
| 폰트 전송량 | 2,009KB | **222KB** |
| 실제 브라우저 FCP/LCP (CDP 1.6Mbps·150ms·CPU 4x) | 3.13s / 2.80s / 2.39s | 3.21s / 2.85s / 2.31s |

**앞선 보고를 정정한다.** 1차 보고서에서 "2.0MB 폰트가 LCP 를 지배한다" 고 적었는데,
그건 Lighthouse 의 시뮬레이션(Lantern) 값을 근거로 한 것이었다. 실제 스로틀링 브라우저로
A/B 를 재면 FCP·LCP 는 ±0.08초로 사실상 동일하다 — `font-display: swap` 때문에 폰트는
애초에 페인트 임계 경로에 없었다. Lighthouse Performance 점수도 경로마다 반대로 움직인다
(`/ai-search-optimization/` 55→69 개선, `/geo-website/` 80→72 하락, 이 컨테이너에서
"변경 전" 측정이 55/55/76/55/55 로 심하게 흔들린다).

그래서 이 변경의 실제 효과는 **점수가 아니라 전송량과 폰트 교체 속도**다.
첫 방문마다 1.8MB 를 덜 받고, 폴백 글꼴이 Pretendard 로 바뀌는 시간이 크게 줄어든다.
모바일 데이터·느린 회선에서 의미가 크고, LCP 점수를 올리는 작업은 아니다.

재생성 방법과 회귀 방지는 `IMPLEMENTATION.md` 의 '폰트' 절과
`npm run seo:verify:font` (빌드 체인에 포함) 참조.

## E'. 아직 남은 개선점

| # | 내용 | 근거 |
|---|---|---|
| E5 | **미사용 JS 104KB** — Next 공통 청크 `fd9d1056`(60KB)·`117`(44KB)에 첫 화면에서 안 쓰는 코드가 있다. 코드 분할을 손보면 Performance 가 오를 여지가 가장 큰 항목 | Lighthouse `unused-javascript`, 모든 라우트 공통 |
| E6 | **폰트 서브셋 재생성 주기** — 콘텐츠가 크게 늘면 `python3 scripts/build-font-subsets.py && node scripts/apply-font-subset-css.mjs` 를 다시 돌린다. 안 돌려도 화면은 정상이고, 새 글자가 있는 페이지만 원본을 추가로 받는다. `npm run seo:verify:font` 가 그 상태를 빌드에서 알려 준다 | 빌드 체인에 포함된 게이트 |

## F. 확인이 필요한 정책 항목

| # | 내용 |
|---|---|
| F1 | ✅ 처리함 — `public/privacy/index.html` 의 '처리하는 개인정보 항목' 에 상담 폼의 프로젝트 정보(사업 정보임을 명시)와 **수집하지 않는 항목**(비밀번호·인증코드·API 키·고객 명단·건강정보)을 추가했다. **보유 기간·해외 이전·수탁자 조건은 확인할 수 없어 그대로 비워 두었다** — 실제 계약·사용 도구가 확정되면 사장님이 채워야 한다 |
| F2 | CARE / CARE PLUS 의 기간·해지·환불·실비 조건은 화면에 "계약으로 정한다" 로만 적었다. 실제 계약서 문구와 맞추는 것은 운영자 작업 |
| F3 | ✅ 처리함 — `docs/ai-search-architecture/CLIENT_ONBOARDING.md` 에 환경별 권한 요청 방식(초대 기반), 부득이한 비밀번호 전달 규칙, 납품 시 권한 반납 체크리스트를 정리했다 |
