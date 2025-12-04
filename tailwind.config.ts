import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors from flow-design-spec.pdf
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          300: '#C7D2FE',
          500: '#4F46E5', // Primary Indigo
          600: '#4338CA',
        },
        // Secondary colors
        secondary: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4', // Cyan
          600: '#0891B2',
        },
        // Semantic colors
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981', // Green
          600: '#059669',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B', // Amber
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444', // Red
          600: '#DC2626',
        },
        // Neutral grays
        gray: {
          50: '#F9FAFB', // Surface
          100: '#F3F4F6',
          200: '#E5E7EB', // Border
          300: '#D1D5DB',
          500: '#6B7280', // Text Secondary
          900: '#111827', // Text Primary
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Mobile (default) / Desktop (lg:)
        'h1-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'h1-desktop': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'h2-mobile': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h2-desktop': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3-mobile': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'h3-desktop': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      spacing: {
        // 8pt grid system: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
        // Tailwind defaults cover these, but we ensure consistency
      },
      borderRadius: {
        'small': '6px',
        'medium': '8px',
        'large': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      screens: {
        // Mobile: 320-767px (default, no prefix)
        // Tablet: 768-1023px (md:)
        'md': '768px',
        // Desktop: 1024px+ (lg:)
        'lg': '1024px',
      },
      boxShadow: {
        'card-mobile': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card-desktop': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config


