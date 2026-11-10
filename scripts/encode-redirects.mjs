/**
 * out/_redirects 의 한글(비ASCII) 규칙에 퍼센트 인코딩 쌍둥이 규칙을 붙인다.
 *
 *   node scripts/encode-redirects.mjs [outDir]
 *
 * 왜 필요한가 (2026-11 실측)
 *   Netlify 프로덕션은 요청 경로를 퍼센트 인코딩 상태(%EC%95%B1…)로 규칙과 비교한다.
 *   그래서 `/blog/앱-개발-비용-*` 처럼 원문 한글로 적은 규칙은 한 번도 발동하지 않았고,
 *   삭제한 자동생성 블로그 286건·한글 필러(/앱개발 등)가 301 대신 404 로 응답해
 *   GSC "Not found (404)" 검증이 실패했다. 같은 파일의 ASCII 규칙(/l/web-dev-* 등)은 정상 동작.
 *
 * 하는 일
 *   - public/_redirects 원문은 사람이 읽기 좋게 한글 그대로 둔다(단일 출처).
 *   - 빌드 산출물 out/_redirects 에서 비ASCII 가 든 규칙 바로 뒤에 인코딩 버전을 끼워 넣는다.
 *     (Netlify 는 위에서부터 첫 매칭 규칙을 쓰므로 원래 순서를 그대로 지킨다.)
 *   - 목적지도 인코딩해 Location 헤더에 원문 UTF-8 이 나가지 않게 한다.
 *   - `*`, `:placeholder`, 쿼리 구분자는 encodeURI 가 건드리지 않으므로 그대로 유지된다.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const file = join(OUT, '_redirects');

if (!existsSync(file)) {
  console.warn(`⚠ encode-redirects: ${file} 없음 — 건너뜀`);
  process.exit(0);
}

// eslint-disable-next-line no-control-regex
const NON_ASCII = /[^\x00-\x7F]/;
const enc = (s) => (NON_ASCII.test(s) ? encodeURI(s.normalize('NFC')) : s);

const src = readFileSync(file, 'utf8').split('\n');
const out = [];
const seen = new Set(src.map((l) => l.trim().split(/\s+/)[0]).filter(Boolean));
let added = 0;

for (const line of src) {
  out.push(line);
  const t = line.trim();
  if (!t || t.startsWith('#') || !NON_ASCII.test(t)) continue;

  const parts = t.split(/\s+/);
  if (parts.length < 2) continue;
  const [from, to, ...rest] = parts;
  const encFrom = enc(from);
  const encTo = enc(to);
  if (encFrom === from && encTo === to) continue;
  if (encFrom !== from && seen.has(encFrom)) continue; // 이미 수동으로 넣은 인코딩 규칙
  seen.add(encFrom);
  out.push([encFrom, encTo, ...rest].join('  '));
  added++;
}

writeFileSync(file, out.join('\n'));
console.log(`✓ encode-redirects: 한글 규칙 인코딩 쌍둥이 ${added}개 추가`);
