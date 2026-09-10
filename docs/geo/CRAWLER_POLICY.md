# Crawler policy

## 현재 코드 정책

`app/robots.ts`가 robots.txt의 단일 출처다. 모든 공개 HTML, CSS, JS, 이미지와 폰트를 허용하고, 정적 export가 생성하는 중복 RSC 페이로드 `/*index.txt$`만 차단한다.

| crawler | 목적 | 현재 정책 |
|---|---|---|
| Googlebot / bingbot 및 일반 봇 | 검색 | `User-agent: *`로 허용 |
| Yeti | 네이버 검색 | 명시 그룹으로 허용 |
| OAI-SearchBot | ChatGPT 검색 | 허용 |
| ChatGPT-User | 사용자 요청 조회 | 허용 |
| Claude-SearchBot | Claude 검색 | 허용 |
| PerplexityBot | Perplexity 검색 | 허용 |
| GPTBot | OpenAI 학습 | 기존 정책대로 허용 |
| ClaudeBot | Anthropic 크롤링 | 기존 정책대로 허용 |

검색용 크롤러와 학습용 크롤러는 목적이 다르다. 이번 작업은 기존 학습 봇 정책을 임의로 바꾸지 않았다. 소유자는 법무·콘텐츠 정책에 따라 GPTBot/ClaudeBot 허용 여부를 별도로 결정해야 한다.

## 원칙

- 봇별로 다른 영업 문구나 숨김 콘텐츠를 제공하지 않는다.
- SearchBot 허용은 색인·노출·인용 보장이 아니다.
- sitemap, schema, robots, `llms.txt`는 서로 대체하지 않는다.
- 비표준 `ai.txt`를 필수 파일처럼 추가하지 않는다.
- `llms.txt`와 33KB의 제한된 `llms-full.txt`는 기존 canonical 원본에서 자동 생성되고 화면 FAQ와 동기화되는 보조 실험으로만 유지한다.

## 배포 후 확인

Googlebot, bingbot, Yeti, OAI-SearchBot, PerplexityBot, Claude-SearchBot User-Agent로 같은 공개 HTML과 정상 상태가 반환되는지 CDN 로그와 HTTP smoke test로 확인한다.
