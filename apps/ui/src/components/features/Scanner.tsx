import { HTMLAttributes, ReactNode } from 'react'
import { SkeletonBox } from '~/app/dashboard/components/Skeletons'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../../styled-system/css'
import { DiscordUser } from '../DiscordUser'
import { FeatureLayout } from './FeatureLayout'

const ScannerItem = ({
  className,
  _text,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { _text: ReactNode }) => {
  return (
    <div
      className={cx(
        css({
          pos: 'absolute',
          w: '80%',
          p: '20px',
          backdropFilter: 'blur(5px)',
          bg: 'rgba(0, 0, 0, .1)',
          border: '1px solid rgba(255, 255, 255, .1)',
        }),
        className
      )}
      {...rest}
    >
      <DiscordUser content={_text} />
    </div>
  )
}

export const Scanner = () => {
  return (
    <FeatureLayout title="Scanner" className={css({ pos: 'relative' })}>
      <ScannerItem
        _text={
          <Typography as="span">
            Guys join my server{' '}
            <Typography className={css({ display: 'inline-block' })} as="span">
              <SkeletonBox height={20} width={125} inline={true} />
            </Typography>
          </Typography>
        }
        className={css({ top: '40%', left: '15%' })}
      />
      <ScannerItem
        _text={
          <Typography as="span">
            You're all{' '}
            <Typography className={css({ display: 'inline-block' })} as="span">
              <SkeletonBox height={20} width={75} inline={true} />
            </Typography>
          </Typography>
        }
        className={css({ top: '20%', left: '10%' })}
      />
    </FeatureLayout>
  )
}
