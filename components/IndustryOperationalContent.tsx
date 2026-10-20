import Link from '@/components/SiteLink';
import { INDUSTRY_OPERATIONS } from '@/lib/industry-operations';

type Props = {
  slug: string;
  kind: 'app' | 'cost' | 'solution';
  firstPhase?: string;
  laterPhases?: string[];
};

export default function IndustryOperationalContent({ slug, kind, firstPhase, laterPhases = [] }: Props) {
  const o = INDUSTRY_OPERATIONS[slug];
  if (!o) return null;
  const sections = kind === 'app' ? [
    ['사용자·운영자·관리자의 역할', o.roles],
    ['핵심 이용 흐름과 예외 처리', `${o.flow} ${o.exception}`],
    ['먼저 검증할 MVP와 이후 확장', `1차 검토 범위는 ${firstPhase ?? '핵심 업무와 운영 화면'}입니다. 이후 후보는 ${laterPhases.join(' / ')}입니다. 아래 기능은 설계 후보이며 계약에 포함되는 범위는 화면·규칙·검수 항목을 정해 확정합니다.`],
    ['알림·결제·외부 연동의 선행 조건', o.dependency],
  ] : kind === 'cost' ? [
    ['확정 견적에 필요한 입력 자료', o.quote],
    ['포함·제외 범위를 견적서에서 구분하는 방법', `기본 비교 범위는 ${firstPhase ?? '핵심 기능과 관리자 화면'}입니다. ${laterPhases.join(' / ')}은 추가 검토 항목으로 분리하고 자동 포함으로 계산하지 않습니다. 디자인·데이터 이관·운영 교육·배포 지원의 실제 포함 범위와 횟수도 견적서에서 확인합니다. 위 가격대는 이 페이지의 범위별 안내이며 시장 평균이나 모든 기능의 확정 총액이 아닙니다.`],
    ['예외 규칙이 바뀌면 견적도 달라지는 이유', `${o.exception} 이 규칙의 변경은 화면뿐 아니라 저장 데이터·알림·취소 처리와 아래 시험 항목을 다시 검토하게 만듭니다. ${o.acceptance} 변경 전후에 필요한 작업과 금액·일정을 별도로 합의합니다.`],
    ['외부 비용·심사·운영비 확인', `${o.dependency} 개발비와 호스팅·도메인·저장/전송·메시지·외부 API의 사용료, 결제 수수료·장비비를 구분해 견적을 비교합니다. 실제 사용량·사업자 계약 조건을 확인하기 전에는 월 실비를 확정하지 않습니다. 추가 개발이나 선택 유지보수는 사용료와 구분합니다.`],
  ] : [
    ['사용자 권한과 데이터 흐름', `${o.roles} ${o.flow}`],
    ['외부 연동 전제와 장애 시 처리', `${o.dependency} 연동할 데이터의 원본, 동기화 방향·주기, 실패 재시도와 담당자 확인 화면을 정합니다. 연결이 확인되지 않은 시스템은 연동 완료를 전제로 도입 일정을 잡지 않습니다.`],
    ['기존 자료 이관과 시험 운영', `${o.quote} 이 자료의 익명 샘플로 필드·식별키·누락·중복을 먼저 확인합니다. 샘플 이관 후 원본 건수·상태·잔액을 대조하고, 승인된 기준일 이후 변경분을 반영합니다. 시험 운영에서는 다음 상황을 실제 업무 담당자가 확인합니다. ${o.exception}`],
    ['검수 기준과 운영 인수인계', `${o.acceptance} 담당자가 통과 여부를 기록한 뒤 운영 전환합니다. 권한표, 데이터 항목·상태 정의, 이관 대조 결과, 배포·백업/복원 절차, 외부 서비스 소유 계정과 장애 연락 경로를 인수인계 목록으로 정합니다. 삭제·내보내기·권한 회수도 운영 교육에서 함께 확인합니다.`],
  ];

  return (
    <>
      {sections.map(([title, body]) => (
        <section className="section-inner" style={{ paddingTop: 8 }} key={title}>
          <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{title}</h2>
          <p className="hub-intro">{body}</p>
        </section>
      ))}
      {kind === 'app' && (
        <div className="section-inner" style={{ paddingTop: 8 }}>
          <p className="hub-intro">
            위 흐름은 이 업종에서 검토할 설계 예시입니다. 실제 공개한 작업 범위는{' '}
            <Link href="/portfolio/">개발 사례</Link>에서 확인하고, 같은 업종의 실적으로 단정하지 않습니다.
          </p>
        </div>
      )}
    </>
  );
}
