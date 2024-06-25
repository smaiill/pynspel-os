import { CREATE_POOL_SCHEMA } from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
import { NextFunction, Request, Response, Router } from 'express'
import { DashboardService } from 'modules/dashboard/dashboard.service'
import { db } from 'modules/db'
import { _decrypt } from 'utils/crypto'
import {
  HttpCantAccesGuildException,
  HttpException,
  HttpZodValidationError,
} from 'utils/error'
import { z } from 'zod'
import { isChannelIdInArray } from '../../utils'
import { PoolsService } from './polls.service'

const router = Router()
const pollsService = new PoolsService()

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

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid poll id')
  }

  const poll = await pollsService.getById(id)

  const isBotInGuild = await db.isClientInGuild(poll.guild_id)

  if (!isBotInGuild) {
    throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
  }

  const userHasPermissions =
    await DashboardService.userHasPermissionsCachedOrFresh({
      userId: req.user?.discordId as string,
      guildId: poll.guild_id as string,
      accessToken: _decrypt(req.user?.accessToken as string),
    })

  if (!userHasPermissions) {
    throw new HttpCantAccesGuildException()
  }

  return res.json(poll)
})

router.post(
  '/:guildId',
  validate(CREATE_POOL_SCHEMA),
  async (req: Request, res: Response) => {
    const { guildId } = req.params
    const payload = req.body

    if (!guildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const isBotInGuild = await db.isClientInGuild(guildId)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: guildId as string,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const createdPool = await pollsService.createPool(payload, guildId)

    return res.json(createdPool)
  }
)

router.put(
  '/:panelId',
  validate(CREATE_POOL_SCHEMA),
  async (req: Request, res: Response) => {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel id')
    }

    const [panel] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM polls WHERE id = $1',
      [panelId]
    )

    if (!panel) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel')
    }

    const isBotInGuild = await db.isClientInGuild(panel.guild_id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panel.guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    await pollsService.updatePool(panelId, req.body)

    return res.json(req.body)
  }
)

router.delete('/:panelId', async (req: Request, res: Response) => {
  const { panelId } = req.params

  if (!panelId) {
    throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel id')
  }

  const [panel] = await db.exec<{ guild_id: string }>(
    'SELECT guild_id FROM polls WHERE id = $1',
    [panelId]
  )

  if (!panel) {
    throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel')
  }

  const isBotInGuild = await db.isClientInGuild(panel.guild_id)

  if (!isBotInGuild) {
    throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
  }

  const userHasPermissions =
    await DashboardService.userHasPermissionsCachedOrFresh({
      userId: req.user?.discordId as string,
      guildId: panel.guild_id,
      accessToken: _decrypt(req.user?.accessToken as string),
    })

  if (!userHasPermissions) {
    throw new HttpCantAccesGuildException()
  }

  await pollsService.delete(panelId)

  return res.json({})
})

router.post(
  '/:panelId/send',
  validate(z.object({ channel_id: z.string() })),
  async (req: Request, res: Response) => {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel id')
    }

    const [panel] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM polls WHERE id = $1',
      [panelId]
    )

    if (!panel) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid panel')
    }

    const isBotInGuild = await db.isClientInGuild(panel.guild_id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panel.guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const validChannels = await DashboardService.getCachedChannelsOrFresh(
      panel.guild_id
    )

    const { channel_id } = req.body

    if (
      !isChannelIdInArray(validChannels, channel_id) ||
      validChannels.find((channel) => channel.id === channel_id)?.type !==
        ChannelType.GuildText
    ) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_UNKNOWN_CHANNEL)
    }

    await pollsService.send(panelId, channel_id)

    return res.json({})
  }
)

export { router as pollsRouter }
