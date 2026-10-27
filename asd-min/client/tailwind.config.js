/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chess: {
          dark: '#161512',
          card: '#21201d',
          cardBorder: '#302e2b',
          accent: '#81b64c',
          accentHover: '#98c65d',
          accentDark: '#629935',
          gold: '#eab308',
          red: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

