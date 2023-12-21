import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../../../../../styled-system/css'

type CommandProps = {
  name: string
} & PropsWithChildren<HTMLAttributes<HTMLDivElement>>
export const Command = ({ className, ...rest }: CommandProps) => {
  return (
    <div
      className={cx(
        css({
          bg: 'news.backgrounds.secondary',
          w: '100%',
          p: '10px 20px',
          border: 'news.grey',
        }),
        className
      )}
      {...rest}
    ></div>
  )
}
