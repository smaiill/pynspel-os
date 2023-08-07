import { BiHome } from 'react-icons/bi'
import { Logo } from '~/components/branding/Logo'
import { css } from '../../../../styled-system/css'
import AsideItem from './AsideItem'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { asideItemsData } from '~/data/aside.items'

const styles = css({
  backgroundColor: '#191919',
  width: '325px',
  overflowY: 'auto',
  maxHeight: '100vh',
  padding: '20px',
  borderRight: '1px solid #333131',
  display: 'none',
  lg: {
    display: 'block',
  },

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
  const guild = useCurrentGuildValue()

  return (
    <aside className={styles}>
      <header>
        <Logo />
      </header>
      <nav>
        {asideItemsData.map((item) => (
          <AsideItem
            key={item.link}
            href={`/${item.link}/${guild?.guild_id}`}
            icon={item.icon}
          >
            {item.label}
          </AsideItem>
        ))}
      </nav>
    </aside>
  )
}

export default Aside
