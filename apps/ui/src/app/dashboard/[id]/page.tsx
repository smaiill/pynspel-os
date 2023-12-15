'use client'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import Aside from '../components/Aside'
import { SelectedServerInformation } from '../components/SelectedServerInformation'
import { GuildDataLayout } from '../layouts/GuildDataLayout'

export interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  return (
    <GuildDataLayout params={params}>
      <DashboardPage>
        <Aside />
        <DashboardView>
          <SelectedServerInformation />
        </DashboardView>
      </DashboardPage>
    </GuildDataLayout>
  )
}

export default page
