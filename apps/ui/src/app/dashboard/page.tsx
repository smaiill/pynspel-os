'use client'
import { useMemo, useState } from 'react'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { HeaderAndFooterLayout } from '~/layouts/HeaderAndFooterLayout'
import { useUserGuildsSnapshot } from '~/proxys/user'
import { Input } from '~/ui/input/Input'
import { css } from '../../../styled-system/css'
import { ServerCard } from './components/ServerCard'

const page = () => {
  const userGuildsSnapshot = useUserGuildsSnapshot()
  const [filter, setFilter] = useState('')

  const filteredGuilds = useMemo(() => {
    if (filter.trim() === '') {
      return userGuildsSnapshot.guilds
    }

    return userGuildsSnapshot.guilds.filter((guild) =>
      guild.name.toLowerCase().includes(filter.trim().toLowerCase())
    )
  }, [filter, userGuildsSnapshot.guilds])

  return (
    <HeaderAndFooterLayout>
      <FlexColumn
        style={{
          flex: 1,
          height: '100vh',
          padding: 20,
        }}
      >
        <Flex
          className={css({
            flexWrap: 'wrap',
            columnGap: '30px',
            rowGap: '10px',
          })}
        >
          <Input
            placeholder="Filter guilds..."
            classNameWrapper={css({ maxW: '400px' })}
            onChange={(e) => setFilter(e.target.value.trim())}
          />
        </Flex>

        <Flex
          style={{
            marginTop: 30,
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {filteredGuilds.map((_guild) => (
            <ServerCard key={_guild.id} {..._guild} />
          ))}
        </Flex>
      </FlexColumn>
    </HeaderAndFooterLayout>
  )
}

export default page
