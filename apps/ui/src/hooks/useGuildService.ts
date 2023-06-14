import { DiscordGuild, SavedGuild } from '@pynspel/types'
import { fetchApi } from '~/utils/fetchApi'

export const useGuildService = () => {
  const getMutualGuilds = async () => {
    return await fetchApi<DiscordGuild[]>('/api/dashboard/guilds')
  }

  const getGuild = async ({ guildId }: { guildId: bigint }) => {
    return await fetchApi<SavedGuild>(`/api/dashboard/guilds/${guildId}`)
  }

  return { getGuild, getMutualGuilds }
}
