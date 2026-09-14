# 홈페이지 리디자인 — 작업·검증 산출물

기준 지시서: `01_MASTER_PROMPT_FINAL.md` (FINAL_UNIFIED · 2026-09-14)
작업 브랜치: `claude/homepage-redesign-pid0s4`
기준 커밋: `52b2d55833b55b841345250af5cd590eec44c58f` ("docs: refresh post-deploy NEO audit")

**운영 배포하지 않았습니다.** 이 폴더는 웹으로 서빙되지 않습니다(`out/`에 복사되지 않음).

| 문서 | 내용 |
|---|---|
| [01-baseline.md](./01-baseline.md) | 현황·기준본·변경 전 이슈 |
| [02-references.md](./02-references.md) | 지정 레퍼런스 확인 기록(접근 차단 포함) |
| [03-design-system.md](./03-design-system.md) | 홈 전용 토큰·컴포넌트 규칙 |
| [04-changes.md](./04-changes.md) | 변경 파일과 변경 이유 |
| [05-verification.md](./05-verification.md) | 검사 결과 (PASS/FAIL/NOT RUN/BASELINE ISSUE) |
| [06-baseline-issues.md](./06-baseline-issues.md) | 변경 전부터 있던 문제 · 승인 필요 항목 |
| [07-release-rollback.md](./07-release-rollback.md) | 운영 반영 절차 초안과 롤백 |
| [08-design-review.md](./08-design-review.md) | 실제 캡처 기준 디자인 리뷰 |
| `shots/` | PC·모바일 Before/After 캡처 |
| `evidence/` | 기계 판독용 manifest·diff·성능 원시 결과 |

검사 도구는 `tools/home-redesign/` 에 있습니다. 재현 명령은 `05-verification.md` 참고.
