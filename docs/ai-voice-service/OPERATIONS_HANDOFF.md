# OPERATIONS_HANDOFF — 운영 인수 문서

`/ai-voice-development/` 를 앞으로 고칠 사람을 위한 문서다.
"어디를 고치면 화면의 무엇이 바뀌는가"와 "고치면 안 되는 것"을 적었다.

---

## 1. 문구를 고치는 곳

**거의 모든 문장은 `lib/ai-voice.ts` 한 파일에 있다.** 화면 파일(`page.tsx`)에는
문장을 직접 쓰지 않는다 — 데이터와 렌더를 분리해 둔 이유는 구조화 데이터·색인 채점·
검사기가 **같은 문자열**을 읽게 하기 위해서다.

| 화면에서 바꾸고 싶은 것 | 고칠 곳 |
|---|---|
| 페이지 제목·설명(검색결과에 나오는 문장) | `AI_VOICE_TITLE` · `AI_VOICE_DESCRIPTION` |
| 큰 제목(H1) | `AI_VOICE_H1` **과** `AI_VOICE_H1_LINES` (둘 다 — 줄바꿈 위치가 고정돼 있다) |
| 히어로 문구 | `AI_VOICE_LEAD` · `AI_VOICE_BODY` · `AI_VOICE_SUB_NOTE` |
| 히어로 특성 4개 | `HERO_FEATURES` |
| 문제 카드 3개 | `PROBLEMS` |
| 운영 방식 비교표 | `COMPARE_MODES` · `COMPARE_ROWS` |
| 업종별 업무 범위 표 | `INDUSTRY_SCOPES` |
| 기능 6개 | `FEATURES` |
| 관리자 예시 3건 | `ADMIN_ROWS` |
| 연동 구조 설명 | `ARCH_FLOW` · `ARCHITECTURE` · `INTEGRATION_CATEGORIES` |
| 통제 4단계 · 이관 조건 | `CONTROL_LEVELS` · `HANDOFF_CONDITIONS` |
| 상품 3종 | `VOICE_PACKAGES` |
| 비용 구조 | `COST_GROUPS` · `COST_SUPPLEMENT` · `COST_FACTORS` |
| 절차 5단계 | `PROCESS` |
| **FAQ 16문항** | `FAQS` |
| 문의 섹션 문구 | `INQUIRY_*` |

### 통화 대본을 바꾸려면

`lib/ai-voice-demo.ts` 의 `DEMO_SCENARIOS`.
- 발화를 추가하면 `id` 가 **고유**해야 한다(검사기가 막는다)
- `updates` 의 키는 그 시나리오의 `fields` 에 반드시 있어야 한다
- 끝까지 확인되지 않아야 할 항목은 `unresolved` 에 적는다 → 화면에 "미확인"으로 나온다
- 예약 확정 예시를 쓰려면 `confirm-request` → `customer-confirmed` → `simulated-tool-success`
  **순서**가 있어야 한다. 순서가 어긋나면 빌드가 실패한다

### 계산기 기본값·범위를 바꾸려면

`lib/ai-voice-workload.ts` 의 `WORKLOAD_DEFAULTS` · `WORKLOAD_FIELDS`.
공식을 바꾸면 `scripts/ai-voice-workload.test.mts` 의 기준값도 함께 고쳐야 한다.

### 폼 선택지를 바꾸려면

`lib/ai-voice-form.ts` 하나만 고친다. **단, 필드 "이름"을 바꾸면
`public/__forms.html` 도 같이 고쳐야 한다** — 안 고치면 빌드가 실패한다(그러라고 만든 검사다).

---

## 2. 고치면 안 되는 것

| 대상 | 이유 |
|---|---|
| `lib/ai-voice-demo.ts` · `ai-voice-form.ts` · `ai-voice-workload.ts` 에 `import` 추가 | 이 세 파일은 **import 0개**여야 한다. 하나라도 추가하면 `lib/seo.ts`(1,124줄)가 모든 랜딩 페이지의 클라이언트 번들에 딸려 들어간다 |
| canonical · URL 경로 | 기존 색인·내부 링크가 이 주소를 가리킨다. 같은 의도의 새 경로를 만들지 않는다 |
| 폼 이름 `main-apply` · `bot-field` · `form-name` | 접수 내역이 한 곳에 모이는 기준이다. 바꾸면 과거 데이터와 갈린다 |
| 기존 전환 이벤트 이름 | `inquiry_form_submit` · `main_apply_submit` · `form_submit_success` 는 운영 중인 GTM 트리거가 쓴다 |
| `lib/pricing.ts` | 이 페이지는 이제 여기를 참조하지 않는다. 공유 가격 데이터를 이 작업 때문에 고치지 않는다 |
| `#voice-demo` · `#voice-inquiry` 앵커 | 페이지 안 CTA 가 전부 이 두 개를 가리킨다 |

---

## 3. 데모와 실제 문의의 차이 (고객 응대 시)

| 화면 요소 | 실제로 무슨 일이 일어나나 |
|---|---|
| 업종별 통화 대화 | **아무 일도 일어나지 않는다.** 고정된 대본을 순서대로 보여 줄 뿐이다. 전화·음성 AI·API 호출 없음 |
| 상담 정리 결과 | 대본에서 계산한 **가상 결과**. 어디에도 저장되지 않는다 |
| 관리자 화면 3건 | **가상 데이터.** 로그인·저장·녹취 다운로드 기능은 없다 |
| 전화 업무량 계산기 | 브라우저에서만 계산한다. **입력값은 전송되지 않는다** |
| "이 업종으로 도입 상담" 버튼 | 문의 폼으로 이동하며 **업종 선택지 하나만** 맞춰 준다. 접수되지 않는다 |
| 상품 CTA 3개 | 같은 방식. 관심 구축 범위 하나만 맞춰 준다 |
| 도입 문의 폼 | **실제 접수 경로다.** 여기서만 데이터가 전송된다 |
| 전화 상담 버튼 | **름랩 담당자 번호**다. AI 데모 전화가 아니다 |

> 고객이 "지금 이 AI에게 전화해 볼 수 있나요?"라고 물으면 — FAQ 15번의 답변 그대로,
> 현재는 가상 대화 예시만 제공하며 실제 체험 번호는 검증·운영 중일 때만 별도 안내한다.

---

## 4. 문의가 들어왔을 때 확인하는 곳

1. Netlify 대시보드 → **Forms → main-apply**
2. 접수 상세에서 이 페이지에서 온 문의는 `유입_랜딩 = /ai-voice-development/` 로 구분된다
3. 이번에 추가된 값: `음성_업종` · `음성_하루전화량` · `음성_관심상품`
4. 자유 입력 `핵심기능` 에 "AI가 맡았으면 하는 전화 업무"가 들어 있다

### 수신이 안 될 때 확인 순서

1. Netlify **Forms** 목록에 `main-apply` 가 있는가 → 없으면 감지 실패. 재배포한다
2. 접수는 쌓이는데 알림만 없는가 → Netlify 알림 설정 문제. **새 문의를 만들어 시험하지 말고** 설정을 본다
3. 특정 필드만 비어 있는가 → `public/__forms.html` 에 그 이름이 등록됐는지 확인
4. 전혀 아무것도 안 들어오는가 → 브라우저 개발자도구 Network 에서 `/__forms.html` POST 의
   응답 코드를 본다. 200 이 아니면 호스팅 쪽 문제다
5. 어느 경우든 **화면의 전화·이메일은 항상 동작한다** — 고객에게는 그 경로를 먼저 안내한다

---

## 5. 빌드·검사 명령

```bash
npm run typecheck                 # 타입
npm test                          # 단위 테스트 128개
npm run build                     # 전체 빌드 (안에 게이트 4종 포함)
npm run seo:verify:ai-voice       # 이 페이지 전용 회귀 검사 17항목
```

`npm run build` 는 마지막에 아래 4개를 자동 실행한다. 하나라도 실패하면 빌드가 멈춘다.

```
seo:verify:home-guide → seo:verify:ai-search → seo:verify:ai-voice → seo:verify:font
```

전체 감사(오래 걸림):

```bash
npm run seo:qa && npm run seo:audit:index && npm run seo:verify:faq \
  && npm run seo:verify:conversion && npm run seo:verify:cannibalization
```

---

## 6. 글자가 깨져 보인다면

이 사이트는 실제 쓰는 글자만 모은 폰트 서브셋(1,339자)을 쓴다.
**새 문구에 지금까지 없던 글자가 들어가면** 그 페이지만 2.0MB 원본 폰트를 추가로 받는다.

빌드가 이를 막아 준다:

```
✖ [subset] '녕' (U+B155) 가 서브셋 밖 — …
  해결: npm run build 후 `python3 scripts/build-font-subsets.py && node scripts/apply-font-subset-css.mjs` 를 다시 실행하고 커밋하세요.
```

안내대로 두 명령을 실행하고 **바뀐 파일을 함께 커밋**하면 된다(11곳의 `@font-face` 선언이
자동으로 동기화된다).

---

## 7. 공개 전 남은 설정

§OWNER_ACTIONS.md 를 볼 것. 요약하면:

1. 문의 폼 실제 수신 확인 (§LEAD_DELIVERY_CHECK §5) — **가장 중요**
2. 개인정보 처리방침의 수집 항목에 신규 3개 필드를 반영할지 판단
3. 운영 도메인에서 성능·화면 재확인
4. 검색엔진 색인 요청은 기존 절차대로 (이 페이지는 신규가 아니라 **기존 경로의 갱신**이다)
