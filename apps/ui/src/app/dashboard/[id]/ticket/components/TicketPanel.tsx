import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MouseEvent, useState } from 'react'
import { Modal } from '~/app/dashboard/components/modals/Modal'
import { Flex } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { ButtonDanger, ButtonOutline } from '~/ui/button/Button'
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
  const [open, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const { deletePanel } = usePanelMutations()

  const handleOpenPanel = () => {
    router.push(
      `/dashboard/${currentGuild?.guild_id}/ticket/panels/${panel.id}`
    )
  }

  const handleDeletePanel = () => deletePanel.mutate(panel.id)

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const handleAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleDeletePanel()
    setIsOpen(false)
  }

  return (
    <Flex
      onClick={handleOpenPanel}
      className={css({
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'news.backgrounds.tertiary',
        padding: '20px',
        marginTop: '10px',
        cursor: 'pointer',
        transition: '.3s',
        border: 'news.grey',
      })}
    >
      <Typography as="span">{panel.name}</Typography>
      <Flex className={css({ gap: '10px' })}>
        <Trash
          strokeWidth={1}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          size={20}
          className={css({ color: 'red.500' })}
        />
      </Flex>

      {open ? (
        <Modal>
          <Modal.Header title={`Souhaitez-vous réellement supprimer ?`} />
          <Modal.Footer>
            <ButtonOutline onClick={handleCancel}>
              {t('actions.cancel')}
            </ButtonOutline>
            <ButtonDanger onClick={handleAction}>
              {t('actions.delete')}
            </ButtonDanger>
          </Modal.Footer>
        </Modal>
      ) : null}
    </Flex>
  )
}

export { TicketPanel }
