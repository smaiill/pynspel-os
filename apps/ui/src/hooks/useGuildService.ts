import { DiscordGuild, SavedGuild } from '@pynspel/types'
import { fetchApi } from '~/utils/fetchApi'

export const useGuildService = () => {
  const getMutualGuilds = async () => {
    return fetchApi<DiscordGuild[]>('/api/dashboard/guilds')
  }

  const getGuild = async ({ guildId }: { guildId: string }) => {
    return fetchApi<SavedGuild>(`/api/dashboard/guilds/${guildId}`)
  }

  const getServingGuilds = async () => {
    return fetchApi<{ count: number }>('/api/client/serving-guilds')
  }

  return { getGuild, getMutualGuilds, getServingGuilds }
}
