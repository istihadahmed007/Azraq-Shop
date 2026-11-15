/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azraq: {
          navy: '#12233F',
          azure: '#2677D9',
          lavender: '#EAE5FF',
          purple: '#A78BFA',
          violet: '#7955E8',
          lime: '#C9F34A',
          cloud: '#F7F8FC',
          charcoal: '#202B3A',
          white: '#FFFFFF',
          dark: '#0B132B',
          card: '#161B2E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -3px rgba(201, 243, 74, 0.45)',
        'glow-violet': '0 0 30px -5px rgba(121, 85, 232, 0.35)',
        'float': '0 25px 50px -12px rgba(18, 35, 63, 0.15)',
        'card-hover': '0 20px 40px -15px rgba(121, 85, 232, 0.2)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F0EDFF 0%, #E6E8FF 50%, #DCE6FF 100%)',
        'violet-gradient': 'linear-gradient(135deg, #7955E8 0%, #A78BFA 100%)',
        'navy-gradient': 'linear-gradient(180deg, #12233F 0%, #0E1A30 100%)',
        'lime-gradient': 'linear-gradient(135deg, #D4FA57 0%, #C9F34A 100%)',
      }
    },
  },
  plugins: [],
}

