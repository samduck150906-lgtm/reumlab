import Link from '@/components/SiteLink';
import type { SeoWebsiteIndustry } from '@/lib/seo-website';

export default function SeoWebsiteIndustryEnhancement({ profile }: { profile: SeoWebsiteIndustry }) {
  return (
    <section className="section-inner" aria-labelledby={`seo-website-${profile.slug}`} style={{ paddingTop: 8 }}>
      <p className="section-tag">검색형 홈페이지 구성 예시</p>
      <h2 id={`seo-website-${profile.slug}`} className="section-title" style={{ fontSize: '1.3rem' }}>
        {profile.label} 고객이 비교하는 정보를 먼저 설계합니다
      </h2>
      <p className="hub-intro">{profile.summary}</p>
      <div className="link-grid" style={{ marginTop: 18 }}>
        <div>
          <strong>홈페이지에서 구분할 정보</strong>
          <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.8 }}>
            {profile.decisionInfo.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>업체가 준비할 자료</strong>
          <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.8 }}>
            {profile.materials.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
      <p className="hub-intro" style={{ marginTop: 16 }}>
        <strong>고객사 문의폼 구성 예시:</strong> {profile.formExample.join(' · ')}. 이 항목은 고객사 홈페이지에 넣을 수 있는 예시이며,
        아래 름랩 제작 상담폼의 수집 항목과는 다릅니다.
      </p>
      <p className="hub-intro" style={{ marginTop: 12 }}>
        검색·문의 구조까지 함께 새로 설계해야 한다면{' '}
        <a href={`/seo-website/?industry=${encodeURIComponent(profile.slug)}#inquiry`} data-analytics={`seo_website_industry_${profile.slug}`} data-cta-type="form" data-cta-location="industry">우리 {profile.label} 홈페이지 제작 상담하기</a>에서 제작 범위와 검색 등록 기준을 확인하세요.
      </p>
    </section>
  );
}
