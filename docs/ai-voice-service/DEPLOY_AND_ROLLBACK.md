# DEPLOY_AND_ROLLBACK — 배포와 되돌리기

---

## 1. 현재 상태

| 항목 | 값 |
|---|---|
| 작업 브랜치 | `claude/ai-voice-consultation-page-bq0jef` |
| 분기 기준 | `a5aa77e` (main) |
| **운영 배포** | **하지 않음** |
| main 병합 | **하지 않음** |
| IndexNow 제출 | **하지 않음** |

이 작업은 프롬프트 실행이라는 이유만으로 승인되지 않은 main push·운영 배포를 하지 않는다.
운영 반영은 소유자 승인·권한 정책 안에서만 진행한다.

---

## 2. 배포 구조 (확인된 사실)

```
git push → Netlify 빌드 → npm run build → out/ 배포
                            └ [context.production] 일 때만 빌드 후 IndexNow 제출
```

- 정적 export(`output: 'export'`)라 서버 런타임이 없다
- `npm run build` 안에 검증 게이트 4종이 들어 있어, 회귀가 있으면 **배포 전에 빌드가 실패한다**
- IndexNow 는 production 컨텍스트에서만 돈다. preview·branch deploy 에서는 제출되지 않는다

---

## 3. 배포 순서 (승인 후)

1. **미리보기 배포를 먼저 만든다.**
   브랜치를 push 하면 Netlify 가 branch deploy / deploy preview 를 만든다.
2. 미리보기 URL 에서 확인한다.
   - `/ai-voice-development/` 화면·데모·계산기 동작
   - **문의 폼 1건 제출 → Netlify Forms 저장 → 담당자 알림** (§LEAD_DELIVERY_CHECK §5)
   - 기존 페이지 8개 이상(`/`, `/geo-website/`, `/ai-search-optimization/`, `/mvp/`,
     `/ai-development/`, `/enterprise-ai/`, `/ai-automation/`, `/reservation-commerce/`) 이상 없음
   - **미리보기 URL 을 색인에 제출하지 않는다.**
3. 확인이 끝나면 main 에 병합한다(소유자 승인 필요).
4. production 배포 후 다시 확인한다.
   - `https://reumlab.com/ai-voice-development/` HTTP 200
   - canonical 이 `https://reumlab.com/ai-voice-development/` 인지
   - title·description 이 의도한 값인지
   - 폼 제출이 실제로 접수되는지 (1건만)
5. 검색 알림은 **기존 승인된 흐름**을 그대로 쓴다.
   이 페이지는 신규 추가가 아니라 **기존 경로의 갱신**이므로, 등록·보고에도 그렇게 적는다.
   IndexNow 응답 200 을 "색인 완료"라고 쓰지 않는다.

---

## 4. 되돌리기

### 4.1 원칙

- `git reset --hard` · `git clean -fd` · force push 를 롤백 방법으로 쓰지 않는다
- 되돌리는 대상은 **이번 변경 commit** 또는 **승인된 배포 단위**뿐이다
- 폼 필드를 추가했다고 해서 기존 접수 데이터가 삭제·초기화되지 않는다
  (필드 추가는 스키마 확장일 뿐 기존 레코드에 영향이 없다)

### 4.2 가장 빠른 방법 — Netlify 이전 배포로 되돌리기

Netlify 대시보드 → Deploys → 직전 정상 배포 → **Publish deploy**.
코드를 건드리지 않고 즉시 이전 산출물로 돌아간다. 먼저 이걸 쓴다.

### 4.3 코드에서 되돌리기

```bash
# 이번 커밋만 되돌린다 (히스토리를 지우지 않는다)
git revert <이번 커밋 해시>
git push -u origin <브랜치>
```

### 4.4 부분 롤백 — 사이트 공통 변경만 되돌리기

204개 페이지에 들어간 비-JS 안내만 빼고 싶다면:
`components/LandingInquiryForm.tsx` 의 `<noscript>` 블록 하나를 지우면 된다.
다른 변경과 독립적이다.

### 4.5 폰트 서브셋만 되돌리기

```bash
git checkout <기준 커밋> -- public/fonts/ styles.css reum.css privacy.html terms.html \
  refund.html vvip/index.html public/privacy/ public/terms/ public/refund/ \
  public/assets/admin-guide-example.html app/globals.css
```
단, 이렇게 하면 새 카피의 `녕`·`늠`·`묵` 3글자가 서브셋 밖이 되어 해당 페이지가
2.0MB 원본 폰트를 받는다. 빌드 게이트가 이를 실패시키므로 **문구를 함께 되돌려야 한다.**

### 4.6 롤백 후 반드시 다시 확인할 것

```bash
npm run build                # 게이트 4종 포함
npm run seo:verify           # 사이트맵·robots
npm run seo:verify:menu      # 서비스 메뉴
npm run seo:audit:index      # canonical·사이트맵·링크
```

그리고 `/ai-voice-development/` 가 여전히 200 이고 canonical 이 유지되는지 확인한다.

---

## 5. 배포를 막아야 하는 조건 (명세 §15.2)

아래 중 하나라도 해당하면 **"도입 문의 접수까지 운영 검증된 페이지"라고 보고하지 않는다.**

| 조건 | 현재 상태 |
|---|---|
| 정상적인 문의 전송·저장 경로 부재 | 경로는 존재. **저장 검증은 미완료** → 공개 시 이 구분을 유지 |
| 실제 AI 데모처럼 보이는 허위 표시 | 없음 (검사기가 `LIVE`·`현재 통화 중` 등을 막는다) |
| 필수 개인정보 안내 부재 | 없음 (동의 체크·처리방침 링크 확인) |
| 오류·중복에도 무조건 성공 화면 | 없음 (브라우저 실측으로 확인) |
| 기존 서비스 페이지·메인 문의 폼 손상 | 없음 (1,350개 본문 동일, 폼 2종 브라우저 확인) |
| canonical·robots·정적 렌더 회귀 | 없음 (전수 대조 0건) |
| 주요 모바일 화면에서 CTA·필수 필드 사용 불가 | 없음 (320~430px 확인) |
| 빌드 실패·치명적 console/hydration 오류 | 없음 (exit 0, console 오류 0) |

→ **공개 자체는 가능하다.** 다만 폼 수신이 검증되기 전까지는
"검증된 전화·이메일 경로를 함께 제공하는 상태"로 설명하고, 수신 검증 완료 후에
"문의 접수까지 검증됨"으로 바꾼다.
