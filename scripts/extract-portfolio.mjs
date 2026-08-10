/**
 * 포트폴리오 데이터 추출 (prebuild 단계)
 *
 *   node scripts/extract-portfolio.mjs
 *   script.js 의 PROJECTS → content/portfolio.json
 *
 * 왜 추출하나
 *  포트폴리오 15건의 단일 출처는 `script.js` 의 `var PROJECTS = [...]` 다.
 *  이 파일은 정적 홈(index.html)이 브라우저에서 직접 읽는 스크립트라 그대로 두어야 하고,
 *  Next 라우트에서는 import 할 수 없다(모듈이 아니라 IIFE 안의 지역 변수).
 *  → 빌드 전에 한 번 꺼내 content/portfolio.json 으로 만들고, lib/portfolio.ts 가 그걸 읽는다.
 *    content/landings.json 과 같은 방식이다.
 *
 * ⚠️ 데이터를 이 파일이나 lib/portfolio.ts 에 복제하지 말 것.
 *    사례 내용을 고치려면 script.js 의 PROJECTS 만 고치면 홈·상세 페이지·사이트맵이 함께 따라간다.
 *
 * 없는 정보를 만들지 않는다 — 이 스크립트는 필드를 옮기기만 하고 어떤 값도 생성하지 않는다.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'script.js';
const OUT_DIR = 'content';
const OUT = join(OUT_DIR, 'portfolio.json');

/** script.js 안의 `var PROJECTS = [...]` 배열 리터럴을 균형 잡힌 괄호로 잘라내 평가 */
function extractProjects(src) {
  const start = src.indexOf('var PROJECTS = [');
  if (start === -1) throw new Error('script.js 에서 PROJECTS 배열을 찾지 못했습니다.');
  const open = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']' && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end === -1) throw new Error('PROJECTS 배열의 끝을 찾지 못했습니다.');
  // 우리 저장소의 자체 소스만 평가한다(외부 입력 없음).
  return new Function(`return ${src.slice(open, end + 1)};`)();
}

const REQUIRED = ['id', 'cat', 'chip', 'shot', 'title', 'problem', 'features', 'scope', 'detail'];
const REQUIRED_DETAIL = ['overview', 'problemDetail', 'structure', 'userFlow', 'operator', 'tech', 'deliverables'];

const projects = extractProjects(readFileSync(SRC, 'utf8'));
const seen = new Set();
for (const p of projects) {
  for (const k of REQUIRED) {
    if (p[k] === undefined) throw new Error(`[${p.id}] 필수 필드 누락: ${k}`);
  }
  for (const k of REQUIRED_DETAIL) {
    if (p.detail[k] === undefined) throw new Error(`[${p.id}] detail 필수 필드 누락: ${k}`);
  }
  if (!/^[a-z0-9-]+$/.test(p.id)) throw new Error(`[${p.id}] id 는 URL slug 로 쓰이므로 소문자·숫자·하이픈만 허용`);
  if (seen.has(p.id)) throw new Error(`중복 id: ${p.id}`);
  seen.add(p.id);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(projects, null, 2) + '\n', 'utf8');
console.log(`Generated portfolio.json: ${projects.length}`);
