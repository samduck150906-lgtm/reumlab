import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const context of ['deploy-preview', 'branch-deploy']) {
  test(`IndexNow skips Netlify ${context} without contacting a host`, () => {
    const result = spawnSync(process.execPath, ['scripts/submit-indexnow.mjs', '--submit'], {
      cwd: ROOT,
      env: { ...process.env, CONTEXT: context },
      encoding: 'utf8',
    });

    const output = `${result.stdout}\n${result.stderr}`;
    assert.equal(result.status, 0, output);
    assert.match(output, new RegExp(`Netlify ${context} 컨텍스트`));
    assert.doesNotMatch(output, /HTTP \d{3}|https:\/\/searchadvisor\.naver\.com|https:\/\/www\.bing\.com/);
  });
}

test('IndexNow requires an explicit submit flag outside Netlify too', () => {
  const env = { ...process.env };
  delete env.CONTEXT;
  const result = spawnSync(process.execPath, ['scripts/submit-indexnow.mjs'], {
    cwd: ROOT,
    env,
    encoding: 'utf8',
  });

  const output = `${result.stdout}\n${result.stderr}`;
  assert.equal(result.status, 0, output);
  assert.match(output, /명시적 --submit 없음/);
  assert.doesNotMatch(output, /HTTP \d{3}|https:\/\/searchadvisor\.naver\.com|https:\/\/www\.bing\.com/);
});

test('Netlify runs IndexNow only from the production build command', () => {
  const toml = readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  assert.match(toml, /\[build\][\s\S]*?command\s*=\s*"npm run build"/);
  assert.match(toml, /\[context\.production\][\s\S]*?npm run seo:indexnow/);
  const globalBuild = toml.match(/\[build\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? '';
  const globalCommand = globalBuild.match(/command\s*=\s*"([^"]+)"/)?.[1] ?? '';
  assert.equal(globalCommand, 'npm run build');
});
