import { z } from 'zod'

export const SCHEMA_DISCORD_BUTTON_STYLE = z.number().min(1).max(4).default(1)

const EMBED_FOOTER_SCHEMA = z.object({
  text: z.string().trim().min(1),
  icon_url: z.string().url().optional(),
  proxy_icon_url: z.string().url().optional(),
})

const EMBED_IMAGE_SCHEMA = z.object({
  url: z.string().url(),
  proxy_url: z.string().url().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
})

const EMBED_THUMBNAIL_SCHEMA = z.object({
  url: z.string().url(),
  proxy_url: z.string().url().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
})

const EMBED_AUTHOR_SCHEMA = z.object({
  name: z.string().trim().min(1),
  url: z.string().url().optional(),
  icon_url: z.string().url().optional(),
  proxy_icon_url: z.string().url().optional(),
})

const EMBED_FIELD_SCHEMA = z.object({
  name: z.string().trim().min(1),
  value: z.string().trim().min(1),
  inline: z.boolean().optional(),
})

export const EMBED_SCHEMA = z.object({
  title: z.string().trim().optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  timestamp: z.boolean().default(false),
  color: z.number(),
  footer: EMBED_FOOTER_SCHEMA.optional(),
  image: EMBED_IMAGE_SCHEMA.optional(),
  thumbnail: EMBED_THUMBNAIL_SCHEMA.optional(),
  author: EMBED_AUTHOR_SCHEMA.optional(),
  fields: z.array(EMBED_FIELD_SCHEMA).optional(),
})

export type PxEmbed = z.infer<typeof EMBED_SCHEMA>
