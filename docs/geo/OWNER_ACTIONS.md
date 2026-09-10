# Owner actions

코드 밖의 계정·소유권·실사용 검증이 필요한 작업이다. 배포 후 아래 순서로 진행한다.

1. Netlify 배포 미리보기에서 `/`, 핵심 서비스, 가이드, 사례, 폼, 404를 모바일·데스크톱으로 확인한다.
2. 성남 레거시 URL 15개 slug의 slash/non-slash 변형이 한 번의 301로 목표 canonical에 도착하는지 확인한다.
3. Google Search Console에서 `https://reumlab.com/sitemap.xml` 처리 상태, canonical 선택, Core Web Vitals, 주요 URL 색인 상태를 확인한다.
4. Bing Webmaster Tools에서 사이트맵과 IndexNow 수신을 확인하고 AI Performance가 제공되면 citation/grounding query를 월간 기록한다.
5. 네이버 Search Advisor의 소유 확인, 사이트맵, `feed.xml`, IndexNow 상태와 사이트명을 확인한다.
6. 네이버 플레이스와 Google Business Profile의 상호·대표 주소·전화·영업 형태가 코드의 기준 NAP와 같은지 소유자 계정에서 확인한다.
7. GA4/GTM Preview에서 `page_context`, `cta_click`, `inquiry_form_start`, 서버 성공 후 `generate_lead`가 각각 한 번만 발생하는지 확인한다.
8. GA4에 AI referral 채널 그룹/탐색을 만들고 ChatGPT, Perplexity, Claude, Bing/Copilot 리퍼러 및 `lead_source`를 함께 본다.
9. Netlify Forms에서 홈·랜딩·SOHO 테스트 문의가 접수되고 최초 랜딩/채널/UTM이 보존되는지 확인한 뒤 테스트 데이터를 삭제한다.
10. CDN 로그에서 Googlebot, bingbot, Yeti, OAI-SearchBot, PerplexityBot, Claude-SearchBot 응답 상태와 HTML 동등성을 확인한다.
11. 프로덕션에서 Lighthouse를 모바일 기준으로 실행하고 SEO/Accessibility 95 이상 여부와 기존 performance 회귀를 기록한다.
12. 콘텐츠 담당자가 GSC 노출과 문의가 없는 대량 업종/비용/솔루션 URL을 분기별로 수동 검토해 근거 강화·noindex·통합 중 하나를 결정한다.

학습용 GPTBot/ClaudeBot은 현재 허용 상태다. 유지 또는 차단 여부는 소유자의 콘텐츠 정책 결정 사항이다.
