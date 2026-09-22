export const SEO_WEBSITE_SERVICE_KEY = 'seo_website' as const;
export const SEO_WEBSITE_REQUESTED_SERVICE = '검색 잘되는 홈페이지 제작' as const;

export const SEO_WEBSITE_INDUSTRY_CHOICES = [
  '미정', '청소', '이사', '철거', '누수·설비', '방수', '인테리어', '에어컨', '폐기물', '인력', '제조·산업용 제품', '기타',
] as const;
export type SeoWebsiteIndustryChoice = (typeof SEO_WEBSITE_INDUSTRY_CHOICES)[number];

export const SEO_WEBSITE_STATUS_CHOICES = ['잘 모르겠음', '홈페이지 없음', '홈페이지 있음', '신규 제작 검토'] as const;
export type SeoWebsiteStatusChoice = (typeof SEO_WEBSITE_STATUS_CHOICES)[number];

export const SEO_WEBSITE_SCOPE_CHOICES = ['아직 미정', '신규 홈페이지', '지역·서비스 페이지 구성', '문의 연결', '관리자'] as const;
export type SeoWebsiteScopeChoice = (typeof SEO_WEBSITE_SCOPE_CHOICES)[number];

export const SEO_WEBSITE_INDUSTRY_ENUM: Record<SeoWebsiteIndustryChoice, string> = {
  '미정': 'UNDECIDED', '청소': 'CLEANING', '이사': 'MOVING', '철거': 'DEMOLITION', '누수·설비': 'LEAK', '방수': 'WATERPROOFING',
  '인테리어': 'INTERIOR', '에어컨': 'AIR_CONDITIONING', '폐기물': 'WASTE', '인력': 'STAFFING', '제조·산업용 제품': 'MANUFACTURING', '기타': 'OTHER',
};

export const SEO_WEBSITE_SCOPE_ENUM: Record<SeoWebsiteScopeChoice, string> = {
  '아직 미정': 'UNDECIDED', '신규 홈페이지': 'STANDARD', '지역·서비스 페이지 구성': 'REGIONAL', '문의 연결': 'INQUIRY', '관리자': 'ADMIN',
};

export const SEO_WEBSITE_FIELD_NAMES = {
  requestedService: 'requested_service',
  serviceKey: 'service_key',
  inquiryType: 'inquiry_type',
  industry: 'industry',
  siteStatus: 'site_status',
  currentSiteUrl: 'current_site_url',
  serviceRegion: 'service_region',
  interestScope: 'interest_scope',
  sourceLanding: 'source_landing',
  currentPage: 'current_page',
  ctaLocation: 'cta_location',
} as const;

export function inquiryTypeForStatus(status: SeoWebsiteStatusChoice): 'new_website' | 'existing_improvement' | 'undecided' {
  if (status === '홈페이지 있음') return 'existing_improvement';
  if (status === '홈페이지 없음' || status === '신규 제작 검토') return 'new_website';
  return 'undecided';
}

const choiceBySlug: Record<string, SeoWebsiteIndustryChoice> = {
  cleaning: '청소', moving: '이사', demolition: '철거', 'leak-detection': '누수·설비', waterproofing: '방수',
  interior: '인테리어', 'air-conditioning': '에어컨', 'waste-removal': '폐기물', staffing: '인력', manufacturing: '제조·산업용 제품',
};

export function seoWebsiteIndustryFromSlug(value: string | null | undefined): SeoWebsiteIndustryChoice | undefined {
  return value ? choiceBySlug[value] : undefined;
}

