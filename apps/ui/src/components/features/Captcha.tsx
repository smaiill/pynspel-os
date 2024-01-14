import { SkeletonBox } from '~/app/dashboard/components/Skeletons'
import { css } from '../../../styled-system/css'
import { DiscordTimestamp, DiscordUser } from '../DiscordUser'
import { FeatureLayout } from './FeatureLayout'

export const Captcha = () => {
  return (
    <FeatureLayout>
      <DiscordUser />

      <div className={css({ mt: '10px' })}>
        <SkeletonBox height={20} />
        <SkeletonBox height={30} />
        <SkeletonBox height={50} />
      </div>
      <img src="/pages/home/captcha.png" className={css({ mt: '10px' })} />
      <DiscordTimestamp className={css({ mt: '10px' })} />
    </FeatureLayout>
  )
}
