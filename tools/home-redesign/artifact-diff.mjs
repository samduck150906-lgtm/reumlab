/**
 * 산출물 diff — 빌드 비결정 값을 제외하고 "실제로 달라진 파일"만 센다.
 *
 *   node tools/home-redesign/artifact-diff.mjs <beforeOutDir> <afterOutDir> [--out diff.json]
 *
 * Next 정적 export 는 빌드마다 build ID(예: ImbvJ37rF_entoybQCQFg)가 바뀌고,
 * 그 값이 모든 페이지 HTML과 청크 파일명에 박힌다. 같은 소스로 두 번 빌드해도
 * 1,300개 넘는 파일이 "다름"으로 나온다(대조군으로 확인).
 * 여기서는 build ID 토큰만 자리표시자로 치환해 비교한다 — 다른 값은 그대로 둔다.
 */
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const [A, B] = process.argv.slice(2);
const outPath = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (!A || !B) { console.error('사용법: artifact-diff.mjs <before out/> <after out/> [--out diff.json]'); process.exit(1); }

/** out/_next/static/<buildId> 에서 build ID 를 읽는다 */
function buildId(dir) {
  const p = join(dir, '_next', 'static');
  if (!existsSync(p)) return null;
  const cands = readdirSync(p).filter((n) => !['chunks', 'css', 'media'].includes(n) && statSync(join(p, n)).isDirectory());
  return cands[0] ?? null;
}
const idA = buildId(A), idB = buildId(B);

/** 빌드마다 이름이 바뀌는 청크 파일명 패턴 */
const CHUNK_RE = /(page|not-found|layout|error)-[0-9a-f]{16}\.js/g;

function walk(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, base, acc);
    else acc.push(relative(base, p));
  }
  return acc;
}

const TEXT = /\.(html|txt|css|js|json|xml|webmanifest|md)$/i;

function normalizedHash(dir, rel, id, otherId) {
  const p = join(dir, rel);
  const buf = readFileSync(p);
  if (!TEXT.test(rel)) return createHash('sha256').update(buf).digest('hex');
  let s = buf.toString('utf8');
  if (id) s = s.split(id).join('__NEXT_BUILD_ID__');
  s = s.replace(CHUNK_RE, '$1-__CHUNK_HASH__.js');
  return createHash('sha256').update(s).digest('hex');
}

/** _next/ 아래 해시 파일명은 경로 자체가 비결정적이므로 경로도 정규화한다 */
function normPath(rel, id) {
  let r = rel.split('\\').join('/');
  if (id) r = r.split(id).join('__NEXT_BUILD_ID__');
  return r.replace(CHUNK_RE, '$1-__CHUNK_HASH__.js');
}

const filesA = new Map();
for (const rel of walk(A)) filesA.set(normPath(rel, idA), rel);
const filesB = new Map();
for (const rel of walk(B)) filesB.set(normPath(rel, idB), rel);

const onlyBefore = [...filesA.keys()].filter((k) => !filesB.has(k)).sort();
const onlyAfter = [...filesB.keys()].filter((k) => !filesA.has(k)).sort();
const both = [...filesA.keys()].filter((k) => filesB.has(k)).sort();

const changed = [];
for (const k of both) {
  const ha = normalizedHash(A, filesA.get(k), idA, idB);
  const hb = normalizedHash(B, filesB.get(k), idB, idA);
  if (ha !== hb) changed.push({ path: k, beforeSha256: ha, afterSha256: hb,
    beforeBytes: statSync(join(A, filesA.get(k))).size, afterBytes: statSync(join(B, filesB.get(k))).size });
}

const result = {
  beforeDir: A, afterDir: B, beforeBuildId: idA, afterBuildId: idB,
  totalFiles: { before: filesA.size, after: filesB.size },
  changedCount: changed.length, onlyBeforeCount: onlyBefore.length, onlyAfterCount: onlyAfter.length,
  changed, onlyBefore: onlyBefore.slice(0, 200), onlyAfter: onlyAfter.slice(0, 200),
};
if (outPath) writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

console.log(`파일 수: before ${filesA.size} / after ${filesB.size}  (build ID ${idA} → ${idB}, 비교 시 자리표시자로 치환)`);
console.log(`내용이 달라진 파일: ${changed.length}개`);
for (const c of changed) console.log(`  · ${c.path}  ${c.beforeBytes} → ${c.afterBytes} bytes`);
console.log(`before 에만 있는 경로: ${onlyBefore.length}개${onlyBefore.length ? ' → ' + onlyBefore.slice(0, 10).join(', ') : ''}`);
console.log(`after 에만 있는 경로: ${onlyAfter.length}개${onlyAfter.length ? ' → ' + onlyAfter.slice(0, 10).join(', ') : ''}`);
if (outPath) console.log(`기계 판독용: ${outPath}`);
