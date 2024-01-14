import { pxToast } from '~/app/dashboard/components/toast/toast-handler'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPremium } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'
import { usePremiumMutations } from '../hooks/usePremiumMutations'
import { PremiumTable } from './PremiumTable'

export const PremiumChoices = ({ guildId }: { guildId: string }) => {
  const { createCheckoutSession } = usePremiumMutations()
  const { t } = useTranslation()

  const handleClick = async (priceId: string, guildId: string) => {
    try {
      const res = await createCheckoutSession.mutateAsync({ priceId, guildId })
      window.open(res.session, '_self')
    } catch (error) {
      pxToast('error', t('errors.E_GENERIC'))
    }
  }
  return (
    <FlexColumn className={css({ w: '95%', overflowX: 'auto' })}>
      <Typography className={css({ mt: '20px' })} as="h3">
        Emmenez Pynspel dans une nouvelle aventure
      </Typography>

      <Typography
        as="span"
        color="secondary"
        className={css({ mt: '10px', mb: '20px' })}
      >
        Imaginez votre serveur Discord actuel, juste 10 fois clair et plus
        facile pour les membres d'interagir, de socialiser et de jouer.
      </Typography>

      <PremiumTable />

      <ButtonPremium
        onClick={() =>
          handleClick(process.env.MONTHLY_PRICE_ID as string, guildId)
        }
        className={css({ alignSelf: 'right', width: 'fit-content', mt: '8px' })}
      >
        Acheter
      </ButtonPremium>
    </FlexColumn>
  )
}
