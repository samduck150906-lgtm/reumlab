/** Additional decision/acceptance information for existing service pages. */
export const SERVICE_ACCEPTANCE: Record<string, { h2: string; body: string }> = {
  'app-development': {
    h2: '상담 준비와 출시 전 확인',
    body: '사용자·직원·관리자별 필수 행동, 현재 API 문서, 예시 데이터와 스토어 계정 상태를 준비합니다. 로그인 실패·권한 없는 접근·결제 취소·알림 거부·네트워크 끊김을 포함해 검수하고, 개발 완료와 스토어 승인·실제 공개 일정을 구분합니다.',
  },
  'web-development': {
    h2: '홈페이지 공개 전에 확인할 결과',
    body: '페이지 목록·원고·사진 사용권·기존 URL·수정 담당을 준비합니다. 문의 버튼 클릭, 폼 입력, 서버 접수 성공을 별도로 확인하고 모바일 메뉴·긴 표·오류 안내를 검수합니다. CMS와 예약·결제는 선택한 기능 범위이며 단순 소개 사이트에 자동 포함되는 것으로 보지 않습니다.',
  },
  'mvp-development': {
    h2: 'A concrete MVP acceptance example',
    body: 'For a booking MVP, a user selects an available slot, sends a request, and receives a confirmed or rejected status after operator review. Test unavailable slots, duplicate requests, cancellation and role access. Defer optional recommendations or chat, but keep the failure handling needed for the first workflow. A working demo, production release and evidence of market demand are separate outcomes.',
  },
  'flutter-development': {
    h2: 'What to prepare and test on each platform',
    body: 'List device features, required third-party SDKs, offline behavior, supported devices and store account access. Check permissions, push notifications, payments, deep links and lifecycle behavior on both platforms. Shared source code does not remove platform-specific configuration, testing or store review. Agree on the device matrix and handover procedure before quoting.',
  },
  'windows-app-development': {
    h2: '설치·오프라인·주변기기 검수',
    body: '사용할 Windows 버전, 관리자 설치 권한, 프린터·스캐너 모델, 비식별 엑셀 샘플을 준비합니다. 인터넷이 끊겼을 때 저장 위치와 재접속 동기화 충돌을 정하고, 설치·업데이트·제거·백업 복원과 실제 장비 출력을 확인합니다. macOS 지원과 장비 드라이버는 별도 호환성 검토 대상입니다.',
  },
  flutter: {
    h2: '공유 코드와 플랫폼별 검수의 경계',
    body: '화면·공통 업무 로직을 공유해도 알림·결제·카메라·백그라운드·외부 SDK는 플랫폼별 설정과 테스트가 필요합니다. 필요한 기기 기능과 지원 OS·단말을 준비하고, 권한 거절·앱 복귀·네트워크 끊김을 검수합니다. 두 스토어의 승인 시점이 같다고 보장하지 않습니다.',
  },
  'source-handover': {
    h2: '파일 전달 후 실제 인수 확인',
    body: '고객 소유 계정에서 저장소 접근, 새 환경 설치·빌드, 테스트 배포, 데이터 백업·복원을 직접 확인합니다. 환경변수 이름과 설정 방법은 문서화하되 비밀키는 공개 문서에 넣지 않습니다. 이관 뒤 기존 담당자의 권한 회수와 키 교체 대상을 정하고, 제3자 라이선스·양도 제한 목록도 함께 인수합니다.',
  },
  'admin-page-development': {
    h2: '화면보다 먼저 정할 관리자 권한',
    body: '대표·관리자·담당 직원의 조회·수정·삭제·내보내기를 표로 정합니다. 고객 병합, 잘못된 입금 수정, 승인 취소, 직원 퇴사처럼 되돌려야 할 작업을 확인합니다. 비식별 원장 샘플로 합계·잔액을 대조하고, 다른 지점의 정보 접근 차단과 변경 이력을 검수합니다.',
  },
  'academy-shopping-mall': {
    h2: '신청·결제·반 배정의 검수 기준',
    body: '교재 판매와 수강권 판매를 구분하고 학생·보호자·결제자 관계, 반별 정원·휴원·보강·환불 규칙을 준비합니다. 결제 성공과 반 배정 완료를 별도 상태로 표시하며, 마지막 정원 동시 신청·부분 환불·반 이동을 검수합니다. 기존 ERP는 공식 API·이용 권한과 중복 수납 방지 기준을 확인한 뒤 연결합니다.',
  },
  'realestate-landing': {
    h2: '매물 자료와 실제 문의 접수 검수',
    body: '사용 승인된 평면도·사진과 매물 표시 정보, 확인일, 상담 담당을 준비합니다. 거래 완료·조건 변경 시 본문과 광고 문구를 함께 갱신합니다. 전화·카카오 버튼 클릭은 상담 성사가 아니며, 폼도 서버 접수 성공과 담당자 확인을 구분합니다. 분석 이벤트에는 연락처나 상세 문의내용을 넣지 않습니다.',
  },
  maintenance: {
    h2: '오류 접수부터 복구 확인까지',
    body: '발생 URL·앱 버전·기기·시각·재현 순서를 준비하고, 로그에서는 개인정보와 비밀키를 가립니다. 테스트 환경에서 문제를 재현한 뒤 수정·회귀 확인·백업·배포·복구 기준을 합의합니다. 장애 대응 시간, 야간 대응, 외부 서비스 변경 대응은 유지보수 계약 범위에서 별도로 확인합니다.',
  },
  renewal: {
    h2: '화면 개편과 데이터 이전을 함께 검수',
    body: '현재 URL·검색 유입·주요 기능·콘텐츠·데이터 내보내기 가능 여부를 먼저 목록화합니다. 남길 주소와 변경 주소를 대응시키고, 미리보기에서 로그인·문의·예약·결제와 모바일 메뉴를 확인합니다. 전환 당일 데이터 변경분을 반영하는 방식과 이전 환경으로 되돌릴 조건을 정합니다.',
  },
  'cafe24-limit': {
    h2: '유지·부분 연동·이전 중 결정할 자료',
    body: '실제로 막힌 기능, 현재 상품 옵션·주문 흐름, 설치 앱, 요금제, API 이용 권한을 확인합니다. 기존 플랫폼의 설정이나 허용된 연동으로 해결할 수 있으면 전체 이전을 전제로 하지 않습니다. 이전이 필요하면 상품·회원·주문·이미지의 내보내기 범위, 결제 재심사, URL 대응과 운영 중단 시간을 각각 확인합니다.',
  },
  'nocode-limit': {
    h2: '노코드에서 옮기기 전 확인할 경계',
    body: '화면·데이터·자동화 중 제한이 있는 부분과 현재 요금제·권한·API·내보내기 기능을 확인합니다. 일부 기능만 별도 서비스로 연결하는 선택과 전체 재개발을 비교합니다. 기존 자동화 트리거, 사용자 식별자, 결제 구독과 파일 주소를 기록하고, 복사되지 않는 항목의 재구현·재설정 비용을 구분합니다.',
  },
  'app-agency': {
    h2: '업체 비교에 같은 자료를 사용하세요',
    body: '동일한 사용자 흐름·필수 화면·외부 연동·관리자 범위를 전달하고 포함·제외·실비·심사·인수 기준을 같은 표로 비교합니다. 공개 사례에서는 수행 역할과 실제 산출물을 확인합니다. 가격만 낮추기 위해 필요한 오류 처리나 권한 검수를 빼지 않는지, 변경 요청을 어떻게 견적에 반영하는지 묻습니다.',
  },
  'website-agency': {
    h2: '견적서와 납품물의 대응 확인',
    body: '페이지별 질문, 원고·사진 준비 담당, 수정할 항목, 문의 접수 방식과 기존 URL을 전달합니다. 견적의 SEO 포함이 제목 설정인지 본문·내부 링크·이전·제출까지인지 구분합니다. 실제 접수 기록, 모바일 화면, 계정 소유권과 소스 실행 방법을 납품물로 확인하고 검색 순위를 완료 조건으로 약속하지 않습니다.',
  },
};
