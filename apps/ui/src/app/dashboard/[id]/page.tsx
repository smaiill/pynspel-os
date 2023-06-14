'use client'
import { useEffect } from 'react'
import { useGuildService } from '~/hooks/useGuildService'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { selectedGuild } from '~/proxys/dashboard'
import { Typography } from '~/ui/typography/Typography'
import Aside from '../components/Aside'
import { SelectedServerInformation } from '../components/SelectedServerInformation'

export interface Props {
  params: {
    id: bigint
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { getGuild } = useGuildService()

  useEffect(() => {
    const fetchGuild = async () => {
      const res = await getGuild({ guildId: id })

      selectedGuild.guild = res
    }

    fetchGuild()
  }, [])

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <Typography variant="h1">Welcome, smail. 👋</Typography>

        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
