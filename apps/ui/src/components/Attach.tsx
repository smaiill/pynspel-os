import { DISCORD_INVITATION_LINK } from '@pynspel/info'
import Link from 'next/link'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../styled-system/css'

export const Attach = () => {
  return (
    <div
      className={css({
        textAlign: 'center',
        bg: 'whiteChock',
        p: '8px 0',
      })}
    >
      <Typography className={css({ color: 'black !important' })} as="span">
        <strong>v1.0</strong>
        <svg
          viewBox="0 0 2 2"
          className={css({
            m: '0 4px',
            display: 'inline',
            h: '5px',
            w: '5px',
            fill: 'black',
          })}
          aria-hidden="true"
        >
          <circle cx="1" cy="1" r="1"></circle>
        </svg>
        Si vous rencontrez un problème, n'hésitez pas à nous{' '}
        <Link
          className={css({
            textDecoration: 'underline',
          })}
          href={DISCORD_INVITATION_LINK}
          target="_blank"
        >
          contacter
        </Link>
      </Typography>
    </div>
  )
}
