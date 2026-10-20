import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { biotechWebsiteCore } from './website-core';
import { biotechWebsiteOperations } from './website-operations';

export const biotechWebsitePage: AgencyPage = {
  slug:'website/바이오테크업체',clusterIds:['ind-611-website'],
  primaryKeyword:'바이오테크업체 홈페이지 제작',
  keywordVariants:['바이오 기술 플랫폼 홈페이지','바이오 연구 과제 소개 웹사이트','바이오테크 협력 문의 홈페이지'],
  searchIntent:'바이오테크의 연구 기술·개발 과제·공개 근거와 제공 서비스를 구분하고 실제 협력 범위에 맞는 문의를 연결하기',
  industry:'바이오테크업체',serviceAxis:'홈페이지·웹사이트',
  title:'바이오테크업체 홈페이지 제작 | 연구 기술·과제·협력 안내 | 름랩',
  description:'연구 기술과 개발 과제, 공개 근거 및 실제 제공 서비스를 구분합니다. 과제 상태의 확인 시점, 자료 공개 승인과 협력 문의 운영 범위를 확인하세요.',
  h1:'바이오테크업체 홈페이지, 연구 기술과 과제의 근거를 협력 문의에 연결합니다',
  summary:'바이오테크 홈페이지는 기술 플랫폼과 개별 개발 과제, 실제 제공 서비스 및 공개된 연구 근거를 구분해 설명해야 합니다. 연구 중인 내용이 승인된 제품이나 확정된 효과로 읽히지 않도록 표현을 검토해야 합니다. 름랩은 공개 가능한 자료와 협력 범위를 확인해 기술 소개·상태 갱신·근거 연결·문의가 이어지는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-20',...biotechWebsiteCore,...biotechWebsiteOperations,
  sections:sections(['연구 기술과 협력 가능성을 확인하는 방문자','플랫폼·개발 과제·제공 서비스의 혼동','연구 근거와 사업·공개 승인의 역할','기술 탐색에서 목적별 협력 문의까지','과제 상태와 출처를 함께 읽는 화면','자료와 확인 시점·공개 승인의 운영','기술·과제·연구 자료의 연결 구조','발표 정정·관계 변경·번역 차이 처리','핵심 기술의 첫 사이트와 자료 검색 확장','연구 편집과 공개 검토의 비용·일정','연구 표현과 자료 사용의 책임 확인','과제 갱신과 협력 문의의 운영 인수']),
  faq:[
    {question:'기술 플랫폼과 개발 과제는 같은 페이지로 소개하나요?',answer:'서로 연결할 수 있지만 의미는 구분해야 합니다. 플랫폼의 개념과 근거, 개별 과제의 연구 목적과 진행 상태를 따로 관리하면 한 과제의 결과를 모든 기술의 성과로 오해하는 일을 줄일 수 있습니다.'},
    {question:'개발 단계만 표시하면 충분한가요?',answer:'단계의 의미와 확인 시점, 공개 가능한 근거 및 설명 범위가 함께 필요할 수 있습니다. 홈페이지가 연구 성공이나 허가 가능성을 확정하는 표현을 사용하지 않도록 담당자가 검토해야 합니다.'},
    {question:'논문이 있으면 기술 성능을 그대로 홍보해도 되나요?',answer:'해당 자료가 어떤 설명을 어느 범위까지 뒷받침하는지 확인해야 합니다. 회사와 연구 결과의 관계, 저자와 자료 사용 권한도 검토합니다. 논문이나 발표의 존재만으로 더 넓은 성능 주장을 정당화하지 않습니다.'},
    {question:'협력 문의에서 비공개 연구 자료를 받을 수 있나요?',answer:'초기에는 공개 가능한 제안 요약과 연락 경로부터 받는 방식으로 설계할 수 있습니다. 미공개 자료 교환이 필요하면 비밀 유지와 접근 권한, 전달 절차를 확인한 후 별도 흐름으로 연결하는 것이 좋습니다.'},
    {question:'연구 내용이 바뀌면 이전 발표도 없애야 하나요?',answer:'자료의 성격과 공개 정책에 따라 다릅니다. 과거 발표를 유지한다면 당시의 정보임을 알 수 있게 하고 최신 상태와 연결해야 합니다. 정정·회수나 관계 변경이 있는 경우에는 담당자가 공개할 처리 범위를 확인합니다.'},
    {question:'제작에 필요한 첫 자료는 무엇인가요?',answer:'공개 가능한 기술 설명과 대표 과제, 근거 자료 및 실제 협력 문의 유형이 도움이 됩니다. 연구 검토자와 공개 승인자, 상태 갱신 담당자를 확인하면 콘텐츠와 운영 기능의 범위를 정리하기 쉽습니다.'},
  ],
  relatedRoutes:[
    {href:'/website/yeonguso/',label:'연구 조직의 공개 정보 구성',reason:'연구 역량과 방문자의 문의 목적에 맞는 홈페이지 정보를 비교합니다.'},
    {href:'/development-agency/cms-website-development/',label:'연구 자료와 과제 상태 편집',reason:'근거 자료의 연결과 확인 시점, 공개 승인 흐름을 관리합니다.'},
    {href:'/development-agency/multilingual-website-development/',label:'다국어 연구 설명의 운영',reason:'연구 용어와 상태·불확실성의 표현이 언어별로 유지되는지 확인합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'협력 문의와 비공개 자료 접근',reason:'공개 홈페이지에서 받을 정보와 후속 자료 교환의 범위를 나눕니다.'},
    {href:'/source-handover/',label:'기술 홈페이지 운영 인수',reason:'새 발표와 과제 변경, 문의 이관을 담당자가 직접 운영하도록 준비합니다.'},
  ],
  ctaContext:'공개할 기술 플랫폼과 대표 개발 과제, 연구 근거 및 실제 협력 문의 유형을 알려 주세요. 자료 공개와 상태 갱신까지 연결되는 바이오테크 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'BioNTech 기술 플랫폼 소개',url:'https://www.biontech.com/int/en/home/pipeline-and-products/platforms.html',use:'기술 플랫폼과 개발 과제, 연구 자료를 구분해 안내하는 공개 정보 구조를 참고했습니다. 해당 회사의 연구 성과와 기술을 름랩의 실적으로 제시하지 않습니다.'},
    {title:'BioNTech 협력 안내',url:'https://www.biontech.com/int/en/home/about/collaborators.html',use:'공개 협력 관계와 사업 개발 문의 경로가 구분되는 배경을 참고했습니다. 특정 협력 관계나 계약 내용을 다른 업체에 적용한다고 주장하지 않습니다.'},
  ],
};
