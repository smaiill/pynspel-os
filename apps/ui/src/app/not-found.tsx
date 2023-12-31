'use client'
import { HeaderAndFooterLayout } from '~/layouts/HeaderAndFooterLayout'
import { ButtonPrimary } from '~/ui/button/Button'
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

        <ButtonPrimary onClick={() => (window.location = '/')}>
          Go home
        </ButtonPrimary>
      </div>
    </HeaderAndFooterLayout>
  )
}

export default NotFound
