import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

export const Tag = (
  props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>
) => {
  const { children, className, ...rest } = props
  return (
    <div
      className={cx(
        css({
          p: '0 6px',
          border: 'news.grey',
          bg: 'news.backgrounds.tertiary',
        }),
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
