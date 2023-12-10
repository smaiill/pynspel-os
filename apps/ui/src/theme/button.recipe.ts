import { cva, RecipeVariantProps } from '../../styled-system/css'

export const buttonRecipe = cva({
  base: {
    rounded: '10px',
    color: 'white',
    overflow: 'hidden',
    pos: 'relative',
    transition: '0.3s',
    fontSize: '13px',
    _before: {
      content: '""',
      pos: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      bg: 'rgba(0, 0, 0, 0.5)',
      height: '5px',
      transition: '.1s',
    },
    _active: {
      _enabled: {
        scale: '0.95',
      },
      _before: {
        height: '0px',
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
      outline: {
        border: '1px solid rgb(77, 76, 76)',
        rounded: '10px',

        _hover: {
          bg: 'rgb(77, 76, 76)',
        },
      },

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

    format: {
      square: {
        px: '7px',
        py: '7px',
      },

      normal: {
        px: '30px',
        py: '15px',
      },
    },
  },
})

export type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
