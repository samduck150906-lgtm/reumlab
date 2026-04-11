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
          DEFAULT: '#3d7cff',
          soft: '#e8f0ff',
          deep: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(15, 31, 58, 0.06), 0 12px 40px rgba(10, 22, 40, 0.08)',
        'card-hover': '0 1px 0 rgba(15, 31, 58, 0.08), 0 20px 50px rgba(10, 22, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
