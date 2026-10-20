# 개발 의뢰 안내 첫 공개 묶음

기존 823개 canonical 페이지와 비교한 신규 의도를 `/development-agency/`에 추가한다. 이 묶음은 상세 98개와 안내 허브 1개이며, 사용자가 요청한 전체 확대 제작은 계속 진행 중이다. 전체 제작 완료를 뜻하지 않는다.

초기 `DEFER_LOW_VALUE` 2,453개는 사용자의 후속 요청에 따라 모두 조사·작성 대상으로 전환했다. `classification-summary.json`의 최초 집계는 이력이며, 현재 상태는 `expanded-build-queue.csv`의 `현재작업상태`를 따른다. 이 스냅샷에서는 102개 큐 행이 작성된 canonical에 연결되었고 2,378개는 아직 작성해야 한다. 동의어 4개는 별도 중복 페이지로 만들지 않는다.

원고는 15개 업무 필드, 12개 이상 섹션, 6개 이상 FAQ와 관련 안내로 구성한다. 기존 공용 헤더·푸터를 읽기 전용으로 재사용하며 기존 tracked 파일, 전역 CSS·레이아웃·설정·의존성·사이트맵·robots·RSS는 수정하지 않는다. 새 사이트맵은 `/sitemap-development-agency.xml`이고 루트 사이트맵과 분리한다.

로컬 검수는 `release-001-validation.json`, 페이지별 품질 결과는 `page-quality.csv`, 작성 URL은 `created-pages.csv`에 기록했다. 정적 HTML과 HTTP 99개, 기존 canonical 823개 보존, 기존 파일 490개 SHA-256, 기존 discovery 파일 18개 바이트 보존을 확인했다. 기존 테스트 240개와 신규 namespace 테스트 10개가 통과했다. 실제 320픽셀 Chrome에서 99개 전체를 확인했고 대표 페이지의 320·375·768·1280·1440픽셀 화면을 검수했다. 구성되지 않은 별도 ESLint 실행을 통과했다고 기록하지 않는다.

검수 명령:

```sh
npm run build
npm test
node --import tsx --test scripts/development-agency/*.test.mts
node --import tsx scripts/development-agency/verify.mts --out out --reports _reumlab_new_pages_reports/rendered
```

빌드가 기존 생성 자료를 다시 쓰므로 원본 작업 디렉터리가 아닌 별도 빌드 복제본에서 실행했다. 실제 운영 배포와 신규 검색 제출은 로컬 검수와 별도 단계이며, 이 커밋 시점의 `NOT_YET_DEPLOYED` / `NOT_YET_SUBMITTED`를 성공으로 해석하면 안 된다. 운영 확인 후 제출하는 신규 전용 IndexNow 스크립트는 기본값이 dry run이고, 운영 HTTP 지문 검수와 공개 키·사이트맵 일치가 필요하다.

```sh
node --import tsx scripts/development-agency/http-audit.mts https://reumlab.com out _reumlab_new_pages_reports/production-http.json
node --import tsx scripts/development-agency/submit-indexnow.mts --out=out --reports=_reumlab_new_pages_reports/submissions --verification=_reumlab_new_pages_reports/production-http.json --submit
```

검색 요청 접수와 검색 색인은 다른 상태로 기록한다. Google과 Naver의 신규 사이트맵 제출 역시 실제 운영 응답 확인 뒤 수행하며, 과거 823개 페이지의 제출 내역을 신규 페이지 제출 증거로 재사용하지 않는다.
