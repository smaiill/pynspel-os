'use client'
import { GetGuildPremiumApi } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import { FlexColumn } from '~/layouts/Flex'
import { fetchApi } from '~/utils/fetchApi'
import { SkeletonBox } from '../../components/Skeletons'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import { AlreadyPremium } from './components/AlreadyPremium'
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
        return await fetchApi(`/api/subscriptions/${params.id}`)
      },
    })

  if (isGuildLoading || isGuildPremiumLoading) {
    return <SkeletonBox />
  }

  if (!guildData || !guildPremium) {
    return null
  }

  return (
    <ModuleLayout>
      <FlexColumn
        style={{
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {guildPremium.subscription ? (
          <AlreadyPremium
            guildPremium={guildPremium}
            guildId={guildData.guild_id}
          />
        ) : (
          <PremiumChoices />
        )}
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
