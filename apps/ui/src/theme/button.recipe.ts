import { cva, RecipeVariantProps } from '../../styled-system/css'

export const buttonRecipe = cva({
  base: {
    color: 'white',
    overflow: 'hidden',
    pos: 'relative',
    transition: '0.3s',
    fontSize: '13px',
    // _before: {
    //   content: '""',
    //   pos: 'absolute',
    //   bottom: '0',
    //   left: '0',
    //   width: '100%',
    //   bg: 'rgba(0, 0, 0, 0.5)',
    //   height: '5px',
    //   transition: '.1s',
    // },
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
        border: 'news.tertiary',

        _hover: {
          bg: 'news.borders.tertiary',
        },
      },

      premium: {
        bg: '#F1C40F30',
        border: '1px solid #F1C40F',
        color: '#F1C40F',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      },
      primary: {
        bg: '#007bff',
        _hover: {
          _enabled: {
            bg: '#0260C6',
          },
        },
      },
      danger: {
        bg: '#dc3545',
        _hover: {
          _enabled: {
            bg: '#B72633',
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
            bg: '#A98109',
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
