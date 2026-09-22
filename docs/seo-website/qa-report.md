# 검색형 홈페이지 QA 보고서

기준일: 2026-09-22

## 자동 검증

| 항목 | 명령 | 상태 | 결과 |
|---|---|---|---|
| 변경 전 전체 테스트 | `npm test` | PASS | 162 pass, 0 fail |
| 전체 단위·회귀 테스트 | `npm test` | PASS | 179 pass, 0 fail |
| 전용 정적 산출물 검사 | `npm run seo:verify:seo-website` | PASS | 6페이지 title/H1/canonical/index/form/schema/sitemap 검사 |
| TypeScript | `npm run typecheck` | PASS | 오류 0 |
| 전체 프로덕션 빌드 | `npm run build` | PASS | 1,352 정적 페이지 생성, 모든 빌드 게이트 통과 |
| 네이버 보호 기준선 | 빌드 내 `neo:protect:index` | PASS | 기존 보호 URL 786개 전부 유지, 현재 sitemap 792 URL |

첫 빌드 실패는 페이지 결함이 아니라 새 검증기의 예상 문자열과 분할 사이트맵 조회 범위 문제였다. 실제 산출물을 기준으로 검사기를 수정했으며 단위 테스트로 회귀를 고정했다. 두 번째 실행은 새 한국어 음절 5개가 폰트 서브셋 밖인 것을 기존 성능 게이트가 차단했다. `scripts/build-font-subsets.py`로 1,348자·224KB 서브셋을 재생성하고 11개 선언을 동기화한 뒤 최종 전체 빌드가 통과했다.

## 브라우저·운영

| 검증 | 상태 | 증거 |
|---|---|---|
| 360/390/768/1280/1440 화면 | PASS | 5개 폭 모두 `scrollWidth <= innerWidth`; 모바일·데스크톱 스크린 직접 확인 |
| FAQ·폼 상호작용 | PASS | FAQ 펼침, 이름·업종·상태·지역·관심 범위 입력 상태 확인; 운영 전송은 별도 |
| 신규·기존 페이지 회귀 | PASS | 홈·website·GEO·AI 개선·data 및 신규 6 URL 브라우저에서 title/H1/canonical 확인 |
| 브라우저 콘솔 | PASS | error/warning 0건 |
| 운영 HTTP·canonical·기존 주요 페이지 | PASS | 홈·website·GEO·AI 개선·data·신규 6 URL 200, 임의 미존재 URL 404, 대표 canonical/H1 확인 |
| Netlify Forms 실제 수신 | PASS | `main-apply`에서 2026-09-22 15:32 테스트 접수와 신규 필드·최초 랜딩·UTM 저장 확인 |
| Lighthouse 모바일 | PASS | Performance 87, Accessibility 100, SEO 100, LCP 3.5s, CLS 0.023, TBT 0ms |
| Lighthouse 데스크톱 | PASS | Performance 98, Accessibility 100, SEO 100, LCP 1.1s, CLS 0.002, TBT 0ms |

Lighthouse Best Practices는 모바일·데스크톱 모두 77이었다. 실패 항목은 기존 네이버 분석 요청(`wcs.naver.com`, `nam.veta.naver.com`)의 서드파티 쿠키/Chrome Issues 2종이며 이번 서비스 코드의 콘솔 오류가 아니다. 재현에 필요한 핵심 결과는 `docs/seo-website/lighthouse-summary.json`에 기록했다. 이 수치는 로컬 정적 서버에서 측정한 합성 실험이며 필드 Core Web Vitals가 아니다.

로컬 HTTP 확인은 신규 6 URL 모두 200, 임의 미존재 URL은 404였다.

운영 폼은 `POST /__forms.html`의 200 응답 뒤 Netlify 대시보드에서 실제 접수 레코드를 열어 검증했다. `service_key=seo_website`, 업종 `청소`, 홈페이지 상태 `홈페이지 없음`, 지역 `서울 테스트 지역`, 범위 `문의 연결`, `source_landing=/seo-website/`, `utm_source=qa`, `utm_medium=codex`, `utm_campaign=seo_website_release`가 보존됐다. 이 서버 수신 검증은 브라우저의 `generate_lead` 발화 여부를 대신하지 않는다.

## 자동 검증 범위

`scripts/check-seo-website.mjs`는 6개 신규 URL에 대해 정적 HTML 존재, 고유 title/H1, self-canonical, noindex 부재, 핵심 본문, 상위 서비스 링크, Service/Article JSON-LD, 서비스 페이지의 `main-apply`와 9개 맥락 필드, 분할 사이트맵 등록을 검사한다.
