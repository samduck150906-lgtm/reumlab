import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AutomationDomainPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from '../app/ai-automation/[slug]/page.tsx';
import { GENERATED_AUTOMATION_DOMAINS } from '../lib/automation-domains.ts';

(globalThis as unknown as { React: typeof React }).React = React;

test('정적 생성 대상은 품질 게이트를 통과한 generated 분야와 정확히 같다', () => {
  assert.equal(dynamicParams, false);
  assert.deepEqual(
    generateStaticParams().map((item) => item.slug).sort(),
    GENERATED_AUTOMATION_DOMAINS.map((item) => item.slug).sort(),
  );
});

test('공개 자동화 상세 페이지는 고유 메타와 self-canonical을 제공한다', async () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const domain of GENERATED_AUTOMATION_DOMAINS) {
    const metadata = await generateMetadata({ params: { slug: domain.slug } });
    assert.equal(metadata.alternates?.canonical, `https://reumlab.com/ai-automation/${domain.slug}/`);
    assert.equal((metadata.robots as { index?: boolean }).index, true, domain.slug);
    const title = String((metadata.title as { absolute?: string }).absolute);
    const description = String(metadata.description);
    assert.ok(!titles.has(title), `${domain.slug}: duplicate title`);
    assert.ok(!descriptions.has(description), `${domain.slug}: duplicate description`);
    titles.add(title);
    descriptions.add(description);
  }
});

test('상세 페이지 초기 HTML에 답변·워크플로·제약·FAQ·문의·schema가 모두 있다', () => {
  for (const domain of GENERATED_AUTOMATION_DOMAINS) {
    const html = renderToStaticMarkup(AutomationDomainPage({ params: { slug: domain.slug } }));
    assert.match(html, new RegExp(`<h1[^>]*>${domain.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} 프로그램 개발`), domain.slug);
    assert.ok(html.includes(domain.directAnswer), `${domain.slug}: direct answer`);
    assert.ok(domain.workflows.every((flow) => html.includes(flow.title)), `${domain.slug}: workflows`);
    assert.ok(domain.constraints.every((constraint) => html.includes(constraint)), `${domain.slug}: constraints`);
    assert.ok(domain.faqs.every((faq) => html.includes(faq.q) && html.includes(faq.a)), `${domain.slug}: faqs`);
    assert.match(html, /name="form-name" value="main-apply"/);
    assert.match(html, /application\/ld\+json/);
    assert.match(html, /"@type":"Service"/);
    assert.match(html, /"@type":"FAQPage"/);
    assert.doesNotMatch(html, /혁신적인|획기적인|최첨단|차세대|원스톱|새로운 패러다임/);
  }
});
