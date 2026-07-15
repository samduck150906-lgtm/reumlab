/**
 * 목적별 랜딩 정적 생성기 (REUMLAB 허브)
 * - 메인 허브(index.html)의 "목적 선택"에서 이어지는 8개 목적 랜딩을 생성합니다.
 * - 플래그십 styles.css / script.js 를 공유해 디자인·상호작용을 일관되게 유지합니다.
 * - 출력: out/<slug>/index.html  (Next export 라우트와 충돌하지 않도록 빌드 최종 단계에서 주입)
 *   · 신규 slug(erp·ai-automation·platform·reservation-commerce·data-seo·service-renewal): 새로 생성
 *   · 기존 slug(mvp·website): Next가 만든 얇은 페이지를 리치 랜딩으로 덮어씀(copy:home 패턴)
 * - 익명 원칙: 실제 프로젝트명·고객사·URL 비노출. 화면은 예시 데이터 목업.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'out');
const DOMAIN = 'https://reumlab.com';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- 익명 프로젝트(문제→해결→범위) — 확정 15건 부분집합 ---------------- */
const PROJECTS = {
  'edu-erp': { title: '교육기관 운영 ERP', chip: 'ERP · 웹', shot: 'erp', problem: '수납·출결·상담이 여러 채널에 흩어져 매번 수기로 취합해야 했습니다.', build: '수강생·학부모 통합 관리, 수납·출결·상담 기록 일원화, 역할별 권한, 사용자 앱과 실시간 연동을 구현했습니다.', scope: '서비스 구조 설계 · 관리자 웹 · 데이터베이스 · 배포' },
  'edu-review': { title: '지역 교육정보 탐색·리뷰 앱', chip: '모바일 앱', shot: 'mobile', problem: '정보가 흩어져 조건에 맞는 곳을 비교하기 어려웠습니다.', build: '조건별 검색·필터, 지도 탐색, 리뷰·평점, 맞춤 추천과 운영자 관리를 함께 구축했습니다.', scope: '앱 기획 · Flutter 앱 · 추천 로직 · 관리자' },
  'life-match': { title: '생활서비스 매칭 플랫폼', chip: '웹 · 앱', shot: 'matching', problem: '견적 요청과 업체 배정이 전화·수기로 이뤄져 누락·중복이 잦았습니다.', build: '요청서 기반 매칭, 업체·고객 양면 관리, 견적·정산 흐름, 문자·카카오 알림을 구현했습니다.', scope: '플랫폼 구조 설계 · 웹/앱 · 알림 · 관리자' },
  'b2b-lead': { title: 'B2B 파트너·리드 관리 앱', chip: '앱 · 관리자', shot: 'kanban', problem: '파트너별 리드 현황이 엑셀로만 관리돼 실시간 공유가 안 됐습니다.', build: '리드 등록·단계 관리, 파트너 앱 + 본사 대시보드, 실적·정산 집계, 알림을 구현했습니다.', scope: '모노레포 설계 · 앱 + 관리자 웹 · 배포' },
  'ai-sales': { title: 'AI 기반 영업 자동화 SaaS', chip: 'AI · SaaS', shot: 'saas', problem: '반복되는 리드 정리·메시지 작성에 시간이 과도하게 들었습니다.', build: '리드 관리·시퀀스 빌더, AI 카피 초안, CRM·애널리틱스, 플랜별 요금·권한을 설계했습니다.', scope: '서비스 기획 · 웹 · AI 연동 · 결제·권한' },
  'space-booking': { title: '공간 예약·운영 웹', chip: '웹 · 예약', shot: 'calendar', problem: '예약이 여러 채널로 들어와 이중 예약·누락이 발생했습니다.', build: '실시간 예약 캘린더, 결제·환불, 운영자 관리자, 이용 안내 자동화를 구현했습니다.', scope: '예약 구조 설계 · 웹 · 결제 연동 · 관리자' },
  'soho-saas': { title: '소상공인 운영 SaaS', chip: 'SaaS', shot: 'saas', problem: '예약·고객·매출을 서로 다른 도구로 나눠 써 데이터가 흩어졌습니다.', build: '예약·고객·매출 통합, 간편 정산, 멀티 매장·권한, 모바일 대응을 구현했습니다.', scope: '서비스 구조 설계 · 웹앱 · 데이터 모델 · 배포' },
  'ai-work-hub': { title: 'AI 업무 자동화 허브', chip: 'AI · 자동화', shot: 'ai', problem: '반복 문서·요청 작성을 매번 사람이 처리해 병목이 생겼습니다.', build: '업무별 자동 생성 템플릿, 입력 몇 개로 결과 산출, 결과 관리·재사용, 사용량 기반 과금을 구현했습니다.', scope: '서비스 기획 · 웹 · AI 연동 · 과금' },
  'sns-content': { title: 'SNS 콘텐츠 자동화 서비스', chip: 'AI · 자동화', shot: 'ai', problem: '채널 콘텐츠를 매번 수작업으로 기획·제작해 발행이 밀렸습니다.', build: '주제 입력→초안 자동 생성, 이미지·문구 세트, 발행 캘린더, 톤 설정을 구현했습니다.', scope: '서비스 기획 · 웹 · AI 연동' },
  'gov-search': { title: '공공정보 AI 탐색 서비스', chip: 'AI · 검색', shot: 'search', problem: '정보가 흩어져 조건에 맞는 항목을 찾기 어려웠습니다.', build: '대화형 조건 좁히기, 조건 매칭 검색, 결과 요약, 재시도·fallback 안정성을 구현했습니다.', scope: '서비스 기획 · 웹 · AI·검색 연동' },
  'digital-market': { title: '디지털 상품 마켓플레이스', chip: '웹 · 커머스', shot: 'market', problem: '디지털 상품 판매·정산을 수기로 처리해 운영 부담이 컸습니다.', build: '상품 등록·판매, 결제·정산, 구매자·판매자 관리, 셀프 편집 관리자를 구현했습니다.', scope: '커머스 구조 설계 · 웹 · 결제 · 관리자' },
  'quote-doc': { title: '견적·청구 문서 자동화 도구', chip: '웹 · 자동화', shot: 'doc', problem: '견적서·인보이스를 매번 수기로 작성해 실수·재작업이 잦았습니다.', build: '항목 입력→문서 자동 생성, 템플릿·브랜딩, PDF 출력·발송, 이력 관리를 구현했습니다.', scope: '서비스 기획 · 웹 · 문서 생성 로직' },
  'research-writer': { title: '연구·문서 작성 보조 서비스', chip: 'AI · 문서', shot: 'doc', problem: '자료 정리와 초안 작성에 반복 작업이 많아 시간이 오래 걸렸습니다.', build: '자료 기반 초안 보조, 구조·형식 정리, 인용·근거 관리, 내보내기를 구현했습니다.', scope: '서비스 기획 · 웹 · AI 연동' },
  'data-crawl': { title: '대규모 데이터 수집·검색 시스템', chip: '데이터', shot: 'data', problem: '흩어진 대량 데이터를 수집·정리·검색할 방법이 없었습니다.', build: '대규모 수집 파이프라인, 정제·인덱싱, 빠른 검색, 중복·오류 처리를 구현했습니다.', scope: '시스템 설계 · 수집·인덱싱 · 검색 API' },
  'pseo-engine': { title: '대규모 SEO 페이지 자동화 시스템', chip: '데이터 · SEO', shot: 'data', problem: '지역·서비스 조합이 많아 수작업으로 페이지를 만들 수 없었습니다.', build: '키워드 매트릭스 자동 생성, 대량 정적 페이지 빌드, 내부 링크 클러스터링, 구조화 데이터를 구현했습니다.', scope: '시스템 설계 · 빌드 스크립트 · SEO 구조 · 사이트맵' },
};

/* ---------------- 가격 플랜 (index.html 과 동일, VAT 포함 정액) ---------------- */
const PRICING = {
  'web-starter': { name: '웹 스타터', tag: '소상공인 소개·문의용 랜딩', price: '490,000', term: '약 5일', incl: ['원페이지 랜딩 · 모바일 반응형', '문의·예약 CTA 연결', '소스코드 이관 · AI 수정 교육 1회'], note: '별도: 멀티페이지·복잡한 관리자' },
  'web-marketing': { name: '웹 + 강력 마케팅', tag: '검색·광고로 문의 늘리기', price: '980,000', term: '약 10일', featured: true, incl: ['전환 카피 설계 + 기본 SEO', 'GA·픽셀 세팅 + 광고 소재 1세트', '소스코드 이관 · AI 수정 교육 1회'], note: '별도: 유료 광고비 · 멀티페이지 확장' },
  'web-business': { name: '웹 비즈니스', tag: '멀티페이지·블로그 정식 웹', price: '1,900,000', term: '약 14일', incl: ['멀티페이지(5p 내외) + 블로그', '예약·문의 + 간단 CMS · 기본 SEO', '소스코드 이관 · AI 운영 1:1 교육'], note: '별도: 결제·회원 등 웹앱 기능' },
  'web-premium': { name: '웹 프리미엄', tag: '관리자·외부 연동 웹앱', price: '2,900,000', term: '약 21일', incl: ['고도화 웹앱 + 관리자 페이지', '외부 연동(결제·지도·메일 1~2종)', '소스코드 이관 · AI 운영 교육'], note: '별도: 앱 · 대규모 연동 · AI 기능' },
  'app-light': { name: '앱 라이트 MVP', tag: '투자·테스트용 앱 빠른 검증', price: '2,900,000', term: '약 14일', incl: ['핵심 화면 3~5개 · 기본 데이터 연동', '문의·예약 흐름', '소스코드 이관 · AI 운영 1:1 교육'], note: '별도: 결제·회원 등 스탠다드 기능' },
  'app-standard': { name: '앱 스탠다드', tag: '회원·예약·결제 초기 서비스', price: '4,900,000', term: '약 21일', featured: true, incl: ['회원/로그인 + DB + 결제 또는 예약', '기본 관리자 + 실행·수정 가이드', '소스코드 이관 · AI 운영 1:1 교육'], note: '별도: AI 기능 · 대규모 연동' },
  'app-ai': { name: '앱 AI', tag: 'AI로 운영 자동화하는 서비스', price: '6,900,000', term: '약 30일', incl: ['스탠다드 + AI 기능 1종(챗봇·추천·요약)', '업무 자동화 협의', '소스코드 이관 · AI 운영 교육'], note: '별도: AI 사용량(API) 실비 · 고도화' },
  'app-premium': { name: '앱 프리미엄', tag: '다기능·AI 고도화·연동 다수', price: '9,900,000', term: '약 45일', incl: ['멀티 기능 + AI 고도화', '운영·관리자 흐름 + 외부 연동 다수', '소스코드 이관 · AI 운영 교육'], note: '별도: 대규모 트래픽·전용 인프라 실비' },
};

/* ---------------- 목적(내비/크로스링크) ---------------- */
const PURPOSES = [
  { slug: 'mvp', label: '앱·SaaS MVP', short: '새로운 서비스 출시' },
  { slug: 'erp', label: 'ERP·관리 시스템', short: '업무를 한곳에서 관리' },
  { slug: 'ai-automation', label: 'AI 업무 자동화', short: '반복 업무를 AI로' },
  { slug: 'platform', label: '플랫폼·매칭', short: '고객과 공급자 연결' },
  { slug: 'reservation-commerce', label: '예약·결제', short: '예약·결제·회원제' },
  { slug: 'website', label: '홈페이지·랜딩', short: '문의가 들어오는 사이트' },
  { slug: 'data-seo', label: '데이터·SEO', short: '대규모 수집·노출' },
  { slug: 'service-renewal', label: '기존 서비스 개선', short: '오류 수정·리뉴얼·인수' },
];

const FAQ_COMMON = [
  { q: '개발 지식이 없어도 의뢰할 수 있나요?', a: '가능합니다. 기술 용어 대신 화면과 사용자 흐름을 기준으로 설명드리고, 꼭 필요한 기능과 우선순위를 함께 정리해 드립니다.' },
  { q: '소스코드는 모두 받을 수 있나요?', a: '네. 프로젝트 종료 시 계약 범위의 전체 소스코드와 실행·빌드·배포 방법 문서를 함께 전달합니다.' },
  { q: '도메인과 서버 계정은 누구 명의로 만들어지나요?', a: '가능하면 대표님(고객) 명의로 생성하거나 대표님 소유로 이전하는 것을 원칙으로 합니다. 배포·데이터베이스·도메인 등 주요 계정 권한을 정리해 이관합니다.' },
  { q: '계약 후 추가 비용이 발생할 수 있나요?', a: '계약서에 확정된 개발 범위는 추가 비용 없이 진행합니다. 범위 밖의 신규 기능, 외부 서비스 실비는 진행 전 비용과 일정을 먼저 안내드립니다.' },
  { q: '실제 고객사와 서비스명이 공개되지 않은 이유는 무엇인가요?', a: '고객사의 사업 정보와 서비스 전략을 보호하기 위해 일부 프로젝트명과 URL은 공개하지 않습니다. 대신 실제 구현 범위·기능·화면·개발 과정을 익명화된 사례로 제공합니다.' },
];

/* ---------------- 목적 랜딩 데이터 ---------------- */
const LANDINGS = [
  {
    slug: 'mvp', navLabel: '앱·SaaS MVP',
    metaTitle: '앱·SaaS MVP 개발 — 아이디어를 실제 서비스로 | 름랩 REUMLAB',
    metaDesc: '기획서가 없어도 핵심 기능을 정리해 앱·웹·관리자까지 배포 가능한 MVP로 제작합니다. 소스코드·운영 권한 이관 포함. 름랩.',
    eyebrow: '앱·SaaS MVP',
    h1: '아이디어를<br><span class="hl">사용자가 직접 써볼 수 있는 서비스</span>로',
    sub: '기획서가 없어도 괜찮습니다. 핵심 기능을 정리해 앱·웹·관리자까지 실제로 배포 가능한 MVP로 제작합니다.',
    subline: '기획 · 디자인 · 개발 · 배포 · 소스코드 이관',
    serviceType: '웹 MVP / 홈페이지',
    audience: ['아이디어만 있고 기획서가 없는 경우', '앱과 관리자페이지가 함께 필요한 경우', '적은 기능으로 먼저 시장 반응을 보고 싶은 경우', '지원사업이나 투자용 데모가 필요한 경우', '개발자 없이 서비스를 시작해야 하는 경우'],
    features: ['사용자 웹', 'iOS·Android 앱', '관리자페이지', '회원·권한', '결제·구독', '알림', '검색·필터', '외부 API 연동'],
    bespoke: [{ title: 'MVP 범위는 이렇게 정합니다', type: 'scope', rows: [['처음 요청', '회원가입, 커뮤니티, 채팅, 결제, AI 추천, 관리자'], ['1차 MVP', '회원가입, 핵심 콘텐츠, 신청·결제, 관리자'], ['후속 버전', '커뮤니티, 채팅, AI 추천, 고급 통계']] }],
    caseIds: ['edu-review', 'b2b-lead', 'soho-saas', 'life-match', 'ai-work-hub', 'research-writer'],
    pricingIds: ['web-starter', 'app-light', 'app-standard', 'app-premium'],
    formHint: '서비스를 한 문장으로 · 누가 사용하나요 · 반드시 필요한 기능 · 앱/웹/둘 다 · 관리자페이지 필요 여부 · 현재 단계',
    ctaLabel: '내 MVP 범위 검토받기',
  },
  {
    slug: 'erp', navLabel: 'ERP·관리 시스템',
    metaTitle: 'ERP·운영관리 시스템 개발 — 흩어진 업무를 하나로 | 름랩 REUMLAB',
    metaDesc: '회원·직원·예약·수납·상담·정산 데이터를 하나의 관리자 화면에서. 엑셀·수기 업무를 우리 회사에 맞는 운영 시스템으로 설계합니다. 름랩.',
    eyebrow: 'ERP·관리 시스템',
    h1: '엑셀과 반복 입력을<br><span class="hl">우리 회사에 맞는 운영 시스템</span>으로',
    sub: '회원·직원·예약·수납·상담·정산 데이터를 하나의 관리자 화면에서 관리할 수 있도록 설계합니다.',
    subline: '업무 인터뷰 · 데이터·권한 설계 · 관리자 개발 · 이관',
    serviceType: '운영관리 ERP·SaaS',
    audience: ['엑셀과 카카오톡으로 업무를 관리하는 사업자', '여러 지점이나 직원을 관리하는 회사', '회원·수납·출결·상담 기록을 통합하려는 업체', '고객용 앱과 내부 관리자 시스템을 연결하려는 기업', '범용 솔루션이 업무 방식과 맞지 않는 업체'],
    features: ['고객·회원 관리', '직원·권한 관리', '상담·문의 관리', '예약·일정 관리', '수납·미납 관리', '매출·정산 관리', '계약·문서 관리', '대시보드·통계', '알림·메시지', '외부 서비스 연동'],
    bespoke: [
      { title: '현재 vs 개선 후', type: 'compare', left: ['엑셀마다 정보가 다름', '직원이 바뀌면 인수인계 어려움', '요청이 카카오톡·전화에 흩어짐', '매출·미수금을 수기 계산', '관리자만 아는 업무 방식'], right: ['회원 데이터 통합', '역할별 직원 권한', '상담·처리 이력 기록', '매출·정산 자동 집계', '업무 상태 실시간 공유'] },
      { title: '실제 업무 흐름 예시', type: 'flow', steps: ['고객 신청', '담당자 배정', '상담 기록', '계약·결제', '서비스 진행', '완료 처리', '정산·통계'] },
      { title: '권한 구조', type: 'roles', items: [['대표', '전체 매출·직원·설정 관리'], ['관리자', '고객·업무·정산 관리'], ['직원', '담당 고객과 업무만 열람'], ['고객', '본인 신청·결제·진행상황 확인']] },
    ],
    caseIds: ['edu-erp', 'b2b-lead', 'soho-saas', 'space-booking', 'quote-doc'],
    pricingIds: ['web-premium', 'app-standard', 'app-ai', 'app-premium'],
    formHint: '현재 업무 관리 방식 · 사용하는 엑셀/프로그램 · 사용 직원 수 · 관리할 고객/회원 수 · 통합하고 싶은 업무 · 기존 데이터 이전 필요 여부',
    ctaLabel: '우리 회사 ERP 범위 상담하기',
  },
  {
    slug: 'ai-automation', navLabel: 'AI 업무 자동화',
    metaTitle: 'AI 업무 자동화 개발 — 반복 업무를 AI 흐름으로 | 름랩 REUMLAB',
    metaDesc: '문서 작성·검색·분류·콘텐츠·영업 업무를 귀사의 데이터와 운영 방식에 맞게 자동화합니다. 기존 서비스 AI 추가부터 AI SaaS 출시까지. 름랩.',
    eyebrow: 'AI 업무 자동화',
    h1: '사람이 반복하던 업무를<br><span class="hl">AI가 처리하는 흐름</span>으로',
    sub: '문서 작성, 검색, 분류, 콘텐츠 제작, 영업 업무를 귀사의 데이터와 운영 방식에 맞게 자동화합니다.',
    subline: '반복 업무 진단 · 자동화 설계 · AI 연동 · 검수 흐름',
    serviceType: 'AI 기능·업무 자동화',
    audience: ['매일 같은 문서·콘텐츠를 반복 작성하는 회사', '영업 자료·제안서를 자동화하려는 기업', '내부 문서 검색이 어려운 조직', '기존 서비스에 AI 기능을 넣으려는 사업자', 'AI SaaS를 상품화하려는 창업자'],
    features: ['문의 내용 분류', '문서 초안·보고서 생성', '상품 설명·SNS 콘텐츠 생성', '리드 조사·정리', '내부 자료 검색', 'FAQ 응답', '데이터 요약', '견적서·제안서 작성'],
    bespoke: [
      { title: '구축 유형', type: 'cards3', items: [['기존 서비스에 AI 추가', '현재 앱·웹에 요약·추천·검색·생성 기능을 추가'], ['사내용 AI 도구', '직원만 사용하는 문서·영업·관리 자동화 시스템'], ['AI SaaS 출시', '외부 고객에게 판매할 수 있는 AI 기반 구독 서비스']] },
      { title: '자동화 전후 예시', type: 'flow2', before: '직원이 고객 정보를 확인하고 매번 제안서 작성', after: ['고객 정보 입력', '자료 검색', '제안서 초안 생성', '직원 검수', 'PDF 출력'] },
      { title: '데이터 보안은 과장 없이 설명합니다', type: 'note', text: '어떤 데이터가 외부 AI API로 전달되는지, 저장 여부와 접근 권한을 사전에 정의합니다. "무엇이든 다 된다"고 말하지 않습니다.' },
    ],
    caseIds: ['ai-work-hub', 'ai-sales', 'sns-content', 'gov-search', 'research-writer'],
    pricingIds: ['app-ai', 'app-premium', 'web-premium'],
    formHint: '현재 반복하는 업무 · 1건 처리 시간 · 한 달 처리 건수 · 사용 중인 문서/데이터 · 결과물 검수 주체 · 사내용/외부 고객용 여부',
    ctaLabel: '자동화 가능 업무 확인하기',
  },
  {
    slug: 'platform', navLabel: '플랫폼·매칭',
    metaTitle: '플랫폼·중개·매칭 서비스 개발 — 전체 흐름 설계 | 름랩 REUMLAB',
    metaDesc: '회원 역할, 검색, 신청, 견적, 매칭, 결제, 관리자 운영까지 — 고객과 공급자를 연결하는 플랫폼의 전체 흐름을 설계합니다. 름랩.',
    eyebrow: '플랫폼·매칭',
    h1: '고객과 공급자를 연결하는<br><span class="hl">플랫폼의 전체 흐름</span>을 설계합니다',
    sub: '회원 역할, 검색, 신청, 견적, 매칭, 결제, 관리자 운영까지 하나의 서비스로 구축합니다.',
    subline: '참여자 구조 설계 · 매칭 · 결제 · 정산 · 관리자',
    serviceType: '기타 / 잘 모르겠음',
    audience: ['고객과 전문가를 연결하려는 창업자', '견적 비교 플랫폼을 만들려는 사업자', '공급자 입점·승인 구조가 필요한 서비스', '구매자·판매자·관리자 역할이 나뉘는 서비스', '지역·업종 기반 검색 플랫폼이 필요한 기업'],
    features: ['회원 역할 분리', '입점·승인', '검색·필터', '지역·지도', '신청·견적', '매칭 로직', '채팅·알림', '예약·결제', '리뷰·신고', '정산', '관리자'],
    bespoke: [
      { title: '플랫폼 참여자 구조', type: 'roles', items: [['고객', '서비스 검색·신청·결제'], ['파트너', '프로필·상품·견적·일정 관리'], ['운영자', '입점 승인·신고·정산·분쟁 관리']] },
      { title: '가장 먼저 결정할 내용', type: 'list', items: ['누가 누구를 찾는가', '매칭이 자동인가 수동인가', '결제는 플랫폼이 받는가', '수수료는 언제 발생하는가', '파트너 검증은 어떻게 하는가', '분쟁·환불은 누가 처리하는가'] },
      { title: '최소 MVP와 확장', type: 'scope', rows: [['1차', '회원 역할 · 목록 · 상세 · 신청 · 관리자'], ['2차', '결제 · 채팅 · 리뷰 · 알림'], ['3차', '추천 · 정산 · 구독 · 자동 매칭']] },
    ],
    caseIds: ['life-match', 'edu-review', 'b2b-lead', 'digital-market'],
    pricingIds: ['app-standard', 'app-premium', 'web-premium'],
    formHint: '연결하려는 두 사용자 유형 · 공급자 입점 방식 · 검색 조건 · 매칭 방식 · 결제·수수료 구조 · 채팅/리뷰/정산 필요 여부',
    ctaLabel: '플랫폼 핵심 구조 검토받기',
  },
  {
    slug: 'reservation-commerce', navLabel: '예약·결제',
    metaTitle: '예약·결제·회원제 서비스 개발 — 예약부터 운영까지 | 름랩 REUMLAB',
    metaDesc: '실시간 일정, 상품·시간 관리, 결제, 알림, 관리자 운영 화면을 사업 방식에 맞게 구축합니다. 예약 충돌 방지 구조까지. 름랩.',
    eyebrow: '예약·결제·회원제',
    h1: '예약부터 결제와 운영까지<br><span class="hl">한곳에서 처리</span>할 수 있도록',
    sub: '실시간 일정, 상품·시간 관리, 결제, 알림, 관리자 운영 화면을 사업 방식에 맞게 구축합니다.',
    subline: '예약 유형 설계 · 결제 · 충돌 방지 · 관리자',
    serviceType: '웹 MVP / 홈페이지',
    audience: ['공간대여·스튜디오·교육·상담 사업자', '시간대별 예약을 받는 서비스', '회원권이나 이용권을 판매하는 업체', '상품 주문과 결제를 온라인화하려는 브랜드', '여러 채널의 예약을 통합하려는 운영자'],
    features: ['일정 조회·예약 신청', '상품·옵션·시간 선택', '결제·취소·환불', '예약 확인·변경', '알림(문자·알림톡)', '예약 현황·운영 시간', '가격·상품 설정', '채널별 예약 통합'],
    bespoke: [
      { title: '예약 유형부터 정합니다', type: 'chips', items: ['시간 예약', '날짜·숙박 예약', '회차·수업 예약', '직원별 예약', '공간·객실 예약', '상품 주문', '회원권·이용권'] },
      { title: '고객 화면 / 관리자 화면', type: 'roles', items: [['고객 화면', '일정 조회 · 예약 신청 · 결제 · 확인 · 취소·변경 · 알림'], ['관리자 화면', '예약 현황 · 운영 시간 · 가격·상품 설정 · 고객 관리 · 취소·환불 · 매출 · 채널 통합']] },
      { title: '예약 충돌 방지 구조', type: 'list', items: ['동일 시간 중복 예약 방지', '결제 대기 시간 관리', '관리자 수동 예약 반영', '취소 시 재고 복구', '외부 채널 예약 반영'] },
      { title: '결제 범위', type: 'note', text: '실제 지원 가능한 결제 수단은 코드와 사업 범위에서 확인 후 표시합니다. 확정되지 않은 결제 수단을 미리 약속하지 않습니다.' },
    ],
    caseIds: ['space-booking', 'digital-market', 'quote-doc', 'soho-saas'],
    pricingIds: ['web-premium', 'app-standard', 'web-business'],
    formHint: '예약 대상 · 시간/일/회차 방식 · 동시 예약 가능 수량 · 결제 시점 · 취소·환불 규칙 · 관리자 수 · 현재 예약 채널 · 알림톡 필요 여부',
    ctaLabel: '예약 흐름 설계받기',
  },
  {
    slug: 'website', navLabel: '홈페이지·랜딩',
    metaTitle: '홈페이지·랜딩페이지 제작 — 문의가 들어오는 구조 | 름랩 REUMLAB',
    metaDesc: '예쁜 홈페이지를 넘어, 고객이 상담·예약·구매로 이동하도록 전환 구조로 설계합니다. 반응형·기본 SEO·관리자 수정·소스코드 이관 포함. 름랩.',
    eyebrow: '홈페이지·랜딩',
    h1: '예쁜 홈페이지를 넘어<br><span class="hl">문의가 들어오는 구조</span>로 만듭니다',
    sub: '고객이 필요한 정보를 빠르게 이해하고 상담·예약·구매로 이동할 수 있도록 설계합니다.',
    subline: '반응형 · 기본 SEO · 문의 폼 · 관리 기능 · 소스코드 이관',
    serviceType: '웹 MVP / 홈페이지',
    audience: ['기업 또는 브랜드 홈페이지가 필요한 업체', '광고 전환용 랜딩페이지가 필요한 사업자', '서비스 소개와 문의 수집이 필요한 스타트업', '검색 노출이 필요한 지역 사업자', '관리자에서 직접 수정 가능한 홈페이지가 필요한 고객'],
    features: ['반응형 디자인', '기본 SEO', '문의 폼', '분석 이벤트', '도메인 연결·배포', '관리 기능', '소스코드 이관'],
    bespoke: [
      { title: '전환 구조', type: 'flow', steps: ['광고·검색 유입', '핵심 문제 공감', '서비스 설명', '사례와 신뢰', '가격·진행 방식', '문의'] },
      { title: '제작 유형', type: 'chips', items: ['원페이지 랜딩', '기업 홈페이지', '서비스 소개 사이트', '예약형 홈페이지', '쇼핑몰·결제 사이트', '콘텐츠·SEO 사이트'] },
    ],
    caseIds: ['space-booking', 'pseo-engine', 'digital-market'],
    pricingIds: ['web-starter', 'web-marketing', 'web-business', 'web-premium'],
    formHint: '사이트 목적 · 필요 페이지 · 참고 사이트 · 로고/사진/원고 보유 여부 · 문의/예약/결제 기능 · 관리자 수정 필요 여부 · 희망 오픈일',
    ctaLabel: '내 홈페이지 범위 확인하기',
  },
  {
    slug: 'data-seo', navLabel: '데이터·SEO',
    metaTitle: '데이터·SEO 시스템 구축 — 대규모 수집·검색·자동화 | 름랩 REUMLAB',
    metaDesc: '크롤링, 정제, 검색, 인덱싱, 대규모 SEO 페이지 생성까지. 수작업으로 만들 수 없는 규모를 데이터와 자동화로 구축합니다. 름랩.',
    eyebrow: '데이터·SEO',
    h1: '수작업으로 만들 수 없는 규모를<br><span class="hl">데이터와 자동화</span>로 구축합니다',
    sub: '크롤링, 정제, 검색, 인덱싱, 대규모 SEO 페이지 생성까지 설계합니다.',
    subline: '수집 · 정제 · 인덱싱 · 페이지 자동화 · 색인 관리',
    serviceType: '데이터·SEO 시스템',
    audience: ['수백·수천 개의 검색 페이지가 필요한 업체', '외부 데이터를 자동 수집하려는 기업', '내부 또는 외부 검색 시스템이 필요한 서비스', '지역·업종별 페이지를 자동 생성하려는 사업자', '대량 콘텐츠 관리가 필요한 기업'],
    features: ['웹 데이터 수집', '공공 API 연동', '데이터 정제·중복 제거', '검색·필터', '전문 검색 인덱스', '지역·서비스 페이지 생성', '사이트맵 자동화', '콘텐츠 갱신'],
    bespoke: [
      { title: '프로그래매틱 SEO를 쉽게', type: 'note', text: '예: 지역 60개 × 서비스 20개를 조합해 검색 의도에 맞는 페이지를 자동 생성·관리합니다. 단, 중복·저품질 페이지를 무작정 찍어내지 않습니다 — 페이지별 고유 정보, 검색 의도에 맞는 콘텐츠, canonical·사이트맵, 내부 링크, 색인 상태 관리를 함께 설계합니다.' },
      { title: '데이터 흐름', type: 'flow', steps: ['수집', '검증·정제', '데이터베이스 저장', '검색·분류', '페이지·서비스 노출', '정기 업데이트'] },
      { title: '먼저 확인하는 것', type: 'list', items: ['수집 대상 사이트의 이용약관·접근 정책', '개인정보 포함 여부', '데이터 갱신 주기', '중복·오류 데이터 처리', '검색엔진 품질 정책'] },
    ],
    caseIds: ['data-crawl', 'pseo-engine', 'gov-search'],
    pricingIds: ['web-premium', 'app-premium'],
    pricingNote: '데이터·SEO 시스템은 수집 규모·출처·갱신 주기에 따라 범위가 크게 달라져, 상담·진단 후 별도 견적으로 안내드립니다. 위 금액은 참고용 상한 예시입니다.',
    formHint: '수집하려는 데이터 · 데이터 출처 · 예상 데이터 수 · 갱신 주기 · 검색 기능 필요 여부 · 자동 생성할 페이지 유형 · 현재 사이트/기술 환경',
    ctaLabel: '데이터 구축 가능 여부 확인하기',
  },
  {
    slug: 'service-renewal', navLabel: '기존 서비스 개선',
    metaTitle: '기존 서비스 오류 수정·리뉴얼·인수 개발 | 름랩 REUMLAB',
    metaDesc: '멈춰 있는 서비스를 다시 운영 가능한 상태로. 기존 소스코드·배포 환경을 먼저 점검한 뒤 오류 수정, 리뉴얼, 기능 추가, 인수 개발 가능 여부를 안내합니다. 름랩.',
    eyebrow: '기존 서비스 개선',
    h1: '멈춰 있는 서비스를<br><span class="hl">다시 운영 가능한 상태</span>로',
    sub: '기존 소스코드와 배포 환경을 먼저 점검한 뒤 오류 수정, 리뉴얼, 기능 추가 가능 여부를 안내합니다.',
    subline: '자료 점검 · 실행·빌드 확인 · 위험요소 파악 · 범위 제안',
    serviceType: '기타 / 잘 모르겠음',
    audience: ['기존 개발자와 연락이 끊긴 업체', '오류가 많아 출시하지 못하는 서비스', '느리거나 디자인이 오래된 앱·웹', '소스코드는 있지만 구조를 모르는 업체', '다른 업체가 만든 프로젝트를 이어서 개발하려는 고객'],
    features: ['오류 수정', '배포 실패 해결', '로그인·결제 문제', '속도 개선', '모바일 반응형 개선', 'UI 리뉴얼', '기능 추가', '관리자페이지 개선', '기존 프로젝트 인수', '앱스토어 재배포'],
    bespoke: [
      { title: '바로 견적을 확정할 수 없는 이유', type: 'list', items: ['기존 코드 품질', '접근 가능한 계정', '데이터베이스 구조', '사용 중인 외부 서비스', '미완성 범위', '보안 상태'] },
      { title: '진단 절차', type: 'flow', steps: ['자료 확인', '실행·빌드 점검', '구조·위험요소 파악', '수정 가능 범위 제안', '비용·일정 확정'] },
      { title: '제출해 주시면 좋은 자료', type: 'list', items: ['소스코드 또는 저장소 접근 권한', '현재 서비스 주소', '오류 화면', '관리자 계정', '서버·배포 정보', '기존 기획서', '원하는 수정 목록'] },
    ],
    caseIds: [],
    pricingIds: [],
    pricingNote: '기존 서비스는 코드 품질·계정 접근·구조에 따라 작업량이 크게 달라져, 먼저 점검(진단)한 뒤 수정 가능 범위와 비용·일정을 확정해 안내드립니다.',
    formHint: '현재 서비스 주소 · 앱/웹 여부 · 소스코드 보유 여부 · 관리자 권한 보유 여부 · 현재 가장 큰 문제 · 오픈/수정 희망일',
    ctaLabel: '서비스 인수 가능 여부 확인하기',
  },
];

/* ---------------- 화면 목업 ---------------- */
function shotHTML(type) {
  const S = {
    erp: '<div class="s-erp"><div class="s-erp__side"><i class="on"></i><i></i><i></i></div><div class="s-erp__main"><div class="s-erp__kpi"><span></span><span></span><span></span></div><div class="s-erp__chart"><b style="height:40%"></b><b style="height:70%"></b><b style="height:52%"></b><b style="height:88%"></b><b style="height:64%"></b></div></div></div>',
    mobile: '<div class="s-mob"><span class="s-mob__bar"></span><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__tab"><b></b><b></b><b></b><b></b></div></div>',
    matching: '<div class="s-match"><div class="s-match__col"><i></i><i></i><i></i></div><div class="s-match__link">⇄</div><div class="s-match__col"><i></i><i></i><i></i></div></div>',
    kanban: '<div class="s-kan"><div class="s-kan__col"><b></b><b></b></div><div class="s-kan__col"><b></b></div><div class="s-kan__col"><b></b><b></b></div></div>',
    saas: '<div class="s-saas"><div class="s-saas__kpi"><span></span><span></span></div><div class="s-saas__chart"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="0,32 20,24 40,28 60,14 80,18 100,6" fill="none" stroke="currentColor" stroke-width="2"/></svg></div></div>',
    calendar: '<div class="s-cal"><span class="s-cal__top"></span><div class="s-cal__grid"><s></s><s></s><s class="on"></s><s></s><s></s><s class="on"></s><s></s><s></s><s></s><s></s><s class="on"></s><s></s></div></div>',
    ai: '<div class="s-ai"><span class="s-ai__in"></span><span class="s-ai__arrow">↓</span><div class="s-ai__out"><i></i><i></i><i class="short"></i></div></div>',
    search: '<div class="s-srch"><span class="s-srch__bar"></span><div class="s-srch__bubble"></div><div class="s-srch__res"><i></i><i></i><i></i></div></div>',
    market: '<div class="s-mkt"><span></span><span></span><span></span><span></span><span></span><span></span></div>',
    doc: '<div class="s-doc"><span class="s-doc__h"></span><i></i><i></i><i class="short"></i><span class="s-doc__pdf">PDF</span></div>',
    data: '<div class="s-data"><span class="s-data__h"></span><i></i><i></i><i></i><i></i></div>',
  };
  return S[type] || S.erp;
}

/* ---------------- 공통 조각 ---------------- */
const TRACKING_HEAD = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WHLMP8ZD');</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YWXT6T2Y3S"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YWXT6T2Y3S');</script>`;

const PIXEL = `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1019901144020877');fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1019901144020877&ev=PageView&noscript=1" alt=""/></noscript>`;

const KAKAO_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.477 3 2 6.463 2 10.735c0 2.762 1.84 5.185 4.607 6.55-.152.53-.98 3.4-1.012 3.625 0 0-.02.166.088.23.107.063.234.014.234.014.316-.044 3.67-2.4 4.25-2.812.59.087 1.2.132 1.833.132 5.523 0 10-3.463 10-7.735S17.523 3 12 3z"/></svg>';

function header(activeSlug) {
  const items = PURPOSES.map((p) => `          <a role="menuitem" href="/${p.slug}/"><b>${esc(p.label)}</b><span>${esc(p.short)}</span></a>`).join('\n');
  const macc = PURPOSES.map((p) => `      <a href="/${p.slug}/">${esc(p.label)}</a>`).join('\n');
  return `<header class="header" id="top">
  <div class="wrap header__inner">
    <a class="logo" href="/" aria-label="REUMLAB 홈"><img class="logo__mark" src="/logo.png" alt="REUMLAB 로고" width="30" height="30" />REUMLAB <span class="logo__ko">· 름랩</span></a>
    <nav class="nav" aria-label="주요 메뉴">
      <div class="nav-dd">
        <button class="nav-dd__btn" type="button" aria-expanded="false" aria-haspopup="true">서비스 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="nav-dd__menu" role="menu">
${items}
        </div>
      </div>
      <a href="/#portfolio">포트폴리오</a>
      <a href="#pricing">가격</a>
      <a href="#process">진행 방식</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="header__cta">
      <a class="btn btn--ghost" href="tel:01081119370" data-cta="call" data-cta-loc="header">010-8111-9370</a>
      <a class="btn btn--primary" href="#contact" data-cta="apply" data-cta-loc="header">프로젝트 상담하기</a>
    </div>
    <button class="burger" id="burger" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-nav" id="mobileNav">
  <div class="mnav-acc">
    <button class="mnav-acc__btn" type="button" aria-expanded="false">서비스 <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <div class="mnav-acc__panel">
${macc}
    </div>
  </div>
  <a href="/#portfolio">포트폴리오</a>
  <a href="#pricing">가격</a>
  <a href="#process">진행 방식</a>
  <a href="#faq">FAQ</a>
  <a class="btn btn--kakao btn--block" href="https://pf.kakao.com/_xkxjQxgn" target="_blank" rel="noopener noreferrer" data-cta="kakao" data-cta-loc="mobile-nav" style="margin-top:14px;">${KAKAO_SVG}카카오톡 상담</a>
  <a class="btn btn--primary btn--block" href="#contact">프로젝트 상담하기</a>
</div>`;
}

function crossNav(activeSlug) {
  const links = PURPOSES.filter((p) => p.slug !== activeSlug).map((p) => `<a href="/${p.slug}/">${esc(p.label)}</a>`).join('<span aria-hidden="true">·</span>');
  return `<div class="lx-cross"><span>다른 제작 유형 보기</span><nav aria-label="다른 제작 유형">${links}</nav></div>`;
}

function casesSection(caseIds) {
  if (!caseIds || !caseIds.length) return '';
  const cards = caseIds.map((id) => {
    const p = PROJECTS[id];
    if (!p) return '';
    return `      <article class="lx-case">
        <div class="lx-case__shot shot" aria-hidden="true">${shotHTML(p.shot)}</div>
        <div class="lx-case__body">
          <span class="pf-chip">${esc(p.chip)}</span>
          <h3>${esc(p.title)}</h3>
          <p class="lx-case__lbl">문제</p><p class="lx-case__t">${esc(p.problem)}</p>
          <p class="lx-case__lbl">구현</p><p class="lx-case__t">${esc(p.build)}</p>
          <p class="lx-case__scope"><b>담당 범위</b> ${esc(p.scope)}</p>
        </div>
      </article>`;
  }).join('\n');
  return `<section class="section section--soft" id="cases">
  <div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow">CASES</span><h2 class="sec-title">이 목적과 관련된 익명 사례</h2><p class="sec-sub">고객사 요청에 따라 프로젝트명·URL·화면 속 개인정보는 비공개 처리했습니다.</p></div>
    <div class="lx-cases">
${cards}
    </div>
  </div>
</section>`;
}

function bespokeSection(b) {
  let inner = '';
  if (b.type === 'list') inner = `<ul class="lx-list">${b.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  else if (b.type === 'chips') inner = `<div class="lx-chips">${b.items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>`;
  else if (b.type === 'note') inner = `<div class="lx-note"><span class="lx-note__i" aria-hidden="true">!</span><p>${esc(b.text)}</p></div>`;
  else if (b.type === 'flow') inner = `<div class="lx-flow">${b.steps.map((s, i) => `<span class="lx-flow__s">${esc(s)}</span>${i < b.steps.length - 1 ? '<span class="lx-flow__a" aria-hidden="true">→</span>' : ''}`).join('')}</div>`;
  else if (b.type === 'flow2') inner = `<div class="lx-flow2"><div class="lx-flow2__b"><span class="lx-flow2__lbl">기존</span>${esc(b.before)}</div><div class="lx-flow2__arrow" aria-hidden="true">↓</div><div class="lx-flow">${b.after.map((s, i) => `<span class="lx-flow__s">${esc(s)}</span>${i < b.after.length - 1 ? '<span class="lx-flow__a" aria-hidden="true">→</span>' : ''}`).join('')}</div></div>`;
  else if (b.type === 'scope') inner = `<div class="lx-scope">${b.rows.map((r) => `<div class="lx-scope__row"><span class="lx-scope__k">${esc(r[0])}</span><span class="lx-scope__v">${esc(r[1])}</span></div>`).join('')}</div>`;
  else if (b.type === 'compare') inner = `<div class="lx-compare"><div class="lx-compare__col lx-compare__col--x"><span class="lx-compare__h">현재</span>${b.left.map((x) => `<p><i aria-hidden="true">✕</i>${esc(x)}</p>`).join('')}</div><div class="lx-compare__col lx-compare__col--v"><span class="lx-compare__h">개선 후</span>${b.right.map((x) => `<p><i aria-hidden="true">✓</i>${esc(x)}</p>`).join('')}</div></div>`;
  else if (b.type === 'roles') inner = `<div class="lx-roles">${b.items.map((r) => `<div class="lx-role"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}</div>`;
  else if (b.type === 'cards3') inner = `<div class="lx-cards3">${b.items.map((c) => `<div class="lx-card3"><b>${esc(c[0])}</b><p>${esc(c[1])}</p></div>`).join('')}</div>`;
  return `<div class="lx-bespoke reveal"><h3 class="lx-bespoke__t">${esc(b.title)}</h3>${inner}</div>`;
}

function pricingSection(ids, note) {
  const cards = (ids || []).map((id) => {
    const p = PRICING[id];
    if (!p) return '';
    const incl = p.incl.map((x) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l4 4L19 6" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(x)}</li>`).join('');
    return `        <div class="price-card${p.featured ? ' featured' : ''}">
          <div class="price-card__label"><span class="price-name">${esc(p.name)}</span>${p.featured ? '<span class="pill badge-rec">추천</span>' : ''}</div>
          <div class="price-tag-label">${esc(p.tag)}</div>
          <div class="price-amount">${esc(p.price)}<small> 원</small></div>
          <span class="price-term"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${esc(p.term)} · VAT 포함</span>
          <ul class="price-incl">${incl}</ul>
          <p class="price-note">${esc(p.note)}</p>
          <a class="btn ${p.featured ? 'btn--primary' : 'btn--ghost'} btn--block" href="#contact" data-cta="apply" data-cta-loc="pricing" data-plan="${esc(p.name)}">${esc(p.name)} 상담하기</a>
        </div>`;
  }).join('\n');
  const grid = cards ? `<div class="price-grid--4" style="margin-top:8px;">\n${cards}\n      </div>` : '';
  const noteBlock = note ? `<div class="price-policy reveal" style="margin-top:${cards ? '26px' : '0'};"><div class="price-policy__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.54 0 2.99.39 4.26 1.07"/></svg></div><div class="price-policy__txt"><b>범위에 따라 견적이 달라집니다.</b>${esc(note)}</div></div>` : '';
  const policy = cards ? `<div class="price-policy reveal" style="margin-top:24px;"><div class="price-policy__ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.54 0 2.99.39 4.26 1.07"/></svg></div><div class="price-policy__txt"><b>계약서에 확정된 개발 범위는 추가 비용 없이 진행합니다.</b>범위 밖의 신규 기능·외부 서비스 실비는 진행 전 비용과 일정을 먼저 안내합니다.</div></div>` : '';
  return `<section class="section section--soft" id="pricing">
  <div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow">PRICING</span><h2 class="sec-title">이 목적에 맞는 가격</h2><p class="sec-sub">VAT 포함 정액 기준입니다. 전체 가격은 <a href="/#pricing" style="color:var(--accent-d);font-weight:700;">메인 가격표</a>에서 확인하실 수 있습니다.</p></div>
    ${grid}
    ${noteBlock || policy}
  </div>
</section>`;
}

const PROCESS = `<section class="section" id="process">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">PROCESS</span><h2 class="sec-title">맡기면 어떻게 진행되는지</h2></div>
    <ol class="lx-proc">
      <li><b>01</b><h3>문의 및 가능 여부 검토</h3><p>핵심 기능·일정·예산을 받고 구현 가능 여부, 권장 범위, 예상 비용 구간을 안내합니다.</p></li>
      <li><b>02</b><h3>범위 확정</h3><p>포함 기능과 제외 범위를 나눠 확정하고, 화면 구조·일정·결제 단계를 제공합니다.</p></li>
      <li><b>03</b><h3>화면·기능 제작</h3><p>확인 가능한 테스트 화면과 진행 내역을 공유하며 방향을 맞춥니다.</p></li>
      <li><b>04</b><h3>통합 테스트</h3><p>핵심 흐름·모바일 반응형·권한·오류를 QA 체크리스트로 점검합니다.</p></li>
      <li><b>05</b><h3>배포 및 인수인계</h3><p>운영 서비스·소스코드·주요 계정과 운영 가이드·수정 방법을 전달합니다.</p></li>
    </ol>
  </div>
</section>`;

const HANDOVER = `<section class="section">
  <div class="wrap">
    <div class="sec-head reveal"><span class="eyebrow">HANDOVER</span><h2 class="sec-title">완성된 서비스뿐 아니라,<br class="br-pc">직접 운영할 수 있는 권한까지 전달합니다.</h2><p class="sec-sub">외주사에 종속되지 않도록 결과물과 함께 아래 항목을 정리해 이관합니다.</p></div>
    <ul class="hlist reveal">
      <li><span class="hlist__ck" aria-hidden="true">✓</span>최종 소스코드</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>배포 환경·프로젝트 권한</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>데이터베이스 권한</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>도메인 연결 정보</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>관리자 계정</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>주요 환경변수 목록</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>운영·수정 가이드</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>기본 장애 대응 방법</li>
      <li><span class="hlist__ck" aria-hidden="true">✓</span>계약 범위 운영 교육</li>
    </ul>
  </div>
</section>`;

function faqSection() {
  const items = FAQ_COMMON.map((f) => `      <div class="faq-item"><button class="faq-q"><span class="qm">Q</span>${esc(f.q)}<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="faq-a"><div class="faq-a__in">${esc(f.a)}</div></div></div>`).join('\n');
  return `<section class="section section--soft" id="faq">
  <div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow">FAQ</span><h2 class="sec-title">자주 묻는 질문</h2></div>
    <div class="faq reveal">
${items}
    </div>
  </div>
</section>`;
}

function contactSection(land) {
  return `<section class="section" id="contact">
  <div class="wrap">
    <div class="final">
      <div class="final__intro reveal">
        <span class="eyebrow">START</span>
        <h2 class="sec-title">${esc(land.navLabel)} 프로젝트,<br class="br-pc">가능한 범위부터 정리해드립니다.</h2>
        <p class="sec-sub">완성된 기획서가 없어도 괜찮습니다. 필요한 내용만 적어주시면 검토 후 가능한 범위와 예상 비용을 먼저 안내드립니다.</p>
        <ul class="final__trust">
          <li><span aria-hidden="true">✓</span>문의만으로 계약이 진행되지 않습니다</li>
          <li><span aria-hidden="true">✓</span>범위와 비용을 확인한 뒤 결정할 수 있습니다</li>
          <li><span aria-hidden="true">✓</span>전달한 내용은 견적 검토 목적으로만 사용합니다</li>
        </ul>
        <p class="final__alt">전화·카카오가 편하시면 — <a href="tel:01081119370" data-cta="call" data-cta-loc="final-intro">010-8111-9370</a> · <a href="mailto:ceo@eternalsix.com" data-cta="email" data-cta-loc="final-intro">ceo@eternalsix.com</a> · <a href="https://pf.kakao.com/_xkxjQxgn" target="_blank" rel="noopener noreferrer" data-cta="kakao" data-cta-loc="final-intro">카카오톡 채널</a></p>
      </div>
      <div class="final__form reveal d1">
        <div class="af-card">
          <div class="af-head"><span class="af-badge"><span class="dot"></span>프로젝트 검토 요청</span><h3 class="af-title">필요한 내용만 적어주세요</h3><p class="af-desc">${esc(land.navLabel)} 기준으로 검토해 안내드립니다.</p></div>
          <form class="af-form" name="main-apply" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" data-reum-apply>
            <input type="hidden" name="form-name" value="main-apply" />
            <p class="af-hp" aria-hidden="true"><label>이 칸은 비워두세요 <input name="bot-field" tabindex="-1" autocomplete="off" /></label></p>
            <input type="hidden" name="유입_랜딩" value="${esc(land.slug)}" />
            <input type="hidden" name="utm_source" data-utm="utm_source" /><input type="hidden" name="utm_medium" data-utm="utm_medium" /><input type="hidden" name="utm_campaign" data-utm="utm_campaign" /><input type="hidden" name="utm_content" data-utm="utm_content" /><input type="hidden" name="utm_term" data-utm="utm_term" /><input type="hidden" name="fbclid" data-utm="fbclid" />
            <div class="af-row">
              <div class="af-field"><label class="af-label" for="af-name">이름 또는 업체명 <span class="af-req">*</span></label><input id="af-name" class="af-input" name="이름" type="text" placeholder="예: 홍길동 / 름랩" required autocomplete="name" /></div>
              <div class="af-field"><label class="af-label" for="af-phone">연락처 <span class="af-req">*</span></label><input id="af-phone" class="af-input" name="휴대폰번호" type="tel" inputmode="numeric" placeholder="010-1234-5678" required autocomplete="tel" /></div>
            </div>
            <div class="af-row">
              <div class="af-field"><label class="af-label" for="af-email">이메일</label><input id="af-email" class="af-input" name="이메일" type="email" placeholder="name@example.com" autocomplete="email" /></div>
              <div class="af-field"><label class="af-label" for="af-type">서비스 유형</label>
                <select id="af-type" class="af-input af-select" name="서비스유형">
                  <option value="웹 MVP / 홈페이지"${land.serviceType === '웹 MVP / 홈페이지' ? ' selected' : ''}>웹 MVP / 홈페이지</option>
                  <option value="모바일 앱 (Flutter)"${land.serviceType === '모바일 앱 (Flutter)' ? ' selected' : ''}>모바일 앱 (Flutter)</option>
                  <option value="운영관리 ERP·SaaS"${land.serviceType === '운영관리 ERP·SaaS' ? ' selected' : ''}>운영관리 ERP·SaaS</option>
                  <option value="AI 기능·업무 자동화"${land.serviceType === 'AI 기능·업무 자동화' ? ' selected' : ''}>AI 기능·업무 자동화</option>
                  <option value="데이터·SEO 시스템"${land.serviceType === '데이터·SEO 시스템' ? ' selected' : ''}>데이터·SEO 시스템</option>
                  <option value="기타 / 잘 모르겠음"${land.serviceType === '기타 / 잘 모르겠음' ? ' selected' : ''}>기타 / 잘 모르겠음</option>
                </select>
              </div>
            </div>
            <div class="af-field"><label class="af-label" for="af-features">핵심 내용</label><textarea id="af-features" class="af-input af-textarea" name="핵심기능" rows="3" placeholder="참고: ${esc(land.formHint)}"></textarea></div>
            <div class="af-row">
              <div class="af-field"><label class="af-label" for="af-budget">예상 예산</label><select id="af-budget" class="af-input af-select" name="예상예산"><option value="" selected>선택해 주세요</option><option>100만 원 이하</option><option>100만 ~ 300만 원</option><option>300만 ~ 500만 원</option><option>500만 ~ 1,000만 원</option><option>1,000만 원 이상</option><option>아직 미정</option></select></div>
              <div class="af-field"><label class="af-label" for="af-timeline">원하는 일정</label><select id="af-timeline" class="af-input af-select" name="희망일정"><option value="" selected>선택해 주세요</option><option>최대한 빠르게</option><option>1개월 내</option><option>1 ~ 3개월</option><option>3개월 이상</option><option>미정</option></select></div>
            </div>
            <label class="af-check"><input type="checkbox" name="개인정보동의" value="동의" required /><span>(필수) <a href="/privacy/" target="_blank" rel="noopener">개인정보 수집·이용</a>에 동의합니다. 전달한 내용은 견적 검토 목적으로만 사용합니다.</span></label>
            <p class="af-error" role="alert" hidden>전송에 실패했어요. 잠시 후 다시 시도하거나 010-8111-9370으로 연락 주세요.</p>
            <button type="submit" class="btn btn--primary btn--block af-submit">${esc(land.ctaLabel)}</button>
            <div class="af-or"><span>전화가 부담되면</span></div>
            <a class="btn btn--kakao btn--block af-kakao" href="https://pf.kakao.com/_xkxjQxgn" target="_blank" rel="noopener noreferrer" data-cta="kakao" data-cta-loc="final-form">${KAKAO_SVG}카카오톡으로 먼저 물어보기</a>
          </form>
          <div class="af-done" role="status" aria-live="polite" hidden><div class="af-done-ico" aria-hidden="true">✓</div><h3>검토 요청이 접수됐어요!</h3><p>영업일 기준 1~2일 내에 남겨 주신 연락처로 안내드릴게요.<br />급하시면 <a href="tel:01081119370">010-8111-9370</a>으로 전화 주세요.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

const FOOTER = `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a class="logo" href="/"><img class="logo__mark" src="/logo.png" alt="REUMLAB 로고" width="30" height="30" />REUMLAB <span class="logo__ko">· 름랩</span></a>
        <p class="footer__tag">앱·웹·AI 개발 스튜디오 · 소스코드·운영 권한 이관 · 콘텐츠 수정 운영 교육</p>
        <p class="footer__local">화성 동탄(동탄첨단산업단지)에 위치한 앱·웹·AI 개발 스튜디오입니다. 경기 남부 전역과 전국 어디서든 의뢰하실 수 있습니다.</p>
        <nav class="footer__links" aria-label="제작 목적" style="margin-top:16px;display:flex;flex-wrap:wrap;gap:10px 16px;font-size:13px;">
${PURPOSES.map((p) => `          <a href="/${p.slug}/">${esc(p.label)}</a>`).join('\n')}
          <a href="/">메인 허브</a>
        </nav>
      </div>
      <div>
        <h4>사업자 정보</h4>
        <ul class="footer__info"><li><span>대표자</span>성아름</li><li><span>사업자등록</span>793-12-03247</li><li><span>주소</span>경기도 화성시 동탄첨단산업1로 58, 307호(영천동)</li><li><span>영업시간</span>평일 10:00–18:00</li></ul>
      </div>
      <div>
        <h4>상담 · 문의</h4>
        <ul class="footer__info"><li><span>전화</span><a href="tel:01081119370" data-cta="call" data-cta-loc="footer">010-8111-9370</a></li><li><span>이메일</span><a href="mailto:ceo@eternalsix.com" data-cta="email" data-cta-loc="footer">ceo@eternalsix.com</a></li></ul>
        <a class="btn btn--primary" href="#contact" data-cta="apply" data-cta-loc="footer" style="margin-top:18px;min-height:46px;">프로젝트 상담하기</a>
      </div>
    </div>
    <div class="footer__bottom"><span>© 2026 REUMLAB · 름랩. All rights reserved.</span><nav aria-label="법적 고지" style="display:flex;flex-wrap:wrap;gap:4px 14px;"><a href="/privacy/">개인정보처리방침</a><a href="/terms/">이용약관</a><a href="/refund/">환불정책</a></nav></div>
  </div>
</footer>
<div class="mcta" id="mcta" role="navigation" aria-label="빠른 상담 바로가기">
  <a class="mcta__btn mcta__btn--kakao" href="https://pf.kakao.com/_xkxjQxgn" target="_blank" rel="noopener noreferrer" data-cta="kakao" data-cta-loc="sticky-bar">${KAKAO_SVG}<span>카톡 상담</span></a>
  <a class="mcta__btn mcta__btn--call" href="tel:01081119370" data-cta="call" data-cta-loc="sticky-bar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>전화</span></a>
  <a class="mcta__btn mcta__btn--apply" href="#contact" data-cta="apply" data-cta-loc="sticky-bar"><span>프로젝트 상담하기</span></a>
</div>
<script src="/script.js"></script>`;

function jsonLd(land) {
  const url = `${DOMAIN}/${land.slug}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: land.navLabel + ' 개발', serviceType: land.navLabel, provider: { '@type': 'Organization', name: 'REUMLAB · 름랩', url: DOMAIN + '/' }, areaServed: { '@type': 'Country', name: '대한민국' }, description: land.metaDesc, url },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: DOMAIN + '/' },
        { '@type': 'ListItem', position: 2, name: land.navLabel, item: url },
      ] },
      { '@type': 'FAQPage', mainEntity: FAQ_COMMON.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };
  return `<script type="application/ld+json">\n${JSON.stringify(graph)}\n</script>`;
}

function renderLanding(land) {
  const url = `${DOMAIN}/${land.slug}/`;
  const audience = land.audience.map((x) => `        <li><span class="lx-fit__ck" aria-hidden="true">✓</span>${esc(x)}</li>`).join('\n');
  const feats = land.features.map((x) => `        <li>${esc(x)}</li>`).join('\n');
  const bespoke = (land.bespoke || []).map(bespokeSection).join('\n');
  const cases = casesSection(land.caseIds);
  const pricing = pricingSection(land.pricingIds, land.pricingNote);

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${TRACKING_HEAD}
<title>${esc(land.metaTitle)}</title>
<meta name="theme-color" content="#0a1830">
<meta name="description" content="${esc(land.metaDesc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:url" content="${url}"><meta property="og:site_name" content="REUMLAB · 름랩">
<meta property="og:title" content="${esc(land.metaTitle)}"><meta property="og:description" content="${esc(land.metaDesc)}">
<meta property="og:image" content="${DOMAIN}/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(land.metaTitle)}"><meta name="twitter:description" content="${esc(land.metaDesc)}"><meta name="twitter:image" content="${DOMAIN}/og-image.jpg">
${jsonLd(land)}
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.className = "js";</script>
${PIXEL}
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WHLMP8ZD" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
${header(land.slug)}
<main>
<section class="hero hero--lx">
  <div class="wrap hero__grid">
    <div class="hero__text">
      <span class="hero__eyebrow reveal"><span class="dot"></span>${esc(land.eyebrow)}</span>
      <h1 class="reveal d1">${land.h1}</h1>
      <p class="hero__sub reveal d2">${esc(land.sub)}</p>
      <ul class="hero__trust reveal d2">${(land.subline || '').split(' · ').map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <div class="hero__cta reveal d3">
        <a class="btn btn--primary btn--lg" href="#contact" data-cta="apply" data-cta-loc="hero" data-hero-cta="primary">${esc(land.ctaLabel)}</a>
        <a class="btn btn--ghost btn--lg" href="#cases" data-hero-cta="portfolio">관련 사례 보기</a>
      </div>
      ${crossNav(land.slug)}
    </div>
    <div class="hero__stage reveal d2" role="img" aria-label="${esc(land.navLabel)} 관련 익명 화면 예시">
      <div class="mock mock--erp" aria-hidden="true"><div class="mock__chrome"><span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__url">example.com</span></div><div class="mock__body"><div class="mock__side"><span class="mock__logo"></span><i class="mock__nav is-on"></i><i class="mock__nav"></i><i class="mock__nav"></i><i class="mock__nav"></i></div><div class="mock__main"><div class="mock__kpis"><span><b>1,240</b>건</span><span><b>98</b>진행</span><span><b>₩4.2M</b>정산</span></div><div class="mock__chart"><i style="height:38%"></i><i style="height:62%"></i><i style="height:48%"></i><i style="height:80%"></i><i style="height:66%"></i><i style="height:92%"></i></div><div class="mock__rows"><i></i><i></i><i></i></div></div></div></div>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="wrap lx-2col">
    <div class="lx-fit reveal">
      <div class="sec-head"><span class="eyebrow">FIT</span><h2 class="sec-title">이런 상황에 적합합니다</h2></div>
      <ul class="lx-fit__list">
${audience}
      </ul>
    </div>
    <div class="lx-feats reveal d1">
      <div class="sec-head"><span class="eyebrow">BUILD</span><h2 class="sec-title">제작 가능한 구성</h2></div>
      <ul class="lx-feat-grid">
${feats}
      </ul>
    </div>
  </div>
</section>

${bespoke ? `<section class="section"><div class="wrap"><div class="lx-bespokes">${bespoke}</div></div></section>` : ''}

${cases}
${PROCESS}
${pricing}
${HANDOVER}
${faqSection()}
${contactSection(land)}
</main>
${FOOTER}
</body>
</html>
`;
}

/* ---------------- 실행 ---------------- */
let written = 0;
for (const land of LANDINGS) {
  const dir = path.join(OUT, land.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderLanding(land), 'utf8');
  written++;
}
console.log(`✓ purpose landings generated: ${written} → ${path.relative(ROOT, OUT)}/<slug>/index.html`);
console.log(`  slugs: ${LANDINGS.map((l) => l.slug).join(', ')}`);
