import test from 'node:test';
import assert from 'node:assert/strict';
import { selectIndexNowUrls } from './indexnow-candidates.mjs';

test('실제 변경과 이전 실패분만 선택하고 현재 사이트맵 밖의 URL은 제외한다', () => {
  const pages = [{ url: 'a', lastmod: '2' }, { url: 'b', lastmod: '1' }, { url: 'c', lastmod: '1' }];
  const changes = [{ url: 'a', action: 'changed' }, { url: 'c', action: 'removed' }];
  assert.deepEqual(selectIndexNowUrls(pages, changes, ['b', 'gone'], { a: '1' }), ['a', 'b']);
  assert.deepEqual(selectIndexNowUrls(pages, [], ['a', 'b'], { a: '2', b: '1' }), []);
  assert.deepEqual(selectIndexNowUrls(pages, [], [], { a: '2' }, true), ['a', 'b', 'c']);
});
