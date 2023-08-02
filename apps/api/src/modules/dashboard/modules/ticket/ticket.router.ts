import { NextFunction, Request, Response } from 'express'
import { ModuleRouter } from '../base.router'
import { ticketModuleController } from './ticket.controller'
import { db } from 'modules/db'
import * as Builders from '@discordjs/builders'
import { ButtonStyle } from 'discord-api-types/v10'
import { DISCORD_BASE_API } from 'utils/constants'
import { env } from 'utils/env'
import { TicketModuleService } from './ticket.service'
import { z } from 'zod'
import { HttpException, HttpZodValidationError } from 'utils/error'
import { HttpStatus } from '@pynspel/types'

const { router } = new ModuleRouter({
  get: ticketModuleController.getConfig.bind(ticketModuleController),
  put: ticketModuleController.updateConfig.bind(ticketModuleController),
})

const BUTTON_STYLE_SCHEMA = z.number().min(1).max(5).default(1)

const panelSchema = z.object({
  name: z.string().trim().nullable().default(null),
  guild_id: z.string().trim(),
})

const updatePanelSceham = z.object({
  message: z.string().nullable().default(null),
  name: z.string().trim().nullable().default(null),
})

const interactionSchema = z.object({
  name: z.string().trim().nullable().default(null),
  panel_id: z.string().trim(),
  parent_id: z.string().trim().nullable().default(null),
  style: BUTTON_STYLE_SCHEMA,
  emoji: z.string().nullable().default(null),
})

const updateInteractionSchema = z.object({
  name: z.string().trim().nullable().default(null),
  parent_id: z.string().trim().nullable().default(null),
  style: BUTTON_STYLE_SCHEMA,
  emoji: z.string().nullable().default(null),
})

const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schemaRes = schema.safeParse(req.body)

    if (!schemaRes.success) {
      throw new HttpZodValidationError(
        'Invalid configuration',
        schemaRes.error.issues ?? []
      )
    }

    req.body = schemaRes.data
    next()
  }
}

// Send data
router.post(
  '/panels/:panelId/send',
  ticketModuleController.handleSendInteractionPanel.bind(ticketModuleController)
)

// Interactions
router.get(
  '/panels/:panelId/interactions',
  ticketModuleController.handleGetPanelInteraction.bind(ticketModuleController)
)

router.post(
  '/panels/interactions',
  validate(interactionSchema),
  ticketModuleController.handleCreatePanelInteraction.bind(
    ticketModuleController
  )
)

router.put(
  '/panels/:panelId/interactions/:interactionId',
  validate(updateInteractionSchema),
  ticketModuleController.handleUpdatePanelInteraction.bind(
    ticketModuleController
  )
)

// panels
router.get(
  '/panels/:panelId',
  ticketModuleController.handleGetPanel.bind(ticketModuleController)
)

router.post(
  '/panels',
  validate(panelSchema),
  ticketModuleController.handleCreatePanel.bind(ticketModuleController)
)

router.put(
  '/panels/:panelId',
  validate(updatePanelSceham),
  ticketModuleController.handleUpdatePanel.bind(ticketModuleController)
)

export { router as ticketModuleRouter }
