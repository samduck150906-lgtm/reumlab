# 콘솔 실데이터 출처와 범위

기준일: 2026-09-11

## 사용한 데이터

| 소스 | 속성·기간 | 확보 범위 | 판정 사용 |
|---|---|---|---|
| Google Search Console | URL-prefix `https://reumlab.com/`, 16개월 선택 | 771개 URL 행; 현재 777개 중 492개 일치 | 클릭·노출·CTR·평균 순위 |
| 네이버 Search Advisor | `https://reumlab.com`, 최근 90일, PC+Mobile | 검색 웹문서 TOP 30 중 현재 목록 28개 일치 | 클릭·노출·CTR |
| Bing Webmaster Tools | `https://reumlab.com`, 2026-09-11 확인 | Search Performance URL 행 없음(처리 중); AI Performance 최근 90일 0 citations | 상태만 기록, URL 판정 미사용 |
| GA4 | 현재 로그인 계정 | reumlab 속성 없음 | 미사용 |

GSC 화면 합계는 클릭 188, 노출 11,358, CTR 1.7%, 평균 순위 24.6입니다. 선택 기간은 16개월이지만 속성에 실제 표시된 날짜는 2026-02-22~2026-09-08입니다. 네이버 화면 합계는 약 290클릭, 2.2만 노출, CTR 1.3%입니다.

## 공개 데이터 원칙

원본 CSV와 정확한 URL별 수치는 사업 텔레메트리이므로 `docs/seo-aeo/private/`에만 저장하고 git에서 제외합니다. 공개 `URL_DECISIONS.csv`에는 0, 1-2, 3-9, 10+처럼 구간화한 값과 판정 근거만 기록합니다. 정확한 로컬 결과는 `private/URL_METRICS_EXACT_2026-09-11.csv`에서 확인합니다.

## 판정 한계

- GSC export의 사이트 전체 Queries 시트는 URL별 쿼리 연결을 제공하지 않습니다. cannibalization 판단에는 페이지 필터를 건 쿼리 export가 필요합니다.
- 네이버는 화면에서 TOP 30만 제공하므로 목록에 없는 URL을 0으로 간주하지 않습니다.
- Bing은 데이터 처리 완료 전이며, 0 citations는 URL별 미노출을 확정하지 않습니다.
- GA4 전환 데이터가 없어 RETAIN/IMPROVE/MONITOR까지만 제안하며 301/noindex/삭제는 적용하지 않습니다.
