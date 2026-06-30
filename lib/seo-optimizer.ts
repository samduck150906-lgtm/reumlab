// SEO 최적화 엔진 - Google & Naver 상위노출 전문

export interface SEOMetrics {
  title: string;
  description: string;
  keywords: string[];
  contentLength: number;
  headingStructure: string[];
  imageCount: number;
  internalLinks: string[];
  readingTime: number;
  score: number;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface MetaTags {
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  googlebot: string;
  naverbot: string;
}

// Google & Naver SEO 최적화 엔진
export class SEOOptimizer {
  // 구조화된 데이터 (JSON-LD) 생성 - Article
  generateArticleSchema(post: {
    title: string;
    description: string;
    keywords: string[];
    content: string;
    region?: string;
    publishedAt: string;
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `https://reumlab.com/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}#article`,
      isPartOf: {
        '@id': 'https://reumlab.com',
      },
      author: {
        '@type': 'Organization',
        name: 'REUMLAB',
        url: 'https://reumlab.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://reumlab.com/logo.png',
          width: 250,
          height: 60,
        },
      },
      headline: post.title,
      description: post.description,
      image: {
        '@type': 'ImageObject',
        url: `https://reumlab.com/images/${post.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        width: 1200,
        height: 630,
      },
      datePublished: post.publishedAt,
      dateModified: new Date().toISOString(),
      mainEntity: {
        '@type': 'WebPage',
        '@id': `https://reumlab.com/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`,
      },
      keywords: post.keywords.join(', '),
      articleBody: post.content,
      wordCount: post.content.split(/\s+/).length,
      inLanguage: 'ko',
      publisher: {
        '@type': 'Organization',
        name: 'REUMLAB',
        logo: {
          '@type': 'ImageObject',
          url: 'https://reumlab.com/logo.png',
          width: 250,
          height: 60,
        },
      },
    };
  }

  // FAQPage 구조화된 데이터 생성
  generateFAQSchema(faqs: Array<{ q: string; a: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };
  }

  // Organization 구조화된 데이터
  generateOrganizationSchema(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'REUMLAB',
      url: 'https://reumlab.com',
      logo: 'https://reumlab.com/logo.png',
      description: '앱 개발, 웹개발, 홈페이지 제작 비용 · 기간 완벽 정리',
      sameAs: [
        'https://facebook.com/reumlab',
        'https://twitter.com/reumlab',
        'https://instagram.com/reumlab',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '동탄첨단산업1로 58, 307호(영천동)',
        addressLocality: '화성시',
        addressRegion: '경기도',
        postalCode: '18469',
        addressCountry: 'KR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: '상담',
        telephone: '+82-10-8111-9370',
        email: 'ceo@eternalsix.com',
      },
    };
  }

  // BreadcrumbList 구조화된 데이터
  generateBreadcrumbSchema(path: string[]): StructuredData {
    const breadcrumbs = [
      { name: 'Home', url: 'https://reumlab.com' },
      { name: 'Blog', url: 'https://reumlab.com/blog' },
      ...path.map((item, idx) => ({
        name: item,
        url: `https://reumlab.com/blog/${path.slice(0, idx + 1).join('/')}`,
      })),
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  // LocalBusiness 구조화된 데이터 (지역 검색 최적화)
  generateLocalBusinessSchema(region: string): StructuredData {
    const regionMap: Record<string, { name: string; address: string }> = {
      수원: { name: '수원지점', address: '경기도 수원시' },
      서울: { name: '서울지점', address: '서울시' },
      경기: { name: '경기지점', address: '경기도' },
      인천: { name: '인천지점', address: '인천시' },
      부산: { name: '부산지점', address: '부산시' },
      대구: { name: '대구지점', address: '대구시' },
      대전: { name: '대전지점', address: '대전시' },
    };

    const location = regionMap[region] || { name: region, address: region };

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `REUMLAB ${location.name}`,
      image: 'https://reumlab.com/logo.png',
      description: `${region}의 앱 개발, 웹개발, 홈페이지 제작 전문가`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.address,
        addressCountry: 'KR',
      },
      priceRange: '₩₩₩',
      ratingValue: 4.8,
      reviewCount: 150,
      areaServed: region,
    };
  }

  // 메타 태그 생성
  generateMetaTags(post: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    region?: string;
  }): MetaTags {
    const baseUrl = 'https://reumlab.com';
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const mainKeyword = post.keywords[0];
    const regionSuffix = post.region ? ` - ${post.region}` : '';

    return {
      canonical: postUrl,
      ogTitle: `${post.title}${regionSuffix} | REUMLAB`,
      ogDescription: post.description,
      ogImage: `${baseUrl}/og-images/${post.slug}.jpg`,
      ogUrl: postUrl,
      twitterCard: 'summary_large_image',
      twitterTitle: `${mainKeyword} 완벽 가이드${regionSuffix}`,
      twitterDescription: post.description,
      twitterImage: `${baseUrl}/og-images/${post.slug}.jpg`,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      googlebot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      naverbot: 'index, follow, naver-site-verification',
    };
  }

  // HTML 헤드 섹션 생성
  generateHTMLHead(post: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    region?: string;
    content: string;
    faqs?: Array<{ q: string; a: string }>;
    publishedAt: string;
  }): string {
    const metaTags = this.generateMetaTags(post);
    const regionSuffix = post.region ? ` - ${post.region}` : '';

    let head = `<!-- SEO Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${metaTags.ogDescription}">
<meta name="keywords" content="${post.keywords.join(', ')}">
<meta name="author" content="REUMLAB">
<meta name="robots" content="${metaTags.robots}">
<meta name="googlebot" content="${metaTags.googlebot}">
<meta name="naver-site-verification" content="NAVER_VERIFICATION_CODE">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="${metaTags.ogTitle}">
<meta property="og:description" content="${metaTags.ogDescription}">
<meta property="og:image" content="${metaTags.ogImage}">
<meta property="og:url" content="${metaTags.ogUrl}">
<meta property="og:site_name" content="REUMLAB">
<meta property="og:locale" content="ko_KR">

<!-- Twitter Card -->
<meta name="twitter:card" content="${metaTags.twitterCard}">
<meta name="twitter:title" content="${metaTags.twitterTitle}">
<meta name="twitter:description" content="${metaTags.twitterDescription}">
<meta name="twitter:image" content="${metaTags.twitterImage}">

<!-- Canonical -->
<link rel="canonical" href="${metaTags.canonical}">

<!-- Language/Region -->
<link rel="alternate" hreflang="ko-KR" href="${metaTags.canonical}">

<!-- Structured Data - Article -->
<script type="application/ld+json">
${JSON.stringify(this.generateArticleSchema(post), null, 2)}
</script>

<!-- Structured Data - Organization -->
<script type="application/ld+json">
${JSON.stringify(this.generateOrganizationSchema(), null, 2)}
</script>

<!-- Structured Data - BreadcrumbList -->
<script type="application/ld+json">
${JSON.stringify(this.generateBreadcrumbSchema([post.region || '전국', post.title.split(' ')[0]]), null, 2)}
</script>

<!-- Structured Data - LocalBusiness -->
${
  post.region
    ? `<script type="application/ld+json">
${JSON.stringify(this.generateLocalBusinessSchema(post.region), null, 2)}
</script>`
    : ''
}

<!-- Structured Data - FAQ -->
${
  post.faqs && post.faqs.length > 0
    ? `<script type="application/ld+json">
${JSON.stringify(this.generateFAQSchema(post.faqs), null, 2)}
</script>`
    : ''
}

<!-- Performance & Speed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://www.google-analytics.com">

<!-- Title -->
<title>${post.title}${regionSuffix} | REUMLAB</title>
`;

    return head;
  }

  // 핵심 웹 지표 (Core Web Vitals) 최적화 권장사항
  generateCoreWebVitalsRecommendations(): string[] {
    return [
      '이미지 최적화: WebP 포맷 사용, 크기 최소화',
      'CSS/JS 최소화 및 코드 분할',
      'Lazy loading 이미지와 iframe 구현',
      '폰트 최적화: WOFF2 포맷, 서브셋 폰트 사용',
      '렌더링 블로킹 제거: async/defer 속성 사용',
      'CDN 활용으로 배송 시간 단축',
      '서버 응답 시간 개선 (TTFB < 600ms)',
      'First Input Delay (FID) 개선',
      'Cumulative Layout Shift (CLS) 방지',
    ];
  }

  // 네이버 검색 최적화
  generateNaverSEOOptimizations(post: {
    title: string;
    keywords: string[];
    region?: string;
  }): Record<string, any> {
    return {
      // 네이버 특화: 콘텐츠 설명이 더 상세할수록 유리
      contentDescription: `${post.title}에 대한 완벽한 가이드. ${post.region || '전국'} 기준으로 비용, 기간, 선택 기준을 상세히 설명합니다.`,

      // 네이버: 카테고리 분류 중요
      categories: [
        '서비스 > 개발/설계',
        post.region ? `지역 > ${post.region}` : '지역 > 전국',
      ],

      // 네이버: 관련 키워드 확장
      relatedKeywords: [
        post.keywords[0],
        post.keywords[0] + ' 비용',
        post.keywords[0] + ' 기간',
        post.keywords[0] + ' 견적',
        post.keywords[0] + ' 업체',
        post.region ? `${post.region} ${post.keywords[0]}` : '',
      ].filter(Boolean),

      // 네이버 제목 최적화
      naverTitle: `${post.keywords[0]} | 비용·기간·선택 기준 완벽 정리${post.region ? ` #${post.region}` : ''}`,

      // 메타 설명 (네이버 기준 최대 200자)
      naverDescription: `${post.region || '전국'}에서 ${post.keywords[0]}할 때 필요한 모든 정보. 실제 비용, 소요 기간, 업체 선택 기준까지 한눈에 정리했습니다.`,

      // SNS 공유 최적화
      socialOptimization: {
        enableSharing: true,
        hashTags: post.keywords.slice(0, 3),
        socialDescription: `${post.keywords[0]} 완벽 가이드 - 비용, 기간, 선택 기준까지 모두 정리했습니다.`,
      },
    };
  }

  // 구글 검색 최적화
  generateGoogleSEOOptimizations(post: {
    title: string;
    keywords: string[];
    content: string;
  }): Record<string, any> {
    const contentLength = post.content.split(/\s+/).length;

    return {
      // 구글: E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
      EEAT: {
        experience: '10+ 년 업계 경력',
        expertise: '500+ 프로젝트 완료',
        authoritativeness: '업계 전문가 인증',
        trustworthiness: '고객 만족도 95%+',
      },

      // 구글: 콘텐츠 길이 (최소 2000자 권장)
      contentMetrics: {
        wordCount: contentLength,
        recommended: contentLength >= 2000 ? '✓ 최적' : '✗ 2000자 이상 권장',
        readingTime: Math.ceil(contentLength / 200) + '분',
      },

      // 구글: 헤딩 구조 최적화
      headingOptimization: {
        rule: 'H1 1개, H2 여러 개, H3 세부 내용',
        example: {
          h1: post.title,
          h2: ['개념 이해', '비용 정리', '선택 기준', '자주하는 질문'],
        },
      },

      // 구글: 내부 링킹
      internalLinking: {
        strategy: '관련 글 5개 이상 링크',
        benefits: [
          '페이지 권위성 높임',
          'SEO 신호 전달',
          '사용자 체류시간 증가',
        ],
      },

      // 구글: 외부 링크 (백링크)
      backlinkStrategy: [
        '고권위 사이트로부터 링크 획득',
        '업계 관련 블로그, 포럼에 언급',
        '소셜 미디어 공유 및 확산',
        'PR 뉴스레터 배포',
      ],

      // 구글: 모바일 최적화
      mobileOptimization: {
        responsive: '반응형 디자인 필수',
        touchFriendly: '터치 요소 간격 48px 이상',
        performance: '모바일 로드 시간 3초 이내',
      },
    };
  }

  // SEO 점수 계산
  calculateSEOScore(post: {
    title: string;
    description: string;
    keywords: string[];
    content: string;
    headingCount: number;
    imageCount: number;
    internalLinkCount: number;
  }): { score: number; feedback: string[] } {
    let score = 0;
    const feedback: string[] = [];

    // 제목 길이 (최적: 50-60자)
    if (post.title.length >= 50 && post.title.length <= 60) {
      score += 10;
    } else if (post.title.length > 30) {
      score += 5;
      feedback.push(`제목 길이 최적화: ${post.title.length}자 (권장: 50-60자)`);
    }

    // 설명 길이 (최적: 150-160자)
    if (post.description.length >= 150 && post.description.length <= 160) {
      score += 10;
    } else if (post.description.length > 100) {
      score += 5;
      feedback.push(`설명 길이 최적화: ${post.description.length}자 (권장: 150-160자)`);
    }

    // 콘텐츠 길이 (최소: 2000자)
    const contentLength = post.content.split(/\s+/).length;
    if (contentLength >= 2000) {
      score += 15;
    } else {
      score += 5;
      feedback.push(`콘텐츠 길이: ${contentLength}자 (권장: 2000자 이상)`);
    }

    // 키워드 (최적: 3-5개)
    if (post.keywords.length >= 3 && post.keywords.length <= 5) {
      score += 10;
    } else {
      score += 5;
      feedback.push(`키워드 개수: ${post.keywords.length}개 (권장: 3-5개)`);
    }

    // 제목에 주요 키워드 포함
    if (post.title.includes(post.keywords[0])) {
      score += 10;
    }

    // 헤딩 구조
    if (post.headingCount >= 5) {
      score += 10;
    } else {
      feedback.push(`헤딩 개수: ${post.headingCount}개 (권장: 5개 이상)`);
    }

    // 이미지
    if (post.imageCount >= 3) {
      score += 10;
    } else {
      feedback.push(`이미지: ${post.imageCount}개 (권장: 3개 이상)`);
    }

    // 내부 링크
    if (post.internalLinkCount >= 5) {
      score += 10;
    } else {
      feedback.push(`내부 링크: ${post.internalLinkCount}개 (권장: 5개 이상)`);
    }

    // 구조화된 데이터
    score += 10;

    return {
      score: Math.min(score, 100),
      feedback,
    };
  }
}
