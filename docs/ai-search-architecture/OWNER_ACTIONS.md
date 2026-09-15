# 운영자만 처리할 수 있는 항목

계정 권한·운영 배포·실서버 확인이 필요해 이 작업에서 **하지 않았거나 할 수 없었던** 것들이다.
"구조를 만들었다" 와 "검색엔진·AI 가 실제로 추천한다" 는 다르므로, 아래는 완료로 표기하지 않았다.

## A. 배포 — 완료

| # | 할 일 | 상태 |
|---|---|---|
| A1 | main 머지·푸시 | ✅ 완료 (`f0d0c04`, `52cc2b6`) |
| A2 | IndexNow 자동 제출 | ✅ production 빌드에서 함께 실행됨 (네이버·Bing) |
| A3 | 실서버 확인 12개 항목 | ⬜ **사장님 작업** — 이 실행 환경은 `reumlab.com` 이 egress 차단이라 직접 열어 보지 못했다 |

## B. 실제 접수 확인 (QA F05 = NOT_RUN)

| # | 할 일 | 비고 |
|---|---|---|
| B1 | 배포 후 상담 폼 **실제 1건 제출** → 접수 내역에 값이 들어오는지 확인 | ⬜ **사장님 작업**(HTTP 차단으로 대신 못 함). 다만 Netlify API 로 **폼 필드 등록은 확인했다** — `main-apply` 에 새 필드 5종(`홈페이지주소상태`·`홈페이지환경`·`수정권한`·`관심패키지`·`지속관리관심`)이 실제로 잡혀 있다 |
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
| D1 | 커밋 `16d04a4`(가이드 FAQ·LocalBusiness 전환·홈 FAQ no-JS 대비) | ✅ `f0d0c04` 와 함께 main 에 올라가 배포됨 |
| D2 | `/guide/` 신규 FAQ 6문항 배포 후 GSC 색인 요청 | — |

## E. 후속으로 처리한 항목 (2026-09-15 2차 작업)

| # | 내용 | 상태 |
|---|---|---|
| E0 | **(발견) `/l/*` 202개 · `/h/*` 38개가 스타일 없이 렌더되던 선행 결함** — Tailwind CSS 미로드 + `@tailwind base` 누락 | ✅ 완료 · A11y **99 / 98** (아래 상세) |
| E1 | **폰트 서브셋** — 2.0MB Pretendard → 실제 사용 글자 222KB 서브셋 분리 | ✅ 완료 · 첫 방문 전송량 **−1.8MB** (아래 상세) |
| E2 | **공용 폼 버튼 대비** — 흰 글자 위 `accent`(3.80:1) → `accent-deep`(5.17:1), hover 는 `accent-darker`(6.70:1) | ✅ 완료 · `/ai-search-optimization/` A11y 97 → **100** |
| E3 | **홈 JS 오류** — `script.js` 의 `updateMobileCta` 블록 스코프 문제 | ✅ 완료 · 홈 콘솔 오류 0건 |
| E4 | **`prebuild` 2회 실행** — `build` 스크립트의 중복 호출 제거 | ✅ 완료 |
| E5 | **RSC prefetch 낭비** — 페이지 로드마다 최대 61건 2,263KB 를 미리 받고 있었다 | ✅ 완료 · prefetch **0건**, 전송량 최대 **−70%** (아래 상세) |
| E6 | **(발견) `/`·`/mvp/`·`/website/` 가 링크 이동 시 다른 페이지를 그리던 선행 결함** | ✅ 완료 (아래 상세) |
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

### E5 "미사용 JS 104KB" 를 파 보니 — 진짜 낭비는 다른 곳에 있었다

**결론부터**: Lighthouse 가 지목한 미사용 JS 115KB 는 `fd9d1056`(react-dom, 169KB 중 64KB)와
`117`(Next App Router 런타임, 122KB 중 51KB)다. **둘 다 프레임워크 내부 코드**라 우리 쪽에서
잘라 낼 수 없다. 없애려면 이 페이지들에서 React 하이드레이션 자체를 빼야 하고,
그건 App Router 를 버린다는 뜻이다(상담 폼·내비 토글·분석이 전부 클라이언트 컴포넌트).

그래서 "무엇을 실제로 내려받고 있나"를 요청 단위로 다시 쟀고, 훨씬 큰 것이 나왔다.

**Next `<Link>` 의 뷰포트 prefetch 가 페이지마다 RSC 페이로드를 쏟아붓고 있었다.**
링크가 화면에 들어오면 그 경로의 `index.txt` 를 미리 받는데, 이 사이트는 링크가 많은
콘텐츠 사이트라 그 비용이 본문을 넘어섰다. 방문자는 보통 링크 하나만 누른다.

| 페이지 | prefetch 요청 | prefetch 바이트 | 총 전송 중 비중 |
|---|---|---|---|
| `/cost/` | 61건 | 2,263KB | **69%** |
| `/guide/` | 40건 | 1,792KB | **68%** |
| `/portfolio/` | 22건 | 886KB | 52% |
| `/ai-search-optimization/` | 12건 | 696KB | 40% |

**고친 방법** — `components/SiteLink.tsx` 래퍼를 만들고 31개 파일의 `next/link` import 를
전부 이쪽으로 돌렸다. 래퍼가 두 가지를 한곳에서 강제한다.

1. `prefetch` 기본값을 끈다. 누를 때 받으면 충분하다.
2. **후처리가 덮어쓰는 경로는 `<a>` 로 내보낸다** (아래 E6).

`components/Nav.js` 가 서비스 메뉴 항목에 `prefetch` 를 직접 켜 두고 있어서(메뉴가 닫혀
있는데도 4곳 327KB 를 매번 받았다) 그 제어도 걷어내고 래퍼에 맡겼다.

**결과 — 페이지 로드당 전송량**

| 페이지 | 변경 전 | 변경 후 | 절감 |
|---|---|---|---|
| `/cost/` | 3,262KB | **976KB** | −70% |
| `/guide/` | 2,639KB | **818KB** | −69% |
| `/portfolio/` | 1,714KB | **797KB** | −53% |
| `/ai-search-optimization/` | 1,721KB | **1,015KB** | −41% |
| `/l/academy-app-dev/` | 1,772KB | **1,105KB** | −38% |

RSC prefetch 요청은 **5개 경로 모두 0건**이 됐다. Lighthouse `total-byte-weight` 100.

**Lighthouse Performance 점수는 그대로다(68).** prefetch 는 페이지가 인터랙티브해진 뒤에
낮은 우선순위로 일어나서 Lantern 의 FCP/LCP 모델에 잡히지 않는다. 폰트 때와 같은 이야기다 —
**점수가 아니라 실제 바이트가 줄었다.** 모바일 데이터와 느린 회선에서 의미가 크다.

남은 미사용 CSS 113KB(Tailwind 청크 73KB 중 69KB)도 같은 성격이다 — 사이트 전체가
공유·캐시하는 파일이라 한 페이지 기준으로는 늘 대부분이 '미사용'으로 잡힌다.

### E6 (발견) `/`, `/mvp/`, `/website/` 는 링크로 들어가면 다른 페이지가 나왔다 — 수정함

E5 작업 중 확인한 **선행 결함**이다. 이 사이트는 정적 export 위에 후처리가 얹혀 있어서
`copy-home-assets.mjs` 가 `out/index.html` 을, `generate-purpose-landings.mjs` 가
`out/<slug>/index.html` 을 Next 렌더 결과 위에 덮어쓴다. 그런데 `<Link>` 로 이동하면
브라우저가 HTML 을 다시 받지 않고 Next 가 자기 컴포넌트를 그린다.

브라우저 A/B 실측(직접 로드 vs 클라이언트 내비게이션):

| 경로 | 직접 로드 (배포본) | `<Link>` 내비게이션 |
|---|---|---|
| `/` | "아이디어를 실제로 운영 가능한 서비스로 만듭니다." 10,991자 | "예산 안에서, 빠르게 MVP…" **5,159자 (다른 페이지)** |
| `/mvp/` | "앱·웹 MVP 개발…" 5,561자 | "MVP 개발 외주" **2,836자** |
| `/website/` | "홈페이지·랜딩페이지 제작…" 4,905자 | "업종별 홈페이지 제작 — 294개 업종" **5,282자** |

즉 **헤더 로고를 누른 방문자는 배포된 홈이 아닌 다른 홈을 보고 있었다.**
`SiteLink` 가 `lib/static-routes.ts` 의 목록을 보고 이 경로들을 `<a>` 로 내보내
실제 페이지 이동을 하게 했다. 세 경로 모두 직접 로드와 동일해진 것을 재실측으로 확인했다.

(이 과정에서 `<a>` 는 `next.config` 의 `trailingSlash: true` 를 자동으로 붙여 주지 않아
`/mvp` 같은 링크가 404 로 나가던 것도 잡았다 — `seo:qa` 가 잡아 줬다.)

회귀 방지: `npm test` 에 두 가지를 넣었다 — (a) `SiteLink` 외에는 `next/link` 를 직접
import 할 수 없다, (b) `lib/static-routes.ts` 의 슬러그 목록이 `generate-purpose-landings.mjs`
의 `LANDINGS` 와 항상 같아야 한다.

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
| R1 | **폰트 서브셋 재생성 주기** — 콘텐츠가 크게 늘면 `python3 scripts/build-font-subsets.py && node scripts/apply-font-subset-css.mjs` 를 다시 돌린다. 안 돌려도 화면은 정상이고, 새 글자가 있는 페이지만 원본을 추가로 받는다. `npm run seo:verify:font` 가 그 상태를 빌드에서 알려 준다 | 빌드 체인에 포함된 게이트 |
| R2 | **프레임워크 JS 115KB** — react-dom 64KB + App Router 런타임 51KB 가 첫 화면에서 안 쓰인다. 우리 코드가 아니라 잘라 낼 수 없고, 없애려면 이 페이지들에서 React 하이드레이션을 빼야 한다(App Router 이탈). 상담 폼·내비 토글·분석이 전부 클라이언트 컴포넌트라 현실적인 선택지가 아니다 | Lighthouse `unused-javascript` |
| R3 | **미사용 CSS 113KB** — Tailwind 청크 73KB 중 69KB 가 한 페이지 기준 미사용. 사이트 전체가 공유·캐시하는 파일이라 원래 그렇게 잡힌다. 페이지별로 쪼개면 캐시 적중률이 떨어져 오히려 손해일 수 있어 두었다 | Lighthouse `unused-css-rules` |
| R4 | **`/geo-website/` 대비 실패 15건** — 그 페이지 고유 CSS 모듈(`exampleCard` 안의 `<b>` 등)이라 이번 범위 밖으로 뒀다. A11y 97 | Lighthouse axe |

## F. 확인이 필요한 정책 항목

| # | 내용 |
|---|---|
| F1 | ✅ 처리함 — `public/privacy/index.html` 의 '처리하는 개인정보 항목' 에 상담 폼의 프로젝트 정보(사업 정보임을 명시)와 **수집하지 않는 항목**(비밀번호·인증코드·API 키·고객 명단·건강정보)을 추가했다. **보유 기간·해외 이전·수탁자 조건은 확인할 수 없어 그대로 비워 두었다** — 실제 계약·사용 도구가 확정되면 사장님이 채워야 한다 |
| F2 | CARE / CARE PLUS 의 기간·해지·환불·실비 조건은 화면에 "계약으로 정한다" 로만 적었다. 실제 계약서 문구와 맞추는 것은 운영자 작업 |
| F3 | ✅ 처리함 — `docs/ai-search-architecture/CLIENT_ONBOARDING.md` 에 환경별 권한 요청 방식(초대 기반), 부득이한 비밀번호 전달 규칙, 납품 시 권한 반납 체크리스트를 정리했다 |
