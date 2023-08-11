import { NextFunction, Request, Response, Router } from 'express'
import { HttpZodValidationError } from 'utils/error'
import { z } from 'zod'
import { panelController } from './panel.controller'

const router = Router()

const BUTTON_STYLE_SCHEMA = z.number().min(1).max(4).default(1)
const TICKET_PANEL_NAME = z.string().trim().min(1).max(50)

const panelSchema = z.object({
  name: TICKET_PANEL_NAME,
  guild_id: z.string().trim(),
})

const updatePanelSceham = z.object({
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

const interactionSchema = z
  .object({
    style: BUTTON_STYLE_SCHEMA,
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

const updateInteractionSchema = z.object({
  name: z.string().trim().nullable().default(null),
  parent_id: z.string().trim().nullable().default(null),
  style: BUTTON_STYLE_SCHEMA,
  emoji: z.string().nullable().default(null),
})

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log({ body: req.body })
    const schemaRes = schema.safeParse(req.body)

    console.log({ schemaRes })
    if (!schemaRes.success) {
      throw new HttpZodValidationError(
        'Invalid configuration',
        schemaRes.error.issues ?? []
      )
    }

    console.log({ parsed: schemaRes.data })
    req.body = schemaRes.data
    next()
  }
}

// Panels
router.post(
  '/',
  validate(panelSchema),
  panelController.handleCreatePanel.bind(panelController)
)

router.get('/:panelId', panelController.handleGetPanel.bind(panelController))

router.post(
  '/:panelId/send',
  panelController.handleSendInteractionPanel.bind(panelController)
)

router.put(
  '/:panelId',
  validate(updatePanelSceham),
  panelController.handleUpdatePanel.bind(panelController)
)

router.delete(
  '/:panelId',
  panelController.handleDeletePanel.bind(panelController)
)

router.get(
  '/guild/:guildId',
  panelController.handleGetPanels.bind(panelController)
)

// Interactions

router.get(
  '/:panelId/interactions',
  panelController.handleGetPanelInteractions.bind(panelController)
)

router.post(
  '/:panelId/interactions',
  validate(interactionSchema),
  panelController.handleCreatePanelInteraction.bind(panelController)
)

router.put(
  '/:panelId/interactions/:interactionId',
  validate(updateInteractionSchema),
  panelController.handleUpdatePanelInteraction.bind(panelController)
)

router.delete(
  '/:panelId/interactions/:interactionId',
  panelController.handleDeleteInteraction.bind(panelController)
)

export { router as panelRouter }
