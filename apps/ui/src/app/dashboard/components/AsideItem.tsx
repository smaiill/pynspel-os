import Link from 'next/link'
import {
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from 'react'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../../../styled-system/css'
import { useRouter } from 'next/navigation'
import { Chip } from '~/ui/chip/Chip'
import { Flex } from '~/layouts/Flex'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { useCurrentGuildValue } from '~/proxys/dashboard'

const styles = css({
  padding: '15px',
  display: 'flex',
  color: 'white',
  alignItems: 'center',
  gap: '15px',
  textDecoration: 'none',
  marginTop: '10px',
  borderRadius: '10px',
  transition: '0.3s',
  cursor: 'pointer',
  justifyContent: 'space-between',

  '&:hover': {
    backgroundColor: '#1f1f1f',
  },

  '& svg': {
    color: 'fonts.secondary',
  },
})

const globalInactive = css({
  '& svg': {
    color: 'red.500',
  },
  '& span': {
    color: 'red.500',
  },
})

type AsideItemTypes = 'module' | 'normal'

type AsideItemBase<T extends AsideItemTypes> = {
  icon?: ReactNode
  href: string
  type: T
}

type AsideItemModule = {
  globalActive: boolean
  isActiveForGuild: boolean
} & AsideItemBase<'module'>

type AsideItemNormal = AsideItemBase<'normal'>

type AsideItemProps<T extends AsideItemTypes> = T extends 'module'
  ? AsideItemModule
  : T extends 'normal'
  ? AsideItemNormal
  : never

const AsideItem = <Type extends AsideItemTypes>(
  props: PropsWithChildren<AsideItemProps<Type>>
) => {
  const { icon, children, href, type } = props
  const currentGuild = useCurrentGuildValue()
  const currentModule = window.location.pathname.split('/')[3]

  const router = useRouter()

  const handleClick = () => {
    if (type === 'module' && !props.globalActive) {
      return
    }

    router.push(`/dashboard/${currentGuild?.guild_id}/${href}`)
  }

  const isModuleAndGlobalDisabled = type === 'module' && !props.globalActive
  const currentPathIsItem = currentModule === href.slice(1, href.length)

  const handleToggleModule = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  return (
    <div
      onClick={handleClick}
      className={cx(
        styles,
        isModuleAndGlobalDisabled && globalInactive,
        currentPathIsItem && css({ bgColor: 'special' })
      )}
    >
      <Flex style={{ alignItems: 'center', gap: 10 }}>
        {/* TODO: Change color to white when selected */}
        {icon && icon}
        <Typography
          className={currentPathIsItem ? css({ color: 'white' }) : ''}
          color="secondary"
          as="span"
        >
          {children}
        </Typography>
      </Flex>
      {isModuleAndGlobalDisabled ? (
        <Chip visual="danger">Temporarly disabled</Chip>
      ) : type === 'module' ? (
        <Checkbox onClick={handleToggleModule} />
      ) : null}
    </div>
  )
}

export default AsideItem
