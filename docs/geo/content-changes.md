# 콘텐츠·구조 변경 기록

## `lib/seo.ts`

- `/app-development/`: Flutter가 유지보수를 “구조적으로 절반”으로 만든다는 확인 불가능한 정량 표현을 삭제했다. 플랫폼 공통 구현·수정 중복을 줄일 수 있지만 절감 폭은 SDK·네이티브 기능·테스트 범위에 따라 다르다고 규정했다.
- `/flutter/`: “유지보수가 한 번에 끝난다”, “체감 차이가 거의 없다”는 단정을 제거했다. 적합한 앱 유형과 네이티브를 우선 검토할 예외를 직접 표기했다.
- `/mvp/`: 패키지 밖 비용을 계약 전 별도 안내한다고 명확히 했고, 기능을 늘리면 비용·기간이 “두세 배” 된다는 근거 없는 수치를 삭제했다.
- `/source-handover/`: 소스코드·저장소·배포·계정을 예외 없이 “통째” 양도한다는 표현을 계약 범위와 이전 가능성 기준으로 바꾸었다. 제3자 라이선스와 플랫폼 계정 양도 제한을 예외로 적었다.

가격·기간 기준값, URL, canonical, title 의도, 문의 CTA·폼, 익명 사례와 목업 고지는 보존했다.

## 정보 구조·측정

- `docs/geo/query-map.csv`: Q01~Q40을 실제 기존 URL에 매핑했다. 질문 수만큼 페이지를 추가하지 않았다.
- `docs/geo/claim-ledger.json`: NAP·가격·기간·이관·사례·AI 한계 주장의 근거 수준과 공개 범위를 리스트화했다.
- `tools/geo/`: 수동 결과 importer, validator, surface별 report, 전/후 compare, 45개 고정 질문 manifest, 필수 오탐 방지 테스트를 추가했다.
- `scripts/geo-inventory.mjs`: 기존 열을 보존하면서 지시서의 URL 인벤토리 필드와 `RESOLVED_EXISTING`/`TESTED_LOCAL_BUILD` 구분을 추가했다.

## 브라우저 네트워크 회귀

- `components/Nav.js`, `app/geo-website/page.tsx`: Next 빌드 이후 별도 생성되는 6개 정적 서비스 URL에 RSC 프리패치를 보내지 않도록 했다. 직접 HTML 링크와 canonical은 그대로 유지하면서 존재하지 않는 `index.txt?_rsc=...` 백그라운드 404를 줄인다.
- `scripts/performance.test.mts`: 위 정적 서비스 링크의 프리패치 차단이 유지되는지 검사한다.
