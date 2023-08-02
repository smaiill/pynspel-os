'use client'
import { useEffect } from 'react'
import { useGuildService } from '~/hooks/useGuildService'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { selectedGuild } from '~/proxys/dashboard'
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

  if (isLoading) {
    return 'Loading....'
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <Typography typography="h1">
          Welcome, smail. 👋 on {guildData?.name}
        </Typography>

        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
