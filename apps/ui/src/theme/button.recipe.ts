import { cva, RecipeVariantProps } from '../../styled-system/css'

export const buttonRecipe = cva({
  base: {
    bg: 'red.500',
    rounded: '5px',
    px: '30px',
    py: '15px',
    color: 'white',
    cursor: 'pointer',
    overflow: 'hidden',
    pos: 'relative',
    transition: '0.3s',
    fontSize: '13px',
    _active: {
      scale: '0.95',
    },

    _disabled: {
      filter: 'grayscale(1)',
    },
  },

  variants: {
    visual: {
      primary: {
        bg: '#007bff',
        _hover: {
          bg: '#0046FF',
        },
      },
      danger: {
        bg: '#dc3545',
        _hover: {
          bg: '#741C24',
        },
      },
      success: {
        bg: '#279C42',
        _hover: {
          bg: '#1E7B33',
        },
      },
      warn: {
        bg: '#B98D0A',
        _hover: {
          bg: '#86670A',
        },
      },
      special: {
        bg: 'special',
        _hover: {
          bg: 'hover.special',
        },
      },
    },
  },
})

export type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
