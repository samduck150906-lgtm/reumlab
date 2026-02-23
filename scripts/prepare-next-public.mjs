/**
 * Next.js 빌드 전에 public/에서 Next가 생성할 경로 제거 (덮어쓰기 방지)
 * 유지: assets/, og-default.png, *verification*.html, google*.html, naver*.html
 * consultation/ 제거 → app/consultation/ (Next+Netlify 폼) 사용
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
removeIfExists(path.join(publicDir, 'consultation'));
removeIfExists(path.join(publicDir, 'vvip'));
removeIfExists(path.join(publicDir, 'h'));
removeIfExists(path.join(publicDir, 'l'));
console.log('prepare-next-public: done');
