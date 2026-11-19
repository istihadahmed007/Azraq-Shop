/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AZRAQ — The Modern Architectural Retail Palette
        'azraq-ivory': '#F5F4EF',          // Warm Ivory (Primary backdrop)
        'azraq-ink': '#172333',            // Deep Ink (Primary text & dark surfaces)
        'azraq-blue': '#245BDB',           // AZRAQ Blue (Primary actions & brand)
        'azraq-blue-hover': '#1C4BB8',     // Darker action blue
        'azraq-lime': '#D7ED78',           // Soft Lime (Occasional accent)
        'azraq-white': '#FFFFFF',          // Pure White (Product surfaces)
        'azraq-border': '#E5E3DA',         // Neutral Hairline Border
        'azraq-border-subtle': '#EDEBE4',  // Delicate secondary border
        'azraq-border-dark': '#D1CDC3',    // Focused hairline
        'azraq-muted': '#667085',          // Secondary muted text
        'azraq-surface': '#FFFFFF',        // Clean white card surface
        'azraq-surface-subtle': '#FAF9F5', // Subtle warm container
        'azraq-sand': '#EAE7DD',           // Warm sand tone

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
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(23, 35, 51, 0.04), 0 1px 2px rgba(23, 35, 51, 0.02)',
        'editorial-hover': '0 6px 16px -2px rgba(23, 35, 51, 0.06), 0 2px 6px -1px rgba(23, 35, 51, 0.03)',
        'editorial-elevated': '0 12px 32px -4px rgba(23, 35, 51, 0.08)',
        'glass': '0 2px 8px rgba(23, 35, 51, 0.04)',
        'glass-hover': '0 8px 24px rgba(23, 35, 51, 0.08)',
        'glass-glow': '0 2px 8px rgba(36, 91, 219, 0.15)',
        'glow-cyan': '0 2px 8px rgba(36, 91, 219, 0.15)',
        'glow-azure': '0 4px 14px rgba(36, 91, 219, 0.25)',
        'float': '0 8px 24px rgba(23, 35, 51, 0.06)',
        'card-hover': '0 6px 18px rgba(23, 35, 51, 0.06)',
      }
    },
  },
  plugins: [],
}

