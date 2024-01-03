'use client'
import { Tag } from '~/ui/Tag'
import { Typography } from '~/ui/typography/Typography'
import { LoadingModule } from '../../components/LoadingModule'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(
    params.id
  )
  // const router = useRouter()
  // const { data: guildPremium, isLoading: isGuildPremiumLoading } =
  //   useQuery<GetGuildPremiumApi>({
  //     queryKey: ['premium', params.id],
  //     queryFn: async () => {
  //       return fetchApi(`/api/subscriptions/${params.id}`)
  //     },
  //   })

  // useEffect(() => {
  //   if (guildData && !guildData?.isOwner) {
  //     return router.push(`/dashboard/${guildData.guild_id}`)
  //   }
  // }, [guildData])

  if (isGuildLoading || !guildData) {
    return <LoadingModule />
  }

  // if (isGuildPremiumLoading || !guildPremium) {
  //   return <LoadingModule />
  // }

  return (
    <ModuleLayout>
      <Typography as="h1">
        <Tag>Soon...</Tag>
      </Typography>
    </ModuleLayout>
  )

  // return (
  //   <ModuleLayout>
  //     {!guildPremium.subscription || guildPremium.status !== 'active' ? (
  //       <Alert visual="info">{t('subscription.no_advantage_for_now')}</Alert>
  //     ) : null}

  //     <FlexColumn
  //       style={{
  //         gap: 10,
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         textAlign: 'center',
  //       }}
  //     >
  //       {guildPremium.subscription && guildPremium.status === 'active' ? (
  //         <>
  //           {guildPremium.cancel_at_period_end && (
  //             <CancelAtPeriodEnd endDate={new Date(guildPremium.end_date)} />
  //           )}
  //           <AlreadyPremium
  //             guildPremium={guildPremium}
  //             guildId={guildData.guild_id}
  //           />
  //         </>
  //       ) : (
  //         <PremiumChoices guildId={guildData.guild_id} />
  //       )}
  //     </FlexColumn>
  //   </ModuleLayout>
  // )
}

export default page
