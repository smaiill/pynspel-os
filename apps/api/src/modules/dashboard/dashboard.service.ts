import { DiscordGuild, SavedGuild } from '@pynspel/types'
import { clientService } from 'modules/client/client.service'
import { db } from 'modules/db'
import { DiscordRoutes } from 'utils/constants'
import { env } from 'utils/env'

class _DashboardService {
  _clientService = clientService

  public async fetchUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    if (env.NODE_ENV === 'developement') {
      return [
        {
          id: '974775347553906718',
          name: 'dev serv',
          icon: 'c7fb03b4e32c68b3f28c216c5c58cd86',
          owner: true,
          permissions: '140737488355327',
          features: [],
        },
      ]
    }
    const response = await fetch(DiscordRoutes.USERS_GUILDS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return await response.json()
  }

  public async fetchMutualGuilds(accessToken: string) {
    const userGuilds = await this.fetchUserGuilds(accessToken)
    const mutualGuilds = await this._clientService.getMutualGuilds(userGuilds)

    const mutualAdminGuilds = mutualGuilds.filter(
      ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    )

    return mutualAdminGuilds
  }

  public async getGuildConfiguration(
    guildId: string
  ): Promise<SavedGuild & { channels: { name: string; id: string }[] }> {
    const query = 'SELECT * FROM guilds WHERE guild_id = $1'
    const values = [guildId]

    const [res] = await db.exec<SavedGuild>(query, values)

    return {
      ...res,
      channels: [
        { name: 'general', id: '974775347553906721' },
        { name: 'qzd', id: '974776745670606898' },
      ],
    }
  }
}

export const DashboardService = new _DashboardService()
