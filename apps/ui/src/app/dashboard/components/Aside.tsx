import { Home } from 'lucide-react'
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

              if (!moduleData || !item.active) {
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
