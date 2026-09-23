import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { getBlogPostBySlug, blogShouldIndex } from '../lib/blog-posts';
import { getGuide } from '../lib/guides';
import { PAGE_SEO_MAP } from '../lib/seo';

const CRITICAL_BLOG_SLUG = 'app-gaebal-biyong-julineun-bab';

test('실제로 배포되는 정적 홈 문서는 개선된 검색 제목과 설명을 제공한다', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<title>앱·웹·AI 외주개발/);
  assert.match(html, /<meta name="description" content="[^"]*정액 견적[^"]*소스코드/);
});

test('AI 검색 노출이 있던 비용 절감 글은 원래 URL에서 색인 가능한 본문으로 제공된다', () => {
  const post = getBlogPostBySlug(CRITICAL_BLOG_SLUG);

  assert.ok(post, '복구 대상 블로그 글이 BLOG_POSTS에 있어야 한다');
  assert.match(post.title, /앱 개발 비용.*7가지/);
  assert.match(post.description, /기능 우선순위/);
  assert.ok((post.htmlBody ?? post.paragraphs.join(' ')).length >= 1_200, '얇은 복구 문서가 아니어야 한다');
  assert.equal(blogShouldIndex(CRITICAL_BLOG_SLUG), true);
});

test('노출이 큰 핵심 서비스 페이지는 검색 의도와 차별점을 제목에 드러낸다', () => {
  const expected: Array<[string, RegExp, RegExp]> = [
    ['', /앱·웹·AI 외주개발/, /정액 견적.*소스코드/],
    ['ai-development', /AI 외주개발.*RAG/, /사내 RAG.*업무 자동화/],
    ['app-agency', /앱개발 업체 비교/, /소스코드.*배포 권한/],
    ['maintenance', /앱·웹 유지보수 업체/, /타사.*오류 수정/],
    ['admin-page-development', /관리자 페이지 개발/, /주문·회원·재고·정산/],
  ];

  for (const [slug, titlePattern, descriptionPattern] of expected) {
    const page = PAGE_SEO_MAP[slug];
    assert.ok(page, `${slug || 'home'} SEO 정의가 있어야 한다`);
    assert.match(page.title, titlePattern, `${slug || 'home'} 제목이 검색 의도를 설명해야 한다`);
    assert.match(page.description, descriptionPattern, `${slug || 'home'} 설명이 실제 차별점을 담아야 한다`);
  }
});

test('상위 노출 가이드는 검색자가 찾는 단계·비용·도입 질문을 제목에서 바로 답한다', () => {
  const expected: Array<[string, RegExp, RegExp]> = [
    ['dev-process', /외주 개발 진행 과정 8단계/, /견적.*계약.*검수.*소스/],
    ['web-cost', /홈페이지 제작 비용/, /98만원부터.*항목별 견적/],
    ['ai-automation-guide', /AI 업무 자동화란/, /업무.*적용.*비용.*도입 순서/],
  ];

  for (const [slug, titlePattern, descriptionPattern] of expected) {
    const guide = getGuide(slug);
    assert.ok(guide, `${slug} 가이드가 있어야 한다`);
    assert.match(guide.title, titlePattern);
    assert.match(guide.description, descriptionPattern);
  }
});

test('기존 비용·가격·견적 랜딩의 단일 301 도착점이 비용 계산 의도를 대표한다', () => {
  const guide = getGuide('app-cost');
  assert.ok(guide);
  assert.match(guide.title, /앱개발 비용 계산법/);
  assert.match(guide.description, /화면·기능·관리자·결제·외부 연동/);
});
