import { defineConfig } from '@pandacss/dev'
import { colors } from '~/theme/colors'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    tokens: {
      colors: {
        primary: { value: '#3498db' },
        danger: { value: '#dd3d59' },
        success: { value: '#3d8b2e' },
        warn: { value: '#e5871a' },
        special: {
          value: '#5D5FEF',
        },
        specialBg: {
          value: '#5D5FEF30',
        },
        inactive: { value: '#1f1f1f' },
        hover: {
          special: {
            value: '#4849B9',
          },
        },
        fonts: {
          primary: { value: '#ffffff' },
          secondary: { value: '#8b8787' },
          danger: { value: '#b35454' },
          dangerHover: { value: '#bd3838' },
          special: { value: '{colors.special}' },
          warn: { value: '{colors.warn}' },
        },
        ...colors,
      },
      borders: {
        specialDashed: {
          value: '1px dashed {colors.special}',
        },
      },

      gradients: {
        decoration: {
          value:
            'linear-gradient(39deg, rgba(0,0,0,1) 0%, rgba(62,62,61,1) 100%)',
        },
      },
    },
    keyframes: {
      pulse: {
        '0%': {
          boxShadow: '0 0 0 0 #4DFF0030',
        },
        '100%': {
          boxShadow: '0 0 0 15px #4DFF0000',
        },
      },

      enter: {
        '0%': { transform: 'translateY(-100px)', opacity: '0' },
        '100%': { transform: 'translateY(0px)', opacity: '1' },
      },

      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },

      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
    },
  },

  outdir: 'styled-system',
})
