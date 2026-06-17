/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#0d9488',

        background: 'var(--color-background)',
        surface: 'var(--color-surface)',

        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',

        border: 'var(--color-border)',
        overlay: 'var(--color-overlay)',

        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        lg: '10px',
        xl: '14px',
      },

      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        card: 'var(--shadow-card)',
      },

      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
}
