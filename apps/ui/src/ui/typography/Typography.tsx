import clsx from 'clsx'
import { ForwardedRef, forwardRef, PropsWithChildren } from 'react'

export type ITypographyValidHSNumbers = 1 | 2 | 3 | 4 | 5 | 6

export type ITypographyValidHS = `h${ITypographyValidHSNumbers}`

export type ITypographyVariants = ITypographyValidHS | 'p' | 'span'

export interface ITypography {
  variant: ITypographyVariants
  className?: string
  type?: 'secondary' | 'primary'
  style?: Record<string, string | number | object>
}

const Typography = forwardRef(
  (
    props: PropsWithChildren<ITypography>,
    ref: ForwardedRef<
      HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
    >
  ) => {
    const { variant, children, className, type = 'primary', style } = props

    const _className = clsx(
      'typo',
      `typo__${variant}`,
      className,
      `type__${type}`
    )

    if (variant === 'h1') {
      return (
        <h1
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h1>
      )
    }

    if (variant === 'h2') {
      return (
        <h2
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h2>
      )
    }

    if (variant === 'h3') {
      return (
        <h3
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h3>
      )
    }

    if (variant === 'h4') {
      return (
        <h4
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h4>
      )
    }

    if (variant === 'h5') {
      return (
        <h5
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h5>
      )
    }
    if (variant === 'h6') {
      return (
        <h6
          ref={ref as ForwardedRef<HTMLHeadingElement>}
          style={style}
          className={_className}
        >
          {children}
        </h6>
      )
    }
    if (variant === 'p') {
      return (
        <p
          ref={ref as ForwardedRef<HTMLParagraphElement>}
          style={style}
          className={_className}
        >
          {children}
        </p>
      )
    }

    if (variant === 'span') {
      return (
        <span
          ref={ref as ForwardedRef<HTMLSpanElement>}
          style={style}
          className={_className}
        >
          {children}
        </span>
      )
    }

    return null
  }
)

export { Typography }
