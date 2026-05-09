/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#14B8A6',
        secondary: '#0EA5A4',
        background: '#F4F8FB',
        surface: '#FFFFFF',
        muted: '#94A3B8',
        border: '#E2E8F0',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
