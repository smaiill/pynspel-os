import { DashboardCard } from '~/layouts/Dashboard'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { useFetchPanels } from '../hooks/useFetchPanels'
import { PanelsEmpty } from '../panels/[panelId]/components/PanelsEmpty'
import CreatePanel from './CreatePanel'
import { TicketPanel } from './TicketPanel'

export const TicketPanels = () => {
  const currentGuild = useCurrentGuildValue()

  const { isLoading, data } = useFetchPanels(currentGuild?.guild_id ?? '')

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <DashboardCard title="Panels" style={{ gap: 5 }}>
      <CreatePanel />
      {data && data.length > 0 ? (
        data.map((panel) => <TicketPanel key={panel.id} panel={panel} />)
      ) : (
        <PanelsEmpty />
      )}
    </DashboardCard>
  )
}
