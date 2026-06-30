# 메타 광고 — 캠페인 구조 · 네이밍 · UTM 프리셋 (소호 무료진단)

광고 계정 **룰랩_META (905084682617844)** / 웹 픽셀 **reumlab 웹픽셀 (1019901144020877)** / 전환 이벤트 **Lead** 기준.
도착지는 항상 **`https://reumlab.com/soho/`** 입니다.

---

## 0. UTM은 "동적 1줄"이 정답 (먼저 읽기)

모든 광고의 **URL 매개변수** 칸에 아래 **딱 한 줄**만 넣으세요. 메타가 캠페인·소재·노출위치를 자동으로 채워줍니다.
소재마다 다르게 쓸 필요 없이, 이거 하나면 분석에서 전부 구분됩니다.

```
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{placement}}
```

- `{{campaign.name}}` → 캠페인명 자동 입력
- `{{ad.name}}` → 광고(소재)명 자동 입력 → **A/B 소재 구분이 여기서 됨**
- `{{placement}}` → 노출 위치(페이스북 피드/인스타 릴스 등) 자동 입력

> 그래서 **네이밍만 규칙대로 지으면 UTM은 알아서 따라옵니다.** 아래 1·2번이 핵심.

---

## 1. 네이밍 규칙

| 단계 | 형식 | 예시 |
|---|---|---|
| **캠페인** | `LEAD_소호_[타겟유형]_[YYYY-MM]` | `LEAD_소호_콜드_2026-07` |
| **광고세트** | `[타겟상세]` | `관심사_소상공인_경기`, `RTG_방문30일`, `LAL_리드1%` |
| **광고(소재)** | `[형식][버전]_[훅]` | `영상A_광고비낭비`, `이미지B_49만원`, `영상C_검색노출` |

- 띄어쓰기 대신 `_` 사용(UTM·시트 분석이 깔끔해짐).
- `[훅]`은 그 소재가 미는 메시지 한 단어(가격/후기/검색노출/광고비 등).

---

## 2. 캠페인 구조 — 단계별

### 🟢 1단계: 처음 시작 (예산 작을 때) — 캠페인 1개
**목표 = 잠재 고객(Leads), 전환 이벤트 = Lead**

```
캠페인:   LEAD_소호_콜드_2026-07
└ 광고세트: 관심사_소상공인_경기
   · 타겟: 관심사(소상공인/자영업/창업/마케팅), 지역 수원·동탄·화성 + 전국, 25–55세
   · 예산: 일 1만~3만원으로 테스트
   ├ 광고: 영상A_광고비낭비
   ├ 광고: 이미지B_49만원
   └ 광고: 영상C_검색노출      ← 소재 3개로 A/B/C 테스트
```
→ 3~7일 돌려보고 **신청(Lead) 단가가 가장 싼 소재**에 예산 몰아주기.

### 🔵 2단계: 성과 나오면 확장 — 리타게팅 + 룩어라이크 추가
```
캠페인:   LEAD_소호_리타게팅_2026-07
└ 광고세트: RTG_방문30일
   · 타겟: 최근 30일 reumlab.com 방문자  −  이미 신청한 사람(Lead) 제외
   └ 광고: 이미지D_놓치지마세요

캠페인:   LEAD_소호_유사_2026-07
└ 광고세트: LAL_리드1%
   · 타겟: Lead 이벤트 기반 1% 유사 타겟(Lookalike)
   └ 광고: 영상A_광고비낭비(재사용)
```
> 리타게팅은 "방문했는데 신청 안 한 사람"을 다시 부르는 거라 **신청 단가가 가장 쌉니다.** 트래픽이 좀 쌓인 뒤 켜세요.

---

## 3. 그래도 수동 UTM을 원하면 (소재별 고정값)

동적 1줄을 안 쓰고 직접 박고 싶을 때만 사용. 광고마다 URL 매개변수 칸에 해당 줄을 넣습니다.

| 구분 | 광고(소재)명 | URL 매개변수 |
|---|---|---|
| 콜드 A | 영상A_광고비낭비 | `utm_source=meta&utm_medium=paid_social&utm_campaign=soho_cold&utm_content=video_a_adwaste` |
| 콜드 B | 이미지B_49만원 | `utm_source=meta&utm_medium=paid_social&utm_campaign=soho_cold&utm_content=image_b_49` |
| 콜드 C | 영상C_검색노출 | `utm_source=meta&utm_medium=paid_social&utm_campaign=soho_cold&utm_content=video_c_seo` |
| 리타게팅 | 이미지D_놓치지마세요 | `utm_source=meta&utm_medium=paid_social&utm_campaign=soho_rtg&utm_content=image_d_remind` |
| 유사타겟 | 영상A(재사용) | `utm_source=meta&utm_medium=paid_social&utm_campaign=soho_lal&utm_content=video_a_adwaste` |

> ⚠️ 물음표 `?` 없이 위 내용만 "URL 매개변수" 칸에 넣으세요. 도착 URL은 `https://reumlab.com/soho/` 그대로.

---

## 4. 신청서에 출처가 자동으로 남습니다

광고로 UTM 달고 들어와 폼을 제출하면, 그 `utm_*` 값이 **Netlify Forms → soho-diagnosis 의 각 신청 건에 함께 기록**됩니다.
→ "이 신청은 `soho_cold` 캠페인 / `video_a` 소재에서 왔다"가 한눈에 보여, **어떤 광고가 실제 신청까지 만들었는지** 알 수 있습니다.

## 5. 성과 보는 법 (요약)

- **메타 광고 관리자**: 캠페인별 결과 = **"잠재 고객(Lead)" 수**와 **결과당 비용(신청 단가)**. 이 두 개만 보면 됩니다.
- **Netlify Forms**: 실제 신청 내용 + 어느 광고(UTM)에서 왔는지.
- 판단: 신청 단가 싼 소재·타겟에 예산 ↑, 비싼 건 끄기.
