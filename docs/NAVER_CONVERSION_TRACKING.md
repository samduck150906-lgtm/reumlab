# 네이버 검색광고 전환추적

기준일: 2026-09-18 · 공통 인증키 `s_36bb821fab0f` · 신청사이트 `https://reumlab.com`

네이버 광고 전환 추적 서비스(NHN DATA)의 **자가설치**를 코드로 끝낸 상태를 적는다.
안내문이 준 인라인 스니펫을 페이지마다 붙이는 대신, 같은 일을 하는 파일 하나
(`public/naver-wcs.js`)를 모든 페이지가 부른다.

## 무엇이 설치돼 있나

안내문의 공통 스크립트는 다섯 가지를 한다 — wcslog.js 로드 → 공통 인증키(`wcs_add.wa`)
설정 → `_nasa` 초기화 → 쿠키 도메인 포함 유입 기록(`wcs.inflow`) → PV 전송(`wcs_do`).
`public/naver-wcs.js` 가 이 순서를 그대로 실행하고, 전환 이벤트 번역까지 맡는다.

| 페이지 | 삽입 지점 |
|---|---|
| 홈 `/` | `index.html` |
| 목적 랜딩 전체 | `scripts/generate-purpose-landings.mjs` (생성 템플릿) |
| 개인정보·약관·환불 | `public/{privacy,terms,refund}/index.html` |
| Next 라우트 전체 | `components/Analytics.tsx` → `app/layout.tsx` |

### 왜 인라인 스니펫이 아닌가

1. 안내문 스니펫의 첫 줄은 **동기 로딩**이라 모든 페이지의 첫 렌더를 막는다.
   이 저장소는 GTM·픽셀조차 8초 지연 로더로 미뤄 둔 곳이다. 여기에 렌더 차단
   스크립트를 넣으면 그 노력을 되돌린다.
2. 인증키·전환 매핑을 한 곳에서만 고치면 된다. 페이지마다 흩뿌리면 새 템플릿이
   생길 때마다 빠진다.

다만 광고 클릭 유입(inflow)을 놓치면 전환이 광고에 붙지 않으므로, 이 파일만은
8초 지연 로더와 분리해 `async` 로 즉시 내려받는다.

## 전환 매핑

`dataLayer` 에 이미 흐르고 있는 이벤트(`lib/analytics.ts` 규약)를 받아 네이버
전환유형으로 번역한다. 새 폼이 규약대로 `generate_lead` 를 쏘면 자동으로 잡힌다.

| dataLayer 이벤트 | 네이버 전환유형 | 의미 |
|---|---|---|
| `generate_lead` | `lead` | 문의 제출 성공 (서버 성공 응답 이후에만 발화) |
| `phone_click` | `custom001` | 전화 링크 클릭 |
| `kakao_or_chat_click` | `custom002` | 카카오 상담 클릭 |

`form_submit_success`·`main_apply_submit` 은 같은 성공에서 함께 나가므로 매핑하지
않는다. 같은 유형은 3초 안에 다시 들어와도 한 번만 보낸다.

> `wcs.trans` 의 `type` 은 아무 문자열이나 되지 않는다. 네이버가 정한 전환이벤트
> 코드명(`lead`·`sign_up`·`purchase`·`add_to_cart` … 24종 + 사용자정의
> `custom001`~`custom010`)만 집계되고, 목록에 없는 이름은 **조용히 버려진다.**

전화·카카오 클릭을 `lead` 로 합치지 않은 이유는 `components/AnalyticsDataLayer.tsx`
의 기준 때문이다 — 상담 채널 클릭은 secondary conversion 이라 문의 완료와 같은
수로 세면 리드 수가 부풀려진다.

## 소유자가 할 일

1. **사용자정의 전환에 이름 붙이기** — 광고시스템 > 도구 > 전환추적 관리에서
   사용자정의 전환 1·2 에 각각 `전화 클릭`, `카카오 상담 클릭` 을 지정한다.
   지정하지 않아도 수집은 되지만 보고서에서 무엇인지 알아볼 수 없다.
2. **배포 후 검수요청** — 자가설치는 설치만으로 끝나지 않는다. 안내 메일의
   "자가설치 후 검수요청" 을 보낸다. 검수는 페이지 소스를 눈으로 보는 방식이
   아니라 **전환 스크립트 어시스턴트**(크롬 확장)로 실제 전송을 확인하는 방식이라,
   파일 하나로 설치한 지금 구조도 그대로 통과한다.
   - 문의: NHN DATA 1877-7035 · navercts@nhndata.com
3. **전환 테스트** — 어시스턴트를 켠 채 문의 폼을 한 번 제출하고, 전화·카카오
   버튼을 눌러 `lead`·`custom001`·`custom002` 가 나가는지 본다. 테스트 전환을
   실적과 섞고 싶지 않으면 `type` 앞에 `test_` 를 붙여 한 번 보낸 뒤 되돌린다.

## 검증

```bash
npm run build                    # out/ 생성
npm run seo:verify:conversion    # 색인 페이지 전부가 공통 스크립트를 부르는지 포함
```

`scripts/verify-conversion.mjs` 의 2번 검사가 "색인된 모든 페이지가
`/naver-wcs.js` 를 참조하는가" 를 본다. 한 페이지라도 빠지면 빌드가 실패한다.
정적 검사라 실행 여부까지는 보장하지 못한다 — 그건 위 3번 전환 테스트의 몫이다.

## 고칠 때 건드리는 곳

- 인증키·전환 매핑: `public/naver-wcs.js` 상단 `WA`·`MAP`
- 새 정적 템플릿을 만들 때: `<head>` 에 `<script src="/naver-wcs.js" async></script>`
  한 줄. 빠뜨리면 위 검증에서 잡힌다.
- Next 라우트는 레이아웃이 이미 넣으므로 따로 할 일이 없다.

## 참고

- [네이버 광고 웹 전환 추적 Script 설치 가이드 (wcs.trans버전)](https://naver.github.io/conversion-tracking/pages/01_script_guide_wcstrans/)
- [신 스크립트(trans) 전환가이드 — 구 cnv 유형과의 매핑](https://naver.github.io/conversion-tracking/pages/05_cnv_to_trans_guide/)
- [전환 스크립트 어시스턴트 가이드](https://naver.github.io/conversion-tracking/pages/06_script_assistant_guide/)
