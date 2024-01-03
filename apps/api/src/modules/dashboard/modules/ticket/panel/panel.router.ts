import {
  SCHEMA_CREATE_INTERACTION,
  SCHEMA_CREATE_PANEL,
  SCHEMA_UPDATE_INTERACTION,
  SCHEMA_UPDATE_PANEL,
} from '@pynspel/common'
import { NextFunction, Request, Response, Router } from 'express'
import { HttpZodValidationError } from 'utils/error'
import { z } from 'zod'
import { panelController } from './panel.controller'

const router = Router()

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schemaRes = schema.safeParse(req.body)

    if (!schemaRes.success) {
      throw new HttpZodValidationError(schemaRes.error.issues ?? [])
    }

    req.body = schemaRes.data
    next()
  }
}

// Panels
router.post(
  '/',
  validate(SCHEMA_CREATE_PANEL),
  panelController.handleCreatePanel.bind(panelController)
)

router.get('/:panelId', panelController.handleGetPanel.bind(panelController))

router.post(
  '/:panelId/send',
  panelController.handleSendInteractionPanel.bind(panelController)
)

router.put(
  '/:panelId',
  validate(SCHEMA_UPDATE_PANEL),
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
  validate(SCHEMA_CREATE_INTERACTION),
  panelController.handleCreatePanelInteraction.bind(panelController)
)

router.put(
  '/:panelId/interactions/:interactionId',
  validate(SCHEMA_UPDATE_INTERACTION),
  panelController.handleUpdatePanelInteraction.bind(panelController)
)

router.delete(
  '/:panelId/interactions/:interactionId',
  panelController.handleDeleteInteraction.bind(panelController)
)

export { router as panelRouter }
