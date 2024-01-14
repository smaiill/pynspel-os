import { HTMLAttributes, PropsWithChildren } from 'react'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../../styled-system/css'

type FeatureLayoutProps = HTMLAttributes<HTMLDivElement>

export const FeatureLayout = ({
  children,
  className,
  title,
  ...rest
}: PropsWithChildren<FeatureLayoutProps> & { title: string }) => {
  return (
    <div
      className={cx(
        css({
          maxW: '550px',
          maxH: '400px',
          h: '350px',
          p: '20px 30px',
          bg: 'news.special',
          border: '1px solid rgba(255, 255, 255, .3)',
          pos: 'relative',
          backdropFilter: 'blur(5px)',
          minW: '300px',
          w: '550px',
        }),
        className
      )}
      {...rest}
    >
      <div
        className={css({
          pos: 'absolute',
          left: '-45px',
          top: '-15px',
          rotate: '-30deg',
          p: '4px 8px',
          bg: 'news.special',
          border: '1px solid rgba(255, 255, 255, .3)',
          transition: '.3s',
          smDown: {
            translate: '-50% 0',
            zIndex: '900',
            left: '50%',
          },
        })}
      >
        <Typography
          className={css({
            fontFamily: 'Days one !important',
          })}
          as="span"
        >
          {title}
        </Typography>
      </div>
      {children}
    </div>
  )
}
