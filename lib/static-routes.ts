/**
 * "빌드 후처리가 Next 렌더 결과를 덮어쓰는 경로" 단일 출처.  import 없는 모듈이다.
 *
 * 왜 필요한가
 *  이 사이트는 정적 export 위에 후처리 단계가 얹혀 있다.
 *    · scripts/copy-home-assets.mjs        → out/index.html (정적 홈)
 *    · scripts/generate-purpose-landings.mjs → out/<slug>/index.html (목적별 랜딩 8종)
 *  이 경로들은 **배포본과 Next 라우트가 서로 다른 화면**이다. 그런데 next/link 로 이동하면
 *  브라우저가 HTML 을 다시 받지 않고 Next 가 자기 컴포넌트를 그리므로, 방문자는 배포된
 *  페이지가 아닌 다른 화면을 보게 된다.
 *
 *  실측(브라우저 A/B)으로 확인된 불일치:
 *    /         정적 홈 10,991자  ↔  Next app/page.tsx 5,159자   (완전히 다른 페이지)
 *    /mvp/     목적별 랜딩 5,561자 ↔ Next [slug] 2,836자
 *    /website/ 목적별 랜딩 4,905자 ↔ Next app/website 5,282자
 *  나머지 슬러그는 현재 Next 라우트가 없어 이미 전체 리로드로 동작하지만,
 *  앞으로 같은 이름의 라우트가 생기면 똑같은 사고가 나므로 여기 함께 적어 둔다.
 *
 * components/SiteLink.tsx 가 이 목록을 보고 <Link> 대신 <a> 로 내보낸다.
 * 후처리 대상이 바뀌면 이 파일과 해당 스크립트를 같이 고칠 것.
 */

/** scripts/generate-purpose-landings.mjs 의 LANDINGS 슬러그와 같아야 한다 */
export const PURPOSE_LANDING_SLUGS = [
  'mvp',
  'erp',
  'ai-automation',
  'platform',
  'reservation-commerce',
  'website',
  'data-seo',
  'service-renewal',
] as const;

/** 후처리가 덮어쓰는 최종 경로(항상 trailing slash) */
export const STATIC_OVERRIDE_PATHS: readonly string[] = [
  '/',
  ...PURPOSE_LANDING_SLUGS.map((s) => `/${s}/`),
];

/**
 * next.config 의 trailingSlash: true 와 같은 형태로 맞춘다.
 * next/link 는 이 정규화를 알아서 해 주지만 우리가 직접 <a> 를 낼 때는 해야 한다 —
 * 안 하면 `/mvp` 처럼 슬래시 없는 링크가 그대로 나가 404 가 된다(실제로 한 번 냈다).
 */
export function withTrailingSlash(href: string): string {
  const [path, tail = ''] = [href.split(/(?=[?#])/)[0], href.slice(href.split(/(?=[?#])/)[0].length)];
  if (!path.startsWith('/')) return href;
  if (path.endsWith('/')) return path + tail;
  // 파일 확장자가 붙은 경로(/feed.xml 등)에는 슬래시를 붙이지 않는다
  if (/\.[a-z0-9]+$/i.test(path)) return href;
  return `${path}/${tail}`;
}

/** 이 경로로 가는 링크는 클라이언트 내비게이션이 아니라 실제 페이지 이동이어야 한다 */
export function isStaticOverride(href: string): boolean {
  const clean = withTrailingSlash(href).split(/[?#]/)[0];
  return STATIC_OVERRIDE_PATHS.includes(clean);
}
