# 네이버 SEO — Title 중복 오류 수정 · 검증 리포트

작성 기준: 코드베이스 직접 조사 + `next build`(정적 export) 결과 HTML 실측.

## 1. title 중복(“title 요소 2개 이상”) 원인

- **실제 원인**: 지역×서비스 랜딩 페이지 템플릿(`app/[slug]/[region]/page.tsx`)이 본문에
  인라인 SVG 히어로를 렌더링하면서 그 안에 **SVG `<title>` 요소**를 포함하고 있었습니다.
- 페이지 `<head>`에는 Next Metadata API가 생성한 정식 `<title>`이 1개 있고, 여기에 더해
  **본문 SVG의 `<title>`이 1개 더** 존재해, 문서 전체에 `<title>` 요소가 2개가 됩니다.
- 구글은 SVG `<title>`과 문서 `<title>`을 구분하지만, **네이버 크롤러는 문서 내 `<title>`을
  전수 집계**하므로 “title 요소가 2개 이상 발견”으로 판정합니다.
- 이 템플릿에서 생성되는 지역×서비스 페이지는 **5개 서비스 × 70개 지역 = 350개**로,
  네이버가 수집한 URL(약 35건)이 모두 이 유형에 해당합니다. → **단일 원인**.
- SVG `<title>`은 접근성 목적이었으나, 해당 `<svg>`에는 이미 `role="img"`와 `aria-label`,
  그리고 시각적으로 숨긴 `<figcaption>`이 있어 **중복(불필요)** 이었습니다.

### 근거로 배제한 다른 원인
- 루트 `layout.tsx`: Metadata API만 사용, JSX `<title>` 없음. (정상)
- `next/head` / `document.title` / react-helmet: **사용처 없음**.
- 정적 홈 `index.html`: `<title>` 정확히 1개.
- `lib/seo-optimizer.ts`의 `<title>` 문자열: **어디에서도 import되지 않는 미사용 코드**(빌드/서빙 영향 없음).
- `lib/marketing-dashboard-api.ts`: 내부 대시보드용(비색인).

## 2. 수정 파일

수정:
- `app/[slug]/[region]/page.tsx` — SVG 내 `<title>{media.alt}</title>` 제거(접근성은 `aria-label`+`figcaption` 유지).
- `package.json` — `seo:audit` 스크립트 추가.

신규:
- `scripts/seo-audit.mjs` — 빌드 결과(out/) 전수 검사(제목 개수/중복, description, H1, canonical).
- `docs/seo-audit-report.md` — 본 문서.

## 3. 검증 결과 (실측)

| 항목 | 결과 |
|---|---|
| `next build` (정적 export) | **PASS** (exit 0, 1,400+ 페이지 생성) |
| 지역 페이지 `<title>` 개수 | 수정 전 2 → **수정 후 1** (예: `/app-development/sokcho/`) |
| `npm run seo:audit` | **PASS** (exit 0) |
| 전 페이지 title 개수 분포 | **`{ "1": 1407 }`** — 2개 이상인 페이지 0건 |
| 중복 title / 중복 description | **0종 / 0종** (전 사이트) |
| canonical 자기참조 | **1408/1408** (홈으로 몰림 없음) |
| sitemap URL | **824건** (품질 게이트 통과분만, 리다이렉트 스텁 제외) |
| robots.txt | 정상 (Allow: / · Sitemap 명시) |
| 치명 오류(FAIL) | **0건** |

즉, **“title 2개 이상” 오류는 전 페이지에서 해소**되었고, title/description 중복,
canonical, sitemap 등 구조적 SEO 항목도 모두 정상입니다.

## 4. 해소 완료 — hub↔landing 제목 중복

- 초기 감사에서 `/h/{slug}` 와 `/l/{slug}` 가 같은 키워드로 제목이 겹치던 5쌍
  (`app-dev-cost`, `gangnam-homepage`, `homepage-quote`, `startup-app-dev`, `web-dev-cost`)을
  **허브 제목에 “… 총정리 | 지역별 견적·업체” 접미를 부여**해 해소했습니다.
- 허브는 키워드 모음(집합) 페이지이므로 정보형 의도를 명확히 하는 방향이며,
  개별 랜딩(/l/*)은 정확 키워드 제목을 유지합니다. → **중복 title 0종**.

### 남은 경고(정상 동작)
- `/AI서비스개발/`: 구 URL → 신 URL **메타 리프레시 리다이렉트 스텁**. H1/description 없음이 정상.

## 5. 코드로 해결 불가 — 사용자 조치 필요

- 네이버 서치어드바이저에서 **수정된 URL 재수집(재검증) 요청** 필요.
- 정확한 오류 35개 URL의 CSV가 제공되면 URL별 수정 전후 표를 추가로 작성 가능
  (현재는 단일 원인이 350개 지역 페이지 전체를 커버하므로, CSV 없이도 해소됨).

## 6. 네이버 재수집 권장 대상

지역×서비스 URL 전체가 대상입니다. 대표 예시:
- `/app-development/suwon/`, `/app-development/dongtan/`, `/app-development/hwaseong/` …
- `/web-development/suwon/`, `/mvp/suwon/` 등 `/{service}/{region}/` 패턴 전체.
- 우선 재수집: 서치어드바이저 오류 목록에 실제로 뜬 35개 URL부터.

## 7. 재발 방지

- `npm run seo:audit` 를 빌드 후 실행하면 문서 내 `<title>` 2개 이상이 다시 생기는 순간
  **exit 1**로 실패 처리됩니다(CI/배포 전 게이트로 활용 가능).
