'use client'
import Aside from '~/app/dashboard/components/Aside'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { PanelInteractions } from '../../components/interactions/PanelInteractions'
import { PanelForm } from './components/PanelForm'
import { useFetchPanel } from '../../hooks/useFetchPanels'
import {
  useCurrentPanel,
  useCurrentPanelValue,
  useSetCurrentPanel,
} from '~/proxys/ticket'
import { useEffect } from 'react'
import { useFetchGuild } from '~/app/dashboard/hooks/useFetchGuild'
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
    return <h1>Loading panel...;</h1>
  }

  if (!data || !guildData) {
    return <h1>No data found...</h1>
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <PanelHeader panelId={panelId} />
          <PanelForm data={data} />
          <PanelInteractions interactions={data.interactions} />
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
