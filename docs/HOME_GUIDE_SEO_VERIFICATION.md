# 홈·가이드 SEO 개선 — 실행한 검사와 결과 (2026-09-15)

실행하지 못한 검사는 **미검증**으로 표시했다. 코드가 작성된 것과 기능이 검증된 것을 구분한다.
**운영 미배포 상태다.** 아래는 전부 로컬 빌드(`out/`) 기준 결과다.

## 1. 명령별 실행 결과

| 명령 | 결과 | 비고 |
|---|---|---|
| `npm run typecheck` | **PASS** (오류 0) | |
| `npm test` | **PASS** 57/57 | 기준선 41 → 57 (게이트 테스트 16건 신설) |
| `npm run build` | **PASS** (exit 0) | 체인 끝에 `seo:verify:home-guide` 연결 |
| `npm run seo:verify:home-guide` | **PASS** | 신규 게이트 |
| `npm run seo:verify:faq` | **PASS** | 화면/스키마 불일치 0 |
| `npm run geo:check-entities` | **PASS** (⚠ 9) | 경고는 기준선과 동일(`인계동` 문맥) |
| `npm run geo:validate-schema` (qa-final) | **PASS** (⚠ 1) | 경고는 기준선과 동일(클릭 깊이) |
| `npm run seo:verify:pricing` | **PASS** | 폐기가격 0, 홈 요금표 일치 |
| `npm run seo:verify:naver` | **PASS** | 소유확인·Yeti·사이트명·SSR·OG·RSS |
| `npm run seo:verify` | **PASS** | 사이트맵·robots |
| `npm run seo:audit:index` | **PASS** | canonical 누락 0 · 중복 0 · 고아 0 |
| `npm run seo:qa` | **PASS** (⚠ 1) | 기준선과 동일 |
| `npm run seo:verify:content` | **PASS** | |
| `npm run seo:verify:geo` | **PASS** | |
| `npm run seo:verify:menu` | **PASS** | |
| `npm run seo:verify:conversion` | **PASS** | CTA·폼·PII·전환 시점 |
| `npm run seo:verify:cannibalization` | **PASS** | |
| `npm run seo:verify:portfolio` / `:media` | **PASS** | |
| `npm run neo:verify:indexnow` | **PASS** | 정적 검증만, 외부 전송 없음 |
| `npm run neo:indexnow:dry-run` | 실행 | **dry-run 만** — 실전 제출 안 함 |

**신규 경고 0건.** 3개 경고(⚠ 9 + ⚠ 1 + ⚠ 1)는 수정 전 기준선과 문구·건수까지 동일하다.

## 2. 게이트가 실제로 실패를 잡는지 (결함 주입 테스트)

`scripts/verify-home-guide-seo.test.mts` — 실제 페이지를 훼손하지 않고 임시 fixture 에 결함을
주입한 뒤 종료코드가 non-zero 인지 확인한다. **16/16 PASS** (양성 대조 1 + 결함 주입 15).

| 주입한 결함 | 기대 실패 종류 | 결과 |
|---|---|---|
| (양성 대조) 정상 산출물 | 통과해야 함 | PASS |
| description 삭제 | `[description]` | 검출 |
| description 중복 | `[description]` | 검출 |
| canonical 중복 | `[canonical]` | 검출 |
| canonical 도메인 오류 | `[canonical]` | 검출 |
| 가이드가 홈을 canonical 로 지정 | `canonical-propagation` | 검출 |
| JSON-LD 파손 | `jsonld-parse` | 검출 |
| 같은 사업장을 다른 `@id` 로 재정의 | `business-dup` | 검출 |
| 사업체 타입이 ProfessionalService 로 되돌아감 | `business-type` | 검출 |
| 스키마에만 있고 화면에 없는 질문 | `faq-sync` | 검출 |
| 스키마 답변을 본문과 다르게 변경 | `faq-sync` | 검출 |
| HTML id 중복 | `html-id` | 검출 |
| 이스케이프 안 된 `</script` | `jsonld-escape` | 검출 |
| 상담 폼(main-apply) 제거 | `[form]` | 검출 |
| 홈 noscript FAQ 대비 제거 | `faq-nojs` | 검출 |
| 가이드 목록 링크 일괄 제거 | `guide-links` | 검출 |

## 3. 게이트 통과 시 실측값

```
/
  description 1개(68자) · canonical 1개 https://reumlab.com/
  robots (없음 = index,follow) · og:url https://reumlab.com/ · twitter 4개
  ld+json 노드 5 · #business 타입 LocalBusiness
  FAQPage 1개 · 문항 12개
  HTML id 24개(중복 없음) · tel CTA 6개 · 상담폼 1개
  FAQ 접힘(CSS) 예 · noscript 펼침 대비 있음
/guide/
  description 1개(105자) · canonical 1개 https://reumlab.com/guide/
  robots index, follow · og:url https://reumlab.com/guide/ · twitter 4개
  ld+json 노드 6 · #business 타입 LocalBusiness
  FAQPage 1개 · 문항 6개 (화면 6개)
  ItemList 48개 · 목록 링크 96개 · FAQ 링크 10개
  HTML id 10개(중복 없음) · tel CTA 5개
전역: HTML 1344개 · canonical 누락 0 · 중복 0 · 홈 전파 0 · 사이트맵 791 URL
```

## 4. 브라우저 검수 (out/ 로컬 서빙 · Chromium)

`npm run dev` 화면이 아니라 모든 후처리가 끝난 `out/` 을 정적 서버로 띄워 검사했다.
**변경 전 비교본**은 `git worktree` 로 기준 커밋 `3a59be8` 을 별도 빌드해 만들었다
(사용자 작업 상태를 바꾸는 stash·reset 없이).

### 반응형 · 전후 레이아웃

| 경로 | 폭 | 가로 넘침 | 문서 높이 전→후 | faq-item 전→후 | nav/h1/footer |
|---|---|---|---|---|---|
| `/` | 360 | 0 → 0 | 32944 → 32944 (**+0**) | 12 → 12 | 동일 |
| `/` | 390 | 0 → 0 | 32186 → 32186 (**+0**) | 12 → 12 | 동일 |
| `/` | 768 | 0 → 0 | 22814 → 22814 (**+0**) | 12 → 12 | 동일 |
| `/` | 1440 | 0 → 0 | 17327 → 17327 (**+0**) | 12 → 12 | 동일 |
| `/guide/` | 360 | 0 → 0 | 8054 → 9889 (+1835) | 0 → 6 | 동일 |
| `/guide/` | 390 | 0 → 0 | 7841 → 9559 (+1718) | 0 → 6 | 동일 |
| `/guide/` | 768 | 0 → 0 | 3936 → 5068 (+1132) | 0 → 6 | 동일 |
| `/guide/` | 1440 | 0 → 0 | 3862 → 4729 (+867) | 0 → 6 | 동일 |

홈은 **본문 마크업 변경이 0**이다(`git diff index.html` = JSON-LD `@type` 1줄 + 주석 1줄 + noscript 추가).
문서 높이가 모든 폭에서 완전히 같다. 가이드 증가분은 추가한 FAQ 섹션의 아래쪽 높이뿐이다.

스크린샷(개발 산출물, `public/`·`out/` 밖):
`/tmp/.../scratchpad/shots/{home,guide}-{360,390,768,1440}-after.png`

### 기능·접근성

| 항목 | 결과 |
|---|---|
| JS 비활성 — 홈 FAQ | 질문 12 / **답변 12 보임** (수정 전 답변 0) |
| JS 비활성 — 가이드 FAQ | 질문 6 / 답변 6 보임 |
| `/guide/` 직접 접속·새로고침 | 정상, faq-item 6개 유지 |
| FAQ 내부 링크 이동 | `/guide/app-cost/` 이동 확인, h1 정상 |
| 키보드 포커스 | FAQ 링크 포커스 시 `outline: solid 2px` 표시 |
| 모바일 메뉴(390px) | 열림 정상, 항목 19개 |
| 상담 CTA 목적지 | `tel:01081119370`, `mailto:ceo@eternalsix.com` |
| JS 콘솔 오류 | 0 |
| FAQ 섹션 접근성 이름 | "가이드를 읽기 전 자주 묻는 질문" (H2, `aria-labelledby`) |
| h1 개수 / 중복 id / alt 누락 | 1 / 0 / 0 |

### 성능 (동일 환경·설정, 각 3회, 중앙값)

`/guide/` 모바일 Lighthouse, 로컬 정적 서버(압축·CDN 없음):

| | Performance | LCP | CLS |
|---|---|---|---|
| 변경 전 | 86 | 4182ms | 0.059 |
| 변경 후 | **85** | **4193ms** | **0.059** |

Performance −1점, LCP +11ms. 프로젝트에 기존 성능 budget 이 없어 이 문서의 경보 기준
(모바일 Performance −5점 초과 또는 LCP 가 max(기준선 10%, 150ms) 이상 악화)을 적용했고 **둘 다 미달**이다.
신규 클라이언트 JS·원격 폰트·이미지·API 호출 **0건**(외부 script 9개로 전후 동일, `use client` 없음).
HTML 은 67,906B → 79,203B 로 FAQ 본문만큼 늘었다.
이 수치를 검색 순위 합격선으로 해석하지 않는다.

## 5. 미검증 (권한·네트워크 제약)

| 항목 | 상태 | 사유 |
|---|---|---|
| 운영 HTTP GET 원문·리다이렉트 체인·`X-Robots-Tag`·`Link` 헤더 | **미검증** | 이그레스 프록시가 `reumlab.com:443` 을 `connect_rejected` |
| Googlebot UA 응답 비교 | **미검증** | 위와 동일 |
| schema.org / developers.google.com 공식 문서 현행 확인 | **미검증** | 이그레스 차단. `schema-dts@2.0.0` 어휘 정의문으로 대조 |
| 실사용자 INP·CrUX | **미측정** | 필드 데이터 없음. 로컬 Lighthouse 만으로 CWV 통과를 선언하지 않는다 |
| Rich Results Test / Search Console 검사 | **미검증** | 외부 서비스 접근 권한 없음 |
| 운영 배포 후 반영 | **미수행** | 이번 요청 범위에서 제외(원격 push·배포 금지) |

## 6. FAQPage 의 효과에 대한 한계

Google 은 2026-05-07 부터 FAQ 리치결과를 표시하지 않는다고 안내했고 관련 문서를 2026-06 에
제거한 것으로 전달받았다. **이번 실행 시점의 공식 문서는 이그레스 차단으로 확인하지 못했다(미검증).**
따라서 이 작업의 FAQPage 는 리치결과 확보 수단이 아니라
① 크롤러가 읽을 수 있는 HTML 본문, ② 구조화 데이터와 화면 내용의 일치,
③ 가이드를 읽기 전 방문자에게 실제로 유용한 답변을 목적으로 한다.
Schema.org 의 FAQPage 정의와 Google 의 검색 기능 지원은 별개다.
