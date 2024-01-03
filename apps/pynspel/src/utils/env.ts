import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
  CLIENT_TOKEN: z.string(),
  DB_URI: z.string(),
  REDIS_URL: z.string(),
  NODE_ENV: z
    .union([z.literal('production'), z.literal('developement')])
    .default('developement'),
  API: z.string().url(),
  WS: z.string(),
})

export const env = envSchema.parse(process.env)
