import { BaseEvent } from '@pynspel/px'
import { KeysToCamelCase, Guild as PynspelGuild } from '@pynspel/types'
import { db } from 'db'
import { Client, Guild } from 'discord.js'

export class GuildCreate extends BaseEvent<'guildCreate'> {
  _db = db
  constructor() {
    super('guildCreate')
  }

  public async on(client: Client, guild: Guild) {
    await this.createGuild(client, {
      name: guild.name,
      guildId: guild.id,
      avatar: guild.icon as string,
    })
  }

  private async createGuild(
    client: Client,
    guild: KeysToCamelCase<PynspelGuild>
  ) {
    try {
      const res = await this._db.createGuild(guild)

      return res
    } catch (error) {
      const _guild = await client.guilds.fetch(guild.guildId)
      console.log(`Leaving guild: ${_guild.id}`)
      // _guild.leave()
    }
  }
}
