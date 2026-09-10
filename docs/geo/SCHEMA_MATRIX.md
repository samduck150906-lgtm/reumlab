# Schema matrix

| 페이지 유형 | 전역 schema | 페이지 schema | 근거/주의 |
|---|---|---|---|
| 홈 | WebSite, Organization, ProfessionalService | Service/Offer, FAQPage | 화면 가격·FAQ와 일치 |
| 서비스 허브 | 전역 3종, BreadcrumbList | Service, FAQPage | 실제 화면 서비스·FAQ만 출력 |
| 지역×서비스 | 전역 3종, BreadcrumbList | Service, Place, FAQPage | 실제 지점으로 오해할 LocalBusiness 미사용 |
| 업종/솔루션/비용 | 전역 3종, BreadcrumbList | Service, FAQPage | 업종별 템플릿은 색인 게이트 적용 |
| 가이드/블로그/비교 | 전역 3종, BreadcrumbList | Article 또는 BlogPosting, FAQPage(표시될 때만) | 공개 날짜·수정일과 본문 일치 |
| 포트폴리오 | 전역 3종, BreadcrumbList | 사례 내용에 맞춘 페이지 schema | Review/AggregateRating 미사용 |
| 목록/허브 | 전역 3종, BreadcrumbList | CollectionPage | 실제 링크 목록 기반 |
| 404/시스템 | 없음 또는 최소 | 없음 | noindex, sitemap 제외 |

## 엔터티 연결

- `https://reumlab.com/#website`
- `https://reumlab.com/#organization`
- `https://reumlab.com/#business`

동일 `@id`는 한 문서에서 중복 생성하지 않는다. 페이지별 Service/Article은 위 전역 엔터티를 provider/publisher로 연결한다.

## 제외한 schema

- `legalName`: 법적 상호 미확인.
- `founder`: 대표자와 창업자 동일 여부 미확인.
- Review/AggregateRating: 검증 가능한 공개 리뷰·평점 데이터 없음.
- LocalBusiness 다중 지점: 실제 방문 가능한 지역 지점이 확인되지 않음.
- 화면에 없는 FAQ: 구조화 데이터 전용 숨김 답변을 만들지 않음.

## 최종 정적 검증

JSON-LD 문법 오류 0, 전역 엔터티 중복 0, 검증 불가 필드 0, breadcrumb 오류 0. 출력 수는 WebSite/Organization/ProfessionalService/BreadcrumbList 각 1,338, Service 1,257, FAQPage 1,080, Article 58, CollectionPage 5다.
