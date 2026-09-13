# 배포와 롤백

## 배포 전 필수 조건

- 기준 커밋: `24cb613fe2bcd41b74a7d3f8ef389d09486917c6`
- `npm test`, `npm run typecheck`, `npm run build`, `npm run geo:audit` 통과
- 보호 URL와 `/l/mvp-dev-cost/` redirect 비교
- robots·canonical·sitemap diff에 의도하지 않은 변화가 없는지 확인
- 문의 폼 필드·성공 이벤트 구조 회귀 검사
- 비공개 `.geo-measurements/`가 Git·`out/`에 포함되지 않는지 확인

## 현재 배포 상태

`PUSHED / PREVIEW_DEPLOYED / PRODUCTION_AUTO_DEPLOYED`

- `npm test` 32/32, typecheck, production build, GEO·전환·가격·포트폴리오 검증 통과
- 로컬 브라우저에서 홈·GEO 서비스·소스코드 이관·404·문의 폼 검증 완료
- 기존 운영 배포의 보호 redirect 4개는 각각 단일 301 후 200·self-canonical 확인
- 변경 커밋 `6850fe6bc022bac5118e3f580e1dca050a975671`을 `origin/main`에 푸시함
- Netlify draft deploy ID: `6aa605a2aebd83a604d672fe`
- 프리뷰 URL: `https://6aa605a2aebd83a604d672fe--reumlab.netlify.app`
- 배포 로그: `https://app.netlify.com/projects/reumlab/deploys/6aa605a2aebd83a604d672fe`
- 검증된 `out/`만 `--no-build`로 프리뷰에 올렸으며 CLI `--prod`는 사용하지 않음
- `main` 푸시가 Netlify Git 자동배포를 별도로 트리거해 운영 배포 ID `6aa60537c9d46f0008ad26e7`이 생성됨
- 운영 배포는 `production / main / 6850fe6bc022bac5118e3f580e1dca050a975671 / ready`이며 오류 메시지가 없음
- 첫 업로드 시도는 CLI가 로컬 production build를 자동 실행해 IndexNow 단계에서 중단됐다. Naver와 Bing 요청은 모두 `fetch failed`였고 스크립트가 매니페스트를 갱신하지 않았으므로 성공 전송으로 집계하지 않는다.
- 운영 Git 빌드에는 `npm run seo:indexnow`가 포함된다. 로컬 dry-run상 변경 대상은 26개지만 운영 로그의 호스트별 HTTP 응답을 직접 대조하지 않았으므로 이 문서에서 전송 성공 건수는 확정하지 않는다.

## 롤백 원칙

다른 사용자 변경을 덮어쓰지 않는 새 revert 커밋으로 이번 변경만 되돌린다. `git reset --hard`나 force push를 사용하지 않는다.

```bash
git revert <this-change-commit>
git push origin main
```

Netlify에서 즉시 장애가 확인되면 직전 정상 배포를 다시 publish할 수 있지만, 저장소와 배포가 엇갈리지 않도록 반드시 이후 revert 커밋을 남긴다.

## 즉시 롤백 조건

- 주요 URL이 4xx/5xx로 변함
- 색인 대상에 의도하지 않은 noindex·차단이 추가됨
- canonical이 홈이나 다른 서비스로 변함
- 문의 폼 제출 장애나 성공 이벤트 중복
- 핵심 콘텐츠, 익명/목업 고지, NAP 누락
- 실측 원문·개인정보·비밀값의 공개 배포
