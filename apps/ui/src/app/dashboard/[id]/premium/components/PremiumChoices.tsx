import { FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../../../styled-system/css'
import { PremiumCards } from './PremiumCards'

export const PremiumChoices = () => {
  return (
    <FlexColumn>
      <Typography className={css({ mt: '20px' })} as="h3" color="secondary">
        Emmenez Pynspel dans une nouvelle aventure
      </Typography>

      <Typography as="span" color="secondary">
        Imaginez votre serveur Discord actuel, juste 10 fois clair et plus
        facile pour les membres d'interagir, de socialiser et de jouer.
      </Typography>
      <PremiumCards className={css({ mt: '40px' })} />
    </FlexColumn>
  )
}
