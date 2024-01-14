import { Elements } from '@stripe/react-stripe-js'
import { PropsWithChildren, useEffect } from 'react'
import { TranslationProvider } from '~/locales/Provider'

import { Errors, SavedUser } from '@pynspel/types'
import { loadStripe } from '@stripe/stripe-js'
import { useSearchParams } from 'next/navigation'
import { useGuildService } from '~/hooks/useGuildService'
import { useSetUserGuildsValue, useSetUserState } from '~/proxys/user'
import { fetchApi } from '~/utils/fetchApi'
import { Alert } from './dashboard/components/Alert'

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51Ndy4OFtvhXI74aJNE27d2AiffCEiTRbixsoZmEe74LHPk2OrFuzHkh1qKuWfKqKNaiwZNKxTin05T3ORf8ED1lx00eHnvVkS2'

const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY)

type OptionalErrors = {
  [K in keyof typeof Errors]?: string
}

const errors: OptionalErrors = {
  E_UNAUTHORIZED: 'You are not logged in',
  E_GENERAL: 'An error has occured',
}

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { getMutualGuilds } = useGuildService()
  const setGuilds = useSetUserGuildsValue()
  const setUser = useSetUserState()
  const { get } = useSearchParams()

  useEffect(() => {
    const handleFetchUser = async () => {
      const res = await fetchApi<SavedUser>(`/api/v1/users/me`)

      setUser(res)

      const mutualGuilds = await getMutualGuilds()

      setGuilds(mutualGuilds)
    }

    handleFetchUser()
  }, [])

  const errorQuery = get('error') as keyof typeof errors
  return (
    <TranslationProvider>
      {errorQuery ? (
        <Alert visual="danger">
          {errors[errorQuery] ? errors[errorQuery] : errors['E_GENERAL']}
        </Alert>
      ) : null}
      <Elements stripe={stripe}>{children}</Elements>
    </TranslationProvider>
  )
}
