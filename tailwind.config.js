/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AZRAQ — Grounded Editorial Palette
        'azraq-bg': '#F8FAFC',             // Clean Slate Canvas
        'azraq-surface': '#FFFFFF',        // Pure White Surface
        'azraq-card': '#FFFFFF',           // Card Background
        'azraq-ice': '#F1F5F9',            // Subtle Slate Accent
        'azraq-cyan': '#0284C7',           // Muted Sky Accent
        'azraq-deep': '#0F172A',           // Deep Slate Ink
        'azraq-ink': '#0F172A',            // Primary Ink
        'azraq-secondary': '#475569',      // Slate-600 Secondary Text
        'azraq-muted': '#64748B',          // Slate-500 Muted Text
        'azraq-blue': '#185ADB',           // Authentic Cerulean Blue (Primary Actions)
        'azraq-blue-hover': '#1044A3',     // Darker action blue
        'azraq-white': '#FFFFFF',          // Pure White
        'azraq-border': '#E2E8F0',         // Clean Slate-200 Hairline
        'azraq-border-subtle': '#F1F5F9',  // Subtle Border
        'azraq-border-glass': '#E2E8F0',
        'azraq-ivory': '#F8FAFC',
        'azraq-lime': '#059669',           // Emerald Accent
        'azraq-sand': '#F1F5F9',
        'azraq-bg-secondary': '#F8FAFC',
        'azraq-frost': '#F1F5F9',
        'azraq-primary': '#185ADB',
        'azraq-soft-blue': '#E0F2FE',
        'azraq-text': '#0F172A',
        azraq: {
          navy: '#0F172A',
          midnight: '#0B132B',
          azure: '#185ADB',
          blue: '#185ADB',
          deep: '#0F172A',
          cyan: '#0284C7',
          ice: '#F1F5F9',
          ivory: '#F8FAFC',
          border: '#E2E8F0',
          muted: '#64748B',
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
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'sm': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'md': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)',
        'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card-hover': '0 8px 20px -4px rgba(15, 23, 42, 0.1)',
        // Backward-compatible tokens mapped to clean shadows
        'glass-panel': '0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'glass-card': '0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'glass-card-hover': '0 8px 20px -4px rgba(15, 23, 42, 0.1)',
        'glow-cyan': '0 2px 8px 0 rgba(24, 90, 219, 0.15)',
        'glow-blue': '0 2px 8px 0 rgba(24, 90, 219, 0.15)',
        'editorial': '0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'editorial-hover': '0 8px 20px -4px rgba(15, 23, 42, 0.1)',
        'editorial-elevated': '0 12px 28px -6px rgba(15, 23, 42, 0.12)',
        'glass': '0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'glass-hover': '0 6px 16px 0 rgba(15, 23, 42, 0.08)',
        'glass-glow': '0 2px 8px 0 rgba(24, 90, 219, 0.15)',
        'glow-azure': '0 2px 8px 0 rgba(24, 90, 219, 0.15)',
        'float': '0 8px 20px -4px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
