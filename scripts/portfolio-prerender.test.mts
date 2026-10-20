import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parse } from 'node-html-parser';
import { buildStaticPortfolio } from './inject-portfolio-static.mjs';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const start = source.indexOf('  var PROJECTS = [');
const end = source.indexOf('  /* ============================================================\n     2)');
assert.ok(start >= 0 && end > start);
const portfolioRuntime = source.slice(start, end);

function setup(prerendered: boolean) {
  const { cards } = buildStaticPortfolio(source);
  const doc = parse(`<body>
    <button class="pf-filter__btn is-on" data-filter="all">all</button>
    <button class="pf-filter__btn" data-filter="ai">ai</button>
    <div id="pfGrid"${prerendered ? ' data-portfolio-rendered="true"' : ''}>${prerendered ? cards : ''}</div>
    <div id="pm"><div class="pm__dialog"><button data-pm-close>close</button><div id="pmBody"></div></div></div>
  </body>`);
  const listeners = new Map<any, Record<string, Function>>();
  const body = doc.querySelector('body')!;
  const focus: any[] = [];
  for (const el of doc.querySelectorAll('*')) {
    listeners.set(el, {});
    (el as any).addEventListener = (name: string, handler: Function) => { listeners.get(el)![name] = handler; };
    (el as any).focus = () => focus.push(el);
  }
  const document: any = {
    body, activeElement: doc.querySelector('[data-open]'),
    querySelectorAll: (selector: string) => doc.querySelectorAll(selector),
    getElementById: (id: string) => doc.querySelector(`#${id}`),
    addEventListener: () => {},
  };
  const events: any[] = [];
  const sandbox: any = { document, pushDL: (event: any) => events.push(event) };
  runInNewContext(portfolioRuntime, sandbox);
  return { sandbox, doc, listeners, events, focus };
}

test('static cards include the exact same 15 mockups and text as the real runtime renderer', () => {
  const h = setup(false);
  h.sandbox.renderPortfolio();
  const html = h.doc.querySelector('#pfGrid')!.innerHTML;
  const { cards, count } = buildStaticPortfolio(source);
  assert.equal(count, 15);
  assert.equal(html, parse(cards).toString());
  const shots = h.doc.querySelectorAll('.pf-card2__shot');
  assert.equal(shots.length, 15);
  assert.ok(shots.every(shot => shot.childNodes.length > 0));
});

test('prerendered card nodes survive initialization and category filtering still works', () => {
  const h = setup(true);
  const before = h.doc.querySelectorAll('.pf-card2');
  h.sandbox.renderPortfolio();
  assert.equal(h.doc.querySelectorAll('.pf-card2')[0], before[0], 'must not replace existing nodes');
  h.sandbox.initFilter();
  const ai = h.doc.querySelector('[data-filter="ai"]')!;
  h.listeners.get(ai)!.click();
  for (const card of before) {
    assert.equal((card as any).hidden, !card.getAttribute('data-cat')!.split(' ').includes('ai'));
  }
  assert.equal(ai.getAttribute('aria-selected'), 'true');
  h.listeners.get(h.doc.querySelector('[data-filter="all"]'))!.click();
  assert.ok(before.every(card => !(card as any).hidden));
});

test('delegated modal open and close work on prerendered cards with mockup and focus restoration', () => {
  const h = setup(true);
  h.sandbox.renderPortfolio();
  h.sandbox.initModal();
  const opener = h.doc.querySelector('[data-open]')!;
  const grid = h.doc.querySelector('#pfGrid')!;
  h.listeners.get(grid)!.click({ target: opener });
  const modal = h.doc.querySelector('#pm')!;
  assert.equal((modal as any).hidden, false);
  assert.ok(h.doc.querySelector('.pm-shot')!.childNodes.length > 0);
  assert.match(h.doc.querySelector('#pmBody')!.textContent, /예시 데이터 목업/);
  assert.equal(h.events.at(-1).event, 'portfolio_card_open');
  h.listeners.get(modal)!.click({ target: h.doc.querySelector('[data-pm-close]') });
  assert.equal((modal as any).hidden, true);
  assert.equal(h.focus.at(-1), opener);
});
