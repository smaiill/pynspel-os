import { Elements } from '@stripe/react-stripe-js'
import { PropsWithChildren } from 'react'
import { TranslationProvider } from '~/locales/Provider'

import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51Ndy4OFtvhXI74aJNE27d2AiffCEiTRbixsoZmEe74LHPk2OrFuzHkh1qKuWfKqKNaiwZNKxTin05T3ORf8ED1lx00eHnvVkS2'

const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY)

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <TranslationProvider>
      <Elements stripe={stripe}>{children}</Elements>
    </TranslationProvider>
  )
}
