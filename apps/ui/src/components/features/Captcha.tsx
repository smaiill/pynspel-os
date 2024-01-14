import { SkeletonBox } from '~/app/dashboard/components/Skeletons'
import { css } from '../../../styled-system/css'
import { DiscordTimestamp, DiscordUser } from '../DiscordUser'
import { FeatureLayout } from './FeatureLayout'

export const Captcha = () => {
  return (
    <FeatureLayout title="Captcha">
      <DiscordUser />

      <div className={css({ mt: '10px' })}>
        <SkeletonBox height={20} width={125} />
        <SkeletonBox height={30} width={250} />
        <SkeletonBox height={50} />
      </div>
      <img src="/pages/home/captcha.png" className={css({ mt: '15px' })} />
      <DiscordTimestamp className={css({ mt: '10px' })} />
    </FeatureLayout>
  )
}
