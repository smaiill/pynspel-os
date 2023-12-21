import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

export const Icon = ({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div className={cx(css({}), className)} {...rest}>
      {children}
    </div>
  )
}
