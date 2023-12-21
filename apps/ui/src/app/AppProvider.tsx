import { Elements } from '@stripe/react-stripe-js'
import { PropsWithChildren, useEffect } from 'react'
import { TranslationProvider } from '~/locales/Provider'

import { SavedUser } from '@pynspel/types'
import { loadStripe } from '@stripe/stripe-js'
import { useGuildService } from '~/hooks/useGuildService'
import { useSetUserGuildsValue, useSetUserState } from '~/proxys/user'
import { fetchApi } from '~/utils/fetchApi'

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51Ndy4OFtvhXI74aJNE27d2AiffCEiTRbixsoZmEe74LHPk2OrFuzHkh1qKuWfKqKNaiwZNKxTin05T3ORf8ED1lx00eHnvVkS2'

const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY)

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { getMutualGuilds } = useGuildService()
  const setGuilds = useSetUserGuildsValue()
  const setUser = useSetUserState()

  useEffect(() => {
    const handleFetchUser = async () => {
      const res = await fetchApi<SavedUser>(`/api/users/me`)

      setUser(res)

      const mutualGuilds = await getMutualGuilds()

      setGuilds(mutualGuilds)
    }

    handleFetchUser()
  }, [])
  return (
    <TranslationProvider>
      <Elements stripe={stripe}>{children}</Elements>
    </TranslationProvider>
  )
}
