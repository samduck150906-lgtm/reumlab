/**
 * 정적 홈 원본과 런타임 자산을 Next export 산출물에 복사한다.
 *
 * 셸의 `cp`에 의존하지 않아 Windows·Linux·Netlify에서 같은 명령을 쓸 수 있다.
 * 홈은 README에 설명된 대로 Next의 app/page.tsx 출력 대신 index.html을 배포한다.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import cssnanoSimple from 'next/dist/compiled/cssnano-simple/index.js';
import terser from 'next/dist/compiled/terser/bundle.min.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'out');
const files = ['index.html', 'styles.css', 'script.js'];

if (!existsSync(outDir)) {
  console.error('copy-home-assets: out/이 없습니다. next build 이후 실행하세요.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const source = join(root, file);
  if (!existsSync(source)) {
    console.error(`copy-home-assets: 원본 파일이 없습니다: ${file}`);
    process.exit(1);
  }
  copyFileSync(source, join(outDir, file));
}

// 원본은 리뷰하기 쉽게 유지하고 배포 산출물만 압축한다. Next에 이미 포함된 검증된
// cssnano/terser를 사용하므로 별도 패키지나 Netlify 런타임 의존성을 늘리지 않는다.
const cssSource = readFileSync(join(root, 'styles.css'), 'utf8');
const cssResult = await postcss([cssnanoSimple({ excludeAll: false })])
  .process(cssSource, { from: join(root, 'styles.css'), map: false });
writeFileSync(join(outDir, 'styles.css'), cssResult.css, 'utf8');

const jsSource = readFileSync(join(root, 'script.js'), 'utf8');
const jsResult = await terser.minify(jsSource, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
});
if (!jsResult.code) {
  console.error('copy-home-assets: script.js minify 결과가 비었습니다.');
  process.exit(1);
}
writeFileSync(join(outDir, 'script.js'), jsResult.code, 'utf8');

console.log(
  `Copied ${files.join(', ')} → out/ (styles ${cssSource.length}→${cssResult.css.length}, script ${jsSource.length}→${jsResult.code.length})`,
);
