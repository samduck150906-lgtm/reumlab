import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const legacy = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const component = readFileSync(new URL('../components/LandingInquiryForm.tsx', import.meta.url), 'utf8');
const legacyBlock = legacy.slice(legacy.indexOf('  var applyForms ='), legacy.indexOf('     4) 전환 분석 이벤트'));
const reactBlock = component.slice(component.indexOf('  async function handleSubmit('), component.indexOf("  if (status === 'success')"));
const flush = () => new Promise(resolve => setImmediate(resolve));

function harness(kind: 'legacy' | 'react', pixelThrows = false) {
  const events: any[] = [];
  const button = { disabled: false, textContent: '요청' };
  const error = { hidden: true, textContent: '전송 실패', dataset: {} as Record<string, string> };
  const done = { hidden: true };
  const handlers: Record<string, Function> = {};
  let status = 'idle';
  let reset = 0;
  let timer: (() => void) | undefined;
  let calls = 0;
  let resolveResponse!: (value: any) => void;
  let rejectResponse!: (value: any) => void;
  let request: any;
  const response = new Promise((resolve, reject) => { resolveResponse = resolve; rejectResponse = reject; });
  const form = {
    dataset: {}, hidden: false,
    reset() { reset++; },
    querySelectorAll() { return []; },
    querySelector(selector: string) { return selector === '.af-submit' ? button : error; },
    addEventListener(name: string, handler: Function) { handlers[name] = handler; },
    closest() { return { querySelector: (selector: string) => selector === '.af-done' ? done : { hidden: false }, scrollIntoView() {} }; },
  };
  const sandbox: any = {
    document: { querySelectorAll: () => [form] },
    window: { location: { pathname: '/test/', search: '' }, fbq() { if (pixelThrows) throw new Error('pixel failed'); } },
    location: { pathname: '/test/' }, sessionStorage: { getItem: () => null },
    FormData: class { [Symbol.iterator]() { return [['form-name', 'main-apply'], ['name', 'synthetic-test']][Symbol.iterator](); } },
    URLSearchParams, AbortController, DOMException, Error,
    setTimeout(callback: () => void) { timer = callback; return 1; },
    clearTimeout() { timer = undefined; },
    fetch(url: string, options: any) {
      calls++; request = { url, ...options };
      options.signal?.addEventListener('abort', () => rejectResponse(new DOMException('aborted', 'AbortError')));
      return response;
    },
    CTX: {}, ACQ: {}, once() {}, withCtx: (value: any) => value,
    pushDL: (value: any) => events.push(value),
    pushEvent: (event: string, value: any) => events.push({ event, ...value }),
    pageContext: () => ({}), EVENT: { lead: 'generate_lead', formError: 'form_error' },
    submittingRef: { current: false }, leadSentRef: { current: false },
    isAiSearch: false, isSeoWebsite: false, isAiVoice: false,
    FORM_NAME: 'main-apply', ctx: { leadSource: 'direct' },
    setStatus(value: string) { status = value; },
  };
  if (kind === 'legacy') {
    // Execute the real submit handler with a minimal DOM; close the following comment.
    runInNewContext(legacyBlock + '*/', sandbox);
  } else {
    runInNewContext(ts.transpileModule(reactBlock, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, sandbox);
    handlers.submit = sandbox.handleSubmit;
  }
  return {
    events, form, button, error, done,
    submit: () => handlers.submit({ preventDefault() {}, currentTarget: form }),
    resolve: resolveResponse, reject: rejectResponse,
    timeout: () => { assert.ok(timer, 'request must have a timeout'); timer(); },
    calls: () => calls, request: () => request, status: () => status, resets: () => reset,
    timer: () => timer,
  };
}

for (const kind of ['legacy', 'react'] as const) {
  test(`${kind}: server success is required and duplicate in-flight submits send one request`, async () => {
    const h = harness(kind, true);
    const first = h.submit();
    h.submit();
    assert.equal(h.calls(), 1);
    assert.equal(h.events.length, 0);
    assert.equal(h.request().url, '/__forms.html');
    assert.equal(h.request().method, 'POST');
    assert.match(h.request().body, /form-name=main-apply/);
    h.resolve({ ok: true, status: 200 });
    await first; await flush();
    assert.equal(h.events.filter(event => event.event === 'generate_lead').length, 1);
    assert.equal(h.events.filter(event => event.event === 'form_error').length, 0);
    assert.equal(kind === 'react' ? h.status() : !h.done.hidden, kind === 'react' ? 'success' : true);
    assert.equal(h.timer(), undefined);
  });

  for (const failure of ['server', 'network', 'timeout'] as const) {
    test(`${kind}: ${failure} preserves inputs, unlocks retry and never records a lead`, async () => {
      const h = harness(kind);
      const pending = h.submit();
      if (failure === 'server') h.resolve({ ok: false, status: 500 });
      if (failure === 'network') h.reject(new Error('offline'));
      if (failure === 'timeout') h.timeout();
      await pending; await flush();
      assert.equal(h.events.filter(event => event.event === 'generate_lead').length, 0);
      assert.equal(h.events.filter(event => event.event === 'form_error').length, 1);
      assert.equal(h.resets(), 0);
      assert.equal(h.form.hidden, false);
      assert.equal(h.button.disabled, false);
      assert.equal(h.timer(), undefined);
      if (kind === 'legacy' && failure === 'timeout') assert.match(h.error.textContent, /이미 접수되었을 수/);
      if (kind === 'react') assert.equal(h.status(), failure === 'timeout' ? 'timeout' : 'error');
      h.submit();
      assert.equal(h.calls(), 2);
      await flush();
    });
  }
}
