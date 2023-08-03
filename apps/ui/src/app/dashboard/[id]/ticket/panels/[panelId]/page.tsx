'use client'
import React from 'react'
import Aside from '~/app/dashboard/components/Aside'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { useFetchPanel } from '../../hooks/useFetchPanels'
import { PanelForm } from '../../components/PanelForm'
import { usePanelMutation } from '../hooks/usePanelMutation'
import { PanelInteractions } from '../../components/PanelInteractions'

type Props = {
  params: {
    panelId: string
  }
}
const page = (props: Props) => {
  const {
    params: { panelId },
  } = props
  const { isLoading, data } = useFetchPanel(panelId)

  if (isLoading) {
    return <h1>Loading panel...;</h1>
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <PanelForm data={data} />
          <PanelInteractions interactions={data?.interactions} />
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
