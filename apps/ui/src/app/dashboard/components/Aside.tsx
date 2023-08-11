import { BiHome } from 'react-icons/bi'
import { Logo } from '~/components/branding/Logo'
import { css } from '../../../../styled-system/css'
import AsideItem from './AsideItem'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { asideItemsData } from '~/data/aside.items'
import { useGlobalModules, useGuildModulesState } from '../hooks/modules'
import { SkeletonBox } from './Skeletons'
import { Home } from 'lucide-react'

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
    console.log()
    return Boolean(
      guildModulesState?.find(
        (element) => element.name === name && element.is_active
      )
    )
  }

  return (
    <aside className={styles}>
      <header>
        <Logo />
      </header>
      <nav>
        <AsideItem
          type="normal"
          href={`/`}
          icon={<Home strokeWidth={1.5} size={20} />}
        >
          Tableau de bord
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
