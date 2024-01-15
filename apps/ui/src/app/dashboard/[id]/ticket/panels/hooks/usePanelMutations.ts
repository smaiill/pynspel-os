import { SCHEMA_UPDATE_PANEL } from '@pynspel/common'
import { PanelApi } from '@pynspel/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { fetchApi } from '~/utils/fetchApi'

type PanelMutationApi = {
  message: string | null
  name: string
  panel_id: string
  channel_id: string | null
}

export const usePanelMutations = () => {
  const currentGuild = useCurrentGuildValue()
  const queryClient = useQueryClient()

  const updatePanel = useMutation({
    mutationFn: async ({
      panelId,
      data,
    }: {
      panelId: string
      data: z.infer<typeof SCHEMA_UPDATE_PANEL>
    }) => {
      return fetchApi<PanelMutationApi>(`/api/v1/dashboard/panels/${panelId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    onSuccess(res, { panelId }) {
      queryClient.setQueryData(
        ['panel', panelId],
        (previous: PanelApi | undefined) => {
          return {
            ...(previous as PanelApi),
            name: res.name,
            message: res.message,
            channel_id: res.channel_id,
          }
        }
      )
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: Omit<PanelApi, 'interactions'>[] | undefined) => {
          const updatedData = previous?.map(
            (panel: Omit<PanelApi, 'interactions'>) => {
              if (panel.id === res.panel_id) {
                return {
                  ...panel,
                  name: res.name,
                  message: res.message,
                  channel_id: res.channel_id,
                }
              }

              return panel
            }
          )
          return [...(updatedData ?? [])]
        }
      )
    },
  })

  const deletePanel = useMutation({
    mutationFn: async (panelId: string) => {
      return fetchApi(`/api/v1/dashboard/panels/${panelId}`, {
        method: 'DELETE',
      })
    },
    onSuccess(_, panelId) {
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: Omit<PanelApi, 'interactions'>[] | undefined) => {
          return previous?.filter(
            (panel: Omit<PanelApi, 'interactions'>) => panel.id !== panelId
          )
        }
      )

      queryClient.removeQueries(['panel', panelId])
    },
  })

  const createPanel = useMutation({
    mutationFn: async (data: { name: string }) => {
      return fetchApi<Omit<PanelApi, 'interactions'>>(
        '/api/v1/dashboard/panels',
        {
          method: 'POST',
          body: JSON.stringify({
            ...data,
            guild_id: currentGuild?.guild_id,
          }),
        }
      )
    },
    onSuccess(data) {
      queryClient.setQueryData(
        ['panels', currentGuild?.guild_id],
        (previous: Omit<PanelApi, 'interactions'>[] | undefined) => {
          if (!previous) {
            return [data]
          }
          return [...(previous as Omit<PanelApi, 'interactions'>[]), data]
        }
      )
    },
  })

  const sendPanel = useMutation({
    mutationFn: async (panelId: string) => {
      return fetchApi(`/api/v1/dashboard/panels/${panelId}/send`, {
        method: 'POST',
      })
    },
  })

  return { deletePanel, updatePanel, createPanel, sendPanel }
}
