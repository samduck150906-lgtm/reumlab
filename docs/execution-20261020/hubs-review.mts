import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import { PAGE_SEO_MAP } from '../../lib/seo';
import { SERVICE_ACCEPTANCE } from '../../lib/service-acceptance';
import { HUB_CONTENT } from '../../lib/hub-content';
import { buildLandingContent } from '../../lib/landing-content.js';
import { SEO_WEBSITE_PAGES, SEO_WEBSITE_GUIDES } from '../../lib/seo-website';

const dir='docs/execution-20261020';
const baseline=JSON.parse(fs.readFileSync('../baseline/urls.json','utf8'));
const landings=JSON.parse(fs.readFileSync('content/landings.json','utf8'));
const hash=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
const source=(p:string)=>fs.readFileSync(p,'utf8');
const purposeSource=source('scripts/generate-purpose-landings.mjs');
const ast=ts.createSourceFile('purpose.js',purposeSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
function literal(name:string): any {
  for(const statement of ast.statements) {
    if(!ts.isVariableStatement(statement)) continue;
    for(const d of statement.declarationList.declarations) if(d.name.getText(ast)===name)
      return vm.runInNewContext(`(${d.initializer!.getText(ast)})`);
  }
  throw Error(name);
}
const purposes=literal('LANDINGS'), purposeAcceptance=literal('PURPOSE_ACCEPTANCE'), purposeFaq=literal('FAQ_BY_SLUG');
const notes=`
/|목적별 앱·웹·AI 제작 방식과 계약·인수 기준 선택|홈에 진행 단계별 산출물·계정 이관·실비와 포함 범위가 충분함. 일반 외주 비하·선택 빈도·30분 확정견적 주장은 근거가 없음|부모가 비교표를 계약 확인 항목으로 변경하고 빈도 주장을 제거함. React FAQ의 30분 확정견적도 범위 확인 후 견적으로 변경|index.html,app/page.tsx
/app-development/|모바일 앱 제작 기능·일정·검수 범위|기능·비용·인수 설명은 있으나 기기별 실패 검수와 스토어 승인 구별 부족|사용자별 자료·API·스토어 계정과 로그인·결제 실패·네트워크 끊김 검수 추가|lib/seo.ts,lib/service-acceptance.ts
/web-development/|소개 웹과 기능형 웹 구축 결정|반응형·SEO·교육 설명을 보존하고 CMS 포함 오해와 문의 성공 기준 보강 필요|자료 사용권·기존 URL·모바일 오류·클릭/서버 접수 구별 및 CMS 조건 추가|lib/seo.ts,lib/service-acceptance.ts
/mvp-development/|영문 MVP 범위와 출시 판단|약3주를 무조건 출시로 읽을 수 있는 메타와 핵심 예외 생략 위험|기간 보장을 제거하고 예약 MVP의 성공·거절·중복·취소 테스트와 수요 검증의 차이 명시|lib/seo.ts,lib/service-acceptance.ts
/flutter-development/|영문 Flutter 공유 코드·네이티브 경계|품질·비용 비교의 단정과 플랫폼 검수 항목 부족|플랫폼별 SDK·권한·알림·결제·딥링크·스토어 심사를 명시하고 항상 저렴하다는 주장 제거|lib/seo.ts,lib/service-acceptance.ts
/windows-app-development/|Windows 업무 앱 설치와 장비 연동|데스크톱 기능 설명에 실제 장비·오프라인·인수 검수 부족|Windows버전·설치권한·장비모델·엑셀표본, 동기화 충돌·백업복원·설치/제거 확인 추가|lib/seo.ts,lib/service-acceptance.ts
/flutter/|한국어 Flutter 앱 범위와 양 플랫폼 차이|공유 코드가 동시 업데이트·동일 승인으로 오해될 수 있음|공유 가능한 로직과 플랫폼별 설정을 구분하고 앱 복귀·권한 거절·네트워크 검수 보강|lib/seo.ts,lib/service-acceptance.ts
/source-handover/|소스와 계정 인수의 완료 조건|산출물 목록을 보존하되 파일 전달 뒤 재현 기준 필요|새 환경 설치·빌드·테스트 배포·백업복원·권한 회수·키 교체·라이선스 인수 명시|lib/seo.ts,lib/service-acceptance.ts
/admin-page-development/|관리자 권한·업무 상태 설계|관리자 기능 소개에 파괴적 수정과 역할별 검수 부족|직급별 조회/수정/삭제/내보내기, 승인취소·입금수정·지점 접근차단 검수 추가|lib/seo.ts,lib/service-acceptance.ts
/academy-shopping-mall/|교육기관 교재·수강권 판매와 반 운영|결제와 실제 반 배정 완료를 구분할 필요|학생·보호자·결제자 관계, 정원동시신청·반이동·부분환불·ERP 권한 확인 추가|lib/seo.ts,lib/service-acceptance.ts
/realestate-landing/|매물 소개와 광고 문의 측정|성과 추적 설명이 클릭과 실제 상담을 혼동할 수 있음|매물표시·사진권한·거래완료 갱신과 클릭/폼시작/서버성공 분리, 개인 정보 이벤트 제외|lib/seo.ts,lib/service-acceptance.ts
/maintenance/|타사 앱·웹 오류 수정과 인수|진단 절차 보존, 오류 재현 자료와 복구·대응 계약 부족|기기·시각·버전·재현순서, 로그 가림·회귀 확인·야간대응 범위 추가|lib/seo.ts,lib/service-acceptance.ts
/renewal/|기존 콘텐츠·URL을 보존하는 개편|이전 후 노출 개선 빈도 주장과 운영 전환 검수 부족|상승 보장 제거, URL대응·데이터 변경분·전환일·복귀조건 확인 추가|lib/seo.ts,lib/service-acceptance.ts
/cafe24-limit/|Cafe24 유지·부분 확장·이전 비교|제약 설명 보존, 플랫폼을 버리는 판단보다 실제 권한과 내보내기 확인 필요|설치앱·요금제·API권한·회원주문이미지 이전·PG심사·URL대응 확인 추가|lib/seo.ts,lib/service-acceptance.ts
/nocode-limit/|노코드 확장과 재개발 선택|기능 제약 설명 보존, 이관되지 않는 자동화/구독 처리 필요|데이터·트리거·사용자 ID·파일주소·결제구독과 재구현 비용 구분|lib/seo.ts,lib/service-acceptance.ts
/app-agency/|앱 업체 견적과 인수 조건 비교|타사 소스 제공이 드물다는 주장과 규모 우열 단정 확인|근거없는 비교를 제거하고 같은 기능·외부연동·검수·실비·변경 기준으로 업체 비교|lib/seo.ts,lib/service-acceptance.ts
/website-agency/|홈페이지 업체 포함 범위 비교|검색 유입을 약속하는 문구와 SEO 포함 정의가 모호함|노출 보장 제거, 페이지 질문·사진 담당·측정·계정·실행 인수 기준 명시|lib/seo.ts,lib/service-acceptance.ts
/mvp/|검증용 앱·웹 MVP의 1차 범위|가설별 핵심 흐름 자료는 유용하나 예외처리 후순위 단정 부적절|로그인·결제·권한 필수 예외를 포함하고 가설/행동/테스트 자료와 출시·수요 검증 구분|scripts/generate-purpose-landings.mjs
/erp/|엑셀 업무의 관리 시스템 전환|역할·데이터 흐름 보존, 이전과 마감 검수 보완 필요|중복업로드·누락거래처·부분수납·건수/잔액 대조와 승인·백업복원 책임 추가|scripts/generate-purpose-landings.mjs
/ai-automation/|반복업무 AI 연결과 사람 승인|업무진단·데이터보안·PoC·공식연동 설명 보존, 운영 실패와 측정 기준 추가 필요|비식별 정상/예외표본·외부발송 승인·API중단·재처리·수동 복귀·검수시간/비용 비교 추가|scripts/generate-purpose-landings.mjs
/platform/|수요자·공급자·운영자 플랫폼 구축|역할과 정산 흐름 보존, 매칭 실패·분쟁·정산 잔액 검수 필요|미응답·거절·취소·분쟁·부분환불·수수료시점·정보공개·탈퇴기록 조건 추가|scripts/generate-purpose-landings.mjs
/reservation-commerce/|예약·재고·결제 상태 연결|충돌방지·정책 목록은 충분하나 결제 성공/예약 실패와 중복알림 처리 필요|대기점유·확정지연·중복알림·부분환불·재고복원·외부채널 지연 검수 추가|scripts/generate-purpose-landings.mjs
/website/|소개·문의 홈페이지와 웹 시스템 선택|제작 유형 보존, 원고/사진·문의 성공·업무시스템 경계 부족|자료권한·가격범위·모바일 경로·서버접수·클릭/실상담 구분, 순위상승 경험 주장 제거|scripts/generate-purpose-landings.mjs
/data-seo/|출처 있는 데이터를 검색 가능한 페이지로 제공|지역60×서비스20 조합 양산 예시와 일괄 색인 제외 권장, 상한 가격 표현 문제|고유 제품규격 등 데이터별 의도·자료 검수, 기존 본문 보강, 원본삭제/누락/중단·복구 추가|scripts/generate-purpose-landings.mjs
/service-renewal/|기존 서비스 인수와 복구|실행 진단 흐름 보존, 대부분 재개발 불필요라는 단정과 전환자료 부족|상태별 부분수정/재구축 비교, 계정소유·검수환경·백업복원·롤백 조건 추가|scripts/generate-purpose-landings.mjs
/geo-website/|고객 질문·근거·문의로 GEO 제작 범위 선택|6개 제작영역·3업종예시·5단계·10FAQ가 구체적이고 추천 비보장/측정구분 명확|기존 충분한 본문 보존. 연결된 포트폴리오 사실정리는 해당 담당자가 수정|app/geo-website/page.tsx
/seo-website/|신규 검색 홈페이지 범위와 업종 선택|범위·문의항목·FAQ13개가 실제 자료 중심, 기존 '실무로' 편집지시 흔적 발견|부모가 편집지시문 수정. 기존 업종·지역·비용·문의 경계 설명 보존|app/seo-website/page.tsx,lib/seo-website.ts
/seo-website/regional/|실제 서비스 지역과 지역별 안내 구조|가능지역·현장조건·자료·중복페이지 경계 및5FAQ가 고유 정보 충분|충분한 기존 설명과 실제가능지역 조건 보존|app/seo-website/[slug]/page.tsx,lib/seo-website.ts
/seo-website/cost/|홈페이지 비용 결정 요소와 계약범위|페이지/콘텐츠/문의/CMS/운영실비 구분과4FAQ가 비용 판단에 직접 도움|가격정본과 별도 실비·예산 범위 설명 보존|app/seo-website/[slug]/page.tsx,lib/seo-website.ts
/seo-website/staffing/|인력업 소개와 구인·의뢰 문의 분리|파견·채용 소개와 실제 인력매칭 시스템을 구분, 5FAQ와 자료조건이 충분|소개 홈페이지와 구직/의뢰 입력·개인정보·업무시스템 경계 보존|app/seo-website/[slug]/page.tsx,lib/seo-website.ts
/seo-website/guides/search-registration/|사이트 등록과 색인·노출 단계 확인|소유권·사이트맵·robots/canonical·검색도구·등록후관찰5개 섹션과공식자료 있음|등록 성공을 노출로 부르지 않는 기존 설명과 공식출처 링크 보존|app/seo-website/guides/[slug]/page.tsx,lib/seo-website.ts
/seo-website/guides/seo-checklist/|홈페이지 공개 전 기술·본문·문의 점검|10개 질문별 이유와 산출물이 있어 단순 항목 나열이 아님|HTML본문·내부링크·색인·모바일·문의접수별 기존 질문/확인자료 보존|app/seo-website/guides/[slug]/page.tsx,lib/seo-website.ts
/soho/|소상공인49/98 패키지 적합성·준비자료|자동 월말할인·증명없는 정가/50%·검색순위 그림·운영경험/노출보장 주장 확인|실가격 유지, 부정확 주장 제거, 서비스/조건/문의 정보·사진권한·운영책임·업무시스템 별도범위 추가|app/soho/page.tsx
/h/shopping-mall/|쇼핑몰 플랫폼과 맞춤개발 비교|플랫폼 중단·독립구축 우열 단정은 근거없고 총비용 판단 필요|기성기능 적합성·계약·데이터 내보내기·호스팅/연동/운영 총비용 비교|lib/hub-content.ts
/h/service-plan/|기획 외주의 산출물과 개발범위|기획 결과물과 앱 LeanMVP580 가격 범위 구분 필요|사용자흐름·화면·예외·인수 산출물과 독립기획/웹/앱 범위 구분|lib/hub-content.ts
/h/suwon/|수원 의뢰자의 상담·자료준비|수원 거점/지역특성 일반화가 실제 사무실과 혼동될 수 있음|동탄사무실·비대면/대면조건·현재자료/운영자 확인으로 변경|lib/hub-content.ts
/h/cafe/|카페 스탬프 앱과 픽업주문 선택|재방문 효과·부정사용 없음 단정과 잔액/주문예외 부족|스탬프 적립/취소와 주문품절/픽업변경·운영자료 구분|lib/hub-content.ts
/h/restaurant/|식당 소개·예약·주문 시스템 결정|노쇼/매출 개선 단정과 예약/주문 경계 불명확|예약정원·주문품절·취소·PG실비와 예외검수·자료 추가|lib/hub-content.ts
/h/academy/|학원 출결·수납·학부모 앱 구성|검증되지 않은 구축경험과 ERP조건 없는 연결 문장|경험주장 제거, 학생/보호자·휴원/반이동/환불·API권한 조건 추가|lib/hub-content.ts
/h/gym/|운동시설 회원권과 PT/GX 예약|기간/횟수 차감·휴회·장비연동 검수 정보 부족|회원권 유형·휴회·취소차감·PT/GX 자원·외부장비 조건 추가|lib/hub-content.ts
/l/shopping-mall-cost/|쇼핑몰 구축비용을 기능별 비교|공통 웹본문은 상품·회원·정산 범위 판단에 부족|상품옵션·비회원주문·쿠폰/환불·이관·관리자 범위별 개별 본문 추가|lib/landing-content.js,components/LandingPage.js
/l/service-plan-cost/|서비스 기획비용과 산출물 비교|공통기획 소개만으로 화면·정책·개발비 구별 어려움|흐름·화면·예외·견적가능 산출물과 별도개발비 경계 추가|lib/landing-content.js,components/LandingPage.js
/l/suwon-shopping-mall/|수원 사업자의 쇼핑몰 제작 자료|지역명만 다른 웹설명으로 물류/매장운영 차이 부족|실제 상품·택배/픽업·재고·주문·운영담당 자료와 비대면 범위 추가|lib/landing-content.js,components/LandingPage.js
/l/cafe-app-dev-out/|카페 앱 외주 범위와 운영규칙|카페 이름 외 공통앱 정보 반복|스탬프/픽업 선택, 매장별 메뉴·품절·취소·적립 복구와 인수 검수 추가|lib/landing-content.js,components/LandingPage.js
/l/restaurant-website-dev/|음식점 홈페이지 소개와 예약연결|음식점 메뉴·대관·원산지·예약자료와 업무시스템 경계 부족|메뉴사진·영업/휴무·주차·단체예약 자료·외부예약/자체시스템 구분 추가|lib/landing-content.js,components/LandingPage.js
/l/academy-shopping-mall/|학원 교재·수강권 쇼핑몰|학원 구매자 관계와 수강/배송 구분 부족|학생/학부모/결제자·수강정원·교재배송·반이동/부분환불 범위 추가|lib/landing-content.js,components/LandingPage.js
/l/gym-web-dev/|헬스장 소개웹과 회원권예약 운영|프로그램 소개와 이용권 차감 시스템 혼동 가능|트레이너/시간표/가격 사진자료, PT예약·휴회·차감·장비연동 별도조건 추가|lib/landing-content.js,components/LandingPage.js
`.trim().split('\n').map(line=>line.split('|'));
assert.equal(notes.length,47);
const reports=notes.map(([pathname,intent,findings,changes,files])=>{
  const url='https://reumlab.com'+pathname;
  const before=baseline.find((x:any)=>x.url===url);
  assert.ok(before?.in_sitemap,`Missing sitemap original ${url}`);
  const slug=pathname.split('/').filter(Boolean).at(-1)!;
  let after:any;
  if(pathname.startsWith('/h/')) after=HUB_CONTENT[slug];
  else if(pathname.startsWith('/l/')) { const l=landings.find((x:any)=>x.slug===slug);assert.ok(l,slug);after=buildLandingContent(l);}
  else if(purposes.some((x:any)=>x.slug===slug)) { after={...purposes.find((x:any)=>x.slug===slug),acceptance:purposeAcceptance[slug],faqs:purposeFaq[slug]}; }
  else if(SERVICE_ACCEPTANCE[slug]) after=PAGE_SEO_MAP[slug];
  else if(pathname.startsWith('/seo-website/')) after={data:pathname.includes('/guides/')?SEO_WEBSITE_GUIDES.find(x=>x.slug===slug):SEO_WEBSITE_PAGES.find(x=>x.slug===(slug==='seo-website'?'':slug)),pageSource:files.split(',').filter(p=>p.startsWith('app/')).map(p=>source(p))};
  else after=files.split(',').map(p=>source(p));
  assert.ok(after,`Missing current content ${url}`);
  const current=JSON.stringify(after);
  const sources=files.split(',').map(p=>({path:p,sha256:hash(source(p))}));
  return {url,source:sources,intent,findings,changes,evidence:{
    originalHttpStatus:before.status,originalObservedAt:before.observed_at,originalHtmlFile:before.html_file,originalBodySha256:before.body_sha256,
    originalTitle:before.title,originalH1:before.h1,originalH2:before.h2,
    originalBody:before.body,currentSourceContent:after,currentSourceSha256:hash(current),
    reviewedBy:'website_content',method:'Individual original body and authoritative source review; per-URL editorial decision recorded above. Shared facts/pricing/index policy retained.',
  },status:{sourceReview:changes.startsWith('충분한')||changes.startsWith('가격정본')||changes.startsWith('소개 홈페이지')||changes.startsWith('등록 성공')||changes.startsWith('HTML본문')||changes.startsWith('기존 충분한')?'reviewed-preserved-sufficient':'reviewed-and-updated',renderedPage:'pending-parent-final-build-and-visual-review',deployment:'pending',submission:'pending'}};
});
assert.equal(new Set(reports.map(x=>x.url)).size,47);
fs.writeFileSync(`${dir}/hubs-review.json`,JSON.stringify(reports,null,2)+'\n');
console.log(JSON.stringify({reviewed:reports.length,updated:reports.filter(x=>x.status.sourceReview==='reviewed-and-updated').length,preserved:reports.filter(x=>x.status.sourceReview==='reviewed-preserved-sufficient').length,format:'root array',runtime:'pending parent final build'}));
