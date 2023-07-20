'use client'
import Link from 'next/link'
import UserConnectedHeader from '~/components/UserConnectedHeader'
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

  return (
    <header className={styles}>
      <div>
        <Logo />
      </div>

      <nav>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
        </ul>
      </nav>

      <div>
        {userSnap.isAuthenticated ? (
          <UserConnectedHeader />
        ) : (
          <ButtonPrimary href="https://discord.com/api/oauth2/authorize?client_id=1107603401207984128&redirect_uri=http%3A%2F%2Flocalhost%3A3005%2Fapi%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds">
            Se connecter
          </ButtonPrimary>
        )}
      </div>
    </header>
  )
}

export { MainHeader }
