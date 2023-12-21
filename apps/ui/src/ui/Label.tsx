import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

type LabelProps = {
  required?: boolean
} & HTMLAttributes<HTMLLabelElement>

export const Label = (props: PropsWithChildren<LabelProps>) => {
  const { children, className, required, ...rest } = props
  return (
    <label
      className={cx(
        css({
          color: 'news.fonts.label',
          fontSize: 'sm',
          display: 'flex',
        }),
        className
      )}
      {...rest}
    >
      {children}

      {required ? (
        <span className={css({ color: 'red.500', ml: '3px' })}>*</span>
      ) : null}
    </label>
  )
}
