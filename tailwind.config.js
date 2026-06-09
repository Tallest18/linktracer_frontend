/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        /* Deep slate backgrounds */
        slate: {
          950: '#0B1120',
          900: '#0f172a',
          850: '#131e30',
        },
        /* Emerald accent — the single bold colour */
        em: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      keyframes: {
        pulse_ring: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.5)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(16,185,129,0)' },
        },
        fadein: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slidein: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        toastin: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        pulse_ring: 'pulse_ring 2.2s ease-in-out infinite',
        fadein:     'fadein 0.25s ease both',
        slidein:    'slidein 0.22s ease both',
        toastin:    'toastin 0.2s ease both',
      },
    },
  },
  plugins: [],
};
