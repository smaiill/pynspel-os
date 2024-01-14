import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  presets: [],
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
      tokens: {
        fontSizes: {
          xs: { value: '.75rem' },
          sm: { value: '.875rem' },
          base: { value: '1rem' },
          lg: { value: '1.125rem' },
          xl: { value: '1.25rem' },
          '2xl': { value: '1.5rem' },
          '3xl': { value: '1.875rem' },
          '4xl': { value: '2.25rem' },
          '5xl': { value: '3rem' },
          '6xl': { value: '4rem' },
        },
        colors: {
          current: { value: 'currentColor' },
          dark: { value: '#111' },
          black: { value: '#000' },
          whiteChock: { value: '#CFD0C8' },

          gray: {
            50: { value: '#f9fafb' },
            100: { value: '#f3f4f6' },
            200: { value: '#e5e7eb' },
            300: { value: '#d1d5db' },
            400: { value: '#9ca3af' },
            500: { value: '#6b7280' },
            600: { value: '#4b5563' },
            700: { value: '#374151' },
            800: { value: '#1f2937' },
            900: { value: '#111827' },
            950: { value: '#030712' },
          },
          neutral: {
            50: { value: '#fafafa' },
            100: { value: '#f5f5f5' },
            200: { value: '#e5e5e5' },
            300: { value: '#d4d4d4' },
            400: { value: '#a3a3a3' },
            500: { value: '#737373' },
            600: { value: '#525252' },
            700: { value: '#404040' },
            800: { value: '#262626' },
            900: { value: '#171717' },
            950: { value: '#0a0a0a' },
          },
          red: {
            50: { value: '#fef2f2' },
            100: { value: '#fee2e2' },
            200: { value: '#fecaca' },
            300: { value: '#fca5a5' },
            400: { value: '#f87171' },
            500: { value: '#ef4444' },
            600: { value: '#dc2626' },
            700: { value: '#b91c1c' },
            800: { value: '#991b1b' },
            900: { value: '#7f1d1d' },
            950: { value: '#450a0a' },
          },
          orange: {
            50: { value: '#fff7ed' },
            100: { value: '#ffedd5' },
            200: { value: '#fed7aa' },
            300: { value: '#fdba74' },
            400: { value: '#fb923c' },
            500: { value: '#f97316' },
            600: { value: '#ea580c' },
            700: { value: '#c2410c' },
            800: { value: '#9a3412' },
            900: { value: '#7c2d12' },
            950: { value: '#431407' },
          },
          yellow: {
            50: { value: '#fefce8' },
            100: { value: '#fef9c3' },
            200: { value: '#fef08a' },
            300: { value: '#fde047' },
            400: { value: '#facc15' },
            500: { value: '#eab308' },
            600: { value: '#ca8a04' },
            700: { value: '#a16207' },
            800: { value: '#854d0e' },
            900: { value: '#713f12' },
            950: { value: '#422006' },
          },
          blue: {
            50: { value: '#eff6ff' },
            100: { value: '#dbeafe' },
            200: { value: '#bfdbfe' },
            300: { value: '#93c5fd' },
            400: { value: '#60a5fa' },
            500: { value: '#3b82f6' },
            600: { value: '#2563eb' },
            700: { value: '#1d4ed8' },
            800: { value: '#1e40af' },
            900: { value: '#1e3a8a' },
            950: { value: '#172554' },
          },
          blackAlpha: {
            50: { value: 'rgba(0, 0, 0, 0.04)' },
            100: { value: 'rgba(0, 0, 0, 0.06)' },
            200: { value: 'rgba(0, 0, 0, 0.08)' },
            300: { value: 'rgba(0, 0, 0, 0.16)' },
            400: { value: 'rgba(0, 0, 0, 0.24)' },
            500: { value: 'rgba(0, 0, 0, 0.36)' },
            600: { value: 'rgba(0, 0, 0, 0.48)' },
            700: { value: 'rgba(0, 0, 0, 0.64)' },
            800: { value: 'rgba(0, 0, 0, 0.80)' },
            900: { value: 'rgba(0, 0, 0, 0.92)' },
          },
          whiteAlpha: {
            50: { value: 'rgba(255, 255, 255, 0.04)' },
            100: { value: 'rgba(255, 255, 255, 0.06)' },
            200: { value: 'rgba(255, 255, 255, 0.08)' },
            300: { value: 'rgba(255, 255, 255, 0.16)' },
            400: { value: 'rgba(255, 255, 255, 0.24)' },
            500: { value: 'rgba(255, 255, 255, 0.36)' },
            600: { value: 'rgba(255, 255, 255, 0.48)' },
            700: { value: 'rgba(255, 255, 255, 0.64)' },
            800: { value: 'rgba(255, 255, 255, 0.80)' },
            900: { value: 'rgba(255, 255, 255, 0.92)' },
          },
          green: {
            50: { value: '#f0fdf4' },
            100: { value: '#dcfce7' },
            200: { value: '#bbf7d0' },
            300: { value: '#86efac' },
            400: { value: '#4ade80' },
            500: { value: '#22c55e' },
            600: { value: '#16a34a' },
            700: { value: '#15803d' },
            800: { value: '#166534' },
            900: { value: '#14532d' },
            950: { value: '#0a2f1f' },
          },

          _primary: {
            100: { value: '#14141410' },
            200: { value: '#14141420' },
            300: { value: '#14141430' },
            400: { value: '#14141440' },
            500: { value: '#14141450' },
            600: { value: '#14141460' },
            700: { value: '#14141470' },
            800: { value: '#14141480' },
            900: { value: '#14141490' },
          },
          _secondary: {
            100: { value: '#1A1A1A10' },
            200: { value: '#1A1A1A20' },
            300: { value: '#1A1A1A30' },
            400: { value: '#1A1A1A40' },
            500: { value: '#1A1A1A50' },
            600: { value: '#1A1A1A60' },
            700: { value: '#1A1A1A70' },
            800: { value: '#1A1A1A80' },
            900: { value: '#1A1A1A90' },
          },
          _tertiary: {
            100: { value: '#22222210' },
            200: { value: '#22222220' },
            300: { value: '#22222230' },
            400: { value: '#22222240' },
            500: { value: '#22222250' },
            600: { value: '#22222260' },
            700: { value: '#22222270' },
            800: { value: '#22222280' },
            900: { value: '#22222290' },
          },
          primary: { value: '#3498db' },
          danger: { value: '#dd3d59' },
          success: { value: '#3d8b2e' },
          warn: { value: '#e5871a' },
          special: {
            value: '#1e776d',
          },
          specialBg: {
            value: '#5D5FEF30',
          },
          inactive: { value: '#1f1f1f' },
          hover: {
            special: {
              value: '#17534C',
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

          news: {
            special: { value: '#195F57' },
            fonts: {
              label: { value: '#606260' },
              primary: { value: '#CFD0C8' },
              'reverse.primary': {
                value: 'black',
              },
            },
            borders: {
              grey: { value: '#262626' },
              tertiary: { value: '#2E2E2E' },
            },
            backgrounds: {
              primary: {
                value: '#141414',
              },
              secondary: {
                value: '#1A1A1A',
              },
              tertiary: {
                value: '#222222',
              },
            },
          },
        },
        borders: {
          specialDashed: {
            value: '1px dashed {colors.special}',
          },
          news: {
            grey: { value: '1px solid {colors.news.borders.grey}' },
            tertiary: { value: '1px solid {colors.news.borders.tertiary}' },
            greyDashed: { value: '1px dashed {colors.news.borders.grey}' },
            tertiaryDashed: {
              value: '1px dashed {colors.news.borders.tertiary}',
            },
          },
        },

        gradients: {
          decoration: {
            value:
              'linear-gradient(39deg, rgba(0,0,0,1) 0%, rgba(62,62,61,1) 100%)',
          },
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
