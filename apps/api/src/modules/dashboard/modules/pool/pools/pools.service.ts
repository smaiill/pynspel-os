import { ButtonBuilder } from '@discordjs/builders'
import {
  CREATE_POOL_SCHEMA,
  GuildPool,
  UPDATE_POOL_SCHEMA,
} from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import { APIButtonComponent, ButtonStyle, Routes } from 'discord-api-types/v10'
import { db } from 'modules/db'
import { discordApi } from 'utils/discord'
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
        .setCustomId(`pool.add.${i}`)
        .setLabel(choice)

      payload.push(buttonBuilder.toJSON())
    }

    payload.push(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`pool.clear.user`)
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

  public async fetchByGuild(guildId: string) {
    const items = await db.exec<
      Pick<GuildPool, 'title' | 'description' | 'end_at'>[]
    >('SELECT title, description, end_at FROM pools WHERE guild_id = $1', [
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
    const [response] = await db.exec<GuildPool>(
      'INSERT INTO pools (title, description, allow_multiple, end_at, choices, guild_id)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        payload.title,
        payload.description,
        payload.allow_multiple,
        payload.end_at,
        payload.choices,
        guildId,
      ]
    )

    return response
  }

  public async updatePool(
    poolId: string,
    payload: z.infer<typeof UPDATE_POOL_SCHEMA>
  ) {
    return db.exec(
      'UPDATE pools SET title = $1, description = $2, allow_multiple = $3, end_at = $4, choices = $5 WHERE id = $6',
      [
        payload.title,
        payload.description,
        payload.allow_multiple,
        payload.end_at,
        payload.choices,
        poolId,
      ]
    )
  }

  public async delete(poolId: string) {
    return db.exec('DELETE FROM pools WHERE id = $1', [poolId])
  }

  public async send(poolId: string, channelId: string) {
    const [pool] = await db.exec<GuildPool>(
      'SELECT * FROM pools WHERE id = $1',
      [poolId]
    )

    if (!pool) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Invalid pool.')
    }

    if (pool.choices.length < 2) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'You need to provide at least two choices'
      )
    }

    const buildedButtons = this.buildButtons(pool.choices)

    try {
      const response = await discordApi({
        uri: Routes.channelMessages(channelId),
        method: 'POST',
        origin: {
          type: 'bot',
        },
        body: JSON.stringify({
          content: `# ${pool.title}\n\n${pool.description}`,
          components: [
            {
              type: 1,
              components: buildedButtons,
            },
          ],
        }),
      })

      db.exec(
        'UPDATE pools SET message_id = $1, channel_id = $2 WHERE id = $3',
        [response.id, channelId, poolId]
      )

      return response.id
    } catch (error) {
      const err = error as Error
      lg.error(err.message)
      throw new HttpException(HttpStatus.SERVER_ERROR, Errors.E_REPORT_ERROR)
    }
  }
}
