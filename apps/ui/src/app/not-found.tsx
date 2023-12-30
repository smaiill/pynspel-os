'use client'
import { CustomLink } from '~/components/Link'
import { HeaderAndFooterLayout } from '~/layouts/HeaderAndFooterLayout'
import { css } from '../../styled-system/css'

const NotFound = () => {
  return (
    <HeaderAndFooterLayout>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDir: 'column',
          mb: '100px',
        })}
      >
        <img
          className={css({ height: 'auto', maxW: '750px' })}
          src="/images/404.svg"
          alt="404"
        />

        <CustomLink href="/">Go home</CustomLink>
      </div>
    </HeaderAndFooterLayout>
  )
}

export default NotFound
