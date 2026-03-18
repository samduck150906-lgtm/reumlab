/**
 * 정적 export(`output: 'export'`)에서는 next.config의 redirects가 빌드에 적용되지 않습니다.
 * 구 URL 대응: `public/AI서비스개발/index.html` + `public/_redirects`(Netlify 등).
 * Node 서버 배포 시에는 아래를 활성화하면 됩니다.
 *
 * async redirects() {
 *   return [
 *     { source: '/AI서비스개발', destination: '/솔루션SaaS/', permanent: true },
 *     { source: '/AI서비스개발/', destination: '/솔루션SaaS/', permanent: true },
 *   ];
 * },
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
