'use client'
import Link from 'next/link'
import { LocaleSelector } from '~/components/locale/LocaleSelector'
import UserConnectedHeader from '~/components/UserConnectedHeader'
import { Flex } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useUserSnapshot } from '~/proxys/user'
import { ButtonPrimary } from '~/ui/button/Button'
import { css } from '../../../../styled-system/css'
import { Logo } from '../../branding/Logo'

const styles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 10%',
  height: '100px',
  borderBottom: '1px solid #333131',
  backgroundColor: '#191919',

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

const MainHeader = () => {
  const userSnap = useUserSnapshot()

  const { t } = useTranslation()
  return (
    <header className={styles}>
      <div>
        <Logo />
      </div>

      <nav>
        <ul>
          <Link href="/">{t('pages.home.nav.home')}</Link>
          <Link href="/dashboard">{t('pages.home.nav.dashboard')}</Link>
        </ul>
      </nav>

      <Flex style={{ alignItems: 'center', gap: 20 }}>
        <LocaleSelector />
        {userSnap.isAuthenticated ? (
          <UserConnectedHeader />
        ) : (
          <ButtonPrimary href="https://discord.com/api/oauth2/authorize?client_id=1107603401207984128&redirect_uri=http%3A%2F%2Flocalhost%3A3005%2Fapi%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds">
            Se connecter
          </ButtonPrimary>
        )}
      </Flex>
    </header>
  )
}

export { MainHeader }
