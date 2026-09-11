# AEO·SEO 구현 검증

기준일: 2026-09-11

## 정적 빌드 기준

- HTML 1,348개: INDEX 777, NOINDEX 566, SYSTEM 5
- sitemap URL 777개, indexable self-canonical URL과 일치
- canonical·sitemap·redirect·404·중복 title/description/H1·깨진 링크·고아 오류 0
- 정보성 색인 페이지 170개: 블로그 10, 가이드 45, 비교 3, 비용 112
- 구조화 데이터: Article 58, CreativeWork 15
- 전환: 문의 폼 17, CTA 태깅 774, 성공 이전/중복 `generate_lead` 0

## Netlify 프리뷰

- 프리뷰 deploy: `6aa35e0f20c409ba88e3f2b1`
- `/guide/app-cost/`, `/guide/mvp-cost/`, `/guide/outsourcing-checklist/`: HTTP 200, production self-canonical, 직접 답변·방법론·한계·출처·검수일·Article citation 확인
- `/portfolio/edu-erp/`: HTTP 200, CreativeWork·공개 한계 확인, AggregateRating 없음
- 임의 미존재 URL: HTTP 404
- `/feed.xml`: HTTP 200, item 58개
- `/sitemap.xml`: HTTP 200, sitemap index

## 모바일·접근성

- 실제 브라우저 390×844에서 모바일 메뉴 전환과 본문 렌더 확인
- `innerWidth` 390, 문서 `scrollWidth` 375로 가로 넘침 없음
- H1 1개, 네이티브 HTML table 1개
- 첫 Tab 초점이 REUMLAB 홈 링크로 정상 이동
- 프리뷰 Lighthouse 최초 측정: Performance 71, Accessibility 93, Best Practices 77, SEO 69
- 프리뷰 SEO 점수는 Netlify draft의 `noindex` 때문에 낮아진 값이며 production 판정으로 사용하지 않음
- 최초 Lighthouse가 잡은 색상 대비, 색상만으로 구분한 링크, 빠른 상담 버튼의 label/name 불일치는 코드에서 수정함
- 최종 프로덕션 모바일 Lighthouse: Performance 73, Accessibility 100, Best Practices 77, SEO 100
- 최종 실험실 지표: FCP 4.1초, LCP 4.1초, TBT 220ms, CLS 0
- Performance는 변동 가능한 단일 실험실 실행이며 LCP 목표 통과를 뜻하지 않음. 외부 분석 스크립트와 공통 CSS/JS를 포함한 후속 성능 작업이 필요함
- 실사용자 CWV는 GSC field data가 필요하며 OWNER_INPUT_REQUIRED로 분리함

## 알려진 경고

- 홈에서 클릭 깊이 6 이상인 색인 URL 109개, 최대 12
- `인계동` 문맥 문자열 9개는 실제 지점 주장이 아닌지 수동 확인 필요
- 모바일 성능의 남은 주요 실험실 병목은 미사용 공통 CSS/JS, 제3자 분석 스크립트, 네트워크·문서 응답 지연임
