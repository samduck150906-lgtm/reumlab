# reumlab.netlify.app 배포 (Netlify 프로젝트 reumlab)

**배포 대상:** https://app.netlify.com/projects/reumlab  
**배포 URL:** https://reumlab.netlify.app

---

## 방법 1: 기존 reumlab 프로젝트에 GitHub 연결 후 배포

1. **Netlify reumlab 프로젝트 열기**  
   → https://app.netlify.com/projects/reumlab

2. **저장소 연결**
   - 왼쪽 메뉴 **Site configuration** (또는 **Site settings**)
   - **Build & deploy** → **Continuous deployment**
   - **Link repository** 또는 **Manage repository** 클릭
   - **GitHub** 선택 후 **samduck150906-lgtm/reumlab** 저장소 연결

3. **빌드 설정 확인** (저장소에 `netlify.toml` 있으면 자동 적용)
   - Build command: `npm run build`
   - Publish directory: `public`

4. **배포 실행**
   - **Deploys** 탭으로 이동
   - **Trigger deploy** → **Deploy site** 클릭  
   → 최신 GitHub `main` 브랜치 기준으로 빌드·배포됩니다.

이후에는 `main`에 푸시할 때마다 자동 배포됩니다.

---

## 방법 2: CLI로 reumlab 사이트에 직접 배포

로컬에서 **reumlab** 사이트로 바로 배포하려면:

```bash
# 1) Netlify 로그인 (브라우저 열림, 한 번만 하면 됨)
npx netlify-cli login

# 2) 이 프로젝트를 reumlab 사이트에 연결 (한 번만)
npx netlify-cli link --name reumlab

# 3) 빌드 후 배포
npm run build
npx netlify-cli deploy --prod --dir=public
```

`link` 할 때 목록에서 **reumlab** 사이트를 선택하면 됩니다.

---

## 요약

- **대시보드에서 배포:** https://app.netlify.com/projects/reumlab → **Deploys** → **Trigger deploy**
- **저장소 연결:** 같은 프로젝트의 **Site configuration** → **Build & deploy**에서 **samduck150906-lgtm/reumlab** 연결
