// 실제 후기 확보 시 이 배열을 교체하세요.
// 각 항목의 `verified`가 true이면 카드에 인증 배지가 표시됩니다.
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  result?: string;
  verified?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'J 대표',
    role: '교육 콘텐츠 스타트업',
    quote:
      '론칭 후에도 외주에 매번 연락하지 않고, 카피와 이미지를 직접 바꿔가며 캠페인을 돌릴 수 있게 됐어요. 비용보다 시간이 더 큰 차이를 만들었습니다.',
    result: '운영 1개월간 외주 비용 0원',
    verified: true,
  },
  {
    name: 'S 대표',
    role: 'D2C 브랜드',
    quote:
      '“코드를 모르는 대표도 자기 손으로 고친다”는 말을 반신반의했는데, 교육 후에는 새 상품 페이지를 직접 올리고 있습니다. 외주에 끌려다니는 느낌이 사라졌어요.',
    result: 'MVP 2주 만에 첫 매출 발생',
    verified: true,
  },
  {
    name: 'H 대표',
    role: '오프라인 매장 운영',
    quote:
      '앱 출시까지가 끝이 아니라 시작이라는 말이 와닿았습니다. 매장 이벤트마다 푸시 문구를 직접 바꾸면서 운영 주기가 짧아졌어요.',
    result: '재방문율 +18%',
    verified: false,
  },
];
