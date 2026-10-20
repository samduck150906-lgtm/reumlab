import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parse } from 'node-html-parser';
import { fiveGrams, jaccard, gramPostings, exactOverlaps, sentenceUnits, visibleMain, validDate, readSitemapTree, verify } from './verify.mts';
import type { AgencyPage } from '../../lib/development-agency/types';
import { agencyHref } from '../../lib/development-agency/types';

const ORIGIN = 'https://reumlab.com';
const fields = ['audience','actualProblems','userRoles','workflows','coreFeatures','adminFeatures','integrations','dataEntities','edgeCases','mvpScope','expansionScope','costDrivers','timelineDrivers','complianceChecks','handover'] as const;
const escape = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
test('inverted intersection index is exactly equal to brute-force Jaccard for sparse, empty and near-copy sets',()=>{
  const sets = [new Set<string>(),new Set(['a','b','c']),new Set(['a','b','c','d']),new Set(['z'])];
  for(let i=0;i<80;i++) sets.push(new Set(Array.from({length:300},(_,j)=>String((i*37+j*j+17*j)%1013))));
  const index=gramPostings(sets);
  for(let i=0;i<sets.length;i++) {
    const overlap=exactOverlaps(sets[i],index,sets.length);
    for(let j=0;j<sets.length;j++) {
      const union=sets[i].size+sets[j].size-overlap[j];
      assert.equal(union?overlap[j]/union:1,jaccard(sets[i],sets[j]),`${i}:${j}`);
    }
  }
});
function fixtureText(seed: number, length: number) {
  let state = seed;
  return Array.from({length}, () => { state = (Math.imul(state,1664525)+1013904223)>>>0; return String.fromCharCode(0xac00+state%11172); }).join('');
}
function makePage(slug: string, seed: number): AgencyPage {
  const values = Object.fromEntries(fields.map((field,i) => [field,[fixtureText(seed+i+1,280)+'.']]));
  return {
    ...values, slug, clusterIds:[`fixture-${seed}`], primaryKeyword:`검수 자료 ${seed}`, keywordVariants:[`검수 문서 ${seed}`],
    searchIntent:`서로 다른 검수 절차 ${seed}`, industry:`검증 업종 ${seed}`, serviceAxis:'fixture',
    title:`검수 자료 ${seed} | 름랩`, description:`개별 데이터 및 검수 요구 ${seed}`, h1:`검수 조건 ${seed}`,
    summary:fixtureText(seed+90,100)+'.', updatedAt:'2026-01-01',
    sections:Array.from({length:12},(_,i)=>({id:`section-${i}`,heading:`단계별 검수 항목 ${i}`,fields:i<3?[fields[i],fields[i+12]]:[fields[i]]})),
    faq:Array.from({length:6},(_,i)=>({question:`검증 자료 ${seed}의 질문 ${i}은 무엇입니까?`,answer:fixtureText(seed+100+i,80)+'.'})),
    relatedRoutes:[{href:slug?'/development-agency/':'/development-agency/detail/',label:'다른 검수',reason:'별도의 과정 비교'}],
    ctaContext:fixtureText(seed+200,90)+'.',
    evidenceSources:[{title:'공식 검증 자료',url:'https://example.com/',use:'테스트용 자료'}],
  } as AgencyPage;
}
function render(page: AgencyPage) {
  const url = ORIGIN+agencyHref(page);
  const graph = [
    {'@type':'Organization','@id':ORIGIN+'/#organization'},
    {'@type':'WebPage',url},
    {'@type':'Service',url,provider:{'@id':ORIGIN+'/#organization'}},
    {'@type':'BreadcrumbList',itemListElement:[{item:ORIGIN+'/'},{item:url}]},
    {'@type':'FAQPage',mainEntity:page.faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
  ];
  return `<html lang="ko"><head><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${url}"><meta name="robots" content="index, follow">`
    + ['type','locale','site_name','url','title','description','image'].map(key=>`<meta property="og:${key}" content="${key==='url'?url:key==='locale'?'ko_KR':'fixture'}">`).join('')
    + ['card','title','description','image'].map(key=>`<meta name="twitter:${key}" content="fixture">`).join('')
    + `</head><body><script type="application/ld+json">${JSON.stringify({'@graph':graph})}</script><main><h1>${escape(page.h1)}</h1><p>${page.summary}</p>`
    + page.sections.map(section=>`<section id="${section.id}"><h2>${section.heading}</h2>${section.fields.flatMap(field=>page[field]).map(text=>`<p>${text}</p>`).join('')}</section>`).join('')
    + '<section><h2>자주 묻는 질문</h2>'+page.faq.map(item=>`<details><summary>${item.question}</summary><p>${item.answer}</p></details>`).join('')+'</section>'
    + page.relatedRoutes.map(link=>`<a href="${link.href}">${link.label}</a>`).join('')
    + `<p>${page.ctaContext}</p></main></body></html>`;
}
function sitemap(urls: string[]) {
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    + urls.map(url=>`<url><loc>${url}</loc><lastmod>2026-01-01</lastmod></url>`).join('')+'</urlset>';
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'reumlab-agency-qa-'));
  fs.mkdirSync(path.join(root,'development-agency/detail'),{recursive:true});
  const hub = makePage('',11), detail = makePage('detail',701);
  fs.writeFileSync(path.join(root,'index.html'),'<html><head><title>기존 홈페이지</title><meta name="description" content="기존 설명"><link rel="canonical" href="https://reumlab.com/"></head><body><main><h1>원본 제목</h1><p>기존 사이트의 초기 본문입니다.</p></main></body></html>');
  fs.writeFileSync(path.join(root,'development-agency/index.html'),render(hub));
  fs.writeFileSync(path.join(root,'development-agency/detail/index.html'),render(detail));
  fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap([ORIGIN+'/']));
  fs.writeFileSync(path.join(root,'sitemap-development-agency.xml'),sitemap([ORIGIN+'/development-agency/',ORIGIN+'/development-agency/detail/']));
  fs.writeFileSync(path.join(root,'baseline.json'),JSON.stringify({[ORIGIN+'/']:{hash:'fixture'}}));
  return { root, catalog:{agencyHub:hub,agencyPages:[detail]}, options:{out:root,reports:path.join(root,'reports'),baseline:path.join(root,'baseline.json'),expectedExisting:1} };
}
function cleanup(root: string) {
  const resolved = fs.realpathSync(root), temp = fs.realpathSync(os.tmpdir());
  assert.equal(path.dirname(resolved),temp);
  assert.ok(path.basename(resolved).startsWith('reumlab-agency-qa-'));
  fs.rmSync(resolved,{recursive:true});
}
test('strict primitives count visible main and detect repeated text independently of whitespace',()=>{
  const main = visibleMain(parse('<main><nav>목차 제거</nav><p>표시 문장.</p><p hidden>숨긴 본문</p><script>가짜 내용</script><details><summary>질문</summary><p>펼쳐 읽는 답변</p></details></main>'))!;
  assert.ok(main.textContent.includes('펼쳐 읽는 답변'));
  assert.ok(!main.textContent.includes('숨긴 본문')&&!main.textContent.includes('가짜 내용')&&!main.textContent.includes('목차 제거'));
  assert.equal(jaccard(fiveGrams('가나다라마 바사아자차'),fiveGrams('가나다라마바사아자차')),1);
  assert.ok(sentenceUnits('독립된 운영 조건을 확인하는 첫 문장입니다. 두 번째 검수 절차도 따로 설명합니다.').length===2);
  assert.equal(validDate('2026-02-30'),false);
});
test('complete exported namespace passes while old root sitemap stays separate',()=>{
  const f=fixture(); try {
    const report=verify(f.options,f.catalog);
    assert.equal(report.status,'PASS',JSON.stringify(report.issues,null,2));
    assert.equal(report.counts?.existingSitemap,1);
    assert.equal(report.counts?.newSitemap,2);
    assert.ok(report.quality.every(page=>page.koreanSyllables>=3500));
  } finally { cleanup(f.root); }
});
test('Korean nested slug resolves decoded export folders with encoded canonical and raw Korean internal href',()=>{
  const f=fixture(); try {
    const detail=f.catalog.agencyPages[0];
    detail.slug='교육기관/앱-개발';
    f.catalog.agencyHub.relatedRoutes=[{href:'/development-agency/교육기관/앱-개발/',label:'교육 앱',reason:'독립 요구'}];
    const folder=path.join(f.root,'development-agency','교육기관','앱-개발');
    fs.mkdirSync(folder,{recursive:true});
    fs.unlinkSync(path.join(f.root,'development-agency/detail/index.html'));
    fs.writeFileSync(path.join(folder,'index.html'),render(detail));
    fs.writeFileSync(path.join(f.root,'development-agency/index.html'),render(f.catalog.agencyHub));
    fs.writeFileSync(path.join(f.root,'sitemap-development-agency.xml'),sitemap([ORIGIN+agencyHref(f.catalog.agencyHub),ORIGIN+agencyHref(detail)]));
    const report=verify(f.options,f.catalog);
    assert.equal(report.status,'PASS',JSON.stringify(report.issues,null,2));
    assert.ok(report.sitemap.approvedUrls.includes(ORIGIN+'/development-agency/%EA%B5%90%EC%9C%A1%EA%B8%B0%EA%B4%80/%EC%95%B1-%EA%B0%9C%EB%B0%9C/'));
  } finally {cleanup(f.root);}
});
test('invisible filler, bad FAQ schema, missing fragment and noindex cannot pass',()=>{
  const f=fixture(); try {
    const file=path.join(f.root,'development-agency/detail/index.html');
    let html=fs.readFileSync(file,'utf8').replace('content="index, follow"','content="noindex, follow"');
    html=html.replace('<section id="section-0"','<section hidden id="section-0"');
    html=html.replace('"@type":"Answer"','"@type":"NotAnswer"');
    html=html.replace('</main>','<a href="/#missing-anchor">없는 연결</a></main>');
    fs.writeFileSync(file,html);
    const report=verify(f.options,f.catalog),checks=new Set(report.issues.map(issue=>issue.check));
    for(const check of ['robots','schema-faq','content-rendering','section-rendering','internal-link'])assert.ok(checks.has(check),check);
    assert.equal(report.status,'FAIL');
  } finally { cleanup(f.root); }
});
test('near-copy and metadata collision with another page are measured failures',()=>{
  const f=fixture(); try {
    const copied={...f.catalog.agencyHub,slug:'detail',relatedRoutes:f.catalog.agencyPages[0].relatedRoutes} as AgencyPage;
    f.catalog.agencyPages[0]=copied;
    fs.writeFileSync(path.join(f.root,'development-agency/detail/index.html'),render(copied));
    const report=verify(f.options,f.catalog),checks=new Set(report.issues.map(issue=>issue.check));
    for(const check of ['duplicate-title','duplicate-description','duplicate-h1','body-similarity','sentence-uniqueness'])assert.ok(checks.has(check),check);
  } finally { cleanup(f.root); }
});
test('missing inputs are incomplete and malformed or extra sitemap entries fail closed',()=>{
  const f=fixture(); try {
    fs.writeFileSync(path.join(f.root,'sitemap-development-agency.xml'),sitemap([ORIGIN+'/development-agency/',ORIGIN+'/development-agency/unapproved/']).replace('</urlset>','</broken>'));
    assert.ok(readSitemapTree(f.root,ORIGIN+'/sitemap-development-agency.xml').errors.length);
    assert.equal(verify(f.options,f.catalog).status,'FAIL');
    fs.unlinkSync(path.join(f.root,'sitemap-development-agency.xml'));
    assert.equal(verify(f.options,f.catalog).status,'INCOMPLETE');
  } finally { cleanup(f.root); }
});
