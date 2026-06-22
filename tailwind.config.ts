import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Life Transformers — deep navy/indigo with gold accent
        brand: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Primary gold
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        surface: {
          950: '#080810',
          900: '#0e0e1a',
          800: '#13131f',
          700: '#1a1a2e',
          600: '#22223b',
          500: '#2d2d4a',
          400: '#3d3d5c',
          300: '#4f4f72',
          200: '#6b6b8e',
          100: '#9898b0',
          50:  '#e8e8f0',
        },
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Semantic aliases used by UI components
        destructive: {
          DEFAULT: '#7f1d1d',
          foreground: '#fca5a5',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        input: '#1a1a2e',
        accent: {
          DEFAULT: '#1a1a2e',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#13131f',
          foreground: '#9898b0',
        },
        secondary: {
          DEFAULT: '#13131f',
          foreground: '#f8fafc',
        },
        ring: '#eab308',
        border: '#1a1a2e',
        background: '#080810',
        foreground: '#f8fafc',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0e0e1a 0%, #13131f 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-gold': '0 0 20px rgba(234, 179, 8, 0.3)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

export default config
