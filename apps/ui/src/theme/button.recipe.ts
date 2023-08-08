import { cva, RecipeVariantProps } from '../../styled-system/css'

export const buttonRecipe = cva({
  base: {
    rounded: '5px',
    px: '30px',
    py: '15px',
    color: 'white',

    overflow: 'hidden',
    pos: 'relative',
    transition: '0.3s',
    fontSize: '13px',
    _active: {
      _enabled: {
        scale: '0.95',
      },
    },

    _enabled: {
      cursor: 'pointer',
    },
    _disabled: {
      filter: 'grayscale(1)',
    },
  },

  variants: {
    visual: {
      premium: {
        bg: '#F1C40F30',
        border: '1px solid #F1C40F',
        color: '#F1C40F',
        rounded: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      },
      primary: {
        bg: '#007bff',
        _hover: {
          _enabled: {
            bg: '#0046FF',
          },
        },
      },
      danger: {
        bg: '#dc3545',
        _hover: {
          _enabled: {
            bg: '#741C24',
          },
        },
      },
      success: {
        bg: '#279C42',
        _hover: {
          _enabled: {
            bg: '#1E7B33',
          },
        },
      },
      warn: {
        bg: '#B98D0A',
        _hover: {
          _enabled: {
            bg: '#86670A',
          },
        },
      },
      special: {
        bg: 'special',
        _hover: {
          _enabled: {
            bg: 'hover.special',
          },
        },
      },
    },
  },
})

export type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
