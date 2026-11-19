/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AZRAQ — The Modern Everyday Edit Palette
        'azraq-ivory': '#F5F4EF',       // Warm Ivory (Primary background)
        'azraq-ink': '#172333',         // Deep Ink (Primary text & dark surfaces)
        'azraq-blue': '#245BDB',        // AZRAQ Blue (Primary actions & brand)
        'azraq-blue-hover': '#1C4BB8',  // Darker action blue
        'azraq-lime': '#D7ED78',        // Soft Lime (Occasional accent)
        'azraq-white': '#FFFFFF',       // Pure White (Product surfaces)
        'azraq-border': '#E5E3DA',      // Neutral Grey Border
        'azraq-muted': '#667085',       // Secondary muted text
        'azraq-surface': '#FFFFFF',     // Clean card surface
        'azraq-surface-subtle': '#FAF9F5', // Subtle warm container

        // Backward compatibility mappings
        'azraq-bg': '#F5F4EF',
        'azraq-bg-secondary': '#FAF9F5',
        'azraq-frost': '#EBE8DF',
        'azraq-primary': '#245BDB',
        'azraq-soft-blue': '#4D7DF0',
        'azraq-text': '#172333',
        azraq: {
          navy: '#172333',
          midnight: '#172333',
          azure: '#245BDB',
          blue: '#245BDB',
          ivory: '#F5F4EF',
          lime: '#D7ED78',
          border: '#E5E3DA',
          muted: '#667085',
          white: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['"Manrope"', '"Hind Siliguri"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Manrope"', 'sans-serif'],
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

