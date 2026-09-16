# IMPLEMENTATION_SUMMARY — AI 전화상담 직원 구축 서비스 페이지 고도화

작업일 2026-09-16 · 대상 `/ai-voice-development/` (기존 경로 유지) · 브랜치 `claude/ai-voice-consultation-page-bq0jef`
분기 기준 `a5aa77e`

---

## 1. 한 줄 요약

기존 `/ai-voice-development/` 를 **"AI 전화상담 직원 구축 서비스"** 판매 페이지로 고도화했다.
새 URL 을 만들지 않았고, 사이트의 다른 1,350개 페이지는 본문이 한 글자도 바뀌지 않았다
(공유 폼에 추가한 비-JS 연락 대안 1개 제외 — §SEO_REGRESSION_REPORT 참고).

---

## 2. 무엇이 바뀌었나

| 영역 | 변경 전 | 변경 후 |
|---|---|---|
| 섹션 수 | 13 | **14** (명세 §6) |
| 통화 데모 | 단일 시나리오 14발화 | **업종 6종 · 48발화** + 단계별 요약 reducer |
| 업종 정보 | 활용 예시 6개 | **업무 범위 표** (먼저 맡길/연동 후/사람이 맡을 3열) |
| 관리자 화면 | 없음 | 가상 상담 3건 · CSS 전용 행 선택 · 확인/미확인/다음 행동 |
| 계산기 | 없음 | 전화 업무량 시간 계산 (금전 ROI 아님) |
| 상품 범위 | 없음 | Starter / Business / Enterprise — **금액 없이 개별 견적** |
| 비용 설명 | 앱 AI 패키지 금액을 참고선으로 인용 | **인용 제거** · 구축비/운영비/사용량 3분할 |
| FAQ | 8문항 | **16문항** (화면 ↔ FAQPage 동일 배열) |
| 문의 폼 | 응대방식·연동시스템 | + 업종 · 하루 전화량 · 관심 구축 범위 |
| 구조화 데이터 | Service/WebPage/Breadcrumb/FAQPage | 동일 (offers 없음 — 화면에 금액이 없으므로) |

### 2.1 금액을 제거한 이유

이전 페이지는 `lib/pricing.ts` 의 "앱 AI" 패키지 금액을 비용 참고선으로 인용했다.
그 금액은 다른 상품의 가격이라 이 서비스의 시작가로 읽히면 사실과 다르다.
→ `lib/ai-voice.ts` 에서 `lib/pricing.ts` import 자체를 제거했다.
**공유 가격 데이터(`lib/pricing.ts`)는 수정하지 않았다.**

---

## 3. 변경·추가 파일과 이유

### 신규

| 파일 | 줄 수 | 이유 |
|---|---:|---|
| `lib/ai-voice-form.ts` | 112 | 폼 enum·필드명 단일 출처. **import 0개** — 클라이언트 번들에 `lib/seo.ts` 가 딸려 오지 않게 |
| `lib/ai-voice-workload.ts` | 182 | 계산기 순수 함수. **import 0개** |
| `app/ai-voice-development/WorkloadCalculator.tsx` | 182 | 계산기 UI (client component) |
| `scripts/verify-ai-voice-service.mjs` | 434 | 최종 `out/` 기준 회귀 게이트 17항목 |
| `scripts/ai-voice-demo.test.mts` | 21 tests | 대본 데이터·reducer |
| `scripts/ai-voice-workload.test.mts` | 15 tests | 계산 공식·엣지·검증 |
| `docs/ai-voice-service/*` | 8종 | 인수 문서 |

### 수정

| 파일 | 변경 | 이유 |
|---|---|---|
| `lib/ai-voice-demo.ts` | 46 → 684줄 | 6개 시나리오 48발화 + 순수 상태 계산 + 무결성 검사 |
| `lib/ai-voice.ts` | 493 → 632줄 | 14개 섹션 콘텐츠. `lib/pricing.ts` import 제거 |
| `app/ai-voice-development/page.tsx` | 661 → 822줄 | 14개 섹션 렌더 |
| `app/ai-voice-development/ai-voice.module.css` | 445 → 630줄 | 새 섹션 스타일 · 죽은 규칙 28종 제거 · 대비/CLS 수정 |
| `app/ai-voice-development/ConversationDemo.tsx` | 91 → 209줄 | 업종 선택·단계 진행·결과 패널 |
| `components/LandingInquiryForm.tsx` | +218줄 | **ai-voice 변형만** 확장 + 전 변형 공통 개선 2건(비-JS 대안·타임아웃 구분) |
| `lib/analytics.ts` | +21줄 | voice 이벤트 5종 + 비식별 파라미터 2종 |
| `public/__forms.html` | +7줄 | 신규 필드 3종 등록 |
| `package.json` | +2줄 | `seo:verify:ai-voice` 등록 + 빌드 파이프라인 연결 |

### 폰트 파이프라인이 자동 갱신한 파일 (10개)

새 카피에 `녕`·`늠`·`묵` 3글자가 들어가 서브셋 밖으로 나갔다.
빌드 게이트(`seo:verify:font`)가 이를 잡았고, 안내대로 재생성했다.

```
python3 scripts/build-font-subsets.py && node scripts/apply-font-subset-css.mjs
```

서브셋 1,338자 222KB → **1,339자 223KB**. 10개 파일의 diff 는 `unicode-range` 한 줄과
크기 주석뿐임을 확인했다(`git diff --unified=0` 로 전수 대조).

---

## 4. 설계 결정과 근거

### 4.1 데모를 클라이언트 컴포넌트로 두되 대본은 정적으로도 제공

업종 6종의 전체 대본·결과가 `<details>` 로 초기 HTML 에 들어간다.
JS 가 꺼지면 `<noscript>` 가 상호작용 위젯을 감추고 이 정적 대본만 남는다.
→ "반응 없는 버튼"이 생기지 않고, 크롤러·스크린리더가 48발화를 전부 읽는다.

### 4.2 관리자 예시와 업종 범위 표는 JS 0바이트

관리자 행 선택은 `radio + :checked` 형제 선택자로만 동작한다.
3건의 상세가 모두 초기 HTML 에 있으므로 JS 없이도 내용이 빠지지 않는다.

### 4.3 CTA → 폼 동기화는 "명시적 클릭"에만

데모 탭을 바꾸는 것만으로는 폼이 변하지 않는다(브라우저로 검증 — QA `CONV-01b`).
`data-voice-package` / `-industry` / `-volume` 속성이 붙은 앵커를 눌렀을 때만
enum 한 개씩 반영하고, 사용자가 직접 고른 값은 덮어쓰지 않는다(`CONV-01e`).

### 4.4 FAQPage 구조화 데이터를 유지한 이유

Google 은 2026-05-07 부터 FAQ 리치 결과를 표시하지 않는다.
그래서 이 페이지 어디에도 "FAQ 리치 결과를 얻는다"는 목표·보장을 쓰지 않았다.
다만 마크업 자체는 유효하고, 사이트의 다른 1,082개 페이지가 같은 helper 로 FAQPage 를
내보내며 `scripts/verify-faq.mjs` 가 화면↔스키마 일치를 전수 검사한다.
이 페이지만 빼면 검사 대상에서 이탈해 불일치를 놓치게 되므로 **유지**했다.

### 4.5 모바일 하단 고정 CTA를 만들지 않은 이유

명세 §5.2 는 "기존 모바일 하단 CTA가 **있으면** 그 구성에 통합한다"고 조건부로 적었다.
이 라우트에도, 같은 레이아웃을 쓰는 다른 Next 서비스 페이지에도 하단 고정 바가 없다.
새로 만들면 §5.2 가 함께 요구한 "같은 문의 폼이 보일 때 겹치지 않게"를 지키기 위해
IntersectionObserver 가 필요해 client JS 가 늘어난다.
→ 만들지 않고, 히어로·각 섹션 CTA·전화 링크로 접근성을 확보했다.
모든 폭(320~1920px)에서 주요 CTA 노출을 브라우저로 확인했다(QA `UI-01`).

---

## 5. 측정값 (실측)

| 항목 | 기준선 `a5aa77e` | 현재 | 판정 |
|---|---|---|---|
| 산출물 HTML | 1,351 | 1,351 | 증감 없음 |
| 사이트맵 URL | 780 | 780 | 증감 없음 |
| 라우트 client JS (gzip) | 3,167 B | 10,162 B | **+6.8KB** (예산 35KB) |
| 페이지 HTML | 187,525 B | 223,012 B | +35KB (본문 증가분) |
| 색인 판정 점수 | — | **95 / index** | `lib/index-quality.ts` |
| 단위 테스트 | 92 | **128** | +36 |
| Lighthouse 모바일 | Perf 69 · A11y 100 | **Perf 68 · A11y 100 · BP 100 · SEO 100** | Perf 목표 미달(§QA_REPORT) |
| CLS | 0.0009 | **0.0009** | 동일 |

---

## 6. 이 페이지가 "실제로 하는 것"과 "예시인 것"

| 기능 | 상태 |
|---|---|
| 업종별 통화 대화 | **가상 시뮬레이션** — 고정 대본, 네트워크 호출 없음 |
| 상담 정리 결과 패널 | **가상** — 대본에서 계산 |
| 관리자 화면 3건 | **가상** — 고정 데이터, 저장·다운로드 기능 없음 |
| 전화 업무량 계산기 | **실제 계산** — 단, 입력값은 어디로도 전송되지 않음 |
| 도입 문의 폼 | **실제 접수 경로** — 기존 `main-apply` (Netlify Forms) |
| 전화 상담 버튼 | **실제** — 름랩 담당자 번호 |
| AI 전화 수신·음성 처리 | **없음** — 이번 범위 아님 (`VOICE_SYSTEM_LIVE = NOT_IMPLEMENTED`) |
