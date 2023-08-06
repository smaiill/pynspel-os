import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { Flex } from '~/layouts/Flex'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'
import { usePanelMutations } from '../panels/hooks/usePanelMutations'

type TicketPanel = {
  name: string
  id: string
  message: string
}

type TicketPanelProps = {
  panel: TicketPanel
}

const TicketPanel = ({ panel }: TicketPanelProps) => {
  const currentGuild = useCurrentGuildValue()
  const router = useRouter()
  const { deletePanel } = usePanelMutations()

  const handleOpenPanel = () => {
    router.push(
      `/dashboard/${currentGuild?.guild_id}/ticket/panels/${panel.id}`
    )
  }

  const handleDeletePanel = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation()

    deletePanel.mutate(panel.id)
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
      <AiOutlineDelete onClick={handleDeletePanel} color="red" size={20} />
    </Flex>
  )
}

export { TicketPanel }
