import { defineConfig } from '@pandacss/dev'
import { pynspelPreset } from '@pynspel/panda'

export default defineConfig({
  preflight: true,
  presets: [pynspelPreset],
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  exclude: [],

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

      'animate-crown': {
        '0%': {
          boxShadow: '0 0 0 0 #EAC81F',
        },
        '100%': {
          boxShadow: '0 0 0 15px #EAC81F',
        },
      },
    },
  },

  outdir: 'styled-system',
})
