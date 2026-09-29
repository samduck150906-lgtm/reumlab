import { decideFromContent, type IndexDecision } from './index-quality';
import { SITE } from './seo';

export type AutomationPriority = 'S' | 'A' | 'B';
export type AutomationPublishMode = 'generated' | 'existing' | 'research-only';

export interface AutomationWorkflow {
  title: string;
  input: string;
  process: string;
  output: string;
  humanReview: string;
}

export interface AutomationFaq {
  q: string;
  a: string;
}

export interface AutomationDomain {
  slug: string;
  name: string;
  category: string;
  priority: AutomationPriority;
  publishMode: AutomationPublishMode;
  targetPage: string;
  shortDescription: string;
  description: string;
  directAnswer: string;
  tools: string[];
  tasks: string[];
  implementationTypes: string[];
  workflows: AutomationWorkflow[];
  constraints: string[];
  faqs: AutomationFaq[];
  relatedDomains: string[];
  metadata: { title: string; description: string };
}

type DomainSeed = readonly [
  slug: string,
  name: string,
  category: string,
  tools: string,
  tasks: string,
  domainConstraint: string,
];

const S_SLUGS = new Set([
  'music-daw', 'video-editing', 'autocad', 'revit-bim', 'construction-estimate', 'excel',
  'google-sheets', 'ocr-documents', 'enterprise-rag', 'email', 'crm', 'quote', 'proposal',
  'ai-customer-support', 'ai-voice', 'accounting', 'tax', 'erp', 'contracts',
  'naver-smartstore', 'cafe24', 'shopify', 'product-registration', 'ad-creative', 'marketing',
  'seo-geo-aeo', 'logistics', 'wms', 'trade-customs', 'manufacturing-vision',
  'field-inspection', 'real-estate', 'academy',
]);

const EXISTING_TARGETS: Record<string, string> = {
  'ai-voice': '/ai-voice-development/',
  'enterprise-rag': '/enterprise-ai/',
  'seo-geo-aeo': '/ai-search-optimization/',
};

/**
 * 제품·업무·제약은 분야별로 직접 작성한다. 아래 seed를 키워드 치환용 문장으로 쓰지 않고,
 * 공개 페이지의 고유 workflow와 기술 타당성 설명을 만드는 편집 데이터로 사용한다.
 */
const SEEDS: DomainSeed[] = [
  ['music-daw', '음악·DAW 자동화', '콘텐츠', 'Cubase|Melodyne|Logic Pro|Pro Tools|Ableton Live|FL Studio|Studio One|Reaper|VST3|MIDI', 'MIDI 패턴 생성|트랙·파일명 정리|Stem 일괄 출력|보컬 피치·타이밍 전처리|BPM·Key 분석|Mixing 프리셋 적용', 'DAW 내부 기능은 제품별 플러그인 규격과 파일 교환 범위가 달라 UI 조작만으로 동일하게 구현할 수 없다.'],
  ['video-editing', '영상 편집 자동화', '콘텐츠', 'Adobe Premiere Pro|DaVinci Resolve|Final Cut Pro|CapCut|FFmpeg|Frame.io', '무음·실수 구간 후보 탐지|자막 초안 생성|B-roll 후보 배치|세로·가로 버전 변환|렌더 큐 생성|검수본 공유', '컷의 의미와 최종 편집 감각은 사람이 검수해야 하며 프로젝트 파일 호환 범위를 먼저 확인해야 한다.'],
  ['after-effects', 'After Effects 자동화', '콘텐츠', 'After Effects|Expressions|ExtendScript|CEP|Premiere Pro|Media Encoder', '컴포지션 복제|텍스트·색상 치환|데이터 기반 모션 생성|버전별 렌더|템플릿 검수|납품 폴더 정리', '서드파티 플러그인과 폰트가 필요한 프로젝트는 실행 환경과 라이선스를 동일하게 맞춰야 한다.'],
  ['photo-retouching', '사진 보정 자동화', '콘텐츠', 'Photoshop|Lightroom|Camera Raw|Adobe Bridge|Capture One|ImageMagick', '누끼 후보 생성|노출·색온도 보정|제품별 크롭|리사이즈·포맷 변환|워터마크 적용|검수본 분류', '피부·제품 색처럼 품질 기준이 주관적인 보정은 샘플 승인과 사람 검수가 필요하다.'],
  ['design-production', '디자인 제작 자동화', '콘텐츠', 'Illustrator|Photoshop|Canva|Adobe InDesign|Figma|Google Sheets', '배너 규격별 생성|가격·문구 치환|상세페이지 블록 조립|인쇄 파일 내보내기|브랜드 규칙 검사|소재 버전 관리', '브랜드 일관성과 저작권 확인은 자동 생성 뒤 승인 단계로 남겨야 한다.'],
  ['figma', 'Figma 자동화', '콘텐츠', 'Figma Plugin API|Figma REST API|FigJam|Storybook|Tokens Studio|GitHub', '디자인 토큰 동기화|반복 화면 생성|컴포넌트 사용 검사|개발 명세 추출|콘텐츠 일괄 교체|문서 링크 정리', 'REST API와 Plugin API의 권한·실행 위치가 다르므로 필요한 쓰기 범위를 먼저 구분해야 한다.'],
  ['blender', 'Blender 자동화', '콘텐츠', 'Blender|Blender Python API|Geometry Nodes|Cycles|Eevee|USD', '에셋 일괄 배치|재질 치환|카메라 생성|렌더 큐 실행|파일 포맷 변환|메타데이터 정리', 'GPU·애드온·Blender 버전 차이가 렌더 결과와 스크립트 호환성에 영향을 준다.'],
  ['3ds-max', '3ds Max 자동화', '콘텐츠', '3ds Max|MAXScript|Python|Arnold|V-Ray|FBX', '장면 정리|재질 경로 수정|오브젝트 명명|카메라 일괄 배치|렌더 설정 검사|FBX 내보내기', '렌더러 플러그인과 버전이 다른 환경에서는 같은 스크립트도 재검증해야 한다.'],
  ['maya', 'Maya 자동화', '콘텐츠', 'Maya|Maya Python|MEL|Arnold|USD|Alembic', '리깅 검사|애니메이션 베이크|에셋 퍼블리시|네임스페이스 정리|캐시 출력|샷 폴더 생성', '스튜디오별 리그와 퍼블리시 규칙이 달라 샘플 에셋으로 먼저 검증해야 한다.'],
  ['game-production', '게임 제작 자동화', '콘텐츠', 'Unity|Unreal Engine|C#|Blueprint|Perforce|Jenkins', '에셋 임포트 검사|빌드 생성|레벨 데이터 배치|자동 플레이 테스트|로그 분류|스토어 패키지 준비', '게임플레이 재미와 아트 품질은 자동 판정할 수 없고 엔진 버전별 빌드 검증이 필요하다.'],
  ['autocad', 'AutoCAD 자동화', '설계', 'AutoCAD|AutoLISP|ObjectARX|.NET API|DWG|DXF|Autodesk Platform Services', '도면 속성 일괄 수정|블록·레이어 표준화|치수·문자 검사|도면 목록 생성|PDF 일괄 출력|DWG 데이터 추출', '사용 중인 AutoCAD 버전과 도면 표준, 커스텀 객체 여부에 따라 AutoLISP·플러그인·클라우드 처리 방식이 달라진다.'],
  ['revit-bim', 'Revit/BIM 자동화', '설계', 'Autodesk Revit|Revit API|Dynamo|BIM 360|Autodesk Construction Cloud|IFC', '패밀리 배치|파라미터 일괄 입력|모델 규칙 검사|물량표 생성|시트·뷰 작성|IFC 내보내기', '모델링 규칙과 패밀리 품질이 불균일하면 자동 물량과 검수 결과도 달라져 BIM 기준 정의가 먼저다.'],
  ['sketchup', 'SketchUp 자동화', '설계', 'SketchUp|Ruby API|LayOut|3D Warehouse|V-Ray|CSV', '컴포넌트 배치|속성 입력|장면 생성|수량 집계|LayOut 문서화|렌더 준비', '외부 컴포넌트의 구조와 단위가 일정하지 않으면 수량·배치 자동화 전에 정규화가 필요하다.'],
  ['rhino-grasshopper', 'Rhino/Grasshopper 자동화', '설계', 'Rhino|Grasshopper|RhinoCommon|Python|Rhino.Inside.Revit|STEP', '파라메트릭 형상 생성|옵션 조합 탐색|패널 분할|수량 계산|Revit 데이터 전달|제작 파일 출력', '파라미터 범위와 제작 제약을 명시하지 않으면 생성 가능한 형상과 실제 시공 가능한 형상이 달라진다.'],
  ['solidworks', 'SolidWorks 자동화', '설계', 'SolidWorks|SolidWorks API|PDM|VBA|STEP|eDrawings', '부품 속성 입력|도면 생성|BOM 작성|설계 규칙 검사|파일 변환|PDM 등록', '참조 관계와 구성(Configuration)이 복잡한 어셈블리는 변경 영향 검증이 필요하다.'],
  ['inventor', 'Inventor 자동화', '설계', 'Autodesk Inventor|iLogic|Inventor API|Vault|Excel|DWG', '부품 파라미터 변경|도면 뷰 생성|BOM 정리|iLogic 규칙 실행|Vault 등록|납품 파일 패키징', 'iLogic 규칙과 사내 템플릿의 의존성을 먼저 파악해야 결과를 재현할 수 있다.'],
  ['fusion-360', 'Fusion 360 자동화', '설계', 'Autodesk Fusion|Fusion API|Python|JavaScript|STEP|CAM', '파라미터 모델 생성|부품 변형 생성|CAM 설정 보조|도면 출력|파일 변환|작업 로그 저장', '클라우드 문서 권한과 제조 장비별 CAM 검증은 별도 승인 절차가 필요하다.'],
  ['gis', 'GIS 자동화', '설계', 'QGIS|ArcGIS Pro|ArcPy|PostGIS|GeoPandas|GDAL', '좌표계 변환|공간 데이터 정리|버퍼·중첩 분석|지도 이미지 생성|속성 보고서 작성|정기 데이터 갱신', '좌표계와 원천 데이터 품질을 확인하지 않으면 위치 오차가 분석 결과 전체에 전파된다.'],
  ['construction-estimate', '건축 견적 자동화', '설계', 'AutoCAD|Revit|Dynamo|Microsoft Excel|PDF|ERP', '도면·모델 물량 추출|공종 코드 매핑|단가표 연결|내역서 생성|변경분 비교|검토용 근거 표시', '자동 산출은 입력 도면과 산출 기준에 의존하며 최종 견적과 계약 금액은 담당자의 검토가 필요하다.'],
  ['interior-estimate', '인테리어 견적 자동화', '설계', 'AutoCAD|SketchUp|Microsoft Excel|Google Sheets|PDF|ERP', '공간별 수량 계산|자재 단가 연결|옵션별 견적 비교|도면 변경 반영|고객용 견적 출력|발주 목록 생성', '현장 상태와 로스율처럼 도면에 없는 변수는 담당자가 입력하고 승인해야 한다.'],
  ['excel', 'Excel 자동화', '사무', 'Microsoft Excel|VBA|Office Scripts|Power Query|Python|Microsoft Graph', '반복 입력 통합|여러 파일 취합|수식·오류 검사|정산표 생성|보고서·차트 작성|메일·시스템 전송', '병합 셀과 자유 형식 문서가 많으면 먼저 표준 입력 구조를 정해야 안정적으로 자동화할 수 있다.'],
  ['google-sheets', 'Google Sheets 자동화', '사무', 'Google Sheets|Apps Script|Google Drive|Gmail|Looker Studio|Google Forms', '시트 데이터 취합|행별 상태 처리|승인 알림 전송|정산 계산|대시보드 갱신|PDF 문서 생성', 'Apps Script 실행 시간과 API 할당량, 공유 권한 범위를 고려해 배치 단위를 설계해야 한다.'],
  ['hwp', 'HWP/한글 자동화', '사무', '한컴오피스 한글|HWPX|HWP|Hancom Docs|Python|PDF', '양식 필드 채우기|문서 묶음 생성|표 데이터 삽입|파일명 표준화|PDF 변환|문서 내용 추출', 'HWP 바이너리 형식과 설치 환경에 따라 HWPX 변환 또는 데스크톱 자동화가 필요할 수 있다.'],
  ['pdf', 'PDF 자동화', '사무', 'Adobe Acrobat|PDF|OCRmyPDF|PyMuPDF|PDF.js|Microsoft Excel', '분할·병합|페이지 분류|텍스트·표 추출|양식 채우기|전자문서 생성|검수용 강조 표시', '스캔 품질·암호·서명·복잡한 표에 따라 추출 정확도가 달라 원문 대조 절차가 필요하다.'],
  ['ocr-documents', 'OCR·문서 자동화', '사무', 'Google Document AI|Azure AI Document Intelligence|Amazon Textract|Tesseract OCR|PDF|Microsoft Excel', '영수증 필드 추출|명세서 표 구조화|계약서 유형 분류|필수값 검증|ERP 입력 후보 생성|오류 문서 재검수', 'OCR 결과는 원본 해상도와 서식 변화에 영향을 받으므로 신뢰도 기준과 사람 검수 큐를 함께 설계해야 한다.'],
  ['enterprise-rag', '사내문서 AI·RAG', '사무', 'SharePoint|Google Drive|Notion|Confluence|Elasticsearch|OpenAI API', '문서 권한별 검색|근거 문장 인용|규정 질의응답|버전 변경 반영|미답변 분리|검색 로그 분석', '답변은 연결된 문서 범위 안에서만 가능하며 권한과 최신성, 인용 근거를 함께 검증해야 한다.'],
  ['notion', 'Notion 자동화', '사무', 'Notion API|Notion Database|Slack|Google Calendar|Zapier|Make', '데이터베이스 항목 생성|상태 변경 알림|회의록 연결|업무 템플릿 복제|주간 보고 생성|외부 폼 동기화', 'Notion API가 제공하지 않는 UI 기능과 권한 상속은 별도 대안을 검토해야 한다.'],
  ['powerpoint', 'PowerPoint·보고서 자동화', '사무', 'Microsoft PowerPoint|Microsoft Graph|PptxGenJS|Excel|Google Slides|Python', '데이터 기반 슬라이드 생성|차트 갱신|고객별 문구 치환|템플릿 검사|PDF 출력|버전별 패키징', '폰트·템플릿·차트 호환성을 실제 사용 PC와 동일한 환경에서 확인해야 한다.'],
  ['email', 'Gmail·Outlook 이메일 자동화', '사무', 'Gmail API|Microsoft Graph|Outlook|Google Workspace|HubSpot|Slack', '문의 메일 분류|담당자 배정|회신 초안 작성|첨부파일 저장|CRM 활동 기록|후속 일정 알림', '자동 발송은 오분류와 잘못된 수신 위험이 있어 초안·승인·발송 권한을 분리해야 한다.'],
  ['meeting', '회의·녹취 자동화', '사무', 'Zoom|Microsoft Teams|Google Meet|Whisper|Google Calendar|Notion', '회의 녹취|화자 구분|결정사항 추출|할 일 배정|회의록 공유|후속 일정 등록', '녹음 동의와 개인정보 보관 기간을 정하고 잘못 인식된 고유명사는 사람이 확인해야 한다.'],
  ['crm', 'CRM 자동화', '영업', 'Salesforce|HubSpot|Microsoft Dynamics 365|Pipedrive|Gmail|Slack', '리드 자동 등록|문의 유형 분류|담당자 배정|후속 연락 알림|영업 단계 갱신|주간 파이프라인 보고', 'CRM 쓰기 권한과 중복 고객 병합 규칙을 정의하지 않으면 기존 영업 데이터가 오염될 수 있다.'],
  ['quote', '견적서 자동화', '영업', 'Microsoft Excel|Google Sheets|HubSpot|Salesforce|PDF|ERP', '문의 정보 정리|상품·단가 조회|할인 승인 요청|견적서 생성|이메일 발송 준비|수락 상태 기록', '단가·할인·세금 기준과 승인 권한을 시스템에 명시하고 최종 발송 전 담당자가 확인해야 한다.'],
  ['proposal', '제안서 자동화', '영업', 'PowerPoint|Google Slides|Microsoft Word|Google Docs|CRM|Notion', '고객 정보 요약|유사 사례 검색|목차 구성|제안서 초안 생성|브랜드 템플릿 적용|검토본 배포', '고객별 약속과 성과 수치는 자동 생성하지 않고 영업 담당자가 근거를 확인해야 한다.'],
  ['ai-customer-support', 'AI 고객상담', '영업', '웹챗|카카오톡 채널|Zendesk|Intercom|HubSpot|Slack', '반복 질문 응답|문의 의도 분류|예약 정보 수집|담당자 이관|CRM 상담 기록|미답변 지식 수집', '환불·계약 변경·민감 정보 처리처럼 권한이 필요한 업무는 사람에게 이관해야 한다.'],
  ['ai-voice', 'AI 전화상담', '영업', 'STT|TTS|SIP|Twilio|CRM|Google Calendar', '전화 접수|영업시간 안내|예약 후보 확인|문의 내용 요약|담당자 이관|통화 결과 기록', '통화 녹음 고지와 개인정보 처리, 최종 예약·결제 승인 범위를 명확히 나눠야 한다.'],
  ['call-qa', '상담 QA 자동화', '영업', '콜센터 녹취|STT|CRM|Power BI|Looker Studio|Slack', '통화 텍스트 변환|필수 안내 탐지|감정·이슈 후보 분류|상담 요약|코칭 후보 추출|품질 리포트 생성', '자동 평가는 코칭 보조 지표이며 직원 인사 판단을 단독으로 대신해서는 안 된다.'],
  ['recruiting', '채용 자동화', '인사', 'Greenhouse|Lever|Workday|사람인|잡코리아|Google Calendar', '지원서 수집|요건 기준 분류|면접 일정 조율|지원자 안내|평가표 취합|채용 현황 보고', '차별 가능성이 있는 자동 탈락 판단을 피하고 최종 선발은 사람이 근거를 검토해야 한다.'],
  ['hr', 'HR 자동화', '인사', 'Workday|SAP SuccessFactors|Microsoft 365|Google Workspace|Slack|Notion', '입사 서류 안내|계정 생성 요청|온보딩 체크리스트|증명서 신청|휴가 승인 흐름|퇴사 권한 회수', '인사 정보는 최소 권한과 보관 기간을 적용하고 승인 기록을 남겨야 한다.'],
  ['attendance-payroll', '근태·급여 자동화', '인사', 'ERP|더존|Excel|Google Sheets|근태 단말|HRIS', '출퇴근 데이터 취합|누락·이상 근태 표시|수당 계산 보조|급여 입력 파일 생성|검토표 작성|지급 결과 보관', '근로 규정과 예외 수당은 회사별로 달라 노무·급여 담당자의 최종 검토가 필요하다.'],
  ['accounting', '회계 자동화', '재무', '더존|SAP|Oracle ERP|Microsoft Excel|홈택스|OCR', '증빙 수집|계정과목 후보 분류|전표 입력 후보 생성|미결 항목 대사|결산 체크리스트|감사 자료 묶음 생성', '회계 판단과 최종 전표 승인은 담당자가 수행하며 자동 분류 근거와 수정 이력을 남겨야 한다.'],
  ['tax', '세무 업무 자동화', '재무', '홈택스|더존|Microsoft Excel|PDF|OCR|ERP', '세금계산서 취합|증빙 유형 분류|신고 자료 목록 생성|누락 후보 탐지|거래처별 파일 정리|세무대리인 전달 자료 생성', '세법 적용과 신고 책임은 세무 전문가에게 있으며 시스템은 자료 준비와 누락 확인을 보조한다.'],
  ['erp', 'ERP 자동화', '재무', 'SAP|Oracle ERP|더존|Microsoft Dynamics 365|Microsoft Excel|REST API', '거래 데이터 입력|승인 요청|마스터 데이터 동기화|오류 목록 생성|부서별 집계|외부 시스템 연동', '운영 ERP의 직접 수정은 권한·감사 로그·롤백 방안을 갖춘 뒤 단계적으로 적용해야 한다.'],
  ['procurement', '구매·발주 자동화', '재무', 'ERP|Microsoft Excel|Outlook|Gmail|전자결재|WMS', '구매 요청 취합|공급사 견적 비교|승인 라우팅|발주서 생성|입고 상태 확인|미입고 알림', '공급사 선정과 고액 발주는 사람이 승인하고 단가 변경 이력을 보존해야 한다.'],
  ['bidding', '입찰 자동화', '전문업무', '나라장터|Microsoft Word|한컴오피스 한글|PDF|Excel|전자결재', '공고 조건 분류|마감 일정 등록|필수 서류 체크|회사 정보 삽입|제출본 패키징|결과 이력 정리', '공고별 제출 기준과 전자서명은 담당자가 원문을 대조하고 최종 제출해야 한다.'],
  ['contracts', '계약서 자동화', '전문업무', 'Microsoft Word|PDF|DocuSign|Adobe Acrobat|SharePoint|CRM', '표준 계약서 생성|변경 조항 비교|필수 조항 누락 표시|승인 흐름 연결|서명본 보관|갱신 일정 알림', '시스템은 조항 검색·비교·초안을 보조하며 법률 판단과 최종 계약 승인은 변호사·담당자가 맡아야 한다.'],
  ['legal-documents', '법무 문서 AI', '전문업무', 'Microsoft Word|PDF|SharePoint|Elasticsearch|OpenAI API|전자결재', '계약·규정 검색|조항 요약|유사 문서 찾기|변경점 비교|검토 체크리스트|담당자 배정', '법률 결론을 자동 확정하지 않고 인용 원문과 불확실성을 함께 보여 줘야 한다.'],
  ['patent', '특허 업무 자동화', '전문업무', 'KIPRIS|Google Patents|Espacenet|PDF|Microsoft Excel|RAG', '문헌 수집|분류 코드 정리|핵심 청구항 추출|유사 문헌 묶기|검토표 생성|기한 알림', '선행기술 판단과 출원 전략은 변리사 검토가 필요하며 수집 범위의 누락 가능성을 표시해야 한다.'],
  ['research-literature', '연구문헌 자동화', '전문업무', 'PubMed|Crossref|Google Scholar|Zotero|PDF|Jupyter', '논문 메타데이터 수집|주제별 분류|초록 요약|표·수치 추출|인용 형식 정리|검토 목록 생성', '요약은 원문을 대체하지 않으며 연구 결론과 통계 해석은 연구자가 확인해야 한다.'],
  ['naver-smartstore', '네이버 스마트스토어 자동화', '커머스', '네이버 스마트스토어|커머스API|네이버페이|ERP|WMS|Microsoft Excel', '상품 정보 변환|주문 수집|송장 상태 반영|재고 동기화|문의 분류|정산 자료 취합', '커머스API 권한과 판매자 정책 범위 안에서 구현하며 자동 답변·상품 변경은 승인 규칙을 둬야 한다.'],
  ['cafe24', 'Cafe24 자동화', '커머스', 'Cafe24|Cafe24 API|ERP|WMS|Google Sheets|Slack', '상품 일괄 등록|옵션·재고 동기화|주문 수집|배송 상태 반영|회원 데이터 연결|운영 리포트 작성', '쇼핑몰 스킨·앱·API 버전과 개인정보 접근 권한을 확인한 뒤 쓰기 작업을 적용해야 한다.'],
  ['shopify', 'Shopify 자동화', '커머스', 'Shopify|Shopify Admin API|Shopify Flow|ERP|Klaviyo|WMS', '상품·컬렉션 생성|주문 상태 연동|재고 동기화|고객 세그먼트 갱신|마케팅 이벤트 전달|반품 흐름 연결', '앱 권한과 API 사용 제한, 국가별 결제·세금 정책을 고려해 자동화 범위를 나눠야 한다.'],
  ['marketplace-integration', '오픈마켓 통합 자동화', '커머스', '쿠팡|11번가|G마켓|옥션|ERP|WMS', '상품 데이터 표준화|채널별 등록|주문 통합|재고 동기화|송장 전송|판매 현황 집계', '마켓마다 옵션·카테고리·API 정책이 달라 공통 모델과 채널별 예외를 분리해야 한다.'],
  ['product-registration', '상품등록 자동화', '커머스', '네이버 스마트스토어|Cafe24|Shopify|쿠팡|ERP|PIM', '이미지·원가 데이터 수집|상품명 초안 생성|옵션 표준화|카테고리 후보 추천|채널별 설명 변환|등록 전 검수표 생성', '과장 광고와 금지 표현, 카테고리 오분류를 막기 위해 최종 게시 전 판매자 검수가 필요하다.'],
  ['review-voc', '리뷰·VOC 분석', '커머스', '네이버 플레이스|스마트스토어|Shopify|Zendesk|Microsoft Excel|Looker Studio', '리뷰 수집|주제 분류|불만 원인 묶기|긴급 이슈 알림|제품별 추이 비교|개선 과제 보고', '플랫폼 이용약관과 개인정보를 지키고 감정 분석 결과를 사실처럼 단정하지 않아야 한다.'],
  ['ad-creative', '광고 제작 자동화', '마케팅', 'Google Ads|Meta Ads|네이버 광고|Figma|Photoshop|Google Sheets', '상품 데이터 취합|카피 변형 생성|규격별 소재 제작|금지 표현 검사|랜딩 파라미터 생성|검수본 승인', '광고 심사와 성과는 보장할 수 없으며 브랜드·법무 검토 후 게시해야 한다.'],
  ['marketing', '마케팅 자동화', '마케팅', 'HubSpot|Salesforce|Klaviyo|Mailchimp|Google Analytics 4|GTM', '리드 세그먼트 분류|후속 메시지 예약|행동 이벤트 연결|휴면 고객 분리|캠페인 성과 집계|영업 이관', '수신 동의와 빈도 제한, 채널별 개인정보 정책을 적용하고 과도한 자동 발송을 막아야 한다.'],
  ['seo-geo-aeo', 'SEO·GEO·AEO 자동화', '마케팅', 'Google Search Console|Bing Webmaster Tools|네이버 서치어드바이저|GA4|IndexNow|Lighthouse', '색인 상태 수집|canonical·sitemap 검사|검색어·CTR 분류|콘텐츠 품질 점검|AI 인용 모니터링|개선 큐 생성', '제출 성공은 색인이나 순위를 뜻하지 않으며 대량 저품질 콘텐츠를 자동 발행해서는 안 된다.'],
  ['sns', 'SNS 자동화', '마케팅', 'Instagram|Facebook|LinkedIn|YouTube|Buffer|Canva', '콘텐츠 캘린더 생성|채널별 문구 변환|예약 게시|댓글 분류|성과 지표 취합|재활용 후보 추천', '플랫폼 API·자동화 정책을 지키고 게시 전 브랜드 담당자가 내용과 권리를 확인해야 한다.'],
  ['youtube', 'YouTube 자동화', '마케팅', 'YouTube|YouTube Data API|Premiere Pro|FFmpeg|Whisper|Photoshop', '자막 생성|구간 목차 후보 작성|쇼츠 구간 탐지|썸네일 초안|업로드 메타데이터 준비|댓글 주제 분석', '저작권·초상권과 최종 편집 품질은 제작자가 검수하고 자동 업로드 권한을 제한해야 한다.'],
  ['localization', '번역·현지화 자동화', '콘텐츠', 'DeepL|Google Cloud Translation|CAT Tool|XLIFF|GitHub|Contentful', '번역 대상 추출|용어집 적용|초안 번역|숫자·변수 검사|리뷰 배정|배포 파일 생성', '브랜드 문체와 법률·의료 표현은 전문 번역가 검수가 필요하며 변수·태그를 보존해야 한다.'],
  ['logistics', '물류·배차 자동화', '물류', 'TMS|ERP|Google Maps Platform|Kakao Mobility API|Microsoft Excel|SMS', '배송 요청 취합|차량·기사 조건 확인|배차 후보 생성|운송장·상태 공유|지연 알림|일별 실적 집계', '교통·차량·기사 상태가 실시간으로 바뀌므로 자동 배차 뒤 운영자 승인과 재배정 수단이 필요하다.'],
  ['wms', 'WMS·창고 자동화', '물류', 'WMS|ERP|바코드|RFID|PDA|택배 API', '입고 검수|로케이션 배정|피킹 목록 생성|재고 이동 기록|출고 송장 연결|실사 차이 보고', '현장 스캔 누락과 단위 변환 오류를 막기 위해 바코드·품목 마스터 정비가 먼저다.'],
  ['trade-customs', '무역·통관 자동화', '물류', 'Commercial Invoice|Packing List|ERP|관세청 UNI-PASS|Microsoft Excel|PDF', '주문 데이터 취합|Invoice 생성|Packing List 생성|HS 자료 후보 정리|선적 문서 검수|통관 이력 보관', 'HS 코드와 원산지·규제 판단은 관세 전문가가 확인하고 대외 제출 전 승인해야 한다.'],
  ['manufacturing-vision', '제조 비전검사 AI', '제조', '산업용 카메라|OpenCV|PyTorch|ONNX Runtime|MES|PLC', '이미지 수집|불량 유형 라벨링|검사 모델 학습|라인 추론|불확실 샘플 분리|MES 결과 기록', '조명·카메라·제품 편차가 정확도에 직접 영향을 주므로 현장 샘플과 미검출 기준으로 검증해야 한다.'],
  ['manufacturing-data', '제조 데이터·MES 자동화', '제조', 'MES|ERP|PLC|OPC UA|Microsoft SQL Server|Power BI', '생산 실적 수집|설비 상태 연결|이상 값 표시|불량 원인 집계|교대 보고서 생성|ERP 실적 전송', '설비 데이터의 시간 동기화와 단위, 생산 코드 매핑을 먼저 맞춰야 한다.'],
  ['field-inspection', '현장점검 AI', '제조', '모바일 카메라|OpenCV|OCR|GPS|GIS|PDF', '점검 사진 촬영|위치·설비 연결|결함 후보 표시|체크리스트 검증|점검 보고서 생성|재점검 일정 등록', '사진만으로 안전 판정을 확정하지 않고 불명확하거나 위험한 항목은 현장 전문가에게 이관해야 한다.'],
  ['real-estate', '부동산 업무 자동화', '산업', '부동산 CRM|네이버 부동산|Google Maps|카카오톡 채널|Microsoft Excel|전자계약', '매물 정보 정리|중복 매물 탐지|문의 자동 분류|방문 일정 조율|고객별 추천 후보|계약 서류 체크', '매물의 실재·가격·권리관계는 담당 중개사가 확인하고 플랫폼 약관 범위에서 데이터를 사용해야 한다.'],
  ['hospitality-travel', '숙박·여행 운영 자동화', '산업', 'PMS|Booking.com|Expedia|Airbnb|채널매니저|카카오톡 채널', '예약 통합|객실 상태 동기화|체크인 안내|문의 분류|청소 일정 배정|리뷰 요청 발송', '채널별 취소·환불 정책과 실제 객실 상태가 다를 수 있어 예외 처리와 운영자 승인이 필요하다.'],
  ['academy', '학원 운영 자동화', '산업', '학원 ERP|네이버 예약|카카오 알림톡|Google Sheets|결제 API|출결 단말', '상담 문의 등록|반 배정 후보|출결 집계|수납·미납 알림|학부모 안내|강사별 운영 보고', '학생 개인정보와 결제 정보를 최소 권한으로 다루고 반 배정·상담 판단은 원장·담당자가 확인해야 한다.'],
  ['hospital-admin', '병원 행정 자동화', '산업', '병원 예약 시스템|EMR 연동 게이트웨이|카카오 알림톡|콜 시스템|OCR|전자문서', '예약 문의 접수|진료 전 안내|서류 요청 분류|대기 알림|콜 요약|행정 문서 정리', '진단·처방은 자동화 범위가 아니며 의료정보 접근 권한과 환자 동의를 엄격히 분리해야 한다.'],
];

const split = (value: string) => value.split('|').map((item) => item.trim()).filter(Boolean);

function relatedFor(seed: DomainSeed): string[] {
  const sameCategory = SEEDS.filter((item) => item[2] === seed[2] && item[0] !== seed[0]);
  const pool = sameCategory.length >= 2 ? sameCategory : SEEDS.filter((item) => item[0] !== seed[0]);
  return pool.slice(0, 3).map((item) => item[0]);
}

function workflowsFor(name: string, tasks: string[], tools: string[]): AutomationWorkflow[] {
  return tasks.slice(0, 5).map((task, index) => ({
    title: task,
    input: index % 2 === 0 ? `현재 사용하는 ${tools[index % tools.length]} 자료와 처리 기준` : '담당자가 지금 입력·복사·확인하는 원본 데이터',
    process: `${task} 규칙을 실행하고 처리 근거와 예외를 함께 기록`,
    output: `${task} 결과물과 실패·누락 항목 목록`,
    humanReview: index === 0 ? '첫 샘플과 예외 기준을 담당자가 승인' : '확신도가 낮거나 권한이 필요한 항목만 담당자가 확인',
  }));
}

function faqsFor(name: string, tools: string[], constraint: string): AutomationFaq[] {
  return [
    { q: `${name}은 어디까지 자동화할 수 있나요?`, a: `반복 규칙이 있고 입력과 결과를 확인할 수 있는 업무부터 자동화할 수 있습니다. ${tools.slice(0, 3).join('·')}의 실제 사용 과정과 예외를 확인한 뒤 자동 처리와 사람 검수 범위를 나눕니다.` },
    { q: '현재 쓰는 프로그램을 바꿔야 하나요?', a: '대부분은 기존 프로그램을 유지하고 공식 API, SDK, 플러그인, 파일 import/export 순서로 연결 가능성을 검토합니다. 새 시스템은 기존 도구로 처리하기 어려운 단계에만 추가합니다.' },
    { q: '공식 API가 없어도 자동화할 수 있나요?', a: '가능한 경우가 있지만 먼저 파일 교환과 플러그인 방식을 검토합니다. 브라우저나 데스크톱 조작이 필요하면 화면 변경과 오류에 취약하므로 감시·중단·수동 복구 절차를 함께 둡니다.' },
    { q: 'AI가 결과를 전부 확정하나요?', a: '아닙니다. 분류·초안·후보 생성은 자동화하되 금액, 계약, 법적 판단, 외부 발송처럼 영향이 큰 단계는 확인 버튼이나 담당자 승인 뒤 실행하도록 설계합니다.' },
    { q: '개발 비용과 기간은 어떻게 정해지나요?', a: '연동할 프로그램, 입력 데이터 상태, 처리 건수, 예외 수, 승인 단계, 배포 환경을 확인한 뒤 견적과 기간을 산정합니다. 확인 전 임의의 고정 가격을 제시하지 않습니다.' },
    { q: '도입 전에 무엇을 준비하면 되나요?', a: `현재 작업 화면이나 샘플 파일, 처리 순서, 자주 생기는 예외, 원하는 결과물을 준비하면 됩니다. 기술적 제약은 다음과 같습니다: ${constraint}` },
  ];
}

function buildDomain(seed: DomainSeed): AutomationDomain {
  const [slug, name, category, toolText, taskText, domainConstraint] = seed;
  const tools = split(toolText);
  const tasks = split(taskText);
  const priority: AutomationPriority = S_SLUGS.has(slug) ? 'S' : category === '콘텐츠' || category === '사무' ? 'A' : 'B';
  const targetPage = EXISTING_TARGETS[slug] ?? `/ai-automation/${slug}/`;
  const publishMode: AutomationPublishMode = priority !== 'S' ? 'research-only' : EXISTING_TARGETS[slug] ? 'existing' : 'generated';
  const shortDescription = `${tools.slice(0, 2).join('·')}에서 반복하는 ${tasks.slice(0, 2).join('·')} 업무를 줄이는 맞춤 개발`;
  const description = `${name} 개발은 ${tools.slice(0, 4).join(', ')}에서 사람이 반복하는 ${tasks.slice(0, 3).join(', ')} 과정을 분석하고, 가능한 단계만 API·플러그인·파일 연동·AI로 연결하는 서비스입니다.`;
  const directAnswer = `${name}은 모든 화면을 무리하게 자동 조작하는 일이 아닙니다. ${tools.slice(0, 3).join(', ')}에서 데이터로 제어할 수 있는 ${tasks.slice(0, 3).join(', ')}부터 연결하고, 권한이 필요하거나 결과가 불확실한 단계는 담당자가 확인하도록 만듭니다.`;
  const constraints = [domainConstraint, '외부 서비스 권한·라이선스·개인정보 범위를 확인하고, 실패 시 중단·재처리·사람 이관 경로를 함께 설계한다.'];
  const metadata = {
    title: `${name} 프로그램 개발 | 반복 업무 맞춤 자동화 | 름랩`,
    description,
  };
  return {
    slug,
    name,
    category,
    priority,
    publishMode,
    targetPage,
    shortDescription,
    description,
    directAnswer,
    tools,
    tasks,
    implementationTypes: ['API·Webhook 연동', '웹·데스크톱 업무 도구', 'AI 분류·생성 + 사람 검수', '배치 처리·운영 로그'],
    workflows: workflowsFor(name, tasks, tools),
    constraints,
    faqs: faqsFor(name, tools, domainConstraint),
    relatedDomains: relatedFor(seed),
    metadata,
  };
}

export const AUTOMATION_DOMAINS: AutomationDomain[] = SEEDS.map(buildDomain);
export const PRIORITY_S_DOMAINS = AUTOMATION_DOMAINS.filter((domain) => domain.priority === 'S');
export const GENERATED_AUTOMATION_DOMAINS = AUTOMATION_DOMAINS.filter((domain) => domain.publishMode === 'generated');

const DOMAIN_BY_SLUG = new Map(AUTOMATION_DOMAINS.map((domain) => [domain.slug, domain]));

export function getAutomationDomain(slug: string): AutomationDomain | undefined {
  return DOMAIN_BY_SLUG.get(slug);
}

export function automationCanonical(domain: AutomationDomain): string {
  return domain.publishMode === 'existing' ? `${SITE.domain}${domain.targetPage}` : `${SITE.domain}/ai-automation/${domain.slug}/`;
}

export function automationBodyParts(domain: AutomationDomain): string[] {
  return [
    domain.directAnswer,
    domain.description,
    `자동화 대상 업무: ${domain.tasks.join(', ')}.`,
    `연결 검토 도구: ${domain.tools.join(', ')}.`,
    `구현 방식: ${domain.implementationTypes.join(', ')}.`,
    ...domain.workflows.flatMap((flow) => [flow.title, flow.input, flow.process, flow.output, flow.humanReview]),
    ...domain.constraints,
    '개발은 현재 작업을 관찰하고 샘플 입력과 기대 결과를 합의한 뒤, 가장 작은 PoC로 기술 가능성과 오류 유형을 확인하는 순서로 진행합니다. 이후 권한과 승인 단계를 연결하고 실제 데이터로 QA한 다음 소스코드·운영 방법·예외 처리 기준을 이관합니다.',
    '비용과 기간은 프로그램 수, 데이터 정리 상태, 한 달 처리 건수, 예외 규칙, 사람 승인 단계, 사내 설치 여부에 따라 달라집니다. 상담 전에 고정 가격이나 절감률을 약속하지 않고 실제 범위를 확인한 뒤 견적을 제시합니다.',
  ];
}

/**
 * 중복 검사는 공통 개발 절차·비용 고지 같은 템플릿 문장을 제외한 편집 핵심만 비교한다.
 * index-quality의 uniqueBodyText 계약(치환문 제외 고유 단락)에 맞춘 입력이다.
 */
export function automationDistinctiveBodyParts(domain: AutomationDomain): string[] {
  return [
    domain.directAnswer,
    domain.description,
    ...domain.tools,
    ...domain.tasks,
    ...domain.constraints,
  ];
}

const RESEARCH_ONLY_DECISION: IndexDecision = {
  score: 0,
  verdict: 'noindex',
  shouldIndex: false,
  inSitemap: false,
  reasons: ['연구 자산 전용 — 고유 공개 근거를 보강하기 전에는 URL을 생성하지 않음'],
};

export function automationDecision(slug: string): IndexDecision | undefined {
  const domain = getAutomationDomain(slug);
  if (!domain) return undefined;
  if (domain.publishMode === 'research-only') return RESEARCH_ONLY_DECISION;
  return decideFromContent({
    title: domain.metadata.title,
    description: domain.metadata.description,
    h1: `${domain.name} 프로그램 개발`,
    bodyParts: automationBodyParts(domain),
    faqQuestions: domain.faqs.map((faq) => faq.q),
    internalLinks: domain.relatedDomains.length + 3,
  });
}
