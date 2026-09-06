import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F1222',
          900: '#161A33',
          800: '#232748',
          700: '#33396B',
          600: '#4A5289',
        },
        gold: {
          50: '#FFF8E6',
          100: '#FFEDBD',
          200: '#FFDD85',
          300: '#FFC93F',
          400: '#F5AE13',
          500: '#E08E0B',
          600: '#B96E08',
        },
        mint: {
          50: '#E9FBF4',
          100: '#C7F5E2',
          400: '#2FD599',
          500: '#17B983',
          600: '#0F9A6C',
        },
        paper: '#FBF9F4',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        sq: '6px',
        card: '18px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,18,34,0.06), 0 8px 24px -12px rgba(15,18,34,0.18)',
      },
    },
  },
  plugins: [],
}
export default config
