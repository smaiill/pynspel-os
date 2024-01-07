import { MONTHLY_PRICE_ID } from '@pynspel/common'
import { Errors, HttpStatus, SavedGuild } from '@pynspel/types'
import { Request, Response, Router } from 'express'
import { DashboardService } from 'modules/dashboard/dashboard.service'
import { db } from 'modules/db'
import { MailingService } from 'modules/mailing/mailing.service'
import { MAILS_FROM } from 'modules/mailing/mailing.transporter'
import { generatePaymentFailureTemplate } from 'modules/mailing/templates/payment.failure.t'
import { Stripe } from 'stripe'
import { env } from 'utils/env'
import {
  HttpCantAccesGuildException,
  HttpException,
  HttpZodValidationError,
} from 'utils/error'
import { lg } from 'utils/logger'
import { z } from 'zod'
import { customerService } from './customer.service'
import { stripeInstance } from './stripe'

const subscriptionRoutes = Router()
const GUILD_ID_SCHEMA = z.string().trim()

const stripeMailing = new MailingService()

const createSubscriptionSchema = z.object({
  priceId: z.literal(MONTHLY_PRICE_ID),
  guildId: GUILD_ID_SCHEMA,
})

subscriptionRoutes.get('/success', (req: Request, res: Response) => {
  const { guildId } = req.params

  res.redirect(`${env.FRONT_URL}/dashboard/${guildId}/premium`)
})

subscriptionRoutes.get('/cancel', (req: Request, res: Response) => {
  const { guildId } = req.params

  res.redirect(`${env.FRONT_URL}/dashboard/${guildId}/premium`)
})

subscriptionRoutes.get('/:guildId', async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpException(HttpStatus.UNAUTHORIZED, Errors.E_UNAUTHORIZED)
  }

  const parsedData = GUILD_ID_SCHEMA.safeParse(req.params.guildId)

  if (!parsedData.success) {
    throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
  }

  const isClientInGuild = await db.isClientInGuild(parsedData.data)

  if (!isClientInGuild) {
    throw new HttpCantAccesGuildException()
  }

  const [{ owner }] = await db.exec<{ owner: string }>(
    'SELECT owner FROM guilds WHERE guild_id = $1',
    [parsedData.data]
  )

  if (owner !== req.user?.discordId) {
    throw new HttpCantAccesGuildException()
  }

  const [resDb] = await db.exec(
    'SELECT end_date, cancel_at_period_end, status FROM guilds_subscriptions WHERE guild_id = $1',
    [parsedData.data]
  )

  if (!resDb) {
    return res.json({ subscription: false })
  }

  res.json({ subscription: true, ...resDb })
})

enum StripeWebhooks {
  CheckoutSessionCompleted = 'checkout.session.completed',

  SubscriptionUpdated = 'customer.subscription.updated',
  SubscriptionDeleted = 'customer.subscription.deleted',

  InvoicePaid = 'invoice.paid',
  InvoicePaymentFailed = 'invoice.payment_failed',
}

type StripeCheckoutSessionCompleted = Stripe.Checkout.Session & {
  metadata: { guildId: string }
}

subscriptionRoutes.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] ?? ''
  const rawBody = (req as Request & { rawBody: Buffer }).rawBody
  const parsedWebhook = stripeInstance.webhooks.constructEvent(
    rawBody,
    signature,
    env.STRIPE_SECRET_WEBHOOK
  )

  switch (parsedWebhook.type) {
    case StripeWebhooks.InvoicePaymentFailed:
      {
        const sessionData = parsedWebhook.data.object as Stripe.Invoice

        if (!sessionData.subscription) {
          return
        }

        const subscriptionID =
          typeof sessionData.subscription === 'string'
            ? sessionData.subscription
            : sessionData.subscription.id

        const [subscriptionDb] = await db.exec<{ guild_id: string }>(
          'SELECT guild_id FROM guilds_subscriptions WHERE subscription_id = $1',
          [subscriptionID]
        )

        if (!subscriptionDb) {
          return
        }

        const [userDb] = await db.exec<{ email: string }>(
          'SELECT email FROM users WHERE discord_id = (SELECT owner FROM guilds WHERE guild_id = $1)',
          [subscriptionDb.guild_id]
        )

        if (!userDb) {
          lg.error(
            `User not found to send reccuring payment failure guildId ${subscriptionDb.guild_id}`
          )
        }

        await stripeMailing.sendMail({
          from: MAILS_FROM.ME,
          to: userDb.email,
          subject: 'Payment failure',
          text: generatePaymentFailureTemplate(),
        })
      }
      break
    case StripeWebhooks.CheckoutSessionCompleted:
      {
        const sessionData = parsedWebhook.data
          .object as StripeCheckoutSessionCompleted

        if (sessionData.mode !== 'subscription') {
          return res.json({ ok: true })
        }

        if (sessionData.payment_status !== 'paid') {
          return res.json({ ok: false })
        }

        const [guildDb] = await db.exec<SavedGuild>(
          'SELECT * FROM guilds WHERE guild_id = $1',
          [sessionData.metadata.guildId]
        )

        if (!guildDb) {
          throw new HttpCantAccesGuildException()
        }

        const subscriptionStripe = await stripeInstance.subscriptions.retrieve(
          (sessionData.subscription as string) ?? ''
        )

        await db.exec(
          'INSERT INTO guilds_subscriptions (guild_id, subscription_id, start_date, end_date) VALUES ($1, $2, $3, $4)',
          [
            guildDb.guild_id,
            subscriptionStripe.id,
            new Date(subscriptionStripe.current_period_start * 1000),
            new Date(subscriptionStripe.current_period_end * 1000),
          ]
        )

        await db.exec('UPDATE guilds SET plan = $1 WHERE guild_id = $2', [
          'premium',
          sessionData.metadata.guildId,
        ])
      }

      break

    case StripeWebhooks.SubscriptionDeleted:
      {
        const subscriptionData = parsedWebhook.data
          .object as Stripe.Subscription

        const [subscriptionDb] = await db.exec<{
          subscription_id: string
          guild_id: string
        }>(
          'SELECT guild_id, subscription_id FROM guilds_subscriptions WHERE subscription_id = $1',
          [subscriptionData.id]
        )

        await db.exec('UPDATE guilds SET plan = $1 WHERE guild_id = $2', [
          'free',
          subscriptionDb.guild_id,
        ])

        await db.exec(
          'DELETE FROM guilds_subscriptions WHERE subscription_id = $1',
          [subscriptionDb.subscription_id]
        )

        res.json({ ok: true })
      }

      break

    case StripeWebhooks.SubscriptionUpdated:
      {
        const subscriptionData = parsedWebhook.data
          .object as Stripe.Subscription

        const currentPeriodStart = new Date(
          subscriptionData.current_period_start * 1000
        )
        const currentPeriodEnd = new Date(
          subscriptionData.current_period_end * 1000
        )

        await db.exec(
          'UPDATE guilds_subscriptions SET cancel_at_period_end = $1, status = $2, start_date = $3, end_date = $4 WHERE subscription_id = $5',
          [
            subscriptionData.cancel_at_period_end,
            subscriptionData.status,
            currentPeriodStart,
            currentPeriodEnd,
            subscriptionData.id,
          ]
        )
      }

      break
    default:
      res.sendStatus(HttpStatus.ACCEPTED)
      break
  }
})

subscriptionRoutes.get(
  `/portal/:guildId`,
  async (req: Request, res: Response) => {
    // ? if the author is not the owner any more, handle this.
    if (!req.user) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, Errors.E_UNAUTHORIZED)
    }

    const parsedGuildId = GUILD_ID_SCHEMA.safeParse(req.params.guildId)

    if (!parsedGuildId.success) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const isClientInGuild = await db.isClientInGuild(parsedGuildId.data)

    if (!isClientInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const [{ owner }] = await db.exec<{ owner: string }>(
      'SELECT owner FROM guilds WHERE guild_id = $1',
      [parsedGuildId.data]
    )

    if (owner !== req.user?.discordId) {
      throw new HttpCantAccesGuildException()
    }

    const [userDb] = await db.exec<{ customer_id: string }>(
      'SELECT customer_id FROM users WHERE discord_id = $1',
      [req.user.discordId]
    )

    if (!userDb?.customer_id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_DATA)
    }

    const stripeCustomer = await customerService.getCustomer(userDb.customer_id)

    if (!stripeCustomer) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_DATA)
    }

    const { url } = await stripeInstance.billingPortal.sessions.create({
      customer: userDb.customer_id,
      return_url: `${env.FRONT_URL}/dashboard/${parsedGuildId.data}/premium`,
    })

    res.json({
      url,
    })
  }
)

subscriptionRoutes.post('/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params
  const { priceId } = req.body
  if (!req.user) {
    throw new HttpException(HttpStatus.UNAUTHORIZED, Errors.E_UNAUTHORIZED)
  }

  const parsedData = createSubscriptionSchema.safeParse({
    guildId,
    priceId,
  })

  if (!parsedData.success) {
    throw new HttpZodValidationError(parsedData.error.errors)
  }

  const guildDb = await DashboardService.getGuildFromDatabaseIfBotIn(
    parsedData.data.guildId
  )

  if (!guildDb) {
    throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
  }

  if (guildDb.owner !== req.user?.discordId) {
    throw new HttpCantAccesGuildException()
  }

  if (guildDb.plan !== 'free') {
    throw new HttpException(
      HttpStatus.BAD_REQUEST,
      Errors.E_ALREADY_AN_ACTIVE_PLAN
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userDb] = await db.exec<any>(
    'SELECT * FROM users WHERE discord_id = $1',
    [req.user?.discordId]
  )

  const { id } = await customerService.createOrGetCustomer(userDb.customer_id, {
    email: userDb.email,
    username: userDb.username,
    discordId: userDb.discord_id,
  })

  const session = await stripeInstance.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    success_url: `${env.API_URL}/subscription/success?guildId=${guildId}`,
    cancel_url: `${env.API_URL}/subscription/cancel?guildId=${guildId}`,
    customer: id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      guildId,
    },
  })

  res.json({ ok: true, session: session.url })
})

export { subscriptionRoutes }
