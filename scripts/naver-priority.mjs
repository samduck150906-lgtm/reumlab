/**
 * Search Advisor 실측 클릭·노출과 전환 의도를 함께 반영한 네이버 작업 우선순위.
 * URL 종류만으로 전 페이지를 P1 처리하지 않는다.
 */
export const NAVER_P1_PATHS = new Set([
  '/',
  '/mvp/',
  '/app-agency/',
  '/erp/',
  '/website/',
  '/app/',
  '/cost/',
  '/solution/',
  '/system/',
  '/soho/',
  '/geo-website/',
  '/ai-automation/',
  '/ai-search-optimization/',
  '/ai-voice-development/',
  '/ai-worker/',
  '/ai-worker/multimodal/',
  '/enternal-ai/',
  '/enterprise-ai/',
  '/portfolio/',
  '/guide/',

  // 2026-09 Search Advisor 실측 상위·상승 URL.
  '/website/cheongsoeobche/',
  '/app/speech/',
  '/app/party-room/',
  '/cost/delivery/',
  '/website/sangjohoesa/',
  '/cost/rental-car/',
  '/system/qr-order/',
  '/app/grocery/',
  '/website/pibugwanrisyab/',
  '/admin-page-development/',
  '/solution/postpartum/',
  '/cost/cooking-class/',
  '/app/cooking-class/',
  '/website/yutyubeujejagsa/',
  '/blog/gym-membership-app/',
  '/nocode-limit/',
  '/academy-shopping-mall/',
]);

/** Search Advisor에서 실제 클릭·노출이 확인된 페이지를 홈에서 한 번에 발견하게 한다. */
export const NAVER_HOME_LINK_PATHS = [
  '/website/cheongsoeobche/',
  '/website/sangjohoesa/',
  '/website/yutyubeujejagsa/',
  '/website/pibugwanrisyab/',
  '/app/speech/',
  '/app/party-room/',
  '/app/grocery/',
  '/app/cooking-class/',
  '/cost/delivery/',
  '/cost/rental-car/',
  '/cost/cooking-class/',
  '/system/qr-order/',
  '/solution/postpartum/',
  '/blog/gym-membership-app/',
  '/nocode-limit/',
];

const NAVER_P3_PATHS = new Set(['/privacy/', '/terms/', '/refund/']);

export function naverPriority({ pathname, type, indexable }) {
  if (!indexable) return 'P3';
  if (NAVER_P1_PATHS.has(pathname)) return 'P1';
  if (NAVER_P3_PATHS.has(pathname)) return 'P3';
  if (['service_or_hub', 'guide', 'portfolio', 'blog'].includes(type)) return 'P2';
  return 'P3';
}
