import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { fetchApi } from '~/utils/fetchApi'

export const usePanelMutations = () => {
  const currentGuild = useCurrentGuildValue()
  const queryClient = useQueryClient()

  const updatePanel = useMutation({
    mutationFn: async ({ panelId, data }: { panelId: string; data: any }) => {
      return fetchApi(`/api/dashboard/panels/${panelId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    onSuccess(res: any, { panelId }) {
      queryClient.setQueryData(['panel', panelId], (previous: any) => {
        return {
          ...previous,
          name: res.name,
          message: res.message,
          channel_id: res.channel_id,
        }
      })
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: any) => {
          const updatedData = previous.map((panel: any) => {
            if (panel.id === res.panel_id) {
              return {
                ...panel,
                name: res.name,
                message: res.message,
                channel_id: res.channel_id,
              }
            }

            return panel
          })
          return [...updatedData]
        }
      )
    },
  })

  const deletePanel = useMutation({
    mutationFn: async (panelId: string) => {
      return fetchApi(`/api/dashboard/panels/${panelId}`, {
        method: 'DELETE',
      })
    },
    onSuccess(_, panelId) {
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: any) => {
          return previous.filter((panel: any) => panel.id !== panelId)
        }
      )

      queryClient.removeQueries(['panel', panelId])
    },
  })

  const createPanel = useMutation({
    mutationFn: async (data: any) => {
      return fetchApi('/api/dashboard/panels', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          guild_id: currentGuild?.guild_id,
        }),
      })
    },
    onSuccess(data) {
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: any) => {
          return [...previous, data]
        }
      )
    },
  })

  const sendPanel = useMutation({
    mutationFn: async (panelId: string) => {
      return fetchApi(`/api/dashboard/panels/${panelId}/send`, {
        method: 'POST',
      })
    },
  })

  return { deletePanel, updatePanel, createPanel, sendPanel }
}
