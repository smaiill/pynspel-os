import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'
import { Typography } from '~/ui/typography/Typography'
import style from './aside.item.module.scss'

interface AsideItemProps {
  icon?: ReactNode
  href: string
}

const AsideItem = (props: PropsWithChildren<AsideItemProps>) => {
  const { icon, children, href } = props
  return (
    <Link href={href} className={style.item}>
      {icon}
      <Typography type="secondary" variant="span">
        {children}
      </Typography>
    </Link>
  )
}

export default AsideItem
