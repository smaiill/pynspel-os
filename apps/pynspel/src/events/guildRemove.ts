import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Guild } from 'discord.js'
import { logger } from 'utils/logger'

export class GuildRemove extends BaseEvent<'guildDelete'> {
  _db = db
  constructor() {
    super('guildDelete')
  }

  public async on(client: Client, guild: Guild) {
    try {
      await this._db.deleteGuild({
        name: guild.name,
        guildId: guild.id,
        avatar: guild.icon as string,
      })
    } catch (error) {
      logger.error(error)
    }
  }
}
