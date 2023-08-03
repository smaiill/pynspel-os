import React from 'react'
import { Flex } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'
import { AiOutlineDelete } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import { selectedGuild } from '~/proxys/dashboard'

type TicketPanel = {
  name: string
  id: string
  message: string
}

type TicketPanelProps = {
  panel: TicketPanel
}

const style = css({})

const TicketPanel = ({ panel }: TicketPanelProps) => {
  const currentGuild = selectedGuild.guild
  const router = useRouter()

  const handleOpenPanel = () => {
    console.log(router)
    router.push(
      `/dashboard/${currentGuild?.guild_id}/ticket/panels/${panel.id}`
    )
  }

  return (
    <Flex
      onClick={handleOpenPanel}
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1F1F1F',
        padding: '20px',
        borderRadius: '5px',
        marginTop: '10px',
      }}
    >
      <Typography typography="span">{panel.name}</Typography>
      <AiOutlineDelete color="red" size={20} />
    </Flex>
  )
}

export { TicketPanel }
