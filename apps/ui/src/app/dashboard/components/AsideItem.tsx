import { usePathname, useRouter } from 'next/navigation'
import { MouseEvent, PropsWithChildren, ReactNode, useState } from 'react'
import { Flex } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonDanger, ButtonOutline, ButtonPrimary } from '~/ui/button/Button'
import { Checkbox } from '~/ui/checkbox/Checkbox'
import { Chip } from '~/ui/chip/Chip'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../../../styled-system/css'
import { useMutateModuleState } from '../hooks/modules'
import { Modal } from './modals/Modal'

const styles = css({
  p: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  textDecoration: 'none',
  mt: '5px',
  transition: '0.3s',
  justifyContent: 'space-between',
  color: 'primary',

  '&[data-disabled=false]': {
    _hover: {
      backgroundColor: 'news.backgrounds.tertiary',
      cursor: 'pointer',
    },
  },

  '&[data-disabled=true]': {
    cursor: 'not-allowed',
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
  name: string
  isActiveForGuild: boolean
  label: string
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
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { mutate } = useMutateModuleState(props.name)

  const handleClick = () => {
    if (type === 'module' && (!props.globalActive || !props.isActiveForGuild)) {
      return
    }

    router.push(`/dashboard/${currentGuild?.guild_id}/${href}`)
  }

  const isModuleAndGlobalDisabled = type === 'module' && !props.globalActive
  const isActive = props?.isActiveForGuild

  const handleToggleModule = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()

    setIsModalOpen(true)
  }

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsModalOpen(false)
  }

  const handleAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    mutate(!isActive)
    setIsModalOpen(false)
  }

  const pathName = usePathname().split('/')[3] ?? ''

  return (
    <div
      onClick={handleClick}
      className={cx(styles, isModuleAndGlobalDisabled && globalInactive)}
      data-disabled={
        isModuleAndGlobalDisabled ||
        (type === 'module' && !props.isActiveForGuild)
      }
      style={
        pathName === props.href.slice(1, props.href.length)
          ? { backgroundColor: 'var(--colors-news-backgrounds-tertiary)' }
          : {}
      }
    >
      {type === 'module' && isModalOpen ? (
        isActive ? (
          <Modal visual="normal">
            <Modal.Header
              description="Tes paramètres ne seront pas perdus, mais tu ne pourras pas utiliser le module tant que tu ne l'auras pas réactivé."
              title={`Are you sure to disable module ${props.label}`}
            />
            <Modal.Footer>
              <ButtonOutline onClick={handleCancel}>Cancel</ButtonOutline>
              <ButtonDanger onClick={handleAction}>Désactiver</ButtonDanger>
            </Modal.Footer>
          </Modal>
        ) : (
          <Modal visual="normal">
            <Modal.Header
              title={`Activer ${props.label}`}
              description="En activant le module toute les fonctionnalité seront réactiver"
            />
            <Modal.Footer>
              <ButtonOutline onClick={handleCancel}>Cancel</ButtonOutline>
              <ButtonPrimary onClick={handleAction}>Activer</ButtonPrimary>
            </Modal.Footer>
          </Modal>
        )
      ) : null}
      <Flex style={{ alignItems: 'center', gap: 10 }}>
        {icon && icon}
        <Typography color="secondary" as="span">
          {children}
        </Typography>
      </Flex>
      {isModuleAndGlobalDisabled ? (
        <Chip visual="danger">Temporarly disabled</Chip>
      ) : type === 'module' ? (
        <Checkbox size={0.8} value={isActive} onClick={handleToggleModule} />
      ) : null}
    </div>
  )
}

export default AsideItem
