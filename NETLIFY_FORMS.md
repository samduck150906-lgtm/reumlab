# 무료 진단 신청 폼 — Netlify Forms 이메일 설정

`reumlab.com/soho` 하단 **무료 진단 신청 폼**은 Resend 같은 외부 메일 서비스 없이
**Netlify Forms**로 접수됩니다. 신청이 들어오면 Netlify가 자동으로 저장하고,
설정해 둔 이메일로 알림을 보냅니다. 코드 추가는 끝났고, **Netlify 대시보드에서
이메일 알림만 켜면** 됩니다.

---

## 1. 동작 방식 (이미 적용된 부분)

- 폼 이름: **`soho-diagnosis`**
- 폼 마크업이 정적 빌드 결과물(`out/soho/index.html`)에 포함됩니다.
- **감지 보강:** React로 렌더되는 폼은 빌드 환경(Next 플러그인·publish 디렉터리 차이)에
  따라 Netlify 봇이 못 읽는 경우가 있어, 동일한 `name`·필드를 가진 정적 감지용 파일
  **`public/__forms.html`**(배포 시 `/__forms.html`, 화면 비노출·noindex)을 함께 두어
  **확실히 감지**되게 했습니다. 실제 제출은 React 폼이 `fetch`로 처리합니다.
- 스팸 방지용 honeypot(`bot-field`) 포함.
- 제출하면 페이지 이동 없이 "신청이 접수됐어요" 완료 메시지가 표시됩니다.

수집 항목: **이름 · 연락처 · 진단항목 · 상호명 · 이용약관동의 · 개인정보동의**

> 별도 환경변수·API 키·서버 코드가 필요 없습니다.

> ⚠️ **먼저 `main`에 머지되어 배포돼야 합니다.** 폼이 브랜치에만 있고 `main`에
> 없으면 운영 사이트에 안 올라가고, Netlify Forms 목록에도 `soho-diagnosis`가
> 나타나지 않습니다.

---

## 2. 배포 후 폼 인식 확인

1. `samduck150906-lgtm/reumlab` 저장소가 연결된 Netlify 프로젝트(`reumlab`)에서
   최신 커밋이 배포되도록 **Deploys → Trigger deploy**.
2. 배포가 끝나면 왼쪽 메뉴 **Forms** 에 **`soho-diagnosis`** 폼이 나타납니다.
   - 보이지 않으면: **Project configuration → Forms → Form detection** 이 켜져 있는지 확인하고
     한 번 더 배포하세요. (정적 배포라 `publish = out` HTML을 스캔합니다.)

---

## 3. 이메일 알림 설정 (여기만 하면 끝)

1. Netlify 대시보드 → **Forms** → **`soho-diagnosis`** 선택
   (또는 **Project configuration → Forms → Form notifications**)
2. **Add notification → Email notification** 클릭
3. 입력:
   - **Email to notify**: 신청을 받을 메일 주소 (예: `ceo@eternalsix.com`)
   - **Form**: `soho-diagnosis`
4. **Save** → 이후 신청이 들어올 때마다 해당 메일로 알림이 옵니다.

> 여러 명에게 보내려면 알림을 여러 개 추가하면 됩니다.
> 슬랙/웹훅 알림(Outgoing webhook, Slack)도 같은 화면에서 추가할 수 있습니다.

> **"Any form"(모든 폼)으로 설정해도 괜찮습니다.** 이렇게 두면 향후 감지되는
> `soho-diagnosis` 제출도 자동으로 알림에 포함됩니다. `soho-diagnosis`만 받고 싶으면,
> 배포 후 폼이 목록에 잡힌 다음 알림을 **Options → Edit**에서 해당 폼으로 바꾸면 됩니다.

---

## 4. 접수 내역 확인

- 모든 신청은 **Forms → soho-diagnosis** 에 쌓입니다. (이메일을 못 받아도 여기 남아 있음)
- CSV 다운로드, 스팸 표시, 삭제가 가능합니다.
- 무료 플랜은 월 **100건**까지 접수됩니다. 그 이상은 Forms Level 업그레이드가 필요합니다.

---

## 5. 로컬에서 미리 보기

폼 제출(접수)은 **실제 배포된 Netlify 환경에서만** 동작합니다.
디자인·동작 확인은 아래로:

```bash
npm install
npm run dev      # http://localhost:3000/soho 에서 폼 확인
```

> 로컬 `next dev`에서는 제출 시 접수가 되지 않습니다(이메일도 안 옴).
> 실제 접수 테스트는 배포 후 `https.../soho` 에서 한 번 신청해 확인하세요.

---

## 참고: 폼을 수정할 때

- 필드/문구 수정: `app/soho/SohoForm.tsx`
- 스타일 수정: `app/soho/soho.css` (`.sf-*` 클래스)
- **폼 이름(`soho-diagnosis`)이나 필드 `name`을 바꾸면** Netlify에서 새 폼으로 인식되므로,
  알림을 다시 설정해야 합니다.
