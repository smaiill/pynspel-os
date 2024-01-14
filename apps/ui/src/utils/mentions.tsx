import { PropsWithChildren } from 'react'
import { Typography, TypographyElement } from '~/ui/typography/Typography'
import { css } from '../../styled-system/css'

export const MentionUser = ({
  children,
  as,
}: PropsWithChildren<{ as: TypographyElement }>) => {
  return (
    <Typography
      className={css({
        color: '#5865F2 !important',
        bg: '#5865F210',
        p: '2px',
      })}
      as={as}
    >
      {children}
    </Typography>
  )
}
