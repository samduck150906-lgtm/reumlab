# 배포 후 확인 절차

대상은 `samduck150906-lgtm/reumlab`과 `https://reumlab.com/`이다. Google은 `ceo@eternalsix.com`, 네이버는 `ute`의 해당 사이트만 사용한다. 아래 일정은 확인 기준이며 예약 자동화를 생성하지 않았다.

| 확인일 | 확인할 내용 | 판단 기준 |
|---|---|---|
| 2026-10-27 · 7일 후 | Google·네이버 사이트맵/RSS 읽은 날짜, 대기 URL 수집 상태, `/app/community/` canonical | 제출 접수와 실제 새 콘텐츠 수집을 구분한다. Google 과거 외부 canonical 판단은 최신 수집 시각과 Google-selected canonical이 해당 URL로 확인될 때 해소로 기록한다. |
| 2026-11-03 · 14일 후 | 대상 URL 색인, 제외 사유, 브랜드·서비스 검색, AI 검색 노출 | 비교 URL 목록과 기간을 유지하고, 삭제된 URL·noindex·리다이렉트를 새로운 실패로 혼합하지 않는다. AI 인용은 실제 화면·질문·검색일·기기·계정 조건을 함께 기록한다. |
| 2026-11-17 · 28일 후 | 동등 기간 클릭·노출·CTR·순위 및 문의 경로 | 28일 비교와 90일 추세를 따로 본다. 배포 전 이미 존재한 검색·AI 노출을 신규 성과로 계산하지 않는다. 실제 문의 전송·저장 여부는 별도 승인된 실데이터로 확인한다. |

## 남은 관리 화면 작업

- Google의 성공한 개별 요청은 중복 제출하지 않는다. 대기 7개는 첨부 제출 기록의 `google.pendingUrls`를 기준으로 reCAPTCHA 연결 오류가 해소된 뒤 URL 검사와 요청을 진행한다. 화면에서 할당량 초과가 확인된 경우에만 할당량 대기로 바꾼다.
- 네이버는 사용자 보안 확인 후 2026-10-20 RSS 17:25:21, 사이트맵 17:29:22, 핵심 URL 10개 17:29:47~17:32:04 KST의 접수 내역을 확인했다. [최종 접수 기록](submissions/naver-final-receipts.json)을 기준으로 성공한 요청을 중복 제출하지 않고, 후속 관측일에 실제 읽기·수집·색인 상태를 확인한다. 이전 CAPTCHA 대기 기록은 과거 이력으로 보존하며 현재 제출 대기로 해석하지 않는다. 접수는 실제 색인 완료를 뜻하지 않는다.
- 개발 사례의 실제 공개 허가와 개인정보·환불 정책의 실제 운영 적합성은 사업자가 확인해야 한다. 코드 문서 대조만으로 이를 인증하지 않았다.
- 모바일 Lighthouse는 한 번의 실험실 관측이며 최종 사용자의 현장 성능을 대신하지 않는다. 남은 메인 스레드 지연은 실제 트래픽과 동등 측정 조건에서 후속 개선한다.

## 실제 재실행 명령

다음은 해당 저장소 루트에서 실행한다. 검증은 이미 배포된 소스와 같은 커밋을 기준으로 한다.

```powershell
npm run build
node scripts/verify-sitemap.mjs
node scripts/audit-indexability.mjs
node scripts/qa-final.mjs
node scripts/verify-pricing.mjs
pwsh -File scripts/verify-feed.ps1
node --use-system-ca scripts/submit-indexnow.mjs --dry-run --allow-large-batch
```

마지막 명령은 전송하지 않는다. 출력이 0개면 다시 제출할 필요가 없다. 내용이 실제 바뀌었고 운영 공개 및 공개 키 파일을 확인한 경우에만 다음 명령으로 변경분을 제출한다.

```powershell
node --use-system-ca scripts/submit-indexnow.mjs --submit --allow-large-batch
```

`--all`을 사용해 무조건 전체를 재제출하지 않는다. `scripts/.indexnow-manifest.json`과 `submissions/indexnow.jsonl`의 실제 응답을 보존하고, 성공/실패·접수 시각·회차별 URL을 구분한다. 접수 성공은 색인·상위 노출·AI 인용 성공을 보장하지 않는다.
