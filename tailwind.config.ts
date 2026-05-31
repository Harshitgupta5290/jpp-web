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
          gold: '#F5A500',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          dark: '#0F172A',
          'dark-card': '#1E293B',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
          tertiary: '#94A3B8',
          inverse: '#F8FAFC',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        success: '#10B981',
        error:   '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
        xl: '32px',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 10px 25px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)',
        soft:        '0 2px 8px rgba(0,0,0,0.06)',
        medium:      '0 4px 16px rgba(0,0,0,0.08)',
        large:       '0 8px 32px rgba(0,0,0,0.1)',
        glow:        '0 0 32px rgba(45,111,255,0.2)',
        'glow-gold': '0 0 32px rgba(245,165,0,0.25)',
        'glow-sm':   '0 0 16px rgba(45,111,255,0.15)',
        nav:         '0 1px 0 #E2E8F0, 0 4px 16px rgba(0,0,0,0.05)',
        'dark-card': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #2D6FFF 0%, #1a4fd8 100%)',
        'gradient-gold':   'linear-gradient(135deg, #F5A500 0%, #e07b00 100%)',
        'gradient-light':  'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-dark':   'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        'dot-pattern':     'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
        'grid-pattern':    'linear-gradient(rgba(45,111,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,111,255,0.04) 1px, transparent 1px)',
      },
      animation: {
        'fade-in':        'fadeIn 0.3s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'slide-down':     'slideDown 0.3s ease-out',
        'scale-in':       'scaleIn 0.2s ease-out',
        'pulse-slow':     'pulse 3s ease-in-out infinite',
        'spin-slow':      'spin 8s linear infinite',
        'marquee':        'marquee 50s linear infinite',
        'marquee-reverse':'marqueeReverse 50s linear infinite',
        'marquee-fast':   'marquee 30s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'float-delayed':  'float 6s ease-in-out 2s infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'count-up':       'countUp 1s ease-out forwards',
        'bar-grow':       'barGrow 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:   { '0%': { opacity: '0', transform: 'translateY(-16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        marquee:     { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        marqueeReverse: { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        float:       { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        countUp:     { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        barGrow:     { '0%': { width: '0%' }, '100%': { width: 'var(--bar-width)' } },
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
