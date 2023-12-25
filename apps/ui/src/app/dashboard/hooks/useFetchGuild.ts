import { useQuery } from '@tanstack/react-query'
import { useGuildService } from '~/hooks/useGuildService'
import { useSetCurrentGuild } from '~/proxys/dashboard'

// TODO: This needs to be called only from the /dashboard/:guildId page.
export const useFetchGuild = (guildId: string) => {
  const { getGuild } = useGuildService()
  const setCurrentGuild = useSetCurrentGuild()

  return useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => getGuild({ guildId }),
    onSuccess(guild) {
      setCurrentGuild(guild)
    },
  })
}
