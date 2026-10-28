/**
 * 페이지 소스 테스트용 모듈 로더 훅.
 *
 * - Node 테스트 러너에는 Next.js CSS Module 로더가 없으므로 `*.module.css` 는 클래스명을 그대로 돌려주는
 *   Proxy 로 대체한다(실제 CSS 번들링은 npm run build 가 검증).
 * - Node 22.22+ 의 동기 훅(module.registerHooks) 은 load 결과의 source 가 문자열/버퍼가 아니면 거부한다.
 *   기본 로더는 CommonJS 패키지(next/link 등)에 대해 source 를 비워 돌려주므로 그대로 두면
 *   ERR_INVALID_RETURN_PROPERTY_VALUE 로 테스트 전체가 깨진다. 그 경우 파일을 직접 읽어 CommonJS 소스로 넘긴다.
 */
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

const CSS_MODULE_STUB = "export default new Proxy({}, { get: (_target, property) => String(property) });";

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.module.css')) {
      return { format: 'module', source: CSS_MODULE_STUB, shortCircuit: true };
    }
    try {
      return nextLoad(url, context);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === 'ERR_INVALID_RETURN_PROPERTY_VALUE' && url.startsWith('file:') && /\.c?js$/.test(url)) {
        return { format: 'commonjs', source: readFileSync(fileURLToPath(url)), shortCircuit: true };
      }
      throw error;
    }
  },
});
