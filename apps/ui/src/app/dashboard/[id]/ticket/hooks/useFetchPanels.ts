import { PanelApi } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '~/utils/fetchApi'

type TicketPanel = {
  name: string
  id: string
  message: string
}

export const useFetchPanels = (guildId: string) => {
  return useQuery<TicketPanel[]>({
    queryKey: ['panels', guildId],
    queryFn: async () => {
      return fetchApi(`/api/dashboard/panels/guild/${guildId}`)
    },
  })
}

export const useFetchPanel = (panelId: string) => {
  return useQuery<PanelApi>({
    queryKey: ['panel', panelId],
    queryFn: async () => {
      return fetchApi(`/api/dashboard/panels/${panelId}`)
    },
  })
}
