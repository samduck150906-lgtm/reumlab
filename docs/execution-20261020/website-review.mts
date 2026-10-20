import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { WEBSITE_INDUSTRIES, WEBSITE_ARCHETYPES, buildWebsiteContent, websiteCanonical, websiteTitle, websiteDescription } from '../../lib/website-industries';
import { WEBSITE_EDITORIAL, WEBSITE_SERVICE_FAMILY } from '../../lib/website-editorial';
import { getSeoWebsiteIndustryByExistingSlug } from '../../lib/seo-website';
import { getIndustry } from '../../lib/industries';
import { getCost } from '../../lib/cost';
import { getSolution } from '../../lib/solution';

const folder = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const baselinePath = path.join(folder, 'website-before.json');
const renderCheckPath = path.join(folder, 'website-render-check.json');
const hash = (value: unknown) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert.equal(WEBSITE_INDUSTRIES.length, 294);
assert.deepEqual(Object.keys(WEBSITE_EDITORIAL).sort(), WEBSITE_INDUSTRIES.map((d) => d.slug).sort());
const snapshot = WEBSITE_INDUSTRIES.map((d) => {
  const content = buildWebsiteContent(d);
  const preservedEnhancement = getSeoWebsiteIndustryByExistingSlug(d.slug) ?? null;
  return { slug: d.slug, url: websiteCanonical(d.slug), category: d.category, title: websiteTitle(d), description: websiteDescription(d), content, preservedEnhancement, hash: hash({ content, preservedEnhancement }) };
});
if (process.argv.includes('--capture-before')) {
  assert.ok(!fs.existsSync(baselinePath), 'Baseline already exists; preserve the first capture.');
  fs.writeFileSync(baselinePath, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`Captured ${snapshot.length} original homepage bodies.`);
} else {
  const before = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as typeof snapshot;
  const reports = snapshot.map((after) => {
    const d = WEBSITE_INDUSTRIES.find((item) => item.slug === after.slug)!;
    const prior = before.find((item) => item.slug === after.slug)!;
    const detail = WEBSITE_EDITORIAL[after.slug];
    const serviceSlug = WEBSITE_SERVICE_FAMILY[d.slug];
    const service = serviceSlug ? getIndustry(serviceSlug) : undefined;
    const cost = serviceSlug ? getCost(serviceSlug) : undefined;
    const solution = serviceSlug ? getSolution(serviceSlug) : undefined;
    if (serviceSlug) assert.ok(service && cost && solution, `Missing service counterpart: ${d.slug}`);
    const peers = WEBSITE_INDUSTRIES.filter((item) => item.slug !== d.slug && (
      serviceSlug ? WEBSITE_SERVICE_FAMILY[item.slug] === serviceSlug : item.category === d.category
    ));
    assert.equal(hash(prior.preservedEnhancement), hash(after.preservedEnhancement), `Existing enhancement changed: ${after.slug}`);
    assert.notEqual(prior.hash, after.hash, `No body change: ${after.slug}`);
    assert.ok(after.content.editorial, `Editorial not integrated: ${after.slug}`);
    assert.equal(after.content.editorial.compare, detail.compare);
    return {
      url: after.url,
      source: ['lib/website-industries.ts:buildWebsiteContent', `lib/website-editorial.ts:${after.slug}`, 'app/website/[industry]/page.tsx', ...(prior.preservedEnhancement ? ['lib/seo-website.ts:existing enhancement (preserved)'] : [])],
      intent: `${d.ko} 사업자가 홈페이지에서 ${detail.compare} 정보를 보여주고 제작 범위를 판단하기`,
      findings: {
        originalPages: prior.content.features,
        originalArchetype: WEBSITE_ARCHETYPES[d.category].label,
        missingDecisions: detail.compare,
        missingMaterials: detail.materials,
        intakeToClarify: detail.inquiry,
        exceptionToExplain: detail.exception,
        operationsBoundary: detail.system,
        existingUsefulBlock: prior.preservedEnhancement?.summary ?? null,
      },
      changes: {
        compare: detail.compare,
        materials: detail.materials,
        inquiry: detail.inquiry,
        exception: detail.exception,
        maintain: detail.maintain,
        system: detail.system,
        removed: 'Category-derived intro/scenario effect claims and mismatched generic menu; replaced with explicit planning information.',
        preserved: 'Existing pricing source, canonical URL, route, index policy, and existing SEO enhancement when present.',
      },
      evidence: {
        before: { hash: prior.hash, intro: prior.content.intro, scenario: prior.content.scenario, features: prior.content.features },
        after: { hash: after.hash, intro: after.content.intro, scenario: after.content.scenario, features: after.content.features, editorial: detail },
        factsBoundary: 'Editorial planning suggestions only. No client result, success rate, regulated advice, or new package entitlement asserted.',
        similarHomepageComparison: peers.slice(0, 2).map((peer) => ({ url: websiteCanonical(peer.slug), distinctDecision: WEBSITE_EDITORIAL[peer.slug].compare })),
        serviceComparison: service ? {
          appUrl: `https://reumlab.com/app/${service.slug}/`,
          appSource: 'lib/industries.ts',
          appQuestion: service.coreFeatures,
          costUrl: `https://reumlab.com/cost/${service.slug}/`,
          costSource: 'lib/cost.ts',
          costQuestion: '앱·시스템 기능 범위에 따른 구축 견적과 운영비',
          solutionUrl: `https://reumlab.com/solution/${service.slug}/`,
          solutionSource: 'lib/solution.ts',
          solutionQuestion: '운영 모듈·권한·데이터·도입 단계',
          websiteQuestion: detail.compare,
          boundary: `공개 비교·문의 정보와 ${detail.system} 업무 데이터를 분리한다. 홈페이지 제작비를 앱·시스템 구축비로 재사용하지 않는다.`,
        } : {
          status: 'No directly corresponding industry service selected',
          boundary: `${detail.system} 기능은 별도 업무 시스템 검토 대상이며, 관련 없는 업종 URL을 임의 연결하지 않는다.`,
        },
      },
      status: {
        sourceReview: 'reviewed-and-enriched',
        coverage: ['comparison', 'page structure', 'materials', 'inquiry flow', 'exception', 'operator updates', 'system boundary'],
        sourceServerRender: fs.existsSync(renderCheckPath) ? 'passed; see website-render-check.json' : 'pending',
        renderedPage: 'pending-parent-build-and-visual-review',
        deployment: 'pending',
        submission: 'pending',
      },
    };
  });
  fs.writeFileSync(path.join(folder, 'website-review.json'), JSON.stringify(reports, null, 2) + '\n');
  fs.writeFileSync(path.join(folder, 'website-after.json'), JSON.stringify(snapshot, null, 2) + '\n');
  console.log(JSON.stringify({ reviewed: reports.length, preservedEnhancements: reports.filter((r) => r.findings.existingUsefulBlock).length, distinctDecisions: new Set(reports.map((r) => r.changes.compare)).size, runtimeStatus: 'pending' }));
}
