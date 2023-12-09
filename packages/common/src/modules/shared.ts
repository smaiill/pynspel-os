import { z } from 'zod'

export const SCHEMA_DISCORD_BUTTON_STYLE = z.number().min(1).max(4).default(1)
