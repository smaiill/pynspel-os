import { z } from 'zod'

export const Modules = {
  bot: 'bot',
  captcha: 'captcha',
  logging: 'logging',
} as const

export type ModulesTypes = keyof typeof Modules

/* eslint-disable  @typescript-eslint/no-explicit-any */
const modulesSchemas = {
  bot: z.object({
    name: z.string().min(3).max(20).trim().default('pynspel'),
    status: z
      .string()
      .regex(/^(idle|online|dnd)$/)
      .default('online'),
    language: z.union([z.literal('en'), z.literal('fr')]).default('en'),
  }),

  captcha: z.object({
    length: z
      .union([
        z.literal(4),
        z.literal(6),
        z.literal(8),
        z.literal('4'),
        z.literal('6'),
        z.literal('8'),
      ])
      .transform((val) => +val)
      .default(4),
    verification_channel: z.string().nullable().default(null),
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
  }),
  logging: z.object({
    channel: z.string().nullable().default(null),
    user_kick: z.boolean().default(false),
    user_ban: z.boolean().default(false),
  }),
} as const

export type InferModuleConfigType<T extends keyof typeof modulesSchemas> =
  z.infer<(typeof modulesSchemas)[T]>

export const getModuleDefaultConfig = (module: ModulesTypes) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return modulesSchemas[module].safeParse({}).data
}

export const validateModuleConfig = <M extends ModulesTypes>(
  module: M,
  config: InferModuleConfigType<M>
) => {
  const moduleConfig = modulesSchemas[module]
  const res = moduleConfig.safeParse(config)

  if (!res.success) {
    return { success: false, error: res.error.errors }
  }

  return { success: true, data: res.data }
}
