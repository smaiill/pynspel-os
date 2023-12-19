import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

export const Label = (
  props: PropsWithChildren<HTMLAttributes<HTMLLabelElement>>
) => {
  const { children, className, ...rest } = props
  return (
    <label className={cx(css({}), className)} {...rest}>
      {children}
    </label>
  )
}
