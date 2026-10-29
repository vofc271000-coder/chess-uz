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
        dark: {
          bg: '#080B12',
          card: '#111827',
          panel: '#182131',
          border: '#1f293d',
          hover: '#222f46',
        },
        electric: {
          violet: '#8B5CF6',
          violetHover: '#7C3AED',
          violetLight: '#A78BFA',
          violetDark: '#5B21B6',
        },
        cyber: {
          cyan: '#06B6D4',
          cyanHover: '#0891B2',
          cyanLight: '#38BDF8',
          cyanDark: '#0E7490',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
        'glow-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 6s linear infinite',
      }
    },
  },
  plugins: [],
}
