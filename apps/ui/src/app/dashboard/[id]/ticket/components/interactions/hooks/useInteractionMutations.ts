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
      fetchApi(`/api/dashboard/panels/${currentPanel?.id}/interactions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess(_, id) {
      queryClient.setQueryData(queryKey, (previous: any) => {
        return {
          ...previous,
          interactions: previous.interactions.filter(
            (interaction) => interaction.id !== id
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
        `/api/dashboard/panels/${currentPanel?.id}/interactions/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )
    },

    onSuccess(_, { id, payload }) {
      queryClient.setQueryData(queryKey, (previous: any) => {
        const updatedInteractions = previous.interactions.map((interaction) => {
          if (interaction.id === id) {
            // If this is the interaction we're updating, merge the payload with the existing fields.
            return { ...interaction, ...payload }
          } else {
            // Otherwise return the existing interaction as-is.
            return interaction
          }
        })

        return {
          ...previous,
          interactions: updatedInteractions,
        }
      })
    },
  })

  const createInteraction = useMutation({
    mutationFn: async (payload: CreateOrUpdateInteractionPayload) => {
      return fetchApi(
        `/api/dashboard/panels/${currentPanel?.id}/interactions`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )
    },
    onSuccess(data) {
      queryClient.setQueryData(queryKey, (previous: any) => {
        return {
          ...previous,
          interactions: [...previous.interactions, data],
        }
      })
    },
  })

  return { deleteInteraction, updateInteraction, createInteraction }
}
