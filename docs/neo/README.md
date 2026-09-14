# NEO 운영 문서

NEO는 이 저장소에서 **Naver Engine Optimization(네이버 검색 최적화)**을 뜻합니다. 기존 SEO·AEO·GEO의 canonical, 엔터티, 근거 원장을 그대로 사용하며 네이버 전용 유사 페이지를 만들지 않습니다.

## 실행

```powershell
npm run build
npm test
npm run typecheck
npm run neo:audit
npm run neo:report
npm run neo:indexnow:dry-run
npm run neo:http -- --origin https://reumlab.com --json docs/neo/private/http-latest.json
```

- `neo:audit`: robots/Yeti, canonical, sitemap, 색인성, 엔터티·NAP, 스키마, 콘텐츠를 묶어 검사합니다.
- `neo:report`: 공개 가능한 정적 URL 인벤토리와 외부 작업 상태표를 갱신합니다.
- `neo:http`: 일반 브라우저와 Yeti 응답의 상태·본문 해시를 비교하고 성남 구형 비용·견적 URL의 단일 301을 검사합니다.
- `neo:indexnow:dry-run`: 변경 URL만 계산하고 외부로 전송하지 않습니다.
- `neo:indexnow:submit`: 명시적 실전송 명령입니다. production 배포 이후에만 사용합니다.

Search Advisor/GSC/분석 원본은 `docs/neo/private/` 또는 기존 `docs/seo-aeo/private/`에 두며 Git과 정적 배포에서 제외합니다. 콘솔에서 직접 확인하지 않은 처리는 `VERIFIED`로 표시하지 않습니다.
