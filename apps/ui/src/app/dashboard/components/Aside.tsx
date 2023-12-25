import { Home, Menu } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '~/components/branding/Logo'
import { asideItemsData } from '~/data/aside.items'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { css } from '../../../../styled-system/css'
import { useGlobalModules, useGuildModulesState } from '../hooks/modules'
import AsideItem from './AsideItem'
import { SkeletonBox } from './Skeletons'

const styles = css({
  backgroundColor: 'news.backgrounds.secondary',
  width: '325px',
  overflowY: 'auto',
  maxHeight: '100vh',
  padding: '20px',
  borderRight: 'news.grey',
  zIndex: 999999,
  // display: 'none',
  // lg: {
  //   display: 'block',
  // },

  mdDown: {
    height: '80px',
    borderBottom: 'news.grey',
    width: '75px',
    position: 'fixed',

    '& header svg:nth-child(2)': {
      display: 'block',
    },

    '& header svg:nth-child(1)': {
      display: 'none',
    },

    '& nav': {
      display: 'none',
    },

    '&.opened': {
      width: '90%',
      height: '100vh',
      transition: '.3s, border-right 0s, height .3s ease-in-out .3s',

      '& nav': {
        display: 'block',
      },
    },

    '&.closed': {
      transition: '.3s, width .3s .3s, background .3s .3s',
    },
  },

  '&::-webkit-scrollbar': {
    display: 'none',
  },

  '& header': {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',

    '& svg:nth-child(2)': {
      display: 'none',
    },
  },

  '& nav': {
    marginTop: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
})

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false)
  const guild = useCurrentGuildValue()

  const { data: globalModules, isLoading: isGlobalModulesLoading } =
    useGlobalModules()
  const { data: guildModulesState, isLoading: isGuildModulesLoading } =
    useGuildModulesState(guild?.guild_id)

  if (isGlobalModulesLoading || isGuildModulesLoading) {
    return (
      <aside className={styles}>
        <header>
          <Logo />
        </header>
        <nav>
          <SkeletonBox />
          <SkeletonBox />
          <SkeletonBox />
        </nav>
      </aside>
    )
  }

  const isModuleActiveForGuild = (name: string) => {
    return Boolean(
      guildModulesState?.find(
        (element) => element.name === name && element.is_active
      )
    )
  }

  return (
    <aside className={`${styles} ${isOpen ? 'opened' : 'closed'}`}>
      <header>
        <Logo box={{ className: css({ mb: '10px' }) }} />
        <Menu
          onClick={() => setIsOpen((prevV) => !prevV)}
          color="white"
          className={css({ cursor: 'pointer' })}
        />
      </header>
      <nav>
        <AsideItem
          type="normal"
          href={`/`}
          icon={<Home strokeWidth={1.5} size={20} />}
        >
          Tableau de bord
        </AsideItem>
        <AsideItem
          type="normal"
          href={`/premium`}
          icon={<Home strokeWidth={1.5} size={20} />}
        >
          Premium
        </AsideItem>

        {globalModules && globalModules.length > 0
          ? globalModules.map((item) => {
              const moduleData = asideItemsData.find(
                (_item) => _item.name === item.name
              )

              if (!moduleData) {
                return null
              }

              return (
                <AsideItem
                  key={moduleData.link}
                  href={moduleData.link}
                  icon={moduleData.icon}
                  type="module"
                  globalActive={item.active}
                  isActiveForGuild={isModuleActiveForGuild(item.name)}
                  name={item.name}
                  label={moduleData.label}
                >
                  {moduleData.label}
                </AsideItem>
              )
            })
          : null}
      </nav>
    </aside>
  )
}

export default Aside
