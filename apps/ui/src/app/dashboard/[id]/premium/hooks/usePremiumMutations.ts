import { CreateCheckoutSessionApi } from '@pynspel/types'
import { useMutation } from '@tanstack/react-query'
import { fetchApi } from '~/utils/fetchApi'

export const usePremiumMutations = () => {
  const createCheckoutSession = useMutation({
    mutationFn: async ({
      priceId,
      guildId,
    }: {
      priceId: string
      guildId: string
    }) =>
      await fetchApi<CreateCheckoutSessionApi>(
        `/api/v1/subscriptions/${guildId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            priceId,
          }),
        }
      ),
  })

  return { createCheckoutSession }
}
