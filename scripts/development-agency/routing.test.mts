import test from 'node:test';
import assert from 'node:assert/strict';
import { agencyHref, agencySlugFromSegments } from '../../lib/development-agency/types';

test('Korean static-export segments resolve to the same manuscript as generated raw params',()=>{
  const page={slug:'booking/전통주브랜드'};
  const raw=page.slug.split('/');
  const encoded=agencyHref(page).slice('/development-agency/'.length,-1).split('/');
  assert.notDeepEqual(encoded,raw);
  assert.equal(agencySlugFromSegments(raw),page.slug);
  assert.equal(agencySlugFromSegments(encoded),page.slug);
});
test('ASCII single-segment routes retain their lookup key',()=>{
  assert.equal(agencySlugFromSegments(['cms-website-development']),'cms-website-development');
});
test('Malformed or encoded separator segments do not become a valid content route',()=>{
  for (const segments of [[],['%EC'],['app%2F병원'],['..'],['%252e%252e'],['app','']]) {
    assert.equal(agencySlugFromSegments(segments),undefined);
  }
});
