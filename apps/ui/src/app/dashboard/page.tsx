'use client'
import { MainHeader } from '~/components/header/main/MainHeader'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useUserGuildsSnapshot } from '~/proxys/user'
import { Typography } from '~/ui/typography/Typography'
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
          alignItems: 'center',
          padding: 50,
        }}
      >
        <Typography as="h1">{t('pages.dashboard.select_a_server')}</Typography>

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
