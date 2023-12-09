import { defineTokens } from '@pandacss/dev'
import { colors } from './colors'

export const tokens = defineTokens({
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
    ...colors,
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

    news: {
      special: { value: '#5D5FEF' },
      fonts: {
        label: { value: '#606260' },
        primary: { value: '#CFD0C8' },
        'reverse.primary': {
          value: 'black',
        },
      },
      borders: {
        grey: { value: '#262626' },
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
    },
  },

  gradients: {
    decoration: {
      value: 'linear-gradient(39deg, rgba(0,0,0,1) 0%, rgba(62,62,61,1) 100%)',
    },
  },
})
