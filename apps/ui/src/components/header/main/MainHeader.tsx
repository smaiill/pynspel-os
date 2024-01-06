'use client'
import { Menu, Minimize } from 'lucide-react'
import { useState } from 'react'
import { CustomLink } from '~/components/Link'
import { LocaleSelector } from '~/components/locale/LocaleSelector'
import UserConnectedHeader from '~/components/UserConnectedHeader'
import { Flex } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useUserValue } from '~/proxys/user'
import { ButtonPrimary } from '~/ui/button/Button'
import { css } from '../../../../styled-system/css'
import { Logo } from '../../branding/Logo'

const styles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 10%',
  height: '100px',
  borderBottom: 'news.grey',
  backgroundColor: 'news.backgrounds.secondary',

  '& nav': {
    '& ul': {
      display: 'flex',
      listStyle: 'none',
      gap: '25px',
      alignItems: 'center',
      fontSize: '14px',

      '& a': {
        color: 'fonts.secondary',
        transition: '0.3s',

        _hover: {
          color: 'white',
        },
      },
    },
  },
})

const navigationLinks = [
  {
    href: '/',
    locale: 'pages.home.nav.home',
  },
  {
    locale: 'pages.home.nav.dashboard',
    href: '/dashboard',
  },
] as const

const MainHeader = () => {
  const user = useUserValue()

  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className={styles}>
      <div className={css({ smDown: { display: 'none' } })}>
        <Logo href="/" />
      </div>

      <nav className={css({ smDown: { display: 'none' } })}>
        <ul>
          {navigationLinks.map((navLink, idx) => (
            <CustomLink key={idx} href={navLink.href}>
              {t(navLink.locale)}
            </CustomLink>
          ))}
        </ul>
      </nav>

      <div
        className={css({
          base: { display: 'none' },
          smDown: { display: 'block' },
        })}
      >
        <Menu
          className={css({ cursor: 'pointer' })}
          onClick={() => setIsOpen(true)}
          color="white"
        />
        <div
          className={css({
            pos: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: '999999',
            p: '25px',
            overflow: 'hidden',
            transition: '.3s, border-right 0s, height .3s ease-in-out .3s',
          })}
          style={
            isOpen
              ? {
                  width: '90%',
                  background: 'var(--colors-news-backgrounds-tertiary)',
                  borderRight: 'var(--borders-news-tertiary)',
                  zIndex: '99999999999999999',
                }
              : {
                  transition: '.3s, width .3s .3s, background .3s .3s',
                  width: '0px',
                  height: '100px',
                  zIndex: -1,
                }
          }
        >
          {isOpen ? (
            <Minimize
              onClick={() => setIsOpen(false)}
              className={css({
                cursor: 'pointer',
                float: 'right',
                rotate: '90deg',
                color: 'white',
              })}
            />
          ) : null}
          {isOpen ? <Logo /> : null}
          {isOpen ? (
            <ul
              className={css({
                display: 'flex',
                flexDir: 'column',
                gap: '10px',
                mt: '30px',
              })}
            >
              {navigationLinks.map((navLink, idx) => (
                <CustomLink key={idx} href={navLink.href}>
                  {t(navLink.locale)}
                </CustomLink>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <Flex style={{ alignItems: 'center', gap: 20 }}>
        <LocaleSelector />
        {user !== null ? (
          <UserConnectedHeader />
        ) : (
          <ButtonPrimary href={process.env.NEXT_PUBLIC_DISCORD_AUTH_URI}>
            Se connecter
          </ButtonPrimary>
        )}
      </Flex>
    </header>
  )
}

export { MainHeader }
