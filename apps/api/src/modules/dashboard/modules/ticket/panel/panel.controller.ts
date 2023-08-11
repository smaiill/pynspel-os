import { ButtonBuilder } from '@discordjs/builders'
import { HttpStatus, Interaction, PanelApi } from '@pynspel/types'
import { Request, Response } from 'express'
import { DashboardService } from 'modules/dashboard/dashboard.service'
import { db } from 'modules/db'
import { DISCORD_BASE_API } from 'utils/constants'
import { env } from 'utils/env'
import { HttpException } from 'utils/error'

// TODO: All securitys

// ({
//   custom_id: `ticket.create.${int.id}`,
//   style: Number(int.style),
//   label: int.name,
// })
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

    const [panelWithInteractionsDb] = await db.exec(
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

    console.log(panelWithInteractionsDb)

    // TODO: Check if the user has access to the panel.
    // ? We dont need to check if the panel exists cause when the bot lefts the guild it automaticly delete it

    res.json(panelWithInteractionsDb)
  }

  public async handleGetPanels(req: Request, res: Response) {
    const { guildId } = req.params

    // TODO: Check if the user has permissions or is bot in guild.
    const panelsDb = await db.exec('SELECT * FROM panels WHERE guild_id = $1', [
      guildId,
    ])

    res.json(panelsDb)
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

  public async handleUpdatePanel(req: Request, res: Response) {
    const { panelId } = req.params
    const { name, message, channel_id } = req.body

    // TODO: Check if the bot and the user are in the guild. and that is a valid channel.

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

    // TODO: Check that the user has access to the panel.
    if (!panelId) {
      return
    }

    const query = 'DELETE FROM panel_interactions WHERE panel_id = $1'
    const query2 = 'DELETE FROM panels WHERE id = $1'

    await db.exec(query, [panelId])
    await db.exec(query2, [panelId])

    res.json({ ok: true })
  }

  public async handleGetPanelInteractions(req: Request, res: Response) {
    const query = 'SELECT * FROM panel_interactions WHERE panel_id = $1'

    const _res = await db.exec(query, [req.params.panelId])

    res.json(_res)
  }

  public async handleCreatePanelInteraction(req: Request, res: Response) {
    const { panelId } = req.params

    const { name, parent_id, style, emoji } = req.body

    // TODO: All securitys
    const query =
      'INSERT INTO panel_interactions (name, panel_id, parent_id, style, emoji) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const values = [name, panelId, parent_id, style, emoji]

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
      id: interactionId,
      name,
      parent_id,
      style,
      emoji,
    })
  }

  public async handleDeleteInteraction(req: Request, res: Response) {
    const { interactionId } = req.params

    if (!interactionId) {
      return
    }

    const query = 'DELETE FROM panel_interactions WHERE id = $1'

    await db.exec(query, [interactionId])

    res.json({ ok: true })
  }

  public async handleSendInteractionPanel(req: Request, res: Response) {
    const { panelId } = req.params
    // todo: add channel to send too in the body.

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

    if (!panelDb) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Invalid panel')
    }

    if (panelDb.interactions.length <= 0) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'You have no shit.')
    }

    if (!panelDb.channel_id) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid channel.')
    }

    const interactions = createInteractions(panelDb.interactions)

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
      throw new HttpException(404, error?.message ?? '')
    }
  }
}

export const panelController = new _PanelController()
