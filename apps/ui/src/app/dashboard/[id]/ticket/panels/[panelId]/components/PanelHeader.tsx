import { ArrowLeft } from 'lucide-react'
import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { CustomLink } from '~/components/Link'
import { useTranslation } from '~/locales/Provider'
import { ButtonSuccess } from '~/ui/button/Button'
import { css } from '../../../../../../../../styled-system/css'
import { usePanelMutations } from '../../hooks/usePanelMutations'

type PanelHeaderProps = {
  panelId: string
  guildId: string
}

export const PanelHeader = (props: PanelHeaderProps) => {
  const { panelId, guildId } = props

  const { sendPanel } = usePanelMutations()
  const { t } = useTranslation()

  const handleSubmit = () => {
    sendPanel
      .mutateAsync(panelId)
      .then(() => pxToast('success', t('common.operation.success')))
      .catch(() => {
        pxToast('error', t('errors.E_GENERIC'))
      })
  }

  return (
    <header
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      <CustomLink
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: 'news.fonts.label',
          _hover: {
            color: 'news.fonts.primary',
          },
        })}
        href={`/dashboard/${guildId}/ticket`}
      >
        <ArrowLeft size={15} />
        {t('common.back')}
      </CustomLink>
      <ButtonSuccess onClick={handleSubmit}>
        {t('modules.ticket.panel.send_to_channel')}
      </ButtonSuccess>
    </header>
  )
}
