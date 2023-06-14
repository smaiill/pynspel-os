import clsx from 'clsx'
import { PropsWithChildren } from 'react'
import { Flex } from '~/layouts/Flex'
import style from './chips.module.scss'

export type ChipsProps = {
  type: 'error' | 'success' | 'warn'
}

const Chips = (props: PropsWithChildren<ChipsProps>) => {
  const { children, type } = props

  const _clsx = clsx(style.chips, style[type])
  return <Flex className={_clsx}>{children}</Flex>
}

export default Chips
