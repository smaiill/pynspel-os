import { PropsWithChildren } from 'react'
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

  if (isLoading) {
    return <LoadingModule />
  }

  if (!guildData) {
    return <LoadingModule />
  }

  return children
}
