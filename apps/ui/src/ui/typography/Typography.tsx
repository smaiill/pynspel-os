import { ForwardedRef, forwardRef, PropsWithChildren } from 'react'
import { cva, cx, RecipeVariantProps } from '../../../styled-system/css'

const typo = cva({
  base: {
    color: 'white',
    fontSize: '1rem',
  },

  variants: {
    typography: {
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.8rem',
      },
      h3: {
        fontSize: '1.6rem',
      },
      h4: {
        fontSize: '1.4rem',
      },
      h5: {
        fontSize: '1.2rem',
      },
      h6: {
        fontSize: '1rem',
      },
      p: {
        fontSize: '1rem',
      },
      span: {
        fontSize: '1rem',
      },
    },
    color: {
      secondary: {
        color: 'fonts.secondary',
      },
      primary: {
        color: 'fonts.primary',
      },
    },
  },
})

export type TypographyVariants = RecipeVariantProps<typeof typo>

interface TypographyProps {
  typography: any
  color?: any
  style?: any
  className?: string
}

const Typography = forwardRef(
  (props: PropsWithChildren<TypographyProps>, ref: ForwardedRef<any>) => {
    const {
      children,
      typography,
      color = 'primary',
      className,
      ...rest
    } = props

    const Element = typography

    const csx = cx(typo({ typography, color }), className)

    return (
      <Element ref={ref} className={csx} {...rest}>
        {children}
      </Element>
    )
  }
)

export { Typography }
