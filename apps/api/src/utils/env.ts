import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().transform(Number),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_HOSTNAME: z.string(),
  DB_PORT: z.string().transform(Number),
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
  NODE_ENV: z.string().default('developement'),
  REDIS_URL: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_SECRET_WEBHOOK: z.string(),
  FRONT_URL: z.string().url(),
  WS_PORT: z.string().transform(Number),
})

export const env = envSchema.parse(process.env)
