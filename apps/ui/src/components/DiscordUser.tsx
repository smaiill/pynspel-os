import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../styled-system/css'
import { Logo } from './branding/Logo'

export const DiscordUser = ({ content }: { content?: string }) => {
  return (
    <div
      style={content ? { alignItems: 'center' } : {}}
      className={css({ display: 'flex', gap: '10px' })}
    >
      <Logo
        box={{ className: css({ rounded: '50%' }) }}
        width={35}
        height={35}
      />
      <div>
        <div
          className={css({ display: 'flex', gap: '5px', alignItems: 'center' })}
        >
          <Typography
            className={css({
              color: 'special !important',
              wordSpacing: '20px',
            })}
            as="span"
          >
            Smail
          </Typography>
          <DiscordTimestamp />
        </div>
        {content ? <Typography as="span">{content}</Typography> : null}
      </div>
    </div>
  )
}

export const DiscordTimestamp = ({ className }: { className?: string }) => {
  return (
    <Typography
      className={cx(
        css({
          color: '#72767D !important',
          fontSize: '12px !important',
        }),
        className
      )}
      as="span"
    >
      Today at 00:00
    </Typography>
  )
}
