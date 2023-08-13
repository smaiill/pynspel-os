import { ApiGuild, DiscordGuild, SavedGuild } from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
import { clientService } from 'modules/client/client.service'
import { db } from 'modules/db'
import { guildService } from 'modules/services/guild.service'
import { DiscordRoutes } from 'utils/constants'
import { env } from 'utils/env'
import { redis } from 'utils/redis'

class _DashboardService {
  _clientService = clientService
  _guildService = guildService

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

  public async getCachedChannelsOrFresh(guildId: string) {
    const cachedChannels = await redis.getChannels(guildId)

    if (cachedChannels) {
      return cachedChannels
    }

    const channels = await this._guildService.fetchChannels(guildId)

    const formatedChannels = channels
      .filter((channel) =>
        [
          ChannelType.GuildText,
          ChannelType.GuildVoice,
          ChannelType.GuildCategory,
        ].includes(channel.type)
      )
      .map((_channel) => {
        return {
          id: _channel.id,
          type: _channel.type,
          guild_id: _channel.guild_id,
          name: _channel.name,
        }
      })

    await redis.setChannels(guildId, formatedChannels)

    return formatedChannels
  }

  public async getCachedRolesOrFresh(guildId: string) {
    const cachedRoles = await redis.getRoles(guildId)

    if (cachedRoles) {
      return cachedRoles
    }

    const roles = await this._guildService.fetchRoles(guildId)

    const formatedRoles = roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        permissions: role.permissions,
        color: role.color,
      }
    })

    await redis.setRoles(guildId, formatedRoles)

    return formatedRoles
  }

  public async getGuildConfiguration(guildId: string): Promise<ApiGuild> {
    const query = 'SELECT * FROM guilds WHERE guild_id = $1'
    const values = [guildId]

    const channels = await this.getCachedChannelsOrFresh(guildId)
    const roles = await this.getCachedRolesOrFresh(guildId)

    const [res] = await db.exec<SavedGuild>(query, values)

    return {
      ...res,
      channels,
      roles,
    }
  }
}

export const DashboardService = new _DashboardService()
