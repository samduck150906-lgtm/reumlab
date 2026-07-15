// REUMLAB — interactions & anonymized portfolio (single source of content)
(function () {
  "use strict";

  /* ============================================================
     0) 분석 이벤트 헬퍼 — dataLayer(GA4/GTM) push. 중복 방지 유틸 포함.
     ============================================================ */
  function pushDL(obj) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(obj); } catch (e) {}
  }
  var fired = {}; // 1회성 이벤트 가드
  function once(key, obj) { if (fired[key]) return; fired[key] = true; pushDL(obj); }

  /* ============================================================
     1) 익명 포트폴리오 데이터 — 실제 프로젝트를 분야·기능 중심으로 익명화.
        고객사·서비스명·URL·개인정보 없음. 화면은 예시 데이터 목업.
        비개발자 우선 정보 순서: 문제 → 해결/기능 → 결과물 → 기술
     ============================================================ */
  var PROJECTS = [
    {
      id: "edu-erp", cat: "erp web", chip: "ERP · 웹", shot: "erp",
      title: "교육기관 운영 ERP",
      problem: "수납·출결·상담이 여러 채널에 흩어져, 매번 수기로 취합해야 했습니다.",
      features: ["수강생·학부모 통합 관리", "수납·출결·상담 기록 일원화", "역할별 관리자 권한", "사용자 앱과 실시간 데이터 연동"],
      scope: "서비스 구조 설계 · 관리자 웹 개발 · 데이터베이스 · 배포",
      detail: {
        overview: "여러 채널에 흩어져 있던 수납·출결·상담 업무를 하나의 관리자 화면에서 처리하도록 설계한 교육기관용 운영 ERP입니다.",
        problemDetail: "출결은 메신저, 수납은 엑셀, 상담은 수기 메모로 나뉘어 있어 담당자가 매번 자료를 옮겨 담아야 했고, 누락과 중복이 잦았습니다.",
        structure: ["사용자 앱", "API", "데이터베이스", "관리자 ERP"],
        userFlow: ["관리자가 수강생·클래스 등록", "출결·수납·상담을 한 화면에서 기록", "기록이 사용자 앱에 실시간 반영", "역할별 권한으로 열람 범위 제한"],
        operator: ["역할별 관리자 계정 발급", "수납·출결·상담 통합 조회", "데이터 내보내기"],
        tech: ["Flutter", "관리자 웹(React)", "PostgreSQL(Supabase)", "권한(RLS)", "알림"],
        deliverables: ["전체 소스코드", "관리자 웹 + 사용자 앱", "실행·배포 문서", "관리자 계정 · 주요 권한 정리"]
      }
    },
    {
      id: "edu-review", cat: "app", chip: "모바일 앱", shot: "mobile",
      title: "지역 교육정보 탐색·리뷰 앱",
      problem: "지역 교육 정보가 흩어져 있어, 조건에 맞는 곳을 비교하기 어려웠습니다.",
      features: ["조건별 검색·필터", "지도 기반 탐색", "리뷰·평점", "맞춤 추천"],
      scope: "앱 기획 · Flutter 앱 개발 · 추천 로직 · 관리자 연동",
      detail: {
        overview: "지역 교육 정보를 조건별로 탐색하고 리뷰로 비교할 수 있는 크로스플랫폼 모바일 앱입니다.",
        problemDetail: "정보가 블로그·전화·방문으로 흩어져 있어 사용자가 조건(지역·과목·시간)에 맞는 곳을 한눈에 비교하기 어려웠습니다.",
        structure: ["모바일 앱", "검색·추천 API", "데이터베이스", "관리자"],
        userFlow: ["조건 입력 후 검색·필터", "지도·목록으로 결과 비교", "상세에서 리뷰·평점 확인", "관심 등록·문의 연결"],
        operator: ["콘텐츠·정보 등록/수정", "리뷰 신고 관리", "노출 정책 설정"],
        tech: ["Flutter", "검색·추천 로직", "지도 SDK", "PostgreSQL", "푸시 알림"],
        deliverables: ["전체 소스코드", "iOS·Android 앱", "관리자", "실행·배포 문서"]
      }
    },
    {
      id: "life-match", cat: "web app", chip: "웹 · 앱", shot: "matching",
      title: "생활서비스 매칭 플랫폼",
      problem: "견적 요청과 업체 배정이 전화·수기로 이뤄져 누락과 중복이 잦았습니다.",
      features: ["요청서 기반 매칭", "업체·고객 양면 관리", "견적·정산 흐름", "문자·카카오 알림"],
      scope: "플랫폼 구조 설계 · 웹/앱 개발 · 알림 연동 · 관리자",
      detail: {
        overview: "고객 요청서를 기준으로 업체를 매칭하고, 견적부터 정산까지 한 흐름으로 연결한 생활서비스 매칭 플랫폼입니다.",
        problemDetail: "요청과 배정이 전화·엑셀로 처리돼 누가 어디에 배정됐는지 추적이 어렵고, 중복 배정과 누락이 발생했습니다.",
        structure: ["고객", "매칭 엔진", "업체", "관리자·정산"],
        userFlow: ["고객이 요청서 작성", "조건에 맞는 업체 매칭", "업체가 견적 제시·수락", "진행·정산 상태 추적"],
        operator: ["요청·배정 현황 관리", "업체·고객 관리", "정산 집계"],
        tech: ["Next.js", "모바일 앱", "PostgreSQL", "문자·카카오 알림"],
        deliverables: ["전체 소스코드", "웹 + 앱 + 관리자", "알림 연동 설정", "실행·배포 문서"]
      }
    },
    {
      id: "b2b-lead", cat: "app erp", chip: "모바일 앱 · 관리자", shot: "kanban",
      title: "B2B 파트너·리드 관리 앱",
      problem: "파트너별 리드 현황이 엑셀로만 관리돼 실시간 공유가 안 됐습니다.",
      features: ["리드 등록·단계 관리", "파트너용 앱 + 본사 대시보드", "실적·정산 집계", "알림"],
      scope: "모노레포 설계 · 앱 + 관리자 웹 · 공통 모듈 · 배포",
      detail: {
        overview: "파트너용 앱과 본사 관리자 대시보드를 하나의 워크스페이스로 묶어, 리드 현황을 실시간으로 공유하는 B2B 관리 도구입니다.",
        problemDetail: "리드가 파트너별 엑셀에 흩어져 본사가 전체 현황을 실시간으로 볼 수 없었고, 실적 집계가 수작업이었습니다.",
        structure: ["파트너 앱", "공통 API", "데이터베이스", "본사 대시보드"],
        userFlow: ["파트너가 리드 등록", "단계별 진행 상태 업데이트", "본사 대시보드에 실시간 집계", "실적·정산 자동 계산"],
        operator: ["파트너·리드 관리", "실적·정산 리포트", "권한별 접근 제어"],
        tech: ["React Native/Expo", "Next.js 관리자", "공통(shared) 패키지", "PostgreSQL", "알림"],
        deliverables: ["전체 소스코드(모노레포)", "앱 + 관리자", "실행·배포 문서", "계정·권한 정리"]
      }
    },
    {
      id: "ai-sales", cat: "ai erp", chip: "AI · SaaS", shot: "saas",
      title: "AI 기반 영업 자동화 SaaS",
      problem: "반복되는 영업 리드 정리·메시지 작성에 시간이 과도하게 들었습니다.",
      features: ["리드 관리·시퀀스 빌더", "AI 카피 초안 생성", "CRM·애널리틱스", "플랜별 요금·권한"],
      scope: "서비스 기획 · 웹 개발 · AI 연동 · 결제·권한 설계",
      detail: {
        overview: "리드 관리와 시퀀스 발송을 자동화하고, AI로 메시지 초안을 만들어 영업 반복 업무를 줄이는 B2B SaaS입니다.",
        problemDetail: "리드 정리와 메시지 작성을 매번 사람이 처리해, 인원이 늘어도 발송량이 병목이었습니다.",
        structure: ["사용자 웹", "AI·시퀀스 엔진", "데이터베이스", "결제·권한"],
        userFlow: ["리드 업로드·정리", "시퀀스(단계별 메시지) 구성", "AI가 카피 초안 제안", "성과를 대시보드로 추적"],
        operator: ["플랜·요금 관리", "사용량·권한 제어", "레이트리밋 설정"],
        tech: ["Next.js(App Router)", "TypeScript", "AI 연동", "결제", "다국어(i18n)"],
        deliverables: ["전체 소스코드", "관리자·요금 설정", "실행·배포 문서", "계정·키 정리"]
      }
    },
    {
      id: "space-booking", cat: "web erp", chip: "웹 · 예약", shot: "calendar",
      title: "공간 예약·운영 웹",
      problem: "예약이 여러 채널로 들어와 이중 예약과 누락이 발생했습니다.",
      features: ["실시간 예약 캘린더", "결제·환불 흐름", "운영자 관리자", "이용 안내 자동화"],
      scope: "예약 구조 설계 · 웹 개발 · 결제 연동 · 관리자",
      detail: {
        overview: "실시간 예약 캘린더와 결제·환불을 한 화면에서 처리하고, 운영자가 직접 관리하도록 만든 공간 예약·운영 웹입니다.",
        problemDetail: "전화·메신저·폼으로 예약이 분산돼 같은 시간대 이중 예약과 확인 누락이 반복됐습니다.",
        structure: ["예약 웹", "예약·결제 API", "데이터베이스", "운영자 관리자"],
        userFlow: ["가능한 시간 확인", "예약·결제 진행", "확정 안내 자동 발송", "운영자가 일정·정산 관리"],
        operator: ["예약 현황·차단 관리", "결제·환불 처리", "이용 안내 편집"],
        tech: ["Next.js", "TypeScript", "결제 연동", "PostgreSQL"],
        deliverables: ["전체 소스코드", "예약 웹 + 관리자", "결제 연동 설정", "실행·배포 문서"]
      }
    },
    {
      id: "soho-saas", cat: "erp app", chip: "SaaS", shot: "saas",
      title: "소상공인 운영 SaaS",
      problem: "예약·고객·매출 관리를 서로 다른 도구로 나눠 쓰느라 데이터가 흩어졌습니다.",
      features: ["예약·고객·매출 통합", "간편 정산", "멀티 매장·권한", "모바일 대응"],
      scope: "서비스 구조 설계 · 웹앱 개발 · 데이터 모델 · 배포",
      detail: {
        overview: "예약·고객·매출을 한 곳에서 관리하도록 통합한 소상공인용 올인원 운영 SaaS입니다.",
        problemDetail: "예약은 예약앱, 고객은 메모, 매출은 엑셀로 나뉘어 사장님이 매일 자료를 오가며 확인해야 했습니다.",
        structure: ["운영 웹앱", "API", "데이터베이스", "정산·리포트"],
        userFlow: ["예약·고객 등록", "매출·정산 자동 집계", "매장별 데이터 분리 조회", "권한별 직원 접근"],
        operator: ["멀티 매장 관리", "권한·직원 관리", "정산 리포트"],
        tech: ["Next.js", "TypeScript", "PostgreSQL", "반응형 웹앱"],
        deliverables: ["전체 소스코드", "운영 웹앱 + 관리자", "실행·배포 문서", "계정·권한 정리"]
      }
    },
    {
      id: "ai-work-hub", cat: "ai web", chip: "AI · 자동화", shot: "ai",
      title: "AI 업무 자동화 허브",
      problem: "반복 문서·요청 작성을 매번 사람이 직접 처리해 병목이 생겼습니다.",
      features: ["업무별 자동 생성 템플릿", "입력 몇 개로 결과 산출", "결과 관리·재사용", "사용량 기반 과금"],
      scope: "서비스 기획 · 웹 개발 · AI 연동 · 과금 설계",
      detail: {
        overview: "업무별 템플릿에 입력 몇 개만 넣으면 결과물을 자동 생성하는 AI 업무 자동화 허브입니다.",
        problemDetail: "제안서·요청서·정리 문서 등 반복 산출물을 매번 처음부터 작성해 시간이 과도하게 들었습니다.",
        structure: ["사용자 웹", "AI 생성 엔진", "결과 저장소", "사용량·과금"],
        userFlow: ["업무 템플릿 선택", "핵심 입력값 입력", "AI가 결과 초안 생성", "결과 저장·재사용"],
        operator: ["템플릿 관리", "사용량·과금 관리", "결과 이력 조회"],
        tech: ["Next.js", "TypeScript", "AI 연동", "스키마 검증", "레이트리밋"],
        deliverables: ["전체 소스코드", "관리자·과금 설정", "실행·배포 문서", "API 키 정리"]
      }
    },
    {
      id: "sns-content", cat: "ai", chip: "AI · 자동화", shot: "ai",
      title: "SNS 콘텐츠 자동화 서비스",
      problem: "채널 콘텐츠를 매번 수작업으로 기획·제작하느라 발행이 밀렸습니다.",
      features: ["주제 입력 → 초안 자동 생성", "이미지·문구 세트", "발행 캘린더", "톤 설정"],
      scope: "서비스 기획 · 웹 개발 · AI 연동",
      detail: {
        overview: "주제만 입력하면 콘텐츠 초안과 문구 세트를 자동 생성하고, 발행 일정을 관리하는 SNS 콘텐츠 자동화 서비스입니다.",
        problemDetail: "채널 운영자가 매번 기획·문구·이미지를 수작업으로 만들어 발행 주기가 밀렸습니다.",
        structure: ["사용자 웹", "AI 생성 엔진", "콘텐츠 저장소", "발행 캘린더"],
        userFlow: ["주제·톤 입력", "AI가 초안·문구 생성", "검토·수정", "발행 일정 등록"],
        operator: ["톤·브랜드 설정", "콘텐츠 이력 관리", "발행 캘린더 관리"],
        tech: ["Next.js", "TypeScript", "AI 연동", "이미지 처리"],
        deliverables: ["전체 소스코드", "관리자", "실행·배포 문서", "API 키 정리"]
      }
    },
    {
      id: "gov-search", cat: "ai web", chip: "AI · 검색", shot: "search",
      title: "공공정보 AI 탐색 서비스",
      problem: "필요한 공공·지원 정보가 흩어져 있어, 조건에 맞는 항목을 찾기 어려웠습니다.",
      features: ["대화형 조건 좁히기", "조건 매칭 검색", "결과 요약", "재시도·fallback 안정성"],
      scope: "서비스 기획 · 웹 개발 · AI·검색 연동",
      detail: {
        overview: "대충 설명해도 AI가 대화형으로 조건을 좁혀 알맞은 공공·지원 정보를 찾아주는 검색 서비스입니다.",
        problemDetail: "정보가 여러 기관·페이지에 흩어져 있어, 사용자가 자기 조건에 맞는 항목을 직접 찾기 어려웠습니다.",
        structure: ["사용자 웹", "대화형 검색", "데이터 인덱스", "결과 요약"],
        userFlow: ["원하는 것을 자유롭게 입력", "AI가 조건을 되물어 좁힘", "조건 매칭 결과 제시", "핵심을 요약해 안내"],
        operator: ["데이터·인덱스 갱신", "질의 품질 모니터링"],
        tech: ["Next.js", "TypeScript(strict)", "AI 연동", "검증(zod)", "레이트리밋"],
        deliverables: ["전체 소스코드", "관리자", "실행·배포 문서", "API 키 정리"]
      }
    },
    {
      id: "digital-market", cat: "web", chip: "웹 · 커머스", shot: "market",
      title: "디지털 상품 마켓플레이스",
      problem: "디지털 상품 판매·정산을 수기로 처리해 운영 부담이 컸습니다.",
      features: ["상품 등록·판매", "결제·정산", "구매자·판매자 관리", "셀프 편집 관리자"],
      scope: "커머스 구조 설계 · 웹 개발 · 결제 연동 · 관리자",
      detail: {
        overview: "디지털 상품을 등록·판매하고 결제·정산까지 처리하는 마켓플레이스로, 비개발자도 관리자에서 직접 운영할 수 있게 만들었습니다.",
        problemDetail: "상품 등록·판매·정산을 수기로 처리해 거래가 늘수록 운영 부담이 커졌습니다.",
        structure: ["구매자 웹", "결제·정산 API", "데이터베이스", "셀프 편집 관리자"],
        userFlow: ["상품 탐색·구매", "결제·다운로드", "판매자 정산 집계", "관리자에서 상품·배너 편집"],
        operator: ["상품·판매자 관리", "정산 처리", "콘텐츠 셀프 편집"],
        tech: ["Next.js", "결제 연동", "PostgreSQL", "CMS(셀프 편집)"],
        deliverables: ["전체 소스코드", "커머스 웹 + 관리자", "결제 연동 설정", "실행·배포 문서"]
      }
    },
    {
      id: "quote-doc", cat: "ai web", chip: "웹 · 자동화", shot: "doc",
      title: "견적·청구 문서 자동화 도구",
      problem: "견적서·인보이스를 매번 수기로 작성해 실수와 재작업이 잦았습니다.",
      features: ["항목 입력 → 문서 자동 생성", "템플릿·브랜딩", "PDF 출력·발송", "이력 관리"],
      scope: "서비스 기획 · 웹 개발 · 문서 생성 로직",
      detail: {
        overview: "항목만 입력하면 견적서·인보이스를 자동으로 만들어 PDF로 출력·발송하는 문서 자동화 도구입니다.",
        problemDetail: "매번 문서를 수기로 만들어 금액 오류·양식 불일치·재작업이 잦았습니다.",
        structure: ["사용자 웹", "문서 생성 엔진", "데이터 저장소", "PDF 출력"],
        userFlow: ["항목·금액 입력", "템플릿·브랜딩 적용", "PDF 자동 생성", "발송·이력 관리"],
        operator: ["템플릿·브랜딩 관리", "발행 이력 조회"],
        tech: ["Next.js", "TypeScript", "문서 생성 로직", "PDF"],
        deliverables: ["전체 소스코드", "관리자", "실행·배포 문서"]
      }
    },
    {
      id: "research-writer", cat: "ai", chip: "AI · 문서", shot: "doc",
      title: "연구·문서 작성 보조 서비스",
      problem: "자료 정리와 초안 작성에 반복 작업이 많아 시간이 오래 걸렸습니다.",
      features: ["자료 기반 초안 보조", "구조·형식 정리", "인용·근거 관리", "결과 내보내기"],
      scope: "서비스 기획 · 웹 개발 · AI 연동",
      detail: {
        overview: "자료를 바탕으로 초안 작성을 돕고 구조·형식·인용을 정리해 주는 연구·문서 작성 보조 서비스입니다.",
        problemDetail: "자료 정리와 초안 작성, 형식 맞추기가 반복 업무여서 실제 검토·집필 시간이 부족했습니다.",
        structure: ["사용자 웹", "AI 보조 엔진", "자료 저장소", "내보내기"],
        userFlow: ["자료·주제 입력", "AI가 구조·초안 제안", "인용·근거 정리", "문서로 내보내기"],
        operator: ["자료·템플릿 관리", "결과 이력 관리"],
        tech: ["Next.js", "TypeScript", "AI 연동", "문서 처리"],
        deliverables: ["전체 소스코드", "관리자", "실행·배포 문서"]
      }
    },
    {
      id: "data-crawl", cat: "data", chip: "데이터", shot: "data",
      title: "대규모 데이터 수집·검색 시스템",
      problem: "흩어진 대량 데이터를 수집·정리·검색할 방법이 없어 활용이 어려웠습니다.",
      features: ["대규모 수집 파이프라인", "정제·인덱싱", "빠른 검색", "중복·오류 처리"],
      scope: "시스템 설계 · 수집·인덱싱 개발 · 검색 API",
      detail: {
        overview: "흩어진 대량 데이터를 자동으로 수집·정제·인덱싱하고 빠르게 검색할 수 있게 만든 데이터 시스템입니다.",
        problemDetail: "데이터가 여러 소스에 흩어져 있고 형식이 제각각이라 모아서 검색·활용할 방법이 없었습니다.",
        structure: ["수집 파이프라인", "정제·인덱싱", "검색 인덱스", "검색 API"],
        userFlow: ["소스에서 자동 수집", "정제·중복 제거", "인덱싱", "검색 API로 조회"],
        operator: ["수집 스케줄 관리", "인덱스·품질 모니터링"],
        tech: ["수집 파이프라인", "인덱싱·검색", "데이터베이스", "API"],
        deliverables: ["전체 소스코드", "수집·검색 시스템", "실행·배포 문서", "운영 가이드"]
      }
    },
    {
      id: "pseo-engine", cat: "data web", chip: "데이터 · SEO", shot: "data",
      title: "대규모 SEO 페이지 자동화 시스템",
      problem: "지역·서비스별 페이지를 수작업으로 만들 수 없을 만큼 조합이 많았습니다.",
      features: ["키워드 매트릭스 자동 생성", "대량 정적 페이지 빌드", "내부 링크 클러스터링", "구조화 데이터"],
      scope: "시스템 설계 · 빌드 스크립트 · SEO 구조 · 자동 사이트맵",
      detail: {
        overview: "키워드 매트릭스(서비스×지역×업종×의도)에서 대량의 정적 페이지를 자동 생성하고 내부 링크로 묶는 프로그래매틱 SEO 시스템입니다.",
        problemDetail: "노려야 할 검색어 조합이 수백 개라 사람이 페이지를 하나씩 만드는 것은 불가능했습니다.",
        structure: ["키워드 매트릭스", "빌드 스크립트", "정적 페이지", "사이트맵·구조화 데이터"],
        userFlow: ["키워드 조합 정의", "페이지 자동 생성(빌드)", "허브로 내부 링크 클러스터링", "사이트맵·구조화 데이터 자동 생성"],
        operator: ["키워드·템플릿 관리", "색인 상태 모니터링"],
        tech: ["Next.js 정적 export", "Node 빌드 스크립트", "JSON-LD", "자동 sitemap/robots"],
        deliverables: ["전체 소스코드", "빌드 자동화", "실행·배포 문서", "운영 가이드"]
      }
    }
  ];

  var CAT_LABEL = { web: "웹", app: "모바일 앱", erp: "ERP·SaaS", ai: "AI·자동화", data: "데이터·SEO" };

  /* ---------- 화면 목업(예시 데이터만, 순수 CSS/HTML) ---------- */
  function shotHTML(type) {
    switch (type) {
      case "erp": return '<div class="s-erp"><div class="s-erp__side"><i class="on"></i><i></i><i></i></div><div class="s-erp__main"><div class="s-erp__kpi"><span></span><span></span><span></span></div><div class="s-erp__chart"><b style="height:40%"></b><b style="height:70%"></b><b style="height:52%"></b><b style="height:88%"></b><b style="height:64%"></b></div></div></div>';
      case "mobile": return '<div class="s-mob"><span class="s-mob__bar"></span><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__row"><i></i><em></em></div><div class="s-mob__tab"><b></b><b></b><b></b><b></b></div></div>';
      case "matching": return '<div class="s-match"><div class="s-match__col"><i></i><i></i><i></i></div><div class="s-match__link">⇄</div><div class="s-match__col"><i></i><i></i><i></i></div></div>';
      case "kanban": return '<div class="s-kan"><div class="s-kan__col"><b></b><b></b></div><div class="s-kan__col"><b></b></div><div class="s-kan__col"><b></b><b></b></div></div>';
      case "saas": return '<div class="s-saas"><div class="s-saas__kpi"><span></span><span></span></div><div class="s-saas__chart"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><polyline points="0,32 20,24 40,28 60,14 80,18 100,6" fill="none" stroke="currentColor" stroke-width="2"/></svg></div></div>';
      case "calendar": return '<div class="s-cal"><span class="s-cal__top"></span><div class="s-cal__grid"><s></s><s></s><s class="on"></s><s></s><s></s><s class="on"></s><s></s><s></s><s></s><s></s><s class="on"></s><s></s></div></div>';
      case "ai": return '<div class="s-ai"><span class="s-ai__in"></span><span class="s-ai__arrow">↓</span><div class="s-ai__out"><i></i><i></i><i class="short"></i></div></div>';
      case "search": return '<div class="s-srch"><span class="s-srch__bar"></span><div class="s-srch__bubble"></div><div class="s-srch__res"><i></i><i></i><i></i></div></div>';
      case "market": return '<div class="s-mkt"><span></span><span></span><span></span><span></span><span></span><span></span></div>';
      case "doc": return '<div class="s-doc"><span class="s-doc__h"></span><i></i><i></i><i class="short"></i><span class="s-doc__pdf">PDF</span></div>';
      case "data": return '<div class="s-data"><span class="s-data__h"></span><i></i><i></i><i></i><i></i></div>';
      default: return '<div class="s-erp"></div>';
    }
  }

  /* ---------- 카드 렌더 ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  function renderPortfolio() {
    var grid = document.getElementById("pfGrid");
    if (!grid) return;
    var html = PROJECTS.map(function (p) {
      var feats = p.features.slice(0, 3).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      return '<article class="pf-card2" data-cat="' + p.cat + '" data-id="' + p.id + '">' +
        '<div class="pf-card2__shot shot shot--' + p.shot + '" aria-hidden="true">' + shotHTML(p.shot) + '</div>' +
        '<div class="pf-card2__body">' +
        '<span class="pf-chip">' + esc(p.chip) + '</span>' +
        '<h3 class="pf-card2__title">' + esc(p.title) + '</h3>' +
        '<p class="pf-card2__problem">' + esc(p.problem) + '</p>' +
        '<ul class="pf-feats">' + feats + '</ul>' +
        '<p class="pf-card2__scope"><b>담당 범위</b> ' + esc(p.scope) + '</p>' +
        '<button class="pf-card2__more" type="button" data-open="' + p.id + '">자세히 보기 <span aria-hidden="true">→</span></button>' +
        '</div></article>';
    }).join("");
    grid.innerHTML = html;
  }

  /* ---------- 필터 ---------- */
  function initFilter() {
    var btns = document.querySelectorAll(".pf-filter__btn");
    var cards = function () { return document.querySelectorAll(".pf-card2"); };
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        btns.forEach(function (b) { b.classList.remove("is-on"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-on"); btn.setAttribute("aria-selected", "true");
        cards().forEach(function (card) {
          var cats = card.getAttribute("data-cat").split(" ");
          var show = (f === "all") || cats.indexOf(f) !== -1;
          card.hidden = !show;
        });
        pushDL({ event: "portfolio_filter_click", filter: f });
      });
    });
  }

  /* ---------- 상세 모달 (데이터 기반, 접근성) ---------- */
  var pm = document.getElementById("pm");
  var pmBody = document.getElementById("pmBody");
  var pmDialog = pm ? pm.querySelector(".pm__dialog") : null;
  var lastFocus = null;

  function nodeChain(arr) {
    return '<div class="pm-diagram">' + arr.map(function (n, i) {
      return '<span class="pm-diagram__node">' + esc(n) + "</span>" + (i < arr.length - 1 ? '<span class="pm-diagram__arrow" aria-hidden="true">→</span>' : "");
    }).join("") + "</div>";
  }
  function ul(arr, ordered) {
    var tag = ordered ? "ol" : "ul";
    return "<" + tag + ' class="pm-list' + (ordered ? " pm-list--ol" : "") + '">' + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</" + tag + ">";
  }
  function chips(arr) {
    return '<div class="pm-chips">' + arr.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div>";
  }

  function buildModal(p) {
    var d = p.detail;
    return '' +
      '<span class="pm-chip">' + esc(p.chip) + '</span>' +
      '<h2 class="pm-title" id="pmTitle">' + esc(p.title) + '</h2>' +
      '<p class="pm-lead">' + esc(d.overview) + '</p>' +
      '<div class="pm-shot shot shot--' + p.shot + '" aria-hidden="true">' + shotHTML(p.shot) + '</div>' +
      '<div class="pm-sec"><h4>고객이 겪던 문제</h4><p>' + esc(d.problemDetail) + '</p></div>' +
      '<div class="pm-sec"><h4>서비스 구조</h4>' + nodeChain(d.structure) + '</div>' +
      '<div class="pm-sec"><h4>구현한 핵심 기능</h4>' + ul(p.features) + '</div>' +
      '<div class="pm-sec"><h4>주요 사용자 흐름</h4>' + ul(d.userFlow, true) + '</div>' +
      '<div class="pm-sec"><h4>운영자 기능</h4>' + ul(d.operator) + '</div>' +
      '<div class="pm-sec"><h4>담당 범위</h4><p>' + esc(p.scope) + '</p></div>' +
      '<div class="pm-sec"><h4>사용 기술</h4>' + chips(d.tech) + '</div>' +
      '<div class="pm-sec"><h4>납품 산출물</h4>' + ul(d.deliverables) + '</div>' +
      '<div class="pm-cta"><a class="btn btn--primary" href="#contact" data-cta="apply" data-cta-loc="portfolio-modal" data-pm-close>이런 서비스로 상담받기</a></div>';
  }

  function openModal(id) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p || !pm) return;
    lastFocus = document.activeElement;
    pmBody.innerHTML = buildModal(p);
    pm.hidden = false;
    document.body.classList.add("pm-open");
    if (pmDialog) { pmDialog.scrollTop = 0; pmDialog.focus(); }
    pushDL({ event: "portfolio_card_open", project_id: id });
  }
  function closeModal() {
    if (!pm || pm.hidden) return;
    pm.hidden = true;
    document.body.classList.remove("pm-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    if (!pm) return;
    // 카드 "자세히 보기" (이벤트 위임)
    var grid = document.getElementById("pfGrid");
    if (grid) grid.addEventListener("click", function (e) {
      var t = e.target.closest("[data-open]");
      if (t) openModal(t.getAttribute("data-open"));
    });
    // 닫기(배경/버튼/모달 내 CTA)
    pm.addEventListener("click", function (e) {
      if (e.target.closest("[data-pm-close]")) closeModal();
    });
    // ESC 닫기 + 포커스 트랩
    document.addEventListener("keydown", function (e) {
      if (pm.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key === "Tab") {
        var f = pm.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ============================================================
     2) 헤더 · 모바일 내비 · FAQ
     ============================================================ */
  var header = document.querySelector(".header");
  function onScroll() { if (window.scrollY > 8) header.classList.add("scrolled"); else header.classList.remove("scrolled"); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mobileNav");
  function closeNav() { burger.classList.remove("open"); mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = burger.classList.toggle("open");
      mnav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mnav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        if (o !== item) { o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null; }
      });
      if (isOpen) { item.classList.remove("open"); a.style.maxHeight = null; }
      else { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; if (!item.dataset.f) { item.dataset.f = "1"; pushDL({ event: "faq_open" }); } }
    });
  });

  /* ============================================================
     3) 문의 폼 (main-apply) — Netlify Forms, AJAX 제출
        inquiry_form_start(최초 상호작용 1회) / inquiry_form_submit 분리 추적
     ============================================================ */
  var applyForms = document.querySelectorAll("[data-reum-apply]");
  if (applyForms.length) {
    var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    var utm = {};
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = {};
      UTM_KEYS.forEach(function (k) { var v = params.get(k); if (v) fromUrl[k] = v; });
      if (Object.keys(fromUrl).length) { sessionStorage.setItem("reum_utm", JSON.stringify(fromUrl)); utm = fromUrl; }
      else { var saved = sessionStorage.getItem("reum_utm"); if (saved) utm = JSON.parse(saved); }
    } catch (e) {}

    applyForms.forEach(function (form) {
      form.querySelectorAll("[data-utm]").forEach(function (input) {
        var k = input.getAttribute("data-utm"); if (utm[k]) input.value = utm[k];
      });

      // 폼 시작(최초 포커스 1회)
      form.addEventListener("focusin", function () { once("inquiry_form_start", { event: "inquiry_form_start" }); }, { once: false });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (form.dataset.submitting === "1") return;
        var btn = form.querySelector(".af-submit");
        var errEl = form.querySelector(".af-error");
        form.dataset.submitting = "1";
        if (errEl) errEl.hidden = true;
        var origLabel = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "요청 중…"; }

        var body = new URLSearchParams(new FormData(form)).toString();
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
          .then(function (res) {
            if (!res.ok) throw new Error("status " + res.status);
            var card = form.closest(".af-card");
            var head = card ? card.querySelector(".af-head") : null;
            var done = card ? card.querySelector(".af-done") : null;
            form.hidden = true;
            if (head) head.hidden = true;
            if (done) done.hidden = false;
            if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
            try { if (typeof window.fbq === "function") window.fbq("track", "Lead"); } catch (e2) {}
            pushDL({ event: "inquiry_form_submit" });
            pushDL({ event: "main_apply_submit" });
            pushDL({ event: "form_submit_success" }); // 기존 GTM 전환 트리거 호환
          })
          .catch(function () { if (errEl) errEl.hidden = false; })
          .then(function () { form.dataset.submitting = "0"; if (btn) { btn.disabled = false; btn.textContent = origLabel; } });
      });
    });
  }

  /* ============================================================
     4) 전환 분석 이벤트
     ============================================================ */
  // 히어로 CTA
  document.querySelectorAll("[data-hero-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var v = el.getAttribute("data-hero-cta");
      pushDL({ event: v === "primary" ? "hero_primary_cta_click" : "hero_portfolio_click" });
    });
  });

  // data-cta 통합(카톡/전화/신청/이메일) + 위치별 세부 이벤트
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var type = el.getAttribute("data-cta");
      var loc = el.getAttribute("data-cta-loc") || "";
      pushDL({ event: "cta_click", cta_type: type, cta_location: loc });
      if (loc === "sticky-bar") pushDL({ event: "sticky_cta_click", cta_type: type });
      if (type === "kakao") pushDL({ event: "kakao_or_chat_click", cta_location: loc });
      if (type === "phone" || type === "call") pushDL({ event: "phone_click", cta_location: loc });
      if (type === "email") pushDL({ event: "email_click", cta_location: loc });
      try {
        if (typeof window.fbq === "function" && (type === "kakao" || type === "call")) window.fbq("track", "Contact", { method: type });
      } catch (e2) {}
    });
  });

  // tel: / mailto: (data-cta 없는 링크까지 커버, 중복 방지)
  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener("click", function () { if (!el.hasAttribute("data-cta")) pushDL({ event: "phone_click" }); });
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener("click", function () { if (!el.hasAttribute("data-cta")) pushDL({ event: "email_click" }); });
  });

  // 가격 플랜 클릭
  document.querySelectorAll("[data-plan]").forEach(function (el) {
    el.addEventListener("click", function () { pushDL({ event: "pricing_plan_click", plan: el.getAttribute("data-plan") }); });
  });

  // 섹션 노출(1회): 진행 과정 / 가격 / 포트폴리오
  [["#process", "process_section_view"], ["#pricing", "price_view"], ["#portfolio", "portfolio_view"]].forEach(function (pair) {
    var el = document.querySelector(pair[0]);
    if (el && "IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { once(pair[1], { event: pair[1] }); so.disconnect(); } });
      }, { threshold: 0.2 });
      so.observe(el);
    }
  });

  // 모바일 고정 CTA — 하단 상담 폼(#contact) 보이면 숨김
  var mcta = document.getElementById("mcta");
  var contact = document.getElementById("contact");
  if (mcta && contact && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { mcta.classList.toggle("is-hidden", en.isIntersecting); });
    }, { threshold: 0.12 });
    io.observe(contact);
  }

  // 스크롤 깊이 25/50/75/100%
  (function () {
    var marks = [25, 50, 75, 100], done = {};
    function onDepth() {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) return;
      var pct = ((window.scrollY || h.scrollTop) / scrollable) * 100;
      marks.forEach(function (m) { if (pct >= m && !done[m]) { done[m] = true; pushDL({ event: "scroll_depth", percent: m }); } });
      if (done[100]) window.removeEventListener("scroll", onDepth);
    }
    window.addEventListener("scroll", onDepth, { passive: true });
    onDepth();
  })();

  /* ============================================================
     5) 초기화
     ============================================================ */
  renderPortfolio();
  initFilter();
  initModal();
})();
