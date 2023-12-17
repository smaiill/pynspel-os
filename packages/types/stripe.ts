export type Plans = 'free' | 'premium'

export type CreatePortalApi = {
  url: string
}

export type CreateCheckoutSessionApi = {
  session: string
}

export type GuildPremiumStatus = 'active'

export type GetGuildPremiumApi =
  | {
      subscription: true
      end_date: string
      cancel_at_period_end: boolean
      status: GuildPremiumStatus
    }
  | { subscription: false }
