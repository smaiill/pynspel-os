import { BaseEvent } from '@pynspel/px'
import { Guild as PynspelGuild, KeysToCamelCase } from '@pynspel/types'
import { db } from 'db'
import { Client, Guild } from 'discord.js'
import { env } from 'utils/env'

export class GuildRemove extends BaseEvent<'guildDelete'> {
  _db = db
  constructor() {
    super('guildDelete')
  }

  public async on(client: Client, guild: Guild) {
    await this.deleteGuild(client, {
      name: guild.name,
      guildId: guild.id,
      avatar: guild.icon as string,
    })
  }

  private async deleteGuild(
    client: Client,
    guild: KeysToCamelCase<PynspelGuild>
  ) {
    try {
      const res = await this._db.deleteGuild(guild)

      return res
    } catch (error) {
      if (env.NODE_ENV === 'developement') {
        return console.log(
          `Should leave the guild in production ${guild.guildId}`,
          error
        )
      }

      const _guild = await client.guilds.fetch(guild.guildId)
      await _guild.leave()
    }
  }
}
