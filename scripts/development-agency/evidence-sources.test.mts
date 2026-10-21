import test from 'node:test';
import assert from 'node:assert/strict';
import {assertAgencyPages,type AgencyPage,type ContentField} from '../../lib/development-agency/types';

const fields:ContentField[]=['audience','actualProblems','userRoles','workflows','coreFeatures','adminFeatures','integrations','dataEntities','edgeCases','mvpScope','expansionScope','costDrivers','timelineDrivers','complianceChecks','handover'];
function fixture(evidenceSources:AgencyPage['evidenceSources']):AgencyPage {
  return {...Object.fromEntries(fields.map(field=>[field,['Meaningful fixture paragraph']])),slug:'reference-fixture',clusterIds:['reference-fixture'],primaryKeyword:'Reference fixture',keywordVariants:['Reference fixture'],searchIntent:'Verify references',industry:'Test',serviceAxis:'Test',title:'Reference fixture',description:'Reference validation fixture',h1:'Reference fixture',summary:'Reference fixture',updatedAt:'2026-10-21',sections:fields.map(field=>({id:field,heading:field,fields:[field]})),faq:Array.from({length:6},(_,i)=>({question:'Question '+i,answer:'Answer '+i})),relatedRoutes:[],ctaContext:'Contact',evidenceSources} as unknown as AgencyPage;
}

test('dictionary key unpacking cannot publish a literal url reference',()=>{
  assert.throws(()=>assertAgencyPages([fixture([{title:'title',url:'url',use:'note'}])]),/Invalid evidence source/);
});
test('official absolute references retain paths, query strings and fragments',()=>{
  const refs=[{title:'Official technical guide',url:'https://example.org/guide?version=2#scope',use:'Scope and supported conditions'},{title:'Legacy official endpoint',url:'http://example.org/current',use:'Read-only reference'}];
  assert.doesNotThrow(()=>assertAgencyPages([fixture(refs)]));assert.equal(refs[0].url,'https://example.org/guide?version=2#scope');
});
test('relative and non-web reference addresses fail before static export',()=>{
  for(const url of ['/missing/','//example.org/guide','javascript:alert(1)','file:///tmp/guide','url','https://']) {
    assert.throws(()=>assertAgencyPages([fixture([{title:'Official guide',url,use:'Design reference'}])]),/Invalid evidence source/,url);
  }
});
test('reference title and explanatory use must contain text',()=>{
  for(const ref of [{title:' ',url:'https://example.org/guide',use:'Design reference'},{title:'Official guide',url:'https://example.org/guide',use:'\n'}]) {
    assert.throws(()=>assertAgencyPages([fixture([ref])]),/Invalid evidence source/);
  }
});
