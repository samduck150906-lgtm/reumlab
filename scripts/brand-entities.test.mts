/**
 * 운영 주체·브랜드 엔티티 테스트.
 *
 *   node --import tsx --test scripts/brand-entities.test.mts
 *
 * 름랩과 현랩은 같은 사업자(이터널식스)가 운영한다. 화면 문구("같은 사업자의 현랩")와
 * 구조화 데이터가 같은 말을 해야 하고, hyunlab.kr 이 가리키는 @id 를 reumlab.com 이 실제로
 * 정의해야 두 사이트의 엔티티가 이어진다. 정의는 세 곳(lib/schema.ts · 목적별 랜딩 생성기 ·
 * 정적 index.html)에서 나가므로 서로 어긋나지 않는지도 본다.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import BRAND_ENTITIES from '../config/brand-entities.json';
import { SCHEMA_ID, siteGraph } from '../lib/schema';
import { SITE } from '../lib/seo';

const LEGAL = 'https://reumlab.com/#legal-organization';
const REUM_BRAND = 'https://reumlab.com/#brand';
const HYUN_BRAND = 'https://hyunlab.kr/#brand';

type Node = Record<string, any>;
const byId = (nodes: Node[], id: string) => nodes.filter((n) => n['@id'] === id);

test('법적 운영 주체는 사이트 사업자 정보와 같고, 두 브랜드를 모두 가진다', () => {
  const [legal] = byId(BRAND_ENTITIES as Node[], LEGAL);
  assert.equal(legal.legalName, SITE.legalName);
  assert.equal(legal.identifier.value, SITE.bizNo);
  assert.deepEqual(new Set(legal.brand.map((b: Node) => b['@id'])), new Set([REUM_BRAND, HYUN_BRAND]));
  assert.equal(byId(BRAND_ENTITIES as Node[], HYUN_BRAND)[0].url, 'https://hyunlab.kr/');
});

test('siteGraph — #organization 이 운영 주체·브랜드를 가리키고, 엔티티는 한 번씩만 정의된다', () => {
  const graph = siteGraph() as Node[];
  const [org] = byId(graph, SCHEMA_ID.organization);
  assert.equal(org.parentOrganization['@id'], LEGAL);
  assert.equal(org.brand['@id'], REUM_BRAND);
  for (const id of [LEGAL, REUM_BRAND, HYUN_BRAND]) assert.equal(byId(graph, id).length, 1, id);
});

test('정적 index.html 과 목적별 랜딩 생성기가 같은 엔티티를 낸다', () => {
  const html = readFileSync('index.html', 'utf8');
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(ld, 'index.html JSON-LD 없음');
  const graph: Node[] = JSON.parse(ld[1])['@graph'];
  for (const entity of BRAND_ENTITIES as Node[]) {
    assert.deepEqual(byId(graph, entity['@id']), [entity], `index.html ${entity['@id']}`);
  }
  const [org] = byId(graph, SCHEMA_ID.organization);
  assert.equal(org.parentOrganization['@id'], LEGAL);
  assert.equal(org.brand['@id'], REUM_BRAND);

  const generator = readFileSync('scripts/generate-purpose-landings.mjs', 'utf8');
  assert.match(generator, /\.\.\.BRAND_ENTITIES,\n\];/, '생성기 SITE_ENTITY_NODES 에 BRAND_ENTITIES 없음');
  assert.match(generator, /parentOrganization: \{ '@id': 'https:\/\/reumlab\.com\/#legal-organization' \}/);
});
