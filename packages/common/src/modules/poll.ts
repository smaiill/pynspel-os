import { z } from 'zod'
import { EMBED_SCHEMA } from './shared'

export const PollEmbedSchema = EMBED_SCHEMA.omit({ image: true })

export type GuildPoll = {
  id: string
  title: string
  content: string | null
  allow_multiple: boolean
  end_at: string | null
  guild_id: string
  created_at: string
  updated_at: string
  choices: string[]
  channel_id: string
  message_id: string
  embed: z.infer<typeof PollEmbedSchema>
  show_graph: boolean
}

const END_AT_SCHEMA = z
  .string()
  .datetime()
  .refine((v) => new Date(v) > new Date())
  .optional()
  .nullable()

export const CREATE_POOL_SCHEMA = z.object({
  title: z.string().trim().min(1),
  content: z.string().optional(),
  allow_multiple: z.boolean(),
  end_at: END_AT_SCHEMA,
  choices: z.array(z.string().trim().min(1).max(80)).default([]),
  embed: PollEmbedSchema.optional(),
  show_graph: z.boolean().default(false),
})

export const UPDATE_POOL_SCHEMA = CREATE_POOL_SCHEMA
