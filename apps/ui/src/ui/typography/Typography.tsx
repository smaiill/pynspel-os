import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
} from 'react'
import { cva, cx, RecipeVariantProps } from '../../../styled-system/css'

const typo = cva({
  base: {
    color: 'white',
    fontSize: '1rem',
  },

  variants: {
    as: {
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.8rem',
        fontWeight: 400,
      },
      h3: {
        fontSize: '1.6rem',
        fontWeight: 600,
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
      danger: {
        color: 'fonts.danger',
      },
      warn: {
        color: 'fonts.warn',
      },
      special: {
        color: 'special',
      },
      'news.label': {
        color: 'news.fonts.label',
      },
      'news.primary': {
        color: 'news.fonts.primary',
      },
    },
  },
})

export type TypographyVariants = RecipeVariantProps<typeof typo>

type TypographyColors = Exclude<
  TypographyVariants extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'color']
      : never
    : never,
  undefined
>

export type TypographyElement = Exclude<
  TypographyVariants extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'as']
      : never
    : never,
  undefined
>

interface TypographyProps {
  as: TypographyElement
  color?: TypographyColors
  className?: string
  style?: CSSProperties
}

const Typography = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: PropsWithChildren<TypographyProps>, ref: ForwardedRef<any>) => {
    const {
      children,
      as: asElement,
      color = 'primary',
      className,
      ...rest
    } = props

    const Element = asElement

    const csx = cx(typo({ as: asElement, color }), className)

    return (
      <Element ref={ref} className={csx} {...rest}>
        {children}
      </Element>
    )
  }
)

export { Typography }
