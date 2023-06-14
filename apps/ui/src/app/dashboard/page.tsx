'use client'
import { DiscordGuild } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import { MainHeader } from '~/components/header/main/MainHeader'
import { useGuildService } from '~/hooks/useGuildService'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { ServerCard } from './components/ServerCard'

const page = () => {
  const { getMutualGuilds } = useGuildService()
  const { data, error, isLoading, isLoadingError } = useQuery<DiscordGuild[]>({
    queryKey: ['guilds'],
    queryFn: getMutualGuilds,
  })

  if (isLoading) return 'Loading...'
  if (error || isLoadingError) return `An error has occurred: ${error}`

  return (
    <>
      <MainHeader />
      <FlexColumn
        style={{
          flex: 1,
          height: '100vh',
          alignItems: 'center',
          padding: 50,
        }}
      >
        <Typography variant="h1">Select a server !</Typography>

        <Flex
          style={{
            marginTop: 75,
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {data.map((_guild) => (
            <ServerCard key={_guild.id} {..._guild} />
          ))}
        </Flex>
      </FlexColumn>
    </>
  )
}

export default page
