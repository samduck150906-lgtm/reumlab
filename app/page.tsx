import ReumSalesLanding from '../components/ReumSalesLanding';
import { getSite } from '../lib/data';
import { ReumHomeGraphJsonLd, BreadcrumbJsonLd, WebSiteJsonLd, FAQPageJsonLd } from '@/components/JsonLd';

const HOME_FAQS = [
  { q: '앱개발 외주 비용은 보통 얼마인가요?', a: '앱개발 외주 비용은 기능 범위, 화면 수, 관리자 기능, 외부 API 연동 여부에 따라 크게 달라집니다. 름랩의 Flutter 앱 MVP는 앱 라이트 290만 원부터, 회원·결제까지 갖춘 앱 스탠다드는 490만 원입니다(VAT 포함 정액). 정확한 견적은 30분 무료 상담에서 안내드립니다.' },
  { q: 'MVP 개발은 일반 앱개발과 무엇이 다른가요?', a: 'MVP 개발은 아이디어를 시장에서 빠르게 검증하기 위해 핵심 기능만 먼저 만드는 방식입니다. 초기 창업자나 스타트업이 예산을 효율적으로 사용하고 실패 리스크를 줄이는 데 적합합니다.' },
  { q: '비개발자도 앱개발 외주를 맡길 수 있나요?', a: '네, 가능합니다. 름랩은 비개발자 대표님을 주요 고객으로 삼고 있어, 기획서가 없어도 아이디어만으로 상담을 시작할 수 있습니다. 개발 완료 후에는 AI 도구를 활용해 간단한 수정을 직접 할 수 있도록 1:1 운영 교육도 제공합니다.' },
  { q: 'Flutter 앱개발은 어떤 경우에 적합한가요?', a: 'Flutter 앱개발은 안드로이드와 iOS 앱을 동시에 출시해야 하는 MVP 단계에서 특히 유리합니다. 하나의 코드베이스로 두 플랫폼을 커버하므로 개발 비용과 기간을 줄일 수 있습니다.' },
  { q: 'AI 외주개발로 어떤 기능을 만들 수 있나요?', a: 'AI 외주개발로는 고객 문의 자동 응답 챗봇, 문서 요약, 상담 자동화, 추천 로직, 분류 기능 등을 구현할 수 있습니다.' },
  { q: '소스코드 이관은 왜 중요한가요?', a: '소스코드 이관은 외주사에 종속되지 않기 위한 가장 기본적인 권리 보호 수단입니다. 름랩은 프로젝트 완료 시 소스코드, GitHub 저장소, 실행 문서를 함께 제공합니다.' },
  { q: '개발 후 직접 수정할 수 있나요?', a: 'AI 직접 운영 교육을 통해 텍스트, 이미지, 버튼 문구 등 간단한 수정은 AI 도구를 활용해 직접 하실 수 있습니다.' },
  { q: '기획서 없이 아이디어만 있어도 상담 가능한가요?', a: '가능합니다. 아이디어와 꼭 필요한 기능 한두 가지만 있어도 상담을 시작할 수 있습니다. 기능 범위가 명확할수록 일정과 비용도 정확해집니다.' },
];

export default function Home() {
  const site = getSite();
  return (
    <>
      <WebSiteJsonLd />
      <ReumHomeGraphJsonLd />
      <BreadcrumbJsonLd slug="" />
      <FAQPageJsonLd items={HOME_FAQS} />
      <ReumSalesLanding site={site} />
    </>
  );
}
