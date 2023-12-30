'use client'
import { useProtectedRoute } from '~/hooks/useProtectedRoute'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { useUserValue } from '~/proxys/user'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'
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
  const user = useUserValue()
  const { data: guildData, isLoading } = useFetchGuild(params.id)

  if (isLoading || !guildData) {
    return <LoadingModule />
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <Typography className={css({ mb: '6px' })} as="h2">
          Welcome, {String(user?.username)} 👋
        </Typography>
        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
