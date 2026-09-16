import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
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

test('IndexNow blocks an unexpected automatic large batch unless it is explicitly approved', () => {
  const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'reumlab-indexnow-'));
  try {
    mkdirSync(path.join(fixtureRoot, 'scripts'));
    mkdirSync(path.join(fixtureRoot, 'out'));
    copyFileSync(path.join(ROOT, 'scripts', 'submit-indexnow.mjs'), path.join(fixtureRoot, 'scripts', 'submit-indexnow.mjs'));
    copyFileSync(path.join(ROOT, 'scripts', 'read-sitemap.mjs'), path.join(fixtureRoot, 'scripts', 'read-sitemap.mjs'));
    writeFileSync(
      path.join(fixtureRoot, 'out', 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://reumlab.com/one/</loc><lastmod>2026-09-16</lastmod></url>
  <url><loc>https://reumlab.com/two/</loc><lastmod>2026-09-16</lastmod></url>
  <url><loc>https://reumlab.com/three/</loc><lastmod>2026-09-16</lastmod></url>
</urlset>`,
    );

    const env = { ...process.env, INDEXNOW_MAX_AUTO_URLS: '2' };
    delete env.CONTEXT;
    const blocked = spawnSync(process.execPath, ['scripts/submit-indexnow.mjs', '--dry-run'], {
      cwd: fixtureRoot,
      env,
      encoding: 'utf8',
    });
    const blockedOutput = `${blocked.stdout}\n${blocked.stderr}`;
    assert.equal(blocked.status, 0, blockedOutput);
    assert.match(blockedOutput, /대량 제출 차단.*3개.*한도 2개/);

    const approved = spawnSync(
      process.execPath,
      ['scripts/submit-indexnow.mjs', '--dry-run', '--allow-large-batch'],
      { cwd: fixtureRoot, env, encoding: 'utf8' },
    );
    const approvedOutput = `${approved.stdout}\n${approved.stderr}`;
    assert.equal(approved.status, 0, approvedOutput);
    assert.doesNotMatch(approvedOutput, /대량 제출 차단/);
    assert.match(approvedOutput, /변경분 3개 제출 대상/);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
