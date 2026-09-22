# 검색 잘되는 홈페이지 제작 서비스 설계

기준일: 2026-09-22  
원본 명세: `C:/Users/CORI/Downloads/REUMLAB_SEO_WEBSITE_CODEX_PROMPT.md`

## 목표

기존 름랩 사이트 안에 일반 사업자가 이해할 수 있는 ‘검색 잘되는 홈페이지 제작’ 서비스군을 추가한다. 화면 제작만 설명하지 않고 업종·실제 활동 지역·서비스·비용 조건·문의·검색 등록까지 한 흐름으로 설명하며, 순위·색인·문의·매출은 보장하지 않는다.

## 저장소 조사에 따른 URL 결정

- 대표 서비스는 동일 목적의 독립 페이지가 없어 `/seo-website/`에 신설한다.
- 지역 구조와 비용 안내는 각각 `/seo-website/regional/`, `/seo-website/cost/`에 신설한다.
- 검색 등록과 견적 체크리스트는 `/seo-website/guides/search-registration/`, `/seo-website/guides/seo-checklist/`에 신설한다.
- 10개 업종 중 청소·이사·철거·누수탐지·방수·인테리어·에어컨·폐기물·제조업은 동등한 기존 `/website/<slug>/` URL이 있다. 이 URL을 유지하고 고유 정보와 새 서비스 링크를 보강한다.
- 동등 페이지가 없는 인력업체만 `/seo-website/staffing/`에 신설한다.
- `/website/`, `/geo-website/`, `/ai-search-optimization/`, `/data-seo/`의 기존 역할·가격·canonical은 바꾸지 않는다.

## 구현 구조

- `lib/seo-website.ts`: 페이지·업종·FAQ·가이드·URL 매핑의 단일 출처.
- `app/seo-website/**`: 서버 렌더되는 대표·상세·가이드 라우트.
- `components/SeoWebsiteIndustryEnhancement.tsx`: 선정된 기존 업종 페이지에만 고유 설계 정보를 추가.
- `LandingInquiryForm`의 `seo-website` 변형: 기존 Netlify `main-apply` 계약을 유지하면서 업종·홈페이지 상태·서비스 지역·희망 범위를 선택 필드로 추가.
- 기존 `cta_click`, `inquiry_form_start`, `generate_lead` 이벤트를 재사용하고 `service_key=seo_website`와 비식별 업종 enum만 보강한다.
- `app/sitemap.ts`, `generate-llms.mts`, 서비스 메뉴와 관련 페이지의 실제 링크를 확장한다.

## 데이터·안전 경계

- 신규 상품 가격은 ‘범위 확인 후 개별 견적’이다. 기존 웹 패키지 금액을 새 상품의 시작가로 재사용하지 않는다.
- 기존 786개 사이트맵·네이버 보호 URL은 제거하거나 noindex 처리하지 않는다.
- 가짜 고객·사례·지점·후기·인증·검색 성과를 만들지 않는다.
- 모든 주요 본문과 링크는 초기 HTML에 둔다. FAQ는 HTML `details/summary`로 제공하고 FAQPage 스키마는 신규 페이지에 기본 추가하지 않는다.
- 문의 데이터는 기존 Netlify Forms에 저장하며 연락처·이름·본문·URL을 분석 이벤트로 보내지 않는다.
- 검색 콘솔 제출과 실제 색인 완료는 별도 상태로 기록한다.

## 완료 기준

- 신규 6개와 기존 업종 9개가 중복 없이 연결된다.
- 메타·self-canonical·H1·Service/WebPage 또는 Article·Breadcrumb 구조화 데이터가 초기 HTML에 존재한다.
- 새 URL만 사이트맵에 추가되고 기존 URL은 모두 유지된다.
- 폼이 기존 `main-apply`로 제출되며 새 필드가 `__forms.html`에 등록된다.
- 자동 테스트, 타입 검사, 빌드, 산출물 SEO 검사, 모바일·접근성 브라우저 검사를 수행한다.
- 배포·Google·네이버 처리는 실제 권한과 관측 결과만 PASS로 기록한다.
