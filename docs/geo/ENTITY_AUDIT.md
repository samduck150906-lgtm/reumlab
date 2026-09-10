# Entity audit

## 단일 기준

`lib/seo.ts`의 `SITE`를 브랜드·주소·연락처·대표자·사업자번호·공개 프로필의 단일 기준으로 확장했다. 영문명, 기계 판독 전화번호, 주소 분해, 서비스 지역, 언어, 서비스 방식, 연락처와 라벨이 있는 소셜 프로필을 포함한다.

## 수정 사항

- `BusinessFooter`와 레거시 `src/components/Footer`의 하드코딩된 회사 정보를 `SITE` 참조로 바꿨다.
- Organization과 ProfessionalService가 같은 이름·주소·전화·이메일·`sameAs`를 사용하도록 했다.
- `legalName`은 확인 가능한 법적 상호가 없어 빈 값으로 유지하고 JSON-LD에서 출력하지 않는다.
- 대표자 성아름을 창업자라고 단정할 근거가 없으므로 `founder`를 제거했다.
- `content/blog-generation-config.json`에서 회사 지역처럼 쓰이던 과거 값 `인계동`을 `동탄`으로 고쳤다.

## 인계동 문맥 판정

자동 검사는 `인계동 본사`, `인계동 사무실`, `인계동 사업장`, `인계동에 위치/자리`를 실패로 처리한다. 그 외 `인계동`은 수원 지역명·콘텐츠 후보·마케팅 자동화 데이터일 수 있어 기계적으로 바꾸지 않고 경고로 남긴다. 최종 감사에서 과거 사업장 표현은 0건, 수동 확인 경고는 9개 파일이었다.

## 공개 프로필

기존 사이트에 있던 네이버 플레이스, 네이버 블로그, Instagram, Kakao 채널, Google 지도 URL만 `sameAs`에 유지했다. LinkedIn·YouTube 등 확인되지 않은 프로필은 추가하지 않았다.

## 검증 결과

- 엔터티 그래프 페이지: 1,338
- Organization: 1,338
- ProfessionalService: 1,338
- NAP 불일치: 0
- 미확인 `legalName`/`founder`: 0
- `sameAs` 불일치: 0

외부 프로필의 실제 소유권과 최신 NAP는 저장소만으로 확정할 수 없으므로 `OWNER_ACTIONS.md`에 남겼다.
