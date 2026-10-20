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

`content-manifest-before.json`은 작업 전 공개 HTML 기준이다. `release-content-changes.json`은 후속 정책·소재지 교정까지 포함한 완전한 비교표로, 실제 내용 변경 820개와 유지 3개를 포함한다. `followup-content-changes.json`은 첫 운영 배포에서 후속 배포까지의 차이를 별도로 보존한다. 빌드 ID·정적 자산 해시·빌드 시각은 본문 변경으로 세지 않는다.

`config/content-manifest.json`에는 검증된 릴리스 후보의 해시와 변경일을 보존했다. 다시 실행한 `content-manifest.mjs`는 변경 0개를 반환했고 날짜를 유지했다. 따라서 이후 `content-changes.json`이 0개여도 전체 작업 변경분은 `release-content-changes.json`의 820개다. 자식 사이트맵과 사이트맵 인덱스의 변경일도 동기화한다.

후속 교정은 `maintenance-policy-corrections.json`에서 URL별 최초 운영 메타·본문·스키마와 최종 HTML을 대조한다. 비용 정책 관련 493개와 공통 소재지 설명 관련 820개는 중복되는 범위다. 공통 조직 설명의 교정을 820개 페이지의 개별 본문 전체 개작으로 해석하지 않는다. 실제 업종별 본문 검수는 원래의 823개 검수 기록에 별도로 남아 있다.

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

## 첫 운영 배포 및 실제 제출 확인 (2026-10-20)

PR #10 병합 커밋 `f7cef7c1fc02bbe692adac7da2d0949abd21ed8d`가 Netlify production `6ad712b1de1be826243b81fa`로 07:07:40 UTC에 공개됐습니다. 1,779개 운영 경로 재수집 오류 0, 사이트맵 823개 HTTP·canonical·robots·메타·구조화 데이터와 내부 링크 35,140개 참조 검증을 통과했습니다.

원본 콘텐츠 해시는 799개 일치, 나머지 24개는 동일 파일로 연결되는 Netlify의 관리자 안내 링크 확장자 정리만 달랐습니다. 두 안내 URL의 전체 HTML 해시·canonical·noindex가 같고, 해당 링크 한 개 외에는 본문·메타·스키마 차이가 없습니다.

IndexNow는 실제 변경 812개를 네이버와 Bing에 전송해 양쪽 HTTP 200을 받았습니다. `submissions/indexnow.jsonl`에 요청 시각·URL 목록·응답을 보존하고 제출 manifest를 갱신했습니다. 이후 dry-run 대상은 0개입니다. Google 사이트맵은 재제출 Success, 개별 URL 3개 접수 후 연결 오류로 7개 대기입니다. 네이버 관리 화면 RSS는 보안문자 입력 대기이며 사이트맵·개별 수집 요청은 미완료입니다. 접수는 실제 색인·노출 완료를 뜻하지 않습니다.

최종 검증 요약은 `release-verification-summary.json`에 있습니다. 이 후속 커밋은 증거와 제출 manifest만 보존하므로 `[skip netlify]`로 운영 재빌드를 생략합니다.

## 정책·소재지 후속 교정의 운영 검증

PR #12 병합 커밋 `e2992eec616f518a919f90dfec1b307980d4bc9b`가 Netlify production `6ad71ed3dce425c2fa4b1bad`로 2026-10-20 07:59:33.614 UTC에 공개됐습니다. 후속 1,779개 경로는 08:00:26~08:03:43 UTC에 새로 수집했습니다. 수집 오류 0, 사이트맵 823개 계약 검사와 내부 문서 링크 35,140개 참조 검사가 통과했습니다. 사이트맵 밖 기존 404 299개의 URL 집합도 이전과 같으며 새 404는 0개입니다.

최종 콘텐츠 해시는 799개 그대로 일치하고, 24개는 첫 배포와 같은 관리자 안내 링크의 Netlify 확장자 변환만 다릅니다. 이번 배포에서도 두 대상 주소의 전체 HTML·canonical·robots가 같은지 확인했고, 확인된 한 링크 이외의 차이는 없습니다. 원본 비교 차이와 그 해소 근거를 분리해 보존했습니다.

RSS 59개 전체 글, 1,089,293바이트가 최종 산출물과 일치합니다. 후속 교정 820개와 공통 문구 637개도 공개 HTML에서 검증했습니다. 홈·리뉴얼·목적 랜딩의 PC·모바일 6화면 검수가 통과했습니다. 전체 240개 회귀 시험은 1차 콘텐츠 릴리스 당시 기록이며, 이번 후속 텍스트 교정은 최종 Netlify 빌드·8개 기술 검사·공개 대조·6화면 검사로 따로 확인했습니다.

IndexNow는 1차 812개 접수를 보존한 뒤 후속 실제 변경 820개를 네이버와 Bing에 보내 각각 HTTP 200을 확인했습니다. 두 회차의 고유 URL 합집합은 820개이며 이를 1,632개 새 페이지로 계산하지 않습니다. 제출 manifest 갱신 후 dry-run 대상은 0개입니다. 최종 배포 후 Google 사이트맵도 다시 접수 성공을 확인했습니다. Google 개별 요청은 3개 접수·7개 대기이며 reCAPTCHA 연결 오류가 원인입니다. 네이버 RSS 관리 화면은 보안문자 대기, 사이트맵·개별 수집 요청도 대기로 남겼습니다.

다음 확인 일정과 실제 재실행 명령은 [FOLLOWUP.md](FOLLOWUP.md)에 있습니다. 이 증거 보존 커밋은 제품 소스를 바꾸지 않으며 `[skip netlify]`로 운영 재빌드를 생략합니다.
