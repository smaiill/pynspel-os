'use client'
import { MainHeader } from '~/components/header/main/MainHeader'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useUserGuildsSnapshot } from '~/proxys/user'
import { Input } from '~/ui/input/Input'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { ServerCard } from './components/ServerCard'

const page = () => {
  const userGuildsSnapshot = useUserGuildsSnapshot()
  const { t } = useTranslation()

  return (
    <>
      <MainHeader />

      <FlexColumn
        style={{
          flex: 1,
          height: '100vh',
          padding: 60,
        }}
      >
        <Flex
          className={css({
            flexWrap: 'wrap',
            columnGap: '30px',
            rowGap: '10px',
          })}
        >
          <Typography as="h1">Select a guild</Typography>

          <Input
            placeholder="Filter guilds..."
            classNameWrapper={css({ maxW: '400px' })}
          />
        </Flex>

        <Flex
          style={{
            marginTop: 30,
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
