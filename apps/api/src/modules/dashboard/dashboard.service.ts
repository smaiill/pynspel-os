import { DiscordGuild, SavedGuild } from '@pynspel/types'
import { pool } from 'modules/db/pool'
import { env } from 'utils/env'

class _DashboardService {
  public async fetchUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    const response = await fetch(
      'https://discord.com/api/v10/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return await response.json()
  }

  public async fetchClientGuilds(): Promise<DiscordGuild[]> {
    const response = await fetch(
      'https://discord.com/api/v10/users/@me/guilds',
      {
        headers: {
          Authorization: `Bot ${env.CLIENT_TOKEN}`,
        },
      }
    )

    return await response.json()
  }

  public async fetchMutualGuilds(accessToken: string) {
    const userGuilds = await this.fetchUserGuilds(accessToken)
    const botGuilds = await this.fetchClientGuilds()

    const adminUserGuilds = userGuilds.filter(
      ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    )

    const mutualGuilds = adminUserGuilds.filter((guild) =>
      botGuilds.some((botGuild) => botGuild.id === guild.id)
    )

    return mutualGuilds
  }

  public async getGuildConfiguration(guildId: string): Promise<SavedGuild> {
    const query = 'SELECT * FROM guilds WHERE guild_id = $1'
    const values = [guildId]

    const res = await pool?.query(query, values)

    return res?.rows[0]
  }
}

export const DashboardService = new _DashboardService()
