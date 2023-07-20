import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'

interface AsideItemProps {
  icon?: ReactNode
  href: string
}

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

  '&:hover': {
    backgroundColor: '#1f1f1f',
  },

  '& svg': {
    color: 'fonts.secondary',
  },
})

const AsideItem = (props: PropsWithChildren<AsideItemProps>) => {
  const { icon, children, href } = props
  return (
    <Link href={href} className={styles}>
      {icon}
      <Typography color="secondary" typography="span">
        {children}
      </Typography>
    </Link>
  )
}

export default AsideItem
