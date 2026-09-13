# 변경 후 QA

검증 시각: `2026-09-13 11:13:15 +09:00`
상태: `TESTED_LOCAL_AND_NETLIFY_PREVIEW`

## 자동 검증 결과

| 항목 | 결과 | 확인 내용 |
|---|---|---|
| `npm test` | PASS | 32/32 통과. 기존 분석·성능 테스트 19개, 정적 프리패치 회귀 테스트 1개, GEO 측정 경계값 테스트 12개 |
| `npm run typecheck` | PASS | TypeScript 오류 0 |
| `npm run build` | PASS | Next 정적 페이지 1,338개 생성, sitemap URL 778개 |
| `npm run geo:audit` | PASS_WITH_WARNING | canonical·사이트맵·redirect·내부 링크·schema 충돌 0. 클릭 깊이 6 이상 109개(최대 12)는 기존 구조의 모니터링 경고 |
| `npm run seo:verify:conversion` | PASS | 폼 18개, 정적 스키마·제출 엔드포인트 문제 0, 성공 전/중복 전환 발화 0, 이벤트 PII 0 |
| `npm run seo:verify:pricing` | PASS | 패키지 8종, 폐기 가격 노출 0, 홈 가격표 일치 |
| `npm run seo:verify:portfolio` | PASS | 사례 15건, 근거 없는 수치·Review·AggregateRating 0 |
| 질문 맵 URL 검사 | PASS | Q01~Q40의 primary/supporting URL 120/120가 `out/`에 존재 |
| `git diff --check` | PASS | 공백 오류 0 |

## 브라우저 검증

Codex 인앱 브라우저의 좁은 화면과 Chrome 데스크톱 탭에서 로컬 정적 빌드(`http://127.0.0.1:4173`)를 확인했다.

- 홈: 모바일 메뉴, H1, 목적별 서비스 링크, 포트폴리오, 가격, FAQ, 문의 폼과 하단 고정 CTA가 접근성 트리에 노출됨
- `/geo-website/`: H1, 서비스 정의, 비교표, 6개 제작 범위, 실제 익명 사례 3건, 보장 제한, 전용 문의 폼 확인
- `/source-handover/`: 계약 범위, 이전 가능한 권한, 제3자 라이선스·플랫폼 제한 문구가 빌드 결과에 반영됨
- `/404.html`: 404 H1, 홈·핵심 서비스 복구 링크, NAP 확인
- 홈 문의 폼: 빈 제출 시 첫 필수 입력(`이름 또는 업체명`)으로 포커스 이동, 테스트 값 입력, 필수 개인정보 동의 체크 상태 확인
- 실제 문의를 만들지 않기 위해 운영/외부 폼 전송은 수행하지 않음
- 최초 점검에서 Next Link가 하이브리드 정적 목적 페이지의 존재하지 않는 `index.txt?_rsc=...`를 미리 가져오는 404를 발견했다. 해당 6개 경로의 프리패치를 차단한 뒤 Chrome에서 재검증했으며, 최종 요청 로그의 RSC 응답은 모두 200이고 404는 0건이었다.

## 운영 응답 샘플

기존 운영 배포의 보호 redirect를 읽기 전용으로 확인했다. 아래 네 URL 모두 redirect 1회 후 HTTP 200과 최종 self-canonical에 도착했다.

- `/l/seongnam-app-dev-cost/` → `/app-development/seongnam/`
- `/l/seongnam-web-dev-quote/` → `/web-development/seongnam/`
- `/l/seongnam-mvp-dev/` → `/mvp/seongnam/`
- `/l/mvp-dev-cost/` → `/guide/mvp-cost/`

이 확인은 이번 로컬 변경의 운영 반영을 뜻하지 않는다.

## Netlify 프리뷰 검증

- 변경 커밋: `6850fe6bc022bac5118e3f580e1dca050a975671`
- 배포 ID: `6aa605a2aebd83a604d672fe`
- 프리뷰: `https://6aa605a2aebd83a604d672fe--reumlab.netlify.app`
- `/`, `/geo-website/`, `/source-handover/`, `/robots.txt`, `/sitemap.xml`: HTTP 200
- 임의 미존재 URL: HTTP 404이며 커스텀 404 본문 확인
- 보호 redirect 4개: 각각 301 1회 후 프리뷰 호스트의 의도한 최종 경로에서 HTTP 200
- `/__forms.html`: Netlify 후처리된 `soho-diagnosis`, `main-apply` 폼과 `form-name`, honeypot 필드 확인
- `/erp/`, `/ai-automation/`, `/data-seo/`, `/geo-website/`: `main-apply` 제출 폼과 숨은 `form-name` 확인
- `/.geo-measurements/runs.jsonl`: HTTP 404로 비공개 측정 원본 미배포 확인
- 실제 문의 레코드를 만들지 않도록 POST 제출은 수행하지 않음
- 프리뷰는 `--no-build` draft deploy로 생성해 그 과정에서는 IndexNow를 실행하지 않음

## Git 연결 운영 자동배포 검증

- CLI `--prod`는 사용하지 않았지만 `main` 푸시가 Netlify Git 자동배포를 트리거함
- 운영 배포 ID `6aa60537c9d46f0008ad26e7`: `production`, branch `main`, commit `6850fe6bc022bac5118e3f580e1dca050a975671`, state `ready`, error 없음
- 운영 `/`, `/geo-website/`, `/source-handover/`, `/robots.txt`, `/sitemap.xml`: HTTP 200
- 운영 임의 미존재 URL: HTTP 404와 커스텀 404 본문 확인
- 운영 보호 redirect 4개: 각각 redirect 1회 후 의도한 canonical 경로에서 HTTP 200
- 운영 `/__forms.html`: `soho-diagnosis`, `main-apply`, honeypot 필드 확인
- 운영 `/.geo-measurements/runs.jsonl`: HTTP 404
- 운영 build 명령에는 IndexNow가 포함된다. 로컬 dry-run의 변경 대상은 26개지만 운영 로그의 Naver/Bing HTTP 응답은 이번 검사에서 직접 대조하지 않아 성공 건수를 확정하지 않음

## 미완료·차단 항목

- 모바일 Lighthouse: `BLOCKED_TOOLING`. 저장소에 Lighthouse가 없었고 `npx lighthouse@latest` 및 `npm view lighthouse version`이 npm 레지스트리 응답 없이 멈춰 중단했다. 점수를 만들거나 이전 측정값을 재사용하지 않았다.
- AI 답변 실측: `NOT_RUN`. 승인된 유료/대량 호출이 없고 원문·인용 증거도 없으므로 `N_planned=480`, `N_attempted=0`, `N_valid=0`, 지표는 모두 `N/A`다.
- 운영 배포: `AUTO_DEPLOYED / PASS`. `--prod`는 사용하지 않았지만 Git 연결 자동배포가 발생했고 배포·핵심 HTTP 검증을 통과했다.
- GSC/Bing/Naver/GA4/Netlify Forms 운영 데이터: 이번 실행에서 새 export나 승인된 테스트 제출이 없으므로 갱신 완료로 표시하지 않는다.

## 수동 검토 경고

엔터티 감사의 `인계동` 9건은 NAP 불일치가 아니라 수원 지역 문맥과 현재 빌드에 쓰이지 않는 과거 캠페인 스크립트가 섞인 탐지다. 지역 의도 훼손을 피하기 위해 전역 치환하지 않았고, 기준 NAP 검사는 통과했다.
