import React from 'react'
import { DashboardCard } from '~/layouts/Dashboard'
import { useFetchPanels } from '../hooks/useFetchPanels'
import { selectedGuild } from '~/proxys/dashboard'
import { PanelsEmpty } from './PanelsEmpty'
import { TicketPanel } from './TicketPanel'

export const TicketPanels = () => {
  const currentGuild = selectedGuild.guild

  const { isLoading, data } = useFetchPanels(currentGuild?.guild_id ?? '')

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <DashboardCard>
      <h1>Panels</h1>
      {data && data.length > 0 ? (
        data.map((panel) => <TicketPanel key={panel.id} panel={panel} />)
      ) : (
        <PanelsEmpty />
      )}
    </DashboardCard>
  )
}
