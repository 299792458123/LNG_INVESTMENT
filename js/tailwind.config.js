/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        },
        surface: {
          900: '#0a0f0d',
          800: '#111712',
          700: '#1a2119',
          600: '#243024',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
