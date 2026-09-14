# 홈 전용 디자인 시스템

적용 위치: `styles.css` 맨 끝의 `HOME REDESIGN` 블록.
**모든 선택자가 `body[data-page-type="home"]` 아래에만 있습니다.**

## 왜 이 스코프인가

`styles.css` 는 홈 전용 파일이 아닙니다. 목적별 랜딩 8개(`/mvp/`, `/erp/`, `/ai-automation/`,
`/platform/`, `/reservation-commerce/`, `/website/`, `/data-seo/`, `/service-renewal/`)가
`scripts/generate-purpose-landings.mjs:976` 에서 같은 파일을 불러 쓰고,
`.hero` `.btn` `.sec-title` `.section` 같은 클래스를 그대로 공유합니다.
스코프 없는 선언을 추가하면 랜딩 8개가 같이 바뀝니다.

`body[data-page-type="home"]` 는 이 저장소에 이미 있는 구분자입니다.

| 페이지 | `<body>` |
|---|---|
| 홈 `/` | `data-page-type="home"` |
| 목적별 랜딩 8개 | `data-page-type="service"` |
| Next app router 페이지 1,340개 | 속성 없음(그리고 `styles.css` 를 아예 로드하지 않음) |

새 속성(`data-reumlab-home-redesign`)을 추가하는 대신 기존 구분자를 쓴 이유:
**`index.html` 을 한 글자도 고치지 않기 위해서**입니다. HTML 이 바이트 단위로 같으면
콘텐츠·링크·메타·구조화데이터·로고 마크업 보존이 검사가 아니라 구성으로 보장됩니다.

`script.js` 는 건드리지 않았습니다.

## 토큰 (홈 루트에만 선언, `:root` 를 덮지 않음)

```
간격   --h-sp-1..11 = 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 120
radius --h-r-s 12px(버튼·칩) · --h-r-m 20px(카드) · --h-r-l 28px(큰 패널)
면     --h-line rgba(11,27,51,.10) · --h-line-soft rgba(11,27,51,.07)
       --h-elev-1 (1px + 2px) · --h-elev-2 (2px + 12px 28px)
모션   --h-dur-tap 140ms · --h-dur-panel 240ms · --h-ease cubic-bezier(.2,.7,.3,1)
```

기존 브랜드 색(`--accent #285edb`, `--navy #0a1830`, `--ink` 계열)은 그대로 씁니다.
새 색을 만들지 않았습니다. 새 폰트도 도입하지 않았습니다(Pretendard 유지).

## 타이포그래피

| 항목 | 데스크톱 | 모바일 | 지시서 권장 범위 |
|---|---|---|---|
| Hero H1 | `clamp(42px, 4.7vw, 64px)` (1280px 에서 60px) | `clamp(34px, 10.2vw, 44px)` | 56~72 / 34~44 |
| 섹션 제목 `.sec-title` | `clamp(28px, 3.44vw, 44px)` (1280px 에서 44px) | 28px | 36~48 / 26~32 |
| 본문 `.sec-sub` | 17.5px / line-height 1.7 | 16.5px / 1.68 | 16~18 / 1.55~1.75 |
| 최대 폭 | `--maxw` 1180px (기존값 유지) | — | 1120~1200 |

Hero H1 은 기존 값이 이미 권장 범위 안이라 크기를 바꾸지 않고 줄바꿈만 손봤습니다.

### 한글 줄바꿈

홈의 제목·본문·목록·버튼·표에 `word-break: keep-all` + `overflow-wrap: break-word` 를 함께 겁니다.
`keep-all` 만 쓰면 좁은 칼럼에서 긴 어절이 넘치므로, 한 줄에 도저히 못 들어갈 때만 끊기게 둡니다.
제목에는 `text-wrap: balance`, 본문에는 `text-wrap: pretty` 를 씁니다.

## 레이아웃 리듬

| 구간 | 값 |
|---|---|
| 섹션 상하 여백 | 데스크톱 96px · ~1080px 80px · ~720px 64px |
| 섹션 머리 아래 | 48px (모바일 32px) |
| 흰 섹션이 연달아 올 때 | 1px `--h-line-soft` 경계선 하나 |
| `.section--soft` | `#f6f8fc` |

카드는 그림자를 줄이고(`--h-elev-1`) 경계선과 간격으로 나눕니다.
`.price-card.featured` 의 `scale(1.025)` 와 카드 hover 의 `translateY(-5px)` 는 없앴습니다 —
가격표 8칸의 기준선이 어긋나 보이던 원인입니다.

## 상태

- 모든 조작 요소에 같은 포커스 링: `outline: 3px solid rgba(40,94,219,.55)` / `offset 2px`
- 버튼 hover 는 이동(`translateY`) 대신 배경색 변화만 — 140ms
- 보조 전환 240ms
- `prefers-reduced-motion: reduce` 에서 홈 전체 애니메이션·트랜지션 제거
- `.pf-filter__btn` 최소 높이 42px → 44px
- `.faq-q` 최소 높이 64px

## 레퍼런스에서 가져온 것 / 가져오지 않은 것

| 레퍼런스 | 가져온 원칙 | 적용 위치 | 가져오지 않은 것 |
|---|---|---|---|
| Apple MacBook Air | 제목과 제품 비주얼의 강약, 적은 색으로 만드는 깊이 | Hero(장식 그라데이션 제거, 흰 캔버스) | 제품 이미지·카피·전용 폰트·스크롤 연출 |
| Apple Mac | 선택지를 비교하기 쉬운 정렬 | 목적 선택 카드, 가격 8칸 기준선 정렬 | 서비스 수 축소·내용 삭제 |
| Toss POS | 읽기 쉬운 한글 위계 | `keep-all` 줄바꿈, 본문 크기·행간, 섹션 머리 | 토스 색으로 리브랜딩·카피 교체 |
| Toss 디자인 시스템 | 컴포넌트 상태의 일관성 | 포커스 링·hover·active 통일 | 비공개 컴포넌트 가정 |

Apple·Toss 의 로고·폰트·이미지·코드는 복제하지 않았고, 두 회사를 름랩의 고객·파트너처럼
표시하지도 않았습니다. 레퍼런스 화면 실사 확인 여부는 `02-references.md` 참고.
