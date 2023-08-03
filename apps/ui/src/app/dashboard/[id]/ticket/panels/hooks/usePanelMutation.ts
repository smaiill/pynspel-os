import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '~/utils/fetchApi'

export const usePanelMutation = (panelId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      return await fetchApi(`/api/dashboard/ticket/panels/${panelId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    // TODO: Invalidate the key
  })
}
