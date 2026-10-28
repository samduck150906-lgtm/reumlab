import { agencyPages } from './catalog';
import type { AgencyPage } from './types';
import { AGENCY_BASE } from './types';

/**
 * 개발사 안내(/development-agency/)의 범위별 하위 허브.
 *
 * 왜 필요한가 (2026-10 네이버 색인 감사)
 *  루트 허브 한 페이지가 상세 1,795개를 접힌 목록으로 전부 품어 HTML 이 2.4MB 였다(사이트 중앙값 151KB).
 *  수집기가 그 한 페이지에서 1,800개 링크를 따라가 주길 기대하는 구조라, 상세 974개는 다른 어디서도
 *  링크를 받지 못했다. 루트는 범위 10개와 범위 밖 안내만 싣고, 범위마다 하위 허브가 자기 상세를 싣는다.
 *
 * 범위 키는 상세 슬러그의 첫 세그먼트와 같다(website/…, ai/… 등). 그래서 하위 허브 주소는
 * /development-agency/<key>/ 로, 상세 주소의 부모 경로가 된다. 첫 세그먼트가 없는 초기 원고 98건과
 * order/ 1건은 범위에 넣지 않고 루트 허브가 직접 싣는다.
 *
 * 수동 검수 스크립트 scripts/development-agency/verify.mts 는 상세 사이트맵을 카탈로그(허브+상세)와
 * 대조하므로 여기 추가된 하위 허브 URL 을 'new-sitemap-added' 로 보고한다 — 빌드·테스트 체인에는 없다.
 */
export interface AgencyCategory {
  key: string;
  /** 범위 이름 — 상세 페이지의 serviceAxis 대표 표기 */
  label: string;
  title: string;
  description: string;
  /** 허브 머리글 2~3문장. 범위마다 다르게 쓴다 — 하위 허브 10개가 같은 틀로 읽히지 않게. */
  intro: string;
  /** 이 범위와 맞닿은 서비스 페이지 */
  service: { href: string; label: string };
}

export const AGENCY_CATEGORIES: readonly AgencyCategory[] = [
  {
    key: 'website',
    label: '홈페이지·웹사이트',
    title: '업종별 홈페이지·웹사이트 개발 범위 안내 — 개발사 름랩',
    description: '업종별 홈페이지·웹사이트 개발 범위 안내. 방문자가 결정할 정보, 운영자가 갱신할 항목, 문의 접수 흐름을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '홈페이지는 방문자가 무엇을 비교하고 어디서 문의하는지를 먼저 정해야 구조가 잡힙니다. 이 범위의 안내는 업종마다 방문자의 결정 정보, 운영자가 갱신할 항목, 접수 뒤 회신 흐름을 어떤 화면으로 나눌지 적었습니다.',
    service: { href: '/web-development/', label: '웹사이트·랜딩페이지 제작' },
  },
  {
    key: 'app',
    label: '앱·어플',
    title: '업종별 앱·어플 개발 범위 안내 — 개발사 름랩',
    description: '업종별 앱·어플 개발 범위 안내. 사용자 역할, 매일 쓰는 화면, 알림과 예외 처리, 스토어 심사 전 확인 항목을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '앱은 매일 여는 화면 한두 개가 쓰임새를 좌우합니다. 업종마다 손님·직원·관리자가 각각 어떤 화면을 쓰는지, 알림과 예외를 어떻게 처리하는지, 스토어 심사 전에 무엇을 확인해야 하는지를 범위별로 적었습니다.',
    service: { href: '/app-development/', label: '앱개발 외주' },
  },
  {
    key: 'management',
    label: '관리 프로그램·ERP',
    title: '업종별 관리 프로그램·ERP 개발 범위 안내 — 개발사 름랩',
    description: '업종별 관리 프로그램·ERP 개발 범위 안내. 엑셀과 수기로 하던 주문·재고·정산·일정 업무를 어떤 화면과 권한으로 옮길지 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '관리 프로그램은 지금 쓰는 엑셀과 양식이 곧 설계도입니다. 업종마다 어떤 업무가 반복되고 어디서 되돌아가는지, 역할별 권한과 데이터 항목을 어떻게 나눌지, 처음 범위와 나중 확장을 어떻게 가를지를 안내합니다.',
    service: { href: '/erp/', label: '맞춤형 ERP·관리 시스템 개발' },
  },
  {
    key: 'ai',
    label: 'AI·GPT 자동화',
    title: '업종별 AI·GPT 자동화 개발 범위 안내 — 개발사 름랩',
    description: '업종별 AI·GPT 자동화 개발 범위 안내. 반복 문의 응답, 문서 분류·요약, 검토 보조처럼 AI 에 맡길 일과 사람이 확인할 일을 업종마다 가른 개발사 름랩의 안내 목록입니다.',
    intro: 'AI 자동화에서 중요한 것은 무엇을 맡기고 무엇을 사람이 확인할지의 경계입니다. 업종마다 반복 문의·문서 분류·검토 보조 가운데 자동화할 단계와 사람 승인이 필요한 단계, 틀렸을 때의 처리 방식을 적었습니다.',
    service: { href: '/ai-automation/', label: 'AI 업무 자동화 개발' },
  },
  {
    key: 'booking',
    label: '예약·일정',
    title: '업종별 예약·일정 시스템 개발 범위 안내 — 개발사 름랩',
    description: '업종별 예약·일정 시스템 개발 범위 안내. 예약 신청부터 확정·변경·취소·알림까지의 흐름과 담당자 배정, 결제 연동 여부를 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '예약은 신청보다 변경과 취소에서 문제가 생깁니다. 업종마다 예약 단위(시간·담당자·자원), 확정 전후의 상태, 취소·환불 규칙, 알림 시점을 어떻게 설계하고 결제와 이어 붙일지를 안내합니다.',
    service: { href: '/reservation-commerce/', label: '예약·결제 시스템 개발' },
  },
  {
    key: 'ecommerce',
    label: '쇼핑몰·커머스',
    title: '업종별 쇼핑몰·커머스 개발 범위 안내 — 개발사 름랩',
    description: '업종별 쇼핑몰·커머스 개발 범위 안내. 상품·옵션·주문·배송·반품과 결제(PG) 연동, 운영자 관리 화면을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '쇼핑몰은 상품 수보다 주문 뒤의 처리가 범위를 정합니다. 업종마다 상품·옵션 구조, 주문·배송·반품 흐름, 결제(PG) 연동과 정산 확인, 운영자가 매일 보는 관리 화면을 어떻게 나눌지를 적었습니다. 결제 연동은 토스페이먼츠 협력사로서 가입부터 함께 진행합니다.',
    service: { href: '/payment-integration/', label: '결제·PG 연동 개발 (토스페이먼츠 협력사)' },
  },
  {
    key: 'platform',
    label: '플랫폼·중개',
    title: '업종별 플랫폼·중개 서비스 개발 범위 안내 — 개발사 름랩',
    description: '업종별 플랫폼·중개 서비스 개발 범위 안내. 수요자·공급자·운영자 화면, 매칭과 정산, 분쟁 처리와 첫 버전 범위를 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '중개 플랫폼은 세 종류의 사용자가 서로 다른 화면을 씁니다. 업종마다 수요자·공급자·운영자의 흐름, 매칭 기준, 수수료와 정산, 분쟁이 생겼을 때의 처리, 첫 버전에서 뺄 것을 안내합니다.',
    service: { href: '/platform/', label: '플랫폼·매칭 서비스 개발' },
  },
  {
    key: 'portal',
    label: '고객·파트너 포털',
    title: '업종별 고객·파트너 포털 개발 범위 안내 — 개발사 름랩',
    description: '업종별 고객·파트너 포털 개발 범위 안내. 거래처·회원·협력사가 직접 조회하고 요청하는 화면과 내부 승인 흐름, 권한 구분을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '포털은 전화와 메일로 오가던 요청을 상대가 직접 조회·요청하는 화면으로 옮기는 일입니다. 업종마다 거래처·회원·협력사에게 무엇을 보여 주고 무엇을 요청받을지, 내부 승인과 권한을 어떻게 나눌지를 적었습니다.',
    service: { href: '/admin-page-development/', label: '관리자 페이지 개발' },
  },
  {
    key: 'field',
    label: '현장·작업 관리',
    title: '업종별 현장·작업 관리 앱 개발 범위 안내 — 개발사 름랩',
    description: '업종별 현장·작업 관리 앱 개발 범위 안내. 작업 지시·체크리스트·사진 보고·완료 확인과 사무실 화면의 연결, 오프라인 상황을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '현장 앱은 손에 장갑을 낀 채로도 쓸 수 있어야 합니다. 업종마다 작업 지시와 체크리스트, 사진·위치 보고, 완료 확인과 사무실 화면의 연결, 통신이 끊긴 상황의 처리를 어떻게 설계할지를 안내합니다.',
    service: { href: '/ai-worker/', label: 'AI Worker 구축' },
  },
  {
    key: 'membership',
    label: '회원·멤버십',
    title: '업종별 회원·멤버십 시스템 개발 범위 안내 — 개발사 름랩',
    description: '업종별 회원·멤버십 시스템 개발 범위 안내. 가입·등급·회차권·구독과 출결·알림, 만료와 환불 규칙을 업종마다 정리한 개발사 름랩의 안내 목록입니다.',
    intro: '멤버십은 가입보다 만료와 재등록에서 운영 부담이 생깁니다. 업종마다 회원 등급·회차권·구독의 구조, 출결과 알림, 만료 전 안내와 환불 규칙, 운영자가 확인할 화면을 어떻게 나눌지를 적었습니다.',
    service: { href: '/app-development/', label: '앱개발 외주' },
  },
];

const BY_KEY = new Map(AGENCY_CATEGORIES.map((c) => [c.key, c]));

export function agencyCategory(key: string): AgencyCategory | undefined {
  return BY_KEY.get(key);
}

export function agencyCategoryHref(category: Pick<AgencyCategory, 'key'>): string {
  return `${AGENCY_BASE}${category.key}/`;
}

/** 상세 페이지가 속한 범위 — 슬러그 첫 세그먼트. 없으면 undefined(루트 허브가 직접 싣는다) */
export function agencyCategoryOf(page: Pick<AgencyPage, 'slug'>): AgencyCategory | undefined {
  const i = page.slug.indexOf('/');
  return i > 0 ? BY_KEY.get(page.slug.slice(0, i)) : undefined;
}

const PAGES_BY_KEY = new Map<string, AgencyPage[]>(AGENCY_CATEGORIES.map((c) => [c.key, []]));
export const AGENCY_UNCATEGORIZED: readonly AgencyPage[] = agencyPages.filter((page) => {
  const c = agencyCategoryOf(page);
  if (!c) return true;
  PAGES_BY_KEY.get(c.key)!.push(page);
  return false;
});
for (const list of PAGES_BY_KEY.values()) list.sort((a, b) => a.primaryKeyword.localeCompare(b.primaryKeyword, 'ko'));

export function agencyCategoryPages(key: string): readonly AgencyPage[] {
  return PAGES_BY_KEY.get(key) ?? [];
}

// 범위 키가 상세 슬러그와 겹치면 /development-agency/<key>/ 가 두 페이지를 가리킨다 — 빌드에서 막는다.
for (const c of AGENCY_CATEGORIES) {
  if (agencyPages.some((p) => p.slug === c.key)) throw new Error(`Agency category key collides with a page slug: ${c.key}`);
}

/** 목록 카드용 한 문장 요약 — 첫 문장, 최대 110자 */
export function agencyCardSummary(description: string): string {
  const first = (description.match(/^[^.!?]+[.!?]/) ?? [description])[0].trim();
  return first.length <= 110 ? first : `${first.slice(0, 108).replace(/[\s·,]+$/, '')}…`;
}
