import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
    tokens: {
      colors: {
        primary: { value: '#3498db' },
        danger: { value: '#dd3d59' },
        success: { value: '#3d8b2e' },
        warn: { value: '#e5871a' },
        special: { value: '#b44595' },
        inactive: { value: '#1f1f1f' },
        fonts: {
          primary: { value: '#ffffff' },
          secondary: { value: '#8b8787' },
          special: { value: '#b35454' },
          specialHover: { value: '#bd3838' },
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
    },
  },

  outdir: 'styled-system',
})
