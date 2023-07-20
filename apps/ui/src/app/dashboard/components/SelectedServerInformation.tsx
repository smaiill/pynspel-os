import Image from 'next/image'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { Typography } from '~/ui/typography/Typography'

const SelectedServerInformation = () => {
  const guildSnapshot = useSelectedGuildSnapshot()

  return (
    <Flex
      style={{
        height: 125,
        width: '100%',
        backgroundColor: '#191919',
        marginTop: 20,
        borderRadius: 10,
        alignItems: 'center',
        padding: '0 50px',
      }}
    >
      <Flex
        style={{
          gap: 10,
          alignItems: 'center',
        }}
      >
        <Image
          alt="server-image"
          width={70}
          height={70}
          style={{
            borderRadius: 15,
          }}
          src={'/pubg.png'}
          // src={`https://cdn.discordapp.com/icons/${guildSnapshot.guild.guild_id}/${guildSnapshot.guild.avatar}.png`}
        />
        <FlexColumn>
          <Typography typography="h3">{guildSnapshot?.guild?.name}</Typography>
          <Typography color="secondary" typography="span">
            NX est le meilleur serveur au monde !
          </Typography>
        </FlexColumn>
      </Flex>
    </Flex>
  )
}

export { SelectedServerInformation }
