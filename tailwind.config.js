/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AZRAQ — Futuristic Icy Glassmorphism Palette (Reference Design Language)
        'azraq-bg': '#F1F7FC',             // Luminous Icy Canvas (Main background)
        'azraq-surface': '#F8FBFF',        // Crystal White Primary Surface
        'azraq-ice': '#DDEEFF',            // Soft Ice Blue Accent
        'azraq-cyan': '#70C8ED',           // Glowing Cyan Accent
        'azraq-deep': '#193B5B',           // Futuristic Deep Blue Text / Headings
        'azraq-ink': '#193B5B',            // Ink mapped to Deep Blue
        'azraq-secondary': '#718398',      // Muted Secondary Slate-Blue Text
        'azraq-muted': '#718398',          // Muted Secondary Text
        'azraq-blue': '#245BDB',           // AZRAQ Blue (Primary Actions)
        'azraq-blue-hover': '#1C4BB8',     // Darker action blue
        'azraq-white': '#FFFFFF',          // Pure White
        'azraq-border': 'rgba(130, 170, 205, 0.22)', // Fine Translucent Icy Border
        'azraq-border-subtle': 'rgba(130, 170, 205, 0.15)',
        'azraq-border-glass': 'rgba(255, 255, 255, 0.85)',
        'azraq-ivory': '#F1F7FC',          // Backward compatibility
        'azraq-lime': '#70C8ED',           // Updated to cyan glow
        'azraq-sand': '#DDEEFF',
        'azraq-bg-secondary': '#F8FBFF',
        'azraq-frost': '#DDEEFF',
        'azraq-primary': '#245BDB',
        'azraq-soft-blue': '#70C8ED',
        'azraq-text': '#193B5B',
        azraq: {
          navy: '#193B5B',
          midnight: '#102A43',
          azure: '#245BDB',
          blue: '#245BDB',
          deep: '#193B5B',
          cyan: '#70C8ED',
          ice: '#DDEEFF',
          ivory: '#F1F7FC',
          border: 'rgba(130, 170, 205, 0.22)',
          muted: '#718398',
          white: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['"Manrope"', '"Hind Siliguri"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Manrope"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'glass-panel': '0 20px 48px -12px rgba(112, 200, 237, 0.16), 0 4px 16px -2px rgba(25, 59, 91, 0.05)',
        'glass-card': '0 10px 30px -4px rgba(112, 200, 237, 0.12), 0 2px 8px -1px rgba(25, 59, 91, 0.04)',
        'glass-card-hover': '0 20px 40px -6px rgba(112, 200, 237, 0.28), 0 4px 14px 0 rgba(25, 59, 91, 0.08)',
        'glow-cyan': '0 8px 24px -2px rgba(112, 200, 237, 0.45)',
        'glow-blue': '0 8px 24px -2px rgba(36, 91, 219, 0.35)',
        'editorial': '0 4px 16px -2px rgba(25, 59, 91, 0.05)',
        'editorial-hover': '0 16px 36px -4px rgba(112, 200, 237, 0.22)',
        'editorial-elevated': '0 24px 48px -8px rgba(112, 200, 237, 0.18)',
        'glass': '0 4px 20px rgba(112, 200, 237, 0.08)',
        'glass-hover': '0 12px 32px rgba(112, 200, 237, 0.2)',
        'glass-glow': '0 8px 24px rgba(112, 200, 237, 0.35)',
        'glow-azure': '0 8px 24px rgba(36, 91, 219, 0.35)',
        'float': '0 16px 40px rgba(112, 200, 237, 0.16)',
        'card-hover': '0 16px 36px rgba(112, 200, 237, 0.22)',
      }
    },
  },
  plugins: [],
}

