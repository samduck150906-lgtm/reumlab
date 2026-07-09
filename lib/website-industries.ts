/**
 * 프로그래매틱 SEO 축 — 업종(버티컬) × 홈페이지 제작
 * 라우트: /website/[industry]
 *
 * 파워링크 키워드 리서치("{업종} 홈페이지 제작" 294종)를 그대로 라우팅·SEO·상위노출에
 * 반영한다. /app/[industry](앱개발) 와 검색 의도가 다르다:
 *   - /app/[industry]   → "무엇을 만드나"(앱 기능)   구매자: 앱/솔루션 도입
 *   - /website/[industry] → "홈페이지를 어떻게 만드나"(페이지 구성·검색 노출·비용)
 * 자기잠식(cannibalization)을 피하려 canonical·본문·내부링크를 분리한다.
 *
 * 도어웨이/얇은 콘텐츠 페널티 회피 — 각 업종 페이지는 업종명(ko) 파생 토큰과
 * 카테고리 아키타입 변형(6×6)으로 본문 지문을 분산시키고, index-quality 게이트로
 * 80점 미만은 noindex,follow(사이트맵 제외) 처리한다. (lib/index-quality.ts 참고)
 */
import { SITE } from './seo';
import { decideFromContent, fingerprint, type IndexDecision } from './index-quality';

export type WebsiteCategory =
  | 'medical' | 'care' | 'funeral' | 'education' | 'fitness' | 'beauty'
  | 'fashion' | 'food' | 'lodging' | 'retail' | 'manufacturing' | 'construction'
  | 'realestate' | 'professional' | 'automotive' | 'event' | 'living' | 'it' | 'general';

export interface WebsiteIndustryDef {
  slug: string;
  ko: string;
  category: WebsiteCategory;
}

export interface CategoryArchetype {
  label: string;
  goal: string;
  pages: string[];
  convert: string;
  search: string[];
  why: string;
}

export interface WebsiteContent {
  intro: string;
  features: string[];
  searchLine: string;
  scenario: string;
  priceLine: string;
  faqs: { q: string; a: string }[];
}

// ── 업종 데이터 (파워링크 키워드 294종) ──
export const WEBSITE_INDUSTRIES: WebsiteIndustryDef[] = [
  { slug: 'byeongwon', ko: '병원', category: 'medical' },
  { slug: 'chigwa', ko: '치과', category: 'medical' },
  { slug: 'hanuiwon', ko: '한의원', category: 'medical' },
  { slug: 'pibugwa', ko: '피부과', category: 'medical' },
  { slug: 'angwa', ko: '안과', category: 'medical' },
  { slug: 'ibiinhugwa', ko: '이비인후과', category: 'medical' },
  { slug: 'jeonghyeongoegwa', ko: '정형외과', category: 'medical' },
  { slug: 'naegwa', ko: '내과', category: 'medical' },
  { slug: 'soagwa', ko: '소아과', category: 'medical' },
  { slug: 'sanbuingwa', ko: '산부인과', category: 'medical' },
  { slug: 'binyogigwa', ko: '비뇨기과', category: 'medical' },
  { slug: 'jeongsingeonganguihaggwa', ko: '정신건강의학과', category: 'medical' },
  { slug: 'jaehwaluihaggwa', ko: '재활의학과', category: 'medical' },
  { slug: 'singyeongoegwa', ko: '신경외과', category: 'medical' },
  { slug: 'seonghyeongoegwa', ko: '성형외과', category: 'medical' },
  { slug: 'tongjeunguihaggwa', ko: '통증의학과', category: 'medical' },
  { slug: 'dongmulbyeongwon', ko: '동물병원', category: 'medical' },
  { slug: 'yaggug', ko: '약국', category: 'medical' },
  { slug: 'geonganggeomjinsenteo', ko: '건강검진센터', category: 'medical' },
  { slug: 'yoyangbyeongwon', ko: '요양병원', category: 'medical' },
  { slug: 'hagwon', ko: '학원', category: 'education' },
  { slug: 'eorinijib', ko: '어린이집', category: 'education' },
  { slug: 'yuchiwon', ko: '유치원', category: 'education' },
  { slug: 'yeongeohagwon', ko: '영어학원', category: 'education' },
  { slug: 'suhaghagwon', ko: '수학학원', category: 'education' },
  { slug: 'ibsihagwon', ko: '입시학원', category: 'education' },
  { slug: 'misulhagwon', ko: '미술학원', category: 'education' },
  { slug: 'eumaghagwon', ko: '음악학원', category: 'education' },
  { slug: 'pianohagwon', ko: '피아노학원', category: 'education' },
  { slug: 'taegwondojang', ko: '태권도장', category: 'education' },
  { slug: 'kodinghagwon', ko: '코딩학원', category: 'education' },
  { slug: 'yorihagwon', ko: '요리학원', category: 'education' },
  { slug: 'unjeonhagwon', ko: '운전학원', category: 'education' },
  { slug: 'dogseosil', ko: '독서실', category: 'education' },
  { slug: 'seuteodikape', ko: '스터디카페', category: 'education' },
  { slug: 'jigeobjeonmunhaggyo', ko: '직업전문학교', category: 'education' },
  { slug: 'yuhagwon', ko: '유학원', category: 'education' },
  { slug: 'gwaoe', ko: '과외', category: 'education' },
  { slug: 'bangmunhagseub', ko: '방문학습', category: 'education' },
  { slug: 'yoyangwon', ko: '요양원', category: 'care' },
  { slug: 'juganbohosenteo', ko: '주간보호센터', category: 'care' },
  { slug: 'bangmunyoyangsenteo', ko: '방문요양센터', category: 'care' },
  { slug: 'jaegabogjisenteo', ko: '재가복지센터', category: 'care' },
  { slug: 'noinbogjigwan', ko: '노인복지관', category: 'care' },
  { slug: 'jangaeinbogjigwan', ko: '장애인복지관', category: 'care' },
  { slug: 'sahoebogjigwan', ko: '사회복지관', category: 'care' },
  { slug: 'silbeotaun', ko: '실버타운', category: 'care' },
  { slug: 'sanhujoriwon', ko: '산후조리원', category: 'care' },
  { slug: 'sanhudoumi', ko: '산후도우미', category: 'care' },
  { slug: 'beibisiteo', ko: '베이비시터', category: 'care' },
  { slug: 'ganbyeongin', ko: '간병인', category: 'care' },
  { slug: 'simrisangdamsenteo', ko: '심리상담센터', category: 'care' },
  { slug: 'eoneochiryosenteo', ko: '언어치료센터', category: 'care' },
  { slug: 'baldalsenteo', ko: '발달센터', category: 'care' },
  { slug: 'adongsangdamsenteo', ko: '아동상담센터', category: 'care' },
  { slug: 'cheongsonyeonsangdamsenteo', ko: '청소년상담센터', category: 'care' },
  { slug: 'gajeongsangdamso', ko: '가정상담소', category: 'care' },
  { slug: 'jangryesigjang', ko: '장례식장', category: 'funeral' },
  { slug: 'sangjohoesa', ko: '상조회사', category: 'funeral' },
  { slug: 'helseujang', ko: '헬스장', category: 'fitness' },
  { slug: 'pt-shop', ko: 'PT샵', category: 'fitness' },
  { slug: 'pilrateseu', ko: '필라테스', category: 'fitness' },
  { slug: 'yogawon', ko: '요가원', category: 'fitness' },
  { slug: 'keuroseupis', ko: '크로스핏', category: 'fitness' },
  { slug: 'golpeuyeonseubjang', ko: '골프연습장', category: 'fitness' },
  { slug: 'seukeuringolpeu', ko: '스크린골프', category: 'fitness' },
  { slug: 'suyeongjang', ko: '수영장', category: 'fitness' },
  { slug: 'teniseujang', ko: '테니스장', category: 'fitness' },
  { slug: 'baedeuminteonjang', ko: '배드민턴장', category: 'fitness' },
  { slug: 'bolringjang', ko: '볼링장', category: 'fitness' },
  { slug: 'danggujang', ko: '당구장', category: 'fitness' },
  { slug: 'keulraimingjim', ko: '클라이밍짐', category: 'fitness' },
  { slug: 'bogsingjang', ko: '복싱장', category: 'fitness' },
  { slug: 'jujissudojang', ko: '주짓수도장', category: 'education' },
  { slug: 'seungmajang', ko: '승마장', category: 'fitness' },
  { slug: 'kaempingjang', ko: '캠핑장', category: 'fitness' },
  { slug: 'nakksiteo', ko: '낚시터', category: 'fitness' },
  { slug: 'rejeoseupocheu', ko: '레저스포츠', category: 'fitness' },
  { slug: 'miyongsil', ko: '미용실', category: 'beauty' },
  { slug: 'neilsyab', ko: '네일샵', category: 'beauty' },
  { slug: 'pibugwanrisyab', ko: '피부관리샵', category: 'beauty' },
  { slug: 'eseutetig', ko: '에스테틱', category: 'beauty' },
  { slug: 'wagsingsyab', ko: '왁싱샵', category: 'beauty' },
  { slug: 'sognunsseobsyab', ko: '속눈썹샵', category: 'beauty' },
  { slug: 'meikeueobsyab', ko: '메이크업샵', category: 'beauty' },
  { slug: 'dupigwanrisenteo', ko: '두피관리센터', category: 'beauty' },
  { slug: 'masajisyab', ko: '마사지샵', category: 'beauty' },
  { slug: 'seupa', ko: '스파', category: 'beauty' },
  { slug: 'banyeonggusyab', ko: '반영구샵', category: 'beauty' },
  { slug: 'peoseuneolkeolreo', ko: '퍼스널컬러', category: 'beauty' },
  { slug: 'majchumjeongjang', ko: '맞춤정장', category: 'fashion' },
  { slug: 'hanbogjib', ko: '한복집', category: 'fashion' },
  { slug: 'wedingdeureseusyab', ko: '웨딩드레스샵', category: 'fashion' },
  { slug: 'uiryumaejang', ko: '의류매장', category: 'fashion' },
  { slug: 'sinbalmaejang', ko: '신발매장', category: 'fashion' },
  { slug: 'gabangmaejang', ko: '가방매장', category: 'fashion' },
  { slug: 'jueolrisyab', ko: '주얼리샵', category: 'fashion' },
  { slug: 'angyeongjeom', ko: '안경점', category: 'fashion' },
  { slug: 'kape', ko: '카페', category: 'food' },
  { slug: 'sigdang', ko: '식당', category: 'food' },
  { slug: 'hansigdang', ko: '한식당', category: 'food' },
  { slug: 'jungsigdang', ko: '중식당', category: 'food' },
  { slug: 'ilsigdang', ko: '일식당', category: 'food' },
  { slug: 'yangsigdang', ko: '양식당', category: 'food' },
  { slug: 'gogisjib', ko: '고깃집', category: 'food' },
  { slug: 'hoesjib', ko: '횟집', category: 'food' },
  { slug: 'bunsigjib', ko: '분식집', category: 'food' },
  { slug: 'chikinjib', ko: '치킨집', category: 'food' },
  { slug: 'pijajib', ko: '피자집', category: 'food' },
  { slug: 'beikeori', ko: '베이커리', category: 'food' },
  { slug: 'tteogjib', ko: '떡집', category: 'food' },
  { slug: 'dosirageobche', ko: '도시락업체', category: 'food' },
  { slug: 'banchangage', ko: '반찬가게', category: 'food' },
  { slug: 'keiteoring', ko: '케이터링', category: 'food' },
  { slug: 'pudeuteureog', ko: '푸드트럭', category: 'food' },
  { slug: 'geongangsigpum', ko: '건강식품', category: 'food' },
  { slug: 'sigpumjejoeob', ko: '식품제조업', category: 'food' },
  { slug: 'nongsanmulpanmae', ko: '농산물판매', category: 'food' },
  { slug: 'pensyeon', ko: '펜션', category: 'lodging' },
  { slug: 'hotel', ko: '호텔', category: 'lodging' },
  { slug: 'motel', ko: '모텔', category: 'lodging' },
  { slug: 'rijoteu', ko: '리조트', category: 'lodging' },
  { slug: 'geseuteuhauseu', ko: '게스트하우스', category: 'lodging' },
  { slug: 'pulbilra', ko: '풀빌라', category: 'lodging' },
  { slug: 'hanogseutei', ko: '한옥스테이', category: 'lodging' },
  { slug: 'kaempingpensyeon', ko: '캠핑펜션', category: 'lodging' },
  { slug: 'geulraempingjang', ko: '글램핑장', category: 'lodging' },
  { slug: 'minbag', ko: '민박', category: 'lodging' },
  { slug: 'yeohaengsa', ko: '여행사', category: 'lodging' },
  { slug: 'gwangwangbeoseu', ko: '관광버스', category: 'lodging' },
  { slug: 'renteoka', ko: '렌터카', category: 'lodging' },
  { slug: 'gonghangpigeob', ko: '공항픽업', category: 'lodging' },
  { slug: 'yuramseon', ko: '유람선', category: 'lodging' },
  { slug: 'gwangwangnongwon', ko: '관광농원', category: 'lodging' },
  { slug: 'cheheommaeul', ko: '체험마을', category: 'lodging' },
  { slug: 'woteopakeu', ko: '워터파크', category: 'lodging' },
  { slug: 'temapakeu', ko: '테마파크', category: 'lodging' },
  { slug: 'hyuyangrim', ko: '휴양림', category: 'lodging' },
  { slug: 'syopingmol', ko: '쇼핑몰', category: 'retail' },
  { slug: 'onrainsyopingmol', ko: '온라인쇼핑몰', category: 'retail' },
  { slug: 'jonghabyutongeob', ko: '종합유통업', category: 'retail' },
  { slug: 'domaeeob', ko: '도매업', category: 'retail' },
  { slug: 'somaeeob', ko: '소매업', category: 'retail' },
  { slug: 'pyeonuijeom', ko: '편의점', category: 'retail' },
  { slug: 'mateu', ko: '마트', category: 'retail' },
  { slug: 'jeontongsijang', ko: '전통시장', category: 'retail' },
  { slug: 'gagujeom', ko: '가구점', category: 'retail' },
  { slug: 'interieosopumsyab', ko: '인테리어소품샵', category: 'retail' },
  { slug: 'kkochjib', ko: '꽃집', category: 'retail' },
  { slug: 'seojeom', ko: '서점', category: 'retail' },
  { slug: 'wangujeom', ko: '완구점', category: 'retail' },
  { slug: 'aggijeom', ko: '악기점', category: 'retail' },
  { slug: 'jeonjajepummaejang', ko: '전자제품매장', category: 'retail' },
  { slug: 'hyudaeponmaejang', ko: '휴대폰매장', category: 'retail' },
  { slug: 'junggomaejang', ko: '중고매장', category: 'retail' },
  { slug: 'suibpanmaeeob', ko: '수입판매업', category: 'retail' },
  { slug: 'panchogmuleobche', ko: '판촉물업체', category: 'retail' },
  { slug: 'gieob', ko: '기업', category: 'general' },
  { slug: 'jejoeob', ko: '제조업', category: 'manufacturing' },
  { slug: 'gongjang', ko: '공장', category: 'manufacturing' },
  { slug: 'gigyejejoeob', ko: '기계제조업', category: 'manufacturing' },
  { slug: 'jeonjabupumjejoeob', ko: '전자부품제조업', category: 'manufacturing' },
  { slug: 'jadongchabupumjejoeob', ko: '자동차부품제조업', category: 'manufacturing' },
  { slug: 'geumsoggagongeob', ko: '금속가공업', category: 'manufacturing' },
  { slug: 'peulraseutigjejoeob', ko: '플라스틱제조업', category: 'manufacturing' },
  { slug: 'pojangjaejejoeob', ko: '포장재제조업', category: 'manufacturing' },
  { slug: 'hwajangpumjejoeob', ko: '화장품제조업', category: 'manufacturing' },
  { slug: 'sigpumgagongeob', ko: '식품가공업', category: 'manufacturing' },
  { slug: 'uiryogigijejoeob', ko: '의료기기제조업', category: 'manufacturing' },
  { slug: 'saneobjangbieobche', ko: '산업장비업체', category: 'manufacturing' },
  { slug: 'geumhyeongeobche', ko: '금형업체', category: 'manufacturing' },
  { slug: 'yongjeobeobche', ko: '용접업체', category: 'manufacturing' },
  { slug: 'seomyujejoeob', ko: '섬유제조업', category: 'manufacturing' },
  { slug: 'inswaeeobche', ko: '인쇄업체', category: 'manufacturing' },
  { slug: 'mulryuhoesa', ko: '물류회사', category: 'manufacturing' },
  { slug: 'muyeoghoesa', ko: '무역회사', category: 'manufacturing' },
  { slug: 'seutateueob', ko: '스타트업', category: 'manufacturing' },
  { slug: 'geonseolhoesa', ko: '건설회사', category: 'construction' },
  { slug: 'jonghabgeonseoleob', ko: '종합건설업', category: 'construction' },
  { slug: 'jeonmungeonseoleob', ko: '전문건설업', category: 'construction' },
  { slug: 'interieoeobche', ko: '인테리어업체', category: 'construction' },
  { slug: 'rimodelringeobche', ko: '리모델링업체', category: 'construction' },
  { slug: 'geonchugsasamuso', ko: '건축사사무소', category: 'construction' },
  { slug: 'tomoghoesa', ko: '토목회사', category: 'construction' },
  { slug: 'jeongigongsaeobche', ko: '전기공사업체', category: 'construction' },
  { slug: 'seolbieobche', ko: '설비업체', category: 'construction' },
  { slug: 'bangsueobche', ko: '방수업체', category: 'construction' },
  { slug: 'dobaeeobche', ko: '도배업체', category: 'construction' },
  { slug: 'taileobche', ko: '타일업체', category: 'construction' },
  { slug: 'changhoeobche', ko: '창호업체', category: 'construction' },
  { slug: 'jogyeongeobche', ko: '조경업체', category: 'construction' },
  { slug: 'cheolgeoeobche', ko: '철거업체', category: 'construction' },
  { slug: 'budongsan', ko: '부동산', category: 'realestate' },
  { slug: 'gonginjunggaesa', ko: '공인중개사', category: 'realestate' },
  { slug: 'bunyangdaehaengsa', ko: '분양대행사', category: 'realestate' },
  { slug: 'isaeobche', ko: '이사업체', category: 'realestate' },
  { slug: 'ibjucheongsoeobche', ko: '입주청소업체', category: 'realestate' },
  { slug: 'beobmubeobin', ko: '법무법인', category: 'professional' },
  { slug: 'semusa', ko: '세무사', category: 'professional' },
  { slug: 'hoegyesa', ko: '회계사', category: 'professional' },
  { slug: 'beobryulsamuso', ko: '법률사무소', category: 'professional' },
  { slug: 'byeonhosa', ko: '변호사', category: 'professional' },
  { slug: 'beobmusa', ko: '법무사', category: 'professional' },
  { slug: 'nomusa', ko: '노무사', category: 'professional' },
  { slug: 'byeonrisa', ko: '변리사', category: 'professional' },
  { slug: 'haengjeongsa', ko: '행정사', category: 'professional' },
  { slug: 'gwansesa', ko: '관세사', category: 'professional' },
  { slug: 'gamjeongpyeonggasa', ko: '감정평가사', category: 'professional' },
  { slug: 'gyeongyeongkeonseolting', ko: '경영컨설팅', category: 'professional' },
  { slug: 'changeobkeonseolting', ko: '창업컨설팅', category: 'professional' },
  { slug: 'budongsankeonseolting', ko: '부동산컨설팅', category: 'realestate' },
  { slug: 'yutongkeonseolting', ko: '유통컨설팅', category: 'retail' },
  { slug: 'boheomdaerijeom', ko: '보험대리점', category: 'professional' },
  { slug: 'sonhaesajeongsa', ko: '손해사정사', category: 'professional' },
  { slug: 'sinyongjeongbohoesa', ko: '신용정보회사', category: 'professional' },
  { slug: 'chaegwonchusimeobche', ko: '채권추심업체', category: 'professional' },
  { slug: 'beonyeogsamuso', ko: '번역사무소', category: 'professional' },
  { slug: 'jadongcha-jeongbiso', ko: '자동차 정비소', category: 'automotive' },
  { slug: 'jadongchagongeobsa', ko: '자동차공업사', category: 'automotive' },
  { slug: 'kasenteo', ko: '카센터', category: 'automotive' },
  { slug: 'taieomaejang', ko: '타이어매장', category: 'automotive' },
  { slug: 'sechajang', ko: '세차장', category: 'automotive' },
  { slug: 'sonsechajang', ko: '손세차장', category: 'automotive' },
  { slug: 'jadongchagwangtaegeobche', ko: '자동차광택업체', category: 'automotive' },
  { slug: 'jadongchatyuningsyab', ko: '자동차튜닝샵', category: 'automotive' },
  { slug: 'beulraegbagseumaejang', ko: '블랙박스매장', category: 'automotive' },
  { slug: 'jadongchayurieobche', ko: '자동차유리업체', category: 'automotive' },
  { slug: 'junggochamaemaeeobche', ko: '중고차매매업체', category: 'automotive' },
  { slug: 'sinchadilreo', ko: '신차딜러', category: 'automotive' },
  { slug: 'otobaimaejang', ko: '오토바이매장', category: 'automotive' },
  { slug: 'jajeongeomaejang', ko: '자전거매장', category: 'automotive' },
  { slug: 'hwamulunsongeobche', ko: '화물운송업체', category: 'automotive' },
  { slug: 'taegbaeeobche', ko: '택배업체', category: 'automotive' },
  { slug: 'kwigseobiseu', ko: '퀵서비스', category: 'automotive' },
  { slug: 'yongdaleobche', ko: '용달업체', category: 'automotive' },
  { slug: 'beoseuhoesa', ko: '버스회사', category: 'automotive' },
  { slug: 'juchajang', ko: '주차장', category: 'automotive' },
  { slug: 'wedinghol', ko: '웨딩홀', category: 'event' },
  { slug: 'wedingpeulraeneo', ko: '웨딩플래너', category: 'event' },
  { slug: 'wedingseutyudio', ko: '웨딩스튜디오', category: 'event' },
  { slug: 'seutyudio', ko: '스튜디오', category: 'event' },
  { slug: 'sajingwan', ko: '사진관', category: 'event' },
  { slug: 'doljanchieobche', ko: '돌잔치업체', category: 'event' },
  { slug: 'chuljangbwipe', ko: '출장뷔페', category: 'event' },
  { slug: 'patirum', ko: '파티룸', category: 'event' },
  { slug: 'ibenteueobche', ko: '이벤트업체', category: 'event' },
  { slug: 'haengsadaehaengsa', ko: '행사대행사', category: 'event' },
  { slug: 'jeonsigihoegsa', ko: '전시기획사', category: 'event' },
  { slug: 'gongyeongihoegsa', ko: '공연기획사', category: 'event' },
  { slug: 'eumhyangeobche', ko: '음향업체', category: 'event' },
  { slug: 'jomyeongeobche', ko: '조명업체', category: 'event' },
  { slug: 'yeongsangjejageobche', ko: '영상제작업체', category: 'event' },
  { slug: 'deuronchwalyeongeobche', ko: '드론촬영업체', category: 'event' },
  { slug: 'potobuseueobche', ko: '포토부스업체', category: 'event' },
  { slug: 'peulrawosyab', ko: '플라워샵', category: 'event' },
  { slug: 'dabryepumeobche', ko: '답례품업체', category: 'event' },
  { slug: 'cheongcheobjangeobche', ko: '청첩장업체', category: 'event' },
  { slug: 'cheongsoeobche', ko: '청소업체', category: 'living' },
  { slug: 'bangyeogeobche', ko: '방역업체', category: 'living' },
  { slug: 'sodogeobche', ko: '소독업체', category: 'living' },
  { slug: 'setagso', ko: '세탁소', category: 'living' },
  { slug: 'koinsetagso', ko: '코인세탁소', category: 'living' },
  { slug: 'yeolsoeeobche', ko: '열쇠업체', category: 'living' },
  { slug: 'doeorageobche', ko: '도어락업체', category: 'living' },
  { slug: 'boilreoeobche', ko: '보일러업체', category: 'living' },
  { slug: 'eeokeoneobche', ko: '에어컨업체', category: 'living' },
  { slug: 'nusutamjieobche', ko: '누수탐지업체', category: 'living' },
  { slug: 'hasugueobche', ko: '하수구업체', category: 'living' },
  { slug: 'jeongsugieobche', ko: '정수기업체', category: 'living' },
  { slug: 'bideeobche', ko: '비데업체', category: 'living' },
  { slug: 'rentaleobche', ko: '렌탈업체', category: 'living' },
  { slug: 'pyegimulcheorieobche', ko: '폐기물처리업체', category: 'living' },
  { slug: 'boaneobche', ko: '보안업체', category: 'living' },
  { slug: 'gyeongbieobche', ko: '경비업체', category: 'living' },
  { slug: 'it-company', ko: 'IT기업', category: 'it' },
  { slug: 'sopeuteuweeogaebalsa', ko: '소프트웨어개발사', category: 'it' },
  { slug: 'aebgaebaleobche', ko: '앱개발업체', category: 'it' },
  { slug: 'webeijeonsi', ko: '웹에이전시', category: 'event' },
  { slug: 'gwanggodaehaengsa', ko: '광고대행사', category: 'event' },
  { slug: 'maketingdaehaengsa', ko: '마케팅대행사', category: 'event' },
  { slug: 'dijainhoesa', ko: '디자인회사', category: 'it' },
  { slug: 'beuraendinghoesa', ko: '브랜딩회사', category: 'it' },
  { slug: 'chulpansa', ko: '출판사', category: 'it' },
  { slug: 'inswaeso', ko: '인쇄소', category: 'it' },
  { slug: 'eonronsa', ko: '언론사', category: 'it' },
  { slug: 'yutyubeujejagsa', ko: '유튜브제작사', category: 'it' },
  { slug: 'mcn-agency', ko: 'MCN회사', category: 'it' },
  { slug: 'geimhoesa', ko: '게임회사', category: 'it' },
  { slug: 'solrusyeoneobche', ko: '솔루션업체', category: 'it' },
  { slug: 'hoseutingeobche', ko: '호스팅업체', category: 'it' },
  { slug: 'deiteoboggueobche', ko: '데이터복구업체', category: 'it' },
  { slug: 'keompyuteosurieobche', ko: '컴퓨터수리업체', category: 'it' },
  { slug: 'teugheosamuso', ko: '특허사무소', category: 'it' },
  { slug: 'yeonguso', ko: '연구소', category: 'it' },
];

// ── 카테고리 아키타입 ──
export const WEBSITE_ARCHETYPES: Record<WebsiteCategory, CategoryArchetype> = {
  medical: { label: '병원·의원', goal: '환자가 진료과목·의료진·진료시간을 확인하고 예약·문의까지 한 번에 하도록', pages: ['병원 소개·의료진', '진료과목·진료 안내', '진료시간·오시는 길', '예약·상담 문의', '건강정보·공지', '비급여 안내'], convert: '전화 예약·온라인 예약·오시는 길 확인', search: ['지역명+진료과', '증상+병원', '야간진료', '일요일진료'], why: '환자는 방문 전 진료시간과 위치, 의료진을 검색으로 먼저 확인합니다' },
  care: { label: '요양·복지·상담', goal: '보호자가 시설·프로그램·비용을 확인하고 상담을 신청하도록', pages: ['시설 소개·시설 안내', '프로그램·케어 안내', '이용 요금·입소 절차', '상담·입소 문의', '오시는 길', '공지·소식'], convert: '상담 전화·방문 상담 예약', search: ['지역명+요양/복지', '등급/이용 문의', '비용 상담'], why: '보호자는 신뢰할 시설을 찾아 프로그램과 비용을 꼼꼼히 비교합니다' },
  funeral: { label: '장례·상조', goal: '유가족이 절차·비용·빈소를 빠르게 확인하고 즉시 상담하도록', pages: ['시설·빈소 안내', '장례 절차 안내', '비용·패키지', '24시간 상담', '오시는 길', '추모·부고'], convert: '24시간 긴급 상담 전화', search: ['지역명+장례식장', '상조 비용', '장례 절차'], why: '경황 없는 유가족은 절차와 비용을 즉시 확인할 수 있어야 합니다' },
  education: { label: '학원·교육', goal: '학부모·학생이 커리큘럼·시간표·수강료를 확인하고 상담·등록하도록', pages: ['학원 소개·강사진', '커리큘럼·수업 안내', '시간표·반 편성', '수강료·상담 신청', '합격·후기', '오시는 길'], convert: '상담 신청·레벨테스트 예약', search: ['지역명+과목 학원', '입시/내신', '수강료 문의'], why: '학부모는 커리큘럼과 강사, 실적을 비교해 학원을 고릅니다' },
  fitness: { label: '스포츠·피트니스', goal: '회원이 시설·프로그램·이용권을 확인하고 등록·체험을 신청하도록', pages: ['시설 소개·둘러보기', '프로그램·수업 안내', '이용권·요금', '체험·등록 문의', '트레이너·강사', '오시는 길'], convert: '체험·등록 상담 신청', search: ['지역명+운동', '1일 체험', '회원권 가격'], why: '회원은 시설 사진과 이용권, 위치를 보고 등록을 결정합니다' },
  beauty: { label: '뷰티·미용', goal: '고객이 시술 메뉴·가격·후기를 확인하고 예약하도록', pages: ['샵 소개·둘러보기', '시술 메뉴·가격표', '시술 전후·후기', '예약·상담', '디자이너·원장', '오시는 길'], convert: '온라인 예약·전화 예약', search: ['지역명+미용/시술', '가격/메뉴', '예약'], why: '고객은 시술 사진과 가격, 후기를 보고 예약할 곳을 정합니다' },
  fashion: { label: '패션·잡화', goal: '고객이 제품·컬렉션·매장 정보를 확인하고 방문·구매·상담하도록', pages: ['브랜드·매장 소개', '제품·컬렉션', '룩북·착용컷', '매장 위치·영업시간', '예약·문의', '이벤트'], convert: '매장 방문 예약·구매 문의', search: ['지역명+매장', '브랜드/제품', '맞춤 상담'], why: '고객은 제품 이미지와 매장 위치를 확인하고 방문합니다' },
  food: { label: '요식·식음료', goal: '손님이 메뉴·가격·위치를 확인하고 예약·주문·방문하도록', pages: ['매장 소개·분위기', '메뉴·가격', '예약·단체 문의', '오시는 길·주차', '원산지·영업시간', '이벤트·소식'], convert: '예약 전화·주문·오시는 길', search: ['지역명+맛집/메뉴', '예약', '포장/배달'], why: '손님은 메뉴 사진과 위치, 영업시간을 검색으로 먼저 확인합니다' },
  lodging: { label: '숙박·여행', goal: '여행객이 객실·요금·예약 가능일을 확인하고 예약하도록', pages: ['숙소 소개·객실', '객실 요금·예약', '부대시설·주변 관광', '예약·문의', '이용 안내', '오시는 길'], convert: '실시간 예약·전화 예약', search: ['지역명+숙박', '객실 요금', '예약 가능일'], why: '여행객은 객실 사진과 요금, 예약 가능 여부를 보고 결정합니다' },
  retail: { label: '유통·판매', goal: '고객이 상품·가격·매장을 확인하고 구매·문의하도록', pages: ['매장·브랜드 소개', '상품·카테고리', '가격·구매 안내', '매장 위치·영업시간', '문의·상담', '이벤트·공지'], convert: '구매 문의·매장 방문', search: ['지역명+매장/상품', '가격', '구매처'], why: '고객은 취급 상품과 가격, 매장 위치를 확인하고 방문합니다' },
  manufacturing: { label: '제조·산업', goal: '거래처가 제품·설비·인증·생산능력을 확인하고 견적을 문의하도록', pages: ['회사 소개·연혁', '제품·생산 품목', '설비·생산능력', '인증·품질', '견적·거래 문의', '오시는 길'], convert: '견적·거래 문의', search: ['제품명+제조/업체', 'OEM/ODM', '견적'], why: '거래처는 생산 품목과 설비, 인증을 보고 거래처를 검토합니다' },
  construction: { label: '건설·인테리어', goal: '고객이 시공 사례·공정·견적을 확인하고 상담을 신청하도록', pages: ['회사 소개·이력', '시공 사례·포트폴리오', '공정·시공 안내', '견적·상담 문의', '자재·보증', '오시는 길'], convert: '현장 방문·견적 상담', search: ['지역명+시공/인테리어', '시공 사례', '견적'], why: '고객은 시공 사례와 견적, 후기를 비교해 업체를 고릅니다' },
  realestate: { label: '부동산', goal: '고객이 매물·지역 정보를 확인하고 상담을 신청하도록', pages: ['사무소 소개', '매물·물건 정보', '지역·시세 안내', '상담·문의', '거래 절차', '오시는 길'], convert: '매물 상담·방문 예약', search: ['지역명+부동산/매물', '시세', '급매'], why: '고객은 매물과 지역 시세를 확인하고 중개사를 찾습니다' },
  professional: { label: '법률·전문·컨설팅', goal: '의뢰인이 업무 분야·상담 절차·비용을 확인하고 상담을 예약하도록', pages: ['대표·전문가 소개', '업무 분야·서비스', '상담 절차·비용', '상담 예약·문의', '성공 사례·칼럼', '오시는 길'], convert: '상담 예약·전화 문의', search: ['분야+전문가/사무소', '상담 비용', '성공 사례'], why: '의뢰인은 전문 분야와 사례, 상담 절차를 보고 신뢰를 판단합니다' },
  automotive: { label: '자동차·운송', goal: '고객이 서비스·요금·위치를 확인하고 예약·문의하도록', pages: ['업체 소개·시설', '서비스·정비 항목', '요금·견적', '예약·문의', '오시는 길', '후기·공지'], convert: '예약·견적 문의', search: ['지역명+정비/서비스', '요금', '예약'], why: '고객은 서비스 항목과 요금, 위치를 확인하고 예약합니다' },
  event: { label: '웨딩·행사·촬영', goal: '고객이 상품·포트폴리오·견적을 확인하고 상담을 예약하도록', pages: ['업체·스튜디오 소개', '포트폴리오·갤러리', '상품·패키지', '예약·상담 문의', '진행 절차', '오시는 길'], convert: '상담 예약·견적 문의', search: ['지역명+웨딩/촬영/행사', '포트폴리오', '견적'], why: '고객은 포트폴리오와 패키지, 후기를 보고 업체를 예약합니다' },
  living: { label: '생활서비스', goal: '고객이 서비스·요금·이용 방법을 확인하고 즉시 문의·예약하도록', pages: ['업체 소개', '서비스·작업 안내', '요금·견적', '예약·문의', '작업 사례', '오시는 길'], convert: '출장·방문 견적 문의', search: ['지역명+서비스', '요금', '출장/방문'], why: '고객은 서비스 범위와 요금, 출장 여부를 보고 업체를 부릅니다' },
  it: { label: 'IT·콘텐츠·전문서비스', goal: '잠재 고객이 서비스·포트폴리오·역량을 확인하고 프로젝트를 문의하도록', pages: ['회사 소개·팀', '서비스·솔루션', '포트폴리오·사례', '기술·역량', '프로젝트 문의', '채용·소식'], convert: '프로젝트 상담·견적 문의', search: ['서비스+업체/에이전시', '포트폴리오', '견적'], why: '고객은 포트폴리오와 기술 역량, 사례를 보고 파트너를 고릅니다' },
  general: { label: '기업·기관', goal: '방문자가 회사 정보·사업·연락처를 확인하고 문의하도록', pages: ['회사 소개·연혁', '사업·서비스 안내', '실적·사례', '인재·채용', '문의·오시는 길', '공지·뉴스'], convert: '사업 문의·제휴 상담', search: ['회사명+소개', '사업 분야', '문의'], why: '거래처와 지원자는 회사 소개와 실적을 검색으로 확인합니다' },
};

const CAT = WEBSITE_ARCHETYPES;

function normActor(s: string): string {
  // goal 문장의 주어(행위자)를 "고객"으로 정규화 — josa(주격조사)까지 함께 치환해
  // "고객가"(X) 같은 조사 오류를 막는다. ("고객"은 받침 ㄱ → 주격조사 "이")
  return s
    .replace(/환자가/g, '고객이').replace(/회원이/g, '고객이').replace(/손님이/g, '고객이')
    .replace(/여행객이/g, '고객이').replace(/의뢰인이/g, '고객이').replace(/보호자가/g, '고객이')
    .replace(/유가족이/g, '고객이').replace(/거래처가/g, '고객이').replace(/방문자가/g, '고객이')
    .replace(/학부모·학생이/g, '고객이').replace(/잠재 고객이/g, '고객이');
}

// 카테고리 내 순번 — 변형(6×6) 조합을 서로 다르게 배정해 본문 지문을 분산
const SEQ: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  const c: Record<string, number> = {};
  for (const d of WEBSITE_INDUSTRIES) {
    c[d.category] = (c[d.category] ?? 0) + 1;
    m[d.slug] = c[d.category] - 1;
  }
  return m;
})();

const NO_KO_PREFIX = ['오시는 길', '예약', '문의', '상담', '견적', '후기', '공지', '이벤트', '소식', '포트폴리오', '갤러리', '룩북', '추모', '부고', '채용', '뉴스'];

// 한국어 조사(josa) 자동 선택 — 업종명(ko)의 마지막 글자 받침 유무로 은/는·을/를·이/가를 고른다.
// (한글 음절 유니코드: (code-0xAC00)%28 !== 0 이면 받침 있음)
function hasBatchim(word: string): boolean {
  const c = word.charCodeAt(word.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return false;
  return (c - 0xac00) % 28 !== 0;
}
/** 주제 조사: 은/는 */
function koN(w: string): string {
  return w + (hasBatchim(w) ? '은' : '는');
}
/** 목적격 조사: 을/를 */
function koL(w: string): string {
  return w + (hasBatchim(w) ? '을' : '를');
}
/** 주격 조사: 이/가 */
function koG(w: string): string {
  return w + (hasBatchim(w) ? '이' : '가');
}

export function buildWebsiteContent(d: WebsiteIndustryDef): WebsiteContent {
  const ko = d.ko;
  const a = CAT[d.category];
  const seq = SEQ[d.slug] ?? 0;
  const goal = normActor(a.goal);
  const why = a.why;
  const conv = a.convert;
  const kc = `${ko}홈페이지`;
  const kp = `${ko}제작`;
  const kb = `${ko}업체`;
  const ks = `${ko}마케팅`;
  const kn = `${ko}창업`;

  const IV = [
    `${kc} 제작은 ${goal} 만드는 것이 목적입니다. ${ko} 특성상 ${why}. 름랩은 ${ko} 운영에 바로 쓰이는 페이지부터 만들고 소스코드를 통째로 이관해, 만든 뒤 대표님이 직접 ${ko} 소식과 가격을 고치도록 합니다. '${kp}'를 고민하는 사장님께 월 관리비 없는 정액 제작을 권합니다.`,
    `${ko} 방문자는 검색으로 먼저 ${koL(ko)} 찾습니다. ${why}. 그래서 ${kc}는 ${goal} 구조가 핵심입니다. 름랩은 ${ko}에 꼭 필요한 페이지만 담아 가볍고 빠르게 만들고, 소스코드·도메인을 대표님 명의로 이관합니다. ${kb}를 고를 때 월 사용료·수정비가 쌓이지 않는지 꼭 확인하세요.`,
    `${koN(ko)} 홈페이지가 곧 첫인상입니다. ${why} 그만큼 첫 화면 구성이 중요합니다. 름랩은 ${goal} ${kc}를 정액으로 제작하고, 문구·이미지를 직접 고치도록 1:1 교육까지 제공합니다. ${kn} 단계라면 꼭 필요한 페이지부터 작게 시작해 ${kp} 비용을 합리적으로 맞춥니다.`,
    `'${kp}'를 검색하는 ${ko} 사장님이 가장 먼저 확인할 것은 검색 노출과 총비용입니다. ${why}. 름랩은 ${goal} ${kc}를 만들되, 광고에 의존하지 않도록 ${ko} 키워드 구조를 제작에 넣고 소스코드를 이관합니다.`,
    `${kc}는 단순히 예쁜 사이트가 아니라 ${ko} 고객을 문의로 잇는 도구여야 합니다. ${why}. 름랩은 ${goal} 구조로 ${ko} 홈페이지를 만들고 ${kb} 교체 없이 대표님이 직접 운영하도록 넘겨 드립니다.`,
    `${ko} 신규 고객의 첫 접점은 대부분 모바일 검색입니다. ${why}. 름랩은 ${kc}를 ${goal} 흐름으로 설계하고, ${kp} 이후 ${ko} 소식·가격을 직접 수정하도록 관리 화면과 교육을 제공합니다.`,
  ];
  const SV = [
    `${ko} 손님이 ${conv}까지 한 화면에서 끝내도록 동선을 짜면 전화 문의가 줄고 문의 전환이 늘어납니다. ${kc}가 반복 안내를 대신하므로 대표님은 실제 ${ko} 업무에 집중할 수 있습니다. ${ko}예약·문의가 쌓이면 ${ks}에도 그대로 활용됩니다.`,
    `검색으로 들어온 ${ko} 방문자가 이탈하지 않고 ${conv}로 이어지도록, ${kc}는 모바일에서 빠르게 뜨고 연락처·지도·예약이 손끝에 닿게 배치합니다. 이 동선이 ${ko}의 문의 수를 좌우하고 ${kp}의 성패를 가릅니다.`,
    `${koN(ko)} 신규 고객의 첫 접점이 대부분 모바일 검색입니다. ${kc}를 ${conv} 중심으로 만들면 광고비를 줄이면서 꾸준한 문의를 받고, 재방문 고객에게 ${ko} 정보를 항상 최신으로 전합니다. ${kb} 없이 직접 ${ko}상담 글을 올릴 수 있습니다.`,
    `${ko}상담과 ${ko}예약이 전화로만 몰리면 놓치는 문의가 생깁니다. ${kc}가 24시간 ${conv}를 받아 주면 영업시간 외 문의도 잡을 수 있습니다. 름랩은 ${ko} 동선을 ${conv} 한 흐름으로 묶어 이탈을 줄입니다.`,
    `${kp} 후 실제로 ${ko} 문의가 늘려면 검색 노출과 동선이 함께 맞아야 합니다. ${why} 그래서 ${kc}는 ${conv}를 첫 화면에 두고 ${ko} 후기·사례로 신뢰를 쌓아 방문자를 고객으로 바꿉니다.`,
    `${ko} 사장님이 가장 아쉬워하는 건 '검색에 안 나온다'입니다. ${kc}를 ${ko} 키워드 구조로 만들고 ${conv} 동선을 붙이면, 광고 없이도 ${koL(ko)} 찾는 고객이 자연스럽게 유입됩니다. ${ks}의 기반이 됩니다.`,
  ];

  const intro = IV[seq % IV.length];
  const scenario = SV[(Math.floor(seq / IV.length) + seq) % SV.length];
  const features = a.pages.map((p) =>
    NO_KO_PREFIX.some((x) => p.includes(x)) ? p : `${ko} ${p}`,
  );
  const searchLine = `${ko} 고객이 많이 쓰는 검색어(${a.search.join(', ')})에 맞춰 ${kc}의 제목·본문·구조화 데이터를 정렬해, 광고 없이도 ${koG(ko)} 검색에 잡히도록 만듭니다.`;
  const priceLine = `${kp}는 원페이지 기준 VAT 포함 49만 원부터, 예약·다페이지 구성의 ${kc}는 190만 원·약 14일입니다. 월 관리비는 없고 호스팅·도메인은 대표님 명의로 보유합니다.`;
  const faqs = [
    { q: `${kp} 비용은 얼마인가요?`, a: `${ko} 원페이지는 VAT 포함 49만 원부터, 예약·다페이지 구성의 ${kc}는 190만 원부터입니다. 월 관리비 없이 정액으로 진행하고 상담에서 ${ko} 범위와 견적을 먼저 공개합니다.` },
    { q: `${ko}도 검색에 잘 나오게 만들어 주나요?`, a: `네. ${ko} 고객이 쓰는 검색어에 맞춰 메타·구조화 데이터·사이트맵·모바일 반응형을 제작에 포함합니다. ${why} 그래서 ${ko} 상호·지역·서비스 키워드로 ${kc}가 검색에 잡히도록 구조를 잡습니다.` },
    { q: `만든 뒤 ${ko} 정보를 직접 수정할 수 있나요?`, a: `네. 소스코드를 이관하고 ${ko} 가격·소식·이미지를 대표님이 직접 고치도록 관리 화면과 1:1 교육을 제공합니다. ${kb}에 매번 수정 요청할 필요가 없습니다.` },
  ];

  return { intro, features, searchLine, scenario, priceLine, faqs };
}

const BY_SLUG: Record<string, WebsiteIndustryDef> = Object.fromEntries(
  WEBSITE_INDUSTRIES.map((d) => [d.slug, d]),
);

export function getWebsiteIndustry(slug: string): WebsiteIndustryDef | undefined {
  return BY_SLUG[slug];
}
export function allWebsiteSlugs(): string[] {
  return WEBSITE_INDUSTRIES.map((d) => d.slug);
}
export function websiteCanonical(slug: string): string {
  return `${SITE.domain}/website/${slug}/`;
}
export function websiteTitle(d: WebsiteIndustryDef): string {
  return `${d.ko} 홈페이지 제작 | 비용·페이지 구성·검색 노출 — 름랩`;
}
export function websiteDescription(d: WebsiteIndustryDef): string {
  return `${d.ko} 홈페이지 제작 — ${d.ko} 운영에 필요한 페이지 구성과 비용(49만 원부터), 검색 노출까지. 월 관리비 없이 소스코드 이관·직접 수정. 동탄·수원 거점, 전국 진행.`;
}

// 색인 게이트 — 실제 렌더 본문(intro·features·searchLine·scenario·priceLine·FAQ)에서 측정.
// peer 지문은 다른 업종의 intro+scenario+features+searchLine (같은 카테고리 유사도 대조).
export function websiteDecision(slug: string): IndexDecision | null {
  const d = getWebsiteIndustry(slug);
  if (!d) return null;
  const c = buildWebsiteContent(d);
  const others = WEBSITE_INDUSTRIES.filter((x) => x.slug !== d.slug);
  return decideFromContent({
    title: websiteTitle(d),
    description: websiteDescription(d),
    h1: `${d.ko} 홈페이지 제작`,
    bodyParts: [c.intro, c.features, c.searchLine, c.scenario, c.priceLine, ...c.faqs.map((f) => f.a)],
    faqQuestions: c.faqs.map((f) => f.q),
    // 브레드크럼(홈·홈페이지 제작) 2 + 다른 업종 8 + 함께보기 2 = 12
    internalLinks: 2 + 8 + 2,
    hasUniqueMedia: false,
    peerFingerprints: others.map((x) => {
      const oc = buildWebsiteContent(x);
      return fingerprint(`${oc.intro} ${oc.scenario} ${oc.features.join(' ')} ${oc.searchLine}`);
    }),
  });
}
