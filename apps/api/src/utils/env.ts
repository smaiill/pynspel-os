import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import z from 'zod'

const _env = dotenv.config()
dotenvExpand.expand(_env)

const envSchema = z.object({
  PORT: z.string().transform(Number),
  API_URL: z.string().url(),
  DISCORD_OAUTH_CLIENT_ID: z.string(),
  DISCORD_OAUTH_SECRET: z.string(),
  DISCORD_REDIRECT_URL: z.string(),
  CRYPTION_KEY: z.string(),
  CRYPTION_IV: z.string(),
  CRYPTION_KEY_SESSION: z.string(),
  AUTH_COOKIE_NAME: z.string(),
  CORS_ORIGIN: z.string().default('*'),
  CLIENT_TOKEN: z.string(),
  DB_URI: z.string(),
  NODE_ENV: z
    .union([z.literal('production'), z.literal('developement')])
    .default('developement'),
  REDIS_URL: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_SECRET_WEBHOOK: z.string(),
  FRONT_URL: z.string().url(),
  SMTP_HOST: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  MONTHLY_PRICE_ID: z.string(),
})

export const env = envSchema.parse(process.env)
