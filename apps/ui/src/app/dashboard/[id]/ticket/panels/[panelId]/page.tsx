'use client'
import { useEffect } from 'react'
import Aside from '~/app/dashboard/components/Aside'
import { LoadingModule } from '~/app/dashboard/components/LoadingModule'
import { useFetchGuild } from '~/app/dashboard/hooks/useFetchGuild'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { useSetCurrentPanel } from '~/proxys/ticket'
import { Tabs } from '~/ui/tabs/Tabs'
import { PanelInteractions } from '../../components/interactions/PanelInteractions'
import { useFetchPanel } from '../../hooks/useFetchPanels'
import { PanelForm } from './components/PanelForm'
import { PanelHeader } from './components/PanelHeader'

type Props = {
  params: {
    panelId: string
    id: string
  }
}

const page = (props: Props) => {
  const {
    params: { panelId, id },
  } = props
  const { data: guildData } = useFetchGuild(id)
  const { isLoading, data } = useFetchPanel(panelId)
  const setCurrentPanel = useSetCurrentPanel()
  useEffect(() => {
    setCurrentPanel(data ?? null)
  }, [data])

  if (isLoading) {
    return <LoadingModule />
  }

  if (!data || !guildData) {
    return <LoadingModule />
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <PanelHeader guildId={guildData.guild_id} panelId={panelId} />
          <Tabs>
            <Tabs.Tab label={`Edit panel`}>
              <PanelForm data={data} />
            </Tabs.Tab>
            <Tabs.Tab label="Interactions">
              <PanelInteractions interactions={data.interactions} />
            </Tabs.Tab>
          </Tabs>
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
