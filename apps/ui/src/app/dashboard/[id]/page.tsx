'use client'
import { useEffect } from 'react'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildState } from '~/proxys/dashboard'
import { Typography } from '~/ui/typography/Typography'
import Aside from '../components/Aside'
import { SelectedServerInformation } from '../components/SelectedServerInformation'
import { useFetchGuild } from '../hooks/useFetchGuild'

export interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading } = useFetchGuild(id)
  const [currentGuild, setCurrentGuild] = useCurrentGuildState()
  const { t } = useTranslation()

  useEffect(() => {
    setCurrentGuild(guildData)
  }, [guildData])

  if (isLoading) {
    return 'Loading....'
  }

  if (!guildData) {
    return 'Loading...'
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <Typography as="h1">
          {t('pages.guild.welcome', {
            name: guildData.name,
          })}
        </Typography>

        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
