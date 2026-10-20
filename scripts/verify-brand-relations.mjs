import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
for (const path of ['index.html','marketing-linked-development/index.html','mvp/index.html','ai-voice-development/index.html']) {
  const html=readFileSync(`out/${path}`,'utf8');
  const nodes=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const d=JSON.parse(m[1]);return d['@graph']||[d];});
  const org=nodes.find(n=>n['@id']==='https://reumlab.com/#organization');
  assert.equal(org?.parentOrganization?.['@id'],'https://reumlab.com/#legal-organization',path);
  const legal=nodes.filter(n=>n['@id']==='https://reumlab.com/#legal-organization');
  assert.equal(legal.length,1,path);
  assert.equal(legal[0].name,'이터널식스',path);
  assert.deepEqual(new Set(legal[0].brand.map(b=>b['@id'])),new Set(['https://hyunlab.kr/#brand','https://reumlab.com/#brand']));
  for(const n of nodes) assert.ok(!(n.sameAs||[]).some(u=>/^https:\/\/(hyunlab\.kr|reumlab\.com)\/?$/.test(u)),path);
}
const page=readFileSync('out/marketing-linked-development/index.html','utf8');
assert.ok(page.includes('https://hyunlab.kr/marketing-development/'));
assert.ok(page.includes('name="form-name"'));
assert.ok(page.includes('main-apply'));
console.log('Brand relation QA PASS: legal operator, both brands, no duplicate @id/cross-brand sameAs, linked page and existing form.');
