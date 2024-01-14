import { Interaction, PanelApi } from '@pynspel/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCurrentPanelValue } from '~/proxys/ticket'
import { fetchApi } from '~/utils/fetchApi'

export type CreateOrUpdateInteractionPayload = {
  name: string | null
  emoji: string | null
  style: number
}

export const useInteractionMutations = () => {
  const currentPanel = useCurrentPanelValue()
  const queryClient = useQueryClient()
  const queryKey = ['panel', currentPanel?.id ?? '__invalid']

  const deleteInteraction = useMutation({
    mutationFn: async (id: string) =>
      fetchApi(
        `/api/v1/dashboard/panels/${currentPanel?.id}/interactions/${id}`,
        {
          method: 'DELETE',
        }
      ),
    onSuccess(_, id) {
      queryClient.setQueryData(queryKey, (previous: PanelApi | undefined) => {
        return {
          ...(previous as PanelApi),
          interactions: [...(previous?.interactions ?? [])].filter(
            (interaction: Interaction) => interaction.id !== id
          ),
        }
      })
    },
  })

  const updateInteraction = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: CreateOrUpdateInteractionPayload
    }) => {
      return fetchApi(
        `/api/v1/dashboard/panels/${currentPanel?.id}/interactions/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )
    },

    onSuccess(_, { id, payload }) {
      queryClient.setQueryData(queryKey, (previous: PanelApi | undefined) => {
        const updatedInteractions = [...(previous?.interactions ?? [])].map(
          (interaction: Interaction) => {
            if (interaction.id === id) {
              return { ...interaction, ...payload }
            } else {
              return interaction
            }
          }
        )

        return {
          ...(previous as PanelApi),
          interactions: updatedInteractions as Interaction[],
        }
      })
    },
  })

  const createInteraction = useMutation({
    mutationFn: async (payload: CreateOrUpdateInteractionPayload) => {
      return fetchApi(
        `/api/v1/dashboard/panels/${currentPanel?.id}/interactions`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )
    },
    onSuccess(data) {
      queryClient.setQueryData(queryKey, (previous: PanelApi | undefined) => {
        return {
          ...(previous as PanelApi),
          interactions: [
            ...[previous?.interactions ?? []],
            data,
          ] as Interaction[],
        }
      })
    },
  })

  return { deleteInteraction, updateInteraction, createInteraction }
}
