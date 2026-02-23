/**
 * Next.js 빌드 전에 public/에서 Next가 생성할 경로 제거 (덮어쓰기 방지)
 * 유지: assets/, og-default.png, *verification*.html, google*.html, naver*.html, consultation/ (Netlify 폼용 정적 HTML)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const removeIfExists = (p) => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true });
    console.log('Removed:', p);
  }
};

removeIfExists(path.join(publicDir, 'index.html'));
// consultation/ 유지 → 정적 export 후 out/에 복사되어 Netlify 폼 페이지로 사용
removeIfExists(path.join(publicDir, 'vvip'));
removeIfExists(path.join(publicDir, 'h'));
removeIfExists(path.join(publicDir, 'l'));
console.log('prepare-next-public: done');
