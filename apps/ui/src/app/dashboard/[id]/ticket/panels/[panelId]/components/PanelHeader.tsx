import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { ButtonSpecial } from '~/ui/button/Button'
import { usePanelMutations } from '../../hooks/usePanelMutations'

type PanelHeaderProps = {
  panelId: string
}

export const PanelHeader = (props: PanelHeaderProps) => {
  const { panelId } = props

  const { sendPanel } = usePanelMutations()

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
        Send panel
      </ButtonSpecial>
    </header>
  )
}
