import { CreatePortalApi } from '@pynspel/types'
import { useStripe } from '@stripe/react-stripe-js'
import Image from 'next/image'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { fetchApi } from '~/utils/fetchApi'
import { css } from '../../../../../../styled-system/css'

type AlreadyPremiumProps = {
  guildId: string
  guildPremium: {
    subscription: true
    end_date: string
    cancel_at_period_end: boolean
    status: string
  }
}

export const AlreadyPremium = ({
  guildId,
  guildPremium,
}: AlreadyPremiumProps) => {
  const { t } = useTranslation()
  const stripe = useStripe()

  const handleCreatePanel = async () => {
    if (!stripe) {
      throw new Error('Stripe error !')
    }
    const res = await fetchApi<CreatePortalApi>(
      `/api/subscriptions/portal/${guildId}`,
      {
        method: 'GET',
      }
    )

    window.open(res.url, '_self')
  }

  return (
    <FlexColumn className={css({ alignItems: 'center', gap: '5px' })}>
      <Image src="/icons/crown.svg" width={100} height={100} alt="crown" />
      <Typography as="h3">Vous avez dèja le premium</Typography>
      <Typography as="h3">
        Status:{' '}
        {guildPremium.subscription ? guildPremium.status : 'No subscription'}
      </Typography>
      <ButtonPrimary
        onClick={handleCreatePanel}
        className={css({ mt: '10px' })}
      >
        {t('subscription.manage')}
      </ButtonPrimary>
    </FlexColumn>
  )
}
