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
          navy: '#062B4F',       // Deep Azraq Navy (Reference Dark)
          azure: '#0877C9',      // Royal Azure
          glass: '#69C5F5',      // Glass Azure
          sky: '#D9F0FF',        // Soft Sky Blue
          ice: '#F8FCFF',        // Ice White
          cyan: '#50DDF0',       // Subtle Cyan Accent
          lime: '#C9F34A',       // Neon Highlight Accent
          cloud: '#F4F9FD',      // Subtle Ice Blue Background
          charcoal: '#041E38',   // Deepest Navy
          white: '#FFFFFF',
          dark: '#03172C',
          card: '#082544',
          purple: '#69C5F5',     // mapped to glass azure for backwards compatibility
          violet: '#0877C9',     // mapped to royal azure for backwards compatibility
          lavender: '#D9F0FF',   // mapped to soft sky for backwards compatibility
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(6, 43, 79, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(8, 119, 201, 0.16)',
        'glass-glow': '0 0 25px -2px rgba(105, 197, 245, 0.4)',
        'glow-cyan': '0 0 25px -3px rgba(80, 221, 240, 0.45)',
        'glow-azure': '0 0 30px -5px rgba(8, 119, 201, 0.35)',
        'float': '0 25px 50px -12px rgba(6, 43, 79, 0.12)',
        'card-hover': '0 20px 40px -15px rgba(8, 119, 201, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #062B4F 0%, #085B9E 50%, #0877C9 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 247, 255, 0.6) 100%)',
        'azure-gradient': 'linear-gradient(135deg, #0877C9 0%, #69C5F5 100%)',
        'navy-gradient': 'linear-gradient(180deg, #062B4F 0%, #03172C 100%)',
        'ice-gradient': 'linear-gradient(180deg, #F8FCFF 0%, #EBF5FF 100%)',
      }
    },
  },
  plugins: [],
}

