import { HTMLAttributes } from 'react'
import { css, cx } from '../../../styled-system/css'
import { DiscordUser } from '../DiscordUser'
import { FeatureLayout } from './FeatureLayout'

const ScannerItem = ({
  className,
  _text,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { _text: string }) => {
  return (
    <div
      className={cx(
        css({
          pos: 'absolute',
          w: '80%',
          border: '1px solid #383941',
          p: '20px',
          backdropFilter: 'blur(2px)',
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
    <FeatureLayout className={css({ pos: 'relative', overflow: 'hidden' })}>
      <ScannerItem
        _text="Guys join my server http://localhost:0000"
        className={css({ top: '40%', left: '15%' })}
      />
      <ScannerItem
        _text="You're all bastar*s"
        className={css({ top: '20%', left: '10%' })}
      />
    </FeatureLayout>
  )
}
