# 7. 운영 반영 절차 초안 · 롤백

**이번 실행에서 운영 반영은 하지 않았습니다.** 아래는 승인 시 사용할 절차 초안입니다.
아직 실행한 것이 아니며, 예약·자동화된 모니터링도 설정하지 않았습니다.

## 지금 상태

| 항목 | 값 |
|---|---|
| 변경 위치 | 브랜치 `claude/homepage-redesign-pid0s4` |
| 기준 커밋 | `52b2d55833b55b841345250af5cd590eec44c58f` |
| 운영 배포 | **하지 않음** |
| `main` 병합 | **하지 않음** |
| 도메인·DNS·Netlify 설정 | **건드리지 않음** |
| 공개 preview | **만들지 않음** |
| IndexNow 제출 | **실행하지 않음** |
| DB/CMS 쓰기·실제 문의·이메일·결제 | **실행하지 않음** |

> ⚠ 이 저장소의 Netlify 설정은 `[context.production]` 에서
> `npm run build && npm run seo:indexnow` 를 실행합니다. **production 컨텍스트 배포는
> IndexNow 에 실제 제출까지 합니다.** 승인 전에는 production 배포를 트리거하지 마세요.
> 브랜치 커밋 메시지에 `[skip netlify]` 를 넣어 빌드가 걸리지 않게 했습니다
> (이 저장소가 이미 쓰던 방식입니다).

## 승인 후 반영 절차 (초안)

1. **최신 운영본을 다시 읽고 기준본과 비교합니다.**
   이 작업의 기준본은 로컬 빌드이고, 운영본 직접 대조는 egress 차단으로 하지 못했습니다.
   배포 직전에 `https://reumlab.com/` 의 HTML·가격·문구·링크를 받아
   `evidence/manifest-home-before.json` 과 대조하세요.
   ```bash
   curl -sS https://reumlab.com/ -o live.html
   node tools/home-redesign/extract-manifest.mjs live.html --label live --out live.json
   node tools/home-redesign/diff-manifest.mjs live.json docs/home-redesign/evidence/manifest-home-before.json
   ```
   **차이가 나오면 이 결과물로 덮어쓰지 말고, 최신 운영본 기준으로 재검증하세요.**
2. 직전 운영 release 식별자(Netlify deploy ID·커밋 SHA)를 기록합니다.
3. 기존 배포 방식 그대로, 이 브랜치의 **`styles.css` 1개 파일 변경만** 반영합니다.
4. 배포 직후 즉시 점검:
   - `/` 200 · canonical `https://reumlab.com/` · `noindex` 없음
   - 대표 서브페이지(`/mvp/` `/portfolio/` `/guide/` `/cost/` `/soho/`) 200 · canonical · 본문
   - 홈 상담 폼 화면 표시와 검증 동작(실제 제출은 1건만 내부 확인)
   - 전화·카카오·이메일 링크 목적지
   - 콘솔 오류가 배포 전과 같은 1건(B-1)인지

## 롤백

변경이 **`styles.css` 파일 하나**뿐이므로 되돌리기 단위도 하나입니다.

```bash
# 검증된 기준 버전으로 되돌리기
git checkout 52b2d55833b55b841345250af5cd590eec44c58f -- styles.css
npm run build     # production 컨텍스트에서 배포하면 IndexNow 제출이 함께 실행됩니다
```

또는 Netlify 대시보드에서 직전 성공 배포를 **Publish deploy** 로 되돌립니다(가장 빠름).

- Git history 강제 초기화(`reset --hard` + force push)는 하지 않습니다.
- DB 롤백은 필요하지 않습니다 — 이번 변경은 DB·CMS 를 건드리지 않습니다.
- 롤백 확인: `out/styles.css` SHA-256 이 기준본 값과 같은지, 홈 화면이 배포 전과 같은지.

**코드를 롤백해도 검색 순위·AI 인용이 즉시 회복된다고 보장하지 않습니다.**

## 배포 후 관측 계획 (아직 실행하지 않음)

접근 권한이 없어 이 세션에서는 아무 데이터도 확보하지 못했습니다.
아래는 권한이 있는 분이 직접 실행할 항목입니다.

1. **배포 전 데이터 보관**: Search Console(노출·클릭·평균 게재순위, 홈 및 주요 쿼리),
   네이버 서치어드바이저, GA4(홈 세션·이탈·CTA 클릭·`generate_lead`) 를 배포 직전에 내보내기.
2. **7 / 14 / 28일 관측**: 같은 지표를 같은 기간 길이로 비교.
3. **혼입 요인 분리**: 표본이 작은 구간, 요일 효과, 광고·콘텐츠 발행 등 다른 변화와 구분.
   이번 변경은 CSS 한 파일이므로 콘텐츠·링크 변화에 의한 효과와는 원인이 다릅니다.
4. **AI 인용 관측**: 같은 질문·플랫폼·모델·언어·지역·실행 날짜·조건을 기록해 반복 관찰.
   **1회 답변을 성과로 단정하지 않습니다.** 브랜드 언급과 실제 출처 인용을 구분하고,
   근거 없는 GEO 점수·추천 확률을 만들지 않습니다.
5. **인과 구분**: 기술적 보존(이 보고서가 검사한 것)과 SEO/GEO 성과 변화는 다른 문제입니다.
   이 작업은 "검사한 범위에서 기술적 회귀가 발견되지 않았다"까지만 말합니다.

## 승인이 필요한 별도 항목

`06-baseline-issues.md` 의 B-1(JS 런타임 오류)·B-2(모바일 메뉴 버튼 대비 3.05:1)는
이번 범위 밖이라 고치지 않았습니다. 각각 제안 패치를 적어 두었으니 반영 여부를 결정해 주세요.
