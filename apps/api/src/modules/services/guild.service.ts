import { DiscordRoutes } from 'utils/constants'
import { env } from 'utils/env'
import {
  APIChannel,
  APIGuildChannel,
  APIUser,
  ChannelType,
  GuildChannelType,
} from 'discord-api-types/v10'

class _GuildService {
  public async fetchChannels(guildId: string) {
    const uri = `https://discord.com/api/v10/guilds/${guildId}/channels`
    const response = await fetch(uri, {
      headers: {
        Authorization: `Bot ${env.CLIENT_TOKEN}`,
      },
    })

    return await response.json()
  }

  public async fetchRoles(guildId: string) {
    const uri = `https://discord.com/api/v10/guilds/${guildId}/roles`
    const response = await fetch(uri, {
      headers: {
        Authorization: `Bot ${env.CLIENT_TOKEN}`,
      },
    })

    return await response.json()
  }
}

export const guildService = new _GuildService()
