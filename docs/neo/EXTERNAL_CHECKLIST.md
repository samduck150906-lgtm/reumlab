# 네이버 외부 콘솔 점검표

코드 검증과 네이버 계정 상태는 별도입니다. 각 항목은 확인 날짜, 보고 기간, 화면의 실제 상태를 기록하고 캡처·원본 export는 `docs/neo/private/`에만 보관합니다.

| 항목 | 현재 코드 상태 | 콘솔 완료 기준 | 기본 상태 |
|---|---|---|---|
| 사이트 등록 | 도메인·canonical 준비 | Search Advisor 목록에 `https://reumlab.com` 표시 | BLOCKED_EXTERNAL_ACCOUNT |
| 소유확인 | meta와 발급 HTML 파일 구현 | 콘솔이 소유확인 완료로 표시 | IMPLEMENTED |
| 사이트명 | `름랩` 엔터티 신호 통일 | 검색결과·콘솔의 실제 사이트명 확인 | UNVERIFIED |
| robots | Yeti 명시 허용 | robots 수집·진단 정상 | TESTED |
| sitemap | production URL만 생성 | 제출 URL과 최근 처리 상태 확인 | BLOCKED_EXTERNAL_ACCOUNT |
| RSS | 같은 호스트의 실제 글 생성 | 제출 URL과 최근 처리 상태 확인 | BLOCKED_EXTERNAL_ACCOUNT |
| IndexNow | 키·변경분·production gate 구현 | 호스트 응답 및 이후 수집 상태를 별도로 기록 | IMPLEMENTED |
| 콘텐츠 노출 | URL별 정적 품질표 생성 | 최근 90일 노출·클릭·CTR export | BLOCKED_EXTERNAL_ACCOUNT |
| 네이버 플레이스 | 코드 기준 링크·NAP 존재 | 상호·주소·전화·영업시간의 공개값 일치 | BLOCKED_EXTERNAL_ACCOUNT |
| 네이버 블로그 | 공식 링크 존재 | 프로필·웹사이트 링크의 공개값 일치 | UNVERIFIED |

사이트맵 처리, IndexNow HTTP 성공, 검색 수집, 색인, 노출은 서로 다른 상태입니다. 한 단계의 성공을 다음 단계 완료로 기록하지 않습니다.
