# 2. 지정 레퍼런스 확인 기록

## 결과: 4개 URL 모두 실제 화면을 **열지 못했습니다** — NOT RUN

이 실행 환경의 아웃바운드 HTTPS 는 조직 egress 정책으로 막혀 있습니다.
`reumlab.com` 과 동일하게 프록시가 CONNECT 에 403 을 반환합니다.
프록시 안내(`/root/.ccr/README.md`)가 "정책 거부(403/407)는 우회하지 말고 보고하라"고
지시하므로 재시도·우회하지 않았습니다.

| URL | 확인 시각 | 실제 확인 여부 | 최종 리다이렉트 URL | 내부 캡처 경로 |
|---|---|---|---|---|
| https://www.apple.com/kr/mac/ | — | **미확인 (egress 403)** | 미기록 | 미생성 |
| https://www.apple.com/kr/macbook-air/ | — | **미확인 (egress 403)** | 미기록 | 미생성 |
| https://toss.im/business/pos | — | **미확인 (egress 403)** | 미기록 | 미생성 |
| https://toss.tech/article/toss-design-system | — | **미확인 (egress 403)** | 미기록 | 미생성 |

**확인하지 못한 화면을 보았다고 적지 않습니다.**

## 그래서 무엇을 근거로 작업했는가

지시서 3절은 "핵심 참고 화면에 접근할 수 없으면 미확인 사실을 보고하고, 확인한 자료와
본문의 디자인 원칙으로 작업한다. 레퍼런스 접근 실패와 운영 기준본·로고·필수 검증 실패를
같은 종류의 차단으로 혼동하지 않는다" 고 정합니다. 이에 따라
**지시서와 `02_REFERENCE_GUIDE.md` 에 글로 적힌 원칙만** 적용했습니다.

| 레퍼런스 | 문서에 적힌 원칙 | 름랩 적용 위치 | 가져오지 않은 것 |
|---|---|---|---|
| Apple MacBook Air | 제목과 제품 비주얼의 강약, 적은 색으로 만드는 깊이, 섹션 간 리듬 | Hero: 장식 그라데이션 제거 → 흰 캔버스, 제목·본문·CTA 순으로 강약 | 제품 이미지·카피·전용 폰트·무거운 스크롤 연출 |
| Apple Mac | 명료한 제품군 위계, 비교하기 쉬운 정렬 | 목적 선택 01~07 카드, 가격 8칸 기준선 정렬(featured scale 제거) | 서비스 수 축소·내용 삭제·브랜드 복제 |
| Toss POS | 읽기 쉬운 한글 정보 위계, 분명한 행동 버튼 | `word-break: keep-all` 전면 적용, 본문 16.5~17.5px·행간 1.68~1.7, CTA 위계 | 토스 파란색 리브랜딩·카피 교체·폼 개편 |
| Toss 디자인 시스템 | 일관된 컴포넌트와 상태 | 포커스 링/hover/active 를 홈 전체에서 한 규칙으로 | 비공개 컴포넌트 가정·자산 복제 |

디자인 수치(간격 토큰, 폰트 크기, 10%/0.02 회귀 경고선)는 **이 프로젝트의 제안값**이며
Apple/Toss 의 공식 토큰이 아닙니다.

## 기술 가이드

아래 공식 문서도 같은 이유로 열지 못했습니다(egress 403). 문서에 적힌 수치를 인용하지 않고,
지시서가 정한 판정 기준(대비 4.5:1 / 큰 텍스트 3:1, LCP·CLS·INP 관측 목표)만 사용했습니다.

- developers.google.com/search/docs/appearance/ai-features — 미확인
- developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics — 미확인
- developers.google.com/search/docs/crawling-indexing/block-indexing — 미확인
- developers.google.com/search/docs/appearance/core-web-vitals — 미확인
- w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — 미확인
