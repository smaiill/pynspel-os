'use client'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { useUserValue } from '~/proxys/user'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'
import Aside from '../components/Aside'
import { SelectedServerInformation } from '../components/SelectedServerInformation'
import { GuildDataLayout } from '../layouts/GuildDataLayout'

export interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const user = useUserValue()

  return (
    <GuildDataLayout params={params}>
      <DashboardPage>
        <Aside />
        <DashboardView>
          <Typography className={css({ mb: '6px' })} as="h2">
            Welcome, {String(user?.username)} 👋
          </Typography>
          <SelectedServerInformation />
        </DashboardView>
      </DashboardPage>
    </GuildDataLayout>
  )
}

export default page
