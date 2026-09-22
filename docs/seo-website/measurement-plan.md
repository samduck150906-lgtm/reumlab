# 검색형 홈페이지 측정 계획

기준일: 2026-09-22. 이 문서는 이벤트 이름과 운영 검증 방법을 정의하며, 검색 순위나 문의 증가를 보장하지 않는다.

## 이벤트 계약

| 이벤트 | 발생 조건 | 핵심 파라미터 | 중복 방지 |
|---|---|---|---|
| `page_context` | 페이지 진입 시 기존 공통 로더 | `page_type`, `service_key`, `landing_slug` | 페이지뷰 수명주기 1회 |
| `cta_click` | 전화·카카오·메일·폼 이동 CTA 클릭 | `cta_type`, `cta_location`, `service_key` | 한 번의 클릭당 1회 |
| `inquiry_form_start` | 최초 유효 입력/변경 | `service_key`, `landing_slug` | 컴포넌트 인스턴스 1회 |
| `generate_lead` | Netlify Forms가 2xx를 반환한 뒤 | `service_key`, `landing_slug`, 비민감 enum | 성공한 제출 1회 |

`service_key`는 `seo_website`다. 이름, 전화번호, 자유 입력, 실제 URL은 분석 이벤트에 보내지 않는다. 문의 전송 자체는 분석 스크립트 차단이나 동의 거부와 무관하게 동작해야 한다.

## 전환 지표

- CTA 클릭률 = `cta_click` 사용자 / 해당 페이지 사용자.
- 폼 시작률 = `inquiry_form_start` 사용자 / 해당 페이지 사용자.
- 폼 완료율 = `generate_lead` 사용자 / `inquiry_form_start` 사용자.
- 검색 문의율 = 검색엔진 자연 유입에서 `generate_lead` 사용자 / 검색엔진 자연 유입 사용자.
- URL별 검색 성과는 GSC/네이버의 노출·클릭과 GA4 세션을 같은 지표로 합치지 않고 각각 보고한다.

## 데이터 제약

- Search Console 노출은 전체 시장 검색량이 아니다.
- 네이버와 Google의 수집·색인·노출 수치는 갱신 주기와 정의가 다르다.
- URL 파라미터는 `source_landing`, `current_page`, 허용된 UTM만 접수 폼에 보존한다.
- 운영 테스트는 이름에 `[E2E_TEST]`를 넣어 실문의와 분리하며, 개인 전화번호 대신 비민감 테스트 값을 사용한다.

## 운영 확인

1. 브라우저 Preview/Tag Assistant에서 한 세션을 열고 이벤트 순서를 확인한다.
2. 폼 입력을 한 번 시작하고 `inquiry_form_start`가 한 번인지 확인한다.
3. 제출 직전 네트워크·dataLayer를 기록하고 서버 2xx 이후 `generate_lead`가 한 번인지 확인한다.
4. Netlify Forms `main-apply`에서 `service_key`, 업종, 지역, 관심 범위, 최초 랜딩, 현재 페이지를 확인한다.
5. 테스트 접수는 확인 후 삭제하되 QA 보고서에는 제출 시각·테스트 식별자·수신 여부만 남긴다.

