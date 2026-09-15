# 기존 검색 자산 보존 검증

"HTML 파일이 존재한다" 가 아니라, 기존 1,350개 산출물의 **의미 단위**(title·description·canonical·robots·h1·JSON-LD·상담 폼·전화 CTA·본문 텍스트)를 변경 전후로 대조했다.

## 1. 비교 방법

기준선을 `git worktree add --detach <임시경로> 16d04a4` 로 분리 체크아웃해 **같은 명령(`npm run build`)으로 다시 빌드**하고, 두 `out/` 을 파서로 비교했다.
`git stash` / `git reset --hard` / `git clean` 은 쓰지 않았다(사용자 미커밋 변경 보호). 비교가 끝난 뒤 worktree 는 제거했다.

§17 대로 "정상적으로 바뀌는 영역"은 분리했다 — Next `buildId`, 청크 파일 해시, `?_rsc=` 쿼리.

## 2. 결과

### 2-1. 메타·스키마·문의 (기존 HTML 1,350개 전수)

| 항목 | 변경된 페이지 수 |
|---|---|
| `<title>` | **0** |
| `<meta name="description">` | **0** |
| `<link rel="canonical">` | **0** |
| `<meta name="robots">` | **0** |
| `h1` | **0** |
| JSON-LD 노드(`@type`+`@id`) | **0** |
| 상담 폼(`form[name=main-apply]`) 수 | **0** |
| 전화 CTA(`a[href^=tel:]`) 수 | **0** |

### 2-2. 본문 텍스트

| 분류 | 페이지 수 | 내용 |
|---|---|---|
| 완전 동일 | 1,101 | — |
| 새 메뉴 라벨만 추가 | 240 | 헤더 서비스 메뉴에 `AI 검색 구조 개선 / 기존 홈페이지를 그대로 개선` 1항목 삽입 (`/h/*` 는 데스크톱·모바일 두 곳) |
| 목적별 랜딩 8종 | 8 | 내비게이션에 `AI 검색 구조 개선·` 삽입(+12자). 삭제된 텍스트 0 |
| `/geo-website/` | 1 | 의도한 문맥 링크 2개 추가(+42자): 제작 유형 카드의 `기존 홈페이지 개선 전용 패키지 보기 →`, 관련 서비스의 `기존 홈페이지 AI 검색 구조 개선` |
| **텍스트가 삭제된 페이지** | **0** | — |

홈(`out/index.html`)과 가이드 인덱스(`out/guide/index.html`)는 **본문 길이까지 1자도 다르지 않다**(각각 10,368자 / 3,538자 동일).

### 2-3. 사이트맵

- BEFORE 791 URL → AFTER 792 URL
- 추가: `https://reumlab.com/ai-search-optimization/` (1건, `sitemap-pages.xml` 에 1회)
- **삭제: 없음**
- `lastmod` 를 전체 갱신하지 않았다. 새 항목만 `lib/ai-search-architecture.ts` 의 git 최종 수정일을 쓴다.
- `__forms.html` 같은 운영 보조 페이지는 사이트맵에 없다(게이트가 검사).

### 2-4. robots·검색봇 정책

`public/robots.txt` **미변경**. 새 페이지 전용 Allow 그룹을 추가하지 않았고, 기존 Disallow(`/*index.txt$`)도 그대로다.
기존에 이미 존재하던 GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / Claude-SearchBot / PerplexityBot 그룹은 손대지 않았다 — AI 검색 대응을 이유로 학습용 봇 정책을 새로 열지 않았다.

### 2-5. 추적·브랜드 자산

- GTM `GTM-WHLMP8ZD`, Meta 픽셀 `1019901144020877` — 새 페이지와 `/geo-website/` 가 동일하고 태그 수도 같다(3). **새 태그를 설치하지 않았다.**
- 로고·파비콘·푸터 사업자 정보 파일 미변경. 새 글로벌 로고를 만들지 않았다.
- 전역 엔티티(`#website`/`#organization`/`#business`) 는 이 페이지에서 **재선언하지 않고 참조만** 한다(게이트가 중복 정의를 실패로 잡는다).

## 3. 기존 상담 폼 회귀

| 경로 | variant | 필드 수 | 새 필드 유입 | 결과 |
|---|---|---|---|---|
| `/geo-website/` | `geo-website` | 27 | 없음 | PASS |
| `/ai-voice-development/` | `ai-voice` | 27 | 없음 | PASS |
| `/l/academy-app-dev/` | `default` | 25 | 없음 | PASS |
| `/ai-search-optimization/` | `ai-search-architecture` | 31 | — | PASS |

새 필드(`현재홈페이지주소` 제외 4종)는 이 페이지에서만 렌더된다. `유입_랜딩` 값도 각 variant 별로 그대로다.

## 4. 남은 제한

- **운영 사이트(https://reumlab.com) 실측은 하지 않았다.** 이 문서의 모든 수치는 로컬 `out/` 산출물 기준이다.
- 배포 후에는 `OWNER_ACTIONS.md` 의 실서버 확인 항목을 따로 수행해야 한다.
