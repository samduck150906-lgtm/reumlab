# 검색엔진 등록 기록

기준일: 2026-09-22

## 제출 대상

- 대표 URL: `https://reumlab.com/seo-website/`
- 사이트맵: `https://reumlab.com/sitemap.xml`
- 가이드 표본: `https://reumlab.com/seo-website/guides/search-registration/`

## 상태

| 단계 | Google Search Console | 네이버 Search Advisor |
|---|---|---|
| 운영 배포·200 응답 | PASS | PASS |
| 소유확인 | PASS — `https://reumlab.com/` 속성 접근 확인 | PASS — 등록 사이트 목록과 관리 화면 접근 확인 |
| 사이트맵 제출/재읽기 | PASS — `sitemap.xml` 2026-09-22 재제출 성공, 기존 상태 Success | PASS — `sitemap.xml`, `sitemap-enterprise-ai.xml` 등록 확인 |
| RSS 등록 | 해당 없음 | PASS — `https://reumlab.com/feed.xml` 등록 확인 |
| 대표 URL 검사 | PASS — 검사 당시 `URL is unknown to Google` | 해당 없음 |
| 대표 URL 색인/수집 요청 | PASS — priority crawl queue 접수 확인 | PASS — 2026-09-22 15:29:08 수집 요청 내역 확인 |
| 엔진 처리 완료 | PENDING_EXTERNAL | PENDING_EXTERNAL |

Google의 기존 사이트맵 화면은 재제출 직후에도 마지막 읽기 2026-09-17, 발견 URL 780개를 표시했다. 이는 새 제출의 재처리가 아직 끝나지 않았다는 뜻이며, 현재 운영 사이트맵의 792 URL과 즉시 일치할 필요는 없다. 제출 성공은 수집·색인·노출·순위 완료를 뜻하지 않는다.

## 공식 기준

- Google: 사이트맵은 발견 신호이며 색인을 보장하지 않는다. URL 검사는 대표 URL의 현재 상태와 라이브 테스트를 구분해 기록한다.
- Google Indexing API는 일반 서비스 페이지 제출 수단으로 사용하지 않는다.
- 네이버: 소유확인 뒤 사이트맵과 RSS 처리 상태를 확인하고, 대표 URL만 수동 수집 요청한다.
- IndexNow의 성공 응답은 URL 접수이며 색인 완료가 아니다.
