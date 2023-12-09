import Stripe from 'stripe'
import { env } from 'utils/env'

export const stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
  typescript: true,
})
