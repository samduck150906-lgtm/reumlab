# REUMLAB SEO 체크리스트

- [ ] 각 페이지 title 60자 이내, meta description 155자 이내 (`lib/seo.ts`에서 조정)
- [ ] canonical URL · OG 이미지 (`/public/og-image.jpg` 1200×630 권장, 현재는 `og-default` 복사본)
- [ ] JSON-LD: 홈·서비스 URL·포트폴리오에 Organization + Breadcrumb 적용됨
- [ ] `.env.local`에 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 설정
- [ ] Search Console / 네이버 서치어드바이저에 `sitemap.xml` 제출
- [ ] 모바일 속도·Core Web Vitals 점검

## 라우트 요약

| 경로 | 설명 |
|------|------|
| `/` | 메인 |
| `/portfolio/` | 포트폴리오 통합 |
| `/솔루션SaaS/` | 솔루션·SaaS 전략 페이지 |
| `/웹개발/` … | `PAGE_SEO_MAP` 키와 동일한 한글 슬러그 |
| `/consultation/` | 상담 |

## 네이버 서치어드바이저 (름랩 버전)

- [ ] **robots.txt** — `/robots.txt`에 `Allow: /`, `Sitemap: https://reumlab.com/sitemap.xml` 확인 (`app/robots.ts`)
- [ ] **웹 페이지 수집 요청** — [요청] → [웹 페이지 수집]에 각각 제출  
  - `https://reumlab.com/` (메인 설명 변경 시 필수)  
  - `https://reumlab.com/솔루션SaaS/` (신규 전략 페이지)
- [ ] **구 URL 리다이렉트** — 예전 `/AI서비스개발/` → `/솔루션SaaS/`  
  - **정적 export(현재)**: `public/AI서비스개발/index.html`(canonical+즉시 이동), Netlify 등은 `public/_redirects`  
  - **Node 서버 배포 시**: `next.config.mjs` 상단 주석의 `redirects` 예시를 복사해 활성화
