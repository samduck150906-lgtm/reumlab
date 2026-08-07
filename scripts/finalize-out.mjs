/**
 * 빌드 산출물 마무리 정리 (next build 이후 실행)
 *
 *   node scripts/finalize-out.mjs [outDir]
 *
 * 배포 직전에 out/ 에서 "있으면 안 되는 것"만 걷어낸다.
 * 페이지를 새로 만들거나 내용을 고치지 않는다 — 삭제만 한다.
 */
import { existsSync, rmSync, readdirSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const removed = [];

/**
 * out/404/index.html 제거.
 *
 * trailingSlash: true + 정적 export 조합에서 Next 는 404 문서를 두 벌 만든다.
 *   out/404.html        ← Netlify 가 404 응답 본문으로 쓰는 파일 (상태코드 404)
 *   out/404/index.html  ← /404/ 주소로 200 을 반환하는 실제 페이지
 * 뒤엣것 때문에 /404/ 가 "없음을 알리는 내용인데 200" 인 soft 404 가 된다.
 * meta robots noindex 로 색인은 막고 있지만, 구글은 없는 페이지에는 404 상태를
 * 돌려주라고 권고한다. 어디에서도 링크되지 않는 주소라 지워도 안전하다.
 */
const dir404 = join(OUT, '404');
const file404 = join(dir404, 'index.html');
if (existsSync(file404)) {
  rmSync(file404);
  removed.push('/404/index.html');
  // 남은 파일(RSC 페이로드 등)까지 비면 디렉터리도 정리
  if (existsSync(dir404)) {
    for (const e of readdirSync(dir404)) rmSync(join(dir404, e), { recursive: true });
    try {
      rmdirSync(dir404);
    } catch {
      /* 비어 있지 않으면 그대로 둔다 */
    }
  }
}

if (!existsSync(join(OUT, '404.html'))) {
  console.warn('⚠ finalize-out: out/404.html 이 없습니다 — Netlify 404 응답 본문이 사라집니다.');
}

console.log(
  removed.length
    ? `✓ finalize-out: ${removed.length}개 제거 (${removed.join(', ')})`
    : '✓ finalize-out: 제거할 항목 없음',
);
