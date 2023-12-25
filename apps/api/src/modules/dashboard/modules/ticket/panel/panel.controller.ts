import { ButtonBuilder } from '@discordjs/builders'
import { Errors, HttpStatus, Interaction, PanelApi } from '@pynspel/types'
import { Request, Response } from 'express'
import { DashboardService } from 'modules/dashboard/dashboard.service'
import { db } from 'modules/db'
import { DISCORD_BASE_API } from 'utils/constants'
import { _decrypt } from 'utils/crypto'
import { env } from 'utils/env'
import { HttpCantAccesGuildException, HttpException } from 'utils/error'
import { lg } from 'utils/logger'
import { isChannelIdInArray } from '../../utils'

const createInteractions = (interactions: Interaction[]) => {
  const returnedInteractions = []

  for (const interaction of interactions) {
    const buttonBuilder = new ButtonBuilder()
      .setStyle(interaction.style)
      .setCustomId(`ticket.create.${interaction.id}`)

    if (interaction.name) {
      buttonBuilder.setLabel(interaction.name)
    }

    if (interaction.emoji) {
      buttonBuilder.setEmoji({
        name: interaction.emoji,
      })
    }

    returnedInteractions.push(buttonBuilder.toJSON())
  }

  return returnedInteractions
}

class _PanelController {
  public async handleGetPanel(req: Request, res: Response) {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const [panelWithInteractionsDb] = await db.exec<{ guild_id: string }>(
      `
      SELECT
      p.*,
      CASE
          WHEN COUNT(pi.id) = 0 THEN ARRAY[]::JSON[]
          ELSE ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', CAST(pi.id AS STRING),
              'name', pi.name,
              'parent_id', pi.parent_id,
              'panel_id', CAST(pi.panel_id AS STRING),
              'emoji', pi.emoji,
              'style', pi.style
            )
          )
        END AS interactions
      FROM panels p
      LEFT JOIN panel_interactions pi ON p.id = pi.panel_id
      WHERE p.id = $1
      GROUP BY p.id;
        `,
      [panelId]
    )

    if (!panelWithInteractionsDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const isBotInGuild = await db.isClientInGuild(
      panelWithInteractionsDb.guild_id
    )

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid guild.')
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelWithInteractionsDb.guild_id as string,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    res.json(panelWithInteractionsDb)
  }

  public async handleGetPanels(req: Request, res: Response) {
    const { guildId } = req.params

    const isBotInGuild = await db.isClientInGuild(guildId)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: guildId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const panelsDb = await db.exec('SELECT * FROM panels WHERE guild_id = $1', [
      guildId,
    ])

    res.json(panelsDb)
  }

  public async handleCreatePanel(req: Request, res: Response) {
    const { name, guild_id } = req.body

    const isBotInGuild = await db.isClientInGuild(guild_id)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const [insertedPanel] = await db.exec(
      'INSERT INTO panels (name, guild_id) VALUES ($1, $2) RETURNING *',
      [name, guild_id]
    )

    res.json(insertedPanel)
  }

  public async handleUpdatePanel(req: Request, res: Response) {
    const { panelId } = req.params
    const { name, message, channel_id } = req.body

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const panelGuildId = await this.getGuildIdUsingPanelId(panelId)

    if (!panelGuildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuildId)

    if (!isBotInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuildId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    if (channel_id) {
      const validChannels = await DashboardService.getCachedChannelsOrFresh(
        panelGuildId
      )

      if (isChannelIdInArray(validChannels, channel_id)) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          Errors.E_UNKNOWN_CHANNEL
        )
      }
    }

    await db.exec(
      'UPDATE panels SET name = $1, message = $2, channel_id = $3 WHERE id = $4',
      [name, message, channel_id, panelId]
    )

    res.json({
      message,
      name,
      panel_id: panelId,
      channel_id,
    })
  }

  public async handleDeletePanel(req: Request, res: Response) {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const [panelGuildDb] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM panels WHERE id = $1',
      [panelId]
    )

    if (!panelGuildDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuildDb.guild_id)

    if (!isBotInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuildDb.guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const query = 'DELETE FROM panel_interactions WHERE panel_id = $1'
    const query2 = 'DELETE FROM panels WHERE id = $1'

    await db.exec(query, [panelId])
    await db.exec(query2, [panelId])

    res.json({ ok: true })
  }

  public async handleGetPanelInteractions(req: Request, res: Response) {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const [panelGuildDb] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM panels WHERE id = $1',
      [panelId]
    )

    if (!panelGuildDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuildDb.guild_id)

    if (!isBotInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuildDb.guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const query = 'SELECT * FROM panel_interactions WHERE panel_id = $1'

    const _res = await db.exec(query, [req.params.panelId])

    res.json(_res)
  }

  public async handleCreatePanelInteraction(req: Request, res: Response) {
    const { panelId } = req.params

    const { name, parent_id, style, emoji } = req.body

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const [panelGuildDb] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM panels WHERE id = $1',
      [panelId]
    )

    if (!panelGuildDb) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_GUILD_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuildDb.guild_id)

    if (!isBotInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuildDb.guild_id,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const query =
      'INSERT INTO panel_interactions (name, panel_id, parent_id, style, emoji) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const values = [name, panelId, parent_id, style, emoji]

    const [insertedInteraction] = await db.exec(query, values)

    res.json(insertedInteraction)
  }

  private async getGuildIdUsingPanelId(panelId: string) {
    const [panelDb] = await db.exec<{ guild_id: string }>(
      'SELECT guild_id FROM panels WHERE id = $1',
      [panelId]
    )

    if (!panelDb || !panelDb.guild_id) {
      return null
    }

    return panelDb.guild_id
  }

  public async handleUpdatePanelInteraction(req: Request, res: Response) {
    const { panelId, interactionId } = req.params
    const { name, parent_id, style, emoji } = req.body

    if (!panelId || !interactionId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_DATA)
    }

    const panelGuilId = await this.getGuildIdUsingPanelId(panelId)

    if (!panelGuilId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuilId)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuilId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    await db.exec(
      'UPDATE panel_interactions SET name = $1, parent_id = $2, style = $3, emoji = $4 WHERE id = $5',
      [name, parent_id, style, emoji, interactionId]
    )

    res.json({
      id: interactionId,
      name,
      parent_id,
      style,
      emoji,
    })
  }

  public async handleDeleteInteraction(req: Request, res: Response) {
    const { interactionId, panelId } = req.params

    if (!panelId || !interactionId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_DATA)
    }

    const panelGuilId = await this.getGuildIdUsingPanelId(panelId)

    if (!panelGuilId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuilId)

    if (!isBotInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, Errors.E_INVALID_GUILD_ID)
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuilId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const query = 'DELETE FROM panel_interactions WHERE id = $1'

    await db.exec(query, [interactionId])

    res.json({ ok: true })
  }

  public async handleSendInteractionPanel(req: Request, res: Response) {
    const { panelId } = req.params

    if (!panelId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const panelGuilId = await this.getGuildIdUsingPanelId(panelId)

    if (!panelGuilId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_INVALID_PANEL_ID)
    }

    const isBotInGuild = await db.isClientInGuild(panelGuilId)

    if (!isBotInGuild) {
      throw new HttpCantAccesGuildException()
    }

    const userHasPermissions =
      await DashboardService.userHasPermissionsCachedOrFresh({
        userId: req.user?.discordId as string,
        guildId: panelGuilId,
        accessToken: _decrypt(req.user?.accessToken as string),
      })

    if (!userHasPermissions) {
      throw new HttpCantAccesGuildException()
    }

    const [panelDb] = await db.exec<PanelApi>(
      `
      SELECT
      p.*,
      CASE
          WHEN COUNT(pi.id) = 0 THEN ARRAY[]::JSON[]
          ELSE ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', CAST(pi.id AS STRING),
              'name', pi.name,
              'parent_id', pi.parent_id,
              'panel_id', CAST(pi.panel_id AS STRING),
              'emoji', pi.emoji,
              'style', pi.style
            )
          )
        END AS interactions
      FROM panels p
      LEFT JOIN panel_interactions pi ON p.id = pi.panel_id
      WHERE p.id = $1
      GROUP BY p.id;
    `,
      [panelId]
    )

    if (panelDb.interactions.length <= 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        Errors.E_EMPTY_INTERACTIONS
      )
    }

    if (!panelDb.channel_id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_UNKNOWN_CHANNEL)
    }

    const interactions = createInteractions(panelDb.interactions)

    const validChannels = await DashboardService.getCachedChannelsOrFresh(
      panelDb.channel_id
    )

    if (isChannelIdInArray(validChannels, panelDb.channel_id)) {
      throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_UNKNOWN_CHANNEL)
    }
    try {
      const message = await fetch(
        `${DISCORD_BASE_API}/channels/${panelDb.channel_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${env.CLIENT_TOKEN}`,
          },
          body: JSON.stringify({
            content: panelDb.message,
            components: [
              {
                type: 1,
                components: interactions,
              },
            ],
          }),
        }
      )
      const json = await message.json()

      res.json({ id: json.id })
    } catch (error) {
      const err = error as Error
      lg.error(err.message)
      throw new HttpException(HttpStatus.SERVER_ERROR, Errors.E_REPORT_ERROR)
    }
  }
}

export const panelController = new _PanelController()
