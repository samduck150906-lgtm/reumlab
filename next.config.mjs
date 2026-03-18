/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  /** 정적 export 시 호스팅에서 301이 안 먹을 수 있음 → `public/AI서비스개발/index.html` 보조 */
  async redirects() {
    return [
      {
        source: '/AI서비스개발',
        destination: '/솔루션SaaS/',
        permanent: true,
      },
      {
        source: '/AI서비스개발/',
        destination: '/솔루션SaaS/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
