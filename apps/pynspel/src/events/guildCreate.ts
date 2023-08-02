import { BaseEvent } from '@pynspel/px'
import { KeysToCamelCase, Guild as PynspelGuild } from '@pynspel/types'
import { db } from 'db'
import {
  Client,
  Guild,
  PermissionFlagsBits,
  RouteBases,
  Routes,
  SlashCommandBuilder,
  Snowflake,
} from 'discord.js'
import { env } from 'utils/env'

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
