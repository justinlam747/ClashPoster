/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#1e1b4b',
        },
        'clash-yellow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },
      backgroundImage: {
        'gradient-royal': 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #1e40af 100%)',
        'gradient-gold': 'linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #fde047 100%)',
        'gradient-clash': 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 40%, #a16207 100%)',
      },
      boxShadow: {
        'blue-glow': '0 0 20px rgba(30, 58, 138, 0.5)',
        'yellow-glow': '0 0 20px rgba(234, 179, 8, 0.5)',
        'clash': '0 10px 40px rgba(30, 27, 75, 0.6)',
      },
    },
  },
  plugins: [],
}


