import { BiHome } from 'react-icons/bi'
import { Logo } from '~/components/branding/Logo'
import { useSelectedGuildSnapshot } from '~/proxys/dashboard'
import style from './aside.module.scss'
import AsideItem from './AsideItem'
import ServerSelector from './ServerSelector'

const Aside = () => {
  const { guild } = useSelectedGuildSnapshot()

  return (
    <aside className={style.aside}>
      <header>
        <Logo />
        <ServerSelector />
      </header>
      <nav>
        <AsideItem href={`/dashboard/${guild?.guild_id}`} icon={<BiHome />}>
          Tableau de bord
        </AsideItem>
        <AsideItem href={`/dashboard/${guild?.guild_id}/bot`} icon={<BiHome />}>
          Bot
        </AsideItem>
      </nav>
    </aside>
  )
}

export default Aside
