import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../../styled-system/css'

type FeatureLayoutProps = HTMLAttributes<HTMLDivElement>

export const FeatureLayout = ({
  children,
  className,

  ...rest
}: PropsWithChildren<FeatureLayoutProps>) => {
  return (
    <div
      className={cx(
        css({
          maxW: '550px',
          maxH: '400px',
          h: '350px',
          p: '20px 30px',
          bg: 'news.backgrounds.secondary',
          border: 'news.grey',
          pos: 'relative',
          backdropFilter: 'blur(5px)',
          minW: '300px',
          w: '550px',
        }),
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
