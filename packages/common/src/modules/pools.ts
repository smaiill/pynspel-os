import { z } from 'zod'

export type GuildPool = {
  id: string
  title: string
  description: string
  allow_multiple: boolean
  end_at: string | null
  guild_id: string
  created_at: string
  updated_at: string
  choices: string[]
  channel_id: string
  message_id: string
}

export const CREATE_POOL_SCHEMA = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  allow_multiple: z.boolean(),
  end_at: z.string().datetime().optional().nullable(),
  choices: z.array(z.string().trim().min(1).max(80)).default([]),
})

export const UPDATE_POOL_SCHEMA = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  allow_multiple: z.boolean(),
  end_at: z.string().datetime().optional().nullable(),
  choices: z.array(z.string().trim().min(1).max(80)).default([]),
})
