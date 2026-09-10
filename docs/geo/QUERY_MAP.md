# Query map

각 행은 별도 URL 생성 지시가 아니라 기존 canonical 답변 구조다.

| user question | intent | canonical answer page | supporting guide | supporting case | required evidence | current gap/action |
|---|---|---|---|---|---|---|
| 앱 개발 외주 비용은 얼마인가 | 비용 비교 | `/flutter/` | `/guide/app-cost/` | `/portfolio/` | VAT 포함 패키지와 포함 범위 | 범위 변경 시 가격 원본 동시 수정 |
| 앱 개발 기간은 얼마나 걸리는가 | 일정 판단 | `/flutter/` | `/guide/app-duration/` | `/portfolio/` | 패키지 기간, 변수, 검수 | 실제 일정 성과는 미공개 |
| Flutter 개발사를 어떻게 고르는가 | 업체 선정 | `/flutter-development/` | `/guide/outsourcing-checklist/` | `/portfolio/` | 기술 선택, QA, 인계 | 외부 후기/인증 없음 |
| 소스코드를 받을 수 있는가 | 계약·소유권 | `/source-handover/` | `/guide/source-code-ownership/` | `/portfolio/` | 인계 산출물·계정 범위 | 계약서 샘플 공개 여부 확인 필요 |
| 관리자 웹도 포함되는가 | 범위 확인 | `/admin-page-development/` | `/guide/app-planning/` | `/portfolio/edu-erp/` | 역할·권한·운영 기능 | 사례별 제외 범위 보강 필요 |
| MVP 범위는 어디까지인가 | 범위/예산 | `/mvp/` | `/guide/mvp-cost/` | `/portfolio/` | 핵심 기능, 제외 범위, 인계 | 프로젝트별 측정 결과 미공개 |
| AI 외주 비용은 어떻게 정해지는가 | AI 비용 | `/ai-development/` | `/guide/enterprise-ai-cost/` | `/portfolio/` | 모델/API/데이터/평가/운영 변수 | 고정 패키지와 맞춤 범위 경계 지속 점검 |
| RAG와 일반 챗봇은 무엇이 다른가 | 개념 비교 | `/enterprise-ai/` | `/guide/rag-guide/` | 해당 시 공개 사례 | 데이터 검색, 근거, 권한 | 실제 엔터프라이즈 수행 범위 추가 검증 필요 |
| 기업 AI 도입 전에 무엇이 필요한가 | 도입 준비 | `/enterprise-ai/` | `/guide/enterprise-ai-adoption/` | 해당 시 공개 사례 | 데이터·권한·평가·보안·운영 | 보안 인증/전문 검수자 미확인 |
| ERP 견적은 무엇에 따라 달라지는가 | ERP 비용 | `/erp/` | `/guide/outsourcing-cost/` | `/portfolio/edu-erp/` | 사용자·권한·데이터 이전·연동 | 정량 절감 효과 없음 |

관련 링크는 서비스→가이드·사례·인계, 가이드→서비스·비교, 사례→관련 서비스 방향으로 유지한다. 자동 감사에서 고립된 색인 페이지는 0건이지만 109개 URL의 클릭 깊이는 추가 개선 대상이다.
