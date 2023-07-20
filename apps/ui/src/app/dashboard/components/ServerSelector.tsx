import Image from 'next/image'
import { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { useUserGuildsSnapshot } from '~/proxys/user'
import { css } from '../../../../styled-system/css'

const styles = css({
  width: '100%',
  marginTop: '15px',
  padding: '15px',
  borderRadius: '5px',
  color: 'white',
  alignItems: 'center',
  backgroundColor: '#1f1f1f',
  pos: 'relative',

  '& .left': {
    gap: '10px',
    alignItems: 'center',

    '& img': {
      borderRadius: '10px',
    },
  },
})

const ServerSelector = () => {
  const [open, setOpen] = useState(false)
  const guildsSnapshot = useUserGuildsSnapshot()
  const selectedGuild = useSelectedGuildSnapshot()

  const handleToggle = () => {
    setOpen((prevV) => !prevV)
  }

  return (
    <div className={styles}>
      <Flex
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={handleToggle}
      >
        <Flex>
          <Image
            alt="server-image"
            width={30}
            height={30}
            // src={
            //   'https://cdn.discordapp.com/icons/816667805566500896/631b520785f83d9fa703df65ed2e1b07.jpg'
            // }
            src={'/pubg.png'}
          />
          <span>NX</span>
        </Flex>
        <BiChevronDown />
      </Flex>

      {open ? (
        <FlexColumn
          style={{
            position: 'absolute',
            marginTop: '20px',
            backgroundColor: '#1f1f1f',
            width: '100%',
            left: 0,
            padding: '15px',
          }}
        >
          {guildsSnapshot.guilds.map((_guild) => {
            return selectedGuild.guild.guild_id === _guild.id ? null : (
              <h1 key={_guild.id}>{_guild.id}</h1>
            )
          })}
        </FlexColumn>
      ) : null}
    </div>
  )
}

export default ServerSelector
