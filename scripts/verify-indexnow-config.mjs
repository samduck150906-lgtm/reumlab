/** Static IndexNow safety/configuration verifier. It never performs a network request. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const submitPath = join(ROOT, 'scripts', 'submit-indexnow.mjs');
const source = readFileSync(submitPath, 'utf8');
const failures = [];
const warnings = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const key = source.match(/const KEY = ['"]([^'"]+)['"]/)?.[1] ?? '';
check(/^[0-9a-f-]{8,128}$/i.test(key), '키는 8~128자의 16진수/하이픈 형식이어야 한다');

const publicKeyPath = join(ROOT, 'public', `${key}.txt`);
check(existsSync(publicKeyPath), `공개 키 파일이 없다: public/${key}.txt`);
if (existsSync(publicKeyPath)) {
  const content = readFileSync(publicKeyPath, 'utf8');
  check(content.trim() === key && !/[^\r\n]$/.test(content.slice(key.length)), '키 파일 내용은 키(선택적 마지막 줄바꿈만 허용)와 같아야 한다');
}

const outKeyPath = join(ROOT, 'out', `${key}.txt`);
if (existsSync(join(ROOT, 'out'))) {
  check(existsSync(outKeyPath), `빌드 산출물에 키 파일이 없다: out/${key}.txt`);
  if (existsSync(outKeyPath)) check(readFileSync(outKeyPath, 'utf8').trim() === key, 'out 키 파일 내용이 키와 다르다');
} else warnings.push('out/ 없음 — 빌드 산출물 키 복사는 빌드 후 확인 필요');

check(source.includes('https://${host}/indexnow'), 'IndexNow endpoint가 소문자 /indexnow 템플릿이 아니다');
check(source.includes("submitToHost('searchadvisor.naver.com'") && source.includes("submitToHost('www.bing.com'"), 'Naver/Bing 제출 호스트가 모두 고정되어 있지 않다');
check(source.includes("args.has('--dry-run')"), '--dry-run 안전 경로가 없다');
check(source.includes("args.has('--submit')"), '명시적 --submit 게이트가 없다');
check(source.includes("NETLIFY_CONTEXT !== 'production'"), 'preview/branch 제출 차단이 없다');
check(source.includes('if (nextManifest && !submissionFailed)'), '모든 호스트 성공 전 매니페스트 갱신 차단을 확인할 수 없다');
check(source.includes('fs.writeFileSync(MANIFEST_PATH'), '변경 URL 매니페스트 구현이 없다');

const netlify = readFileSync(join(ROOT, 'netlify.toml'), 'utf8');
const globalCommand = netlify.match(/\[build\]([\s\S]*?)(?=\n\[|$)/)?.[1]
  ?.match(/command\s*=\s*"([^"]+)"/)?.[1] ?? '';
const productionCommand = netlify.match(/\[context\.production\]([\s\S]*?)(?=\n\[|$)/)?.[1]
  ?.match(/command\s*=\s*"([^"]+)"/)?.[1] ?? '';
check(globalCommand === 'npm run build', 'preview를 포함한 전역 build 명령에서 외부 제출이 분리되지 않았다');
check(productionCommand.includes('npm run seo:indexnow'), 'production build에만 IndexNow 제출이 연결되어 있지 않다');

console.log(`IndexNow key ${key ? 'O' : 'X'} · public ${existsSync(publicKeyPath) ? 'O' : 'X'} · out ${existsSync(outKeyPath) ? 'O' : 'X'}`);
console.log(`안전장치 dry-run/submit/production/manifest 정적 검사 ${failures.length ? 'X' : 'O'}`);
for (const warning of warnings) console.log(`⚠ ${warning}`);
for (const failure of failures) console.error(`✗ ${failure}`);
if (failures.length) process.exit(1);
console.log('✓ IndexNow 정적 검증 통과 — 외부 전송 없음');
