# 2026-10-20 콘텐츠·기술 검수

기준 운영 사이트는 `https://reumlab.com/`, 저장소는 `samduck150906-lgtm/reumlab`이다. 기존 사이트맵의 823개 정규 URL을 보존했다. 신규·삭제·noindex 전환은 없다.

## 콘텐츠 범위

- 홈페이지 업종 294개 및 홈·서비스·허브 47개
- 앱·비용·솔루션 각 112개, 시스템 7개, 해당 허브 4개
- 개발 사례 15개·사례 허브 1개·정책 3개
- 가이드·블로그·비교 및 허브 61개
- AI 서비스·자동화 40개
- 지역 서비스 15개

합계 823개이며 각 `*-review.json`에 URL별 질문, 개별 수정 내용, 보존 근거와 확인 필요 사항이 있다. 기존 개발 사례의 실재·공개 허가, 정책의 실제 운영 적합성은 코드만으로 인증하지 않았다.

`shared-voice-corrections.json`은 개별 검수 이후 공통 안내문에서 제거한 미확인 경험·성과 표현을 보충한다. 공통 문구 수정 자체를 업종별 내용 보강의 대체 근거로 사용하지 않는다.

## 변경 감지

`content-manifest-before.json`은 작업 전 공개 HTML 기준이다. `release-content-changes.json`은 이번 릴리스의 완전한 비교표로, 실제 내용 변경 812개와 유지 11개를 포함한다. 빌드 ID·정적 자산 해시·빌드 시각은 본문 변경으로 세지 않는다.

`config/content-manifest.json`에는 검증된 릴리스 후보의 해시와 변경일을 보존했다. 다시 실행한 `content-manifest.mjs`는 변경 0개를 반환했고 날짜를 유지했다. 따라서 이후 `content-changes.json`이 0개여도 이번 릴리스 변경분은 `release-content-changes.json`의 812개다. 자식 사이트맵과 사이트맵 인덱스의 변경일도 동기화한다.

## 로컬 검증

- `npm run build`: Next 정적 빌드, 타입·린트, 내장 SEO·색인 보호·가격·폰트 게이트 통과
- `npm test`: 240개 통과, 실패 0개
- `node scripts/verify-sitemap.mjs`
- `node scripts/audit-indexability.mjs`
- `node scripts/qa-final.mjs`
- `node scripts/verify-conversion.mjs`
- `node scripts/verify-portfolio.mjs`
- `node scripts/verify-service-menu.mjs`
- `node scripts/verify-indexnow-config.mjs`
- `pwsh -File scripts/verify-feed.ps1`

추가 검증 결과는 `final-technical-review.json`에 기록했다. RSS 59개 항목은 실제 렌더링된 전체 글과 날짜·정규 URL을 대조했다. 문의 전송 시험은 모의 응답으로 정상·실패·시간 초과를 검사했으며, 실제 고객이나 외부 수신자에게 시험 문의를 보내지 않았다.

폰트 서브셋은 238,388바이트·1,411글자이며, 실제 출력 글자 누락과 선언 불일치가 없다. 폰트 URL에는 파일 내용 해시를 붙여 기존 immutable 캐시와 구분한다.

## 배포·제출의 구분

이 커밋의 로컬 검사 통과만으로 운영 배포나 색인을 주장하지 않는다. 운영 커밋·Netlify 배포 ID, 공개 HTML 재수집 및 Google·네이버·IndexNow의 실제 응답은 배포 후 별도로 기록한다. 검색엔진 접수와 실제 색인·검색 노출은 서로 다른 상태다.

기존 IndexNow 키·전송 스크립트를 재사용한다. 운영 공개와 키 파일 확인 후 변경분만 명시적으로 제출한다. 일반 서비스 페이지를 Google Indexing API에 보내지 않는다. 기존 GPTBot 학습 정책을 변경하지 않는다.
