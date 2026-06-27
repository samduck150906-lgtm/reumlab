# 마케팅 자동화 시스템 - 빠른 시작 가이드

## 5분 안에 시작하기

### 1단계: 전체 워크플로우 실행 (자동 블로그 → 캠페인 → 배포)

```bash
# 전체 마케팅 자동화 통합 워크플로우 실행
npm run workflow:marketing
```

**출력 예:**
```
╔════════════════════════════════════════════════╗
║  마케팅 자동화 통합 워크플로우 시작              ║
╚════════════════════════════════════════════════╝

📚 1단계: 블로그 포스트 로드
✓ 3개 블로그 포스트 로드됨

🎯 2단계: 마케팅 캠페인 생성
✓ 3개 캠페인 생성됨

🧪 3단계: A/B 테스트 설정
✓ 3개 A/B 테스트 설정됨
...
```

### 2단계: 성과 모니터링 및 최적화

```bash
# 성과 모니터링 및 자동 최적화 실행
npm run optimize
```

**주요 기능:**
- 실시간 캠페인 성과 분석
- 자동 최적화 기회 발견 (8가지 규칙)
- 이상 탐지 (손실 캠페인, CPC 급증 등)
- 플랫폼별 성과 비교
- 우선순위 액션 추천

### 3단계: 대시보드 생성

```bash
# 대시보드 생성 (JSON + HTML)
npm run dashboard
```

**생성되는 파일:**
- `.output/dashboard.html` - 인터랙티브 웹 대시보드
- `.output/dashboard-data.json` - API 데이터

브라우저에서 열기:
```bash
open .output/dashboard.html  # macOS
# 또는
start .output/dashboard.html  # Windows
```

---

## 완전한 마케팅 자동화 파이프라인

### 매일 실행할 작업

```bash
# 아침 9시: 성과 모니터링 및 최적화
npm run optimize

# 오후 3시: 대시보드 생성 및 리포트
npm run dashboard
```

### 주간 작업

```bash
# 월요일: 새로운 캠페인 생성
npm run workflow:marketing

# 금요일: 주간 리포트 검토 및 최적화
npm run optimize
```

### 배포 (API 연동 필수)

```bash
# 환경 변수 설정
export GOOGLE_ADS_API_KEY="your_key"
export GOOGLE_ADS_CUSTOMER_ID="your_id"
export NAVER_ADS_API_KEY="your_key"
export NAVER_ADS_CUSTOMER_ID="your_id"
export FACEBOOK_ADS_API_KEY="your_key"
export FACEBOOK_BUSINESS_ACCOUNT_ID="your_id"

# 실제 플랫폼에 배포
npm run deploy:campaigns
```

---

## 주요 npm 스크립트

| 스크립트 | 설명 | 실행 시간 |
|---------|------|---------|
| `npm run gen:blog` | 블로그 포스트 생성 | 5초 |
| `npm run gen:marketing` | 마케팅 캠페인 생성 | 3초 |
| `npm run workflow:marketing` | 전체 워크플로우 (블로그→캠페인→최적화) | 10초 |
| `npm run optimize` | 성과 모니터링 및 최적화 | 5초 |
| `npm run dashboard` | 대시보드 생성 | 5초 |
| `npm run deploy:campaigns` | 멀티플랫폼 배포 | 20초 |

---

## 대시보드 대해 알기

### 대시보드 구성 요소

**1. 주요 지표 (KPI 카드)**
```
├── 총 캠페인: 400개
├── 활성 캠페인: 360개 (90% 이상 성과)
├── 월간 지출: 48M원
├── 총 전환: 400개+
├── 평균 ROAS: 2.0+
└── 평균 CPC: 3,000원
```

**2. 상위 성과 캠페인**
- 각 캠페인의 ROAS, 전환, CPC 표시
- 플랫폼별 색상 코딩
- 트렌드 표시 (↑ 개선, → 안정, ↓ 하락)

**3. 플랫폼별 성과 비교**
```
Google:   ROAS 2.1, 100개 캠페인
Naver:    ROAS 1.8, 100개 캠페인
Facebook: ROAS 3.2, 100개 캠페인 (최우수)
Instagram: ROAS 2.5, 100개 캠페인
```

**4. 경고 및 알림**
- 🔴 **중요**: 손실 캠페인, 전환 중단
- 🟡 **경고**: CPC 급증, 성과 저하
- 🟢 **정보**: 새 기회, 확장 가능 캠페인

**5. 추천사항**
- AI 기반 자동 추천
- 우선순위 기반 정렬
- 실행 가능한 액션 제시

---

## 최적화 규칙 이해하기

### 8가지 자동 최적화 규칙

| # | 규칙 | 조건 | 액션 | 영향도 |
|---|------|------|------|--------|
| 1 | CTR 최적화 | CTR < 0.5% | 광고 문구 개선 | 높음 |
| 2 | CPC 조정 | CPC > 15K원 | 입찰가 감소 (-10%) | 높음 |
| 3 | 예산 증가 | ROAS > 3.0 | 예산 증가 (+20%) | 중간 |
| 4 | 예산 감소 | ROAS < 1.5 | 예산 감소 (-20%) | 중간 |
| 5 | 타겟팅 개선 | 클릭多 > 전환無 | 키워드 정제 | 높음 |
| 6 | CPA 확장 | CPA < 30K원 | 예산 확대 (+25%) | 중간 |
| 7 | 디바이스 최적화 | 크로스 분석 | 모바일 입찰가 조정 | 낮음 |
| 8 | 시간대 최적화 | 시간대별 성과 | 고성과 시간대 집중 | 낮음 |

---

## 실제 예제: 마케팅 캠페인 관리

### 예제 1: 저성과 캠페인 개선

**현황:**
```json
{
  "campaignName": "[자동] 웹개발 비용 - 경기",
  "platform": "google",
  "metrics": {
    "clicks": 30,
    "conversions": 0,
    "cpc": 50000,
    "roas": 0
  }
}
```

**발견된 문제:**
- 🔴 클릭은 있지만 전환 없음 (규칙 5 적용)
- 🔴 CPC가 너무 높음 (규칙 2 적용)
- 🔴 손실 상태 (규칙 4 적용)

**추천 조치:**
1. 타겟팅 정제: 제외 키워드 추가 (중단어, 불법 등)
2. 입찰가 감소: 50K → 45K원 (-10%)
3. 광고 문구 개선: A/B 테스트 신규 헤드라인
4. 예산 조정: 50K → 40K원 일일 예산 (-20%)

---

### 예제 2: 우수 캠페인 확장

**현황:**
```json
{
  "campaignName": "[자동] 홈페이지 제작 - 인계동",
  "platform": "facebook",
  "metrics": {
    "conversions": 18,
    "cpa": 83333,
    "roas": 3.6
  }
}
```

**발견된 기회:**
- ✅ ROAS > 3.0 (규칙 3 적용)
- ✅ CPA < 100K원 (규칙 6 적용)

**추천 조치:**
1. 예산 증가: 50K → 60K원 (+20%)
2. 지역 확장: 경기, 부산 등 신규 지역 추가
3. 광고 세트 추가: 더 많은 타겟팅 옵션
4. 모니터링: 확장 후 성과 추적

---

## 성능 벤치마크

### 예상 성과 (30일 기준)

```
400개 캠페인 실행 시:

지표                 기대값
─────────────────────────────
총 노출             4,000K회 (4백만)
총 클릭               150K회
총 전환               4,500개 (3% 전환율)
월간 예산              48M원
평균 ROAS              2.0 이상
평균 CPC               3,000원
평균 CPA              30,000원
활성 캠페인           360개 (90%)
```

---

## 문제 해결

### Q: 대시보드가 비어 있어요
**A:** 먼저 캠페인을 생성하세요:
```bash
npm run gen:marketing
npm run dashboard
```

### Q: 성과가 너무 낮아요 (ROAS < 1.5)
**A:** 최적화 스크립트 실행:
```bash
npm run optimize
```
저성과 캠페인의 규칙 2, 4, 5가 자동으로 조정됩니다.

### Q: 캠페인 배포가 안 돼요
**A:** 환경 변수 확인:
```bash
echo $GOOGLE_ADS_API_KEY
echo $NAVER_ADS_API_KEY
```
없으면 설정:
```bash
export GOOGLE_ADS_API_KEY="your_key"
```

### Q: 매일 자동 실행하려면?
**A:** 크론 작업 설정:
```bash
# macOS/Linux: crontab -e
0 9 * * * cd /path/to/reumlab && npm run optimize
0 15 * * * cd /path/to/reumlab && npm run dashboard

# Windows: Task Scheduler에서 설정
```

---

## 다음 단계

### 1단계: 기본 설정 (오늘)
- ✅ 블로그 포스트 생성
- ✅ 마케팅 캠페인 생성
- ✅ 성과 모니터링 설정

### 2단계: API 연동 (1주)
- API 키 획득 (Google Ads, Naver Ads, Facebook)
- 환경 변수 설정
- 배포 테스트

### 3단계: 자동화 (2주)
- 일일 자동 실행 설정 (크론/스케줄러)
- 대시보드 공유
- 팀 알림 설정

### 4단계: 최적화 (지속)
- 주간 리포트 검토
- 추천사항 적용
- 성과 모니터링

---

## 유용한 링크

- 📚 [전체 가이드](./PROGRAMMATIC-MARKETING.md)
- 🔌 [API 통합 가이드](./PLATFORM-API-INTEGRATION.md)
- 📝 [블로그 생성 가이드](./BLOG-AUTO-GENERATION.md)
- 💻 [GitHub Repository](https://github.com/your-repo)

---

## 지원

문제가 있으신가요?
- 📧 지원 이메일: support@reumlab.com
- 💬 커뮤니티 포럼: community.reumlab.com
- 🐛 버그 리포트: github.com/issues

---

**행운을 빕니다! 🚀**

마케팅 자동화 시스템이 당신의 광고 캠페인을 한 단계 업그레이드할 것입니다.
