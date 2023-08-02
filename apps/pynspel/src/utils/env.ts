import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const envSchema = z.object({
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_HOSTNAME: z.string(),
  DB_PORT: z.string().transform(Number),
  CLIENT_TOKEN: z.string(),
  DB_URI: z.string(),
  REDIS_URL: z.string(),
  NODE_ENV: z
    .union([z.literal('production'), z.literal('developement')])
    .default('developement'),
})

export const env = envSchema.parse(process.env)
