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
  },

  variants: {
    visual: {
      primary: {
        bg: 'linear-gradient(39deg, rgba(108,190,245,1) 0%, rgba(52,152,219,1) 100%)',
        _hover: {
          bg: 'linear-gradient(39deg, rgba(108,190,245,1) 0%, rgba(108,190,245,1) 100%)',
        },
      },
      danger: {
        bg: 'linear-gradient(39deg, rgba(241,98,123,1) 0%, rgba(221,61,89,1) 100%)',
        _hover: {
          bg: 'linear-gradient(39deg, rgba(241,98,123,1) 0%, rgba(241,98,123,1) 100%)',
        },
      },
      success: {
        bg: 'linear-gradient(39deg, rgba(93,179,77,1) 0%, rgba(61,139,46,1) 100%)',
        _hover: {
          bg: 'linear-gradient(39deg, rgba(93,179,77,1) 0%, rgba(93,179,77,1) 100%)',
        },
      },
      warn: {
        bg: 'linear-gradient(39deg, rgba(242,157,59,1) 0%, rgba(229,135,26,1) 100%)',
        _hover: {
          bg: 'linear-gradient(39deg, rgba(242,157,59,1) 0%, rgba(242,157,59,1) 100%)',
        },
      },
      special: {
        bg: 'linear-gradient(39deg, rgba(210,99,179,1) 0%, rgba(180,69,149,1) 100%)',
        _hover: {
          bg: 'linear-gradient(39deg, rgba(210,99,179,1) 0%, rgba(210,99,179,1) 100%)',
        },
      },
    },
  },
})

export type ButtonVariants = RecipeVariantProps<typeof buttonRecipe>
