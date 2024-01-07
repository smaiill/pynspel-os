import { BaseEvent } from '@pynspel/px'
import { Guild as PynspelGuild } from '@pynspel/types'
import { db } from 'db'
import { Client, Guild } from 'discord.js'
import { env } from 'utils/env'
import { logger } from 'utils/logger'

export class GuildCreate extends BaseEvent<'guildCreate'> {
  _db = db
  constructor() {
    super('guildCreate')
  }

  public async on(client: Client, guild: Guild) {
    await this.handleNewGuild(client, {
      name: guild.name,
      guild_id: guild.id,
      avatar: guild.icon,
      owner: guild.ownerId,
    })
  }

  private async handleNewGuild(
    client: Client,
    guild: Omit<PynspelGuild, 'bot'>
  ) {
    try {
      const res = await this._db.handleNewGuild(guild)

      return res
    } catch (error) {
      if (env.NODE_ENV === 'developement') {
        return logger.info(
          `Should leave the guild in production ${guild.guild_id}`,
          error
        )
      }

      logger.error(error)
      const _guild = await client.guilds.fetch(guild.guild_id)
      await _guild.leave()
    }
  }
}
