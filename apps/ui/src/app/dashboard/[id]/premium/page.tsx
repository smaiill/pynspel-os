'use client'
import { GetGuildPremiumApi } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { fetchApi } from '~/utils/fetchApi'
import { Alert } from '../../components/Alert'
import { LoadingModule } from '../../components/LoadingModule'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import { AlreadyPremium } from './components/AlreadyPremium'
import { CancelAtPeriodEnd } from './components/CancelAtPeriodEnd'
import { PremiumChoices } from './components/PremiumChoices'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(
    params.id
  )
  const { data: guildPremium, isLoading: isGuildPremiumLoading } =
    useQuery<GetGuildPremiumApi>({
      queryKey: ['premium', params.id],
      queryFn: async () => {
        return fetchApi(`/api/subscriptions/${params.id}`)
      },
    })

  const { t } = useTranslation()

  if (isGuildLoading || isGuildPremiumLoading || !guildData || !guildPremium) {
    return <LoadingModule />
  }

  return (
    <ModuleLayout>
      <Alert visual="info">{t('subscription.no_advantage_for_now')}</Alert>

      <FlexColumn
        style={{
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {guildPremium.subscription && guildPremium.status === 'active' ? (
          <>
            {guildPremium.cancel_at_period_end && (
              <CancelAtPeriodEnd endDate={new Date(guildPremium.end_date)} />
            )}
            <AlreadyPremium
              guildPremium={guildPremium}
              guildId={guildData.guild_id}
            />
          </>
        ) : (
          <PremiumChoices guildId={guildData.guild_id} />
        )}
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
