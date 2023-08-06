'use client'
import { MainHeader } from '~/components/header/main/MainHeader'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useUserGuildsSnapshot } from '~/proxys/user'
import { Typography } from '~/ui/typography/Typography'
import { ServerCard } from './components/ServerCard'

const page = () => {
  const userGuildsSnapshot = useUserGuildsSnapshot()

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
        <Typography typography="h1">Select a server !</Typography>

        <Flex
          style={{
            marginTop: 75,
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {userGuildsSnapshot.guilds.map((_guild) => (
            <ServerCard key={_guild.id} {..._guild} />
          ))}
        </Flex>
      </FlexColumn>
    </>
  )
}

export default page
