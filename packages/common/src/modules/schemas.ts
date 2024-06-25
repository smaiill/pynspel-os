import { z, ZodIssue } from 'zod'
import { TICKET_MAX_PER_USER } from './consts'

export const Modules = {
  bot: 'bot',
  captcha: 'captcha',
  logging: 'logging',
  ticket: 'ticket',
  command: 'command',
  counterRaid: 'counterRaid',
  scanner: 'scanner',
  poll: 'poll',
} as const

export const isAValidModule = (name: string): name is ModulesTypes =>
  Object.keys(Modules).includes(name)

export type ModulesTypes = keyof typeof Modules

const MAX_MUTE_MS = 432000000 // 5 days

const daysToMs = (days: number) => days * (1000 * 60 * 60 * 24)

const minutesToMs = (minutes: number) => minutes * (1000 * 60)

const checkMuteCtx = (unit: 'day' | 'minute', value: number) => {
  const ms = unit === 'day' ? daysToMs(value) : minutesToMs(value)

  const res = ms > MAX_MUTE_MS

  return !res
}

const words = z.object({
  scan: z.boolean().default(false),
  banned: z.array(z.string().trim().toLowerCase()).default([]),
  banned_exact: z.array(z.string().trim().toLowerCase()).default([]),
  action: z
    .union([
      z.literal('kick'),
      z.literal('ban'),
      z.literal('none'),
      z.literal('mute'),
    ])
    .default('none'),
  ignored_channels: z.array(z.string().trim()).default([]),
  mute_unit: z.union([z.literal('day'), z.literal('minute')]).default('minute'),
  mute_timeout: z.number().min(1).default(1),
})

export const DOMAIN_SCHEMA = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)/g)

const links = z.object({
  scan: z.boolean().default(true),
  allowed_domains: z.array(DOMAIN_SCHEMA).default(['pynspel.com']),
  action: z
    .union([
      z.literal('kick'),
      z.literal('ban'),
      z.literal('none'),
      z.literal('mute'),
    ])
    .default('none'),
  ignored_channels: z.array(z.string().trim()).default([]),
  mute_unit: z.union([z.literal('day'), z.literal('minute')]).default('minute'),
  mute_timeout: z.number().min(1).default(1),
})

// ? https://github.com/colinhacks/zod/discussions/1953#discussioncomment-4811588
function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
      return [key, undefined]
    })
  )
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
const modulesSchemas = {
  [Modules.bot]: z.object({
    name: z.string().trim().min(3).max(20).default('pynspel'),
    status: z
      .union([z.literal('dnd'), z.literal('online'), z.literal('idle')])
      .default('online'),
    language: z.union([z.literal('en'), z.literal('fr')]).default('en'),
  }),

  [Modules.captcha]: z.object({
    length: z.union([z.literal(4), z.literal(6), z.literal(8)]).default(4),
    verification_channel: z.string().trim().nullable().default(null),
    case_sensitive: z.boolean().default(false),
    has_numbers: z.boolean().default(false),
    timeout: z
      .union([
        z.literal(60), // 1 minute
        z.literal(300), // 5 minutes
        z.literal(600), // 10 minutes
      ])
      .default(60),
    role_id: z.string().nullable().default(null),
    max_retries: z.number().min(1).max(10).default(3),
  }),
  [Modules.logging]: z.object({
    channel: z.string().nullable().default(null),
    user_left: z.boolean().default(false),
    user_join: z.boolean().default(false),
    // captcha_fail: z.boolean().default(false),
  }),
  [Modules.ticket]: z.object({
    max_each_user: z.number().min(1).max(TICKET_MAX_PER_USER).default(3),
  }),
  [Modules.command]: z.object({
    kick: z.boolean().default(false),
    ban: z.boolean().default(false),
  }),
  [Modules.counterRaid]: z
    .object({
      member_threshold: z.number().min(1).default(5),
      interval: z.number().min(1).max(600).default(10),
      action: z
        .union([
          z.literal('kick'),
          z.literal('ban'),
          z.literal('none'),
          z.literal('mute'),
        ])
        .default('none'),
      action_reason: z
        .string()
        .max(100)
        .default('Raid attempt detected.')
        .nullable(),
      raid_channel_lockdown: z.boolean().default(true),
      mute_unit: z
        .union([z.literal('day'), z.literal('minute')])
        .default('minute'),
      mute_timeout: z.number().min(1).default(1),
    })
    .refine((ctx) => checkMuteCtx(ctx.mute_unit, ctx.mute_timeout), {
      message: 'This needs to be less then 5 days.',
      path: ['mute_timeout'],
    }),
  [Modules.scanner]: z.object({
    words: words
      .optional()
      .default(() => getDefaults(words))
      .refine((ctx) => checkMuteCtx(ctx.mute_unit, ctx.mute_timeout), {
        message: 'This needs to be less then 5 days.',
        path: ['mute_timeout'],
      }),
    links: links
      .optional()
      .default(() => getDefaults(links))
      .refine((ctx) => checkMuteCtx(ctx.mute_unit, ctx.mute_timeout), {
        message: 'This needs to be less then 5 days.',
        path: ['mute_timeout'],
      }),
  }),
  [Modules.poll]: z.object({
    _: z.union([z.literal(0), z.literal(1)]).default(1),
  }),
} as const

export type Commands<O = z.infer<(typeof modulesSchemas)['command']>> = {
  [K in keyof O]: K
}

export type InferModuleConfigType<T extends keyof typeof modulesSchemas> =
  z.infer<(typeof modulesSchemas)[T]>

export const getModuleDefaultConfig = <M extends ModulesTypes>(module: M) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return modulesSchemas[module].safeParse({}).data!
}

export const validateModuleConfig = <M extends ModulesTypes>(
  module: M,
  config: InferModuleConfigType<M>
):
  | { success: true; data: InferModuleConfigType<M> }
  | { success: false; error: ZodIssue[] } => {
  const moduleConfig = modulesSchemas[module]
  const res = moduleConfig.safeParse(config)

  if (!res.success) {
    return { success: false, error: res.error.errors }
  }

  return { success: true, data: res.data }
}

export const getModuleSchema = <M extends ModulesTypes>(schema: M) => {
  return modulesSchemas[schema]
}
