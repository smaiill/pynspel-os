import { HttpStatus } from '@pynspel/types'
import { Request, Response } from 'express'
import { HttpException } from 'utils/error'
import { TicketModuleService } from './ticket.service'
import { db } from 'modules/db'
import * as Builders from '@discordjs/builders'
import { ButtonStyle } from 'discord-api-types/v10'
import { DISCORD_BASE_API } from 'utils/constants'
import { env } from 'utils/env'

// TODO: All securitys
const createInteractions = (
  i: { name: string; id: string; style: number }[]
) => {
  const a = []
  for (const int of i) {
    const buttonBuilder = new Builders.ButtonBuilder({
      custom_id: `ticket.create.${int.id}`,
      style: Number(int.style),
      label: int.name,
    })

    a.push(buttonBuilder.toJSON())
  }

  return a
}

class _TicketModuleController {
  private _moduleService = TicketModuleService
  public async getConfig(req: Request, res: Response) {
    const { guildId } = req.params

    if (!guildId) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid guild id')
    }

    const _res = await this._moduleService.get(guildId)

    res.json(_res)
  }

  public async updateConfig(req: Request, res: Response) {
    const { guildId } = req.params

    if (!guildId || !req.body) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Invalid guild id or config'
      )
    }

    const updatedConfig = await this._moduleService.update({
      guildId: guildId,
      newConfig: req.body,
    })

    res.json(updatedConfig)
  }

  public async handleGetPanel(req: Request, res: Response) {
    const { panelId } = req.params

    const [panelWithInteractionsDb] = await db.exec(
      `
      SELECT
        p.*,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', pi.id,
            'name', pi.name,
            'parent_id', pi.parent_id,
            'panel_id', pi.panel_id,
            'emoji', pi.emoji,
            'style', pi.style
          )
        ) AS interactions
      FROM panels p
      JOIN panel_interactions pi ON p.id = pi.panel_id
      WHERE p.id = $1
      GROUP BY p.id
    `,
      [panelId]
    )

    // TODO: Check if the user has access to the panel.
    // ? We dont need to check if the panel exists cause when the bot lefts the guild it automaticly delete it

    res.json(panelWithInteractionsDb)
  }

  public async handleGetPanels(req: Request, res: Response) {
    const { guildId } = req.params

    const panelsDb = await db.exec('SELECT * FROM panels WHERE guild_id = $1', [
      guildId,
    ])

    res.json(panelsDb)
  }

  public async handleUpdatePanel(req: Request, res: Response) {
    const { panelId } = req.params
    const { name, message } = req.body

    // TODO: Check if the bot and the user are in the guild.

    await db.exec('UPDATE panels SET name = $1, message = $2 WHERE id = $3', [
      name,
      message,
      panelId,
    ])

    res.json({
      message,
      name,
      panel_id: panelId,
    })
  }

  public async handleCreatePanel(req: Request, res: Response) {
    const { name, guild_id } = req.body

    // TODO: Check if the bot and the user are in the guild.

    const [insertedPanel] = await db.exec(
      'INSERT INTO panels (name, guild_id) VALUES ($1, $2) RETURNING *',
      [name, guild_id]
    )

    res.json(insertedPanel)
  }

  public async handleGetPanelInteraction(req: Request, res: Response) {
    const query = 'SELECT * FROM panel_interactions WHERE panel_id = $1'

    const _res = await db.exec(query, [req.params.panelId])

    res.json(_res)
  }

  public async handleCreatePanelInteraction(req: Request, res: Response) {
    const { name, panel_id, parent_id, style, emoji } = req.body

    console.log({ emoji })
    const query =
      'INSERT INTO panel_interactions (name, panel_id, parent_id, style, emoji) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const values = [name, panel_id, parent_id, style, emoji]

    const [insertedInteraction] = await db.exec(query, values)

    res.json(insertedInteraction)
  }

  public async handleUpdatePanelInteraction(req: Request, res: Response) {
    const { interactionId } = req.params
    const { name, parent_id, style, emoji } = req.body

    await db.exec(
      'UPDATE panel_interactions SET name = $1, parent_id = $2, style = $3, emoji = $4 WHERE id = $5',
      [name, parent_id, style, emoji, interactionId]
    )

    res.json({
      interaction_id: interactionId,
      name,
      parent_id,
      style,
      emoji,
    })
  }

  public async handleSendInteractionPanel(req: Request, res: Response) {
    const { panelId } = req.params
    // todo: add channel to send too in the body.

    const _res = await db.exec(
      `
      SELECT * FROM panel_interactions WHERE panel_id = $1
    `,
      [panelId]
    )

    const interactions = createInteractions(_res)

    try {
      const message = await fetch(
        `${DISCORD_BASE_API}/channels/1132281945942925412/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${env.CLIENT_TOKEN}`,
          },
          body: JSON.stringify({
            content: 'This is a message with components',
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
      throw new HttpException(404, error?.message ?? '')
    }
  }
}

export const ticketModuleController = new _TicketModuleController()
