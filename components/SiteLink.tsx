import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { isStaticOverride, withTrailingSlash } from '@/lib/static-routes';

/**
 * 사이트 전역에서 쓰는 링크. next/link 를 이 컴포넌트로 감싸 두 가지를 바로잡는다.
 *
 * 1) prefetch 기본값을 끈다
 *    App Router 의 <Link> 는 화면에 들어오면 그 경로의 RSC 페이로드(index.txt)를 미리 받는다.
 *    이 사이트는 링크가 많은 콘텐츠 사이트라 그 비용이 본문보다 커졌다 — 실측으로
 *    /cost/ 는 한 번 열 때 prefetch 61건 2,263KB(전체 전송의 69%), /guide/ 는 40건 1,792KB 였다.
 *    방문자는 보통 링크 하나만 누르므로 거의 전부 버려진다. 누를 때 받으면 충분하다.
 *
 * 2) 후처리가 덮어쓰는 경로는 실제 페이지 이동으로 보낸다
 *    /, /mvp/, /website/ 등은 빌드 후처리가 Next 렌더 결과를 정적 HTML 로 덮어쓴다.
 *    <Link> 로 가면 HTML 을 다시 받지 않아 배포본이 아닌 Next 컴포넌트가 그려진다.
 *    자세한 근거와 목록은 lib/static-routes.ts 주석 참고.
 *
 * 그래도 prefetch 가 필요한 링크가 생기면 `prefetch` 를 명시적으로 넘기면 된다.
 */
type NextLinkProps = Parameters<typeof NextLink>[0];

export default function SiteLink({
  href,
  prefetch,
  children,
  ...rest
}: NextLinkProps & { children?: ReactNode }) {
  const target = typeof href === 'string' ? href : null;

  if (target && isStaticOverride(target)) {
    // next/link 전용 prop 은 <a> 로 넘기지 않는다
    const { replace, scroll, shallow, passHref, legacyBehavior, locale, ...anchor } =
      rest as Record<string, unknown>;
    return (
      // next.config 의 trailingSlash: true 를 직접 맞춰 준다 — next/link 가 해 주던 일이다
      <a href={withTrailingSlash(target)} {...(anchor as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} prefetch={prefetch ?? false} {...rest}>
      {children}
    </NextLink>
  );
}
