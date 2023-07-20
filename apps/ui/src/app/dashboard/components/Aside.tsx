import { BiHome } from 'react-icons/bi'
import { Logo } from '~/components/branding/Logo'
import { useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { css } from '../../../../styled-system/css'
import AsideItem from './AsideItem'
import ServerSelector from './ServerSelector'

const styles = css({
  backgroundColor: '#191919',
  width: '325px',
  overflowY: 'auto',
  maxHeight: '100vh',
  padding: '20px',
  borderRight: '1px solid #333131',

  '&::-webkit-scrollbar': {
    display: 'none',
  },

  '& header': {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },

  '& nav': {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
})

const Aside = () => {
  const { guild } = useSelectedGuildSnapshot()

  return (
    <aside className={styles}>
      <header>
        <Logo />
        {/* <ServerSelector /> */}
      </header>
      <nav>
        <AsideItem href={`/dashboard/${guild?.guild_id}`} icon={<BiHome />}>
          Tableau de bord
        </AsideItem>
        <AsideItem href={`/dashboard/${guild?.guild_id}/bot`} icon={<BiHome />}>
          Bot
        </AsideItem>
        <AsideItem
          href={`/dashboard/${guild?.guild_id}/captcha`}
          icon={<BiHome />}
        >
          Securité
        </AsideItem>
      </nav>
    </aside>
  )
}

export default Aside
