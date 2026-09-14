/**
 * out/ 정적 서버 — 검증 전용(로컬 전용, 외부 공개 없음).
 *
 *   node tools/home-redesign/serve-out.mjs [dir] [port]
 *
 * Netlify 의 정적 서빙과 같은 조건으로 보기 위해 trailingSlash 디렉터리 인덱스와
 * 404.html 본문만 흉내 낸다. 리다이렉트 규칙(_redirects)은 적용하지 않으므로
 * 리다이렉트 검사는 이 서버 결과로 판정하지 않는다.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const dir = process.argv[2] || 'out';
const port = Number(process.argv[3] || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json',
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let p = join(dir, normalize(url).replace(/^(\.\.[/\\])+/, ''));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) {
    const nf = join(dir, '404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(existsSync(nf) ? readFileSync(nf) : 'Not Found');
    return;
  }
  const type = TYPES[extname(p).toLowerCase()] || 'application/octet-stream';
  const body = readFileSync(p);
  res.writeHead(200, { 'content-type': type, 'content-length': body.length, 'cache-control': 'no-store' });
  res.end(body);
}).listen(port, '127.0.0.1', () => console.log(`serve ${dir} → http://127.0.0.1:${port}/`));
