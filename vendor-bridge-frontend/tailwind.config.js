/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        syne: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        dm: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0A0F1E',
          800: '#0D1529',
          700: '#111827',
        },
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        }
      }
    },
  },
  plugins: [],
}
