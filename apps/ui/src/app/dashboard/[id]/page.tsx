'use client'
import { useProtectedRoute } from '~/hooks/useProtectedRoute'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import Aside from '../components/Aside'
import { LoadingModule } from '../components/LoadingModule'
import { SelectedServerInformation } from '../components/SelectedServerInformation'
import { useFetchGuild } from '../hooks/useFetchGuild'

export interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  useProtectedRoute()
  const { data: guildData, isLoading } = useFetchGuild(params.id)

  if (isLoading || !guildData) {
    return <LoadingModule />
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
