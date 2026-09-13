# REUMLAB SEO·AEO·GEO evidence workflow

기준일: 2026-09-13 (Asia/Seoul)

이 디렉터리는 임의의 GEO 점수를 만들지 않고, 사이트 상태와 실제 AI 답변 원문을 다른 증거로 관리한다.

## 상태

- `VERIFIED`: 직접 확인한 코드·빌드·공개 응답이 있음
- `IMPLEMENTED`: 저장소에 수정했음
- `TESTED`: 기록한 명령을 실제 실행했음
- `UNVERIFIED`: 현재 권한·자료로 확인하지 못함
- `BLOCKED`: 외부 권한·공개 동의·원문이 필요함
- `PROPOSED`: 제안만 존재함
- `NOT_RUN`: AI surface 실측을 실행하지 않음

## 핵심 산출물

- `audit-before.md`: 수정 전 코드·빌드·운영 기준선
- `url-inventory.csv`: 정적 빌드의 HTML·redirect 인벤토리
- `claim-ledger.json`: 공개 주장, 근거 수준, 예외
- `query-map.csv`: 비브랜드 질문 40개와 기존 canonical URL 매핑
- `measurement-protocol.md`: 웹서비스·API·일반 검색을 분리하는 실측 규칙
- `measurement-latest.md`: 원문 있는 검토 완료 데이터만 집계한 최신 보고서
- `external-evidence-plan.md`: 코드로 만들 수 없는 외부 근거 확보 절차와 초안
- `qa-after.md`, `release-and-rollback.md`: 검증·배포·롤백 기록

## 재실행

```bash
npm run build
npm run geo:inventory
npm run geo:audit
npm test
npm run typecheck

# 수동 캡처 CSV/JSONL을 비공개 데이터로 가져오기
npm run geo:measure:import -- --input tools/geo/manual-import-template.csv
npm run geo:measure:validate -- .geo-measurements/runs.jsonl
npm run geo:measure:report

# 동일 조건의 전/후 JSONL 비교
npm run geo:measure:compare -- before.jsonl after.jsonl
```

`.geo-measurements/`의 원문·캡처·정규화 데이터는 Git과 Netlify 정적 배포에서 제외된다.
