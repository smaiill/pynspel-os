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
      return await fetchApi(`/api/dashboard/ticket/panels/guilds/${guildId}`)
    },
  })
}

export const useFetchPanel = (panelId: string) => {
  return useQuery({
    queryKey: ['panel', panelId],
    queryFn: async () => {
      return await fetchApi(`/api/dashboard/ticket/panels/${panelId}`)
    },
  })
}
