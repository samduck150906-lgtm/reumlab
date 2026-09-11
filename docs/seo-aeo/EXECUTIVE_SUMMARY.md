# REUMLAB AEO·SEO Executive Summary

기준일: 2026-09-11

## 결론

름랩은 canonical, sitemap, robots, 내부 링크, 구조화 데이터와 색인 품질 게이트가 이미 강합니다. 다음 성장 병목은 URL 추가가 아니라 **기존 핵심 페이지의 CTR, 1차 근거, 사례 연결과 실제 검색·전환 데이터 기반 정리**입니다.

이번 판정은 GSC 16개월 내보내기(771개 URL 행, 현재 색인 목록과 492개 일치)와 네이버 최근 90일 TOP 30(28개 일치)를 결합했습니다. Bing은 사이트 데이터 처리 중이라 URL 행이 없고 AI Performance 사이트 합계는 0이며, 현재 로그인된 GA4 계정에는 reumlab 속성이 없어 전환값은 판정에 사용하지 않았습니다. 원본 수치는 private 폴더에만 두고 공개 CSV에는 구간값만 기록했습니다.

## 전체 URL 판정

- 분석 URL: 777
- RETAIN: 143
- IMPROVE: 55
- MONITOR: 579
- 기존 IMPROVE 34개 재분류: RETAIN 5, MONITOR 9; 나머지는 실제 수요에 따라 IMPROVE 유지
- 기존 MONITOR 678개 재분류: RETAIN 76, IMPROVE 32; 나머지는 MONITOR 유지
- REDIRECT/NOINDEX/DELETE: 0 — GA4 전환과 페이지별 쿼리 중복 없이 파괴적 변경하지 않음
- 유형: service_or_hub: 33, region_service: 12, industry_service: 518, article: 11, comparison: 3, cost_landing: 113, guide: 46, topic_hub: 7, home: 1, programmatic_landing: 7, case_study: 16, legal: 3, system_service: 7

## 상위 10개 발견

1. GSC에는 클릭 188회·노출 11,358회가 있으며 현재 목록과 일치한 URL은 492개입니다.
2. 네이버는 최근 90일 약 290클릭·2.2만 노출이며 TOP 30에 현재 목록 28개가 포함됐습니다.
3. Bing 검색 성과는 등록 직후 처리 중이고 AI 인용은 최근 90일 0건입니다.
4. 현재 로그인된 GA4 계정에는 reumlab 속성이 없어 세션·리드 기반 판정은 아직 불가능합니다.
5. 노출 100회 이상 또는 상위 20위권인데 CTR이 2% 미만인 URL을 최우선 IMPROVE로 올렸습니다.
6. 실제 검색 클릭이 있거나 검증된 1차 근거가 있는 URL은 RETAIN으로 보존했습니다.
7. GSC 행이 없거나 신호가 20회 미만인 템플릿형 URL은 신규·저수요를 구분할 수 없어 MONITOR로 유지했습니다.
8. 공개된 CMS 데모 화면은 관련 서비스에서만 사용하고 고객 사례·성과로 오인되지 않게 출처 범위를 표시합니다.
9. 정확히 같은 H1은 없지만 URL별 쿼리 중복 판정에는 페이지 필터가 적용된 GSC 쿼리 export가 추가로 필요합니다.
10. AEO 효과는 Bing AI 인용과 GA4 AI referral·보조전환이 쌓인 뒤 함께 판단해야 합니다.

## 우선순위

- 0~30일: P1-data URL의 제목·설명·직접 답변·내부링크를 개선하고 페이지별 GSC 쿼리를 받습니다.
- 31~60일: 공개 허가 문서가 도착한 사례에만 실제 화면·산출물·결과를 연결합니다.
- 61~90일: GA4·Bing 데이터가 쌓이면 전환 없는 중복 URL만 통합 후보로 올리고 301/noindex는 개별 승인 후 적용합니다.

상세 행 단위 근거는 URL_DECISIONS.csv, CONTENT_EVIDENCE_GAPS.csv, QUERY_INTENT_MAP.csv를 기준으로 합니다.

## 예상 효과

- 직접 답변·표·방법론·한계·출처를 같은 페이지에 연결해 정확한 구간을 인용하기 쉬워집니다.
- 공개 가격과 확정 견적을 구분해 상담 전 기대와 비교 기준을 명확히 합니다.
- 사례 스키마와 실제 화면의 검증 범위를 일치시켜 엔터티 해석을 강화합니다.

## 위험과 통제

- GSC·네이버 검색 데이터는 반영했지만 GA4 전환, 페이지별 쿼리 중복과 Bing URL 데이터가 없어 통합·noindex 판단은 보류했습니다.
- 익명 사례에는 고객명·날짜·성과를 만들지 않았고 공개 한계를 화면에 표시했습니다.
- 개인 작성자 경력과 고유 OG 이미지는 소유자 확인 전 게시하지 않고 OWNER_INPUT_REQUIRED로 남겼습니다.
