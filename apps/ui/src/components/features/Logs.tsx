import { HTMLAttributes } from 'react'
import { Typography } from '~/ui/typography/Typography'
import { MentionUser } from '~/utils/mentions'
import { css, cx } from '../../../styled-system/css'
import { DiscordUser } from '../DiscordUser'
import { FeatureLayout } from './FeatureLayout'

type LogProps = HTMLAttributes<HTMLDivElement>

const Log = ({
  _type,
  className,
  ...rest
}: { _type: 'error' | 'success' } & LogProps) => {
  return (
    <div
      style={
        _type === 'error'
          ? { borderLeft: '2px solid red' }
          : { borderLeft: '2px solid green' }
      }
      className={cx(
        css({
          p: '20px',
          border: '1px solid #ADADB610',
          backdropFilter: 'blur(5px)',
        }),
        className
      )}
      {...rest}
    >
      <DiscordUser
        content={
          _type === 'error'
            ? '😔 This user joined the server.'
            : '🎊 This user joined the server.'
        }
      />
      <div
        className={css({
          display: 'flex',
          flexDir: 'column',
          mt: '20px',
          borderLeft: '3px solid #343434',
          p: '5px 30px',
          mb: '30px',
          gap: '3px',
          color: 'white',
        })}
      >
        <Typography className={css({ fontWeight: '300' })} as="span">
          Member: <MentionUser as="span">@smail</MentionUser>- ID
          [504227742678646784]
        </Typography>
        <Typography className={css({ fontWeight: '300' })} as="span">
          Member: <MentionUser as="span">@smail</MentionUser>- ID
          [504227742678646784]
        </Typography>
        <Typography className={css({ fontWeight: '300' })} as="span">
          Member: <MentionUser as="span">@smail</MentionUser>- ID
          [504227742678646784]
        </Typography>
      </div>
      <Typography
        className={css({ color: '#72767D', fontSize: '13px' })}
        as="span"
      >
        01/01/2024 00:00
      </Typography>
    </div>
  )
}

export const Logs = () => {
  return (
    <FeatureLayout className={css({ overflow: 'hidden', pos: 'relative' })}>
      <Log
        className={css({ pos: 'absolute', top: '-15%', w: '100%' })}
        _type="error"
      />
      <Log
        className={css({
          pos: 'absolute',
          left: '35%',
          top: '40%',
          w: '100%',
        })}
        _type="success"
      />
    </FeatureLayout>
  )
}
