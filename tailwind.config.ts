import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2D6FFF',
          gold: '#F5C518',
        },
        bg: {
          primary: '#0A0F1E',
          secondary: '#111827',
          card: '#161D2F',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
        },
        border: {
          DEFAULT: '#1F2937',
        },
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 0 0 1px rgba(45,111,255,0.3), 0 8px 32px rgba(0,0,0,0.5)',
        glow: '0 0 24px rgba(45,111,255,0.3)',
        'glow-gold': '0 0 24px rgba(245,197,24,0.3)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F5C518 0%, #d4a80a 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0F1E 0%, #111827 100%)',
        'gradient-card': 'linear-gradient(135deg, #161D2F 0%, #111827 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 45s linear infinite',
        'marquee-reverse': 'marqueeReverse 45s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}

export default config
