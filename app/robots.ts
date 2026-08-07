import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

/**
 * robots.txt 단일 출처.
 *
 * public/robots.txt 는 scripts/prepare-next-public.mjs 가 빌드 전에 지운다(이 파일만 남김).
 * scripts/generate-robots.mjs 는 build:legacy 전용이라 실제 빌드에서 실행되지 않는다.
 *
 * ⚠️ robots.txt 그룹 매칭 규칙
 *  크롤러는 자기 이름과 가장 구체적으로 맞는 그룹 "하나만" 읽고 나머지는 무시한다.
 *  즉 `User-agent: GPTBot` 그룹이 있으면 GPTBot 은 `User-agent: *` 의 Disallow 를 보지 않는다.
 *  → 아래 DISALLOW 를 모든 그룹이 공유하도록 코드로 묶었다.
 *    새 차단 경로는 반드시 DISALLOW 배열에만 추가할 것(그룹별로 손으로 적지 말 것).
 */

/**
 * 색인 대상이 아닌 경로.
 *
 * `/*index.txt$` — Next App Router 가 정적 export 때 라우트마다 함께 내보내는
 * RSC(React Server Component) 페이로드다(out/**‍/index.txt, 현재 1,409개).
 * 사람이 읽을 페이지가 아니라 클라이언트 라우팅용 직렬화 데이터이고, HTML 어디에서도
 * 링크되지 않는다. 색인되면 본문이 깨진 형태로 중복 노출된다.
 * 페이지 HTML 은 완결된 정적 문서라 이 파일을 막아도 크롤러 렌더링에는 영향이 없다.
 * 패턴이 정확히 `index.txt` 로 끝나는 경로만 잡으므로 /llms.txt, /robots.txt,
 * IndexNow 키 파일(/reumlab2026indexnow9370.txt)은 그대로 열려 있다.
 *
 * /admin·/api·/auth 같은 경로는 이 프로젝트에 존재하지 않는다(정적 export, 서버 라우트 없음).
 * 없는 경로를 미리 적어 두지 않는다.
 *
 * CSS·JS·이미지·폰트·/_next/static 은 절대 막지 않는다 — 크롤러가 페이지를 그대로 렌더링해야 한다.
 */
const DISALLOW = ['/*index.txt$'];

/**
 * 생성형 검색 크롤러 — 공개 마케팅·서비스 콘텐츠를 읽도록 명시 허용한다.
 * (와일드카드로도 이미 허용되지만, "의도적 허용"임을 문서로 남기고
 *  나중에 정책이 바뀔 때 한 곳에서 뒤집을 수 있게 그룹을 따로 둔다.)
 */
const AI_CRAWLERS = [
  'GPTBot', // OpenAI 학습 크롤러
  'OAI-SearchBot', // ChatGPT 검색 색인
  'ChatGPT-User', // 사용자 요청 시 실시간 조회
  'ClaudeBot', // Anthropic 크롤러
  'Claude-SearchBot', // Claude 검색 색인
  'PerplexityBot', // Perplexity 색인
];

export default function robots(): MetadataRoute.Robots {
  // 모든 그룹이 같은 허용/차단 정책을 공유한다 (위 그룹 매칭 규칙 주석 참고)
  const policy = { allow: '/', disallow: DISALLOW };

  return {
    rules: [
      // Googlebot·Googlebot-Image·Bingbot 등은 이 그룹으로 충분하다.
      // 같은 정책을 이름별로 반복하면 한쪽만 고쳐지는 사고만 늘어난다.
      { userAgent: '*', ...policy },
      // 네이버 Yeti — 서치어드바이저가 명시 그룹을 권장한다.
      { userAgent: 'Yeti', ...policy },
      { userAgent: AI_CRAWLERS, ...policy },
    ],
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain.replace(/^https?:\/\//, ''),
  };
}
