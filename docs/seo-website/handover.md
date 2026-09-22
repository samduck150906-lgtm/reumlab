# 검색형 홈페이지 운영 인수인계

기준일: 2026-09-22

## 대표 경로와 구조

- 대표: `/seo-website/`
- 하위 서비스: `/seo-website/regional/`, `/seo-website/cost/`, `/seo-website/staffing/`
- 가이드: `/seo-website/guides/search-registration/`, `/seo-website/guides/seo-checklist/`
- 업종 9개는 새 중복 URL 대신 기존 `/website/<industry>/` canonical을 보강했다.

## 운영 파일

- 콘텐츠 단일 출처: `lib/seo-website.ts`
- 서비스 화면: `app/seo-website/**`
- 업종 보강: `components/SeoWebsiteIndustryEnhancement.tsx`
- 문의 계약: `lib/seo-website-form.ts`, `components/LandingInquiryForm.tsx`, `public/__forms.html`
- 메뉴·탐색: `content/service-menu.json`, `index.html`, `components/BusinessFooter.tsx`
- 색인: `app/sitemap.ts`, `scripts/generate-llms.mts`
- 검증: `scripts/check-seo-website.mjs`

## 배포와 복구

- 기준 커밋: `3bfc4cd`
- 구현 커밋: 최종 검증·배포 뒤 기록
- 운영 URL/배포 ID: NOT_RUN
- 복구는 운영 공급자의 직전 정상 배포를 선택하거나 이번 기능 커밋만 `git revert`하는 방식으로 한다. 사용자 작업을 지우는 reset/clean은 사용하지 않는다.
- 심각한 문의 유실, 공개 차단, 개인정보 노출이 확인되면 신규 서비스 진입 링크와 해당 커밋을 되돌린 뒤 원인을 수정한다.

## 일상 운영

- 가격·업종·FAQ를 바꿀 때 `lib/seo-website.ts`와 실제 근거를 함께 갱신한다.
- 폼 필드를 추가하면 화면 폼과 `public/__forms.html` 감지 폼, 테스트를 동시에 갱신한다.
- 의미 없는 지역명 치환 페이지를 늘리지 않는다. 실제 서비스·사례·조건이 고유한 경우에만 새 canonical을 검토한다.
- 검색 등록 후에도 수집, 색인, 노출, 순위를 각각 구분해 관찰한다.
