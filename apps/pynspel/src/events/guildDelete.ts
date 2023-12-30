import { BaseEvent } from '@pynspel/px'
import { db } from 'db'
import { Client, Guild } from 'discord.js'

export class GuildDelete extends BaseEvent<'guildDelete'> {
  _db = db
  constructor() {
    super('guildDelete')
  }

  public async on(_: Client, guild: Guild) {
    await this._db.deleteGuild(guild.id)
  }
}
