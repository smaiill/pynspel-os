import {
  ApiGuild,
  DiscordGuild,
  RedisUserGuild,
  SavedGuild,
} from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
import { clientService } from 'modules/client/client.service'
import { db } from 'modules/db'
import { guildService } from 'modules/services/guild.service'
import { DiscordRoutes } from 'utils/constants'
import { redis } from 'utils/redis'

export type FetchUserGuilds =
  | { cache: false; guilds: DiscordGuild[] }
  | { cache: true; guilds: RedisUserGuild[] }
class _DashboardService {
  _clientService = clientService
  _guildService = guildService

  public async fetchUserGuilds(
    accessToken: string,
    userId: string
  ): Promise<FetchUserGuilds> {
    const userCachedGuilds = await redis.user.getGuilds(userId)
    console.log({ userCachedGuilds })
    if (!userCachedGuilds) {
      const response = await fetch(DiscordRoutes.USERS_GUILDS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const userGuilds = await response.json()

      redis.user.setGuilds(userId, userGuilds)

      return { cache: false, guilds: userGuilds }
    }

    return { cache: true, guilds: userCachedGuilds }
  }

  private isAdmin(permissions: string) {
    return (parseInt(permissions) & 0x8) === 0x8
  }

  public async fetchMutualGuilds(
    accessToken: string,
    userId: string
  ): Promise<DiscordGuild[]> {
    const { cache, guilds } = await this.fetchUserGuilds(accessToken, userId)

    console.log({ cache, guilds })
    if (cache) {
      const guildsWithData = [] as DiscordGuild[]

      for (const cachedGuild of guilds) {
        const isAdminOrOwner = this.isAdmin(cachedGuild.permissions)

        if (isAdminOrOwner) {
          const [dbGuild] = await db.exec<{
            name: string
            avatar: string
          }>('SELECT name, avatar FROM guilds WHERE guild_id = $1', [
            cachedGuild.id,
          ])

          if (dbGuild) {
            guildsWithData.push({
              features: [],
              icon: dbGuild.avatar,
              id: cachedGuild.id,
              name: dbGuild.name,
              owner: cachedGuild.owner,
              permissions: cachedGuild.permissions,
            })
          }
        }
      }

      return guildsWithData
    } else {
      const userAdminGuilds = guilds.filter(
        ({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
      )

      const mutualGuilds = await this._clientService.getMutualGuilds(
        userAdminGuilds
      )

      return mutualGuilds
    }
  }

  public async getCachedChannelsOrFresh(guildId: string) {
    const cachedChannels = await redis.guild.getChannels(guildId)

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

    await redis.guild.setChannels(guildId, formatedChannels)

    return formatedChannels
  }

  public async getCachedRolesOrFresh(guildId: string) {
    const cachedRoles = await redis.guild.getRoles(guildId)

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

    await redis.guild.setRoles(guildId, formatedRoles)

    return formatedRoles
  }

  public async getGuildConfiguration(guildId: string): Promise<ApiGuild> {
    const query =
      'SELECT id, guild_id, name, avatar, bot, plan FROM guilds WHERE guild_id = $1'
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

  public async getGuildFromDatabaseIfBotIn(guildId: string) {
    const query = 'SELECT * FROM guilds WHERE guild_id = $1 AND bot = $2'
    const values = [guildId, true]

    const [guild] = await db.exec<SavedGuild>(query, values)

    if (!guild) {
      return null
    }

    return guild
  }

  public async userHasPermissionsCachedOrFresh({
    userId,
    guildId,
    accessToken,
  }: {
    userId: string
    guildId: string
    accessToken: string
  }) {
    const { guilds } = await this.fetchUserGuilds(accessToken, userId)

    const guild = guilds.find((guild) => guild.id === guildId)

    if (!guild) {
      return false
    }

    return guild.owner || this.isAdmin(guild.permissions)
  }
}

export const DashboardService = new _DashboardService()
