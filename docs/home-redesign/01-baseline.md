# 1. 현황·기준본·변경 범위

## 저장소 실제 구조 (추측 아님, 확인값)

| 항목 | 값 |
|---|---|
| 스택 | Next.js 14 정적 export (`output: export`) + 루트 정적 홈 |
| 패키지 매니저 | npm (`package-lock.json`, `npm ci`) |
| 빌드 | `npm run build` → `out/` (HTML 1,349개, sitemap URL 778개) |
| **홈 `/` 진입점** | `index.html` + `styles.css` + `script.js` — Next 의 `app/page.tsx` 출력 대신 `scripts/copy-home-assets.mjs` 가 덮어씀 |
| 홈 이후 후처리 | `inject-portfolio-static.mjs`(사례 15건 정적 주입) → `inject-service-menu.mjs`(서비스 메뉴 11개 주입) |
| 서브페이지 | `app/` 라우트 1,340개 (`_next/static/css/*.css` 사용, `styles.css` 로드 안 함) |
| **공유 자산** | `styles.css`·`script.js` 를 홈과 **목적별 랜딩 8개**가 함께 사용 |
| 호스팅 | Netlify (`netlify.toml`, publish `out`) |
| 폰트 | Pretendard Variable (`public/fonts/`, self-host) |

### 빌드 부작용 확인

`[context.production]` 에서만 `npm run seo:indexnow` (IndexNow **실제 제출**) 가 붙습니다.
로컬 `npm run build` 에는 없습니다. 빌드 체인 12개 스크립트에 네트워크·DB 쓰기 호출이 없음을
확인하고(`fetch`/`http.request`/`axios`/`child_process` 0건) 로컬 빌드만 실행했습니다.
IndexNow 제출 계열 명령(`seo:indexnow`, `neo:indexnow:*`, `neo:http`)은 실행하지 않았습니다.

## 기준본(baseline)

| 항목 | 값 |
|---|---|
| Git commit | `52b2d55833b55b841345250af5cd590eec44c58f` (2026-09-14 16:39:42 +0900) |
| 작업 시작 시 워킹트리 | clean (미커밋 변경 없음 — 덮어쓴 사용자 작업 없음) |
| 변경 전 빌드 | `npm run build` 성공, `out/` HTML 1,349개 |
| 수집 시각 | 2026-09-14 (이 세션) |

### ⚠ 운영본(https://reumlab.com/) 직접 대조는 하지 못했습니다 — NOT RUN

이 실행 환경의 아웃바운드는 조직 egress 정책으로 차단되어 있습니다.

```
$ curl -sS -D - https://reumlab.com/
curl: (56) CONNECT tunnel failed, response 403
$ curl -sS "$HTTPS_PROXY/__agentproxy/status"
  "recentRelayFailures": [{ "kind": "connect_rejected",
    "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
    "host": "reumlab.com:443" }]
```

프록시 안내는 정책 거부(403)를 우회하지 말고 보고하라고 지시하므로 재시도하지 않았습니다.
따라서 **"저장소 HEAD == 현재 운영본"을 이 세션에서 직접 검증하지 못했습니다.**

간접 근거(검증한 것이 아니라 저장소에 남아 있는 기록):
- HEAD 커밋 `52b2d55` 가 배포 후 NEO 감사 문서이고, `docs/neo/latest-audit.md` 는
  `운영 HTTP/Yeti 비교: TESTED (14개 대상, 0개 실패, 2026-09-14T07:35:02.005Z)` 로 기록.
- 이 세션 시작(08:14) 약 40분 전 기록입니다.

이 기록은 **다른 세션이 남긴 것이고 제가 재확인한 값이 아닙니다.** 최종 판정에 반영합니다.

## 변경 전 홈 상태 기록 (구체적 위치와 근거)

캡처: `shots/1280-full-before.jpg`, `shots/390-full-before.jpg`, `shots/sec-*-before.jpg`

| # | 위치 | 관찰된 현상 | 근거 |
|---|---|---|---|
| 1 | Hero `.hero__note` | `름랩(REUMLAB)` 과 조사 `은` 사이가 10px 벌어지고, 모바일에서는 줄이 갈라짐 | `.hero__note { display:flex; gap:10px; flex-wrap:wrap }` 때문에 `<b>` 와 뒤 텍스트 노드가 각각 flex 항목이 됨 (렌더 DOM 확인) |
| 2 | Hero `.hero__trust` (390px) | `단일 창구` 가 `단일 창` / `구` 로 쪼개짐 | 2열 그리드 + `word-break` 미지정 |
| 3 | 목적 선택 `.purpose-card__desc` | `관리자 시스템` 이 `관리` / `자 시스템` 으로 쪼개짐 | 같은 원인 |
| 4 | 가격 `.sec-sub` | `고르세요` 가 `고르` / `세요` 로 쪼개짐 | 같은 원인 |
| 5 | 가격 `.price-incl li` | `광고 소재 1세트`→`1세`/`트`, `AI 운영 1:1 교육`→`교`/`육` 등 다수 | 4열 좁은 칼럼 + `word-break` 미지정 |
| 6 | 가격 카드 | `featured` 가 `scale(1.025)` 라 8칸 기준선이 어긋남 | `.price-card.featured { transform: scale(1.025) }` |
| 7 | 가격 금액 | 카드별 금액 자릿수 정렬이 어긋남 | tabular-nums 미적용 |
| 8 | `#contact` 왼쪽 열 | 1280px 에서 폼 옆이 크게 비어 있음 | 왼쪽 열이 짧고 오른쪽 폼이 김 |
| 9 | Hero 배경 | 장식 radial-gradient 2겹 | `.hero::before` |
| 10 | 전체 | 카드 그림자가 무거워 면이 뭉개짐 | `--shadow`/`--shadow-lg` 광범위 사용 |

위 1~5 는 **한국어 단어가 음절 단위로 잘리는 문제**로, 지시서 6-C
"한국어 음절이 잘리거나 단어 한두 개가 어색하게 고립되지 않게 확인한다" 에 해당합니다.

변경 전부터 있던 **기능·접근성 결함**은 `06-baseline-issues.md` 에 따로 적었습니다.
