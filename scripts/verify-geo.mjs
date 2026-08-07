/**
 * AI 검색 / GEO 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:geo
 *   node scripts/verify-geo.mjs [outDir]
 *
 * 검사 항목
 *   1. AI 안내 파일 응답 — llms.txt / llms-full.txt 존재·인코딩·robots 차단 여부
 *   2. 사업 설명 일관성 — Organization·ProfessionalService·llms.txt·llms-full.txt 의
 *      "름랩은 무엇인가" 문장이 전부 같은가
 *   3. 링크 실재성 — 두 파일 안의 모든 reumlab.com URL 이 산출물에 실제로 있는가
 *   4. 사실 검증 — 근거 없는 신뢰 신호(업계 1위·100% 등)와 지어낸 수치가 없는가
 *   5. AI 질문 커버리지 — "AI 가 이 사이트를 읽고 답할 수 있어야 하는 질문" 13개가
 *      llms.txt / llms-full.txt / 홈 중 어디에서든 답해지는가
 *   6. 사람이 보는 콘텐츠와의 동기화 — llms-full.txt 의 FAQ 가 실제 페이지에도 있는가
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
const ORIGIN = 'https://reumlab.com';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);

// ─── 1. 파일 존재
const files = {};
for (const name of ['llms.txt', 'llms-full.txt']) {
  const p = join(OUT, name);
  if (!existsSync(p)) {
    add(fail, 'missing', `/${name} 없음`);
    continue;
  }
  const buf = readFileSync(p);
  files[name] = buf.toString('utf8');
  if (buf[0] === 0x1f && buf[1] === 0x8b) add(fail, 'encoding', `/${name} 이 gzip 바이너리`);
  if (!files[name].trim()) add(fail, 'empty', `/${name} 이 비어 있음`);
}

// robots 가 막고 있지 않은지 (와일드카드 패턴 매칭)
const robotsPath = join(OUT, 'robots.txt');
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  const toRe = (rule) => {
    let re = '^' + rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    if (re.endsWith('\\$')) re = re.slice(0, -2) + '$';
    return new RegExp(re);
  };
  const dis = [...robots.matchAll(/^Disallow:\s*(\S+)\s*$/gim)].map((m) => toRe(m[1]));
  for (const name of Object.keys(files)) {
    if (dis.some((r) => r.test('/' + name))) add(fail, 'robots', `robots.txt 가 /${name} 을 차단`);
  }
  const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot'];
  for (const b of AI_BOTS) {
    if (!new RegExp(`^User-Agent:\\s*${b}\\s*$`, 'im').test(robots)) {
      add(warn, 'robots', `robots.txt 에 ${b} 명시 그룹 없음(와일드카드로는 허용됨)`);
    }
  }
} else {
  add(fail, 'missing', 'robots.txt 없음');
}

// ─── 2. 사업 설명 일관성
const LD = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
function nodeById(file, suffix) {
  const h = readFileSync(file, 'utf8');
  let m;
  LD.lastIndex = 0;
  while ((m = LD.exec(h))) {
    let d;
    try {
      d = JSON.parse(m[1]);
    } catch {
      continue;
    }
    for (const n of d['@graph'] ?? [d]) if (n['@id']?.endsWith(suffix)) return n;
  }
  return null;
}
const descs = new Map();
for (const [label, file, suffix] of [
  ['index.html #organization', join(OUT, 'index.html'), '#organization'],
  ['index.html #business', join(OUT, 'index.html'), '#business'],
  ['Next #organization', join(OUT, 'source-handover', 'index.html'), '#organization'],
  ['Next #business', join(OUT, 'source-handover', 'index.html'), '#business'],
  ['purpose landing #business', join(OUT, 'erp', 'index.html'), '#business'],
]) {
  if (!existsSync(file)) continue;
  const n = nodeById(file, suffix);
  if (!n?.description) add(fail, 'description', `${label} 에 description 없음`);
  else descs.set(label, n.description);
}
for (const [name, txt] of Object.entries(files)) {
  const quote = txt.split('\n').find((l) => l.startsWith('> '));
  if (quote) descs.set(`/${name} 요약`, quote.slice(2).trim());
  else add(fail, 'description', `/${name} 에 요약 문장(> …) 없음`);
}
const uniq = new Set(descs.values());
if (uniq.size > 1) {
  add(fail, 'description', `사업 설명이 ${uniq.size}가지로 갈림`);
  for (const [k, v] of descs) console.log(`    · ${k}: ${v.slice(0, 60)}…`);
}

// ─── 3. 링크 실재성
const urlExists = (u) => {
  let path;
  try {
    path = decodeURIComponent(new URL(u).pathname);
  } catch {
    return false;
  }
  const rel = path.replace(/^\//, '');
  if (!rel) return existsSync(join(OUT, 'index.html'));
  return [join(OUT, rel, 'index.html'), join(OUT, rel)].some((c) => existsSync(c) && statSync(c).isFile());
};
for (const [name, txt] of Object.entries(files)) {
  const urls = [...new Set((txt.match(/https:\/\/reumlab\.com[^\s)\]<>"',]*/g) || []).map((u) => u.replace(/[.,)]+$/, '')))];
  const dead = urls.filter((u) => !urlExists(u));
  for (const d of dead) add(fail, '404', `/${name} 안의 존재하지 않는 URL: ${d}`);
  console.log(`/${name}: URL ${urls.length}개 (없는 링크 ${dead.length})`);
}

// ─── 4. 사실 검증 — 근거 없는 신뢰 신호
const BANNED = [
  [/업계\s*(1위|최고|선두)/, '업계 1위/최고 주장'],
  [/100\s*%\s*(성공|정확|만족)/, '100% 성공·정확·만족 주장'],
  [/국내\s*최대/, '국내 최대 주장'],
  [/수상|어워드\s*수상/, '수상 이력 주장'],
  [/고객\s*\d{2,}\s*(개사|곳|명)\s*(이상|돌파)/, '고객 수 주장'],
  [/프로젝트\s*\d{2,}\s*(건|개)\s*(이상|완료)/, '프로젝트 수 주장'],
  [/완전\s*자동화|사람이\s*필요\s*없/, 'AI 완전 자동화 과장'],
];
/** 부정문("…없습니다", "…포함하지 않습니다", "보장하지 않습니다")은 주장이 아니다 */
const NEGATED = /(없|않|아닙|미보유|보유하고 있지)/;
for (const [name, txt] of Object.entries(files)) {
  for (const line of txt.split('\n')) {
    for (const [re, label] of BANNED) {
      const hit = line.match(re);
      if (hit && !NEGATED.test(line)) {
        add(fail, 'claim', `/${name} 에 근거 없는 주장(${label}): "${line.trim().slice(0, 70)}"`);
      }
    }
  }
}

// ─── 5. AI 질문 커버리지
const CORPUS = Object.values(files).join('\n') + '\n' + (existsSync(join(OUT, 'index.html')) ? readFileSync(join(OUT, 'index.html'), 'utf8') : '');
const QUESTIONS = [
  ['어떤 회사인가', /개발 스튜디오/],
  ['앱 개발을 하는가', /Flutter|앱 개발|앱개발/],
  ['웹 개발을 하는가', /웹사이트|홈페이지|랜딩페이지/],
  ['MVP 개발을 하는가', /MVP/],
  ['ERP·관리자 시스템을 개발하는가', /ERP|관리자 페이지|업무 시스템/],
  ['AI 자동화를 하는가', /AI (챗봇|업무 자동화|자동화)/],
  ['어떤 기술을 쓰는가', /Flutter|Next\.js/],
  ['무엇을 인계하는가', /소스코드[^.]{0,20}이관|운영 권한/],
  ['유지보수가 되는가', /유지보수/],
  ['가격이 공개되어 있는가', /VAT 포함|정액/],
  ['어느 지역인가', /동탄|화성|수원/],
  ['비대면이 가능한가', /비대면/],
  ['문의 방법이 있는가', /010-8111-9370|ceo@eternalsix\.com|카카오톡/],
];
const missing = QUESTIONS.filter(([, re]) => !re.test(CORPUS));
console.log(`\nAI 질문 커버리지: ${QUESTIONS.length - missing.length}/${QUESTIONS.length}`);
for (const [q] of missing) add(fail, 'coverage', `AI 안내 문서에서 답할 수 없음: ${q}`);

// ─── 6. 사람이 보는 콘텐츠와 동기화
if (files['llms-full.txt']) {
  const norm = (s) => s.replace(/[\s.,·…"'"'()]/g, '');
  const strip = (h) =>
    h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ');
  const pageCache = new Map();
  const sections = files['llms-full.txt'].split(/^### /m).slice(1);
  let checked = 0;
  for (const sec of sections) {
    const url = (sec.match(/URL: (\S+)/) || [])[1];
    if (!url) continue;
    const rel = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
    const file = join(OUT, rel, 'index.html');
    if (!existsSync(file)) {
      add(fail, '404', `llms-full.txt 의 페이지가 없음: ${url}`);
      continue;
    }
    if (!pageCache.has(file)) pageCache.set(file, norm(strip(readFileSync(file, 'utf8'))));
    const page = pageCache.get(file);
    for (const line of sec.split('\n')) {
      const faq = line.match(/^- \*\*(.+?)\*\* (.+)$/);
      if (!faq) continue;
      checked++;
      if (!page.includes(norm(faq[1]))) add(fail, 'sync', `llms-full.txt 의 FAQ 가 화면에 없음: ${url} — ${faq[1].slice(0, 34)}`);
    }
  }
  console.log(`llms-full.txt ↔ 화면 FAQ 대조: ${checked}건`);
}

console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 10).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 25).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ GEO 검증 통과 — 사업 설명 일관·링크 실재·근거 없는 주장 없음·화면 동기화 정상');
