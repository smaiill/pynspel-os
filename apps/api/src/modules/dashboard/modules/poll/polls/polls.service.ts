import { ButtonBuilder } from '@discordjs/builders'
import {
  CREATE_POOL_SCHEMA,
  GuildPoll,
  UPDATE_POOL_SCHEMA,
} from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import {
  APIButtonComponent,
  ButtonStyle,
  ComponentType,
  Routes,
} from 'discord-api-types/v10'
import { db } from 'modules/db'
import { discordApi } from 'utils/discord'
import { buildEmbed } from 'utils/embed'
import { HttpException } from 'utils/error'
import { lg } from 'utils/logger'
import { z } from 'zod'

export class PoolsService {
  private buildButtons(choices: string[]) {
    const payload: APIButtonComponent[] = []

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i]

      const buttonBuilder = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`poll.add.${i}`)
        .setLabel(choice)

      payload.push(buttonBuilder.toJSON())
    }

    payload.push(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`poll.clear.user`)
        .setEmoji({ name: '🗑️' })
        .toJSON()
    )

    return payload
  }

  private deleteMessage(channelId: string, messageId: string) {
    return discordApi({
      uri: Routes.channelMessage(channelId, messageId),
      method: 'DELETE',
      origin: {
        type: 'bot',
      },
    })
  }

  public async getById(id: string) {
    const [poll] = await db.exec<GuildPoll>(
      'SELECT * FROM polls WHERE id = $1',
      [id]
    )

    if (!poll) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid poll.')
    }

    return poll
  }

  public async fetchByGuild(guildId: string) {
    const items = await db.exec<
      Pick<GuildPoll, 'title' | 'content' | 'end_at' | 'id'>[]
    >('SELECT title, content, end_at, id FROM polls WHERE guild_id = $1', [
      guildId,
    ])

    if (!items) {
      return []
    }

    return items
  }

  public async createPool(
    payload: z.infer<typeof CREATE_POOL_SCHEMA>,
    guildId: string
  ) {
    const [response] = await db.exec<GuildPoll>(
      'INSERT INTO polls (title, content, allow_multiple, end_at, choices, embed, show_graph, guild_id)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        payload.title,
        payload.content,
        payload.allow_multiple,
        payload.end_at,
        payload.choices,
        JSON.stringify(payload.embed),
        payload.show_graph,
        guildId,
      ]
    )

    return response
  }

  public async updatePool(
    pollId: string,
    payload: z.infer<typeof UPDATE_POOL_SCHEMA>
  ) {
    return db.exec(
      'UPDATE polls SET content = $1, allow_multiple = $2, end_at = $3, choices = $4, embed = $5, title = $6, show_graph = $7 WHERE id = $8',
      [
        payload.content,
        payload.allow_multiple,
        payload.end_at,
        payload.choices,
        JSON.stringify(payload.embed),
        payload.title,
        payload.show_graph,
        pollId,
      ]
    )
  }

  public async delete(pollId: string) {
    return db.exec('DELETE FROM polls WHERE id = $1', [pollId])
  }

  public async send(pollId: string, channelId: string) {
    const [poll] = await db.exec<GuildPoll>(
      'SELECT * FROM polls WHERE id = $1',
      [pollId]
    )

    if (!poll) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid poll.')
    }

    if (poll.choices.length < 2) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'You need to provide at least two choices'
      )
    }

    const buildedButtons = this.buildButtons(poll.choices)
    const embed = poll.embed ? buildEmbed(poll.embed) : null

    try {
      const response = await discordApi({
        uri: Routes.channelMessages(channelId),
        method: 'POST',
        origin: {
          type: 'bot',
        },
        body: JSON.stringify({
          content: poll.content,
          components: [
            {
              type: ComponentType.ActionRow,
              components: buildedButtons,
            },
          ],
          ...(embed ? { embeds: [embed] } : {}),
        }),
      })

      db.exec(
        'UPDATE polls SET message_id = $1, channel_id = $2 WHERE id = $3',
        [response.id, channelId, pollId]
      )

      return response.id
    } catch (error) {
      const err = error as Error
      lg.error(err.message)
      throw new HttpException(HttpStatus.SERVER_ERROR, Errors.E_REPORT_ERROR)
    }
  }
}
