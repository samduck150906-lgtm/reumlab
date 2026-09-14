# 5. 검증 결과

상태 표기: **PASS / FAIL / NOT RUN / BASELINE ISSUE**
"도구가 없어 확인하지 못한 것은 PASS 가 아니라 NOT RUN" 규칙을 지켰습니다.

측정 환경: 로컬 컨테이너 · Chromium(Playwright 1.56.1) · **production-mode 빌드**(`npm run build`) ·
외부 요청(GTM·Meta 픽셀·외부 CDN) 전부 차단 · 네트워크/CPU 스로틀 없음 · 매 회 빈 캐시.
기준본과 변경본을 **같은 세대 빌드**(대조군 빌드 vs 변경 빌드)로, 같은 기기·브라우저에서 비교했습니다.

---

## 종합

| 검사군 | 결과 |
|---|---|
| 보호 manifest diff (초기 HTML) | **28/28 PASS · 0 FAIL** |
| 로고 보존 (파일 해시·CSS·마크업·렌더 외형) | **PASS** |
| 렌더링 diff (6뷰포트 + 320px + 200% + JS 비활성 + 기능 + 모션) | **117 PASS · 0 FAIL · 10 BASELINE ISSUE** |
| 서브페이지 영향 (표본 15개 × 2뷰포트) | **30/30 PASS** |
| 산출물 diff (HTML 1,349개) | **PASS** — 전부 바이트 동일 |
| 성능 (각 5회) | **회귀 경고선 미초과** (CSS 전송량 증가는 기록) |
| 저장소 자체 검증 스크립트 10종 | **전부 통과** |
| 빌드 / 타입체크 / 테스트 | **통과** (테스트 41/41) |
| 운영본 대조 · 레퍼런스 실사 · Lighthouse · 현장 INP | **NOT RUN / 데이터 없음** |

---

## A. 보호 항목 (초기 HTML)

`node tools/home-redesign/diff-manifest.mjs evidence/manifest-home-before.json evidence/manifest-home-after.json`

| 항목 | 상태 | 값 |
|---|---|---|
| title / lang / charset / viewport / canonical / robots | PASS | 동일 |
| meta 19개 필드 (description·keywords·OG 8종·twitter 4종·theme-color·naver-site-verification 등) | PASS | 동일 |
| link rel (canonical·icon 3종·apple-touch-icon·manifest·RSS alternate) | PASS | 동일 |
| JSON-LD | PASS | `@graph` 5종 (WebSite·Organization·ProfessionalService·BreadcrumbList·FAQPage) 동일 |
| 헤딩 텍스트·레벨·순서 | PASS | 54개 동일 (H1 1개) |
| 섹션 순서·anchor id | PASS | `header#top > main > … > footer` 15개 동일 |
| 링크 (href·문구·rel·target·data-cta·순서) | PASS | 115개 동일 |
| 영역별 링크 수 | PASS | header 18 · mobile-nav 17 · hero 2 · purpose 9 · portfolio 4 · services 7 · pricing 9 · insight 3 · contact 7 · footer 36 · mobile-cta 3 |
| 이미지 src/alt/width/height/loading | PASS | 6개 동일 |
| video/source/poster · figcaption | PASS | 동일 |
| 로고 마크업·문구 | PASS | header·footer 2곳 동일 |
| 폼 (필드명·type·required·placeholder·select 옵션·라벨) | PASS | 동일 |
| 버튼 (문구·role·aria-*·data-filter) | PASS | 동일 |
| 계측 훅 (data-cta / data-cta-loc / 전체 data-*) | PASS | 동일 |
| 비교표 값·행·열 | PASS | 동일 |
| FAQ 질문·답변·순서 | PASS | 12개 동일 |
| **가격 8종** (금액·기간·VAT·포함·별도·CTA) | PASS | 980,000 / 1,960,000 / 3,800,000 / 5,800,000 / 5,800,000 / 9,800,000 / 13,800,000 / 19,800,000 원 동일 |
| noscript 텍스트 | PASS | 동일 |
| 본문 블록(DOM 읽기 순서) · 전체 본문 SHA-256 | PASS | 동일 |

> 이 모든 항목이 동일한 이유: `index.html` 을 한 글자도 바꾸지 않았고,
> `out/index.html` 의 SHA-256 이 변경 전후 동일합니다
> (`19e26280a590419264e40c5c17c83fe4e0ff069c9adf28c0c2668ea3d6f6a680`).

## B. 로고 보존

| 항목 | 상태 | 근거 |
|---|---|---|
| `public/logo.png` | PASS | SHA-256 `03790b40…` 동일 (11,542 B) |
| favicon.ico / 16 / 32 / apple-touch-icon / icon-192 / icon-512 | PASS | 6개 해시 전부 동일 |
| og-image.jpg / og-default.png / site.webmanifest | PASS | 해시 동일 |
| 로고 CSS (`.logo`, `.logo__mark`, `.logo__ko`, `.footer .logo`, `.footer .logo__ko`) | PASS | 선언 5개 원문 동일 — **홈 스코프 블록에서 로고 선택자를 건드리지 않았습니다** |
| 로고 마크업·아이콘 link·OG·schema logo URL | PASS | 원문 동일 |
| **렌더 외형**(6뷰포트) | PASS | 워드마크 font-family/size 18.5px/weight 800/letter-spacing −0.555px/color, `.logo__ko` 15px/700, 마크 30×30·비율 1.0·`filter: none`·`opacity: 1`·`mix-blend-mode: normal` — 전부 동일 |

해시가 같아도 CSS 로 외형이 바뀔 수 있으므로 **렌더 계산값까지** 비교했습니다.

## C. 렌더링 · 가시성 (360 / 390 / 430 / 768 / 1280 / 1440px)

| 항목 | 상태 | 값 |
|---|---|---|
| 화면 텍스트 손실 | PASS | 공백 제외 글자 **8,198자 전 뷰포트 동일**. 공백 3칸 차이만 존재 — 아래 참고 |
| 헤딩(가시성 포함) | PASS | 54개 동일 |
| 링크(가시성·영역 포함) | PASS | 115개 동일 |
| 문서 가로 스크롤 | PASS | 전 뷰포트 없음 |
| 화면 밖 넘침 요소 | PASS | 0 → 0 (비교표는 자체 가로 스크롤 컨테이너 안, 의도된 동작) |
| 320px | PASS | 가로 스크롤 없음, 새 넘침·새 대비 미달 0 |
| 200% 확대 | PASS | 가로 스크롤 없음, 새 넘침·새 대비 미달 0 |
| 대비 — 새로 미달한 요소 | PASS | **0개** |
| 대비 — 기존 미달 | BASELINE ISSUE | 1개 (B-2, 값 3.05 그대로) |
| 터치 영역 — 44px 미만으로 줄어든 요소 | PASS | 0개 |
| 터치 영역 — 44px 이상으로 커진 요소 | PASS | 뷰포트당 6~8개 |
| 포트폴리오 카드 수 / FAQ 항목 수 / FAQ 초기 접힘 | PASS | 15 / 12 / 0개 열림 — 동일 |
| 콘솔·리소스 오류 | PASS | 1 → 1 (새 오류 0, 리소스 404 0) |

### 공백 3칸 차이에 대하여

변경 후 Hero 설명문의 렌더 텍스트가 3글자(공백) 짧습니다. 확인 결과:

| | 렌더 결과 |
|---|---|
| HTML 원문 | `름랩(REUMLAB)은 앱, …` / `…예상 범위를 안내드립니다.` |
| 변경 전 | `름랩(REUMLAB) 은 앱, …` / `…예상 범위 를 안내드립니다.` ← flex 항목 사이에 공백 삽입 |
| 변경 후 | `름랩(REUMLAB)은 앱, …` / `…예상 범위를 안내드립니다.` ← **원문과 일치** |

공백을 제거한 글자열은 변경 전후 **완전히 동일**(8,198자)합니다.
내용이 사라진 것이 아니라, 조사가 명사에서 떨어져 보이던 것이 원문대로 돌아온 것입니다.

## D. JS 비활성 렌더링

| 항목 | 상태 | 값 |
|---|---|---|
| title / H1 | PASS | 동일 |
| 헤딩 수 / 링크 수 | PASS | 54 / 115 동일 |
| 포트폴리오 카드 (초기 HTML 주입분) | PASS | 15개 동일 |
| FAQ 답변 (초기 HTML 내 존재) | PASS | 12개 동일 |
| 본문 텍스트 | PASS | 공백만 3칸 차이, 공백 제외 동일 |

JS 실행 후에만 생기는 콘텐츠를 새로 만들지 않았습니다.

## E. 기능 (네트워크 mock, 실제 전송 없음)

데스크톱 1280 / 모바일 390 양쪽에서 실행.

| 검사 | 데스크톱 | 모바일 | 내용 |
|---|---|---|---|
| FAQ 열기/닫기 | PASS | PASS | 닫힘 0px → 열림 79/134px → 다시 0px, 답변 실제 표시 |
| 포트폴리오 필터 | PASS | PASS | 전체 15 → "모바일 앱" 4 → 전체 15 복귀 |
| 포트폴리오 모달 | PASS | PASS | 열림·본문 578자·모달 내 포커스 진입·ESC 닫기·포커스 복귀 |
| 데스크톱 서비스 메뉴 | PASS | — | 호버 시 항목 11개 표시 |
| 모바일 내비 | — | PASS | 열림(aria-expanded=true, inert 해제) → 서비스 11개 → 닫힘(inert 복귀) |
| 키보드 포커스 가시성 | PASS | PASS | Tab 14회 전부 보이는 포커스 링 |
| 문의 폼 | PASS | PASS | 동의 전 `checkValidity()` false → 동의 후 true → 제출 **차단**(POST `/__forms.html` 가로채고 abort) |

**실제 문의 발송·이메일·DB 기록·결제는 하지 않았습니다.** 운영 계측 코드(GA/GTM/픽셀 ID,
이벤트명, 제출 경로)는 바꾸지 않았고, 대신 검사 중 외부 요청을 전부 차단했습니다.

| 항목 | 상태 |
|---|---|
| `prefers-reduced-motion: reduce` 애니메이션 | PASS — 0 → 0개 |
| `prefers-reduced-motion: reduce` 트랜지션 요소 | PASS — 107 → 0개 (홈 스코프에서 전부 억제) |

## F. 성능 — 기준본/변경본 각 5회, 중앙값

### 모바일 390×844

| 지표 | 변경 전 | 변경 후 | 차이 | 판정 |
|---|---|---|---|---|
| LCP | 336 ms | 348 ms | +3.6% | 경고선(+10%) 미만 |
| CLS | 0 | 0 | 0 | PASS |
| long task >50ms 합 | 269 ms | 283 ms | +5.2% | 경고선 미만 |
| CSS 전송 | 84,125 B | 93,338 B | +11.0% | **기록** (gzip 기준 +1,419 B) |
| JS 전송 | 33,336 B | 33,336 B | 0% | PASS — 초기 JS 증가 없음 |
| 이미지 전송 | 81,634 B | 81,634 B | 0% | PASS |

LCP 편차(σ): 변경 전 67.5ms / 변경 후 16.5ms. 변경 전 1회차가 500ms 로 튀었습니다.
**+3.6% 는 이 측정 노이즈 범위 안이며, 개선이라고도 악화라고도 단정하지 않습니다.**

### 데스크톱 1280×900

| 지표 | 변경 전 | 변경 후 | 차이 | 판정 |
|---|---|---|---|---|
| LCP | 456 ms | 392 ms | **−14.0%** | PASS |
| **CLS** | **0.1151** | **0.0344** | **−0.0807** | PASS (개선) |
| long task >50ms 합 | 337 ms | 289 ms | −14.2% | PASS |
| CSS / JS / 이미지 전송 | 위와 동일 | | | |

CLS 개선 원인: Hero 폰트 스왑 시 텍스트 높이 변화폭이 줄어 `.hero__trust`·`.hero__cta`·목업 열이
덜 밀립니다(변경 전 약 35px → 변경 후 약 12~25px). 5회 모두 같은 값이 나왔습니다.
**폰트 스왑이라는 원인 자체는 남아 있습니다** (`06-baseline-issues.md` B-4).

### 측정하지 않은 것

| 항목 | 상태 | 이유 |
|---|---|---|
| Lighthouse 점수 | **NOT RUN** | 이 환경에 Lighthouse 미설치 |
| 현장 INP | **데이터 없음** | 실사용자 데이터 없이 산출 불가. long task 합계로 대체하지 않습니다. |
| 네트워크/CPU 스로틀 조건 | **NOT RUN** | 스로틀 프로파일을 적용하지 않았습니다 |
| 실제 기기(iOS/Android 실물) | **NOT RUN** | 에뮬레이션만 수행 |

장기 관측 목표(p75 LCP ≤2.5s · INP ≤200ms · CLS ≤0.1)는 **운영 후 관측 항목**이며,
로컬 5회 측정으로 Core Web Vitals 통과를 인증하지 않습니다.

## G. 서브페이지 영향

표본 15개 × 2뷰포트 = **30/30 PASS**. **전수(1,349개) 검사가 아닙니다.**

비교한 값: status · title · canonical · robots · 로드한 스타일시트 · body 속성 ·
body 계산 스타일 · H1 · 헤딩 수 · 링크 수 · 본문 길이 · scrollWidth ·
`:root` 커스텀 프로퍼티 13종 · 공용 선택자 13종(`.wrap` `.hero` `h1` `.sec-title`
`.btn--primary` `.btn--ghost` `.section` `.logo` `.logo__mark` `.header` `.card` `.faq-q`)의 계산값.

| 표본 | 템플릿 | 결과 |
|---|---|---|
| `/mvp/` `/erp/` `/website/` | **목적별 랜딩 — `styles.css` 를 홈과 공유** | PASS (계산값 전부 동일) |
| `/portfolio/` `/source-handover/` `/app-development/dongtan/` `/guide/` `/blog/` `/cost/` `/enterprise-ai/` `/app/` | Next app router | PASS |
| `/soho/` `/geo-website/` | Next + 전용 CSS / CSS module | PASS |
| `/privacy/` `/terms/` | 정적 법적 고지 | PASS |

공유 파일(`styles.css`)을 수정했음에도 랜딩 8개의 렌더 계산값이 그대로인 것이
**홈 스코프 격리의 실제 증거**입니다.

## H. 색인 지시자 · 검색 자산

| 항목 | 변경 전 | 변경 후 | 상태 |
|---|---|---|---|
| HTML 문서 수 | 1,349 | 1,349 | PASS |
| `noindex` 페이지 수 | 568 | 568 | PASS |
| `nofollow` / `nosnippet` | 0 / 0 | 0 / 0 | PASS |
| sitemap URL 수 | 778 | 778 | PASS |
| `robots.txt` `sitemap.xml` `feed.xml` `llms.txt` `llms-full.txt` `_redirects` `site.webmanifest` `__forms.html` | — | — | PASS (해시 동일) |
| 프리뷰 전용 색인 차단이 운영 산출물에 섞였는가 | — | 0건 | PASS |

## I. 저장소 자체 검증 스크립트

| 명령 | 결과 |
|---|---|
| `npm run build` | 성공 (HTML 1,349 · sitemap 778) |
| `npm run typecheck` | 통과 (오류 0) |
| `npm test` | 41/41 통과 |
| `npm run seo:qa` | 통과 (기존 경고 1건: 클릭 깊이 ≥6 색인 페이지 109개 — BASELINE) |
| `npm run seo:audit:index` | 통과 (깨진 링크 0 · 고아 0 · 리다이렉트 체인 0) |
| `npm run seo:verify` | 통과 |
| `npm run seo:verify:content` | 통과 |
| `npm run seo:verify:pricing` | 통과 (폐기가격 0건, 홈 요금표 일치) |
| `npm run seo:verify:menu` | 통과 (메뉴 11개, 홈 2곳·랜딩 8곳 일치) |
| `npm run seo:verify:conversion` | 통과 (전환 이벤트·PII·UTM 이상 없음) |
| `npm run seo:verify:portfolio` | 통과 |
| `npm run seo:verify:naver` | 통과 |
| `npm run seo:verify:faq` | 통과 |
| lint | **NOT RUN** — 이 저장소에 lint 스크립트·ESLint 설정이 없습니다 |

IndexNow 제출 계열(`seo:indexnow`, `neo:indexnow:submit`, `neo:http`)은 **실행하지 않았습니다**.

## J. 실행하지 못한 검사 (NOT RUN / BLOCKED)

| 항목 | 상태 | 이유 |
|---|---|---|
| 운영 홈 `https://reumlab.com/` HTML·헤더·화면 수집 | **BLOCKED** | egress 정책 403 (`connect_rejected`) |
| 운영본 ↔ 로컬 기준본 콘텐츠 일치 확인 | **BLOCKED** | 위와 동일. 저장소가 운영보다 오래되었는지 확인 불가 |
| 운영 URL 응답·리다이렉트 실측 | **NOT RUN** | 위와 동일. `_redirects` 규칙 153개는 파일로만 확인 |
| Apple·Toss 레퍼런스 4개 실화면 | **NOT RUN** | egress 403 (`02-references.md`) |
| Google/W3C 공식 가이드 원문 | **NOT RUN** | egress 403 |
| Lighthouse 점수 | **NOT RUN** | 미설치 |
| 현장 INP·실사용자 CWV | **데이터 없음** | 배포 전이며 실사용자 데이터 없음 |
| 실제 기기 테스트 | **NOT RUN** | 에뮬레이션만 수행 |
| 서브페이지 전수(1,349개) 렌더 검사 | **NOT RUN** | 표본 15개만 수행 |
| Search Console / 분석 도구 데이터 | **NOT RUN** | 접근 권한 없음 |
| 승인된 공개 preview 배포·noindex 검증 | **해당 없음** | preview 를 만들지 않았습니다 |

---

## 재현 명령

```bash
npm ci
npm run build                                  # 변경본 → out/
node tools/home-redesign/serve-out.mjs out 4322 &

# 기준본을 따로 만들려면
git stash && npm run build && cp -a out /tmp/out-before && git stash pop && npm run build
node tools/home-redesign/serve-out.mjs /tmp/out-before 4321 &

export NODE_PATH=/opt/node22/lib/node_modules   # playwright 위치(환경에 맞게)
node tools/home-redesign/extract-manifest.mjs out/index.html --out after.json
node tools/home-redesign/logo-manifest.mjs --out logo-after.json
node tools/home-redesign/render-audit.mjs   --base http://127.0.0.1:4321 --label before --out ./r-before
node tools/home-redesign/render-audit.mjs   --base http://127.0.0.1:4322 --label after  --out ./r-after
node tools/home-redesign/diff-render.mjs    ./r-before/render-before.json ./r-after/render-after.json
node tools/home-redesign/subpage-audit.mjs  --base http://127.0.0.1:4321 --label before --out ./sp
node tools/home-redesign/subpage-audit.mjs  --base http://127.0.0.1:4322 --label after  --out ./sp
node tools/home-redesign/diff-subpages.mjs  ./sp/subpages-before.json ./sp/subpages-after.json
node tools/home-redesign/perf-measure.mjs   --before http://127.0.0.1:4321 --after http://127.0.0.1:4322 --runs 5 --viewport mobile  --out perf-m.json
node tools/home-redesign/perf-measure.mjs   --before http://127.0.0.1:4321 --after http://127.0.0.1:4322 --runs 5 --viewport desktop --out perf-d.json
node tools/home-redesign/artifact-diff.mjs  /tmp/out-before out
node tools/home-redesign/capture-compare.mjs --before http://127.0.0.1:4321 --after http://127.0.0.1:4322 --out docs/home-redesign/shots
```

`playwright` 는 이 저장소의 의존성이 아닙니다(`package.json` 을 건드리지 않기 위해 추가하지 않았습니다).
검사 스크립트는 프로젝트 `node_modules` → `PLAYWRIGHT_MODULE_PATH` → `NODE_PATH` → 전역 설치 순으로 찾습니다.

원시 결과: `evidence/` (렌더 원시 결과는 `.json.gz`)
