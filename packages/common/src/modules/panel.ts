import { z } from 'zod'
import { SCHEMA_DISCORD_BUTTON_STYLE } from './shared'

export const SCHEMA_CREATE_INTERACTION = z
  .object({
    style: SCHEMA_DISCORD_BUTTON_STYLE,
    name: z
      .string()
      .trim()
      .max(80)
      .nullable()
      .default(null)
      .transform((val) =>
        val === null ? null : val.length === 0 ? null : val
      ),
    parent_id: z.string().trim().nullable().default(null),
    emoji: z.string().emoji().nullable().default(null),
  })
  .refine((obj) => obj.name !== null || obj.emoji !== null, {
    message: "Either 'name' or 'emoji' must have a valid value",
    path: ['name', 'emoji'],
  })

const TICKET_PANEL_NAME = z.string().trim().min(1).max(50)

export const SCHEMA_CREATE_PANEL = z.object({
  name: TICKET_PANEL_NAME,
  guild_id: z.string().trim(),
})

export const SCHEMA_UPDATE_PANEL = z.object({
  message: z
    .string()
    .max(2000)
    .nullable()
    .default(null)
    .transform((val) => (val === null ? null : val.length === 0 ? null : val)),
  name: TICKET_PANEL_NAME,
  channel_id: z
    .string()
    .min(1)
    .nullable()
    .default(null)
    .transform((val) => (val === null ? null : val.length === 0 ? null : val)),
})

export const SCHEMA_UPDATE_INTERACTION = z
  .object({
    style: SCHEMA_DISCORD_BUTTON_STYLE,
    name: z
      .string()
      .trim()
      .max(80)
      .nullable()
      .default(null)
      .transform((val) =>
        val === null ? null : val.length === 0 ? null : val
      ),
    parent_id: z.string().trim().nullable().default(null),
    emoji: z.string().emoji().nullable().default(null),
  })
  .refine((obj) => obj.name !== null || obj.emoji !== null, {
    message: "Either 'name' or 'emoji' must have a valid value",
    path: ['name', 'emoji'],
  })
