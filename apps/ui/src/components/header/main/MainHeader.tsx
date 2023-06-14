'use client'
import { BiHeart } from 'react-icons/bi'
import { Flex } from '~/layouts/Flex'
import { useUserSnapshot } from '~/proxys/user'
import { ButtonPrimary } from '~/ui/button/Button'
import Chips from '~/ui/chips/Chips'
import { Logo } from '../../branding/Logo'
import style from './main.header.module.scss'

const MainHeader = () => {
  const userSnap = useUserSnapshot()

  return (
    <header className={style.header}>
      <div>
        <Logo />
      </div>

      <nav className={style.nav}>
        <ul>
          <li>Home</li>
          <li>Dashboard</li>
          <li>FAQ</li>
          <li>
            <Flex
              style={{
                gap: 5,
                alignItems: 'center',
              }}
            >
              Support me
              <Chips type="error">
                <BiHeart />
              </Chips>
            </Flex>
          </li>
        </ul>
      </nav>

      <div>
        {userSnap.isAuthenticated ? (
          'Connecté'
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
