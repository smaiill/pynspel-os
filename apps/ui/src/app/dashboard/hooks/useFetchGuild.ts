import { useQuery } from '@tanstack/react-query'
import { useGuildService } from '~/hooks/useGuildService'
import { selectedGuild } from '~/proxys/dashboard'

export const useFetchGuild = (guildId: string) => {
  const { getGuild } = useGuildService()

  return useQuery({
    queryKey: ['guild', guildId],
    queryFn: async () => {
      return await getGuild({ guildId })
    },
    onSuccess(guild) {
      selectedGuild.guild = guild
    },
  })
}
