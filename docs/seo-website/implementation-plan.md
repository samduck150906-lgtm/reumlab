# 검색 잘되는 홈페이지 제작 — 구현 계획과 상태

승인 명세: `docs/superpowers/specs/2026-09-22-seo-website-service-design.md`  
상세 TDD 계획: `docs/superpowers/plans/2026-09-22-seo-website-service.md`

| 작업 | 주요 경로 | 상태 |
|---|---|---|
| URL·콘텐츠 단일 출처와 중복 방지 | `lib/seo-website.ts` | PASS |
| 대표·지역·비용·인력 페이지 | `app/seo-website/**` | PASS |
| 가이드 2개 | `app/seo-website/guides/**` | PASS |
| 기존 업종 9개 고유 정보 보강 | `app/website/[industry]/page.tsx`, 공통 컴포넌트 | PASS |
| 문의폼·Netlify 감지 스키마 | `LandingInquiryForm.tsx`, `public/__forms.html` | NOT_RUN |
| 메뉴·홈·관련 서비스·사이트맵·LLM 인덱스 | 관련 기존 파일 | NOT_RUN |
| 자동·브라우저·운영 검증 | `scripts/check-seo-website.*`, QA 문서 | NOT_RUN |
| 배포와 검색 등록 | Netlify, GSC, Search Advisor | NOT_RUN |

## 실행 결정

- 기존 인덱스 URL을 없애거나 canonical을 변경하지 않는다.
- 신규 상품에는 고정가를 만들지 않는다.
- 검색 등록·수집 요청은 운영 배포와 응답 검증 후 대표 URL만 수행한다.
- 외부 계정 조작 결과는 PASS, MANUAL_REQUIRED, PENDING_EXTERNAL로 분리한다.
