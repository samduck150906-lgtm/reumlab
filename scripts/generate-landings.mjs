/**
 * 키워드 조합으로 landings.json(328개) + clusters.json(38개 허브) 생성
 * 패턴: 서비스×의도 96 + 지역×서비스 80 + 업종×서비스 72 + 지역×서비스×의도 80 = 328
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');

const SERVICES = [
  { key: 'app-dev', ko: '앱개발', koFull: '앱 개발', svcType: 'app' },
  { key: 'homepage-dev', ko: '홈페이지제작', koFull: '홈페이지 제작', svcType: 'web' },
  { key: 'web-dev', ko: '웹개발', koFull: '웹 개발', svcType: 'web' },
  { key: 'landing-page', ko: '랜딩페이지제작', koFull: '랜딩페이지 제작', svcType: 'web' },
  { key: 'mvp-dev', ko: 'MVP개발', koFull: 'MVP 개발', svcType: 'app' },
  { key: 'shopping-mall', ko: '쇼핑몰제작', koFull: '쇼핑몰 제작', svcType: 'web' },
  { key: 'app-dev-out', ko: '앱개발외주', koFull: '앱 개발 외주', svcType: 'app' },
  { key: 'website-dev', ko: '웹사이트제작', koFull: '웹사이트 제작', svcType: 'web' },
  { key: 'service-plan', ko: '서비스기획', koFull: '서비스 기획', svcType: 'plan' },
  { key: 'responsive-web', ko: '반응형웹제작', koFull: '반응형 웹 제작', svcType: 'web' },
  { key: 'mobile-app', ko: '모바일앱개발', koFull: '모바일 앱 개발', svcType: 'app' },
  { key: 'web-dev-simple', ko: '웹제작', koFull: '웹 제작', svcType: 'web' },
];

const INTENTS = [
  { key: 'cost', ko: '비용' },
  { key: 'quote', ko: '견적' },
  { key: 'price', ko: '가격' },
  { key: 'production-cost', ko: '제작비' },
  { key: 'dev-cost', ko: '개발비' },
  { key: 'quote-inquiry', ko: '견적문의' },
  { key: 'cost-consult', ko: '비용상담' },
  { key: 'out-source-cost', ko: '외주비' },
];

const REGIONS = [
  { key: 'suwon', ko: '수원' },
  { key: 'gangnam', ko: '강남' },
  { key: 'pangyo', ko: '판교' },
  { key: 'bundang', ko: '분당' },
  { key: 'ilsan', ko: '일산' },
  { key: 'bucheon', ko: '부천' },
  { key: 'anyang', ko: '안양' },
  { key: 'seongnam', ko: '성남' },
  { key: 'yongin', ko: '용인' },
  { key: 'incheon', ko: '인천' },
];

const INDUSTRIES = [
  { key: 'startup', ko: '스타트업', desc: '스타트업 서비스 개발' },
  { key: 'cafe', ko: '카페', desc: '카페 예약·주문 시스템' },
  { key: 'restaurant', ko: '식당', desc: '식당 주문·예약 관리' },
  { key: 'academy', ko: '학원', desc: '학원 수강·관리 시스템' },
  { key: 'hospital', ko: '병원', desc: '병원 예약·진료 관리' },
  { key: 'shopping', ko: '쇼핑몰', desc: '쇼핑몰·이커머스' },
  { key: 'realestate', ko: '부동산', desc: '부동산 매물·계약 관리' },
  { key: 'gym', ko: '헬스장', desc: '헬스장 회원·수업 관리' },
  { key: 'lodging', ko: '숙박', desc: '숙박 예약 관리 시스템' },
];

// 서비스×의도 96개 (12×8)
function buildServiceIntentLandings() {
  const list = [];
  for (const svc of SERVICES) {
    for (const intent of INTENTS) {
      const keyword = `${svc.ko} ${intent.ko}`;
      const slug = `${svc.key}-${intent.key}`;
      list.push({
        slug,
        keyword,
        title: `${keyword} | 름랩 REUMLAB`,
        description: `${keyword} 문의하세요. ${svc.koFull} 견적·상담 - 이터널식스 름랩.`,
        pattern: 'service_intent',
        serviceKey: svc.key,
        intentKey: intent.key,
        hubId: svc.key,
      });
    }
  }
  return list;
}

// 지역×서비스 80개 (10×8, 서비스 8개만)
function buildRegionServiceLandings() {
  const list = [];
  const services = SERVICES.slice(0, 8);
  for (const region of REGIONS) {
    for (const svc of services) {
      const keyword = `${region.ko} ${svc.ko}`;
      const slug = `${region.key}-${svc.key}`;
      list.push({
        slug,
        keyword,
        title: `${keyword} | 름랩 REUMLAB`,
        description: `${region.ko} ${svc.koFull} 견적·외주 - 름랩. 원격 진행 가능.`,
        pattern: 'region_service',
        regionKey: region.key,
        serviceKey: svc.key,
        hubId: region.key,
      });
    }
  }
  return list;
}

// 업종×서비스 72개 (9×8)
function buildIndustryServiceLandings() {
  const list = [];
  const services = SERVICES.slice(0, 8);
  for (const ind of INDUSTRIES) {
    for (const svc of services) {
      const keyword = `${ind.ko} ${svc.ko}`;
      const slug = `${ind.key}-${svc.key}`;
      list.push({
        slug,
        keyword,
        title: `${keyword} | 름랩 REUMLAB`,
        description: `${ind.ko} ${svc.koFull} - ${ind.desc || ''} 견적 문의.`,
        pattern: 'industry_service',
        industryKey: ind.key,
        serviceKey: svc.key,
        hubId: ind.key,
      });
    }
  }
  return list;
}

// 지역×서비스×의도 80개 (10×4×2: 서비스 4개, 의도 비용/견적)
function buildRegionServiceIntentLandings() {
  const list = [];
  const services = SERVICES.slice(0, 4);
  const intents = INTENTS.slice(0, 2); // 비용, 견적
  for (const region of REGIONS) {
    for (const svc of services) {
      for (const intent of intents) {
        const keyword = `${region.ko} ${svc.ko} ${intent.ko}`;
        const slug = `${region.key}-${svc.key}-${intent.key}`;
        list.push({
          slug,
          keyword,
          title: `${keyword} | 름랩 REUMLAB`,
          description: `${region.ko} ${svc.koFull} ${intent.ko} - 름랩 견적 상담.`,
          pattern: 'region_service_intent',
          regionKey: region.key,
          serviceKey: svc.key,
          intentKey: intent.key,
          hubId: region.key,
        });
      }
    }
  }
  return list;
}

function buildAllLandings() {
  const a = buildServiceIntentLandings();
  const b = buildRegionServiceLandings();
  const c = buildIndustryServiceLandings();
  const d = buildRegionServiceIntentLandings();
  const all = [...a, ...b, ...c, ...d];
  if (all.length !== 328) {
    console.warn(`Expected 328 landings, got ${all.length}`);
  }
  return all;
}

// 허브 38개: 서비스 12 + 지역 10 + 업종 9 + 복합 7
function buildHubList() {
  const serviceHubs = SERVICES.map((s) => ({ id: s.key, type: 'service', ko: s.koFull, slug: s.key }));
  const regionHubs = REGIONS.map((r) => ({ id: r.key, type: 'region', ko: r.ko, slug: r.key }));
  const industryHubs = INDUSTRIES.map((i) => ({ id: i.key, type: 'industry', ko: i.ko, slug: i.key }));
  const composite = [
    { id: 'app-dev-cost', type: 'composite', ko: '앱개발 비용', slug: 'app-dev-cost' },
    { id: 'homepage-quote', type: 'composite', ko: '홈페이지제작 견적', slug: 'homepage-quote' },
    { id: 'web-dev-cost', type: 'composite', ko: '웹개발 비용', slug: 'web-dev-cost' },
    { id: 'landing-page-cost', type: 'composite', ko: '랜딩페이지 제작비', slug: 'landing-page-cost' },
    { id: 'suwon-app-dev', type: 'composite', ko: '수원 앱개발', slug: 'suwon-app-dev' },
    { id: 'gangnam-homepage', type: 'composite', ko: '강남 홈페이지제작', slug: 'gangnam-homepage' },
    { id: 'startup-app-dev', type: 'composite', ko: '스타트업 앱개발', slug: 'startup-app-dev' },
  ];
  return [...serviceHubs, ...regionHubs, ...industryHubs, ...composite];
}

function buildClusters(landings, hubs) {
  const hubIds = new Set(hubs.map((h) => h.id));
  const clusters = {};
  for (const hub of hubs) {
    clusters[hub.slug] = {
      id: hub.id,
      type: hub.type,
      ko: hub.ko,
      slug: hub.slug,
      landings: landings.filter((l) => l.hubId === hub.id).map((l) => l.slug),
    };
  }
  // landings that have hubId not in hubs: assign to nearest (e.g. service hub)
  landings.forEach((l) => {
    if (hubIds.has(l.hubId)) return;
    const existing = Object.values(clusters).find((c) => c.landings.includes(l.slug));
    if (!existing) {
      const fallback = l.serviceKey ? l.serviceKey : l.regionKey || l.industryKey;
      if (fallback && clusters[fallback]) {
        clusters[fallback].landings.push(l.slug);
      }
    }
  });
  return clusters;
}

function main() {
  const landings = buildAllLandings();
  const hubs = buildHubList();
  const clusters = buildClusters(landings, hubs);

  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  fs.writeFileSync(
    path.join(contentDir, 'landings.json'),
    JSON.stringify(landings, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.join(contentDir, 'clusters.json'),
    JSON.stringify(clusters, null, 2),
    'utf8'
  );

  console.log('Generated landings.json:', landings.length);
  console.log('Generated clusters.json (hubs):', Object.keys(clusters).length);
}

main();
