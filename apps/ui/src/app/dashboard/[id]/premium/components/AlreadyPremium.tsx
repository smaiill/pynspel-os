import { CreatePortalApi } from '@pynspel/types'
import { useStripe } from '@stripe/react-stripe-js'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { Tag } from '~/ui/Tag'
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

export const AlreadyPremium = ({ guildId }: AlreadyPremiumProps) => {
  const { t } = useTranslation()
  const stripe = useStripe()

  const handleCreatePanel = async () => {
    if (!stripe) {
      throw new Error('Stripe error !')
    }
    const res = await fetchApi<CreatePortalApi>(
      `/api/v1/subscriptions/portal/${guildId}`,
      {
        method: 'GET',
      }
    )

    window.open(res.url, '_self')
  }

  return (
    <FlexColumn className={css({ alignItems: 'center', gap: '5px' })}>
      <Typography as="h3">
        Status:{' '}
        <Tag className={css({ display: 'inline', color: 'green.500' })}>
          {t('subscription.active')}
        </Tag>
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
