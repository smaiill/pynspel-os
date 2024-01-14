import { ApiGuild, DiscordGuild } from '@pynspel/types'
import { fetchApi } from '~/utils/fetchApi'

export const useGuildService = () => {
  const getMutualGuilds = async () => {
    return fetchApi<DiscordGuild[]>('/api/v1/dashboard/guilds')
  }

  const getGuild = async ({ guildId }: { guildId: string }) => {
    return fetchApi<ApiGuild & { isOwner: boolean }>(
      `/api/v1/dashboard/guilds/${guildId}`
    )
  }

  const getServingGuilds = async () => {
    return fetchApi<{ count: number }>('/api/v1/client/serving-guilds')
  }

  return { getGuild, getMutualGuilds, getServingGuilds }
}
