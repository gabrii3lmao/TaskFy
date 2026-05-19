/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1db997',
        secondary: '#19a7d2',

        background: '#f9fafb',
        surface: '#ffffff',

        foreground: '#111827',
        muted: '#6b7280',

        border: '#e2e8f0',

        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
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
        subtle: '0 1px 2px rgba(15, 23, 42, 0.04)',
        card: '0 2px 6px rgba(15, 23, 42, 0.06)',
      },

      transitionDuration: {
        200: '200ms',
      },
    },
  },
  plugins: [],
}
