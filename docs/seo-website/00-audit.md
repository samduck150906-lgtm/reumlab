# 검색 잘되는 홈페이지 제작 — 변경 전 감사

기준일: 2026-09-22  
상태: 구현 전 기준선

## 프로젝트와 변경 안전성

- 작업 트리: `worktrees/enternal-ai`
- 저장소 루트: 현재 작업 트리 루트
- 브랜치: `codex/enternal-ai`
- 기준 커밋: `3bfc4cd`
- Git 상태: 변경 없음
- 원격: `origin=https://github.com/samduck150906-lgtm/reumlab.git`
- 연결 Netlify site id: `08c4fed6-f457-43a0-a430-9bd155864abd`
- 프레임워크: Next.js 14.2 정적 export, React 18, TypeScript 5.9
- 패키지 관리자: npm (`package-lock.json`)
- 운영 빌드: `npm run build && npm run seo:indexnow`; 프리뷰 빌드: `npm run build`
- 기존 테스트 기준선: `npm test` 실행, 162개 통과·0개 실패

## 기존 정보 구조

| URL | 현재 역할 | 결정 |
|---|---|---|
| `/website/` | 294개 업종별 일반 홈페이지 제작 허브 | 유지하고 신규 서비스 진입 링크만 추가 |
| `/geo-website/` | GEO·AI 검색을 고려한 홈페이지 제작 | 기존 역할·판매정책 유지 |
| `/ai-search-optimization/` | 기존 홈페이지의 검색·AI 구조 개선 | 기존 역할·가격 유지 |
| `/data-seo/` | 대규모 데이터·페이지 자동화 구축 | 비개발자용 신규 제작 링크만 추가 |
| `/seo-website/` | 현재 라우트 없음 | 대표 서비스로 신설 |

## 중복 조사 결과

다음 기존 URL은 살아 있는 canonical과 사이트맵 상태를 보존하고, 새 페이지를 복제하지 않는다.

| page_id | 기존 URL |
|---|---|
| CLEANING | `/website/cheongsoeobche/` |
| MOVING | `/website/isaeobche/` |
| DEMOLITION | `/website/cheolgeoeobche/` |
| LEAK | `/website/nusutamjieobche/` |
| WATERPROOF | `/website/bangsueobche/` |
| INTERIOR | `/website/interieoeobche/` |
| AIRCON | `/website/eeokeoneobche/` |
| WASTE | `/website/pyegimulcheorieobche/` |
| MANUFACTURING | `/website/jejoeob/` |
| STAFFING | 동등 URL 없음 — `/seo-website/staffing/` 신설 |

동일 목적의 검색 등록·SEO 견적 체크리스트 가이드는 `lib/guides.ts`에 없으므로 신규 정적 가이드 2개를 만든다.

## 디자인·SEO 구현 현황

- 공통 헤더: `components/Nav.js`, 메뉴 데이터: `content/service-menu.json`
- 공통 푸터: `components/BusinessFooter.tsx`
- 사이트 엔티티와 안전한 JSON-LD: `components/JsonLd.tsx`, `lib/schema.ts`
- 정규 호스트: `https://reumlab.com`, trailing slash 사용
- 메타: Next Metadata API, 페이지별 absolute title 관례
- 사이트맵 단일 소스: `app/sitemap.ts`; 빌드 후 `scripts/split-sitemap.mjs`
- robots: `app/robots.ts`
- 홈은 `index.html`이 최종 산출물을 덮어쓰는 하이브리드 구조
- 기존 Google/Naver/Bing 확인 파일과 네이버 메타 태그 존재. 삭제·교체하지 않는다.
- 현재 네이버 보호 기준선은 `config/naver-index-baseline.json`과 빌드 게이트가 지킨다.

## 문의·측정 기준선

- 실제 접수: Netlify Forms `main-apply`
- 감지 스키마: `public/__forms.html`
- Next 폼: `components/LandingInquiryForm.tsx`
- honeypot, 제출 중 잠금, 20초 timeout, HTTP 실패 처리, UTM과 최초 유입 보존이 이미 구현돼 있다.
- 기존 성공 이벤트는 서버 2xx 이후에만 `generate_lead`가 한 번 발생한다.
- 공통 이벤트: `page_context`, `cta_click`, `inquiry_form_start`, `generate_lead`
- 분석 차단 시 폼 제출은 계속 동작한다.
- 전화: `010-8111-9370`; 이메일과 주소는 `lib/seo.ts`의 `SITE` 단일 출처를 사용한다.

## 변경 전 위험과 대응

1. 기존 업종 페이지와 신규 업종 페이지가 자기잠식할 수 있음 — 기존 URL 보강으로 해결.
2. `main-apply` 새 필드를 정적 감지 폼에 누락할 수 있음 — 동일 스키마 테스트를 먼저 추가.
3. 정적 홈과 Next 메뉴가 갈라질 수 있음 — 메뉴 데이터·정적 홈·주입 스크립트 결과를 함께 검증.
4. 사이트맵 추가 과정에서 기존 보호 URL이 빠질 수 있음 — 네이버 보호 게이트와 전체 빌드 사용.
5. FAQPage가 현재 Google 표시 정책과 맞지 않을 수 있음 — 신규 FAQ는 화면에만 제공하고 스키마에서는 제외.
