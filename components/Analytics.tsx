import Script from 'next/script';

/**
 * NEXT_PUBLIC_GTM_ID: GTM-XXXX (컨테이너 하나로 GA4·Meta 등 묶기 권장)
 * NEXT_PUBLIC_GA4_ID: G-XXXX (GA4 측정 ID — gtag.js 직접 로드)
 * NEXT_PUBLIC_META_PIXEL_ID: 선택, GTM에 Pixel 없을 때만 직접 삽입
 */
export function Analytics() {
  // GTM 컨테이너 ID — 환경변수(NEXT_PUBLIC_GTM_ID)로 덮어쓸 수 있고, 없으면 기본값 사용.
  // 컨테이너 ID는 비밀이 아니며 페이지 소스에 그대로 노출되므로 코드에 둬도 안전합니다.
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WHLMP8ZD';
  // GA4 측정 ID — 환경변수(NEXT_PUBLIC_GA4_ID)로 덮어쓸 수 있고, 없으면 기본값 사용.
  // GTM-WHLMP8ZD 공개 컨테이너에서 이 ID가 확인되므로 GTM이 켜져 있으면 직접 gtag.js를
  // 로드하지 않는다. 두 로더를 함께 쓰면 페이지뷰가 중복되고 메인 스레드도 불필요하게 쓴다.
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || 'G-YWXT6T2Y3S';
  const directGa4Id = gtmId ? '' : ga4Id;
  // 메타 픽셀 ID — 환경변수(NEXT_PUBLIC_META_PIXEL_ID)로 덮어쓸 수 있고, 없으면 기본값 사용.
  // 픽셀 ID는 비밀이 아니며 페이지 소스에 그대로 노출되므로 코드에 둬도 안전합니다.
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1019901144020877';

  const googleLoader = gtmId
    ? `w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var g=d.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtm.js?id=${gtmId}';d.head.appendChild(g);`
    : directGa4Id
      ? `w.gtag=function(){w.dataLayer.push(arguments)};w.gtag('js',new Date());w.gtag('config','${directGa4Id}');var g=d.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=${directGa4Id}';d.head.appendChild(g);`
      : '';
  const metaQueue = metaPixelId
    ? `(function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];})(window);`
    : '';
  const metaLoader = metaPixelId
    ? `var m=d.createElement('script');m.async=true;m.src='https://connect.facebook.net/en_US/fbevents.js';d.head.appendChild(m);w.fbq('init','${metaPixelId}');w.fbq('track','PageView');`
    : '';
  const delayedLoader = `window.dataLayer=window.dataLayer||[];${metaQueue}
(function(w,d){var loaded=false;function load(){if(loaded)return;loaded=true;${googleLoader}${metaLoader}}function schedule(){w.setTimeout(function(){if('requestIdleCallback'in w)w.requestIdleCallback(load,{timeout:2000});else load();},8000);}if(d.readyState==='complete')schedule();else w.addEventListener('load',schedule,{once:true});['pointerdown','keydown','touchstart'].forEach(function(e){w.addEventListener(e,load,{once:true,passive:true});});})(window,document);`;

  return (
    <>
      <Script id="analytics-loader" strategy="afterInteractive">{delayedLoader}</Script>
      {/* 네이버 검색광고 전환추적 — dataLayer 전환 이벤트를 wcs.trans 로 번역 (public/naver-wcs.js) */}
      <Script id="naver-wcs" src="/naver-wcs.js" strategy="afterInteractive" />
      {gtmId ? (
        <noscript>
          <iframe
            title="Google Tag Manager"
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      ) : null}
      {metaPixelId ? (
        <noscript>
          {/* loading="lazy"가 없으면 ReactDOM이 1x1 픽셀을 첫 화면 이미지로 preload한다. */}
          <img
            height="1"
            width="1"
            alt=""
            loading="lazy"
            decoding="async"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
          />
        </noscript>
      ) : null}
    </>
  );
}
