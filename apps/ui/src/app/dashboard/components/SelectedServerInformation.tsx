import { ChannelType } from 'discord-api-types/v10'
import Image from 'next/image'
import { DashboardCard } from '~/layouts/Dashboard'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'
import { SkeletonBox } from './Skeletons'

const topStyle = css({
  gap: '10px',
  alignItems: 'center',
  '& img': {
    rounded: '10px',
  },
})

const SelectedServerInformation = () => {
  const currentGuild = useCurrentGuildValue()

  if (!currentGuild) {
    return <SkeletonBox />
  }

  return (
    <DashboardCard style={{ marginTop: 10, padding: 20 }}>
      <FlexColumn style={{ gap: 20 }}>
        <Flex className={topStyle}>
          <Image src="/pubg.png" width={100} height={100} alt="server-logo" />
          <FlexColumn>
            <Typography color="secondary" as="h3">
              {currentGuild.name}
            </Typography>
          </FlexColumn>
        </Flex>
        <Flex style={{ gap: 50, flexWrap: 'wrap' }}>
          <Typography color="secondary" as="span">
            Text Chanels:{' '}
            {
              currentGuild.channels.filter(
                (channel) => channel.type === ChannelType.GuildText
              ).length
            }
          </Typography>
          <Typography color="secondary" as="span">
            Voice Chanels:{' '}
            {
              currentGuild.channels.filter(
                (channel) => channel.type === ChannelType.GuildVoice
              ).length
            }
          </Typography>
          <Typography color="secondary" as="span">
            Categories:{' '}
            {
              currentGuild.channels.filter(
                (channel) => channel.type === ChannelType.GuildCategory
              ).length
            }
          </Typography>
          <Typography color="secondary" as="span">
            Roles: {currentGuild.roles.length}
          </Typography>
        </Flex>
      </FlexColumn>
    </DashboardCard>
  )
}

export { SelectedServerInformation }
