/**
 * 자기잠식(cannibalization) 검사 — 빌드 결과물 기준
 *
 *   node scripts/verify-cannibalization.mjs [outDir]
 *
 * 무엇을 보나
 *  같은 업종 slug 를 여러 축이 공유한다(/app/cafe · /cost/cafe · /solution/cafe · /website/…).
 *  축을 나눈 이유는 검색 의도가 다르기 때문인데, 시간이 지나면 본문이 서로 스며들어
 *  결국 같은 질문에 답하는 페이지 두 개가 된다. 그러면 둘 다 순위가 안 오른다.
 *
 *  이 스크립트는 "선언(코드가 말하는 차이)"과 "실제(렌더된 HTML)"를 대조한다.
 *   1) 같은 업종의 축끼리 title 의 의도 신호가 실제로 다른가
 *   2) 같은 업종의 축끼리 본문이 지나치게 닮지 않았는가 (Jaccard)
 *   3) 색인되는 페이지 전체에서 title 이 사실상 같은 쌍이 있는가
 *
 * 판정
 *  본문 유사도 0.72 이상이면 DIFFERENTIATE(본문을 갈라라) 또는 CONSOLIDATE(합쳐라) 대상으로
 *  보고한다. 자동으로 합치거나 지우지 않는다 — 통합은 백링크·실적을 아는 사람이 정할 일이다.
 *  기본은 리포트이고, --strict 를 주면 임계 초과 시 실패시킨다.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]) || 'out';
const STRICT = process.argv.includes('--strict');
if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}

const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') files.push(p);
  }
})(OUT);

const STOP = new Set([
  '그리고', '하지만', '또한', '있습니다', '합니다', '입니다', '수', '및', '등', '이', '그', '저',
  '름랩', '문의', '상담', '개발', '제작', '가능', '경우', '위해', '통해', '대한', '따라',
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'is', 'are',
]);
const tokenize = (t) => (t.toLowerCase().match(/[a-z0-9]+|[가-힣]+/g) ?? []).filter((x) => x.length >= 2 && !STOP.has(x));
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
};

const pages = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue; // 색인 대상만 본다
  const url = '/' + relative(OUT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() ?? '';
  // 본문만 남긴다 — 스크립트·스타일·푸터/내비 링크 텍스트는 축 구분과 무관하게 같다.
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  const text = main
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<a [^>]*>[\s\S]*?<\/a>/gi, ' ') // 링크 그리드는 축마다 비슷해 유사도를 왜곡한다
    .replace(/<[^>]+>/g, ' ');
  pages.push({ url, title, fp: new Set(tokenize(text)) });
}

/** 업종 slug 를 공유하는 축 그룹 만들기 */
const AXES = [
  { axis: 'app', re: /^\/app\/([^/]+)\/$/, intent: '기능·제작 가능 여부' },
  { axis: 'cost', re: /^\/cost\/([^/]+)\/$/, intent: '비용·견적' },
  { axis: 'solution', re: /^\/solution\/([^/]+)\/$/, intent: '구축 방법' },
  { axis: 'system', re: /^\/system\/([^/]+)\/$/, intent: '기능 시스템 구성' },
  { axis: 'guide', re: /^\/guide\/([^/]+)\/$/, intent: '정보 탐색' },
];

const byIndustry = new Map();
for (const p of pages) {
  for (const a of AXES) {
    const m = p.url.match(a.re);
    if (!m) continue;
    const key = m[1].replace(/-app-guide$/, ''); // 가이드 slug 를 업종 키에 맞춘다
    if (!byIndustry.has(key)) byIndustry.set(key, []);
    byIndustry.get(key).push({ ...p, axis: a.axis, intent: a.intent });
    break;
  }
}

const THRESHOLD = 0.72;
const findings = [];
for (const [key, group] of byIndustry) {
  if (group.length < 2) continue;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const sim = jaccard(group[i].fp, group[j].fp);
      if (sim >= THRESHOLD) {
        findings.push({
          kind: 'body',
          key,
          sim,
          a: group[i],
          b: group[j],
        });
      }
    }
  }
}

// title 이 사실상 같은 쌍 (색인 페이지 전체) — 문형 변형이 실패한 자리를 찾는다
const titleKey = (t) => t.replace(/\s+/g, '').replace(/\|름랩.*$/, '');
const seenTitle = new Map();
const dupTitles = [];
for (const p of pages) {
  const k = titleKey(p.title);
  if (!k) continue;
  if (seenTitle.has(k)) dupTitles.push([seenTitle.get(k), p.url]);
  else seenTitle.set(k, p.url);
}

console.log(`자기잠식 검사: 색인 페이지 ${pages.length}개 · 업종 그룹 ${byIndustry.size}개 · 임계 ${THRESHOLD}`);
console.log(`  축별 검사 대상: ${AXES.map((a) => `${a.axis}(${pages.filter((p) => a.re.test(p.url)).length})`).join(' ')}`);

if (dupTitles.length) {
  console.log(`\n중복 title ${dupTitles.length}쌍:`);
  for (const [a, b] of dupTitles.slice(0, 10)) console.log(`  ${a}  ↔  ${b}`);
}

if (findings.length) {
  console.log(`\n본문 유사도 ${THRESHOLD} 이상 ${findings.length}쌍 — 검토 필요:`);
  for (const f of findings.slice(0, 20)) {
    const verdict = f.sim >= 0.85 ? 'CONSOLIDATE 검토' : 'DIFFERENTIATE 필요';
    console.log(`  [${verdict}] ${f.sim.toFixed(2)}  ${f.a.url} (${f.a.intent})  ↔  ${f.b.url} (${f.b.intent})`);
  }
  if (findings.length > 20) console.log(`  … 외 ${findings.length - 20}쌍`);
} else {
  console.log('\n✓ 같은 업종의 축끼리 본문이 임계 이하로 분리돼 있습니다.');
}

// 상위 유사도(임계 미만이라도) 상위 5쌍은 추이 관찰용으로 보여 준다
const all = [];
for (const [, group] of byIndustry) {
  for (let i = 0; i < group.length; i++)
    for (let j = i + 1; j < group.length; j++) all.push({ sim: jaccard(group[i].fp, group[j].fp), a: group[i], b: group[j] });
}
all.sort((x, y) => y.sim - x.sim);
if (all.length) {
  console.log('\n유사도 상위 5쌍 (추이 관찰용):');
  for (const f of all.slice(0, 5)) console.log(`  ${f.sim.toFixed(2)}  ${f.a.url} ↔ ${f.b.url}`);
}

const fail = dupTitles.length > 0 || (STRICT && findings.length > 0);
if (fail) {
  console.error('\n✖ 자기잠식 검사 실패');
  process.exit(1);
}
console.log('\n✓ 자기잠식 검사 통과');
