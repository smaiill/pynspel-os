import Link from 'next/link'
import { AnchorHTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

export type SocialLinkProps = {
  href: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

export const SocialLink = (props: PropsWithChildren<SocialLinkProps>) => {
  const { children, className, ...rest } = props

  return (
    <Link
      className={cx(
        className,
        css({
          p: '15px',
          border: 'news.grey',
          color: 'news.fonts.primary',
          cursor: 'pointer',
          transition: '.3s',

          _active: {
            scale: '.9',
          },

          _hover: {
            bg: 'white',
            color: 'news.fonts.reverse.primary',
          },
        })
      )}
      target="_blank"
      {...rest}
    >
      {children}
    </Link>
  )
}
