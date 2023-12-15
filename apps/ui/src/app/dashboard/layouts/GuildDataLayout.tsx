import { PropsWithChildren, useEffect } from 'react'
import { useSetCurrentGuild } from '~/proxys/dashboard'
import { LoadingModule } from '../components/LoadingModule'
import { useFetchGuild } from '../hooks/useFetchGuild'

export const GuildDataLayout = ({
  children,
  params,
}: PropsWithChildren<{
  params: {
    id: string
  }
}>) => {
  const { data: guildData, isLoading } = useFetchGuild(params.id)

  const setCurrentGuild = useSetCurrentGuild()

  console.log({ guildData })
  useEffect(() => {
    if (guildData) {
      setCurrentGuild(guildData)
    }
  }, [guildData])

  if (isLoading) {
    return <LoadingModule />
  }

  if (!guildData) {
    return <LoadingModule />
  }

  return children
}
