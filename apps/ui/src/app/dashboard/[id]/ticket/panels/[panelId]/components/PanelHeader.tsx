import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { useTranslation } from '~/locales/Provider'
import { ButtonSpecial } from '~/ui/button/Button'
import { usePanelMutations } from '../../hooks/usePanelMutations'

type PanelHeaderProps = {
  panelId: string
}

export const PanelHeader = (props: PanelHeaderProps) => {
  const { panelId } = props

  const { sendPanel } = usePanelMutations()
  const { t } = useTranslation()

  const handleSubmit = () => {
    sendPanel
      .mutateAsync(panelId)
      .then(() => pxToast('success', 'Votre panel a était envoyer.'))
      .catch((err) => {
        console.error(err)
        pxToast('error', "Erreur lors de l'envoie de votre panel.")
      })
  }

  return (
    <header>
      <ButtonSpecial onClick={handleSubmit} style={{ float: 'right' }}>
        {t('modules.ticket.panel.interactions.create')}
      </ButtonSpecial>
    </header>
  )
}
