/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a1628',
          900: '#0f1f3a',
          850: '#132447',
          800: '#1a2d4d',
          700: '#234066',
          600: '#2f5280',
        },
        accent: {
          // DEFAULT 는 아이콘·테두리·연한 배경용. 흰 글자를 올리면 3.80:1 이라
          // WCAG AA(4.5:1)에 못 미치므로, 흰 글자 버튼은 deep 이상을 쓴다.
          DEFAULT: '#3d7cff',
          soft: '#e8f0ff',
          deep: '#2563eb',   // 흰 글자 5.17:1 — 버튼 기본
          darker: '#1d4ed8', // 흰 글자 6.70:1 — 버튼 hover
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', 'system-ui', 'sans-serif'],
        display: ['"Pretendard"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(15, 31, 58, 0.06), 0 12px 40px rgba(10, 22, 40, 0.08)',
        'card-hover': '0 1px 0 rgba(15, 31, 58, 0.08), 0 20px 50px rgba(10, 22, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
